import { WebSocketServer, WebSocket } from "ws";
import express from 'express';
import http from 'http'; // Import the 'http' module
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
let userCount = 0;
let allSockets = [];
wss.on("connection", (socket) => {
    userCount = userCount + 1;
    console.log(`Client connected #${userCount}`);
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString()); // Use .toString() for Buffer
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            const currentUser = allSockets.find((user) => user.socket === socket);
            if (!currentUser)
                return;
            const currentUserRoom = currentUser.room;
            allSockets.forEach((user) => {
                if (user.room === currentUserRoom) {
                    user.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });
    // The event is 'close', not 'disconnect'
    socket.on("close", () => {
        userCount = userCount - 1;
        console.log("Client disconnected");
        // Correctly filter out the disconnected socket
        allSockets = allSockets.filter(user => user.socket !== socket);
    });
});
// Start the HTTP server, which now also handles WebSockets
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
//# sourceMappingURL=index.js.map