import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DSA_CATALOG } from "../data/dsaCatalog";
import { DAY_SCHEDULE } from "../data/daySchedule";
import { PROJECT_READINESS_FIELDS, PROJECT_NOTES_FIELDS } from "../data/projectCatalog";
import { SYSTEMS, SYSTEM_DESIGN_SECTIONS } from "../data/systemDesignCatalog";

import { MISTAKE_TYPES } from "../utils/analytics";
import { toDateKey } from "../utils/date";
import { newId } from "../utils/id";
import { calcNextReviewDateKey, clampConfidence } from "../utils/spacedRepetition";

const STORAGE_KEY = "sde_prep_engine";
const STORAGE_VERSION = 2;

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const storage = createJSONStorage(() =>
  typeof window !== "undefined" ? window.localStorage : noopStorage,
);

const clampInt = (n, min, max) => {
  const v = Number.isFinite(Number(n)) ? Number(n) : min;
  return Math.max(min, Math.min(max, Math.round(v)));
};

const buildInitialDsaProblems = () => {
  const out = {};
  for (const topic of DSA_CATALOG) {
    for (const sub of topic.subtopics) {
      for (const pat of sub.patterns) {
        for (const p of pat.problems) {
          out[p.id] = {
            id: p.id,
            name: p.name,
            difficulty: p.difficulty,
            pattern: p.pattern,
            confidence: 0,
            lastAttempted: null,
            mistakes: [],
            revisitSchedule: { nextReviewDate: null },
          };
        }
      }
    }
  }
  return out;
};

const buildInitialSystemDesign = () => {
  const systemsById = {};
  for (const s of SYSTEMS) {
    const sections = {};
    for (const sec of SYSTEM_DESIGN_SECTIONS) {
      sections[sec.key] = { confidence: 0, notes: "" };
    }
    systemsById[s.id] = { id: s.id, name: s.name, sections };
  }
  return { systemsById };
};

const buildInitialProject = () => {
  const readiness = {};
  for (const f of PROJECT_READINESS_FIELDS) readiness[f.key] = 0;
  const notes = {};
  for (const f of PROJECT_NOTES_FIELDS) notes[f.key] = "";
  return {
    itemsChecked: {},
    readiness,
    notes,
  };
};

const buildInitialState = () => ({
  schemaVersion: STORAGE_VERSION,
  ui: {
    activeTab: "dashboard",
    showDaySlider: false,
    interviewMode: false,
  },
  currentDay: 1,
  weeklyEntries: {},
  dsa: {
    problemsById: buildInitialDsaProblems(),
  },
  systemDesign: buildInitialSystemDesign(),
  project: buildInitialProject(),
  revision: {
    checked: {},
    expanded: {},
  },
  mocks: {
    sessions: [],
  },
  behavioral: {
    stories: [],
  },
  activity: {
    byDate: {},
  },
});

export const usePrepStore = create(
  persist(
    (set, get) => ({
      ...buildInitialState(),

      actions: {
        // ── UI ──────────────────────────────────────────────────────────────
        setActiveTab: (tab) =>
          set((state) => ({ ui: { ...state.ui, activeTab: tab } })),
        toggleInterviewMode: () =>
          set((state) => ({ ui: { ...state.ui, interviewMode: !state.ui.interviewMode } })),
        toggleDaySlider: () =>
          set((state) => ({ ui: { ...state.ui, showDaySlider: !state.ui.showDaySlider } })),
        setCurrentDay: (day) =>
          set(() => ({ currentDay: clampInt(day, 1, DAY_SCHEDULE.length) })),

        // ── Weekly summary ───────────────────────────────────────────────────
        setWeeklyEntry: (week, field, value) =>
          set((state) => ({
            weeklyEntries: {
              ...state.weeklyEntries,
              [week]: { ...(state.weeklyEntries[week] || {}), [field]: value },
            },
          })),

        // ── Revision ────────────────────────────────────────────────────────
        toggleRevisionChecked: (key) =>
          set((state) => ({
            revision: {
              ...state.revision,
              checked: { ...state.revision.checked, [key]: !state.revision.checked[key] },
            },
          })),
        toggleRevisionExpanded: (key) =>
          set((state) => ({
            revision: {
              ...state.revision,
              expanded: { ...state.revision.expanded, [key]: !state.revision.expanded[key] },
            },
          })),

        // ── Project ─────────────────────────────────────────────────────────
        toggleProjectItem: (key) =>
          set((state) => ({
            project: {
              ...state.project,
              itemsChecked: { ...state.project.itemsChecked, [key]: !state.project.itemsChecked[key] },
            },
          })),
        setProjectReadiness: (field, value) =>
          set((state) => ({
            project: {
              ...state.project,
              readiness: { ...state.project.readiness, [field]: clampConfidence(value) },
            },
          })),
        setProjectNote: (field, value) =>
          set((state) => ({
            project: {
              ...state.project,
              notes: { ...state.project.notes, [field]: value },
            },
          })),

        // ── DSA ─────────────────────────────────────────────────────────────
        setProblemConfidence: (problemId, confidence) =>
          set((state) => {
            const prev = state.dsa.problemsById[problemId];
            if (!prev) return state;
            return {
              dsa: {
                ...state.dsa,
                problemsById: {
                  ...state.dsa.problemsById,
                  [problemId]: { ...prev, confidence: clampConfidence(confidence) },
                },
              },
            };
          }),

        logProblemAttempt: (problemId, { confidence, mistakeTypes = [], note = "" } = {}) =>
          set((state) => {
            const prev = state.dsa.problemsById[problemId];
            if (!prev) return state;

            const todayKey = toDateKey();
            const nextConfidence = clampConfidence(
              confidence === undefined || confidence === null ? prev.confidence : confidence,
            );
            const normalizedMistakes = Array.from(
              new Set((mistakeTypes || []).filter((t) => MISTAKE_TYPES.includes(t))),
            );
            const mistakesToAdd = normalizedMistakes.map((t) => ({
              id: newId("mistake"),
              type: t,
              note,
              createdAt: new Date().toISOString(),
            }));
            const nextReviewDate = calcNextReviewDateKey({
              confidence: nextConfidence,
              mistakeCount: mistakesToAdd.length,
              fromDateKey: todayKey,
            });
            const updated = {
              ...prev,
              confidence: nextConfidence,
              lastAttempted: todayKey,
              mistakes: [...(prev.mistakes || []), ...mistakesToAdd],
              revisitSchedule: { nextReviewDate },
            };
            const prevDay = state.activity.byDate[todayKey] || { attempts: 0, mistakes: 0, mocks: 0, behavioral: 0 };
            return {
              dsa: { ...state.dsa, problemsById: { ...state.dsa.problemsById, [problemId]: updated } },
              activity: {
                ...state.activity,
                byDate: {
                  ...state.activity.byDate,
                  [todayKey]: { ...prevDay, attempts: (prevDay.attempts || 0) + 1, mistakes: (prevDay.mistakes || 0) + mistakesToAdd.length },
                },
              },
            };
          }),

        // ── System Design ────────────────────────────────────────────────────
        setSystemSectionConfidence: (systemId, sectionKey, confidence) =>
          set((state) => {
            const sys = state.systemDesign.systemsById[systemId];
            if (!sys) return state;
            return {
              systemDesign: {
                ...state.systemDesign,
                systemsById: {
                  ...state.systemDesign.systemsById,
                  [systemId]: {
                    ...sys,
                    sections: {
                      ...sys.sections,
                      [sectionKey]: { ...(sys.sections?.[sectionKey] || {}), confidence: clampConfidence(confidence) },
                    },
                  },
                },
              },
            };
          }),
        setSystemSectionNotes: (systemId, sectionKey, notes) =>
          set((state) => {
            const sys = state.systemDesign.systemsById[systemId];
            if (!sys) return state;
            return {
              systemDesign: {
                ...state.systemDesign,
                systemsById: {
                  ...state.systemDesign.systemsById,
                  [systemId]: {
                    ...sys,
                    sections: {
                      ...sys.sections,
                      [sectionKey]: { ...(sys.sections?.[sectionKey] || {}), notes },
                    },
                  },
                },
              },
            };
          }),

        // ── Mock Interviews ───────────────────────────────────────────────────
        addMockSession: (session) =>
          set((state) => {
            const todayKey = toDateKey();
            const prevDay = state.activity.byDate[todayKey] || { attempts: 0, mistakes: 0, mocks: 0, behavioral: 0 };
            return {
              mocks: { ...state.mocks, sessions: [session, ...state.mocks.sessions] },
              activity: {
                ...state.activity,
                byDate: { ...state.activity.byDate, [todayKey]: { ...prevDay, mocks: (prevDay.mocks || 0) + 1 } },
              },
            };
          }),
        deleteMockSession: (sessionId) =>
          set((state) => ({
            mocks: { ...state.mocks, sessions: state.mocks.sessions.filter((s) => s.id !== sessionId) },
          })),

        // ── Behavioral ───────────────────────────────────────────────────────
        addBehavioralStory: (story) =>
          set((state) => {
            const todayKey = toDateKey();
            const prevDay = state.activity.byDate[todayKey] || { attempts: 0, mistakes: 0, mocks: 0, behavioral: 0 };
            return {
              behavioral: { ...state.behavioral, stories: [story, ...state.behavioral.stories] },
              activity: {
                ...state.activity,
                byDate: { ...state.activity.byDate, [todayKey]: { ...prevDay, behavioral: (prevDay.behavioral || 0) + 1 } },
              },
            };
          }),
        updateBehavioralStory: (storyId, patch) =>
          set((state) => ({
            behavioral: {
              ...state.behavioral,
              stories: state.behavioral.stories.map((s) =>
                s.id === storyId ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s,
              ),
            },
          })),
        deleteBehavioralStory: (storyId) =>
          set((state) => ({
            behavioral: {
              ...state.behavioral,
              stories: state.behavioral.stories.filter((s) => s.id !== storyId),
            },
          })),

        // ── Import/Export ─────────────────────────────────────────────────────
        resetAll: () => set(() => buildInitialState()),
        replacePersistedState: (nextState) =>
          set((state) => ({
            ...state,
            ...nextState,
            ui: { ...state.ui, ...(nextState.ui || {}) },
          })),
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage,
      partialize: (state) => {
        const { actions, ...rest } = state;
        return rest;
      },
      merge: (persistedState, currentState) => {
        const p = persistedState || {};
        return {
          ...currentState,
          ...p,
          ui: { ...currentState.ui, ...(p.ui || {}) },
          dsa: {
            ...currentState.dsa,
            ...(p.dsa || {}),
            problemsById: { ...currentState.dsa.problemsById, ...(p.dsa?.problemsById || {}) },
          },
          systemDesign: {
            ...currentState.systemDesign,
            ...(p.systemDesign || {}),
            systemsById: { ...currentState.systemDesign.systemsById, ...(p.systemDesign?.systemsById || {}) },
          },
          project: {
            ...currentState.project,
            ...(p.project || {}),
            itemsChecked: { ...currentState.project.itemsChecked, ...(p.project?.itemsChecked || {}) },
            readiness: { ...currentState.project.readiness, ...(p.project?.readiness || {}) },
            notes: { ...currentState.project.notes, ...(p.project?.notes || {}) },
          },
          revision: {
            ...currentState.revision,
            ...(p.revision || {}),
            checked: { ...currentState.revision.checked, ...(p.revision?.checked || {}) },
            expanded: { ...currentState.revision.expanded, ...(p.revision?.expanded || {}) },
          },
          mocks: {
            ...currentState.mocks,
            ...(p.mocks || {}),
            sessions: Array.isArray(p.mocks?.sessions) ? p.mocks.sessions : currentState.mocks.sessions,
          },
          behavioral: {
            ...currentState.behavioral,
            ...(p.behavioral || {}),
            stories: Array.isArray(p.behavioral?.stories) ? p.behavioral.stories : currentState.behavioral.stories,
          },
          activity: {
            ...currentState.activity,
            ...(p.activity || {}),
            byDate: { ...currentState.activity.byDate, ...(p.activity?.byDate || {}) },
          },
        };
      },
      migrate: (persistedState, version) => {
        if (!persistedState) return buildInitialState();
        // v1 → v2: add new project notes fields
        if (version < 2) {
          const base = buildInitialState();
          return {
            ...base,
            ...persistedState,
            project: {
              ...base.project,
              ...(persistedState.project || {}),
              notes: { ...base.project.notes, ...(persistedState.project?.notes || {}) },
              readiness: { ...base.project.readiness, ...(persistedState.project?.readiness || {}) },
            },
          };
        }
        return persistedState;
      },
    },
  ),
);

export const selectActions = (s) => s.actions;
