import sqlite3

conn = sqlite3.connect('perpustakaan.db')
cursor = conn.cursor()

# Get unique rak_buku from buku table, excluding null or empty
cursor.execute("SELECT DISTINCT rak_buku FROM buku WHERE rak_buku IS NOT NULL AND rak_buku != ''")
unique_rak_buku = cursor.fetchall()

# Drop existing rak_mapping table
cursor.execute("DROP TABLE IF EXISTS rak_mapping")

# Create new rak_mapping table
cursor.execute('''
    CREATE TABLE rak_mapping (
        rakmap_id INTEGER PRIMARY KEY AUTOINCREMENT,
        rak_buku TEXT,
        tema TEXT
    )
''')

# Insert unique rak_buku as rak_buku, tema empty
for rak in unique_rak_buku:
    cursor.execute("INSERT INTO rak_mapping (rak_buku, tema) VALUES (?, '')", (rak[0],))

conn.commit()
conn.close()

print("rak_mapping table updated with unique rak_buku from buku table.")
