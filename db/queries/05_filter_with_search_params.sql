SELECT resources.id, resources.title, resources.user_id, users.username as username, users.profile_pic, resources.category_id, count(liked_resources.resource_id) as number_of_likes, round(avg(resource_ratings.rating),2) as average_rating
FROM resources
LEFT OUTER JOIN liked_resources ON liked_resources.resource_id = resources.id
LEFT OUTER JOIN resource_ratings ON resource_ratings.resource_id = resources.id
LEFT OUTER JOIN users ON resources.user_id = users.id




WHERE resources.category_id = 1
  AND (upper(resources.title) LIKE '%JAVA%' OR upper(resources.description) LIKE '%JAVA%')
  -- AND (liked_resources.user_id = 2 OR resources.user_id = 2)


GROUP BY resources.id, users.username, users.profile_pic,

HAVING avg(resource_ratings.rating) >= 4

ORDER BY number_of_likes DESC, resources.id;
