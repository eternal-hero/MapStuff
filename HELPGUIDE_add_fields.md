How to Add a New Field to a Collection

1. Add the new field to the Collection
MongoDB  >  Atlas  >  plans-acl  >  "edit" 1 document  >  add new fields  >  "update"  >  repeat for each document

2. Update Schema in MongoDB
MongoDB  >  App Services (Realm)  >  click on the App  >  Schema  >  plans-acl  >  "Generate Schema"
- If "Generate Schema" doesn't add the new field, then manually add  >  "Run Validation"  >  Save / Deploy
- Copy the new Schema from MongoDB (needed for step 3)

3. Update Schema in Code
Open Repo  >  MapStuff.io\DB\graphql_schema\plans-acl-schema.json  >  paste new Schema that you copied from step 2  >  Save  >  Commit

*App Services takes a while to update so if you encounter any errors wait a little longer and try again.