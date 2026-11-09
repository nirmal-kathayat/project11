import { useEffect, useState } from 'react'
import {
  Heart, Sparkles, Smile, Gift, MessageCircleHeart, HandHeart,
  Candy, Flower2, RefreshCw, HeartHandshake, Check, Moon, Sun,
  Settings, Mail, Droplets, Wind, Music, Copy
} from 'lucide-react'

import { loveMessages, moods, coupons as initialCoupons } from './data/comfortData'
import { playChime, playPop, playSparkle } from './utils/audio'

import AmbientPlayer from './components/AmbientPlayer'
import BreatheCircle from './components/BreatheCircle'
import ReasonsJar from './components/ReasonsJar'
import LoveLettersModal from './components/LoveLettersModal'
import GentlePlanner from './components/GentlePlanner'
import EmergencySmile from './components/EmergencySmile'
import AffectionStation from './components/AffectionStation'
import PersonalizeModal from './components/PersonalizeModal'

function readSaved(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  // Names personalization
  const [gfName, setGfName] = useState(() => readSaved('princess-gf-name', 'Princess'))
  const [bfName, setBfName] = useState(() => readSaved('princess-bf-name', 'Your favourite person'))
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false)

  // Cozy Night Mode
  const [isNightMode, setIsNightMode] = useState(() => readSaved('princess-night-mode', false))

  useEffect(() => {
    localStorage.setItem('princess-night-mode', JSON.stringify(isNightMode))
    if (isNightMode) {
      document.body.classList.add('cozy-night-mode')
    } else {
      document.body.classList.remove('cozy-night-mode')
    }
  }, [isNightMode])

  // Category Filter Tab
  const [activeTab, setActiveTab] = useState('all') // 'all', 'love', 'care', 'relax'

  // Love Note
  const [messageIndex, setMessageIndex] = useState(0)
  const [copiedNote, setCopiedNote] = useState(false)

  // Mood
  const [mood, setMood] = useState('')

  // Hugs
  const [hugCount, setHugCount] = useState(0)
  const [showHug, setShowHug] = useState(false)

  // Coupons
  const [redeemed, setRedeemed] = useState(() => readSaved('princess-redeemed', []))
  const [claimedCouponId, setClaimedCouponId] = useState(null)

  // Chocolate Treat
  const [reminderDone, setReminderDone] = useState(() => readSaved('princess-choco-reminder', false))

  // Floating heart particles
  const [clickHearts, setClickHearts] = useState([])

  useEffect(() => localStorage.setItem('princess-redeemed', JSON.stringify(redeemed)), [redeemed])
  useEffect(() => localStorage.setItem('princess-choco-reminder', JSON.stringify(reminderDone)), [reminderDone])

  const selectedMood = moods.find(item => item.id === mood)

  function sprinkleLove(event) {
    if (!event.target.closest('button') && !event.target.closest('.bear')) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const id = Date.now() + Math.random()
    const heart = {
      id,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      emoji: ['💗', '💕', '♡', '✨', '🌸', '🥰', '🍓'][Math.floor(Math.random() * 7)]
    }
    setClickHearts(current => [...current.slice(-9), heart])
    window.setTimeout(() => {
      setClickHearts(current => current.filter(item => item.id !== id))
    }, 1050)
  }

  function sendHug() {
    playSparkle()
    setHugCount(count => count + 1)
    setShowHug(true)
    window.setTimeout(() => setShowHug(false), 1900)
  }

  function handleBearClick() {
    playChime(1.15)
    sendHug()
  }

  function toggleCoupon(id) {
    playPop()
    setRedeemed(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])
  }

  function claimCouponToBf(coupon, e) {
    e.stopPropagation()
    playSparkle()
    const text = `Hey ${bfName}! I just redeemed my love coupon: "${coupon.title}" 🥰 Can't wait!`
    navigator.clipboard.writeText(text).then(() => {
      setClaimedCouponId(coupon.id)
      setTimeout(() => setClaimedCouponId(null), 2500)
    })
  }

  function nextLoveNote() {
    playSparkle()
    setMessageIndex(index => (index + 1) % loveMessages.length)
  }

  function copyLoveNote() {
    playPop()
    navigator.clipboard.writeText(`"${loveMessages[messageIndex]}" 💗`).then(() => {
      setCopiedNote(true)
      setTimeout(() => setCopiedNote(false), 2000)
    })
  }

  return (
    <div className="app-shell">
      <div className="floating-decor decor-one">✿</div>
      <div className="floating-decor decor-two">♡</div>
      <div className="floating-decor decor-three">✧</div>

      {/* Top Header */}
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Princess comfort corner home">
          <span className="brand-icon"><Heart size={18} fill="currentColor" /></span>
          <span>{gfName}'s comfort corner</span>
        </a>

        <div className="topbar-actions">
          <button
            className="header-pill-btn"
            onClick={() => {
              playPop()
              setIsNightMode(n => !n)
            }}
            title={isNightMode ? 'Switch to daylight pastel' : 'Switch to cozy candlelight night mode'}
          >
            {isNightMode ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#a855f7" />}
            <span>{isNightMode ? 'Daylight' : 'Cozy Mode'}</span>
          </button>

          <button
            className="header-pill-btn"
            onClick={() => {
              playPop()
              setIsPersonalizeOpen(true)
            }}
            title="Personalize names"
          >
            <Settings size={14} />
            <span>Personalize</span>
          </button>
        </div>
      </header>

      <main onClick={sprinkleLove}>
        {/* Click Heart Animations */}
        {clickHearts.map(heart => (
          <span
            key={heart.id}
            className="click-love"
            style={{ left: heart.x, top: heart.y }}
            aria-hidden="true"
          >
            {heart.emoji}
          </span>
        ))}

        {/* Hero Section */}
        <section className="hero panel" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" /> YOUR VERY OWN SAFE HAVEN
            </div>
            <h1>Hey, {gfName}! <span className="pink-heart">♡</span></h1>
            <p className="hero-lead">A tiny, cozy corner of the internet, made with all my love just for you.</p>
            <p className="hero-text">
              I know some days can feel a little heavier, tiring, or crampy. So here is a warm, gentle reminder that you are so deeply loved, you are my star, and you never have to go through anything alone.
            </p>
            <div className="hero-btn-row">
              <a className="primary-link" href="#care">
                Wrap me in comfort <Heart size={16} fill="currentColor" />
              </a>
              <button
                className="soft-button"
                onClick={() => {
                  playSparkle()
                  setIsPersonalizeOpen(true)
                }}
              >
                <Sparkles size={14} /> Customise names
              </button>
            </div>
            <div className="hero-signoff">
              <span className="tiny-heart">♥</span> always in your corner, {bfName}
            </div>
          </div>

          <div
            className="hero-art"
            aria-label="Cute pink teddy bear illustration - click for hug"
            onClick={handleBearClick}
            title="Click me for a squeezy bear hug!"
          >
            <div className="sparkle s1">✦</div>
            <div className="sparkle s2">✧</div>
            <div className="sparkle s3">♡</div>
            <div className="art-cloud cloud-left" />
            <div className="art-cloud cloud-right" />
            <div className="bear">
              <div className="bear-ear ear-left" />
              <div className="bear-ear ear-right" />
              <div className="bear-head">
                <div className="bear-eye eye-left" />
                <div className="bear-eye eye-right" />
                <div className="bear-blush blush-left" />
                <div className="bear-blush blush-right" />
                <div className="bear-muzzle">
                  <span className="bear-nose" />
                  <span className="bear-smile" />
                </div>
              </div>
              <div className="bear-body">
                <div className="bear-belly" />
                <div className="bear-heart">♥</div>
              </div>
              <div className="bear-arm arm-left" />
              <div className="bear-arm arm-right" />
              <div className="bear-foot foot-left" />
              <div className="bear-foot foot-right" />
            </div>
            <div className="art-caption">
              tap me for a<br /><b>bear hug!</b>
            </div>
            <div className="art-flower flower-a">✿</div>
            <div className="art-flower flower-b">✿</div>
          </div>
        </section>

        {/* Comfort Reminder Strip */}
        <section className="comfort-strip" aria-label="A gentle reminder">
          <span className="strip-icon"><Flower2 size={20} /></span>
          <p>
            <b>A gentle reminder for {gfName}:</b> You don't need to be productive, cheerful, or anything else today. Your existence alone is already so precious and more than enough. 🌷
          </p>
          <span className="strip-sparkle">✧</span>
        </section>

        {/* Category Navigation Pills */}
        <nav className="nav-pills-wrap" aria-label="Category navigation">
          <button
            className={`nav-pill-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => { playPop(); setActiveTab('all') }}
          >
            🧸 All Comforts
          </button>
          <button
            className={`nav-pill-btn ${activeTab === 'love' ? 'active' : ''}`}
            onClick={() => { playPop(); setActiveTab('love') }}
          >
            💌 Love & Letters
          </button>
          <button
            className={`nav-pill-btn ${activeTab === 'care' ? 'active' : ''}`}
            onClick={() => { playPop(); setActiveTab('care') }}
          >
            🌸 Gentle Care & Goals
          </button>
          <button
            className={`nav-pill-btn ${activeTab === 'relax' ? 'active' : ''}`}
            onClick={() => { playPop(); setActiveTab('relax') }}
          >
            🕯️ Cozy Sounds & Relax
          </button>
        </nav>

        {/* Main Section */}
        <section className="section" id="care">
          <div className="section-heading">
            <div>
              <span className="section-kicker">CURATED WITH TENDER CARE</span>
              <h2>What would make you feel better right now?</h2>
            </div>
            <span className="heading-doodle">♡</span>
          </div>

          <div className="feature-grid">
            {/* 1. Love Note for You (Shown in all or love) */}
            {(activeTab === 'all' || activeTab === 'love') && (
              <article className="feature-card message-card">
                <div className="card-topline">
                  <span className="icon-bubble lavender"><MessageCircleHeart size={20} /></span>
                  <span className="card-label">LOVE NOTE FOR YOU</span>
                  <span className="card-mini-heart">♡</span>
                </div>
                <h3>A little note for {gfName}</h3>
                <p className="card-subtitle">Fresh words straight from my heart to yours.</p>
                <div className="message-paper">
                  <span className="quote-mark">“</span>
                  <p>{loveMessages[messageIndex]}</p>
                  <span className="paper-flower">✿</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="soft-button" onClick={nextLoveNote}>
                    <RefreshCw size={14} /> Another sweet note
                  </button>
                  <button className="soft-button" onClick={copyLoveNote} title="Copy note to clipboard">
                    {copiedNote ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    {copiedNote ? 'Copied' : 'Save'}
                  </button>
                </div>
              </article>
            )}

            {/* 2. Reasons Why I Love You Jar (Shown in all or love) */}
            {(activeTab === 'all' || activeTab === 'love') && (
              <ReasonsJar girlfriendName={gfName} />
            )}

            {/* 3. Emergency Smile Machine (Shown in all or love) */}
            {(activeTab === 'all' || activeTab === 'love') && (
              <EmergencySmile girlfriendName={gfName} boyfriendName={bfName} />
            )}

            {/* 4. Open When... Letters (Shown in all or love) */}
            {(activeTab === 'all' || activeTab === 'love') && (
              <LoveLettersModal boyfriendName={bfName} />
            )}

            {/* 5. Virtual Affection Station (Shown in all or relax) */}
            {(activeTab === 'all' || activeTab === 'relax') && (
              <AffectionStation girlfriendName={gfName} />
            )}

            {/* 6. How Are You Feeling? (Mood Check-in) (Shown in all or relax) */}
            {(activeTab === 'all' || activeTab === 'relax') && (
              <article className="feature-card mood-card">
                <div className="card-topline">
                  <span className="icon-bubble peach"><Smile size={20} /></span>
                  <span className="card-label">MOOD CHECK-IN</span>
                  <span className="card-mini-heart">♡</span>
                </div>
                <h3>How are you feeling right now?</h3>
                <p className="card-subtitle">Every single feeling is safe, accepted, and loved here.</p>
                <div className="mood-grid">
                  {moods.map(item => (
                    <button
                      key={item.id}
                      className={`mood-option ${mood === item.id ? 'selected' : ''}`}
                      onClick={() => {
                        playPop()
                        setMood(item.id)
                      }}
                    >
                      <span>{item.emoji}</span>
                      <small>{item.label}</small>
                    </button>
                  ))}
                </div>
                {selectedMood && (
                  <div className="mood-response">
                    <Heart size={15} fill="currentColor" color="#df8eae" />
                    <span>{selectedMood.message}</span>
                  </div>
                )}
              </article>
            )}

            {/* 7. Need a Hug? Virtual Hug Machine (Shown in all or relax) */}
            {(activeTab === 'all' || activeTab === 'relax') && (
              <article className="feature-card hug-card">
                <div className="card-topline">
                  <span className="icon-bubble pink"><HandHeart size={20} /></span>
                  <span className="card-label">INSTANT COMFORT</span>
                  <span className="card-mini-heart">♡</span>
                </div>
                <h3>Need a bear hug?</h3>
                <p className="card-subtitle">Tap below to receive an extra-squeezy, long virtual hug.</p>
                <div className={`hug-visual ${showHug ? 'hugging' : ''}`}>
                  <span className="hug-heart h1">♥</span>
                  <span className="hug-heart h2">♥</span>
                  <span className="hug-emoji">🧸</span>
                  <span className="hug-emoji second">🐻</span>
                </div>
                <button className="pink-button" onClick={sendHug}>
                  <Heart size={16} fill="currentColor" /> Send me a tight hug
                </button>
                <div className="hug-count">
                  {hugCount === 0
                    ? 'Your hugs are waiting here, sweetheart 💗'
                    : `${hugCount} virtual ${hugCount === 1 ? 'hug' : 'hugs'} sent your way!`}
                </div>
                {showHug && <div className="hug-pop">SQUEEEEEZE! 🫂💗</div>}
              </article>
            )}

            {/* 8. Breathe With Me (Shown in all or relax) */}
            {(activeTab === 'all' || activeTab === 'relax') && (
              <BreatheCircle />
            )}

            {/* 9. Cozy Ambient Sounds (Shown in all or relax) */}
            {(activeTab === 'all' || activeTab === 'relax') && (
              <AmbientPlayer />
            )}

            {/* 10. Princess Privileges (Love Coupons) (Shown in all or love) */}
            {(activeTab === 'all' || activeTab === 'love') && (
              <article className="feature-card coupon-card">
                <div className="card-topline">
                  <span className="icon-bubble yellow"><Gift size={20} /></span>
                  <span className="card-label">PRINCESS PRIVILEGES</span>
                  <span className="card-mini-heart">♡</span>
                </div>
                <h3>Your love coupons</h3>
                <p className="card-subtitle">Tap to redeem anytime. No expiry date, valid forever.</p>
                <div className="coupon-list">
                  {initialCoupons.map(coupon => {
                    const used = redeemed.includes(coupon.id)
                    const isClaimed = claimedCouponId === coupon.id
                    return (
                      <div
                        key={coupon.id}
                        className={`coupon ${used ? 'coupon-used' : ''}`}
                        onClick={() => toggleCoupon(coupon.id)}
                      >
                        <span className="coupon-emoji">{coupon.emoji}</span>
                        <div className="coupon-copy">
                          <b>{coupon.title}</b>
                          <small>{used ? 'Redeemed — ask me when you want it!' : coupon.detail}</small>
                        </div>
                        <div className="coupon-actions-wrap">
                          <button
                            className="coupon-claim-btn"
                            onClick={(e) => claimCouponToBf(coupon, e)}
                            title="Copy text to claim this to him right now!"
                          >
                            {isClaimed ? 'Claimed! 💌' : 'Text him'}
                          </button>
                          <span className="coupon-action">
                            {used ? <Check size={18} color="#10b981" /> : <span>♡</span>}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="coupon-footnote">
                  <Heart size={13} fill="currentColor" color="#df8eae" />
                  <span>{redeemed.length} of {initialCoupons.length} coupons redeemed</span>
                </p>
              </article>
            )}

            {/* 11. Important Business (Treat Reminder) (Shown in all or care) */}
            {(activeTab === 'all' || activeTab === 'care') && (
              <article className="feature-card chocolate-card">
                <div className="card-topline">
                  <span className="icon-bubble cocoa"><Candy size={20} /></span>
                  <span className="card-label">IMPORTANT BUSINESS</span>
                  <span className="card-mini-heart">♡</span>
                </div>
                <div className="choco-layout">
                  <div>
                    <h3>Have you had a treat?</h3>
                    <p className="card-subtitle">A sweet moment can brighten everything. Have you had chocolate or your favourite snack?</p>
                  </div>
                  <div className="choco-illustration">🍫<span>♡</span></div>
                </div>
                <div className={`reminder-box ${reminderDone ? 'reminder-complete' : ''}`}>
                  <div className="reminder-check">
                    {reminderDone ? <Check size={18} /> : <Candy size={18} />}
                  </div>
                  <div>
                    <b>{reminderDone ? 'Treat celebrated!' : 'A tiny treat reminder'}</b>
                    <small>{reminderDone ? `Hope it was delicious, ${gfName}! 💗` : 'A warm drink, a snack, and a little rest? You deserve it.'}</small>
                  </div>
                  <button onClick={() => {
                    playPop()
                    setReminderDone(v => !v)
                  }}>
                    {reminderDone ? 'Undo' : 'Done!'}
                  </button>
                </div>
              </article>
            )}
          </div>
        </section>

        {/* 12. Gentle Daily Planner & Hydration & Timer (Shown in all or care) */}
        {(activeTab === 'all' || activeTab === 'care') && (
          <section className="section" id="planner">
            <div className="section-heading">
              <div>
                <span className="section-kicker">GENTLE PRODUCTIVITY</span>
                <h2>Gentle self-care & paced goals</h2>
              </div>
              <span className="heading-doodle">✿</span>
            </div>
            <GentlePlanner girlfriendName={gfName} />
          </section>
        )}

        {/* Closing Note Panel */}
        <section className="closing-note panel">
          <div className="closing-flower">🌸</div>
          <span className="section-kicker">ONE LAST THING, {gfName.toUpperCase()}</span>
          <h2>You are loved on <em>every</em> kind of day.</h2>
          <p>
            Take it slow. Be gentle with your body and mind. No matter what happened today, or what tomorrow brings, you will always have a warm, safe home in my heart. 💗
          </p>
          <div className="closing-divider"><span />♡<span /></div>
          <b className="signature">
            Always & forever, {bfName} <Heart size={16} fill="currentColor" />
          </b>
        </section>

        {/* Care note */}
        <section className="care-note">
          <HeartHandshake size={18} />
          <p>
            <b>Take gentle care:</b> Rest whenever you can, sip water, and choose whatever comfort feels best to you. If cramps or pain are severe, unusual, or worrying, please don't hesitate to consult a doctor or healthcare professional.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <span>made with <Heart size={13} fill="currentColor" /> just for {gfName}</span>
        <span>♡ a little love goes a long, long way ♡</span>
      </footer>

      {/* Personalize Names Modal */}
      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        gfName={gfName}
        setGfName={setGfName}
        bfName={bfName}
        setBfName={setBfName}
      />
    </div>
  )
}
