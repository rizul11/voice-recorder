import React from "react";
import AudioRecorder from "./component/AudioRecorder";

const App = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div>
        <AudioRecorder />
      </div>
    </div>
  );
};

export default App;
