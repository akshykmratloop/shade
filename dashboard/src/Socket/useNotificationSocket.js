import {useEffect} from "react";
import {socket} from "./socket";

const useNotificationSocket = (userId, onNotification) => {
  useEffect(() => {
    if (!userId) return;

    socket.connect();

    socket.emit("join", userId); // Join user's room

    socket.on("notification", (data) => {
      console.log("📨 Received notification:", data);
      onNotification(data);
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [userId]);
};

export default useNotificationSocket;
