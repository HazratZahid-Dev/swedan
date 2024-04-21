import React, { useState, useRef, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import "./Home.css";

import buttonBg from "../assets/button.webp";
const Home = () => {
  const TIMEOUT = 2 * 60000; //2 minutes
  let timeoutId = useRef();
  const loopVideoRef = useRef(null);
  const responseVideoRef = useRef(null);

  const [videoInQueue, setVideoInQueue] = useState(undefined);
  const [videoName, setVideoName] = useState("welcome.mp4");

  const [isResponseVideoVisible, setResponseVideoVisible] = useState(true);
  const [isOverlayVisible, setOverlayVisible] = useState(true);
  const video1=document.getElementById("video1")
  const video2=document.getElementById("video2")
  const video3=document.getElementById("video3")
  const video4=document.getElementById("video4")
  const video5=document.getElementById("video5")
  const loopvideo=document.getElementById("loopvideo")
  const welcomevideo=document.getElementById("welcome")
  useEffect(() => {
    if (isOverlayVisible) return;
    responseVideoRef.current.play();
  }, [isOverlayVisible]);

  // Sends the message to the server
  const sendDialogToServer = async (message) => {
    if (message.trim() !== "") {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      console.log("Captured text : ", message);
      const res = await axios.post(
        "https://vidchatapi.herokuapp.com/text-input",
        {
          message: message,
        }
      );
      const responseVideoName =
        res.data.data[0].queryResult.fulfillmentText ;
      console.log("Video to be played : ", responseVideoName);
      setVideoInQueue(responseVideoName);
    }
  };

  const commands = [
    {
      command: "*",
      callback: (message) => sendDialogToServer(message),
    },
  ];
  const { listening, browserSupportsSpeechRecognition } = useSpeechRecognition({
    commands,
  });

  useEffect(() => {
    if (isOverlayVisible) return;
    responseVideoRef.current.play();
  }, [isOverlayVisible]);

  useEffect(() => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
 
    console.log(`I'm ${!listening ? "not" : ""} listening`);

    if (!listening) return;
    timeoutId.current = setTimeout(() => {
      const responseVideoName = "thankyou.mp4";
      console.log("Video to be played : ", responseVideoName);
      setVideoInQueue(responseVideoName);
    }, TIMEOUT);
  }, [listening]);

  // Checks browser compatibility
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      {/* Loop video plays indefinitely in background */}
      <video
        className="video"
        ref={loopVideoRef}
        muted
        onPlay={() => console.log("Playing loop.mp4")}
        onEnded={() => {
          //If no video is in queue we loop the video again from 0th second
          if (!videoInQueue) {
            // loopVideoRef.current.currentTime = 0;
            loopVideoRef.current.play();
            return;
          }

          //If there is a video in queue we set that to be played and make the response visible
          setVideoName(videoInQueue);
          setVideoInQueue(undefined);
          setResponseVideoVisible(true);
          responseVideoRef.current.load();
          SpeechRecognition.stopListening();
          responseVideoRef.current.play();
        }}
      >
        <source src="/videos/loop.mp4" type="video/mp4" />
      </video>

      {/* Loading the response video, initially the video name is welcome.mp4 */}
      
      <video
        className="video"
        ref={responseVideoRef}
        onPlay={()=>{
        if(videoName==="video1"){
          video1.play()
          loopvideo.style.zIndex=-2
          video1.style.zIndex=2}
        else if(videoName==="video2"){
          video2.play()
          loopvideo.style.zIndex=-2
          video2.style.zIndex=2}
        else if(videoName==="video3"){
          video3.play()
          video3.style.zIndex=2
          loopvideo.style.zIndex=-2}
        else if(videoName==="video4"){
          video4.play()
          video4.style.zIndex=2
          loopvideo.style.zIndex=-2}
        else if(videoName==="video5"){
          loopvideo.style.zIndex=-2
        video5.style.zIndex=2
          video5.play()}
        else{
          if (!videoInQueue) {
            loopvideo.play()
            loopVideoRef.current.play();
          }
          
        }
      }
      }
        onEnded={() => {
          // To reset the loop video to 0th second
          loopVideoRef.current.play();
          if (videoName !== "thankyou.mp4")
            SpeechRecognition.startListening({ continuous: true });
          else console.log("I won't listen anymore");

        }}
        style={{ zIndex: isResponseVideoVisible ? -3 : -1 }}
      >
        <source src={`/videos/${videoName}`} type="video/mp4" />
      </video>
      <video 
      id="loopvideo"
      muted 
      className="video" 
      style={{zIndex:-1}}
      onPlay={()=>{loopvideo.style.zIndex=20}}
      onEnded={()=>{
        loopvideo.play()
        loopvideo.style.zIndex=-2
        loopVideoRef.current.play();
        if (videoName !== "thankyou.mp4")
          SpeechRecognition.startListening({ continuous: true });
        else console.log("I won't listen anymore");}}>

        <source src="videos/loop.mp4" type="video/mp4" />
      </video>
      <video 
      id="video1" 
      className="video" 
      style={{zIndex:-1}}
      onPlay={()=>{
        
        console.log("Video 1 playing")}}
        onEnded={()=>{
        loopvideo.play()
        video1.style.zIndex=-2
        loopVideoRef.current.play();
        if (videoName !== "thankyou.mp4")
          SpeechRecognition.startListening({ continuous: true });
        else console.log("I won't listen anymore");}}>

        <source src="videos/video1.mp4" type="video/mp4" />
      </video>
      <video 
      muted
      id="video2" 
      className="video" 
      style={{zIndex:-1}}
      onPlay={()=>{
        
        console.log("Video 2 playing")}}
      onEnded={()=>{
        loopvideo.play()
        video2.style.zIndex=-2
        loopVideoRef.current.play();
        if (videoName !== "thankyou.mp4")
          SpeechRecognition.startListening({ continuous: true });
        else console.log("I won't listen anymore");}}>

        <source src="videos/video2.mp4" type="video/mp4" />
      </video>
      <video 
      muted
      id="video3" 
      className="video" 
      style={{zIndex:-1}}
      onPlay={()=>{
        
        
        console.log("Video 3 playing")}}
      onEnded={()=>{
        loopvideo.play()
        video3.style.zIndex=-2
        loopVideoRef.current.play();
        if (videoName !== "thankyou.mp4")
          SpeechRecognition.startListening({ continuous: true });
        else console.log("I won't listen anymore");}}>

        <source src="videos/video3.mp4" type="video/mp4" />
      </video>
      <video 
      muted
      id="video4" 
      className="video" 
      style={{zIndex:-1}}
      onPlay={()=>{
        console.log("Video 4 playing")}}
      onEnded={()=>{
        loopvideo.play()
        video4.style.zIndex=-2
        loopVideoRef.current.play();
        if (videoName !== "thankyou.mp4")
          SpeechRecognition.startListening({ continuous: true });
        else console.log("I won't listen anymore");}}>

        <source src="videos/video4.mp4" type="video/mp4" />
      </video>
      <video 
      id="video5" 
      muted
      className="video" 
      style={{zIndex:-1}}
      onPlay={()=>{
        
      console.log("Video 5 playing")}}
      onEnded={()=>{
        loopvideo.play();
        video5.style.zIndex=-2
        loopVideoRef.current.play();
        if (videoName !== "thankyou.mp4")
          SpeechRecognition.startListening({ continuous: true });
        else console.log("I won't listen anymore");}}>

        <source src="videos/video5.mp4" type="video/mp4" />
      </video>
    <video id="welcome" className="video" style={{zIndex:21,position:"absolute"}}
    onEnded={()=>{welcomevideo.style.zIndex=-3
    loopvideo.play()
    loopVideoRef.current.play();}}>
      <source src="videos/welcome.mp4" type="video/mp4"></source>
    </video>
      

      

      {isOverlayVisible && (
        <div className="overlay" style={{zIndex:22}}>
          <img
            onClick={() => {setOverlayVisible(false)
              const welcomevide=document.getElementById("welcome")
              welcomevide.play()}
              }
            height="100px"
            style={{
              cursor: "pointer",
            }}
            src={buttonBg}
            alt="button"
          />
        </div>
      )}
    </div>
    
  );
};

export default Home;
