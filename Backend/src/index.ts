import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User{
    socket: WebSocket;
    room: string;
}

let userCount = 0;
let allSockets: User[] = [];

wss.on("connection", (socket) => {
    userCount = userCount + 1;
    console.log(`Client connected #${userCount}`);

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message as unknown as string);
        if(parsedMessage.type === "join"){
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }
        if(parsedMessage.type === "chat"){
            // const currentUserRoom = allSockets.find((x) => x.socket == socket).room;
            let currentUserRoom = null;
            for(let i = 0; i < allSockets.length; ++i){
                // @ts-ignore
                if(allSockets[i].socket == socket){
                    //@ts-ignore
                    currentUserRoom = allSockets[i].room;
                }
            }

            for(let i = 0; i < allSockets.length; ++i){
                //@ts-ignore
                if(allSockets[i].room == currentUserRoom){
                    //@ts-ignore
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    })

    // removing a dead connection (socket)
    socket.on("disconnect", () => {
        //@ts-ignore
        allSockets = allSockets.filter(x => x != socket);
    })
})