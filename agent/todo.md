## Hashim's TODOs

- [✅] DB: Create 'items' and 'assets' tables — Create the database tables. The 'items' table needs columns for id, name, description, and a user_id foreign key. The 'assets' table needs to link items to their thumbnail file paths in GCP.

- [ ] API: Implement CRUD endpoints for Items — Build the RESTful API endpoints for Create, Read (a single item), Update, and Delete operations on the 'items' table, ensuring they are authenticated.

- [ ] API: Implement paginated GET endpoint for Items list — Implement the GET /items endpoint to retrieve a list of items for the authenticated user, with support for pagination to handle large datasets efficiently.

- [ ] API: Implement thumbnail upload to GCP — Create an endpoint that accepts multipart/form-data. This endpoint will handle uploading the image file to Google Cloud Platform storage and creating a corresponding record in the 'assets' table.
