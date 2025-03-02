class SoundManager {
  constructor() {
    this.sounds = {}; // Objekt til at gemme alle lydfiler
    this.activeSounds = []; // Array til at holde styr på aktive lyde
    this.priorityQueue = []; // Queue til at holde prioriterede lyde
  }

  // Tilføj en lyd til manageren
  loadSound(name, url) {
    const audio = new Audio(url);
    audio.preload = "auto"; // Preload lyden
    this.sounds[name] = audio;
  }

  // Afspil en lyd
  play(name, priority = 0) {
    if (this.sounds[name]) {
      const sound = this.sounds[name];

      // Hvis lyden allerede spilles og den har lavere prioritet, skal vi stoppe den
      if (this.activeSounds.includes(name)) {
        // Tjek om den nuværende lyd har en højere prioritet
        if (priority > this.getSoundPriority(name)) {
          this.stop(name);
        } else {
          return;
        }
      }

      // Håndter lydprioritet
      if (priority > 0) {
        // Hvis lyden har høj prioritet, sæt den i køen
        this.priorityQueue.push({ sound: sound, priority: priority });
        this.playNextInQueue();
      } else {
        // Hvis ikke, afspil lyden direkte
        this.activeSounds.push(name);
        sound.play();
        sound.onended = () => this.stop(name); // Fjern lyden fra aktiv liste, når den er færdig
      }
    } else {
      console.error("Lyden ${name} findes ikke.");
    }
  }

  // Stop en lyd
  stop(name) {
    if (this.sounds[name]) {
      const sound = this.sounds[name];
      sound.pause();
      sound.currentTime = 0;
      this.activeSounds = this.activeSounds.filter(
        (activeName) => activeName !== name
      );
    }
  }

  // Stop alle lyde
  stopAll() {
    this.activeSounds.forEach((name) => {
      this.stop(name);
    });
  }

  // Hent den aktuelle prioritet af en lyd
  getSoundPriority(name) {
    const soundInQueue = this.priorityQueue.find(
      (item) => item.sound === this.sounds[name]
    );
    return soundInQueue ? soundInQueue.priority : 0;
  }

  // Afspil næste lyd i køen, hvis der er nogen
  playNextInQueue() {
    if (this.priorityQueue.length > 0) {
      // Sorter lyde efter prioritet (højeste først)
      this.priorityQueue.sort((a, b) => b.priority - a.priority);
      const nextSound = this.priorityQueue.shift(); // Fjern lyden fra køen
      const sound = nextSound.sound;

      // Afspil lyden og tilføj den til den aktive liste
      const soundName = Object.keys(this.sounds).find(
        (name) => this.sounds[name] === sound
      );
      if (soundName) {
        this.activeSounds.push(soundName);
        sound.play();
        sound.onended = () => this.stop(soundName); // Stop lyden, når den er færdig
      }
    }
  }
}
