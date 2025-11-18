 # simpan sebagai buat_database_lengkap.py
import csv
import sqlite3

NAMA_FILE_CSV = "KATALOG_2014A.csv"
NAMA_FILE_CSV = "D:\Dokumen\Kerja Praktek\web_katalog\KATALOG_2014A - Copy (4).csv"
NAMA_DATABASE = "perpustakaan.db"

# 1. Baca data dari file CSV
print(f"Membaca data dari {NAMA_FILE_CSV}...")
semua_buku = []
with open(NAMA_FILE_CSV, mode='r', encoding='latin-1') as file:
    reader = csv.DictReader(file, delimiter=';')
    # Membersihkan nama kolom dari spasi ekstra
    reader.fieldnames = [field.strip() for field in reader.fieldnames]
    for row in reader:
        if row.get('JUDUL BUKU'):
            semua_buku.append(row)

# 2. Buat koneksi ke database (file baru akan dibuat)
conn = sqlite3.connect(NAMA_DATABASE)
cursor = conn.cursor()
print(f"Database {NAMA_DATABASE} berhasil dibuat.")

# 3. Buat tabel 'buku' dengan SEMUA kolom dari CSV
print("Membuat tabel 'buku' dengan skema lengkap...")
# Menggunakan `IF NOT EXISTS` untuk keamanan
cursor.execute('''
    CREATE TABLE IF NOT EXISTS buku (
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
        keterangan TEXT
    )
''')

# 4. Masukkan setiap buku ke dalam tabel database
print(f"Memasukkan {len(semua_buku)} data buku ke database...")
for buku in semua_buku:
    cursor.execute('''
        INSERT INTO buku (
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

# 5. Simpan dan tutup
conn.commit()
conn.close()

print("\nMigrasi data dengan skema lengkap selesai!")