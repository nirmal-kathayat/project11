import { useState } from 'react'
import { Sparkles, Heart, RefreshCw, Star } from 'lucide-react'
import { playSparkle } from '../utils/audio'
import { reasonsWhyILoveYou } from '../data/comfortData'

export default function ReasonsJar({ girlfriendName = 'Princess' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealedCount, setRevealedCount] = useState(1)
  const [isOpening, setIsOpening] = useState(false)

  const drawNextReason = () => {
    setIsOpening(true)
    playSparkle()
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % reasonsWhyILoveYou.length)
      setRevealedCount(c => Math.min(reasonsWhyILoveYou.length, c + 1))
      setIsOpening(false)
    }, 280)
  }

  return (
    <div className="feature-card reasons-card">
      <div className="card-topline">
        <span className="icon-bubble pink"><Heart size={18} fill="currentColor" /></span>
        <span className="card-label">LITTLE LOVE NOTES</span>
        <span className="card-mini-heart">♡</span>
      </div>

      <h3>Why I adore you, {girlfriendName}</h3>
      <p className="card-subtitle">Every little thing about you is a reason my heart fell for you.</p>

      <div className="jar-display" onClick={drawNextReason} title="Tap the jar for another reason!">
        <div className={`jar-glass ${isOpening ? 'shaking' : ''}`}>
          <div className="jar-lid" />
          <div className="jar-stars">
            <span className="jar-star js1">⭐</span>
            <span className="jar-star js2">💖</span>
            <span className="jar-star js3">✨</span>
            <span className="jar-star js4">🌸</span>
            <span className="jar-star js5">💌</span>
          </div>
          <div className="jar-label-tag">Reasons Jar ♡</div>
        </div>

        <div className={`reason-paper ${isOpening ? 'folding' : ''}`}>
          <span className="reason-number">Reason #{currentIndex + 1} of {reasonsWhyILoveYou.length}</span>
          <p className="reason-text">"{reasonsWhyILoveYou[currentIndex]}"</p>
          <div className="reason-glow-decor">✧ 💖 ✧</div>
        </div>
      </div>

      <div className="reasons-bottom-bar">
        <button className="soft-button" onClick={drawNextReason}>
          <RefreshCw size={14} /> Draw another reason
        </button>
        <span className="reasons-progress-tag">
          <Star size={13} fill="#ffc233" color="#f59e0b" /> {revealedCount}/{reasonsWhyILoveYou.length} opened
        </span>
      </div>
    </div>
  )
}
