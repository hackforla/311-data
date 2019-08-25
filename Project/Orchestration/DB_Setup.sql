CREATE MATERIALIZED VIEW broad_call_volume AS
SELECT
COUNT("SRNumber") as CallVolume,
"NCName",
"RequestType"
FROM service_requests
WHERE
("RequestType" <> '') IS NOT False
AND
("NCName" <> '') IS NOT False
GROUP BY "NCName", "RequestType"
ORDER BY "NCName", CallVolume DESC


CREATE MATERIALIZED VIEW total_calls AS
SELECT "NCName", SUM(callvolume) as totalcalls FROM broad_call_volume
GROUP BY "NCName"
ORDER BY totalcalls DESC;

CREATE MATERIALIZED VIEW top_request_by_nc AS
SELECT "NCName", "RequestType", count("SRNumber") as count
FROM service_requests as t1
WHERE
("RequestType" <> '') IS NOT False
AND
("NCName" <> '') IS NOT False
GROUP BY "RequestType", "NCName"
HAVING t1."RequestType" = (SELECT tt1."RequestType"
                    FROM service_requests as tt1
                    WHERE tt1."NCName" = t1."NCName"
                    GROUP BY tt1."RequestType"
                    ORDER BY COUNT(*) DESC, tt1."RequestType"
                    LIMIT 1
                   )
ORDER BY count DESC

CREATE INDEX SRNumber on service_requests ("SRNumber")
CREATE INDEX RequestType on service_requests ("RequestType")
CREATE INDEX NCName on service_requests ("NCName")
