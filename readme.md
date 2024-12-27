Tourism Management API

This project provides a RESTful API for managing tourist attractions, visitors, and their reviews. It tracks attractions, allows visitors to post reviews, and manages ratings based on those reviews.

Features

Attraction Management: Add, retrieve, update, and delete tourist attractions.

Visitor Management: Register visitors with unique email validation, retrieve, update, and delete visitor information.

Review Management: Post reviews for attractions, ensuring visitors have visited the attraction and have not reviewed it multiple times.

Rating Calculation: Automatically updates the average rating of attractions based on reviews.

Technologies Used

Node.js: JavaScript runtime environment.

Express.js: Web framework for building the API.

Mongoose: MongoDB object modeling for Node.js.

MongoDB: NoSQL database for data storage.

Installation

Clone the repository:

git clone <repository-url>
cd tourism-management-api

Install dependencies:

npm install

Start MongoDB locally or connect to a MongoDB instance.

Start the server:

npm start

The server will run at http://localhost:3000.

API Endpoints

Attractions

Create an Attraction

POST /api/attractions

Request body:

{
  "name": "Eiffel Tower",
  "location": "Paris, France",
  "entryFee": 25
}

Retrieve All Attractions

GET /api/attractions

Retrieve a Specific Attraction

GET /api/attractions/:id

Update an Attraction

PUT /api/attractions/:id

Delete an Attraction

DELETE /api/attractions/:id

Visitors

Register a Visitor

POST /api/visitors

Request body:

{
  "name": "John Doe",
  "email": "john.doe@example.com"
}

Retrieve All Visitors

GET /api/visitors

Retrieve a Specific Visitor

GET /api/visitors/:id

Update a Visitor

PUT /api/visitors/:id

Delete a Visitor

DELETE /api/visitors/:id

Reviews

Post a Review

POST /api/reviews

Request body:

{
  "attraction": "<attraction-id>",
  "visitor": "<visitor-id>",
  "score": 5,
  "comment": "Amazing experience!"
}

Validation: Ensures the visitor has visited the attraction and hasn't already reviewed it.

Automatic Rating Update: Updates the average rating of the attraction based on all reviews.

Environment Variables

Create a .env file to define the following environment variables:

PORT=3000
MONGO_URI=mongodb://localhost:27017/tourism

Running Tests

To run tests (if applicable):

npm test

License

This project is licensed under the MIT License.