DROP TABLE IF EXISTS resources CASCADE;
CREATE TABLE resources (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  description text,
  url VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  user_id INTEGER REFERENCES users(id)
);
