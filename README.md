<img src="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg" width="250" alt="MapStuff.io Logo">


# MapStuff.io

## Maps for apps!

## Store Locator / Mapping that gives the user embeddable code that can be added to any website / app. 

Step 1: user registers for an account and is auto placed in the "Free" plan

Step 2: user logins and builds their map app

Step 3: user embeds their map app in their external website or app

* Users can edit their map anytime on MapStuff.io/dashboard and updates will be auto shown wherever they have embedded their map app.

* Upgrading plans can be done at anytime.

* Downgrading is not possible yet.

## STACK
- ReactJS (18.2)
-- React Widgets for embeddable functionality
- [NEXT.JS](https://nextjs.org/) (13.0.7)
- NodeJS
- MongoDB App Services (formerly 'Realm')
- GraphQL
- Apollo
- Auth0
- Tailwind CSS, Tailwind UI, Headless UI

## APIs
- Mapbox

## AUTH
- MongoDB Realm ( Used for connecting the app to the database )
- @auth0/nextjs-auth0 and realm custom JWT authorization.
  Right now we are not fetching from users collection we are just creating a valid jwt token to pass to realm custom JWT.

### TO USE REALM CUSTOM JWT ( Used for Authentication )

- We are using the Manually Specify Signing Keys HS256 Algorithm.
- We need to add first a signing key on realm. If we don't see a dropdown of the signing key, we need to create it first.
- Signing keys are stored on secrets of realm app. see image.png
- We are using JWK URI for the verification mode, the value for the JWK Uri field https://YOUR_DOMAIN/.well-known/jwks.json (example: https://mapstuff-dev.us.auth0.com/.well-known/jwks.json ) 


**ON REGISTRATION WE ARE USING** (API Key) provided on .env
https://docs.mongodb.com/realm/web/authenticate#api-key

**ON SIGN IN WE ARE USING** (Custom JWT) from @auth0/nextjs-auth0 (https://www.npmjs.com/package/@auth0/nextjs-auth0)
https://docs.mongodb.com/realm/web/authenticate#custom-jwt

- JWT_SIGNING_PRIVATE_KEY should be provided on .env. Get this from the realm app.

## USER STRIPE SUBSCRIPTION
We are fetching the users subscription (for some UI conditions) from stripe API.
this is another layer of security (eg. if we change the plan directly from stripe dashboard of a particular customer, it will reflect right away on users dashboard), and we can be sure that our stripe customer data is acurate.

## PACKAGE

- React Home (https://react-select.com/home) - Multi and grouped dropdown for assigning tags to locations

- Auth0 https://www.npmjs.com/package/@auth0/nextjs-auth0() - Package used for authentication 

## PLUGINS

- @tailwindcss/ui
- @tailwindcss/typography
- @tailwindcss/colors
- @tailwindcss/forms
- @tailwindcss/aspect-ratio
- @tailwindcss/line-clamp

## DATA

### GraphQL

- used for 'fetch'

- used for all other CRUD operations

- used for 'mutations' with array type field

- used for filtering locations

### Features added in the CMS part of the site
For new features added to the map settings, always update the **plans-acl** collection and regenerate the schema.

## USING NEXT-LINK AS REDIRECT
Right now we have issue if we use next-link then route to a page that needs to fetch data from realm (ex. /apps/url-name).
We can use this now for pages that dont need data fetching. like (apps/add) 

# SETUP

## ENV
Duplicate .env.example & rename to .env for dev and local development. See bitwarden entry for list of variables and values.

## MongoDB & Realm

1. Log in to MongoDB Atlas.
2. Create a new project.
3. Create database.
4. Import collection.
5. Create index. This is to ensure certain fields will have unique values.  
  - Users collection. Set the **id** and **email** to **unique**. Set **username** to **unique** and **partial**.
  
  <img src="http://drive.google.com/uc?export=view&id=1Nc57EnPP0Zpd63opyj6JImrPp4PMPMcY" alt="create index for users">

  for email index
  https://trello-attachments.s3.amazonaws.com/5bb1fd4d0ffeab7f78c03779/60344c16323738134a5fe18d/ad55085285e8c0a07364bf4b5c0f1736/image.png
  for username index
  https://trello-attachments.s3.amazonaws.com/5bb1fd4d0ffeab7f78c03779/60344c16323738134a5fe18d/e084d5ed42a3c754b8b005d73c01c8c9/image.png
  
  - Apps collection. Set the **id** and **app_url** to **unique**.
  
  <img src="http://drive.google.com/uc?export=view&id=13nDM3EeDU_XmabSTG6TvwY6zWPYP6qFR" alt="create index for apps"> 
  for app_url index.
  https://trello-attachments.s3.amazonaws.com/5bb1fd4d0ffeab7f78c03779/60344c16323738134a5fe18d/dd4b47dfdf917cb5046a33cbb123dc57/image.png

  
  
6. Create a new Realm App. _(Not sure if this is here or after creating new project.)_
7. Note App ID and add it to your .env

### Deployment Settings
1. Go to **Deploy**. Then, to **Configuration**.

  <img src="http://drive.google.com/uc?export=view&id=1AA1u5yoXDBv9HlFOybqPdA8cq2bo9sGd" alt="drafts is disabled">
  
2. **Disable Drafts**

  <img src="http://drive.google.com/uc?export=view&id=1Z11LVQr-ebPfukUcsZTyez-msaGzM15r" alt="drafts is disabled">

### Schema and Rules
To link datasource, create collection (step 4), schema and rules.

Our database consists of 4 collections ["apps","locations","plans-acl","users"].
CREATE these 4 collections then import if we have existing data. (I think its okay if we use empty collection, as long as we copy the schema advance mode, if error lets do it basic mode..)

ADDING RULES AND SCHEMA ADVANCE MODE.
_From dev: I think this is the fastest way to add rules and schema if from scratch._
1. Create Apps collection in Atlas.
  
  see https://trello-attachments.s3.amazonaws.com/5bb1fd4d0ffeab7f78c03779/60344c16323738134a5fe18d/48d8563e8aa6b99577209bdb9951f8c4/image.png
  
  see https://trello-attachments.s3.amazonaws.com/5bb1fd4d0ffeab7f78c03779/60344c16323738134a5fe18d/3316d46453aa70bcf4ed4b2a025de75f/image.png

2. Copy /nosql_schema/apps-schema.json > paste it > save. 
3. Checking if success.
  - Navigate to GraphQl then try to search "apps"
  https://trello-attachments.s3.amazonaws.com/5bb1fd4d0ffeab7f78c03779/60344c16323738134a5fe18d/d868364b088c4c8cc33d3a8a5594d411/image.png
4. Repeat for the other collections
  - locations using "/nosql_schema/locations-schema.json"
  - plans-acl using "/nosql_schema/plans-acl-schema.json"
  - users using "/nosql_schema/users-schema.json"

ADDING RULES AND SCHEMA BASIC MODE.
1. Create apps collection.
2. Import data for each collection but should have at least one data, so we can auto generate schema.

  ADD RULES - https://trello-attachments.s3.amazonaws.com/5bb1fd4d0ffeab7f78c03779/60344c16323738134a5fe18d/572600e33329fea94b601023cb367dcb/image.png
  
  GENERATE SCHEMA - https://trello-attachments.s3.amazonaws.com/5bb1fd4d0ffeab7f78c03779/60344c16323738134a5fe18d/ddc9175be60a5824a246ae44a354476f/image.png

3. Save
4. Repeat for the other collections
  - locations
  - plans-acl
  - users 

Here's a sample when a schema is generated already.

  <img src="http://drive.google.com/uc?export=view&id=1MfxBkRmo3VS3LLk-TDklYJk3bEnXE-Mb" alt="generated schema"> 
  
### Auth Settings
For API key - user is not logged in (example: user registration, sign in, etc .. )
1. In MongoDb, go to **Authentication**. Then, **Authentication Providers**
2. Set **API Keys** to **On**.
3. **Create API Key**. Note the key and add it to your .env. Save in BitWarden as well.

#### Allowed Callback URLs
http://localhost:3000/api/auth/callback, https://mapstuff.io/api/auth/callback, https://mapstuff-io-68tmj.ondigitalocean.app/api/auth/callback

#### Allowed Logout URLs
http://localhost:3000/, https://mapstuff.io/, https://mapstuff-io-68tmj.ondigitalocean.app/

#### Allowed Web Origins
http://localhost:3000/, https://mapstuff.io/, https://mapstuff-io-68tmj.ondigitalocean.app/


### User Role Management

**MongoDB**
1. Collection > Users
2. Filter for the user you'd like to edit
```{ email: 'kevin+mapstuff-dev-admin@cinnamon.digital' }```
3. Add a new field called:
```role_id: 1``` (Int32)
4. Update

**Auth0**
1. User Management > User
2. Click on the user
3. Under the 'Details' tab > app_metadata add
```{
  "role": "Admin"
}```

## DNS

## SERVER
Setup a new App in Digital Ocean or the provider of your choice.

## CI/CD
1. Select repo
2. Select a branch
3. Check auto deploy changes
4. Set env variables (from env file, values in Bitwarden)
5. Set to HTTP Port to 3000
6. Choose plan

# To run app locally
1. Clone the repo
2. Switch to the given branch (ask your Project Manager for this branch)
3. Copy '.env.example' > '.env'
4. Open bitwarden entry 'dev.MapStuff.io | .env (Developer Edition)' and copy .env info
5. Run `yarn install --network-timeout 1000000`
6. Run `yarn run dev`

# User Role Management

## Set 'admin' role

### **MongoDB**

*No longer needed to manage roles

~~1. Collection > Users~~

~~2. Filter for the user you'd like to edit~~

~~```{ email: 'kevin+mapstuff-dev-admin@cinnamon.digital' }```~~

~~3. Add a new field called:~~

~~```role_id: 1``` (Int32)~~

~~4. Update~~

### **Auth0**
1. User Management > User
2. Click on the user
3. Under the 'Details' tab > app_metadata add

    ```
    {
   "role": "Admin"
    }
    ```

# Access 'admin' pages locally
1. Look for this code: 

    ```
    if(!role.includes('Admin')) return <p>Access Denied</p>;
    ```
1. Comment it out to remove the 'admin' requirement
1. Code stuff!
1. Test. The link probably won't be in the navigation, but the page should still be accessible.  
1. Don't forget to 'uncomment' before pushing your commits

# IMPORTING REQUIRED DATA
import DB/collection/plans-acl.json to plans-acl collection then add in the price_id directly into the collection

# Demo page
Demo page is using the following embed code to generate the map:

Dev environment
```
<div>
  <div id="map-mapstuff"></div> 
  <script src="https://cdn.gangnam.club/widget/plugins.js"></script> 
  <script src="https://cdn.gangnam.club/widget/mapbox2.js"  data-id="dev-store-locator-react" data-app="6196d58ca0c7a5b108a6ae0a" data-key="9WalmkQITagYlrDSSa5ijyzkJVC75cFjOConR2N2GXAfTvzeT1viSyv5hEnOaket"></script>
</div>
```

# Generating a preview of the map and widget in the app

The app widget with the embed code and the map on the map settings are coming from different areas of the repo.

The **mapbox.css** files in both locations should be identical.

## Map in the Settings page

- This is the map that appears in the Map Settings /dashboard/map-settings page
- Files are located in **/styles**
- Edit the following files to reflect on the map
    - mapbox.css

## Map Widget

- This is the map that is being generated by the embed code
- Files are located in **/public/widget**
- Go to the required CDN location (listed below depending on the environment).
    - When updating the files, put the existing working files into the **__previous-version_** folder as a backup.
    - Upload the new files
    - If the new files don't work, delete them and move the files you put in the "previous_version" folder into the widget folder 
- Copy these files in the CDN location.
    - close.svg
    - mapbox.css    
    - mapbox2.js
    - marker.svg
    - plugins.js - check this file and update this URL in the file according to the environment you are updating
      
      - Dev - https://cdn.gangnam.club/widget/mapbox.css
      - Prod - https://cdn.gangnam.club/widget/mapbox.css

- Purge the CDN files several times once uploaded
- When these files are updated in the CDN, it will not trigger a deployment for the app (no reason to) but this should update the app still automatically with the changes in the file uploaded.

### Dev CDN location

https://cloud.digitalocean.com/spaces/cinnamon/spaces/cinnamon/dev.mapstuff.io/widget

### Prod CDN location

https://cloud.digitalocean.com/spaces/cinnamon/spaces/cinnamon/mapstuff.io/widget

# Map Features

## CMS for plan feature and settings
All features are determined per plan in the CMS area of the site https://mapstuff.io/dashboard/admin/cms/plans

### Features with default values being fetched in the env file

## Bulk uploading
- Accepts xlsx or csv file
- Max number of locations is determined in the CMS page 
- Only active locations count for the number of locations. If number of active locations is equal or more than the max locations,
  - user cannot add a new location whether by manually adding or bulk upload.
  - user cannot edit location from **Unpublished** to **Published** if publishing that location will exceed the max locations

## Exporting - not yet implemented

## Map provider
Currently, this is set up for a Mapbox API key only.

## Theme color
Theme color applies to the sidebar (for listings) header and pop-up info window header.

### Location name color
The location name in the sidebar listings can also be edited but not part of the CMS.

## Map Height
Changeable map height.

## Marker
- Currently not editable on the map settings area. Future feature.
- We have the marker.js file in the CDN

## Map Styles
These are the styles from Mapbox: satellite, light, dark, streets, outdoors.

## Tags and Filter
Create group of tags that are made into filters. Assign created tags to locations.

## Multiple apps per user account - not yet implemented for users
But working for admin accounts already.

### Embeddable Map for Nuxt3 w/TypeScript
Right way of adding the embed code from https://mapstuff.io/.
`div id` will be in the template area while the `script` will be in the script area. Update the `data-app` if using a different account from MapStuff app.

```
<template>
  <div>
    <div id="map-mapstuff"></div> 
  </div>
</template>

<script lang="ts">
export default {
  setup () {
    useMeta({
      script: [
        { 
          hid: 'mapstuff',
          src: 'https://cdn.gangnam.club/widget/plugins.js',
        },
        { 
          hid: 'mapstuff2',
          src:'https://cdn.gangnam.club/widget/mapbox2.js',
          'data-id': 'dev-store-locator-react',
          'data-app': '[FROM MAPSTUFF]',
          'data-key': '[FROM MAPSTUFF]'
        }
      ]
    })
  }
}
</script>
```

# Translation

## Adding new words (key) in the translation file

1. Go to en.json and add the key that you want to add (ex. "header": "Header") 
1. Go to the other .json file in the translation folder and add the key as well and the corresponding value
1. Go to the react component where you want to add the new key in the translation file and check if the ```{ t } = useTranslation``` is already existing, if not.
  
   1. import the code below ```import { useTranslation } from "react-i18next";```
   1. Inside the component, add  ```const { t } = useTranslation();```
   1. Add the translation key in the return of the component ex. ```<button>{t('header')}</button>```


## Adding new language

1. Create a new json file or copy the existing json files and then rename it to the new language 
1. Go to LanguageDropdown.js and and the language in the options, the value of the newly added language should be the filename of the translation file, 
   for example, fr.json is the title of the new language, the you should add { value: "fr", label: "French" }, in the options dropdown

# Demo

Demo page https://mapstuff.io/demo is using a MapStuff app from UAT. This means the data-key is from UAT as well. The js files are from https://cdn.gangnam.club/widget/ location.
