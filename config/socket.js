import { useRouter } from 'next/router';
import { useSocket } from '@/context/SocketProvider';
import { useState, useRef } from 'react';

export const useSocketHandlers = () => {
  const [callerData, setCallerData] = useState(null);
  const [receiverData, setReceiverData] = useState(null);
  const { socket } = useSocket();
  const router = useRouter();
  const callerDataRef = useRef(null);
  const receiverDataRef = useRef(null);

  const disconnectSocket = () => {
    if (socket) socket.disconnect();
  };

  const subscribeToMessages = (callback) => {
    if (!socket) return;

    socket.on("message", (message) => {
      callback(message);
      // console.log(message);
    });
  };

  const callData = () => {
    return callerData;
  };

  const receiveData = () => {
    return receiverData;
  };

  const sendMessage = (message) => {
    console.log(message);
    if (socket) socket.emit("message", message);
  };

  const handleCallUser = (receiverId) => {
    // const userId = localStorage.getItem("userId");

    // console.log(userId);
    // console.log(receiverId);

    // socket.emit("video-call", { userId, receiverId });
    // console.log("video-call", { userId, receiverId });
    // const handleVideoConnect = (data) => {
    //   console.log(data);
    //   callerDataRef.current = data;
    //   if (callerDataRef.current !== null) {
    //     setCallerData(data)
    //     localStorage.setItem("caller", true );
    //     router.push(`/simple-peer/${data.callId}`);
    //   } else if (callerDataRef.current === null) {
    //     alert("Calling...");
    //   }
    // };
    // socket.on("video-connect", handleVideoConnect);
    // return () => {
    //   socket.off("video-connect", handleVideoConnect);
    // };

    router.push(`/video-test?to=${receiverId}&from=${null}&name=${null}`);
    localStorage.setItem("caller", "true");

  };

  const subscribeToIncomingCall = (callback) => {
    if (!socket) {
      console.error("Socket is not initialized.");
      return null;
    }

    socket.on("incoming-call", (data) => {
      callback(data);
    });
  };


  const handleIncomingCall = (callId, callerName) => {
    // const confirm = window.confirm;

    // console.log(callId);
    // console.log(callerName);

    // if (confirm(`${callerName} is calling. Do you want to answer?`)) {
    //   socket.emit("accept-call", { callId });
    //   const handleVideoConnect = (data) => {
    //     // console.log('Received offer:', data.offer);
    //     console.log(data);
    //     receiverDataRef.current = data;
    //     if (receiverDataRef.current !== null) {
    //       setReceiverData(data);
    //       localStorage.setItem("caller", false );
    //       // route to this page after 3 seconds
    //       // setTimeout(() => {
    //       //   router.push(`/simple-peer/${data.callId}`);
    //       // }, 3000);
    //       router.push(`/simple-peer/${data.callId}`);
    //     }
    //   };
    //   socket.on("video-connect", handleVideoConnect);
    //   return () => {
    //     socket.off("video-connect", handleVideoConnect);
    //   };
    // } else {
    //   socket.emit("reject-call", { callId });
    // }
  };

  return {
    disconnectSocket,
    subscribeToMessages,
    sendMessage,
    handleCallUser,
    subscribeToIncomingCall,
    handleIncomingCall,
    callData,
    receiveData
  };
};