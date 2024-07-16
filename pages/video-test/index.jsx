import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Peer from "simple-peer";
import { useSocket } from "../../context/SocketProvider";
import CallHandleButtons from "@/components/CallHandleButtons";
import Resources from "./components/Resources";
import CardComponent from "./components/CardComponent";
import Avatar from "../../Assets/av.png"
import Image from "next/image";

function Videocall() {
  const [yourID, setYourID] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [isVideoOnHold, setIsVideoOnHold] = useState(false);
  const [sender, setSender] = useState(false);
  const [calling, setCalling] = useState(false);
  const [shared, setShared] = useState(false);
  const [receiver, setReceiver] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isRemoteScrolling, setIsRemoteScrolling] = useState(false);
  const lastScrollPosition = useRef({ top: 0, left: 0, carousels: [0, 0, 0] });
  const [lastClickPosition, setLastClickPosition] = useState({ x: 0, y: 0 });
  const [cardScrollPosition, setCardScrollPosition] = useState(0);
  const [cardScrollInfo, setCardScrollInfo] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const sharedRef = useRef(false);
  const isScrollingRef = useRef(false);

  const router = useRouter();
  const { to, from, name } = router.query;

  

  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const contentRef = useRef();

  const socket = useRef();
  const { socket: socketInstance } = useSocket();

  const stopAllMediaTracks = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        const stream = mediaStream;
        const tracks = stream.getTracks();

        tracks[0].stop();
        setStream(null);
        tracks[1].stop();
      });
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
    if (partnerVideo.current) {
      partnerVideo.current.srcObject = null;
    }
  }, [stream]);

  useEffect(() => {
    socket.current = socketInstance;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    const id = localStorage.getItem("userId");
    setYourID(id);
    const person = localStorage.getItem("caller");
    if (person === "true") {
      setSender(true);
    } else {
      setSender(false);
    }

    if (calling) {
      socket.current.on("video-connect", (data) => {
        setCaller(data.callId);
      });
    }

    socket.current.on("incoming-call", (data) => {
      setReceivingCall(true);
      setCaller(data.callId);
      setReceiver(data.senderId);
      setCallerSignal(data.data);
    });

    socket.current.on("content-sharing", (data) => {
      if (contentRef.current) {
        setIsRemoteScrolling(true);
        requestAnimationFrame(() => {
          if (data.data.scrollTop !== undefined) {
            contentRef.current.scrollTop = data.data.scrollTop;
            contentRef.current.scrollLeft = data.data.scrollLeft;

            // Update carousel positions
            const carousels = contentRef.current.querySelectorAll(".carousel");
            data.data.carousels.forEach((position, index) => {
              if (carousels[index]) {
                carousels[index].scrollLeft = position;
              }
            });

            const cardContent = document.querySelector(".card-content");
            if (cardContent && data.data.cardScrollTop !== undefined) {
              cardContent.scrollTop = data.data.cardScrollTop;
            }

            lastScrollPosition.current = {
              top: data.data.scrollTop,
              left: data.data.scrollLeft,
              carousels: data.data.carousels,
            };

            setCardScrollPosition(data.data.cardScrollTop);
          }

          if (data.data.click) {
            if (data.data.click.category && data.data.click.itemId) {
              // Handle resource click
              const category = data.data.click.category;
              const itemId = data.data.click.itemId;

              // Find and click the corresponding element
              const element = contentRef.current.querySelector(
                `[data-category="${category}"][data-item-id="${itemId}"]`
              );
              if (element) {
                element.click();
              }
            } else {
              // Handle general click (for the red dot)
              setLastClickPosition(data.data.click);
            }
          }
          if (data.data.categoryChange !== undefined) {
            setSelectedCategory(data.data.categoryChange);
          }
          if (data.data.cardSelection !== undefined) {
            setSelectedCard(data.data.cardSelection);
          }

          if (data.data.cardScroll) {
            isScrollingRef.current = true;
            setCardScrollInfo(data.data.cardScroll);
            setTimeout(() => {
              isScrollingRef.current = false;
            }, 30); // Adjust this delay as needed
          }

          requestAnimationFrame(() => {
            setIsRemoteScrolling(false);
          });
        });
      }
    });
    socket.current.on("end-call", (data) => {
      console.log(data);
      handleEndCall();
    });

    return () => {
      socket.current.off("content-sharing");
      socket.current.off("end-call");
      stopAllMediaTracks();
    };
  }, []);

  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
        ],
      },
      stream: stream,
    });

    peerRef.current = peer;

    peer.on("signal", (data) => {
      socket.current.emit("video-call", {
        receiverId: to,
        signalData: data,
        userId: yourID,
      });
      setCalling(true);
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("video-connect", (signal) => {
      setCallAccepted(true);
      setCalling(false);
      peer.signal(signal.data);
      setCaller(signal.callerId);
    });

    socket.current.on("reject-call", (data) => {
      console.log(data.message);
      if (data.message) {
        alert(data.message);
        navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          const stream = mediaStream;
          const tracks = stream.getTracks();
  
          tracks[0].stop();
          setStream(null);
          tracks[1].stop();
        });
      if (userVideo.current) {
        userVideo.current.srcObject = null;
      }
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = null;
      }
      router.push("/chats");
      }
    });

    setCallActive(true);
  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peerRef.current = peer;

    peer.on("signal", (data) => {
      socket.current.emit("accept-call", { signal: data, callId: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);

    setClicked(true);
    setCallActive(true);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      // <div>
      <div
        className={` ${
          callAccepted || clicked ? "md:w-full w-1/2" : "w-1/2"
        } md:relative absolute top-0 left-0`}
      >
        <h1
          className={
            "text-sm text-white font-poppins font-semibold md:text-xl mb-1 text-center mt-1 "
          }
        >
          Me
        </h1>
        <video
          ref={userVideo}
          autoPlay
          height="100%"
          width="100%"
          muted={isAudioMute}
          className=" overflow-hidden resize scale-x-[-1]"
        />
      </div>
    );
  }

  // console.log(isAudioMute, isVideoOnHold)

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <div className=" w-full resize">
        <h1
          className={
            "text-sm text-white font-poppins font-semibold md:text-xl mb-1 text-center mt-1"
          }
        >
          Friend
        </h1>
        <video
          ref={partnerVideo}
          autoPlay
          height="100%"
          width="100%"
          className=" overflow-hidden scale-x-[-1]"
        />
      </div>
    );
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div
        className={`${
          clicked ? "hidden" : ""
        } absolute bottom-3 left-0 text-end`}
      >
        {/* <h1>{caller} is calling you</h1> */}
        <button className="btn btn-success" onClick={acceptCall}>
          Ready to join
        </button>
      </div>
    );
  }

  const handleEndCall = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setCallAccepted(false);
    setCallActive(false);
    setCalling(false);
    setReceivingCall(false);

    stopAllMediaTracks();
    setStream(null);

    // Emit an event to inform the other user that the call has ended
    socket.current.emit("end-call", { callId: caller, userId: yourID });
    console.log(caller);

    // Redirect to back to the chat page
    history.back()
  }, [receiver, to, yourID, stopAllMediaTracks]);

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const handleScroll = useCallback(() => {
    if (!isRemoteScrolling && contentRef.current) {
      const { scrollTop, scrollLeft } = contentRef.current;
      const cardScrollTop =
        document.querySelector(".card-content")?.scrollTop || 0;

      if (
        scrollTop !== lastScrollPosition.current.top ||
        scrollLeft !== lastScrollPosition.current.left ||
        cardScrollTop !== cardScrollPosition
      ) {
        lastScrollPosition.current = {
          top: scrollTop,
          left: scrollLeft,
          carousels: lastScrollPosition.current.carousels,
        };
        setCardScrollPosition(cardScrollTop);

        socket.current.emit("content-sharing", {
          to: receiver || to,
          from: yourID,
          data: {
            scrollTop,
            scrollLeft,
            carousels: lastScrollPosition.current.carousels,
            cardScrollTop,
          },
        });
      }
    }
  }, [isRemoteScrolling, receiver, to, yourID, cardScrollPosition]);

  const debouncedHandleCarouselScroll = useCallback(
    debounce((carouselPositions) => {
      if (!isRemoteScrolling) {
        lastScrollPosition.current = {
          ...lastScrollPosition.current,
          carousels: carouselPositions,
        };

        socket.current.emit("content-sharing", {
          to: receiver || to,
          from: yourID,
          data: {
            scrollTop: contentRef.current.scrollTop,
            scrollLeft: contentRef.current.scrollLeft,
            carousels: carouselPositions,
          },
        });
      }
    }, 30), // Adjust the delay as needed
    [isRemoteScrolling, receiver, to, yourID]
  );

  const handleClick = useCallback(
    (event) => {
      if (!isRemoteScrolling && contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setLastClickPosition({ x, y });

        // Emit the click event immediately
        socket.current.emit("content-sharing", {
          to: receiver || to,
          from: yourID,
          data: {
            click: { x, y },
          },
        });
      }
    },
    [isRemoteScrolling, receiver, to, yourID]
  );


  const handleResourceClick = useCallback(
    (category, itemId) => {
      if (!isRemoteScrolling) {
        socket.current.emit("content-sharing", {
          to: receiver || to,
          from: yourID,
          data: {
            click: { category, itemId },
          },
        });
      }
    },
    [isRemoteScrolling, receiver, to, yourID]
  );

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = useCallback(
    (category) => {
      setSelectedCategory(category);
      socket.current.emit("content-sharing", {
        to: receiver || to,
        from: yourID,
        data: {
          categoryChange: category,
        },
      });
    },
    [receiver, to, yourID]
  );

  const handleCardSelection = useCallback(
    (category, id) => {
      setSelectedCard((prevState) => {
        // If the same card is clicked again, toggle it off
        if (
          prevState &&
          prevState.category === category &&
          prevState.id === id
        ) {
          return null;
        }
        // Otherwise, select the new card
        return { category, id };
      });
      socket.current.emit("content-sharing", {
        to: receiver || to,
        from: yourID,
        data: {
          cardSelection: { category, id },
        },
      });
    },
    [receiver, to, yourID]
  );

  const handleCardClose = useCallback(() => {
    setSelectedCard(null);
    socket.current.emit("content-sharing", {
      to: receiver || to,
      from: yourID,
      data: {
        cardSelection: null,
      },
    });
  }, [receiver, to, yourID]);

  const handleCardScroll = useCallback(
    debounce(({ scrollTop, scrollHeight, clientHeight }) => {
      if (!isScrollingRef.current && socket.current) {
        const newCardScrollInfo = { scrollTop, scrollHeight, clientHeight };
        setCardScrollInfo(newCardScrollInfo);

        socket.current.emit("content-sharing", {
          to: receiver || to,
          from: yourID,
          data: {
            cardScroll: newCardScrollInfo,
          },
        });
      }
    }, 15), // Adjust this delay as needed
    [receiver, to, yourID]
  );
  let shareContent;
  if (shared) {
    shareContent = (
      <div
        ref={contentRef}
        onScroll={handleScroll}
        onClick={handleClick}
        className=" w-full resize overflow-auto md:h-[500px] h-[60vh] bg-white rounded-xl"
      >
        {selectedCard && (
          <CardComponent
            category={selectedCard.category}
            id={selectedCard.id}
            onClose={handleCardClose}
            onCardScroll={(scrollTop) => setCardScrollPosition(scrollTop)}
            onScroll={handleCardScroll}
            scrollInfo={cardScrollInfo}
          />
        )}
        <Resources
          onScroll={(scrollPositions) => {
            debouncedHandleCarouselScroll(scrollPositions);
            if (selectedCategory) {
              contentRef.current.scrollTo(0, 0);
            }
          }}
          onClick={handleResourceClick}
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
          onCardSelect={handleCardSelection}
          selectedCard={selectedCard}
        />
        {/* <div
          style={{
            position: "absolute",
            left: lastClickPosition.x,
            top: lastClickPosition.y,
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "red",
            pointerEvents: "none",
          }}
        /> */}
      </div>
    );
  }

  const handleToggleAudio = () => {
    setIsAudioMute(!isAudioMute);
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = isAudioMute;
    }

    if (peerRef.current) {
      // Remove the existing audio track
      const sender = peerRef.current._pc
        .getSenders()
        .find((s) => s.track.kind === audioTrack.kind);
      sender.replaceTrack(audioTrack);
    }
  };

  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const handleToggleVideo = () => {
    const videoTrack = stream.getVideoTracks()[0];
    setIsVideoOnHold(!isVideoOnHold);
    setIsVideoMuted(!isVideoMuted);

    if (videoTrack) {
      videoTrack.enabled = isVideoOnHold;
    }

    if (peerRef.current) {
      // Remove the existing video track
      const sender = peerRef.current._pc
        .getSenders()
        .find((s) => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }
  };

  const toggleShared = useCallback(() => {
    sharedRef.current = !sharedRef.current;
    setShared(sharedRef.current);
    console.log("Stream active:", stream.active);
    console.log("Audio tracks:", stream.getAudioTracks().length);
    console.log("Video tracks:", stream.getVideoTracks().length);
  }, [stream]);

  useEffect(() => {
    if (!isVideoMuted && stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = true;
      }
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    }
  }, [isVideoMuted, stream]);

  return (
    <div className="bg-black h-screen relative duration-300 transition-transform">
      <div
        className={`absolute inset-0 transition-all duration-300 p-4 ${
          shared ? "md:w-3/4 w-full" : "hidden"
        }`}
      >
        {shareContent}
      </div>

      <div
        className={`p-5 transition-all duration-300 ${
          shared
            ? "absolute flex gap-5 md:flex-col md:top-0 top-auto bottom-12 md:right-0 md:w-1/4 z-10"
            : "flex md:flex-row flex-col gap-5 items-center justify-center md:h-auto h-full"
        }`}
      >
        {callAccepted && (
          <div className={` ${!shared ? "md:w-1/2 md:mb-2" : ""} `}>
            <h1 className="text-sm text-white font-poppins font-semibold md:text-xl mb-1 text-center mt-1">
              Friend
            </h1>
            <video
              ref={partnerVideo}
              autoPlay
              playsInline
              style={{ width: "100%", height: "auto" }}
              className="overflow-hidden scale-x-[-1] rounded-lg transition-all duration-300 border"
            />
          </div>
        )}
        <div
          className={`${
            !shared
              ? "md:w-1/2 md:block absolute md:relative w-1/3 top-0 right-0"
              : ""
          }`}
        >
          <h1 className="text-sm text-white font-poppins font-semibold md:text-xl mb-1 text-center mt-1">
            Me
          </h1>
          {isVideoMuted ? (
            <Image
            src={Avatar} // Adjust this path to where your image is actually located
            alt="Avatar"
            width={500}
            height={500}
            className="mx-auto object-cover rounded-lg"
          />
          ) : (
            <video
            ref={userVideo}
            autoPlay
            playsInline
            muted={isAudioMute}
            style={{ width: "100%", height: "auto" }}
            className="overflow-hidden scale-x-[-1] rounded-lg"
          />
          )}
          
        </div>
      </div>

      <CallHandleButtons
        isAudioMute={isAudioMute}
        isVideoOnHold={isVideoOnHold}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
        onEndCall={handleEndCall}
      />

      <button
        onClick={toggleShared}
        className="btn btn-xs md:btn-md btn-success absolute bottom-3 md:right-3 right-1"
      >
        {shared ? "Unshare" : "Share"}
      </button>

      {/* Call controls */}
      <div>
        {sender && !callAccepted && (
          <div className="absolute bottom-3 left-3 text-end">
            <button className="btn btn-success" onClick={() => callPeer(to)}>
              Ready to call
            </button>
            {calling && (
              <h1 className="text-white font-poppins font-semibold md:text-xl mb-1 text-center mt-1">
                Calling...
              </h1>
            )}
          </div>
        )}
      </div>

      {/* Incoming call notification */}
      {receivingCall && !clicked && (
        <div className="absolute bottom-3 left-3 text-end">
          <button className="btn btn-success" onClick={acceptCall}>
            Ready to join
          </button>
        </div>
      )}
    </div>
  );
}

export default Videocall;
