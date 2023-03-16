DROP TABLE IF EXISTS liked_resources CASCADE;
CREATE TABLE liked_resources (
  PRIMARY KEY (resource_id, user_id),
  resource_id INTEGER REFERENCES resources(id),
  user_id INTEGER REFERENCES users(id)
);
