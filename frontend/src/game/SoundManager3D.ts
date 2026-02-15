/**
 * SoundManager3D — Real audio SFX + Background Music + Synthesized fallbacks.
 *
 * Uses Kenney audio packs (OGG) for high-quality SFX and background music.
 * Falls back to synthesized Web Audio API sounds if files fail to load.
 *
 * Usage:
 *   const sound = SoundManager3D.getInstance();
 *   sound.play('spawn');
 *   sound.play('success');
 *   sound.playMusic('village');
 *   sound.stopMusic();
 */

type SoundName =
  | 'spawn'      // Pop sound when character/prop appears
  | 'move'       // Whoosh during movement
  | 'react'      // Sparkle/twinkle for reactions
  | 'success'    // Ascending chime for FULL_SUCCESS
  | 'partial'    // Single chime for PARTIAL_SUCCESS
  | 'fail'       // Descending wah-wah for FUNNY_FAIL
  | 'click'      // UI click
  | 'remove'     // Pop-out sound
  | 'intro'      // Magical reveal whoosh for task intro

/** Maps each SFX to an array of OGG files (picks random for variety) */
const SOUND_FILES: Record<SoundName, string[]> = {
  spawn:   ['/assets/audio/sfx/pepSound1.ogg', '/assets/audio/sfx/pepSound2.ogg', '/assets/audio/sfx/pepSound3.ogg'],
  move:    ['/assets/audio/sfx/phaseJump1.ogg', '/assets/audio/sfx/phaseJump2.ogg', '/assets/audio/sfx/phaseJump3.ogg'],
  react:   ['/assets/audio/sfx/powerUp1.ogg', '/assets/audio/sfx/powerUp2.ogg', '/assets/audio/sfx/powerUp3.ogg'],
  success: ['/assets/audio/jingles/jingles-pizzicato_00.ogg', '/assets/audio/jingles/jingles-pizzicato_01.ogg'],
  partial: ['/assets/audio/jingles/jingles-steel_00.ogg', '/assets/audio/jingles/jingles-steel_01.ogg'],
  fail:    ['/assets/audio/retro/lose1.ogg', '/assets/audio/retro/lose2.ogg', '/assets/audio/retro/lose3.ogg'],
  click:   ['/assets/audio/ui/click_001.ogg', '/assets/audio/ui/click_002.ogg', '/assets/audio/ui/click_003.ogg'],
  remove:  ['/assets/audio/ui/minimize_001.ogg', '/assets/audio/ui/minimize_002.ogg'],
  intro:   [], // Keep synthesized — the 2s magical sweep has no single-file equivalent
}

export type MusicZone =
  | 'village'
  | 'skeleton-birthday'
  | 'knight-space'
  | 'mage-kitchen'
  | 'barbarian-school'
  | 'dungeon-concert'
  | 'skeleton-pizza'
  | 'adventurers-picnic'
  | 'title'

/** Background music track per zone */
const ZONE_MUSIC: Record<MusicZone, string> = {
  'village':              '/assets/audio/music/Mishief-Stroll.ogg',
  'skeleton-birthday':    '/assets/audio/music/Retro-Mystic.ogg',
  'knight-space':         '/assets/audio/music/Space-Cadet.ogg',
  'mage-kitchen':         '/assets/audio/music/Italian-Mom.ogg',
  'barbarian-school':     '/assets/audio/music/Cheerful-Annoyance.ogg',
  'dungeon-concert':      '/assets/audio/music/Alpha-Dance.ogg',
  'skeleton-pizza':       '/assets/audio/music/Retro-Comedy.ogg',
  'adventurers-picnic':   '/assets/audio/music/Farm-Frolics.ogg',
  'title':                '/assets/audio/music/Wacky-Waiting.ogg',
}

class SoundManager3DClass {
  private ctx: AudioContext | null = null
  private muted = false
  private sfxVolume = 0.5
  private musicVolume = 0.3

  // AudioBuffer cache for SFX (decoded for instant playback)
  private bufferCache = new Map<string, AudioBuffer>()
  private loadingFiles = new Set<string>()

  // Background music (HTMLAudioElement for streaming)
  private musicElement: HTMLAudioElement | null = null
  private currentMusicZone: MusicZone | null = null
  private musicFadeInterval: ReturnType<typeof setInterval> | null = null

  private getCtx(): AudioContext | null {
    if (!this.ctx) {
      try {
        this.ctx = new AudioContext()
      } catch {
        console.warn('[SoundManager3D] Web Audio API not available')
        return null
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (this.musicElement) {
      this.musicElement.muted = muted
    }
  }

  isMuted(): boolean {
    return this.muted
  }

  setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol))
  }

  setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol))
    if (this.musicElement) {
      this.musicElement.volume = this.musicVolume
    }
  }

  // ── Preload SFX files for instant playback ──

  async preload() {
    const ctx = this.getCtx()
    if (!ctx) return

    const allFiles = Object.values(SOUND_FILES).flat()
    await Promise.allSettled(allFiles.map(f => this.loadBuffer(ctx, f)))
  }

  private async loadBuffer(ctx: AudioContext, url: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(url)) return this.bufferCache.get(url)!
    if (this.loadingFiles.has(url)) return null
    this.loadingFiles.add(url)

    try {
      const response = await fetch(url)
      if (!response.ok) return null
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
      this.bufferCache.set(url, audioBuffer)
      return audioBuffer
    } catch {
      // File not found or decode error — will fall back to synthesized
      return null
    } finally {
      this.loadingFiles.delete(url)
    }
  }

  // ── Play SFX ──

  play(name: SoundName) {
    if (this.muted) return
    const ctx = this.getCtx()
    if (!ctx) return

    try {
      const files = SOUND_FILES[name]
      if (files.length > 0) {
        const file = files[Math.floor(Math.random() * files.length)]
        this.playFile(ctx, file, name)
      } else {
        // No file mapped — use synthesized fallback
        this.playSynthesized(ctx, name)
      }
    } catch {
      // Never crash on sound failure
    }
  }

  private playFile(ctx: AudioContext, url: string, fallbackName: SoundName) {
    const cached = this.bufferCache.get(url)
    if (cached) {
      this.playBuffer(ctx, cached)
      return
    }
    // Not cached — play synthesized instantly, load file for next time
    this.playSynthesized(ctx, fallbackName)
    this.loadBuffer(ctx, url).catch(() => {})
  }

  private playBuffer(ctx: AudioContext, buffer: AudioBuffer) {
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const gain = ctx.createGain()
    gain.gain.value = this.sfxVolume
    source.connect(gain).connect(ctx.destination)
    source.start(0)
  }

  private playSynthesized(ctx: AudioContext, name: SoundName) {
    switch (name) {
      case 'spawn': this.playSpawn(ctx); break
      case 'move': this.playWhoosh(ctx); break
      case 'react': this.playSparkle(ctx); break
      case 'success': this.playSuccess(ctx); break
      case 'partial': this.playPartial(ctx); break
      case 'fail': this.playFail(ctx); break
      case 'click': this.playClick(ctx); break
      case 'remove': this.playRemove(ctx); break
      case 'intro': this.playIntro(ctx); break
    }
  }

  // ── Background Music ──

  playMusic(zone: MusicZone) {
    if (this.currentMusicZone === zone && this.musicElement && !this.musicElement.paused) {
      return // Already playing this zone's music
    }

    const url = ZONE_MUSIC[zone]
    if (!url) return

    // Fade out current music, then start new
    if (this.musicElement && !this.musicElement.paused) {
      this.fadeOutMusic(() => this.startMusic(url, zone))
    } else {
      this.startMusic(url, zone)
    }
  }

  private startMusic(url: string, zone: MusicZone) {
    // Clean up old element
    if (this.musicElement) {
      this.musicElement.pause()
      this.musicElement.src = ''
      this.musicElement = null
    }

    const audio = new Audio(url)
    audio.loop = true
    audio.volume = 0
    audio.muted = this.muted
    this.musicElement = audio
    this.currentMusicZone = zone

    audio.play().then(() => {
      this.fadeInMusic()
    }).catch(() => {
      // Autoplay blocked — will start on next user interaction
      const resume = () => {
        audio.play().then(() => this.fadeInMusic()).catch(() => {})
        document.removeEventListener('click', resume)
        document.removeEventListener('keydown', resume)
      }
      document.addEventListener('click', resume, { once: true })
      document.addEventListener('keydown', resume, { once: true })
    })
  }

  private fadeInMusic() {
    if (!this.musicElement) return
    if (this.musicFadeInterval) clearInterval(this.musicFadeInterval)

    let vol = 0
    this.musicFadeInterval = setInterval(() => {
      vol += 0.02
      if (vol >= this.musicVolume) {
        vol = this.musicVolume
        if (this.musicFadeInterval) clearInterval(this.musicFadeInterval)
        this.musicFadeInterval = null
      }
      if (this.musicElement) this.musicElement.volume = vol
    }, 50) // ~1.5s fade-in at 0.3 target
  }

  private fadeOutMusic(onComplete?: () => void) {
    if (!this.musicElement) { onComplete?.(); return }
    if (this.musicFadeInterval) clearInterval(this.musicFadeInterval)

    let vol = this.musicElement.volume
    this.musicFadeInterval = setInterval(() => {
      vol -= 0.03
      if (vol <= 0) {
        vol = 0
        if (this.musicFadeInterval) clearInterval(this.musicFadeInterval)
        this.musicFadeInterval = null
        if (this.musicElement) {
          this.musicElement.pause()
          this.musicElement.src = ''
          this.musicElement = null
        }
        onComplete?.()
      } else if (this.musicElement) {
        this.musicElement.volume = vol
      }
    }, 50) // ~0.5s fade-out
  }

  stopMusic() {
    this.fadeOutMusic()
    this.currentMusicZone = null
  }

  getCurrentMusicZone(): MusicZone | null {
    return this.currentMusicZone
  }

  // ── Synthesized Fallbacks ──

  private playSpawn(ctx: AudioContext) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15)
    gain.gain.setValueAtTime(0.3 * this.sfxVolume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
    osc.connect(gain).connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  }

  private playWhoosh(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 0.3
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(200, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15)
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3)
    filter.Q.value = 2
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.15 * this.sfxVolume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start(ctx.currentTime)
    source.stop(ctx.currentTime + 0.3)
  }

  private playSparkle(ctx: AudioContext) {
    const notes = [800, 1000, 1200, 1500]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = ctx.currentTime + i * 0.06
      gain.gain.setValueAtTime(0.15 * this.sfxVolume, start)
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.12)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.12)
    })
  }

  private playSuccess(ctx: AudioContext) {
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      const start = ctx.currentTime + i * 0.1
      gain.gain.setValueAtTime(0.2 * this.sfxVolume, start)
      gain.gain.linearRampToValueAtTime(0.15 * this.sfxVolume, start + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.4)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.4)
    })
  }

  private playPartial(ctx: AudioContext) {
    const notes = [523, 659]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      const start = ctx.currentTime + i * 0.15
      gain.gain.setValueAtTime(0.2 * this.sfxVolume, start)
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.3)
    })
  }

  private playFail(ctx: AudioContext) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4)
    gain.gain.setValueAtTime(0.15 * this.sfxVolume, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.1 * this.sfxVolume, ctx.currentTime + 0.2)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    osc.connect(gain).connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  }

  private playClick(ctx: AudioContext) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.value = 1000
    gain.gain.setValueAtTime(0.1 * this.sfxVolume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
    osc.connect(gain).connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
  }

  private playIntro(ctx: AudioContext) {
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(100, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.5)
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 2.0)
    filter.Q.value = 3
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.08 * this.sfxVolume, ctx.currentTime)
    noiseGain.gain.linearRampToValueAtTime(0.12 * this.sfxVolume, ctx.currentTime + 1.0)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0)
    noise.connect(filter).connect(noiseGain).connect(ctx.destination)
    noise.start(ctx.currentTime)
    noise.stop(ctx.currentTime + 2.0)

    const notes = [262, 330, 392, 523]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = ctx.currentTime + 0.8 + i * 0.3
      gain.gain.setValueAtTime(0.08 * this.sfxVolume, start)
      gain.gain.linearRampToValueAtTime(0.06 * this.sfxVolume, start + 0.2)
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.5)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.5)
    })
  }

  private playRemove(ctx: AudioContext) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(500, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)
    gain.gain.setValueAtTime(0.2 * this.sfxVolume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
    osc.connect(gain).connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.15)
  }
}

// Singleton
export const SoundManager3D = new SoundManager3DClass()
