import { useState, useEffect } from 'react'
import { Wind, Play, Pause, Heart, Sparkles } from 'lucide-react'
import { playChime } from '../utils/audio'

export default function BreatheCircle() {
  const [isActive, setIsActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0) // 0: Inhale, 1: Hold, 2: Exhale, 3: Rest
  const [cycles, setCycles] = useState(0)

  const phases = [
    { name: 'Inhale', text: 'Breathe in gentle, warm calm...', duration: 4, scale: 'scale-expand' },
    { name: 'Hold', text: 'Hold the warmth in your heart...', duration: 4, scale: 'scale-hold' },
    { name: 'Exhale', text: 'Slowly let go of all the tension...', duration: 4, scale: 'scale-shrink' },
    { name: 'Rest', text: 'You are safe, loved, and at peace...', duration: 4, scale: 'scale-rest' }
  ]

  useEffect(() => {
    let timer
    if (isActive) {
      const currentPhase = phases[phaseIndex]
      timer = setTimeout(() => {
        setPhaseIndex(prev => {
          const next = (prev + 1) % phases.length
          if (next === 0) {
            setCycles(c => c + 1)
            playChime(1.1)
          }
          return next
        })
      }, currentPhase.duration * 1000)
    }
    return () => clearTimeout(timer)
  }, [isActive, phaseIndex])

  const toggleBreath = () => {
    if (!isActive) {
      setIsActive(true)
      setPhaseIndex(0)
      playChime(1)
    } else {
      setIsActive(false)
      setPhaseIndex(0)
    }
  }

  const current = phases[phaseIndex]

  return (
    <div className="breathe-card">
      <div className="card-topline">
        <span className="icon-bubble peach"><Wind size={18} /></span>
        <span className="card-label">BREATHE WITH ME</span>
        <span className="card-mini-heart">♡</span>
      </div>

      <h3>Calm your sweet heart</h3>
      <p className="card-subtitle">Whenever the world feels a little too fast, match your breathing with this gentle heart.</p>

      <div className="breathe-visual-area">
        <div className={`breathe-circle ${isActive ? current.scale : ''}`}>
          <div className="breathe-inner-glow">
            <Heart size={36} fill="#ff99bb" className="breathe-heart-icon" />
            <span className="breathe-phase-name">{isActive ? current.name : 'Ready'}</span>
          </div>
        </div>
      </div>

      <p className="breathe-guide-text">
        {isActive ? current.text : 'Press start whenever you need a minute of pure peace.'}
      </p>

      <div className="breathe-action-row">
        <button className="pink-button" onClick={toggleBreath}>
          {isActive ? (
            <><Pause size={15} /> Pause breathing</>
          ) : (
            <><Play size={15} /> Start 1-minute breathing</>
          )}
        </button>
        {cycles > 0 && (
          <span className="breathe-cycle-badge">
            <Sparkles size={13} /> {cycles} peaceful {cycles === 1 ? 'cycle' : 'cycles'} completed
          </span>
        )}
      </div>
    </div>
  )
}
