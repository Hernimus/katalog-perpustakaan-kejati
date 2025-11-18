import sqlite3

conn = sqlite3.connect('perpustakaan.db')
cursor = conn.cursor()

# Create rak table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS rak (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT UNIQUE,
        tema TEXT
    )
''')

# Define RAK_TEMA mapping
RAK_TEMA = {
    "10A": "Ensiklopedia",
    "11B": "Hukum Perdagangan",
    "1A": "Ensiklopedia",
    "1B": "Politik",
    "1C": "Kamus",
    "1D": "Cyber Crime",
    "1E": "Hukum Islam",
    "1F": "Hukuman Internasional",
    "1G": "Hukum Lingkungan",
    "1H": "Kamus",
    "2B": "Pidana Khusus",
    "2C": "Acara Pidana",
    "2F": "Peradilan Militer",
    "3A": "Perdata",
    "3B": "Acara Perdata",
    "3C": "Hukum Perusahaan",
    "3E": "Hukum Pertahanan",
    "3F": "Hukum Dagang",
    "3G": "Tata Negara",
    "4B": "Undang-Undang/Peraturan",
    "4C": "KUHP/KUHAP",
    "4D": "Kepailitan",
    "4F": "HAM/PNS",
    "5B": "Ilmu Hukum",
    "5C": "Konsumen/PT",
    "5F": "Perpajakan",
    "6A": "Komisi Kejaksaan",
    "6B": "Kejaksaan",
    "6D": "Kejaksaan Ja",
    "6E": "Juknis Perkara Pidum",
    "6G": "Persetujuan MOU",
    "6H": "Juknis Perkara Pidsus",
    "7A": "Sastra Islam dan Agama",
    "7B": "Haki",
    "7D": "Filsafat",
    "7E": "Biografi dan Keuangan/Perbankan",
    "7F": "Hukum Laut dan Manajemen",
    "7H": "Narkotika",
    "9F": "Peraturan Pemerintah",
    "9G": "Undang-Undang",
    "9H": "Peraturan Presiden",
    "10B": "Seni dan Sastra",
    "12A": "Sejarah"
}

# Insert rak data
for nama, tema in RAK_TEMA.items():
    cursor.execute('''
        INSERT OR IGNORE INTO rak (nama, tema) VALUES (?, ?)
    ''', (nama, tema))

conn.commit()
conn.close()

print("Rak table created and populated successfully.")
