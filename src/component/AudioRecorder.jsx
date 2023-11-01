import React, { useState, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import SpeechlySpeechRecognition from "@speechly/speech-recognition-polyfill";

const AudioRecorder = () => {
  const [textToCopy, setTextToCopy] = useState();
  const [isCopied, setCopied] = useClipboard(textToCopy, {
    successDuration: 1000,
  });

  const audioRef = useRef(null);
  const mediaRecorder = useRef(null);
  const recordedAudioChunks = useRef([]);

  const { transcript, browserSupportsSpeechRecognition, listening } =
    useSpeechRecognition();

  const startListening = () => {
    // Create a MediaRecorder for audio recording.
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedAudioChunks.current.push(event.data);
          }
        };

        mediaRecorder.current.onstop = () => {
          if (recordedAudioChunks.current.length > 0) {
            const audioBlob = new Blob(recordedAudioChunks.current, {
              type: "audio/wav",
            });
            const audioStreamUrl = URL.createObjectURL(audioBlob);

            if (audioRef.current) {
              audioRef.current.src = audioStreamUrl;
              audioRef.current.play();
            }
          }
        };

        mediaRecorder.current.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
      speechRecognitionPolyfill: SpeechlySpeechRecognition,
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
  };

  return (
    <div className="container">
      <h2>Speech to Text Converter</h2>
      <br />
      <p>
      This app essentially provides a real-time speech-to-text feature with the option to playback the recorded audio
      </p>

      <div className="main-content" onClick={() => setTextToCopy(transcript)}>
        {transcript}
      </div>

      <div className="btn-style">
        <button onClick={setCopied}>
          {isCopied ? "Copied!" : "Copy to clipboard"}
        </button>
        {listening ? (
          <button onClick={stopListening}>Stop recording and startListening </button>
        ) : (
          <button onClick={startListening}>Start recording</button>
        )}
        <div className="audio-container">
          <audio ref={audioRef} controls></audio>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
