import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ stream, isAudioMute, name }) => {
  // const videoRef = useRef();

  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.srcObject = stream;
  //   }
  // }, [stream]);

  const myStream = name === "My Stream";

  return (
    <div>
      <div className={`${myStream ? "flex flex-col items-center justify-center absolute top-2 right-3 z-10" : "px-2"}`}>
        <h1 className={`text-sm font-poppins font-semibold md:text-xl mb-1 text-center ${myStream ? "mt-1" : "mt-4"}`}>
          {name}
        </h1>
        <div className={`relative rounded-[30px] overflow-hidden ${myStream ? "" : ""}`}>
          <video
            ref={stream}
            autoPlay
            muted={isAudioMute}
            height="100%"
            width="100%"
            style={{ transform: 'scaleX(-1)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
