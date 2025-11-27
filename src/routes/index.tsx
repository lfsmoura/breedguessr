import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { AnimatePresence } from 'motion/react'
import { GameProvider, useGame } from '../context/GameContext'
import { StartScreen } from '../components/StartScreen'
import { PlayingScreen } from '../components/PlayingScreen'
import { FinishedScreen } from '../components/FinishedScreen'

export const Route = createFileRoute('/')({ component: DogBreedGame })

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
        <div className="text-6xl mb-4">🐕</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dog Breed Game</h1>
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
        <div className="min-h-screen bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
          <GameContent />
        </div>
      </GameProvider>
    </Suspense>
  )
}
