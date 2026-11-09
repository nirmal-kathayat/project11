import { useState } from 'react'
import { Mail, Heart, X, Sparkles } from 'lucide-react'
import { openWhenLetters } from '../data/comfortData'
import { playSparkle, playPop } from '../utils/audio'

export default function LoveLettersModal({ boyfriendName = 'Your favourite person' }) {
  const [selectedLetter, setSelectedLetter] = useState(null)

  const handleOpen = (letter) => {
    playSparkle()
    setSelectedLetter(letter)
  }

  const handleClose = () => {
    playPop()
    setSelectedLetter(null)
  }

  return (
    <div className="feature-card letters-card">
      <div className="card-topline">
        <span className="icon-bubble lavender"><Mail size={18} /></span>
        <span className="card-label">OPEN WHEN... ENVELOPES</span>
        <span className="card-mini-heart">♡</span>
      </div>

      <h3>Letters for your heart</h3>
      <p className="card-subtitle">Whenever you need a specific reminder, tap open the letter written just for that moment.</p>

      <div className="letters-envelope-grid">
        {openWhenLetters.map(letter => (
          <button
            key={letter.id}
            className="envelope-btn"
            style={{ '--envelope-tint': letter.color }}
            onClick={() => handleOpen(letter)}
          >
            <span className="envelope-stamp">{letter.emoji}</span>
            <div className="envelope-copy">
              <b>{letter.title}</b>
              <small>Tap to read letter 💌</small>
            </div>
          </button>
        ))}
      </div>

      {selectedLetter && (
        <div className="letter-modal-backdrop" onClick={handleClose}>
          <div className="letter-paper-modal" onClick={e => e.stopPropagation()}>
            <button className="letter-modal-close" onClick={handleClose} aria-label="Close letter">
              <X size={18} />
            </button>
            <div className="letter-modal-top">
              <span className="letter-modal-emoji">{selectedLetter.emoji}</span>
              <h4>{selectedLetter.title}</h4>
              <div className="letter-modal-divider">✦ ♡ ✦</div>
            </div>

            <div className="letter-modal-body">
              {selectedLetter.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="letter-modal-footer">
              <div className="letter-modal-sign">
                <span>With all my love,</span>
                <b>{boyfriendName} <Heart size={14} fill="currentColor" /></b>
              </div>
              <button className="soft-button" onClick={handleClose}>
                <Sparkles size={14} /> Keep in my heart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
