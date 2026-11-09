import { useState, useEffect } from 'react'
import { Droplets, CheckCircle2, Circle, Plus, Trash2, Clock, Play, Pause, RotateCcw, Sparkles } from 'lucide-react'
import { defaultDailyTasks } from '../data/comfortData'
import { playChime, playPop } from '../utils/audio'

function readStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : fallback
  } catch {
    return fallback
  }
}

export default function GentlePlanner({ girlfriendName = 'Princess' }) {
  // 1. Hydration
  const [waterCups, setWaterCups] = useState(() => readStorage('princess-water-cups', 0))

  useEffect(() => {
    localStorage.setItem('princess-water-cups', JSON.stringify(waterCups))
  }, [waterCups])

  const toggleWaterCup = (index) => {
    playPop()
    if (index < waterCups) {
      setWaterCups(index)
    } else {
      setWaterCups(index + 1)
      if (index + 1 === 8) {
        playChime(1.2)
      }
    }
  }

  // 2. Gentle Tasks
  const [tasks, setTasks] = useState(() => readStorage('princess-daily-tasks', defaultDailyTasks))
  const [newTaskText, setNewTaskText] = useState('')

  useEffect(() => {
    localStorage.setItem('princess-daily-tasks', JSON.stringify(tasks))
  }, [tasks])

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextDone = !t.done
        if (nextDone) playChime(1)
        else playPop()
        return { ...t, done: nextDone }
      }
      return t
    }))
  }

  const addTask = (e) => {
    e.preventDefault()
    if (!newTaskText.trim()) return
    playPop()
    const newTask = {
      id: 'task-' + Date.now(),
      text: newTaskText.trim(),
      done: false,
      category: 'custom'
    }
    setTasks(prev => [...prev, newTask])
    setNewTaskText('')
  }

  const deleteTask = (id) => {
    playPop()
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const completedCount = tasks.filter(t => t.done).length

  // 3. Cozy Timer
  const [timerMode, setTimerMode] = useState('focus') // 'focus' (25m), 'rest' (10m), 'quick' (5m)
  const timerDurations = { focus: 25 * 60, rest: 10 * 60, quick: 5 * 60 }
  const [timeLeft, setTimeLeft] = useState(timerDurations.focus)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const switchTimerMode = (mode) => {
    setIsTimerRunning(false)
    setTimerMode(mode)
    setTimeLeft(timerDurations[mode])
    playPop()
  }

  useEffect(() => {
    let interval = null
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      playChime(1.2)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft])

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60)
    const rem = secs % 60
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`
  }

  return (
    <div className="planner-container">
      {/* Hydration Card */}
      <div className="feature-card hydration-card">
        <div className="card-topline">
          <span className="icon-bubble lavender"><Droplets size={18} /></span>
          <span className="card-label">HYDRATION OASIS</span>
          <span className="card-mini-heart">💧</span>
        </div>
        <h3>Stay glowing & hydrated</h3>
        <p className="card-subtitle">Tap each cup after drinking water. Keep that pretty smile hydrated!</p>

        <div className="water-cups-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <button
              key={i}
              className={`water-cup-btn ${i < waterCups ? 'filled' : ''}`}
              onClick={() => toggleWaterCup(i)}
              title={`Cup ${i + 1}`}
            >
              <span className="cup-icon">🥛</span>
              <span className="cup-num">{i + 1}</span>
            </button>
          ))}
        </div>

        <div className="hydration-footer">
          <span>{waterCups}/8 glasses today</span>
          <span className="hydration-cheer">
            {waterCups === 8
              ? '🎉 All 8 cups! You did amazing, star!'
              : waterCups >= 4
              ? '✨ Halfway there, sweetheart!'
              : 'Take a gentle sip whenever ready 🌸'}
          </span>
        </div>
      </div>

      {/* Gentle Checklist Card */}
      <div className="feature-card checklist-card">
        <div className="card-topline">
          <span className="icon-bubble peach"><CheckCircle2 size={18} /></span>
          <span className="card-label">GENTLE DAILY CARE & GOALS</span>
          <span className="card-mini-heart">♡</span>
        </div>
        <h3>Gentle care for {girlfriendName}</h3>
        <p className="card-subtitle">Zero pressure. Celebrate each small thing you do today.</p>

        {/* Progress Bar */}
        <div className="task-progress-wrap">
          <div className="task-progress-bar">
            <div
              className="task-progress-fill"
              style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }}
            />
          </div>
          <span className="task-progress-text">
            {completedCount} of {tasks.length} done
          </span>
        </div>

        {/* Task List */}
        <div className="tasks-list">
          {tasks.map(task => (
            <div key={task.id} className={`task-row ${task.done ? 'task-done' : ''}`}>
              <button
                className="task-check-btn"
                onClick={() => toggleTask(task.id)}
                aria-label={task.done ? 'Mark undone' : 'Mark done'}
              >
                {task.done ? (
                  <CheckCircle2 size={18} className="check-done-icon" />
                ) : (
                  <Circle size={18} className="check-undone-icon" />
                )}
              </button>
              <span className="task-text" onClick={() => toggleTask(task.id)}>
                {task.text}
              </span>
              {task.category === 'custom' && (
                <button
                  className="task-delete-btn"
                  onClick={() => deleteTask(task.id)}
                  title="Remove goal"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add custom goal */}
        <form onSubmit={addTask} className="task-add-form">
          <input
            type="text"
            placeholder="Add a gentle goal (study, rest, snack...)"
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            className="task-input"
          />
          <button type="submit" className="task-submit-btn" disabled={!newTaskText.trim()}>
            <Plus size={15} /> Add
          </button>
        </form>
      </div>

      {/* Cozy Timer Card */}
      <div className="feature-card timer-card">
        <div className="card-topline">
          <span className="icon-bubble yellow"><Clock size={18} /></span>
          <span className="card-label">COZY FOCUS & REST TIMER</span>
          <span className="card-mini-heart">⏱️</span>
        </div>
        <h3>Paced time with no rush</h3>
        <p className="card-subtitle">Study or relax with gentle intervals. Take care of yourself first.</p>

        <div className="timer-mode-pills">
          <button
            className={`timer-pill ${timerMode === 'focus' ? 'active' : ''}`}
            onClick={() => switchTimerMode('focus')}
          >
            25m Focus 📚
          </button>
          <button
            className={`timer-pill ${timerMode === 'rest' ? 'active' : ''}`}
            onClick={() => switchTimerMode('rest')}
          >
            10m Cozy Rest ☕
          </button>
          <button
            className={`timer-pill ${timerMode === 'quick' ? 'active' : ''}`}
            onClick={() => switchTimerMode('quick')}
          >
            5m Deep Breath 🌸
          </button>
        </div>

        <div className="timer-display">
          <span className="timer-digits">{formatTime(timeLeft)}</span>
          <span className="timer-status">
            {isTimerRunning ? '🌸 Quietly ticking... you are doing great!' : 'Ready whenever you are'}
          </span>
        </div>

        <div className="timer-controls">
          <button
            className="pink-button timer-main-btn"
            onClick={() => {
              setIsTimerRunning(r => !r)
              playPop()
            }}
          >
            {isTimerRunning ? (
              <><Pause size={16} /> Pause timer</>
            ) : (
              <><Play size={16} /> Start timer</>
            )}
          </button>
          <button
            className="soft-button timer-reset-btn"
            onClick={() => {
              setIsTimerRunning(false)
              setTimeLeft(timerDurations[timerMode])
              playPop()
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>
    </div>
  )
}
