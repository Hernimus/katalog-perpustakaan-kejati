import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import WhatsAppButton from "../../components/WhatsAppButton";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../style/Public/About.css";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function About() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);
  const [gallery, setGallery] = useState([]); // hanya untuk galeri kegiatan

  // ✅ Hanya untuk Galeri Kegiatan
  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGallery(data);
        } else {
          setGallery([
            { image_path: "/gambar/masthead.webp" },
            { image_path: "/gambar/masthead2.webp" },
            { image_path: "/gambar/masthead3.webp" },
          ]);
        }
      })
      .catch(() =>
        setGallery([
          { image_path: "/gambar/masthead.webp" },
          { image_path: "/gambar/masthead2.webp" },
          { image_path: "/gambar/masthead3.webp" },
        ])
      );
  }, []);

  const handleImageClick = (src) => setSelectedImage(src);
  const handleCloseModal = () => setSelectedImage(null);

  // Animasi section
  const Section = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div>
      <Navbar />


      {/* 🔹 Galeri Kegiatan (HANYA fetch dari /api/gallery) */}
      <Section delay={0.4}>
        <section className="py-5">
          <div className="container text-center">
            <h2 className="fw-semibold mb-4">Galeri Kegiatan</h2>
            <p className="text-muted mb-5">
              Dokumentasi kegiatan dan fasilitas di lingkungan Perpustakaan
              Kejaksaan Tinggi Kalimantan Tengah.
            </p>

            {gallery.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                breakpoints={{
                  576: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                }}
              >
                {gallery.map((item, index) => {
                  const imageSrc = item.filename
                    ? `/uploads/${item.filename}`
                    : item.image_path;
                  return (
                    <SwiperSlide key={item.id || index}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        onClick={() => handleImageClick(imageSrc)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={imageSrc}
                          alt={item.caption || `Galeri ${index + 1}`}
                          className="img-fluid rounded shadow-sm"
                          style={{
                            height: "220px",
                            objectFit: "cover",
                            width: "100%",
                          }}
                          onError={(e) => (e.target.src = "/gambar/masthead.webp")}
                        />
                      </motion.div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <p className="text-muted">Belum ada gambar di galeri.</p>
            )}
          </div>
        </section>
      </Section>

      {/* 🔹 Modal Fullscreen */}
      {selectedImage && (
        <div
          className="fullscreen-modal"
          onClick={handleCloseModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
            cursor: "zoom-out",
          }}
        >
          <img
            src={selectedImage}
            alt="Fullscreen"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}

      <WhatsAppButton />
      <Footer />
    </div>
  );
}

export default About;
