import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const end = parseInt(target);
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 25);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function StatsBar() {
  const [stats, setStats] = useState({ happyClients: 500, avgRating: "4.9", yearsExperience: 6, carsDetailed: 2000 });

  useEffect(() => {
    axios.get(`${API}/api/stats`).then(r => { if (r.data.success) setStats(r.data.stats); }).catch(() => {});
  }, []);

  const items = [
    { value: stats.happyClients, suffix: "+", label: "Happy Clients" },
    { value: stats.avgRating, suffix: "★", label: "Average Rating" },
    { value: stats.yearsExperience, suffix: "+", label: "Years Experience" },
    { value: stats.carsDetailed, suffix: "+", label: "Cars Detailed" },
  ];

  return (
    <div style={{
      background: "var(--crimson-dark)",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      padding: "1.5rem 4rem",
      display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem",
    }}>
      {items.map((item, i) => (
        <div key={i} style={{ textAlign: "center", padding: "0.5rem 1rem" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", letterSpacing: 2, color: "white", lineHeight: 1 }}>
            {typeof item.value === "string" ? `${item.value}${item.suffix}` : <Counter target={item.value} suffix={item.suffix} />}
          </div>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
