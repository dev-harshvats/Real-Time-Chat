import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);    // NEW: track if user joined
  const wsRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if(!roomId || !joined) return;   // don't connect until roomId is set

    const ws = new WebSocket("http://localhost:8080");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      setMessages(m => [...m, event.data])
    }

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: roomId
        }
      }))
    }

    return () => {
      ws.close();
    }
  }, [roomId, joined]);   // reconnect when roomId changes

  // ------------------ Landing Page ------------------
  if(!joined) {
    return (
      <div className='h-screen bg-black flex items-center justify-center'>
        <div className='bg-white p-8 rounded shadow-lg w-96 text-center'>
          <h1 className='text-2xl font-bold mb-4'>Join a Room</h1>
          <input
            type='text'
            placeholder='Enter Room ID'
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className='p-2 border rounded w-full mb-4 text-black'
          />
          <button
            onClick={() => {
              if(roomId.trim()){
                setJoined(true);
              }
            }}
            className='bg-green-600 text-white p-2 rounded w-full'
          >
            Join Room
          </button>
        </div>
      </div>
    )
  }
  
  // ------------------- Chat Page -------------------
  return (
    <div className='h-screen bg-black'>
      <div className='h-[82vh] overflow-y-auto space-y-3 p-4'>
        {messages.map((message, idx) =>(
          <div key={idx} className='py-2'>
            <span className='bg-white text-black rounded p-3'>
              {message}
            </span>
          </div>
        ))}
      </div>

      <div className='w-full bg-white flex'>
        <input ref={inputRef} id='message' className='flex-1 p-4'></input>
        <button
          onClick={() => {
            const message = inputRef.current?.value;
            if(message) {
              wsRef.current.send(JSON.stringify({
                type: "chat",
                payload: {
                  message: message
                }
              }))
              inputRef.current.value = "";
            }
          }}
          className='bg-green-600 text-white cursor-pointer p-4'>
            Send Message
        </button>
      </div>
    </div>
  )
}

export default App
