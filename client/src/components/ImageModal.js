import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ImageModal({ images, startIndex = 0, onClose }) {
  if (!images || images.length === 0) return null;

  return (
    <div
      className="fullscreen-modal"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.95)", // 🔹 hitam pekat tapi masih sedikit transparan
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        animation: "fadeIn 0.3s ease",
        overflow: "hidden",
      }}
    >
      {/* Tombol Close */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "25px",
          background: "rgba(255,255,255,0.9)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          cursor: "pointer",
          fontSize: "22px",
          fontWeight: "bold",
          zIndex: 10000,
        }}
      >
        ✕
      </button>

      {/* Swiper Fullscreen */}
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          loop={true} // ✅ membuat slide berulang ke awal/akhir
          initialSlide={startIndex}
          style={{ width: "100%", height: "100%" }}
        >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <img
                src={src}
                alt={`Gambar ${i + 1}`}
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "80vw",   // 🔹 batas lebar maksimum 80% dari layar
                  maxHeight: "80vh",  // 🔹 batas tinggi maksimum 80% dari layar
                  borderRadius: "10px",
                  objectFit: "contain",
                  animation: "imageFadeIn 0.4s ease forwards",
                  boxShadow: "0 0 40px rgba(0, 0, 0, 0.8)",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes imageFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }

          .swiper-button-next, .swiper-button-prev {
            color: white !important;
          }

          .swiper-pagination-bullet {
            background: white !important;
          }
        `}
      </style>
    </div>
  );
}
