SELECT resources.id, resources.title, resources.user_id, count(liked_resources.resource_id) as number_of_likes, round(avg(resource_ratings.rating),2) as average_rating
FROM resources
LEFT OUTER JOIN liked_resources ON liked_resources.resource_id = resources.id
LEFT OUTER JOIN resource_ratings ON resource_ratings.resource_id = resources.id
WHERE  liked_resources.user_id = 2
  OR   resources.user_id = 2
GROUP BY resources.id
ORDER BY resources.id;
