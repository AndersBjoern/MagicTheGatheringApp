class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = false;
  }

  playSound(soundFile) {
    if (this.isMuted) return;

    if (this.sounds[soundFile] && !this.sounds[soundFile].paused) {
      return;
    }

    if (!this.sounds[soundFile]) {
      this.sounds[soundFile] = new Audio(`./audio/${soundFile}.mp3`);
    }

    this.sounds[soundFile].currentTime = 0;
    this.sounds[soundFile].play();
  }

  muteAll(isMuted) {
    this.isMuted = isMuted;
    for (const sound in this.sounds) {
      if (this.sounds.hasOwnProperty(sound)) {
        this.sounds[sound].muted = isMuted;
      }
    }
  }
}

export const soundManager = new SoundManager();
