import { useState, useEffect } from 'react'
import {
  CloudRain, Flame, Music, Volume2, VolumeX, Sparkles, Heart,
  Play, Pause, SkipForward, SkipBack, Plus, Trash2, ExternalLink
} from 'lucide-react'
import { startAmbient, stopAmbient, setAmbientVolume, playPop, playSparkle } from '../utils/audio'
import { initialLoveSongs } from '../data/songsData'

function readStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : fallback
  } catch {
    return fallback
  }
}

function extractYoutubeId(input) {
  if (!input) return null
  const clean = input.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = clean.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export default function AmbientPlayer() {
  // Mode: 'songs' (Love Songs) or 'ambient' (Rain & Hearth)
  const [playerMode, setPlayerMode] = useState('songs')

  // Ambient sound state
  const [activeSound, setActiveSound] = useState(null)
  const [volume, setVolume] = useState(0.3)
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false)

  // Songs state
  const [customSongs, setCustomSongs] = useState(() => readStorage('princess-custom-songs', []))
  const [selectedLang, setSelectedLang] = useState('all') // 'all', 'hindi', 'english', 'custom'
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isSongPlaying, setIsSongPlaying] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSongTitle, setNewSongTitle] = useState('')
  const [newSongArtist, setNewSongArtist] = useState('')
  const [newSongUrl, setNewSongUrl] = useState('')
  const [addError, setAddError] = useState('')

  useEffect(() => {
    localStorage.setItem('princess-custom-songs', JSON.stringify(customSongs))
  }, [customSongs])

  const allSongs = [...initialLoveSongs, ...customSongs]

  const filteredSongs = allSongs.filter(song => {
    if (selectedLang === 'all') return true
    if (selectedLang === 'hindi') return song.language === 'hindi'
    if (selectedLang === 'english') return song.language === 'english'
    if (selectedLang === 'custom') return song.isCustom
    return true
  })

  const currentSong = filteredSongs[currentSongIndex] || filteredSongs[0] || initialLoveSongs[0]

  // Ambient handlers
  const sounds = [
    { id: 'rain', label: 'Gentle Rain', icon: CloudRain, desc: 'Soft window raindrops' },
    { id: 'fire', label: 'Warm Hearth', icon: Flame, desc: 'Crackling cozy fireplace' },
    { id: 'lullaby', label: 'Music Box', icon: Music, desc: 'Dreamy soft lullaby' }
  ]

  const handleToggleAmbient = (soundId) => {
    playPop()
    if (activeSound === soundId && isAmbientPlaying) {
      stopAmbient()
      setIsAmbientPlaying(false)
      setActiveSound(null)
    } else {
      startAmbient(soundId, volume)
      setActiveSound(soundId)
      setIsAmbientPlaying(true)
    }
  }

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    setAmbientVolume(val)
  }

  const handleStopAmbient = () => {
    stopAmbient()
    setIsAmbientPlaying(false)
    setActiveSound(null)
  }

  // Song handlers
  const handleSelectSong = (song) => {
    playSparkle()
    const idx = filteredSongs.findIndex(s => s.id === song.id)
    if (idx !== -1) {
      setCurrentSongIndex(idx)
    }
    setIsSongPlaying(true)
  }

  const handleNextSong = () => {
    playPop()
    setCurrentSongIndex(prev => (prev + 1) % filteredSongs.length)
    setIsSongPlaying(true)
  }

  const handlePrevSong = () => {
    playPop()
    setCurrentSongIndex(prev => (prev - 1 + filteredSongs.length) % filteredSongs.length)
    setIsSongPlaying(true)
  }

  const handleAddSong = (e) => {
    e.preventDefault()
    setAddError('')
    const ytId = extractYoutubeId(newSongUrl)
    if (!ytId) {
      setAddError('Please enter a valid YouTube video URL or ID (e.g. youtube.com/watch?v=...)')
      return
    }
    if (!newSongTitle.trim()) {
      setAddError('Please enter a song title')
      return
    }

    const newTrack = {
      id: 'custom-' + Date.now(),
      title: newSongTitle.trim(),
      artist: newSongArtist.trim() || 'Our Special Song',
      language: 'custom',
      langLabel: 'Our Song ⭐',
      emoji: '💖',
      youtubeId: ytId,
      vibe: 'Handpicked with Love',
      isCustom: true
    }

    playSparkle()
    setCustomSongs(prev => [newTrack, ...prev])
    setNewSongTitle('')
    setNewSongArtist('')
    setNewSongUrl('')
    setShowAddForm(false)
    setSelectedLang('custom')
    setCurrentSongIndex(0)
    setIsSongPlaying(true)
  }

  const handleDeleteCustomSong = (id, e) => {
    e.stopPropagation()
    playPop()
    setCustomSongs(prev => prev.filter(s => s.id !== id))
  }

  useEffect(() => {
    return () => {
      stopAmbient()
    }
  }, [])

  return (
    <div className="feature-card ambient-card love-jukebox-card">
      <div className="card-topline">
        <span className="icon-bubble lavender"><Music size={19} /></span>
        <span className="card-label">COZY LOVE JUKEBOX & SOUNDS</span>
        {isSongPlaying && (
          <span className="playing-pulse">
            <span className="sound-bars">
              <i /><i /><i />
            </span>
            playing love song
          </span>
        )}
        {isAmbientPlaying && !isSongPlaying && (
          <span className="playing-pulse">● ambient on</span>
        )}
      </div>

      <h3>Romantic music & relaxing sounds</h3>
      <p className="card-subtitle">
        Listen to real Hindi & English love songs curated just for you, or cozy rain and fireplace sounds.
      </p>

      {/* Main Mode Toggle: Love Songs vs Ambient */}
      <div className="jukebox-mode-tabs">
        <button
          className={`jukebox-tab-btn ${playerMode === 'songs' ? 'active' : ''}`}
          onClick={() => { playPop(); setPlayerMode('songs') }}
        >
          <Heart size={14} fill={playerMode === 'songs' ? 'currentColor' : 'none'} />
          <span>Love Songs (Hindi & English)</span>
        </button>

        <button
          className={`jukebox-tab-btn ${playerMode === 'ambient' ? 'active' : ''}`}
          onClick={() => { playPop(); setPlayerMode('ambient') }}
        >
          <CloudRain size={14} />
          <span>Ambient Relax Sounds</span>
        </button>
      </div>

      {/* MODE 1: LOVE SONGS PLAYER */}
      {playerMode === 'songs' && (
        <div className="love-songs-view">
          {/* Language Filter Pills */}
          <div className="song-lang-pills">
            <button
              className={`song-pill ${selectedLang === 'all' ? 'active' : ''}`}
              onClick={() => { playPop(); setSelectedLang('all'); setCurrentSongIndex(0) }}
            >
              🌸 All Love Songs ({allSongs.length})
            </button>
            <button
              className={`song-pill ${selectedLang === 'hindi' ? 'active' : ''}`}
              onClick={() => { playPop(); setSelectedLang('hindi'); setCurrentSongIndex(0) }}
            >
              🇮🇳 Hindi Romance ({allSongs.filter(s => s.language === 'hindi').length})
            </button>
            <button
              className={`song-pill ${selectedLang === 'english' ? 'active' : ''}`}
              onClick={() => { playPop(); setSelectedLang('english'); setCurrentSongIndex(0) }}
            >
              💖 English Romance ({allSongs.filter(s => s.language === 'english').length})
            </button>
            {customSongs.length > 0 && (
              <button
                className={`song-pill ${selectedLang === 'custom' ? 'active' : ''}`}
                onClick={() => { playPop(); setSelectedLang('custom'); setCurrentSongIndex(0) }}
              >
                ⭐ Our Songs ({customSongs.length})
              </button>
            )}
          </div>

          {/* Currently Selected Song Screen & Embedded YouTube Player */}
          <div className="now-playing-panel">
            <div className="now-playing-header">
              <div className="now-playing-title-col">
                <span className="now-playing-lang-tag">
                  {currentSong.emoji} {currentSong.langLabel} • {currentSong.vibe}
                </span>
                <h4 className="now-playing-song-name">{currentSong.title}</h4>
                <span className="now-playing-artist">{currentSong.artist}</span>
              </div>

              <div className="now-playing-nav-btns">
                <button
                  className="song-nav-btn"
                  onClick={handlePrevSong}
                  title="Previous song"
                  aria-label="Previous song"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  className="song-nav-btn primary"
                  onClick={() => setIsSongPlaying(p => !p)}
                  title={isSongPlaying ? 'Pause video' : 'Play video'}
                  aria-label={isSongPlaying ? 'Pause' : 'Play'}
                >
                  {isSongPlaying ? <Pause size={17} /> : <Play size={17} />}
                </button>
                <button
                  className="song-nav-btn"
                  onClick={handleNextSong}
                  title="Next song"
                  aria-label="Next song"
                >
                  <SkipForward size={16} />
                </button>
              </div>
            </div>

            {/* Embedded YouTube Player */}
            <div className="player-iframe-container">
              {isSongPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${currentSong.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={`${currentSong.title} by ${currentSong.artist}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="love-song-iframe"
                />
              ) : (
                <div
                  className="player-idle-placeholder"
                  onClick={() => setIsSongPlaying(true)}
                  title="Click to start playing"
                >
                  <div className="vinyl-disc">
                    <div className="vinyl-grooves" />
                    <div className="vinyl-center">
                      <Heart size={20} fill="#df8eae" color="#df8eae" />
                    </div>
                  </div>
                  <div className="idle-meta">
                    <b>Tap to play "{currentSong.title}"</b>
                    <small>Official music track with full audio & visuals</small>
                  </div>
                  <button className="pink-button play-badge-btn">
                    <Play size={14} /> Start music
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Song Playlist Grid */}
          <div className="playlist-heading-row">
            <span className="playlist-title">Select a love song:</span>
            <button
              className="add-song-toggle-btn"
              onClick={() => { playPop(); setShowAddForm(s => !s) }}
            >
              <Plus size={13} /> {showAddForm ? 'Close form' : 'Add our song'}
            </button>
          </div>

          {/* Form to add custom love song */}
          {showAddForm && (
            <form onSubmit={handleAddSong} className="add-song-card-form">
              <b>Add your special couple song:</b>
              <div className="add-song-inputs">
                <input
                  type="text"
                  placeholder="Song Title (e.g. Tum Hi Ho / Perfect)"
                  value={newSongTitle}
                  onChange={e => setNewSongTitle(e.target.value)}
                  className="add-input"
                />
                <input
                  type="text"
                  placeholder="Artist (e.g. Arijit Singh / Ed Sheeran)"
                  value={newSongArtist}
                  onChange={e => setNewSongArtist(e.target.value)}
                  className="add-input"
                />
                <input
                  type="text"
                  placeholder="YouTube Video URL or ID"
                  value={newSongUrl}
                  onChange={e => setNewSongUrl(e.target.value)}
                  className="add-input"
                />
              </div>
              {addError && <span className="add-error-text">{addError}</span>}
              <div className="add-form-actions">
                <button type="submit" className="pink-button add-submit-btn">
                  <Heart size={14} fill="currentColor" /> Add to playlist
                </button>
                <button
                  type="button"
                  className="soft-button"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="songs-list-grid">
            {filteredSongs.map((song, idx) => {
              const isSelected = currentSong.id === song.id
              return (
                <div
                  key={song.id}
                  className={`song-card-item ${isSelected ? 'active-song' : ''}`}
                  onClick={() => handleSelectSong(song)}
                >
                  <span className="song-item-emoji">{song.emoji}</span>
                  <div className="song-item-meta">
                    <b>{song.title}</b>
                    <small>{song.artist}</small>
                  </div>
                  <div className="song-item-actions">
                    <span className="song-item-lang">{song.langLabel}</span>
                    {song.isCustom && (
                      <button
                        className="song-item-del"
                        onClick={(e) => handleDeleteCustomSong(song.id, e)}
                        title="Remove custom song"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                    <span className="song-play-icon">
                      {isSelected && isSongPlaying ? '🎶' : '▶'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* MODE 2: AMBIENT SOUNDS (RAIN, HEARTH, LULLABY) */}
      {playerMode === 'ambient' && (
        <div className="ambient-sounds-view">
          <div className="ambient-buttons">
            {sounds.map(s => {
              const Icon = s.icon
              const isActive = activeSound === s.id && isAmbientPlaying
              return (
                <button
                  key={s.id}
                  className={`ambient-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleToggleAmbient(s.id)}
                >
                  <span className="ambient-icon-wrapper">
                    <Icon size={18} />
                  </span>
                  <div className="ambient-meta">
                    <b>{s.label}</b>
                    <small>{s.desc}</small>
                  </div>
                  {isActive && <span className="active-dot">✨</span>}
                </button>
              )
            })}
          </div>

          {isAmbientPlaying && (
            <div className="ambient-controls">
              <div className="volume-slider-row">
                <Volume2 size={15} className="vol-icon" />
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="cozy-slider"
                  aria-label="Volume slider"
                />
              </div>
              <button className="ambient-stop-btn" onClick={handleStopAmbient}>
                <VolumeX size={14} /> Stop sound
              </button>
            </div>
          )}

          <p className="ambient-hint">
            💡 <em>Tip:</em> You can keep gentle rain playing while listening to a love song for the ultimate cozy rainy day feeling!
          </p>
        </div>
      )}
    </div>
  )
}
