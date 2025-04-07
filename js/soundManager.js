class SoundManager {
  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.sounds = {};
    this.isMuted = false;
    this.mediaElement = null;
  }

  async playSound(soundFile) {
    if (this.isMuted) return;

    if (!this.sounds[soundFile]) {
      const response = await fetch(`./audio/${soundFile}.mp3`);
      const arrayBuffer = await response.arrayBuffer();
      this.sounds[soundFile] = await this.audioContext.decodeAudioData(
        arrayBuffer
      );
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[soundFile];
    source.connect(this.audioContext.destination);
    source.start();
  }

  async playSoundWithInterrupt(soundFile) {
    if (this.isMuted) return;

    if (!this.mediaElement) {
      this.mediaElement = new Audio();
    }
    this.mediaElement.src = `./audio/${soundFile}.mp3`;
    this.mediaElement.load();
    this.mediaElement.play();

    this.mediaElement.onended = () => {
      this.mediaElement = null;
    };
  }

  muteAll(isMuted) {
    this.isMuted = isMuted;
    if (this.isMuted) {
      this.audioContext.suspend();
      if (this.mediaElement) {
        this.mediaElement.pause();
      }
    } else {
      this.audioContext.resume();
    }
  }
}

export const soundManager = new SoundManager();
