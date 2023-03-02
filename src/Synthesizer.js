import React, { useState, useEffect } from 'react';
import * as custom_utils from './Utils.js';

const wavetypes = ['Sine', 'Triangle', 'Square', 'Sawtooth'];
let started = false;

const audioContext = new AudioContext();
const osc = audioContext.createOscillator();
osc.type = 'Sine';

const gain = audioContext.createGain();
osc.connect(gain);
gain.connect(audioContext.destination);
gain.gain.value = 0;

export const Synthesizer = ({ frequency, volume }) => {
    const [wavetype, setWavetype] = useState(0);
    const [oscState, setOscState] = useState(false);
    console.log(frequency);
    console.log(volume);

    useEffect(() => {
        osc.type = wavetype;
    }, [wavetype]);

    useEffect(() => {
        if (!frequency || !volume || !oscState) {
            gain.gain.value = 0;
        }
        else {
            osc.frequency.value = frequency;
            gain.gain.value = volume;
        }
    }, [frequency, volume, oscState]);

    return(
        <div>
          <p>
            Synth Here!
          </p>
          <button onClick={() => 
            {
              if (!started) {
                osc.start();
                started = true;
              }
              setOscState(!oscState);
              console.log(oscState);
            }}>
            {oscState ? "Stop" : "Start"}
          </button>
        </div>
    )
};