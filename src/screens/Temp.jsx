import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketProvider";
import { v4 as uuidv4 } from 'uuid';

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const[people, setPeople]=useState([])

  const filteredPeople=people

  socket.on("online", (data)=>{
    setPeople(data)
  })

useEffect(()=>{
  const token = localStorage.getItem("token");
      if (token) {
          try {
              const decoded = jwtDecode(token);
              setEmail(decoded.email)
          } catch (error) {
              console.error("Token decode error:", error);
          }
      }
},[])

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  const handleInvite=(person)=>{
    const roomid=uuidv4()
    setRoom(roomid)
    socket.emit("invited", (person, room))
    handleSubmitForm()
  }

  socket.on("getinroom",(room)=>{
    console.log("whats going on?")
    setRoom(room)
    handleSubmitForm()
  })

  return (
    <div>

      {filteredPeople.map(person=>{
        <div key={person._id}>
          <h2>{person.username}</h2>
          <button onClick={handleInvite(person)}>invite</button>
        </div>
      })}


    </div>
  );
};

export default LobbyScreen;