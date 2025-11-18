# simpan sebagai: buat_tabel_rak_mapping.py
import sqlite3

NAMA_DATABASE = "perpustakaan.db"

conn = sqlite3.connect(NAMA_DATABASE)
cursor = conn.cursor()
cursor.execute("PRAGMA foreign_keys = ON;")

cursor.execute('''
    CREATE TABLE IF NOT EXISTS rak_mapping (
        rakmap_id INTEGER PRIMARY KEY AUTOINCREMENT,
        rak_buku TEXT,
        tema TEXT,
        FOREIGN KEY (rak_buku) REFERENCES buku(rak_buku) ON DELETE CASCADE
    )
''')

conn.commit()
conn.close()

print("✅ Tabel 'rak_mapping' berhasil dibuat dan terhubung ke 'buku(rak_buku)'.")
