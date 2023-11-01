SET client_encoding TO UTF8;

COPY (SELECT * FROM teams NATURAL JOIN leagues NATURAL JOIN players) TO 'D:\or_lab.csv' DELIMITER ',' CSV HEADER;

COPY (

SELECT '{"data":' || json_agg(T) || '}'
	FROM (
		SELECT * FROM teams NATURAL JOIN leagues NATURAL JOIN players
) T) TO 'D:\or_lab.json';