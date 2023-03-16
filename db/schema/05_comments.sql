-- Drop and recreate Widgets table (Example)

DROP TABLE IF EXISTS comments CASCADE;
CREATE TABLE comments (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  resource_id INTEGER REFERENCES resources(id),
  comment TEXT NOT NULL,
  comment_date TIMESTAMP
);
