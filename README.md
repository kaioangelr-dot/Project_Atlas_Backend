# Atlas Backend

Backend for the Atlas application, built with Node.js, Express, and MongoDB. The API provides user authentication, profile management, and collaborative map creation/editing with support for layers, points of interest, drawings, labels, and images.

## Overview

This project serves as the REST API for the Atlas frontend. It covers:

- JWT-based authentication and authorization;
- user registration, login, and profile updates;
- creation, listing, editing, and deletion of maps;
- map likes;
- input validation with Joi + Celebrate;
- MongoDB persistence with Mongoose;
- request and error logging for debugging.

## Technologies

- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Joi + Celebrate
- bcrypt
- CORS
- Winston + Express Winston

## Requirements

- Node.js 18+
- npm
- MongoDB local instance or MongoDB Atlas

## Installation

1. Clone the repository:

```bash
git clone https://github.com/kaioangelr-dot/Project_Atlas_Backend.git
cd Project_Atlas_Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root with the following variables:

```env
NODE_ENV=development
JWT_SECRET=your_secret_key_here
MONGO_URI=mongodb://localhost:27017/atlas
PORT=3000
```

> If you are using MongoDB Atlas, replace `MONGO_URI` with your cluster connection string.

4. Start the application:

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The API will be available at `http://localhost:3000` by default.

## Scripts

```bash
npm run dev   # starts the app with nodemon
npm start     # starts the app in production mode
npm run lint  # runs ESLint
```

## Project structure

```
Project_Atlas_Backend
├─ .editorconfig
├─ .eslintrc
├─ .prettierrc
├─ app.js
├─ controllers
│  ├─ maps.js
│  └─ users.js
├─ errors
│  ├─ BadRequestError.js
│  ├─ ConflictError.js
│  ├─ ForbiddenError.js
│  ├─ NotFoundError.js
│  └─ UnauthorizedError.js
├─ middlewares
│  ├─ auth.js
│  └─ logger.js
├─ models
│  ├─ map.js
│  └─ user.js
├─ package-lock.json
├─ package.json
├─ README.md
└─ routes
   ├─ maps.js
   └─ users.js

```

## Authentication

Authentication is handled via JWT using the `Authorization` header:

```http
Authorization: Bearer <token>
```

The `auth.js` middleware validates the token and populates `req.user` with the authenticated user data.

## API endpoints

### Authentication

#### `POST /signup`

Creates a new user.

Request body:

```json
{
  "name": "Myname",
  "email": "Myname@email.com",
  "password": "myPassword123",
  "avatar": "https://example.com/avatar.com"
}
```

Response: created user with status `201`.

#### `POST /signin`

Logs in a user and returns a JWT token.

Request body:

```json
{
  "email": "Myname@email.com",
  "password": "myPassword123"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Users

#### `GET /users`

Lists all users.

#### `GET /users/me`

Returns the authenticated user.

#### `GET /users/:id`

Fetches a user by ID.

#### `PATCH /users/me`

Updates the authenticated user's name.

Request body:

```json
{
  "name": "Myname"
}
```

#### `PATCH /users/me/avatar`

Updates the authenticated user's avatar.

Request body:

```json
{
  "avatar": "https://example.com/avatar.com"
}
```

### Maps

#### `GET /maps`

Lists all registered maps in descending creation order.

#### `POST /maps`

Creates a new map. Requires authentication.

Example request body:

```json
{
  "name": "City map",
  "image": "https://example.com/map-preview.com",
  "map": {
    "layers": [
      {
        "id": 1,
        "name": "Base",
        "visible": true,
        "pins": [
          {
            "id": 1,
            "x": 120,
            "y": 240,
            "name": "Point A",
            "description": "Point description",
            "photo": ""
          }
        ],
        "drawings": [],
        "labels": [],
        "images": []
      }
    ]
  }
}
```

#### `GET /maps/:mapId`

Returns a specific map.

#### `PATCH /maps/:mapId`

Updates an existing map. Requires authentication and ownership of the map.

#### `DELETE /maps/:mapId`

Deletes a map. Requires authentication and ownership.

#### `PUT /maps/:mapId/likes`

Adds a like to the map.

#### `DELETE /maps/:mapId/likes`

Removes a like from the map.

## Main models

### User

```js
{
  name: String,
  avatar: String,
  email: String,
  password: String,
}
```

Validations:

- email must be valid and unique;
- password minimum length is 8 characters;
- name length must be between 2 and 30 characters;
- avatar must be a valid HTTP/HTTPS URL or image data URI.

### Map

```js
{
  name: String,
  image: String,
  map: {
    layers: [
      {
        id: Number,
        name: String,
        visible: Boolean,
        pins: [],
        drawings: [],
        labels: [],
        images: []
      }
    ]
  },
  owner: ObjectId,
  likes: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## Error handling

The application uses custom errors to standardize HTTP responses:

- `400 Bad Request` for invalid data;
- `401 Unauthorized` for authentication failures;
- `403 Forbidden` for unauthorized access;
- `404 Not Found` when a resource does not exist;
- `409 Conflict` when there is a data conflict (for example, duplicate email).

## Notes

- The server uses the `PORT` value from `.env`, with a default of `3000`.
- `JWT_SECRET` should be configured in production with a strong, secure value.
- `NODE_ENV` can be used to distinguish development and production environments.

## License

This project is licensed under the ISC license.
