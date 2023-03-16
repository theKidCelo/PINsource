SELECT resources.*, count(liked_resources.resource_id) as number_of_likes, round(avg(resource_ratings.rating),2) as average_rating
FROM resources
LEFT OUTER JOIN liked_resources ON liked_resources.resource_id = resources.id
LEFT OUTER JOIN resource_ratings ON resource_ratings.resource_id = resources.id
GROUP BY resources.id
ORDER BY number_of_likes DESC
;
