import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { StartScreen } from '../components/StartScreen'
import { PlayingScreen } from '../components/PlayingScreen'
import { FinishedScreen } from '../components/FinishedScreen'

interface Dog {
  id: number
  dog_breed: string
  image: string
  hash: string
}

interface GameQuestion {
  dog: Dog
  options: string[]
}

export const Route = createFileRoute('/')({ component: DogBreedGame })

function DogBreedGame() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [showFireworks, setShowFireworks] = useState(false)
  const [flashRed, setFlashRed] = useState(false)
  const [questions, setQuestions] = useState<GameQuestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const BASE_URL = import.meta.env.DEV
    ? 'https://pub-ae384ff5bace4bf4a689ef899b70644c.r2.dev'
    : 'https://images.breedguessr.com'

  const startGame = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/game?count=10')
      const data = await response.json()
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions received')
      }
      setCurrentQuestion(0)
      setScore(0)
      setFeedback('')
      setQuestions(data.questions)
      setGameState('playing')
    } catch (error) {
      console.error('Error starting game:', error)
      alert('Failed to load game data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const checkAnswer = (selectedAnswer: string) => {
    const currentQ = questions[currentQuestion]
    const isCorrect = currentQ.dog.dog_breed.toLowerCase().trim() === selectedAnswer.toLowerCase().trim()

    if (isCorrect) {
      setScore(score + 10)
      setFeedback('correct')
      setShowFireworks(true)
      setTimeout(() => setShowFireworks(false), 2000)
    } else {
      setFeedback('wrong')
      setFlashRed(true)
      setTimeout(() => setFlashRed(false), 500)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setFeedback('')
      } else {
        setGameState('finished')
      }
    }, 2000)
  }

  const shareScore = () => {
    const text = `I just scored ${score}/100 points in the Dog Breed Guessing Game! Can you beat my score?`
    if (navigator.share) {
      navigator.share({
        title: 'Dog Breed Game Score',
        text: text,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href)
      alert('Score copied to clipboard!')
    }
  }

  const resetGame = () => {
    setGameState('start')
    setCurrentQuestion(0)
    setScore(0)
    setFeedback('')
    setQuestions([])
  }

  if (gameState === 'start') {
    return <StartScreen isLoading={isLoading} onStartGame={startGame} />
  }

  if (gameState === 'playing' && questions[currentQuestion]) {
    return (
      <PlayingScreen
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
        score={score}
        question={questions[currentQuestion]}
        feedback={feedback}
        flashRed={flashRed}
        showFireworks={showFireworks}
        baseUrl={BASE_URL}
        onAnswer={checkAnswer}
      />
    )
  }

  if (gameState === 'finished') {
    return (
      <FinishedScreen
        score={score}
        totalQuestions={questions.length}
        onPlayAgain={resetGame}
        onShare={shareScore}
      />
    )
  }

  return null
}
