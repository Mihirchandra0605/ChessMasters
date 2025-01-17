# ChessMasters

**ChessMasters** is a comprehensive online platform designed for chess enthusiasts of all skill levels. Whether you're a beginner eager to learn the basics or an advanced player looking to refine your strategies, ChessMasters offers a variety of features to enhance your chess experience. The platform allows players to engage in real-time chess matches, connect with expert coaches for personalized mentoring, and access a wealth of educational resources, including videos and articles.

## Features

- **Play Chess:** Engage in seamless and interactive chess gameplay with other players.
  
- **Coaching Services:** Connect with experienced coaches who provide guidance and mentorship to improve your skills.
  
- **Educational Resources:** Access curated articles and videos created by expert coaches to enhance your understanding of the game.
  
- **User-Friendly Interface:** Navigate the platform effortlessly with an intuitive and responsive interface.

## Technologies Used

ChessMasters utilizes a modern tech stack to deliver a smooth and interactive user experience. Key technologies include:

- **React:** For building the user interface and creating dynamic, responsive components.
  
- **Node.js:** Serves as the backend runtime for managing server operations and API interactions.
  
- **Chess.js:** Handles chess logic, including move validation, check, checkmate, and other rules.
  
- **react-chessboard:** Renders an interactive chessboard with smooth drag-and-drop functionality.
  
- **React Router:** Facilitates efficient routing and navigation across the platform.
  
- **Axios:** Used for making API requests between the frontend and backend.
  
- **Express.js:** Framework for setting up the server and handling requests.
  
- **MongoDB:** Serves as the database for storing user profiles, coach content, and game data.

## Getting Started

To set up and run the ChessMasters project locally on your machine, follow these instructions:

### Prerequisites

- Ensure that Node.js and npm are installed on your system.

### Installation Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Mihirchandra0605/ChessMasters.git
   cd ChessMasters
   ```

2. **Install Dependencies**

   - Run the following command in the root folder:

   ```bash
   npm install
   ```

   - Navigate to the Backend folder and install dependencies:

   ```bash
   cd Backend
   npm install
   ```

3. **Run the Project**

   - In the client-side directory:

   ```bash
   npm run dev
   ```

   - In the Backend directory:

   ```bash
   node server.js
   ```

4. **Logging in as Coach/Player/Admin**

   - For coach/player: Select userType as coach -> sign up -> log in with coach credentials (you can verify this from the database).
   
   - For admin: Log in with username: admin, password: secret.

## Contributors

The project has been developed by a talented team of contributors:

- Mihir Chandra Loke
- Sundar R
- Kache Nivas
- B Venu Gopal Reddy
- P Sujith Kumar

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.