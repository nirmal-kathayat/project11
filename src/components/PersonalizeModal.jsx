import { useState } from 'react'
import { Heart, X, Check, Sparkles } from 'lucide-react'
import { playPop, playChime } from '../utils/audio'

export default function PersonalizeModal({
  isOpen,
  onClose,
  gfName,
  setGfName,
  bfName,
  setBfName
}) {
  const [tempGf, setTempGf] = useState(gfName)
  const [tempBf, setTempBf] = useState(bfName)

  if (!isOpen) return null

  const handleSave = (e) => {
    e.preventDefault()
    playChime(1.1)
    const finalGf = tempGf.trim() || 'Princess'
    const finalBf = tempBf.trim() || 'Your favourite person'
    setGfName(finalGf)
    setBfName(finalBf)
    localStorage.setItem('princess-gf-name', JSON.stringify(finalGf))
    localStorage.setItem('princess-bf-name', JSON.stringify(finalBf))
    onClose()
  }

  return (
    <div className="letter-modal-backdrop" onClick={onClose}>
      <div className="letter-paper-modal personalize-modal" onClick={e => e.stopPropagation()}>
        <button className="letter-modal-close" onClick={onClose} aria-label="Close settings">
          <X size={18} />
        </button>

        <div className="letter-modal-top">
          <span className="letter-modal-emoji">💖</span>
          <h4>Personalize Your Corner</h4>
          <p className="card-subtitle">Make this cozy corner truly yours with your special names.</p>
        </div>

        <form onSubmit={handleSave} className="personalize-form">
          <div className="form-group">
            <label>Girlfriend's Name / Nickname</label>
            <input
              type="text"
              value={tempGf}
              onChange={e => setTempGf(e.target.value)}
              placeholder="e.g. Princess, My Sweetheart, Sneha..."
              className="personalize-input"
              maxLength={24}
            />
          </div>

          <div className="form-group">
            <label>Boyfriend's Name / Nickname</label>
            <input
              type="text"
              value={tempBf}
              onChange={e => setTempBf(e.target.value)}
              placeholder="e.g. Nirmal, Your Boy, Hubby..."
              className="personalize-input"
              maxLength={24}
            />
          </div>

          <div className="personalize-actions">
            <button type="submit" className="pink-button">
              <Check size={16} /> Save & Personalize
            </button>
            <button type="button" className="soft-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
