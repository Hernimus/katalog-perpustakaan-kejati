import sqlite3

def analyze_database(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables in database:")
    for table in tables:
        print(f"  - {table[0]}")

    print("\n" + "="*50 + "\n")

    # Analyze each table (skip sqlite_sequence as it's internal)
    for table in tables:
        table_name = table[0]
        if table_name == 'sqlite_sequence':
            continue

        print(f"Analyzing table: {table_name}")

        # Get schema
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        print("Schema:")
        for col in columns:
            print(f"  - {col[1]} ({col[2]}) {'PRIMARY KEY' if col[5] else ''}")
        print()

        # Get row count
        cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
        count = cursor.fetchone()[0]
        print(f"Row count: {count}")
        print()

        # Show sample data (first 5 rows)
        cursor.execute(f"SELECT * FROM {table_name} LIMIT 5")
        rows = cursor.fetchall()
        if rows:
            print("Sample data (first 5 rows):")
            # Get column names
            col_names = [col[1] for col in columns]
            print(" | ".join(col_names))
            print("-" * (sum(len(col[1]) for col in columns) + 3 * (len(col_names) - 1)))
            for row in rows:
                print(" | ".join(str(cell) for cell in row))
        else:
            print("No data in table.")
        print("\n" + "="*50 + "\n")

    conn.close()

if __name__ == "__main__":
    analyze_database('perpustakaan.db')
