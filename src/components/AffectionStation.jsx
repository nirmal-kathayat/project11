import { useState } from 'react'
import { Heart, Sparkles, HandHeart } from 'lucide-react'
import { playSparkle, playPop } from '../utils/audio'

export default function AffectionStation({ girlfriendName = 'Princess' }) {
  const [activeAffection, setActiveAffection] = useState(null)
  const [affectionTally, setAffectionTally] = useState(0)

  const actions = [
    {
      id: 'kiss',
      emoji: '💋',
      title: 'Forehead Kiss',
      text: `*Mwah!* A tender, warm kiss right on your forehead to remind you that you are safe and adored, ${girlfriendName}.`
    },
    {
      id: 'pat',
      emoji: '💆‍♀️',
      title: 'Gentle Head Pat',
      text: 'Gently playing with your soft hair... Good girl. You tried so hard today, and I am so proud of you.'
    },
    {
      id: 'hug',
      emoji: '🧸',
      title: 'Big Bear Hug',
      text: 'Pulling you in tight against my chest. No speaking needed, just listen to my heartbeat keeping you safe.'
    },
    {
      id: 'blanket',
      emoji: '🛌',
      title: 'Blanket Burrito',
      text: 'Wrapping you in the fluffiest warm blanket, tucking you in snug, and placing a cup of warm tea right beside you.'
    }
  ]

  const handleAction = (item) => {
    playSparkle()
    setActiveAffection(item)
    setAffectionTally(t => t + 1)
  }

  return (
    <div className="feature-card affection-card">
      <div className="card-topline">
        <span className="icon-bubble pink"><HandHeart size={18} /></span>
        <span className="card-label">VIRTUAL AFFECTION STATION</span>
        <span className="card-mini-heart">♡</span>
      </div>

      <h3>How can I love on you right now?</h3>
      <p className="card-subtitle">Tap whatever you are craving most right now to feel my warm presence.</p>

      <div className="affection-buttons-grid">
        {actions.map(action => (
          <button
            key={action.id}
            className={`affection-btn ${activeAffection?.id === action.id ? 'active' : ''}`}
            onClick={() => handleAction(action)}
          >
            <span className="affection-btn-emoji">{action.emoji}</span>
            <b>{action.title}</b>
          </button>
        ))}
      </div>

      {activeAffection && (
        <div className="affection-response-box">
          <div className="affection-response-icon">{activeAffection.emoji}</div>
          <div className="affection-response-copy">
            <b>{activeAffection.title} for you</b>
            <p>{activeAffection.text}</p>
          </div>
        </div>
      )}

      {affectionTally > 0 && (
        <div className="affection-counter">
          <Sparkles size={13} color="#df8eae" />
          <span>You have received {affectionTally} sweet cuddles & kisses today!</span>
        </div>
      )}
    </div>
  )
}
