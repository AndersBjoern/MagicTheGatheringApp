class SoundManager {
  constructor() {
    this.sounds = {};
  }

  playSound(soundFile) {
    if (this.sounds[soundFile]) {
      this.sounds[soundFile].currentTime = 0;
      this.sounds[soundFile].play();
    } else {
      const audio = new Audio(`./audio/${soundFile}`);
      audio.play();
      this.sounds[soundFile] = audio;
    }
  }
}

export const soundManager = new SoundManager();
