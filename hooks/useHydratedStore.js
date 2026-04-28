import { useEffect, useState } from "react";
import { usePrepStore } from "../store/usePrepStore";

export const useHydratedStore = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = usePrepStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(usePrepStore.persist.hasHydrated());
    return () => {
      unsub?.();
    };
  }, []);

  return hydrated;
};
