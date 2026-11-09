// Pure Web Audio API Sound Synthesizer (Zero external files needed)
let audioCtx = null

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// Gentle bell chime
export function playChime(pitchMultiplier = 1) {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33 * pitchMultiplier, now) // D5
    osc.frequency.exponentialRampToValueAtTime(880 * pitchMultiplier, now + 0.08)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.82)
  } catch {
    // Ignore audio errors on unsupported browsers
  }
}

// Gentle soft pop
export function playPop() {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.09)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.1)
  } catch {}
}

// Sparkle / Kiss tone
export function playSparkle() {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.06
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.36)
    })
  } catch {}
}

// Ambient Sound Engine (Rain, Hearth, Lullaby)
let currentAmbient = null

export function stopAmbient() {
  if (currentAmbient) {
    try {
      if (currentAmbient.stop) currentAmbient.stop()
      if (currentAmbient.timer) clearInterval(currentAmbient.timer)
    } catch {}
    currentAmbient = null
  }
}

export function startAmbient(type, volume = 0.25) {
  stopAmbient()
  const ctx = getCtx()
  if (!ctx) return

  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(volume, ctx.currentTime)
  masterGain.connect(ctx.destination)

  if (type === 'rain') {
    // Pink noise generator for soothing rain
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035
      b6 = white * 0.115926
    }

    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(850, ctx.currentTime)

    whiteNoise.connect(filter)
    filter.connect(masterGain)
    whiteNoise.start()

    currentAmbient = {
      type: 'rain',
      masterGain,
      stop: () => {
        whiteNoise.stop()
        whiteNoise.disconnect()
      }
    }
  } else if (type === 'fire') {
    // Warm rumble + crackles
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.04
    }

    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true

    const lowFilter = ctx.createBiquadFilter()
    lowFilter.type = 'lowpass'
    lowFilter.frequency.setValueAtTime(350, ctx.currentTime)

    noise.connect(lowFilter)
    lowFilter.connect(masterGain)
    noise.start()

    // Random crackle pops
    const crackleInterval = setInterval(() => {
      if (Math.random() > 0.4 && ctx.state === 'running') {
        const crackleOsc = ctx.createOscillator()
        const crackleGain = ctx.createGain()
        crackleOsc.type = 'square'
        crackleOsc.frequency.setValueAtTime(100 + Math.random() * 800, ctx.currentTime)
        crackleGain.gain.setValueAtTime(0.04 * (Math.random() * 0.8 + 0.2), ctx.currentTime)
        crackleGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04)

        crackleOsc.connect(crackleGain)
        crackleGain.connect(masterGain)
        crackleOsc.start()
        crackleOsc.stop(ctx.currentTime + 0.05)
      }
    }, 120)

    currentAmbient = {
      type: 'fire',
      masterGain,
      timer: crackleInterval,
      stop: () => {
        clearInterval(crackleInterval)
        noise.stop()
        noise.disconnect()
      }
    }
  } else if (type === 'lullaby') {
    // Gentle music box lullaby loop
    const melody = [
      { note: 523.25, dur: 0.5 }, // C5
      { note: 659.25, dur: 0.5 }, // E5
      { note: 783.99, dur: 0.6 }, // G5
      { note: 1046.50, dur: 0.8 }, // C6
      { note: 880.00, dur: 0.5 }, // A5
      { note: 783.99, dur: 0.7 }, // G5
      { note: 659.25, dur: 0.6 }, // E5
      { note: 587.33, dur: 0.8 }  // D5
    ]
    let step = 0

    const playNextNote = () => {
      if (!currentAmbient || currentAmbient.type !== 'lullaby') return
      const current = melody[step % melody.length]
      step++

      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(current.note, now)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + current.dur * 1.5)

      osc.connect(gain)
      gain.connect(masterGain)

      osc.start(now)
      osc.stop(now + current.dur * 1.6)
    }

    playNextNote()
    const lullabyTimer = setInterval(playNextNote, 850)

    currentAmbient = {
      type: 'lullaby',
      masterGain,
      timer: lullabyTimer,
      stop: () => {
        clearInterval(lullabyTimer)
      }
    }
  }

  return currentAmbient
}

export function setAmbientVolume(vol) {
  if (currentAmbient && currentAmbient.masterGain && audioCtx) {
    currentAmbient.masterGain.gain.setValueAtTime(vol, audioCtx.currentTime)
  }
}
