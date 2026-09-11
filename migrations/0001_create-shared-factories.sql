-- Migration number: 0001 	 2026-09-10T23:38:44.811Z
CREATE TABLE shared_factories (
    id TEXT PRIMARY KEY NOT NULL,
    state TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    last_viewed_at INTEGER NOT NULL
);
