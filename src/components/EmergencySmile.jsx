import { useState } from 'react'
import { Sparkles, Heart, Smile, Copy, Check } from 'lucide-react'
import { smileJokesAndPuns } from '../data/comfortData'
import { playSparkle, playPop } from '../utils/audio'

export default function EmergencySmile({ girlfriendName = 'Princess', boyfriendName = 'Your boy' }) {
  const [jokeIndex, setJokeIndex] = useState(0)
  const [smileCount, setSmileCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [bursting, setBursting] = useState(false)

  const triggerSmile = () => {
    playSparkle()
    setBursting(true)
    setJokeIndex(prev => (prev + 1) % smileJokesAndPuns.length)
    setSmileCount(c => c + 1)
    setTimeout(() => setBursting(false), 900)
  }

  const copyReaction = () => {
    playPop()
    const text = `Hey ${boyfriendName}! Your comfort corner just made me smile so big 🥰 Love you!`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const currentJoke = smileJokesAndPuns[jokeIndex]

  return (
    <div className="feature-card smile-card">
      <div className="card-topline">
        <span className="icon-bubble yellow"><Smile size={18} /></span>
        <span className="card-label">INSTANT SMILE MACHINE</span>
        <span className="card-mini-heart">✨</span>
      </div>

      <h3>Need a smile, {girlfriendName}?</h3>
      <p className="card-subtitle">Guaranteed to deliver an immediate smile, giggle, or warm butterfly feeling.</p>

      <div className={`smile-bubble-box ${bursting ? 'popping' : ''}`}>
        <span className="smile-tag">{currentJoke.tag}</span>
        <p className="smile-text">"{currentJoke.text}"</p>
        {bursting && (
          <div className="smile-burst-particles">
            <span>✨</span><span>💖</span><span>🥰</span><span>🌸</span><span>⭐</span>
          </div>
        )}
      </div>

      <div className="smile-action-row">
        <button className="pink-button" onClick={triggerSmile}>
          <Sparkles size={16} /> Make me smile again!
        </button>

        <button className="soft-button" onClick={copyReaction} title="Copy cute reaction to text him!">
          {copied ? (
            <><Check size={14} color="#10b981" /> Copied sweet text! 💌</>
          ) : (
            <><Copy size={14} /> Send reaction to {boyfriendName}</>
          )}
        </button>
      </div>

      {smileCount > 0 && (
        <div className="smile-footer-note">
          <Heart size={12} fill="currentColor" color="#e88cad" />
          <span>{smileCount} {smileCount === 1 ? 'smile' : 'smiles'} delivered to your pretty face today!</span>
        </div>
      )}
    </div>
  )
}
