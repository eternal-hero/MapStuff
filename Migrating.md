# Migrating the site

## General Notes

- MongoDB > Realm > Authentication > Authentication Providers > Custom JWT Authentication > Use a JWK URI

- Manually specify signing keys is NOT used

- MongoDB > Atlas > RealmCluster > Browse Collections > Users
The 1st user ALWAYS has to have this info:
email: "admin@cinnamondigital.com"
realm_api_key:"[add the key from the .env "REALM_APP_KEY" here]"

- The above may have been updated to admin@cinnamon.digital and hardcoded in the MapStuff.io\graphql\dashboard\map-preview\user.query.js file as admin@cinnamon.digital

- Owner and Admin Roles are manually set in Auth0. Do NOT remove the "User" role... just add the other roles when needed. The role data is not saved in the MongoDB Atlas Collection.

## Stripe

When changing over to LIVE keys, you have to update the following

- .env variables; STRIPE_PRICE_FREE, STRIPE_PRICE_LITE, STRIPE_PRICE_PLUS

- MongoDB > Atlas > RealmCluster > Browse Collections > plans-acl > price_id

## Code

- In components\dashboard\map-embed-code\MapEmbedCode.js update the data-key=""