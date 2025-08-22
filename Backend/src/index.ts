import { WebSocketServer, WebSocket } from "ws";
import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();

// This port will be managed by Render, or be 8080 locally
const port = process.env.PORT || 8080;

const frontendURL = process.env.FRONTEND_URL;

// This is still needed for any potential future HTTP routes
const corsOptions = {
    origin: frontendURL,
    credentials: true
};

app.use(cors(corsOptions));

// Create a standard HTTP server from your Express app
const server = http.createServer(app);

// Attach the WebSocket server to the HTTP server
const wss = new WebSocketServer({ server });

interface User {
    socket: WebSocket;
    room: string;
    name: string;
}

// let userCount = 0;
let allSockets: User[] = [];

wss.on("connection", (socket) => {
    // userCount = userCount + 1;
    console.log(`Client connection established!`);

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString()); // Use .toString() for Buffer

        if (parsedMessage.type === "join") {
            const newUser = {
                socket,
                room: parsedMessage.payload.roomId,
                name: parsedMessage.payload.name
            };
            allSockets.push(newUser);

            // Create a join notification message
            const joinNotification = {
                type: 'join',
                name: newUser.name,
                text: `${newUser.name} joined the room.`
            }

            allSockets.forEach((user) => {
                if (user.room === newUser.room && user.socket !== newUser.socket) {
                    user.socket.send(JSON.stringify(joinNotification));
                }
            });
        }

        if (parsedMessage.type === "chat") {
            const currentUser = allSockets.find((user) => user.socket === socket);
            if (!currentUser) return;

            const currentUserRoom = currentUser.room;
            const senderName = currentUser.name;

            const messageToSend = {
                type: 'chat',
                name: senderName,
                text: parsedMessage.payload.message
            };

            allSockets.forEach((user) => {
                if (user.room === currentUserRoom) {
                    user.socket.send(JSON.stringify(messageToSend));
                }
            });
        }
    });

    socket.on("close", () => {
        // userCount = userCount - 1;
        console.log("Client disconnected");

        const leavingUser = allSockets.find(user => user.socket === socket);

        if (leavingUser) {
            console.log(`${leavingUser.name} left the room.`);
            allSockets = allSockets.filter(user => user.socket !== socket);

            const leaveNotification = {
                type: 'join',
                name: leavingUser.name,
                text: `${leavingUser.name} left the room.`
            };

            allSockets.forEach((user) => {
                if (user.room === leavingUser.room) {
                    user.socket.send(JSON.stringify(leaveNotification));
                }
            });
        }

        // Correctly filter out the disconnected socket
        allSockets = allSockets.filter(user => user.socket !== socket);
    });
});

// Start the HTTP server, which now also handles WebSockets
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});