INSERT INTO liked_resources (user_id, resource_id)
    VALUES (1, 2)
    RETURNING (SELECT count(liked_resources.resource_id)
          FROM liked_resources
          GROUP BY resource_id
          HAVING resource_id = 2)
