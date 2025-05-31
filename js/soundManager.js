class SoundManager {
  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.sounds = {};
    this.isMuted = false;
    this.mediaElement = null;
    window.addEventListener("click", () => {
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
    });
  }

  async playSound(soundFile) {
    if (this.isMuted) return;

    this.sounds ??= {};
    this.activeSources ??= {};

    if (this.activeSources[soundFile]) {
      return;
    }

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

    this.activeSources[soundFile] = source;

    source.onended = () => {
      delete this.activeSources[soundFile];
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
