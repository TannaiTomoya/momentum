import { GameScreen } from './components/GameScreen'
import { LyricScreen } from './components/LyricScreen'
import { PulseScreen } from './components/PulseScreen'
import { ResultScreen } from './components/ResultScreen'
import { TitleScreen } from './components/TitleScreen'
import { isLyricMode } from './engine/lyric/session'
import { isPulseMode } from './engine/pulse/session'
import { useGame } from './hooks/useGame'

export default function App() {
  const game = useGame()

  return (
    <div
      className="app-shell"
      style={
        game.screen === 'playing'
          ? { ['--heat' as string]: String(game.momentum.heat) }
          : undefined
      }
    >
      {game.screen === 'title' && (
        <TitleScreen progress={game.progress} onStart={game.startRun} />
      )}

      {game.screen === 'playing' && game.current && (
        isPulseMode(game.mode) ? (
          <PulseScreen
            question={game.current}
            questionNumber={game.questionNumber}
            totalQuestions={game.totalQuestions}
            timeLeft={game.timeLeft}
            momentum={game.momentum}
            feedback={game.feedback}
            burstKey={game.burstKey}
            tierFlash={game.tierFlash}
            onAnswer={game.answer}
            onBackToMenu={game.backToTitle}
          />
        ) : isLyricMode(game.mode) ? (
          <LyricScreen
            question={game.current}
            questionNumber={game.questionNumber}
            totalQuestions={game.totalQuestions}
            timeLeft={game.timeLeft}
            momentum={game.momentum}
            feedback={game.feedback}
            burstKey={game.burstKey}
            tierFlash={game.tierFlash}
            onAnswer={game.answer}
            onBackToMenu={game.backToTitle}
          />
        ) : (
          <GameScreen
            question={game.current}
            questionNumber={game.questionNumber}
            totalQuestions={game.totalQuestions}
            timeLeft={game.timeLeft}
            momentum={game.momentum}
            feedback={game.feedback}
            burstKey={game.burstKey}
            tierFlash={game.tierFlash}
            onAnswer={game.answer}
            onBackToMenu={game.backToTitle}
          />
        )
      )}

      {game.screen === 'result' && game.result && (
        <ResultScreen
          result={game.result}
          onAgain={() => game.startRun(game.mode)}
          onTitle={game.backToTitle}
        />
      )}
    </div>
  )
}
