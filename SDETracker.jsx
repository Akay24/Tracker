import { useState, useEffect } from "react";

export default function SDETracker() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("count") : null;
    if (saved) setCount(Number(saved));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("count", count);
    }
  }, [count]);

  return (
    <div style={{ padding: 40 }}>
      <h1>SDE Tracker Running ✅</h1>
      <p>Progress Counter:</p>
      <h2>{count}</h2>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  );
}
