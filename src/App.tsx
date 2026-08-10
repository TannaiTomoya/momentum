import { GameScreen } from './components/GameScreen'
import { ResultScreen } from './components/ResultScreen'
import { TitleScreen } from './components/TitleScreen'
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
        />
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
