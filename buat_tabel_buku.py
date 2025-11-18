# simpan sebagai: buat_tabel_buku.py
import csv
import sqlite3

# --- Konfigurasi ---
NAMA_FILE_CSV = r"D:\Dokumen\Kerja Praktek\web_katalog\KATALOG_2014A - Copy (4).csv"
NAMA_DATABASE = "perpustakaan.db"

print(f"Membaca data dari {NAMA_FILE_CSV}...")
semua_buku = []

# --- Baca CSV dengan delimiter ";"
with open(NAMA_FILE_CSV, "r", encoding="latin-1", newline="") as file:
    reader = csv.reader(file, delimiter=";")
    for row in reader:
        if len(row) >= 19:  # Ensure row has enough columns
            row_dict = {
                'No. Induk': row[0],
                'JUDUL BUKU': row[1],
                'PENGARANG': row[2],
                'PENERBIT': row[3],
                'TEMPAT TERBIT': row[4],
                'TAHUN': row[5],
                'ISBN': row[6],
                'JILID': row[7],
                'EDISI': row[8],
                'CET.': row[9],
                'JUMLAH HAL.': row[10],
                'RAK BUKU': row[11],
                'JUMLAH BUKU': row[12],
                'TINGGI BUKU (cm)': row[13],
                'NOMOR PANGGIL': row[14],
                'INISIAL': row[15],
                'PEROLEHAN': row[16],
                'HARGA': row[17],
                'KET': row[18]
            }
            semua_buku.append(row_dict)

print(f"✅ Total data terbaca: {len(semua_buku)}")

# --- Buat database dan tabel ---
conn = sqlite3.connect(NAMA_DATABASE)
cursor = conn.cursor()

# Drop table if exists
cursor.execute('DROP TABLE IF EXISTS buku')

cursor.execute('''
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
        rak_buku TEXT UNIQUE,   -- unik agar bisa direferensikan
        jumlah_buku TEXT,
        tinggi_buku TEXT,
        nomor_panggil TEXT,
        inisial TEXT,
        perolehan TEXT,
        harga TEXT,
        keterangan TEXT
    )
''')

# --- Masukkan data ---
count_ok, count_fail = 0, 0
for buku in semua_buku:
    try:
        cursor.execute('''
            INSERT OR IGNORE INTO buku (
                no_induk, judul_buku, pengarang, penerbit, tempat_terbit, tahun, isbn, 
                jilid, edisi, cetakan, jumlah_halaman, rak_buku, jumlah_buku, 
                tinggi_buku, nomor_panggil, inisial, perolehan, harga, keterangan
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            buku.get('No. Induk'), buku.get('JUDUL BUKU'), buku.get('PENGARANG'),
            buku.get('PENERBIT'), buku.get('TEMPAT TERBIT'), buku.get('TAHUN'),
            buku.get('ISBN'), buku.get('JILID'), buku.get('EDISI'),
            buku.get('CET.'), buku.get('JUMLAH HAL.'), buku.get('RAK BUKU'),
            buku.get('JUMLAH BUKU'), buku.get('TINGGI BUKU (cm)'), buku.get('NOMOR PANGGIL'),
            buku.get('INISIAL'), buku.get('PEROLEHAN'), buku.get('HARGA'),
            buku.get('KET')
        ))
        count_ok += 1
    except Exception as e:
        print(f"⚠️ Gagal insert data dengan RAK {buku.get('RAK BUKU')}: {e}")
        count_fail += 1

conn.commit()
conn.close()

print(f"🎉 Selesai! {count_ok} buku berhasil ditambahkan, {count_fail} gagal.")
