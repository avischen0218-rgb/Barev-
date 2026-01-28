
import React from 'react';

// Manual Base64 decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // Use data.buffer with byteOffset and length to be safer with memory alignment
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Global shared AudioContext to avoid repeated initialization and suspension issues
let sharedAudioContext: AudioContext | null = null;

export const playAudio = async (base64Data: string) => {
  try {
    if (!sharedAudioContext) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      sharedAudioContext = new AudioContextClass({ sampleRate: 24000 });
    }

    // Crucial: Browsers often suspend audio until a user interaction (like this click)
    if (sharedAudioContext.state === 'suspended') {
      await sharedAudioContext.resume();
    }

    const audioBuffer = await decodeAudioData(
      decode(base64Data),
      sharedAudioContext,
      24000,
      1,
    );

    const source = sharedAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(sharedAudioContext.destination);
    source.start();
  } catch (error) {
    console.error("Audio playback error:", error);
  }
};
