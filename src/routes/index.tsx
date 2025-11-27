import { createFileRoute } from '@tanstack/react-router'
import { GameProvider, useGame } from '../context/GameContext'
import { StartScreen } from '../components/StartScreen'
import { PlayingScreen } from '../components/PlayingScreen'
import { FinishedScreen } from '../components/FinishedScreen'

export const Route = createFileRoute('/')({ component: DogBreedGame })

function GameContent() {
  const { gameState, currentQuestionData } = useGame()

  if (gameState === 'start') {
    return <StartScreen />
  }

  if (gameState === 'playing' && currentQuestionData) {
    return <PlayingScreen />
  }

  if (gameState === 'finished') {
    return <FinishedScreen />
  }

  return null
}

function DogBreedGame() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  )
}
