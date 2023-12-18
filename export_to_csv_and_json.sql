SET client_encoding TO UTF8;

COPY (SELECT * FROM team NATURAL JOIN league NATURAL JOIN player) TO 'D:\or_lab.csv' DELIMITER ',' CSV HEADER;

COPY (

SELECT '{"data":' || json_agg(T) || '}'
	FROM (
		SELECT * FROM team NATURAL JOIN league NATURAL JOIN player
) T) TO 'D:\or_lab.json';