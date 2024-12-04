# ChessMasters

**ChessMasters** is a comprehensive online platform for chess enthusiasts of all skill levels. Whether you're a beginner looking to learn the basics or a seasoned player aiming to sharpen your strategies, ChessMasters has something for everyone. The platform enables players to enjoy chess matches in real time, connect with expert coaches for personalized mentoring, and access a treasure trove of educational resources including videos and articles.

## Features

- **Play Chess:** Enjoy seamless and interactive chess gameplay with other players.
- **Coaching Services:** Connect with experienced coaches who can guide and mentor you to improve your skills.
- **Educational Resources:** Gain access to curated articles and videos created by expert coaches.
- **User-Friendly Interface:** An intuitive and responsive interface for effortless navigation.

## Technologies Used

ChessMasters leverages a modern tech stack to provide a seamless and interactive experience. Key technologies include:

- **React**: For building the user interface and creating dynamic, responsive components.
- **Node.js**: Backend runtime for managing the server and API interactions.
- **Chess.js**: To handle chess logic such as move validation, check, checkmate, and other rules.
- **react-chessboard**: For rendering an interactive chessboard with smooth drag-and-drop functionality.
- **React Router**: For efficient routing and navigation across the platform.
- **Axios**: For making API requests between the frontend and backend.
- **Express.js**: Framework for setting up the server and handling requests.
- **MongoDB**: As the database for storing user profiles, coach content, and game data.

## Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

- Node.js and npm installed on your system.

---

### Installation Instructions

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd ChessMasters

   ```

2. **Install Dependencies**

   -Run the following command in the root folder

   npm install

   - Navigate to the Backend folder and install dependencies

   cd Backend
   npm install

3. **Run the Project**

   - In the client side directory :

   npm run dev

   - In the Backend directory :

   node server.js

4. **Logging in as coach/player/admin**

   -coach/player: select userType coach -> signup -> and login with coach credentials -> you can verify the same from database
   -admin: login with: username-admin, password - secret