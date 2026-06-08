class AudioManager {
  private audioContext: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicVolume = 0.5;
  private sfxVolume = 0.7;
  private musicEnabled = true;
  private sfxEnabled = true;
  private currentMusic: OscillatorNode | null = null;

  private init(): void {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.musicGain = this.audioContext.createGain();
      this.sfxGain = this.audioContext.createGain();
      this.musicGain.connect(this.audioContext.destination);
      this.sfxGain.connect(this.audioContext.destination);
      this.musicGain.gain.value = this.musicVolume;
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  playTone(frequency: number, duration: number, type: OscillatorType = 'square'): void {
    if (!this.sfxEnabled) return;
    this.init();
    if (this.audioContext && this.sfxGain) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      oscillator.connect(gainNode);
      gainNode.connect(this.sfxGain);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + duration);
    }
  }

  playClick(): void {
    this.playTone(800, 0.05);
  }

  playSuccess(): void {
    this.playTone(523, 0.1);
    setTimeout(() => this.playTone(659, 0.1), 100);
    setTimeout(() => this.playTone(784, 0.15), 200);
  }

  playError(): void {
    this.playTone(200, 0.2, 'sawtooth');
  }

  playCoin(): void {
    this.playTone(988, 0.1);
    setTimeout(() => this.playTone(1319, 0.15), 100);
  }

  playWave(): void {
    this.playTone(300, 0.3, 'sine');
  }

  playAchievement(): void {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2), i * 150);
    });
  }

  playMelody(notes: number[], tempo: number = 200): void {
    if (!this.musicEnabled) return;
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.3, 'triangle'), i * tempo);
    });
  }

  playSeaShanty(): void {
    const melody = [392, 440, 494, 523, 494, 440, 392, 349];
    this.playMelody(melody, 300);
  }

  playVictoryMarch(): void {
    const melody = [523, 659, 784, 659, 784, 1047, 784, 1047, 1319];
    this.playMelody(melody, 250);
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicVolume;
    }
  }

  setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
  }

  setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
    }
    this.currentMusic = null;
  }
}

export const audioManager = new AudioManager();
