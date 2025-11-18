import React from "react";
import { motion } from "framer-motion";
import "../style/components/WhatsAppButton.css";

function WhatsAppButton() {
  const phoneNumber = "6282156099099";
  const message = encodeURIComponent("Halo, saya ingin bertanya tentang layanan perpustakaan.");
  const link = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.img
        src="/gambar/wa.webp"
        alt="WhatsApp Chat"
        className="whatsapp-icon"
        animate={{
          y: [0, -5, 0], // animasi goyang lembut
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.a>
  );
}

export default WhatsAppButton;
