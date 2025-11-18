-- Backup existing data
CREATE TABLE admin_backup AS SELECT * FROM admin;

-- Drop the old table
DROP TABLE admin;

-- Recreate without auto-increment (manual ID insertion allowed)
CREATE TABLE admin (
  id INTEGER PRIMARY KEY,  -- No AUTOINCREMENT, so manual IDs are allowed
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Restore data if needed
INSERT INTO admin (id, username, password) SELECT id, username, password FROM admin_backup;

-- Drop backup
DROP TABLE admin_backup;
