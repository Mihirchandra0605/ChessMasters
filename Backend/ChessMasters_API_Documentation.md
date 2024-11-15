
# API Documentation

## Admin Routes

### POST /admin/login
- **Description:** Admin login route.
- **Payload:**
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  - Success: `200 OK` with token and message.
  - Failure: `401 Unauthorized` or `500 Internal Server Error`.

### DELETE /admin/users/:playerId
- **Description:** Deletes a player by playerId.
- **Response:**
  - Success: `200 OK` with message.
  - Failure: `500 Internal Server Error`.

### DELETE /admin/coaches/:coachId
- **Description:** Deletes a coach by coachId.
- **Response:**
  - Success: `200 OK` with message.
  - Failure: `500 Internal Server Error`.

### DELETE /admin/articles/:articleId
- **Description:** Deletes an article by articleId.
- **Response:**
  - Success: `200 OK` with message.
  - Failure: `500 Internal Server Error`.

### DELETE /admin/games/:gameId
- **Description:** Deletes a game by gameId.
- **Response:**
  - Success: `200 OK` with message.
  - Failure: `500 Internal Server Error`.

### GET /admin/coaches
- **Description:** Fetches all coaches.
- **Response:**
  - Success: `200 OK` with list of coaches.
  - Failure: `500 Internal Server Error`.

### GET /admin/players
- **Description:** Fetches all players.
- **Response:**
  - Success: `200 OK` with list of players.
  - Failure: `500 Internal Server Error`.

### GET /admin/games
- **Description:** Fetches all games.
- **Response:**
  - Success: `200 OK` with list of games.
  - Failure: `500 Internal Server Error`.


## Auth Routes

### POST /auth/register
- **Description:** Registers a new user.
- **Payload:**
  ```json
  {
    "username": "user123",
    "email": "user@example.com",
    "password": "password123",
    "role": "Player/Coach",
    "fideId": "optional (for Coach role)"
  }
  ```
- **Response:**
  - Success: `201 Created` with message.
  - Failure: `500 Internal Server Error` or `400 Bad Request` (if email already registered).

### POST /auth/signin
- **Description:** Signs in a user.
- **Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  - Success: `200 OK` with token.
  - Failure: `401 Unauthorized` or `500 Internal Server Error`.

### POST /auth/logout
- **Description:** Logs out the user.
- **Response:**
  - Success: `200 OK` with message.

### PUT /auth/editdetails
- **Description:** Edits user details.
- **Payload:**
  ```json
  {
    "email": "user@example.com",
    "userData": {
      "UserName": "newUsername",
      "Password": "newPassword"
    }
  }
  ```
- **Response:**
  - Success: `200 OK` with updated user details.
  - Failure: `400 Bad Request` or `404 Not Found`.


## Coach Routes

### GET /coach/details
- **Description:** Fetches the coach details of the logged-in coach.
- **Response:**
  - Success: `200 OK` with coach details.
  - Failure: `404 Not Found` or `500 Internal Server Error`.

### GET /coach/subscribedPlayers
- **Description:** Fetches all players subscribed to the logged-in coach.
- **Response:**
  - Success: `200 OK` with list of subscribed players.
  - Failure: `500 Internal Server Error`.

### POST /coach/article
- **Description:** Adds a new article by the logged-in coach.
- **Payload:**
  ```json
  {
    "title": "Article Title",
    "content": "Article content here."
  }
  ```
- **Response:**
  - Success: `201 Created` with message.
  - Failure: `500 Internal Server Error`.


## Game Routes

### POST /game
- **Description:** Creates a new game.
- **Payload:**
  ```json
  {
    "playerWhite": "player1Id",
    "playerBlack": "player2Id",
    "winner": "player1Id",
    "moves": "e4 e5 Nf3 Nc6 ...",
    "additionalAttributes": {}
  }
  ```
- **Response:**
  - Success: `201 Created` with game details.
  - Failure: `500 Internal Server Error`.

### GET /game/:gameId
- **Description:** Fetches details of a specific game.
- **Response:**
  - Success: `200 OK` with game details.
  - Failure: `404 Not Found` or `500 Internal Server Error`.

### GET /game
- **Description:** Fetches all games.
- **Response:**
  - Success: `200 OK` with list of games.
  - Failure: `500 Internal Server Error`.

## Player Routes

### POST /player/subscribe
- **Description:** Subscribes a player to a coach.
- **Payload:**
  ```json
  {
    "coachId": "coachId"
  }
  ```
- **Response:**
  - Success: `200 OK` with message.
  - Failure: `500 Internal Server Error`.

### GET /player/subscribedCoaches
- **Description:** Fetches all coaches the player is subscribed to.
- **Response:**
  - Success: `200 OK` with list of subscribed coaches.
  - Failure: `500 Internal Server Error`.

