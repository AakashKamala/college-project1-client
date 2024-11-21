// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSocket } from "../contexts/SocketProvider";

// const LobbyScreen = () => {
//   const [email, setEmail] = useState("");
//   const [room, setRoom] = useState("");

//   const socket = useSocket();
//   const navigate = useNavigate();

//   const handleSubmitForm = useCallback(
//     (e) => {
//       e.preventDefault();
//       socket?.emit("room:join", { email, room });
//     },
//     [email, room, socket]
//   );

//   const handleJoinRoom = useCallback(
//     (data) => {
//       const { email, room } = data;
//       navigate(`/room/${room}`);
//     },
//     [navigate]
//   );

//   useEffect(() => {
//     socket?.on("room:join", handleJoinRoom);
//     return () => {
//       socket?.off("room:join", handleJoinRoom);
//     };
//   }, [socket, handleJoinRoom]);

//   return (
//     <div>
//       <h1>Lobby</h1>
//       <form onSubmit={handleSubmitForm}>
//         <label htmlFor="email">Email ID</label>
//         <input
//           type="email"
//           id="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <br />
//         <label htmlFor="room">Room Number</label>
//         <input
//           type="text"
//           id="room"
//           value={room}
//           onChange={(e) => setRoom(e.target.value)}
//         />
//         <br />
//         <button>Join</button>
//       </form>
//     </div>
//   );
// };

// export default LobbyScreen;


















// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSocket } from "../contexts/SocketProvider";
// import { v4 as uuidv4 } from "uuid";
// import {jwtDecode} from "jwt-decode"; // Fixing import issue

// const LobbyScreen = () => {
//   const [email, setEmail] = useState("");
//   const [room, setRoom] = useState("");
//   const [people, setPeople] = useState([]);

//   const filteredPeople = people;

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setEmail(decoded.email);
//       } catch (error) {
//         console.error("Token decode error:", error);
//       }
//     }
//   }, []);

//   const socket = useSocket();
//   const navigate = useNavigate();

//   const handleSubmitForm = useCallback(
//     (roomToJoin) => {
//       console.log("Submitting to room:", roomToJoin);
//       socket.emit("room:join", { email, room: roomToJoin });
//     },
//     [email, socket]
//   );

//   const handleJoinRoom = useCallback(
//     (data) => {
//       const { room } = data;
//       console.log("Navigating to room:", room);
//       navigate(`/room/${room}`);
//     },
//     [navigate]
//   );

//   useEffect(() => {
//     socket.on("room:join", handleJoinRoom);
//     socket.on("online", (data) => setPeople(data));
//     socket.on("getinroom", (room) => {
//       console.log("received get in room")
//       setRoom(room);
//       handleSubmitForm(room);
//     });

//     return () => {
//       socket.off("room:join", handleJoinRoom);
//       socket.off("online");
//       socket.off("getinroom");
//     };
//   }, [socket, handleJoinRoom, handleSubmitForm]);

//   const handleInvite = (person) => {
//     console.log("Inviting person:", person);
//     const roomid = uuidv4();
//     console.log("Generated room ID:", roomid);
//     setRoom(roomid);
//     socket.emit("invited", { person, room: roomid }); // Corrected syntax
//     handleSubmitForm(roomid); // Pass `roomid` directly to avoid stale state.
//   };
  

//   return (
//     <div>
//       {filteredPeople.map((person) => (
//         <div key={person._id}>
//           <h2>{person.username}</h2>
//           <button onClick={() => handleInvite(person._id)}>Invite</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LobbyScreen;






















import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketProvider";
import { v4 as uuidv4 } from "uuid";
import { jwtDecode } from "jwt-decode";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [people, setPeople] = useState([]);

  const socket = useSocket();
  const navigate = useNavigate();

  // Decode token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setEmail(decoded.email);
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, []);

  // Handle room joining
  const handleSubmitForm = useCallback(
    (roomToJoin) => {
      console.log("Submitting to room:", roomToJoin);
      socket.emit("room:join", { email, room: roomToJoin });
    },
    [email, socket]
  );

  // Navigate to room after successful join
  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      console.log("Navigating to room:", room);
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("room:join", handleJoinRoom);
    
    // Add null checking for online users
    socket.on("online", (data) => {
      // Filter out any null or incomplete user objects
      const validUsers = data.filter(user => 
        user && user._id && user.username
      );
      setPeople(validUsers);
    });
    
    // Handle getting into a room after invitation
    socket.on("getinroom", (room) => {
      console.log("Received get in room:", room);
      setRoom(room);
      handleSubmitForm(room);
    });

    return () => {
      socket.off("room:join", handleJoinRoom);
      socket.off("online");
      socket.off("getinroom");
    };
  }, [socket, handleJoinRoom, handleSubmitForm]);

  // Handle inviting a user to a room
  const handleInvite = (personId) => {
    if (!personId) {
      console.error("Invalid person ID");
      return;
    }

    console.log("Inviting person:", personId);
    const roomId = uuidv4();
    console.log("Generated room ID:", roomId);
    
    // Emit invitation with room ID
    socket.emit("invited", { person: personId, room: roomId });
    
    // Set room and submit form
    setRoom(roomId);
    handleSubmitForm(roomId);
  };

  // Render users with null checking
  const renderPeople = () => {
    if (!people || people.length === 0) {
      return <div className="text-gray-500">No users online</div>;
    }

    return people.map((person) => {
      // Additional null checking
      if (!person || !person._id) {
        return null; // Skip invalid user objects
      }

      return (
        <div 
          key={person._id} 
          className="flex items-center justify-between mb-2 p-2 border rounded"
        >
          <span>{person.username || 'Unknown User'}</span>
          <button 
            onClick={() => handleInvite(person._id)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Invite
          </button>
        </div>
      );
    }).filter(Boolean); // Remove any null entries
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Online Users</h1>
      {renderPeople()}
    </div>
  );
};

export default LobbyScreen;