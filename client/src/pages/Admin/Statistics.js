import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import "../../style/Admin/Statistics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Statistics() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/stats", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((json) => setStats(json))
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  const labels = stats.rakCounts ? Object.keys(stats.rakCounts) : [];
  const rakData = labels.map((l) => stats.rakCounts[l] || 0);

  const barData = {
    labels,
    datasets: [
      {
        label: "Jumlah Buku per Rak",
        data: rakData,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels,
    datasets: [
      {
        data: rakData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Distribusi Buku per Rak" },
      legend: { display: false },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="stats-container">
      <section
        className="stats-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/masthead2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container py-5">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            Statistik Data
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            Analisis koleksi buku Perpustakaan Kejaksaan Tinggi Kalimantan Tengah.
          </motion.p>
        </div>
      </section>

      <motion.section className="stats-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="container">
          <h2 className="text-center mb-4">Ringkasan Statistik</h2>
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Baris</h3>
              <p>{stats.totalBaris ?? 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Buku</h3>
              <p>{stats.totalBooks ?? 0}</p>
            </div>
            <div className="stat-card">
              <h3>Buku tanpa Rak</h3>
              <p>{stats.unrecordedCount ?? 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Rak Unik</h3>
              <p>{stats.distinctRakCount ?? 0}</p>
            </div>
            {/* <div className="stat-card">
              <h3>Rak Kosong</h3>
              <p>{stats.emptyRakCount || 0}</p>
            </div> */}

          </div>
        </div>
      </motion.section>

      {labels.length > 0 && (
  <motion.section
    className="chart-section"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="container">

      {/* Bar Chart */}
      <motion.div
        className="chart-item-bar"
        
      >
        <h3 className="chart-title">Distribusi Buku per Rak</h3>
        <Bar
          data={barData}
          options={{
            ...barOptions,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            maintainAspectRatio: false,
          }}
        />
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        className="chart-item-pie"
        
      >
        <h3 className="chart-title">Proporsi Buku per Rak</h3>
        <Pie
          data={pieData}
          options={{
            plugins: {
              legend: { position: "bottom" },
              title: { display: false },
            },
            maintainAspectRatio: false,
          }}
        />
      </motion.div>

    </div>
  </motion.section>
)}


      
    </div>
  );
}

export default Statistics;
