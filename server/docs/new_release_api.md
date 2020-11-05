# Initial Version

A flow using Prefect that supports the nightly data ingestion for the 311 API.

Will download additions/changes in 311 data from the Socrata Open Data endpoint and add them
to the Postgres database. The flow will also do the maintenance tasks of refreshing any views
and vacuuming and analyzing the database.

The flow has a detailed running log and will output status to the database and Slack.
