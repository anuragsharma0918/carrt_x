# Carrt_X 🛒

A modern, smart shopping list application designed to streamline your grocery shopping experience. Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and styled with a professional Glassmorphism UI.

## 🚀 Features

-   **Smart Organization**: Create and manage categories for your shopping items.
-   **Real-time Extensions**: Add, edit, and check off items instantly.
-   **User Authentication**: Secure Sign Up and Login with JWT.
-   **Modern UI**: Sleek Dark Mode design with Glassmorphism effects.
-   **Mobile Reponsive**: Works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), CSS Variables, Lucide Icons.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (Mongoose).
-   **Authentication**: JSON Web Tokens (JWT), Bcrypt.

## 📦 Getting Started

### Prerequisites

-   Node.js installed.
-   MongoDB Connection URI (from MongoDB Atlas).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/carrt_x.git
    cd carrt_x
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../client
    npm install
    ```

### Configuration

1.  **Backend (`server/.env`):**
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

2.  **Frontend (`client/.env`):**
    Create a `.env` file in the `client` directory (optional for local dev, Vercel handles this in prod):
    ```env
    VITE_API_URL=http://localhost:5001/api
    ```

### Running Locally

1.  **Start the Backend:**
    ```bash
    cd server
    npm start
    ```
    *Server runs on `http://localhost:5001`*

2.  **Start the Frontend:**
    ```bash
    cd client
    npm run dev
    ```
    *Client runs on `http://localhost:5173`*

## 🚀 Deployment

### Backend (Render)
1.  Push code to GitHub.
2.  Create a **Web Service** on [Render](https://render.com/).
3.  Set Root Directory to `server`.
4.  Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `PORT`).

### Frontend (Vercel)
1.  Push code to GitHub.
2.  Import project to [Vercel](https://vercel.com/).
3.  Set Root Directory to `client`.
4.  Add Environment Variable: `VITE_API_URL` pointing to your Render backend URL.

## 📄 License
MIT License.
