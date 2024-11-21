import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const token = localStorage.getItem("token");

  // Initialize socket connection immediatelyjkjj
  const socket = io("https://college-project1-q29n.onrender.com/", {
    auth: { token },
    withCredentials: true,
  });

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
