# ChessMasters

**ChessMasters** is a robust and feature-rich online platform designed for chess enthusiasts across all skill levels. Whether you're a beginner exploring the fundamentals or an advanced player sharpening your tactics, ChessMasters provides a dynamic environment to play, learn, and grow. The platform supports real-time gameplay, coach-led mentoring, and a wealth of educational content curated by seasoned professionals.

---

## 🌐 Live Deployment

- **Frontend:** [https://chess-masters.vercel.app/](https://chess-masters.vercel.app/)
- **Backend API Documentation (Swagger/OpenAPI):** [https://chessmasters.onrender.com/api-docs/](https://chessmasters.onrender.com/api-docs/)

> The frontend is deployed on **Vercel** and the backend is hosted on **Render**.

---

## 🚀 Features

- **♟️ Play Chess:** Experience seamless real-time chess gameplay with players around the world.
- **👨‍🏫 Coaching Services:** Connect with expert coaches for personalized feedback and strategic guidance.
- **📚 Educational Resources:** Access premium articles and video content crafted by professional coaches.
- **🧭 User-Friendly Interface:** Enjoy a modern, responsive UI for intuitive navigation and interaction.

---

## 🛠️ Technologies Used

ChessMasters is built using a modern and scalable tech stack:

### Frontend

- **React** – Component-based UI development  
- **react-chessboard** – Interactive chessboard with drag-and-drop support  
- **React Router** – Client-side routing  
- **Axios** – API request handling  

### Backend

- **Node.js** – Server-side runtime environment  
- **Express.js** – Backend framework for routing and middleware  
- **Chess.js** – Handles core chess logic (move validation, game state, rules)  
- **MongoDB** – NoSQL database for storing user data, game history, and content  

---

## ⚙️ Getting Started

Follow the steps below to set up and run ChessMasters locally:

### 📋 Prerequisites

- Ensure **Node.js** and **npm** are installed on your system.

---

### 🛠️ Install Dependencies

In the root directory:

```bash
npm install
````

Navigate to the backend directory and install backend dependencies:

```bash
cd Backend
npm install
```

---

### ▶️ Running the Application

Start the frontend (from the root folder):

```bash
npm run dev
```

Start the backend (from the `Backend` directory):

```bash
node server.js
```

---

### 🔐 User Roles and Access

* **Coach/Player:**

  * During sign-up, select the appropriate `userType` (e.g., `coach`)
  * Log in with your registered credentials (you can verify them via the database)

* **Admin:**

  * Use the following default credentials to log in:

    * **Username:** `admin`
    * **Password:** `secret`

---

### 🔄 CI/CD and Testing

* CI/CD pipelines are implemented for automated builds, testing, and deployments.
* Comprehensive test cases are written to ensure feature reliability and maintain code quality.

---

### 🤝 Contributing

ChessMasters is an open-source project and contributions are highly encouraged.

To contribute:

1. Fork the repository.

2. Create a new branch:

   ```bash
   git checkout -b feature/YourFeature
   ```

3. Make your changes and commit them.

4. Push your changes:

   ```bash
   git push origin feature/YourFeature
   ```

5. Open a pull request describing your changes.

> Pull requests are welcome and will be reviewed promptly.

---

### 👥 Contributors

This project is developed and maintained by:

* Mihir Chandra Loke
* Sundar R
* Kache Nivas
* B Venu Gopal Reddy
* P Sujith Kumar

---

### 📄 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for full details.