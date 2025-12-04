
// Web Audio API kullanarak ses efektleri üreten yardımcı sınıf.
// Dışarıdan dosya yüklemeye gerek kalmadan çalışır.

class SoundManager {
  private ctx: AudioContext | null = null;

  private getContext() {
    if (!this.ctx) {
      // @ts-ignore - Safari desteği için webkitAudioContext
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    return this.ctx;
  }

  // Sadece sonuç çıktığında çalan zafer sesi
  playWin() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = now + (i * 0.1);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05); // Volume biraz daha kısıldı
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }
}

export const soundManager = new SoundManager();
