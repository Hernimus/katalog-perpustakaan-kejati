import sqlite3

NAMA_DATABASE = "perpustakaan.db"

conn = sqlite3.connect(NAMA_DATABASE)
cursor = conn.cursor()

# Enable foreign key enforcement
cursor.execute("PRAGMA foreign_keys = ON;")

print("✅ Connected to database.")

# 1️⃣ Create rak_mapping if not exists
cursor.execute("""
CREATE TABLE IF NOT EXISTS rak_mapping (
    rakmap_id INTEGER PRIMARY KEY AUTOINCREMENT,
    rak_buku TEXT UNIQUE,
    tema TEXT
);
""")
print("📦 Table 'rak_mapping' checked/created.")

# 2️⃣ Insert all unique rak_buku values from buku
cursor.execute("""
INSERT OR IGNORE INTO rak_mapping (rak_buku)
SELECT DISTINCT rak_buku FROM buku WHERE rak_buku IS NOT NULL AND rak_buku != '';
""")
print("📚 Unique rak_buku values copied to 'rak_mapping'.")

# 3️⃣ Rename old buku table (for migration)
cursor.execute("ALTER TABLE buku RENAME TO buku_old;")
print("🔄 Renamed old 'buku' to 'buku_old'.")

# 4️⃣ Recreate buku table with foreign key
cursor.execute("""
CREATE TABLE buku (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    no_induk TEXT,
    judul_buku TEXT,
    pengarang TEXT,
    penerbit TEXT,
    tempat_terbit TEXT,
    tahun TEXT,
    isbn TEXT,
    jilid TEXT,
    edisi TEXT,
    cetakan TEXT,
    jumlah_halaman TEXT,
    rak_buku TEXT,
    jumlah_buku TEXT,
    tinggi_buku TEXT,
    nomor_panggil TEXT,
    inisial TEXT,
    perolehan TEXT,
    harga TEXT,
    keterangan TEXT,
    FOREIGN KEY (rak_buku) REFERENCES rak_mapping(rak_buku)
);
""")
print("🧩 Recreated 'buku' with foreign key constraint to 'rak_mapping'.")

# 5️⃣ Copy data back from buku_old
cursor.execute("""
INSERT INTO buku (
    id, no_induk, judul_buku, pengarang, penerbit, tempat_terbit, tahun, isbn,
    jilid, edisi, cetakan, jumlah_halaman, rak_buku, jumlah_buku,
    tinggi_buku, nomor_panggil, inisial, perolehan, harga, keterangan
)
SELECT id, no_induk, judul_buku, pengarang, penerbit, tempat_terbit, tahun, isbn,
       jilid, edisi, cetakan, jumlah_halaman, rak_buku, jumlah_buku,
       tinggi_buku, nomor_panggil, inisial, perolehan, harga, keterangan
FROM buku_old;
""")
print("📥 Migrated all data from 'buku_old' to new 'buku'.")

# 6️⃣ Drop old buku table
cursor.execute("DROP TABLE buku_old;")
print("🗑️ Old 'buku_old' table dropped.")

# 7️⃣ Commit and close
conn.commit()
conn.close()

print("\n✅ Migration complete! 'buku' now references 'rak_mapping(rak_buku)'.")

