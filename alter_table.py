import sqlite3

conn = sqlite3.connect('perpustakaan.db')
cursor = conn.cursor()

# Backup existing data
cursor.execute('CREATE TABLE admin_backup AS SELECT * FROM admin')

# Drop the old table
cursor.execute('DROP TABLE admin')

# Recreate without auto-increment (manual ID insertion allowed)
cursor.execute('''
CREATE TABLE admin (
  id INTEGER PRIMARY KEY,  -- No AUTOINCREMENT, so manual IDs are allowed
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)
''')

# Restore data if needed
cursor.execute('INSERT INTO admin (id, username, password) SELECT id, username, password FROM admin_backup')

# Drop backup
cursor.execute('DROP TABLE admin_backup')

conn.commit()
conn.close()

print('Table altered successfully')
