import { useEffect, useRef, useState, type FormEvent } from 'react';

interface Message {
  name: string;
  text: string;
  type: 'chat' | 'join';
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!roomId || !joined || !name) return;

    const backendHost = import.meta.env.VITE_API_URL;
    const wsUrl = backendHost ? `wss://${backendHost}` : "ws://localhost:8080";
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      setMessages(m => [...m, messageData]);
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: roomId,
          name: name
        }
      }));
    };

    return () => {
      // Ensure the WebSocket is open before trying to close it
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomId, joined, name]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    const message = inputRef.current?.value;
    if (message && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: "chat",
        payload: {
          message: message
        }
      }));
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  // ------------------ Landing Page ------------------
  if (!joined) {
    return (
      <div className='fixed inset-0 bg-gray-900 text-white flex items-center justify-center p-4'>
        <div className='bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center border border-gray-700'>
          <h1 className='text-3xl font-bold mb-2'>Real-Time Chat</h1>
          <p className='text-gray-400 mb-6'>Join a room to start chatting</p>
          <div className='space-y-4'>
            <input
              type='text'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='p-3 border-2 border-gray-700 bg-gray-900 rounded-lg w-full focus:outline-none focus:border-indigo-500 transition-colors'
            />
            <input
              type='text'
              placeholder='Enter Room ID'
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className='p-3 border-2 border-gray-700 bg-gray-900 rounded-lg w-full focus:outline-none focus:border-indigo-500 transition-colors'
            />
          </div>
          <button
            onClick={() => {
              if (roomId.trim() && name.trim()) {
                setJoined(true);
              }
            }}
            className='bg-indigo-600 text-white p-3 rounded-lg w-full cursor-pointer mt-6 hover:bg-indigo-700 transition-colors font-semibold'
          >
            Enter Room
          </button>
        </div>
      </div>
    );
  }

  // ------------------- Chat Page -------------------
  return (
    <div className='fixed inset-0 bg-gray-900 text-white flex flex-col'>
      <header className='bg-gray-800 p-4 shadow-md border-b border-gray-700'>
        <h1 className='text-xl font-bold text-center'>Room: <span className='text-indigo-400'>{roomId}</span></h1>
      </header>

      <div className='flex-1 overflow-y-auto p-6 space-y-4'>
        {messages.map((message, idx) => {
          // Render centered notification when new user joins.
          if(message.type === 'join'){
            return (
              <div key={idx} className='text-center my-2'>
                <span className='bg-gray-700 border border-gray-600 text-gray-300 text-xs px-4 py-2 rounded-lg inline-block shadow-md'>
                  {message.text}
                </span>
              </div>
            )
          }

          // Otherwise, render the standard chat message bubble.
          const isCurrentUser = message.name === name;
          return (
            <div key={idx} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
              <div className='max-w-xs md:max-w-md'>
                {!isCurrentUser && (
                  <div className='text-xs text-gray-400 mb-1 ml-2'>{message.name}</div>
                )}
                <div className={`px-4 py-2 rounded-2xl ${isCurrentUser ? 'bg-indigo-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                  <p>{message.text}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className='bg-gray-800 p-4 flex items-center border-t border-gray-700'>
        <input
          ref={inputRef}
          id='message'
          placeholder='Type your message...'
          className='flex-1 p-3 bg-gray-700 rounded-full focus:outline-none px-5'
        />
        <button
          type='submit'
          className='bg-indigo-600 text-white rounded-full p-3 ml-4 cursor-pointer hover:bg-indigo-700 transition-colors'
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default App;
