import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import { GameProvider, useGame } from '../context/GameContext'
import { StartScreen } from '../components/StartScreen'
import { PlayingScreen } from '../components/PlayingScreen'
import { FinishedScreen } from '../components/FinishedScreen'
import { DogsIcon } from '../components/DogsIcon'

export const Route = createFileRoute('/')({ component: DogBreedGame })

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-comic p-8 text-center max-w-md w-full">
        <DogsIcon />
        <h1 className="text-3xl font-bold text-gray-800 mb-4 font-chewy">breedguessr.com</h1>
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    </div>
  )
}

function GameContent() {
  const { gameState, currentQuestionData } = useGame()

  return (
    <AnimatePresence mode="wait">
      {gameState === 'start' && <StartScreen key="start" />}
      {gameState === 'playing' && currentQuestionData && <PlayingScreen key="playing" />}
      {gameState === 'finished' && <FinishedScreen key="finished" />}
    </AnimatePresence>
  )
}

function DogBreedGame() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GameProvider>
        <div className="min-h-screen flex items-center justify-center p-4">
          <GameContent />
        </div>
      </GameProvider>
    </Suspense>
  )
}
