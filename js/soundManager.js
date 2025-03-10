class SoundManager {
  constructor() {
    this.sounds = {};
    this.currentlyPlaying = null;
  }

  playSound(soundFile) {
    if (this.currentlyPlaying && this.currentlyPlaying !== soundFile) {
      this.sounds[this.currentlyPlaying].pause();
      this.sounds[this.currentlyPlaying].currentTime = 0;
    }

    if (this.sounds[soundFile] && this.sounds[soundFile].paused === false) {
      return;
    }

    const audio =
      this.sounds[soundFile] || new Audio(`./audio/${soundFile}.mp3`);
    audio.currentTime = 0;
    audio.play();

    this.sounds[soundFile] = audio;
    this.currentlyPlaying = soundFile;
  }
}

export const soundManager = new SoundManager();
