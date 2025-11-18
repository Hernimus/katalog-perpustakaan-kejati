import React, { useEffect } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import WhatsAppButton from "../../components/WhatsAppButton";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../style/Public/Home.css";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  // Scroll to top on page change
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []); // efek hanya jalan sekali saat komponen dimount


  // 🔹 Reusable Section Component
  const Section = ({ children, delay = 0 }) => (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  );

  return (
    
    <div>
      <Navbar />
      {/* 🔹 HERO SECTION - Carousel Fade */}
      <section className="hero-carousel position-relative">
        <Carousel fade interval={1000}>
          {[
            {
              title: "Perpustakaan Kejaksaan Tinggi Kalimantan Tengah",
              desc: "Sumber pengetahuan digital bagi pegawai",
              img: "/masthead.png",
            },
            {
              title: "Berbagai Koleksi Buku",
              desc: "Temukan berbagai buku hukum dan literasi umum yang informatif.",
              img: "/masthead2.png",
            },
            {
              title: "Akses Katalog Digital",
              desc: "Nikmati kemudahan mencari buku secara online kapan pun.",
              img: "/masthead3.png",
            },
          ].map((slide, i) => (
            <Carousel.Item key={i}>
              <div
                className="vh-100 d-flex align-items-center justify-content-center text-center text-white"
                style={{
                  backgroundImage: `url('${slide.img}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}
              >
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                ></div>
                <div className="container position-relative">
                  <motion.h1
                    className="display-4 fw-bold text-warning"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    className="lead mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {slide.desc}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                  >
                    <Link
                      to="/katalog"
                      className="btn btn-warning btn-lg px-4 py-2 text-dark fw-semibold shadow"
                    >
                      Jelajahi Koleksi
                    </Link>
                  </motion.div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      {/* 🔹 FASILITAS - Animasi dari bawah */}
      <Section delay={0.2}>
        <div className="py-5 bg-light">
          <div className="container text-center">
            <motion.h2
              className="fw-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Fasilitas Perpustakaan
            </motion.h2>

            <div className="row g-4">
              {[
                {
                  title: "Berbagai Koleksi",
                  text: "Koleksi buku hukum, literasi umum, dan dokumen peraturan perundang-undangan tersedia untuk menunjang riset dan edukasi.",
                },
                {
                  title: "Akses Digital",
                  text: "Sistem pencarian katalog buku digital yang dapat diakses kapan pun dan di mana pun.",
                },
                {
                  title: "Ruang Baca Nyaman",
                  text: "Tersedia ruang baca yang tenang dan nyaman dengan fasilitas yang mendukung kenyamanan pengguna.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="col-md-4"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="card shadow-sm h-100 border-0">
                    <div className="card-body">
                      <h5 className="card-title fw-semibold mb-3">
                        {item.title}
                      </h5>
                      <p className="card-text text-muted">{item.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 🔹 FAQ Section - kombinasi kiri-kanan */}
      <Section delay={0.3}>
        <div className="py-5 bg-light">
          <div className="container">
            <motion.h2
              className="fw-bold mb-2 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Ada Pertanyaan? Lihat Jawaban di Sini!
            </motion.h2>
            <motion.p
              className="text-muted text-center mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Temukan berbagai informasi umum seputar layanan dan sistem katalog
              digital perpustakaan.
            </motion.p>

            <div className="row align-items-center">
              {/* Gambar dari kiri */}
              <motion.div
                className="col-md-5 mb-4 mb-md-0 text-center d-none d-md-block"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <img
                  src="/FAQ.png"
                  alt="FAQ Illustration"
                  style={{ maxHeight: "350px", objectFit: "cover" }}
                />
              </motion.div>

              {/* Accordion dari kanan */}
              <motion.div
                className="col-md-7"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="accordion" id="faqAccordion">

                  {/* FAQ 1 */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="faq1">
                      <button
                        className="accordion-button fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse1"
                        aria-expanded="true"
                        aria-controls="collapse1"
                      >
                        Apa itu OPAC (Online Public Access Catalog)?
                      </button>
                    </h2>
                    <div
                      id="collapse1"
                      className="accordion-collapse collapse show"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        <strong>OPAC</strong> (Online Public Access Catalog) adalah sistem katalog digital yang memudahkan pengguna untuk menelusuri koleksi buku di perpustakaan secara online. Melalui OPAC, pengguna dapat menelusuri koleksi perpustakaan (seperti buku, jurnal, atau majalah) secara digital dengan mudah dan cepat, tanpa harus mencari secara manual di rak.
                      </div>
                    </div>
                  </div>

                  {/* FAQ 2 */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="faq2">
                      <button
                        className="accordion-button collapsed fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse2"
                        aria-expanded="false"
                        aria-controls="collapse2"
                      >
                        Apa keunggulan dari sistem katalog ini?
                      </button>
                    </h2>
                    <div
                      id="collapse2"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Sistem katalog perpustakaan ini memiliki beberapa keunggulan: 
                        <ul className="mt-2 mb-0"> 
                          <li>Akses katalog online dari mana saja, kapan saja.</li> 
                          <li>Menampilkan informasi detail koleksi (pengarang, penerbit, lokasi rak).</li> 
                          <li>Pencarian koleksi lebih mudah dengan filter judul, pengarang, atau ISBN.</li> 
                          <li>Dapat melihat koleksi-koleksi terbaru yang baru ditambahkan.</li> </ul>
                      </div>
                    </div>
                  </div>

                  {/* FAQ 3 */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="faq3">
                      <button
                        className="accordion-button collapsed fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse3"
                        aria-expanded="false"
                        aria-controls="collapse3"
                      >
                        Bagaimana cara mengakses katalog buku?
                      </button>
                    </h2>
                    <div
                      id="collapse3"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Anda dapat mengakses katalog melalui menu “Katalog” di bagian atas halaman, lalu mencari berdasarkan judul atau pengarang.
                      </div>
                    </div>
                  </div>

                  {/* FAQ 4 - Tentang OPAC */}
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="faq4">
                      <button
                        className="accordion-button collapsed fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse4"
                        aria-expanded="false"
                        aria-controls="collapse4"
                      >
                        Apakah perpustakaan ini terbuka untuk umum?
                      </button>
                    </h2>
                    <div
                      id="collapse4"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Perpustakaan ini ditujukan untuk pegawai Kejaksaan, namun masyarakat dapat mengakses koleksi digital tertentu secara daring
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header" id="faq5">
                      <button
                        className="accordion-button collapsed fw-semibold"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse5"
                        aria-expanded="false"
                        aria-controls="collapse5"
                      >
                        Di mana lokasi perpustakaan Kejaksaan Tinggi Kalteng?
                      </button>
                    </h2>
                    <div
                      id="collapse5"
                      className="accordion-collapse collapse"
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        Lokasi kami berada di{" "} 
                        <a 
                          href="https://www.google.com/maps/place/Kejaksaan+Tinggi+Kalimantan+Tengah/@-2.213965,113.919534,17z/data=!4m6!3m5!1s0x2dfcb3928a2b5171:0x72d8b65313de2509!8m2!3d-2.2139649!4d113.9195343!16s%2Fg%2F11t9jymj4z?hl=id&entry=ttu&g_ep=EgoyMDI1MTAxMy4wIKXMDSoASAFQAw%3D%3D" 
                          target="_blank" 
                          rel="noopener noreferrer" > 
                          Kejaksaan Tinggi Kalimantan Tengah 
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* 🔹 Lokasi */}
      <Section delay={0.3}>
        <section className="py-5">
          <div className="container text-center">
            <h2 className="fw-semibold mb-4">Lokasi Perpustakaan</h2>
            <p className="text-muted mb-4">
              Perpustakaan Kejaksaan Tinggi Kalimantan Tengah berlokasi di:
              <br />
              <b>Jl. Imam Bonjol No.10, Menteng, Jekan Raya, Palangka Raya</b>
            </p>
            <div className="ratio ratio-16x9 shadow-sm rounded overflow-hidden">
              <iframe
                title="Lokasi Perpustakaan Kejaksaan Tinggi Kalimantan Tengah"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.8400564247972!2d113.91695401085154!3d-2.2139595373350147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dfcb3928a2b5171%3A0x72d8b65313de2509!2sKejaksaan%20Tinggi%20Kalimantan%20Tengah!5e0!3m2!1sid!2sid!4v1760491391181!5m2!1sid!2sid"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      </Section>

      <WhatsAppButton />

      <Footer />
    </div>
  );
}

export default Home;
