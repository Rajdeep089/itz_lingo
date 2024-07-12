import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import SocketProvider, { useSocket } from "@/context/SocketProvider";
import { NotificationProvider, useNotification } from '../context/NotificationContext';
import NotificationIcon from '../components/NotificationIcon';
import "@/styles/globals.css";
import Head from "next/head";
import Script from 'next/script'

function SocketHandler({ children }) {
  const { socket } = useSocket();
  const [callData, setCallData] = useState(null);
  const router = useRouter();
  const { setHasNewMessage, setLastMessageSenderId } = useNotification();
  

  useEffect(() => {
    const handleIncomingData = (data) => {
      if (!callData) {
        if (data) {
          setCallData(data);
          document.getElementById("incoming-modal")?.showModal();
        } else {
          console.error("Invalid incoming call data: ", data);
        }
      }
    }

    if (socket) {
      socket.on("incoming-popup", (data) => {
        handleIncomingData(data);
        console.log(data);
      });

      socket.on('message', (newMessage) => {
        if (newMessage.receiverId === localStorage.getItem('userId')) {
          setHasNewMessage(true);
          setLastMessageSenderId(newMessage.senderId);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("incoming-popup");
        socket.off('message');
      }
    };
  }, [socket, callData, setHasNewMessage, setLastMessageSenderId]);

  const acceptCall = () => {
    router.push(`/video-test?to=${null}&from=${callData.callId}&name=${callData.name}`);
    localStorage.setItem("caller", "false");
    document.getElementById("incoming-modal")?.close();
  };

  const rejectCall = () => {
    document.getElementById("incoming-modal")?.close();
    console.log("reject call", callData?.callId);
    if (callData?.callId) {
      socket.emit("reject-call", 
        {callId: callData?.callId}
      );
    }
  }

  return (
    <>
      {children}
      <dialog
        id="incoming-modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Incoming Call</h3>
          <p className="py-4">{callData?.name || 'Someone'} is calling...</p>
          <div className="modal-action">
            <form method="dialog">
              <label onClick={acceptCall} className="btn btn-success">
                Accept
              </label>
              <label onClick={rejectCall} className="btn btn-error">
                Decline
              </label>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default function App({ Component, pageProps }) {
  return ( 
    <>
      <Head>
        <title>Itz Lingo</title>
        <meta name="description" content="Crafted by ParindaTech Innovates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <SocketProvider>
        <NotificationProvider>
          <SocketHandler>
            <NotificationIcon />
            <Component {...pageProps} />
          </SocketHandler>
        </NotificationProvider>
      </SocketProvider>
    </>
  );
}