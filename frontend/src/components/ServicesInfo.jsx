import React from "react";

export default function ServicesInfo() {

  const services = [
    {
      title: "Deep Washing",
      desc: "Complete foam wash and deep cleaning for your vehicle.",
      img: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023"
    },
    {
      title: "Interior Detailing",
      desc: "Deep interior cleaning, leather conditioning and restoration.",
      img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c"
    },
    {
      title: "Ceramic Coating",
      desc: "Long-lasting paint protection and glossy finish.",
      img: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2"
    },
    {
      title: "Paint Protection Film",
      desc: "Self-healing protection film to prevent scratches.",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
    }
  ];

  return (
    <section
      id="services"
      style={{
        padding: "5rem 2rem",
        background: "#0a0a0a",
        color: "white",
        textAlign: "center"
      }}
    >

      <h2 style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>
        Our Premium Services
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >

        {services.map((service, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              height: "300px",
              borderRadius: "10px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
            }}
          >

            {/* Background image */}
            <img
              src={service.img}
              alt={service.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s"
              }}
            />

            {/* Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(rgba(0,0,0,0.2),rgba(0,0,0,0.8))",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "20px"
              }}
            >

              <h3 style={{ margin: 0 }}>{service.title}</h3>
              <p style={{ fontSize: "14px", color: "#ddd" }}>
                {service.desc}
              </p>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}