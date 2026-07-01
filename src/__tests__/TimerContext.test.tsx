import { render, screen, fireEvent, act } from '@testing-library/react'
import { TimerProvider, useTimer } from '@/context/TimerContext'

function TestComponent() {
  const { timerState, timeLeft, currentPhase, cycleCount, startTimer, pauseTimer, resumeTimer, skipTimer, resetTimer } = useTimer()
  return (
    <div>
      <span data-testid="state">{timerState}</span>
      <span data-testid="timeLeft">{timeLeft}</span>
      <span data-testid="phase">{currentPhase}</span>
      <span data-testid="cycle">{cycleCount}</span>
      <button onClick={startTimer}>Start</button>
      <button onClick={pauseTimer}>Pause</button>
      <button onClick={resumeTimer}>Resume</button>
      <button onClick={skipTimer}>Skip</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  )
}

describe('TimerContext', () => {
  it('starts, pauses, resumes, skips, and resets', () => {
    render(<TimerProvider><TestComponent /></TimerProvider>)
    expect(screen.getByTestId('state').textContent).toBe('idle')
    expect(screen.getByTestId('phase').textContent).toBe('focus')
    fireEvent.click(screen.getByText('Start'))
    expect(screen.getByTestId('state').textContent).toBe('running')
    expect(Number(screen.getByTestId('timeLeft').textContent)).toBe(1500)
    fireEvent.click(screen.getByText('Pause'))
    expect(screen.getByTestId('state').textContent).toBe('paused')
    fireEvent.click(screen.getByText('Resume'))
    expect(screen.getByTestId('state').textContent).toBe('running')
    fireEvent.click(screen.getByText('Skip'))
    expect(screen.getByTestId('state').textContent).toBe('idle')
  })
})
