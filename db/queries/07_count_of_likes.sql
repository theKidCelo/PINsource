SELECT resources.id, count(liked_resources.resource_id)
FROM resources
LEFT OUTER JOIN liked_resources ON resources.id = resource_id
GROUP BY resources.id
ORDER BY resources.id;
