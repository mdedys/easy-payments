# @easy-payments/api

Required ENV variables:
- NODE_ENV=development
- FAUNADB_DB_NAME
- FAUNADB_SECRET
- STRIPE_API_KEY

## How to fix errors

`docker-compose up` fails due to not enough space available for cassandra to write data when faunadb starts

> Open up docker and give it more space under: `Disk Image Size`
