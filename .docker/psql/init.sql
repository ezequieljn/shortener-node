CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c db;

CREATE TABLE IF NOT EXISTS
    shortener (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
        url varchar(255) NOT NULL,
        alias varchar(15) NOT NULL UNIQUE,
        visitor_counter int NOT NULL,
        created_at date NOT NULL
    );