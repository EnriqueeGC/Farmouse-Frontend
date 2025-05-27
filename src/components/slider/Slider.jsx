import React, { useState, useEffect } from "react";
import gran1 from "../../assets/images/grande1.jpg";
import gran2 from "../../assets/images/grande2.jpg";
import peq1 from "../../assets/images/pequeña1.jpg";
import peq2 from "../../assets/images/pequeña2.jpg";
import peq3 from "../../assets/images/pequeña3.jpg";
import peq4 from "../../assets/images/pequeña4.jpg";

const Slider = ({ slides, width, height, auto = true, interval = 4000 }) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto cambio de slides
  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [current, auto, interval, slides.length]);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflow: "hidden",
        borderRadius: 5,
        backgroundColor: "#fff",
      }}
    >
      <img
        src={slides[current].src}
        alt={slides[current].alt}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />

      <button
        onClick={prev}
        style={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.7)",
          border: "none",
          width: 24,
          height: 24,
          cursor: "pointer",
          fontSize: 18,
          lineHeight: "24px",
          padding: 0,
          userSelect: "none",
        }}
        aria-label="Anterior"
      >
        ‹
      </button>
      <button
        onClick={next}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.7)",
          border: "none",
          borderRadius: "50%",
          width: 24,
          height: 24,
          cursor: "pointer",
          fontSize: 18,
          lineHeight: "24px",
          padding: 0,
          userSelect: "none",
        }}
        aria-label="Siguiente"
      >
        ›
      </button>

      <div
        style={{
          position: "absolute",
          bottom: 6,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 2,
        }}
      >
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: i === current ? "#a3123e" : "#ccc",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const MainSlider = () => {
  const smallSlidesTop = [
    { id: 1, src: peq1, alt: "Pequeña 1" },
    { id: 2, src: peq2, alt: "Pequeña 2" },
  ];
  const smallSlidesBottom = [
    { id: 3, src: peq3, alt: "Pequeña 3" },
    { id: 4, src: peq4, alt: "Pequeña 4" },
  ];
  const bigSlides = [
    { id: 1, src: gran1, alt: "Grande 1" },
    { id: 2, src: gran2, alt: "Grande 2" },
  ];

  return (
    <div
      style={{
        display: "flex",
        maxWidth: 900,
        margin: "auto",
        height: 400,
        marginTop: 40,
      }}
    >
      {/* Izquierda: dos sliders pequeños apilados */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "35%",
          gap: "4%",
        }}
      >
        <Slider slides={smallSlidesTop} width="100%" height="48%" />
        <Slider slides={smallSlidesBottom} width="100%" height="48%" />
      </div>

      {/* Derecha: slider grande */}
      <div style={{ width: "65%", height: "100%" }}>
        <Slider slides={bigSlides} width="100%" height="100%" />
      </div>
    </div>
  );
};

export default MainSlider;
