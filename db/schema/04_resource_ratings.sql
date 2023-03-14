DROP TABLE IF EXISTS resource_ratings CASCADE;
CREATE TABLE resource_ratings (
  PRIMARY KEY (resource_id, user_id),
  rating SMALLINT,
  resource_id INTEGER REFERENCES resources(id),
  user_id INTEGER REFERENCES users(id)
);
