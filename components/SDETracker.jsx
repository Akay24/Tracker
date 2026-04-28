import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { DashboardTab } from "./dashboard/DashboardTab";
import { TodayTab } from "./today/TodayTab";
import { DSATab } from "./dsa/DSATab";
import { SystemDesignTab } from "./systemDesign/SystemDesignTab";
import { ProjectTab } from "./project/ProjectTab";
import { RevisionTab } from "./revision/RevisionTab";
import { MockInterviewsTab } from "./mock/MockInterviewsTab";
import { BehavioralTab } from "./behavioral/BehavioralTab";

import { DAY_SCHEDULE } from "../data/daySchedule";
import { useHydratedStore } from "../hooks/useHydratedStore";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { useSupabaseSync } from "../hooks/useSupabaseSync";
import { selectActions, usePrepStore } from "../store/usePrepStore";
import { Pill } from "./ui/Pill";
import { C, globalCss, rgba } from "../utils/theme";
import { isSupabaseConfigured } from "../utils/supabaseClient";

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TABS = [
  { key: "dashboard", label: "Dashboard", color: C.orange },
  { key: "today", label: "Today", color: C.orange },
  { key: "dsa", label: "DSA", color: C.cyan },
  { key: "system", label: "System", color: C.yellow },
  { key: "project", label: "Project", color: C.green },
  { key: "revision", label: "Revision", color: C.orange },
  { key: "mocks", label: "Mocks", color: C.purple },
  { key: "behavioral", label: "Behavioral", color: C.cyan },
];

const TabButton = ({ active, label, color, onClick }) => (
  <button
    className="tab-btn"
    onClick={onClick}
    style={{
      padding: "10px 12px",
      borderRadius: 999,
      border: `1px solid ${active ? rgba(color, 0.45) : C.border}`,
      background: active ? rgba(color, 0.12) : "transparent",
      color: active ? color : C.textMuted,
      fontSize: 12,
      fontWeight: 900,
      whiteSpace: "nowrap",
      fontFamily: "'JetBrains Mono',monospace",
      letterSpacing: "0.4px",
      transition: "all 0.15s ease",
    }}
  >
    {label}
  </button>
);

export default function SDETracker() {
  const hydrated = useHydratedStore();

  const supabaseConfigured = isSupabaseConfigured();
  const { user, loading: authLoading, error: authError, lastMagicLinkEmail, signInWithMagicLink, signInWithOAuth, signOut } =
    useSupabaseAuth();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  useSupabaseSync({ enabled: hydrated && !!user, userId: user?.id });

  const activeTab = usePrepStore((s) => s.ui.activeTab);
  const showDaySlider = usePrepStore((s) => s.ui.showDaySlider);
  const currentDay = usePrepStore((s) => s.currentDay);
  const actions = usePrepStore(selectActions);

  const schedule = useMemo(() => DAY_SCHEDULE[currentDay - 1] || DAY_SCHEDULE[0], [currentDay]);
  const currentWeek = schedule?.w || Math.ceil(currentDay / 7);
  const dowLabel = DOW[(currentDay - 1) % 7];

  const content = useMemo(() => {
    if (activeTab === "dashboard") return <DashboardTab currentDay={currentDay} currentWeek={currentWeek} dowLabel={dowLabel} />;
    if (activeTab === "today") return <TodayTab currentDay={currentDay} currentWeek={currentWeek} dowLabel={dowLabel} />;
    if (activeTab === "dsa") return <DSATab />;
    if (activeTab === "system") return <SystemDesignTab />;
    if (activeTab === "project") return <ProjectTab />;
    if (activeTab === "revision") return <RevisionTab />;
    if (activeTab === "mocks") return <MockInterviewsTab />;
    if (activeTab === "behavioral") return <BehavioralTab />;
    return <DashboardTab currentDay={currentDay} currentWeek={currentWeek} dowLabel={dowLabel} />;
  }, [activeTab, currentDay, currentWeek, dowLabel]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.text,
        fontFamily: "sans-serif",
      }}
    >
      <style jsx global>
        {globalCss}
      </style>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: rgba(C.bg, 0.84),
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ padding: "14px 16px", maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontWeight: 900,
                  letterSpacing: "1.2px",
                  color: C.orange,
                }}
              >
                SDE PREP ENGINE
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                Day {currentDay} · Week {currentWeek} · {dowLabel}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button
                onClick={actions.toggleDaySlider}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "9px 12px",
                  color: C.text,
                  fontSize: 12,
                  fontWeight: 900,
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                {showDaySlider ? "Hide Day" : "Set Day"}
              </button>

              {supabaseConfigured && (
                <>
                  {user ? (
                    <>
                      <Pill color={C.cyan}>CLOUD: ON</Pill>
                      <div
                        title={user.email || user.id}
                        style={{
                          maxWidth: 220,
                          fontSize: 11,
                          color: C.textMuted,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.email || "Signed in"}
                      </div>
                      <button
                        onClick={() => signOut()}
                        style={{
                          background: "transparent",
                          border: `1px solid ${C.border}`,
                          borderRadius: 10,
                          padding: "9px 12px",
                          color: C.textMuted,
                          fontSize: 12,
                          fontWeight: 900,
                          fontFamily: "'JetBrains Mono',monospace",
                        }}
                        title="Sign out"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Pill color={C.orange}>CLOUD: SIGN IN</Pill>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@domain.com"
                        type="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        style={{
                          width: 220,
                          background: C.surface,
                          border: `1px solid ${C.border}`,
                          borderRadius: 10,
                          padding: "9px 12px",
                          color: C.text,
                          fontSize: 12,
                          fontFamily: "'JetBrains Mono',monospace",
                        }}
                      />
                      <button
                        disabled={authLoading || sending || !email.trim()}
                        onClick={async () => {
                          const e = email.trim();
                          if (!e) return;
                          setSending(true);
                          try {
                            await signInWithMagicLink({ email: e });
                          } finally {
                            setSending(false);
                          }
                        }}
                        style={{
                          background: `linear-gradient(90deg,${C.orange},${C.cyan})`,
                          border: "none",
                          borderRadius: 10,
                          padding: "9px 12px",
                          color: "#000",
                          fontSize: 12,
                          fontWeight: 900,
                          fontFamily: "'JetBrains Mono',monospace",
                          opacity: authLoading || sending || !email.trim() ? 0.55 : 1,
                        }}
                        title="Send magic link"
                      >
                        {sending ? "Sending…" : "Send link"}
                      </button>
                      <button
                        disabled={authLoading || sending}
                        onClick={() => signInWithOAuth({ provider: "github" })}
                        style={{
                          background: "transparent",
                          border: `1px solid ${C.border}`,
                          borderRadius: 10,
                          padding: "9px 12px",
                          color: C.text,
                          fontSize: 12,
                          fontWeight: 900,
                          fontFamily: "'JetBrains Mono',monospace",
                          opacity: authLoading || sending ? 0.55 : 1,
                        }}
                        title="Sign in with GitHub — enable provider in Supabase Dashboard"
                      >
                        ⬡ GitHub
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {supabaseConfigured && !user && lastMagicLinkEmail && !authError && (
            <div style={{ marginTop: 10, fontSize: 11, color: C.textMuted }}>
              Magic link sent to <span style={{ color: C.textSec }}>{lastMagicLinkEmail}</span>. Open it to finish sign-in.
            </div>
          )}

          {supabaseConfigured && authError && (
            <div style={{ marginTop: 10, fontSize: 11, color: C.orange }}>
              Auth error: {authError?.message || String(authError)}
            </div>
          )}

          {showDaySlider && (
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="range"
                min={1}
                max={DAY_SCHEDULE.length}
                value={currentDay}
                onChange={(e) => actions.setCurrentDay(Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <div style={{ fontFamily: "'JetBrains Mono',monospace", color: C.textMuted, fontSize: 12 }}>
                {currentDay}/{DAY_SCHEDULE.length}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
            {TABS.map((t) => (
              <TabButton
                key={t.key}
                active={activeTab === t.key}
                label={t.label}
                color={t.color}
                onClick={() => actions.setActiveTab(t.key)}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 16px 40px" }}>
        {!hydrated ? (
          <div style={{ padding: 24, color: C.textMuted }}>Hydrating local progress…</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
