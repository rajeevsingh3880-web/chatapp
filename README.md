# 💬 Chat App

A real-time chat application built with **Spring Boot**, **React**, **WebSocket**, and **MongoDB**.

Users can create/join chat rooms and exchange messages in real time.

## 🚀 Features

* Real-time messaging
* Chat rooms
* Join rooms using a Room ID
* Sender name with messages
* Message timestamps
* React-based frontend
* Spring Boot REST backend
* WebSocket communication
* MongoDB database
* Responsive user interface

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* WebSocket / SockJS / STOMP

### Backend

* Java 21
* Spring Boot
* Spring Web
* Spring Data MongoDB
* WebSocket
* Maven
* Lombok

### Database

* MongoDB
* MongoDB Atlas

## 📁 Project Structure

```text
chat-app-main/
│
├── chat-app-backend/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── front-chat/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── .gitignore
```

## ⚙️ Requirements

Before running the project, install:

* Java 21
* Maven (or use the included Maven Wrapper)
* Node.js
* npm
* MongoDB or MongoDB Atlas

## 🔧 Backend Setup

Go to the backend directory:

```bash
cd chat-app-backend
```

Configure MongoDB in:

```text
src/main/resources/application.properties
```

For MongoDB Atlas, use an environment variable:

```properties
spring.data.mongodb.uri=${MONGODB_URI}
server.port=${PORT:8080}
```

Set your MongoDB connection string in the environment:

```text
MONGODB_URI=your_mongodb_connection_string
```

Then start the backend:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend will normally run on:

```text
http://localhost:8080
```

## 🎨 Frontend Setup

Open another terminal and go to:

```bash
cd front-chat
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

If the project uses Vite, use:

```bash
npm run dev
```

The frontend URL will be shown in the terminal.

## 🔗 Application Architecture

```text
                ┌──────────────────┐
                │   React Frontend │
                │    front-chat    │
                └────────┬─────────┘
                         │
                         │ REST / WebSocket
                         ▼
                ┌──────────────────┐
                │ Spring Boot API  │
                │ chat-app-backend │
                └────────┬─────────┘
                         │
                         │ MongoDB
                         ▼
                ┌──────────────────┐
                │   MongoDB Atlas  │
                └──────────────────┘
```

## 🌐 Deployment

The project can be deployed using:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

After deployment, configure the frontend with the deployed backend URL and configure the backend with the MongoDB Atlas connection string.

## 🔐 Environment Variables

Do not commit passwords, database credentials, API keys, or other secrets to GitHub.

Example:

```text
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp
```

Store the real value in your deployment platform's environment variables.

## 🧪 Running Locally

Start the backend first:

```powershell
cd chat-app-backend
.\mvnw.cmd spring-boot:run
```

Then start the frontend in another terminal:

```powershell
cd front-chat
npm install
npm start
```

Open the frontend URL in your browser.

## 👨‍💻 Author

**Golu Patel**

GitHub: [https://github.com/rajeevsingh3880-web]

## 📄 License

This project is for educational and development purposes.
