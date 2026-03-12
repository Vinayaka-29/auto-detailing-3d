import React from "react";

export default function Reviews() {
  return (
    <section id="reviews" style={{
      padding: "3rem",
      background: "#111",
      borderRadius: "10px"
    }}>
      
      <h2 style={{ marginBottom: "2rem" }}>
        What Our Clients Say
      </h2>

      <div style={{ marginBottom: "2rem" }}>
        <p>
          "Absolutely incredible work. My 5-year-old car looks like it just rolled
          off the showroom floor!"
        </p>

        <p style={{ color: "#d32f2f" }}>
          ★★★★★ – Rahul S.
        </p>
      </div>

      <hr style={{ borderColor: "#333" }} />

      <div style={{ marginTop: "2rem" }}>
        <p>
          "The PPF installation was flawless. Great attention to detail and
          excellent customer service."
        </p>

        <p style={{ color: "#d32f2f" }}>
          ★★★★★ – Priya M.
        </p>
      </div>

    </section>
  );
}