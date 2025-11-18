const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require("multer");

const ExcelJS = require("exceljs"); 
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine for EJS templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));









app.use(express.json());
app.use(session({
  secret: 'your-secret-key', // Change this to a secure key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Connect to SQLite database
const db = new sqlite3.Database('perpustakaan.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Enable foreign key constraints
app.use((req, res, next) => {
  db.run("PRAGMA foreign_keys = ON");
  next();
});

// 🔓 Endpoint publik (tanpa login) untuk melihat daftar rak
app.get('/api/public/rak-mapping', (req, res) => {
  let sql = 'SELECT * FROM rak_mapping';
  let params = [];
  let whereClauses = [];

  // Filter opsional berdasarkan query
  if (req.query.q) {
    whereClauses.push('(rak_buku LIKE ? OR tema LIKE ?)');
    const like = '%' + req.query.q + '%';
    params.push(like, like);
  }

  if (whereClauses.length) {
    sql += ' WHERE ' + whereClauses.join(' AND ');
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});


// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve React app static files
app.use(express.static(path.join(__dirname, 'client', 'build')));

// API Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM admin WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (!row) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    bcrypt.compare(password, row.password, (err, result) => {
      if (result) {
        req.session.user = { username: row.username };
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    });
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

app.get('/api/admin', (req, res) => {
  if (req.session.user) {
    res.json({ message: 'Welcome to admin area', user: req.session.user });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Route: Home page - list all books or search results
app.get('/', (req, res) => {
  const searchQuery = req.query.q;
  let sql = 'SELECT * FROM buku';
  let params = [];

  if (searchQuery) {
    sql += ` WHERE judul_buku LIKE ? OR pengarang LIKE ? OR penerbit LIKE ?`;
    const likeQuery = '%' + searchQuery + '%';
    params = [likeQuery, likeQuery, likeQuery];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error querying database:', err.message);
      res.status(500).send('Database error');
    } else {
      res.render('index', { books: rows, searchQuery: searchQuery || '' });
    }
  });
});

// API route: Get katalog with pagination, search, filter
app.get('/api/katalog', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const offset = (page - 1) * limit;

  let sql = 'SELECT * FROM buku';
  let params = [];
  let whereClauses = [];

  if (req.query.q) {
    whereClauses.push('(judul_buku LIKE ? OR pengarang LIKE ? OR isbn LIKE ?)');
    const like = '%' + req.query.q + '%';
    params.push(like, like, like);
  }

  if (req.query.rak) {
    whereClauses.push('rak_buku = ?');
    params.push(req.query.rak);
  }

  if (whereClauses.length) {
    sql += ' WHERE ' + whereClauses.join(' AND ');
  }

  if (req.query.sort) {
    sql += ' ORDER BY ' + req.query.sort + ' ' + (req.query.order === 'desc' ? 'DESC' : 'ASC');
  }

  sql += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let countSql = 'SELECT COUNT(*) as total FROM buku';
    if (whereClauses.length) {
      countSql += ' WHERE ' + whereClauses.join(' AND ');
    }

    db.get(countSql, params.slice(0, -2), (err, countRow) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const totalPages = Math.ceil(countRow.total / limit);
      res.json({ data: rows, total_pages: totalPages });
    });
  });
});










// Middleware to protect admin routes
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// 📦 API untuk Konversi Tabel Buku ke Excel
app.get("/admin/export-buku", async (req, res) => {
  try {
    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Buku");

    // 🔹 Header kolom lengkap
    worksheet.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "Judul Buku", key: "judul_buku", width: 40 },
      { header: "Pengarang", key: "pengarang", width: 30 },
      { header: "Penerbit", key: "penerbit", width: 25 },
      { header: "Tempat Terbit", key: "tempat_terbit", width: 20 },
      { header: "Tahun", key: "tahun", width: 10 },
      { header: "ISBN", key: "isbn", width: 20 },
      { header: "Jilid", key: "jilid", width: 10 },
      { header: "Edisi", key: "edisi", width: 10 },
      { header: "Cetakan", key: "cetakan", width: 10 },
      { header: "Jumlah Halaman", key: "jumlah_halaman", width: 15 },
      { header: "Rak Buku", key: "rak_buku", width: 15 },
      { header: "Jumlah Buku", key: "jumlah_buku", width: 12 },
      { header: "Tinggi Buku", key: "tinggi_buku", width: 12 },
      { header: "Nomor Panggil", key: "nomor_panggil", width: 15 },
      { header: "Inisial", key: "inisial", width: 10 },
      { header: "Perolehan", key: "perolehan", width: 15 },
      { header: "Harga", key: "harga", width: 12 },
      { header: "Keterangan", key: "keterangan", width: 25 },
      { header: "No Induk", key: "no_induk", width: 12 },
    ];

    // 🔹 Ambil semua data buku dari database
    db.all("SELECT * FROM buku", [], async (err, rows) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).send("Gagal mengambil data buku");
      }

      if (!rows || rows.length === 0) {
        return res.status(404).send("Tidak ada data buku untuk diekspor");
      }

      // 🔹 Tambahkan setiap baris ke worksheet
      rows.forEach((row) => worksheet.addRow(row));

      // 🔹 Atur header agar file langsung diunduh
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Data_Buku.xlsx"
      );

      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (err) {
    console.error("Error ekspor:", err);
    res.status(500).send("Terjadi kesalahan saat ekspor data buku");
  }
});

// --------------------------------------------


// Admin API routes for CRUD
app.post('/admin/api/buku', requireAuth, (req, res) => {
  const { judul_buku, pengarang, penerbit, tempat_terbit, tahun, isbn, jilid, edisi, cetakan, jumlah_halaman, rak_buku, jumlah_buku, tinggi_buku, nomor_panggil, inisial, perolehan, harga, keterangan, no_induk } = req.body;
  db.run(`INSERT INTO buku (judul_buku, pengarang, penerbit, tempat_terbit, tahun, isbn, jilid, edisi, cetakan, jumlah_halaman, rak_buku, jumlah_buku, tinggi_buku, nomor_panggil, inisial, perolehan, harga, keterangan, no_induk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [judul_buku, pengarang, penerbit, tempat_terbit, tahun, isbn, jilid, edisi, cetakan, jumlah_halaman, rak_buku, jumlah_buku, tinggi_buku, nomor_panggil, inisial, perolehan, harga, keterangan, no_induk], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

app.put('/admin/api/buku/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const fields = Object.keys(req.body);
  const values = Object.values(req.body);
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  db.run(`UPDATE buku SET ${setClause} WHERE id = ?`, [...values, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ changes: this.changes });
  });
});

app.delete('/admin/api/buku/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM buku WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ changes: this.changes });
  });
});

// API route: Get statistics for admin
app.get("/api/stats", requireAuth, (req, res) => {
  //  total rows
  db.get("SELECT COUNT(*) AS total FROM buku", [], (err, totalRows) => {
    if (err) return res.status(500).json({ error: err.message });
    const totalBaris = totalRows.total;

    // 1) total books
    db.get("SELECT COUNT(*) AS total FROM buku WHERE judul_buku IS NOT NULL AND TRIM(judul_buku) != ''", [], (err, totalRow) => {
      if (err) return res.status(500).json({ error: err.message });
      const totalBooks = totalRow.total;

      // 2) count buku tanpa rak
      db.get(
        "SELECT COUNT(*) AS unrecorded FROM buku WHERE rak_buku IS NULL OR TRIM(rak_buku) = ''",
        [],
        (err, unrecordedRow) => {
          if (err) return res.status(500).json({ error: err.message });
          const unrecordedCount = unrecordedRow.unrecorded;

          // 3) distinct rak yang terisi di kolom rak_buku
          db.get(
            "SELECT COUNT(DISTINCT rak_buku) AS distinctRak FROM rak_mapping WHERE rak_buku IS NOT NULL AND TRIM(rak_buku) != ''",
            [],
            (err, distinctRow) => {
              if (err) return res.status(500).json({ error: err.message });
              const distinctRakCount = distinctRow.distinctRak;

              // 4) jumlah buku per rak (untuk rak non-empty)
              db.all(
                "SELECT rak_buku, COUNT(*) AS count FROM buku WHERE rak_buku IS NOT NULL AND TRIM(rak_buku) != '' GROUP BY rak_buku",
                [],
                (err, rakRows) => {
                  if (err) return res.status(500).json({ error: err.message });

                  const rakCounts = {};
                  rakRows.forEach((row) => {
                    rakCounts[row.rak_buku] = row.count;
                  });

                  // 5) emptyRakCount:
                  // hitung rak (distinct rak_buku) yang ada tapi TIDAK punya satupun judul_buku non-empty
                  // logic: group by rak_buku, lalu pakai HAVING untuk memastikan
                  // SUM(CASE WHEN TRIM(COALESCE(judul_buku,'')) <> '' THEN 1 ELSE 0 END) = 0
                  const emptyRakSql = `
                  SELECT COUNT(*) AS emptyRakCount FROM (
                    SELECT rak_buku
                    FROM buku
                    WHERE rak_buku IS NOT NULL AND TRIM(rak_buku) != ''
                    GROUP BY rak_buku
                    HAVING SUM(
                      CASE WHEN TRIM(COALESCE(judul_buku, '')) <> '' THEN 1 ELSE 0 END
                    ) = 0
                  ) AS sub
                `;
                  db.get(emptyRakSql, [], (err, emptyRow) => {
                    if (err) return res.status(500).json({ error: err.message });
                    const emptyRakCount = emptyRow ? emptyRow.emptyRakCount : 0;

                    // akhir: kirim response
                    res.json({
                      totalBaris,
                      totalBooks,
                      unrecordedCount,
                      distinctRakCount,
                      emptyRakCount,
                      rakCounts,
                    });
                  });
                }
              );
            }
          );
        }
      );
    });
    });
  });




// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Simpan file di folder /uploads
const upload = multer({ dest: path.join(__dirname, "uploads/") });

// Ambil semua gambar
app.get("/api/gallery", (req, res) => {
  db.all("SELECT * FROM gallery", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Upload gambar baru
app.post("/api/gallery", upload.single("image"), (req, res) => {
  const filename = req.file.filename;
  db.run("INSERT INTO gallery (filename) VALUES (?)", [filename], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, filename });
  });
});

// Update gambar
app.put("/api/gallery/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const filename = req.file.filename;
  db.run("UPDATE gallery SET filename = ? WHERE id = ?", [filename, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, filename });
  });
});

// Hapus gambar
app.delete("/api/gallery/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM gallery WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Rak Mapping CRUD routes
app.get('/api/rak-mapping', requireAuth, (req, res) => {
  let sql = 'SELECT * FROM rak_mapping';
  let params = [];
  let whereClauses = [];




  if (req.query.q) {
    whereClauses.push('(rak_buku LIKE ? OR tema LIKE ?)');
    const like = '%' + req.query.q + '%';
    params.push(like, like);
  }

  if (whereClauses.length) {
    sql += ' WHERE ' + whereClauses.join(' AND ');
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/rak-mapping', requireAuth, (req, res) => {
  const { rak_buku, tema } = req.body;
  if (!rak_buku || !tema) {
    return res.status(400).json({ error: 'Rak Buku and Tema are required' });
  }
  db.run('INSERT INTO rak_mapping (rak_buku, tema) VALUES (?, ?)', [rak_buku, tema], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

app.put('/api/rak-mapping/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { rak_buku, tema } = req.body;
  if (!rak_buku || !tema) {
    return res.status(400).json({ error: 'Rak Buku and Tema are required' });
  }
  db.run('UPDATE rak_mapping SET rak_buku = ?, tema = ? WHERE rakmap_id = ?', [rak_buku, tema, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ changes: this.changes });
  });
});

app.delete('/api/rak-mapping/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM rak_mapping WHERE rakmap_id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ changes: this.changes });
  });
});





// Example protected admin route
app.get('/api/admin', requireAuth, (req, res) => {
  res.json({ message: `Welcome admin ${req.session.user.username}` });
});

// Admin CRUD routes for admins table
app.get('/admin/api/admins', requireAuth, (req, res) => {
  db.all('SELECT id, username FROM admin', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/admin/api/admins', requireAuth, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }
    db.run('INSERT INTO admin (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    });
  });
});

app.put('/admin/api/admins/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Error hashing password' });
      }
      db.run('UPDATE admin SET username = ?, password = ? WHERE id = ?', [username, hashedPassword, id], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ changes: this.changes });
      });
    });
  } else {
    db.run('UPDATE admin SET username = ? WHERE id = ?', [username, id], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ changes: this.changes });
    });
  }
});

app.delete('/admin/api/admins/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM admin WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ changes: this.changes });
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

