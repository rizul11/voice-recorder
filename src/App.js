import React from 'react';
import './App.css';
import AudioRecorder from './component/AudioRecorder';

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                <AudioRecorder />
            </header>
        </div>
    );
};

export default App;
