// Lightweight, dependency-free chess sound player mirroring lila's behaviour
// (ui/site/src/sound.ts): Web Audio API, decode-and-cache, .mp3 only, files at
// /sound/standard/<Name>.mp3 with the first letter capitalised.
//
// The official Lichess "standard" theme (copied into public/sound/standard/)
// plays audibly only Move and Capture for board moves — Check/Checkmate are
// silenced. For puzzle results we deliberately diverge from lila (which uses
// text-to-speech) and play Victory / Error files.

const SOUND_BASE = "/sound/standard";
const THROTTLE_MS = 100;

let ctx: AudioContext | null = null;
const buffers = new Map<string, Promise<AudioBuffer | null>>();
let lastPlayedAt = 0;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  return ctx;
};

const capitalize = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);

const load = (name: string): Promise<AudioBuffer | null> => {
  const audioCtx = getCtx();
  if (!audioCtx) return Promise.resolve(null);

  const url = `${SOUND_BASE}/${capitalize(name)}.mp3`;
  let buffer = buffers.get(url);
  if (!buffer) {
    buffer = fetch(url)
      .then((r) => r.arrayBuffer())
      .then((data) => audioCtx.decodeAudioData(data))
      .catch(() => null);
    buffers.set(url, buffer);
  }
  return buffer;
};

const play = (name: string, volume = 1): void => {
  const audioCtx = getCtx();
  if (!audioCtx) return;

  const run = () => {
    void load(name).then((buffer) => {
      if (!buffer) return;
      const source = audioCtx.createBufferSource();
      const gain = audioCtx.createGain();
      gain.gain.value = volume;
      source.buffer = buffer;
      source.connect(gain).connect(audioCtx.destination);
      source.start(0);
    });
  };

  if (audioCtx.state === "suspended") {
    void audioCtx.resume().then(run);
  } else {
    run();
  }
};

// unlockAudio should be called once from a user gesture (e.g. the first click
// on the puzzles page) so the AudioContext is allowed to produce sound.
export const unlockAudio = (): void => {
  const audioCtx = getCtx();
  if (audioCtx && audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
};

// playMoveSound picks Capture vs Move from the SAN, mirroring lila's rule.
// Throttled to one sound per THROTTLE_MS to avoid overlap on fast sequences.
export const playMoveSound = (san: string): void => {
  const now = Date.now();
  if (now - lastPlayedAt < THROTTLE_MS) return;
  lastPlayedAt = now;
  play(san.includes("x") ? "capture" : "move");
};

// playResultSound plays a positive cue on a solve and an error cue on a fail.
export const playResultSound = (win: boolean): void => {
  play(win ? "victory" : "error");
};
