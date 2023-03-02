import React, { useState, useEffect } from 'react';
import * as camera_utils from '@mediapipe/camera_utils';
import * as drawing_utils from '@mediapipe/drawing_utils';
import * as hands_utils from '@mediapipe/hands';
import * as custom_utils from './Utils.js';
import './App.css';
import { Synthesizer } from './Synthesizer.js';

function App() {
  const [frequency, setFrequency] = useState(0);
  const [volume, setVolume] = useState(0);
  const domHand = "Right";

  useEffect(() => {
    const videoElement = document.getElementById('input_video');
    videoElement.style.display = "none";

    const hands = new hands_utils.Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
    const handsParameters = {
        maxNumHands : 2,
        modelComplexity: 0.8,
        minDetectionConfidence: 0.45,
        minTrackingConfidence: 0.45
    };
    hands.setOptions(handsParameters);
    hands.onResults(handleResults);

    const camera = new camera_utils.Camera(videoElement, {
      onFrame: async() => {
        await hands.send({image: videoElement});
      },
      width: 1280,
      height: 720
    });
    camera.start();
  }, []);

  const handleResults = (results) => {
    const canvasElement = document.getElementById('frame');
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    let iL = null;
    let iR = null;
    if (results.multiHandLandmarks.length === 2) {
      for (const mark of results.multiHandLandmarks) {
        drawing_utils.drawLandmarks(canvasCtx, mark, {color: '#FFFFFF', lineWidth: 0.25});
      }
      iL = results.multiHandedness.findIndex(obj => obj.label === domHand); //domHand controls Freq
      iR = (iL >= 0) ? 1 - iL : null;
    }
    if (iL === null || iR === null) {
      setFrequency(0);
      setVolume(0);
    }
    else {
      const lDepth = custom_utils.limit(-results.multiHandLandmarks[iL][9].z);
      const rDepth = custom_utils.limit(-results.multiHandLandmarks[iR][9].z);
      setFrequency(custom_utils.calcFrequency(lDepth));
      setVolume(rDepth);
    }
    canvasCtx.restore();
  }

  return (
    <div className="App">
      <div className="container">
        <video id="input_video"></video>
        <canvas id="frame" width="1280px" height="720px"></canvas>
        <Synthesizer frequency={frequency} volume={volume}></Synthesizer>
      </div>
    </div>
  );
}

export default App;
