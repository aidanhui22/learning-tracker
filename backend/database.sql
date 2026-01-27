CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    entry_date DATE UNIQUE NOT NULL,
    learned TEXT NOT NULL,
    reinforced TEXT NOT NULL,
    tomorrow TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entries_date ON entries(entry_date DESC);
