import { useEffect, useMemo, useState } from "react";

import { getSupabaseClient, isSupabaseConfigured } from "../utils/supabaseClient";

export const useSupabaseAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastMagicLinkEmail, setLastMagicLinkEmail] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setSession(null);
      setLoading(false);
      return;
    }

    const supabase = getSupabaseClient();
    let cancelled = false;

    const init = async () => {
      const { data, error: err } = await supabase.auth.getSession();
      if (cancelled) return;
      if (err) setError(err);
      setSession(data?.session || null);
      setLoading(false);
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      cancelled = true;
      data?.subscription?.unsubscribe?.();
    };
  }, []);

  const user = useMemo(() => session?.user || null, [session]);

  const signInWithMagicLink = async ({ email }) => {
    setError(null);

    if (!isSupabaseConfigured()) {
      const err = new Error("Supabase not configured");
      setError(err);
      return { error: err };
    }

    const supabase = getSupabaseClient();

    const redirectTo =
      typeof window !== "undefined" && window.location?.origin ? window.location.origin : undefined;

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
    });

    if (err) {
      setError(err);
      return { error: err };
    }

    setLastMagicLinkEmail(email);
    return { error: null };
  };

  const signInWithOAuth = async ({ provider }) => {
    setError(null);

    if (!isSupabaseConfigured()) {
      const err = new Error("Supabase not configured");
      setError(err);
      return { error: err };
    }

    const supabase = getSupabaseClient();

    const redirectTo =
      typeof window !== "undefined" && window.location?.origin ? window.location.origin : undefined;

    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: redirectTo ? { redirectTo } : undefined,
    });

    if (err) {
      setError(err);
      return { error: err };
    }

    return { error: null };
  };

  const signOut = async () => {
    setError(null);

    if (!isSupabaseConfigured()) return { error: null };

    const supabase = getSupabaseClient();
    const { error: err } = await supabase.auth.signOut();
    if (err) {
      setError(err);
      return { error: err };
    }
    return { error: null };
  };

  return {
    session,
    user,
    loading,
    error,
    lastMagicLinkEmail,
    signInWithMagicLink,
    signInWithOAuth,
    signOut,
  };
};
