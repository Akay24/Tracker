import { useEffect, useRef } from "react";

import { usePrepStore } from "../store/usePrepStore";
import { getSupabaseClient, isSupabaseConfigured } from "../utils/supabaseClient";

const DEFAULT_TABLE = "prep_engine_state";

const createDebouncer = (fn, waitMs) => {
  let timer = null;

  const debounced = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn();
    }, waitMs);
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  return debounced;
};

const safeJsonStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
};

const hasUserSignal = (persisted) => {
  const activityKeys = Object.keys(persisted?.activity?.byDate || {});
  if (activityKeys.length > 0) return true;

  if ((persisted?.mocks?.sessions || []).length > 0) return true;
  if ((persisted?.behavioral?.stories || []).length > 0) return true;

  if (Object.values(persisted?.project?.itemsChecked || {}).some(Boolean)) return true;
  if (Object.values(persisted?.revision?.checked || {}).some(Boolean)) return true;

  const projectNotes = persisted?.project?.notes || {};
  if (Object.values(projectNotes).some((v) => String(v || "").trim().length > 0)) return true;

  const problems = Object.values(persisted?.dsa?.problemsById || {});
  if (
    problems.some(
      (p) =>
        Number(p?.confidence || 0) > 0 ||
        Boolean(p?.lastAttempted) ||
        (Array.isArray(p?.mistakes) && p.mistakes.length > 0),
    )
  ) {
    return true;
  }

  const systems = Object.values(persisted?.systemDesign?.systemsById || {});
  if (
    systems.some((s) =>
      Object.values(s?.sections || {}).some(
        (sec) => Number(sec?.confidence || 0) > 0 || String(sec?.notes || "").trim().length > 0,
      ),
    )
  ) {
    return true;
  }

  return false;
};

const getPersistedSnapshot = () => {
  const full = usePrepStore.getState();
  const partialize = usePrepStore.persist?.getOptions?.().partialize;

  if (typeof partialize === "function") return partialize(full);

  const { actions: _actions, ...rest } = full;
  return rest;
};

export const useSupabaseSync = ({ enabled = true, table = DEFAULT_TABLE, userId } = {}) => {
  const lastPushedRef = useRef("");

  useEffect(() => {
    if (!enabled) return;
    if (!isSupabaseConfigured()) return;
    if (!userId) return;

    lastPushedRef.current = "";

    const supabase = getSupabaseClient();

    let unsub = null;
    let cancelled = false;

    const pushNow = async () => {
      if (cancelled) return;

      const persisted = getPersistedSnapshot();
      const payloadStr = safeJsonStringify(persisted);
      if (!payloadStr) return;
      if (payloadStr === lastPushedRef.current) return;

      const { error } = await supabase
        .from(table)
        .upsert(
          {
            user_id: userId,
            state: persisted,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );

      if (error) {
        console.warn("[supabase] state upsert failed", error);
        return;
      }

      lastPushedRef.current = payloadStr;
    };

    const debouncedPush = createDebouncer(() => {
      pushNow().catch((e) => console.warn("[supabase] push failed", e));
    }, 900);

    const bootstrap = async () => {
      try {
        const localPersisted = getPersistedSnapshot();
        const localHasSignal = hasUserSignal(localPersisted);

        const { data, error } = await supabase
          .from(table)
          .select("state, updated_at")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) {
          console.warn("[supabase] load failed", error);
        }

        const remoteState = data?.state;
        const remoteHasSignal = hasUserSignal(remoteState);

        // Conflict strategy (minimal + safe):
        // - If this device has no meaningful progress but cloud does → pull from cloud.
        // - Otherwise keep local as source-of-truth and push it to cloud.
        if (remoteState && typeof remoteState === "object" && remoteHasSignal && !localHasSignal) {
          const merge = usePrepStore.persist?.getOptions?.().merge;
          const current = usePrepStore.getState();
          const merged = typeof merge === "function" ? merge(remoteState, current) : { ...current, ...remoteState };
          usePrepStore.setState(merged, true);
        }

        lastPushedRef.current = safeJsonStringify(remoteState || "");

        unsub = usePrepStore.subscribe(() => {
          debouncedPush();
        });

        // Seed or refresh cloud shortly after boot.
        debouncedPush();
      } catch (e) {
        console.warn("[supabase] bootstrap failed", e);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
      debouncedPush.cancel?.();
      unsub?.();
    };
  }, [enabled, table, userId]);
};
