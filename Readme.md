# 🚀 Real-Time Chat Application

![GitHub last commit](https://img.shields.io/github/last-commit/dev-harshvats/Real-Time-Chat)

A full-stack, real-time chat application built with a modern tech stack. This project allows users to join unique chat rooms and communicate instantly, demonstrating a clean client-server architecture with persistent WebSocket connections.

---

## ✨ Key Features

- **Instant Messaging:** Real-time, bi-directional communication powered by WebSockets.
- **Dynamic Chat Rooms:** Users can create or join rooms by entering a unique Room ID.
- **Separate Frontend & Backend:** A decoupled architecture for scalability and maintainability.
- **Live Deployment:** Fully configured for deployment on Render.
- **Responsive Design:** A clean and intuitive user interface that works on all screen sizes.

---

## 🛠️ Tech Stack

| Category      | Technology                                                                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![WebSockets](https://img.shields.io/badge/WebSockets-Native-blue?style=for-the-badge) |
| **Deployment**| ![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)                                                                                                                                |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

You need to have Node.js and npm (or yarn/pnpm) installed on your machine.
- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/dev-harshvats/Real-Time-Chat.git](https://github.com/dev-harshvats/Real-Time-Chat.git)
    cd Real-Time-Chat
    ```

2.  **Set up the Backend:**
    ```sh
    cd Backend
    npm install
    ```

3.  **Set up the Frontend:**
    ```sh
    cd ../frontend
    npm install
    ```

### Running the Application Locally

You will need two separate terminal windows to run both the frontend and backend servers.

1.  **Start the Backend Server:**
    - In your first terminal, navigate to the `Backend` directory.
    - Run the development server:
    ```sh
    npm run dev
    ```
    Your backend WebSocket server should now be running on `ws://localhost:8080`.

2.  **Start the Frontend Client:**
    - In your second terminal, navigate to the `frontend` directory.
    - Run the development server:
    ```sh
    npm run dev
    ```
    Your application should now be running! Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

---

## ☁️ Deployment

This application is configured for deployment on **Render**.

-   The **`Backend`** is deployed as a **Web Service**.
    -   **Build Command:** `npm install && npm run build`
    -   **Start Command:** `node dist/index.js`
-   The **`frontend`** is deployed as a **Static Site**.
    -   **Build Command:** `npm run build`
    -   **Publish Directory:** `dist`

Environment variables must be configured on Render to connect the two services and enable CORS.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
