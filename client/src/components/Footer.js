import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/components/Footer.css"; 

function Footer() {
  return (
    <footer className="footer bg-dark text-white pt-5">
      <div className="container">
        <div className="row text-start">
          {/* Informasi Kontak */}
          <div className="col-md-5 mb-4">
            <h5 className="fw-bold">
              Informasi Kontak :
            </h5>
            <p className="mt-3 mb-1">
              <strong>Alamat :</strong><br />
              Perpustakaan Kejaksaan Tinggi Kalimantan Tengah<br />
              Jl. Imam Bonjol No.10, Menteng, Kec. Jekan Raya,<br />
              Kota Palangka Raya, Kalimantan Tengah 74874
            </p>
            <p className="mb-1">
              <strong>No. Telp :</strong> 082156099099
            </p>
            <p>
              <strong>Email :</strong> pustaka.kt@gmail.com
            </p>
          </div>

          {/* Jam Layanan */}
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold">Jam Layanan :</h5>
            <p className="mt-3 mb-1">
              <strong>Sirkulasi :</strong><br />
              Senin - Kamis : 08.00 - 16.00<br />
              Istirahat : 12.00 - 13.00<br /><br />
              Jumat : 08.00 - 16.30<br />
              Istirahat : 11.30 - 13.00<br /><br />
              Sabtu - Minggu : Tutup
            </p>
          </div>

          {/* Tautan & Media Sosial */}
          <div className="col-md-3 mb-4 text-md-start">
            <h5 className="fw-bold">Tautan</h5>
            <ul className="list-unstyled mt-3">
              <li>
                <a
                  href="https://www.kejaksaan.go.id/"
                  className="text-white text-decoration-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kejaksaan Agung RI
                </a>
              </li>
              <li>
                <a
                  href="https://kejati-kalimantantengah.kejaksaan.go.id/"
                  className="text-white text-decoration-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  KEJATI Kalimantan Tengah
                </a>
              </li>
              <li>
                <a
                  href="https://jdih.kejaksaan.go.id/"
                  className="text-white text-decoration-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  JDIH Kejaksaan RI
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Garis bawah biru dan copyright */}
      <div className="footer-bottom bg-danger text-center py-3 mt-4">
        <small>
           Copyright
           &copy; {new Date().getFullYear()} Kejaksaan Tinggi Kalimantan Tengah{" "}
        </small>
      </div>
    </footer>
  );
}

export default Footer;
