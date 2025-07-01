"use client"
import React, { useState } from 'react';
import dogData from './index-dataset.json';
import Image from 'next/image';

export default function  DogBreedGame() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'finished'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(''); // 'correct', 'wrong', ''
  const [showFireworks, setShowFireworks] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState<typeof dogData>([]);
  const [gameMode] = useState<'multiple-choice' | 'text-input'>('multiple-choice');
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);

  const BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'https://pub-ae384ff5bace4bf4a689ef899b70644c.r2.dev'
    : 'https://images.breedguessr.com';

  const allBreeds = Array.from(new Set(dogData.map(dog => dog.dogBreed)));


  const generateMultipleChoiceOptions = (correctBreed: string) => {
    const otherBreeds = allBreeds.filter(breed => breed !== correctBreed);
    const shuffledOthers = [...otherBreeds].sort(() => 0.5 - Math.random());
    const wrongOptions = shuffledOthers.slice(0, 3);
    const allOptions = [correctBreed, ...wrongOptions].sort(() => 0.5 - Math.random());
    return allOptions.slice(0, 4);
  };

  const checkImageExists = async (hash: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/${hash}`, {
        method: 'HEAD',
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const startGame = async () => {
    const shuffled = [...dogData].sort(() => 0.5 - Math.random());
    const validDogs = [];
    
    for (const dog of shuffled) {
      if (validDogs.length >= 10) break;
      
      const imageExists = await checkImageExists(dog.hash);
      if (imageExists) {
        validDogs.push(dog);
      }
    }
    
    if (validDogs.length < 10) {
      alert(`Only found ${validDogs.length} valid images. Starting game with available dogs.`);
    }
    
    setSelectedDogs(validDogs);
    if (gameMode === 'multiple-choice' && validDogs.length > 0) {
      setMultipleChoiceOptions(generateMultipleChoiceOptions(validDogs[0].dogBreed));
    }
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer('');
    setFeedback('');
  };

  const checkAnswer = (selectedAnswer?: string) => {
    const currentDog = selectedDogs[currentQuestion];
    const answer = selectedAnswer || userAnswer;
    const userInput = answer.toLowerCase().trim();
    const correctAnswers = [currentDog.dogBreed];
    
    const isCorrect = correctAnswers.some(answer => 
      answer.toLowerCase().trim() === userInput
    );

    if (isCorrect) {
      setScore(score + 10);
      setFeedback('correct');
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 2000);
    } else {
      setFeedback('wrong');
      setFlashRed(true);
      setTimeout(() => setFlashRed(false), 500);
    }

    setTimeout(() => {
      if (currentQuestion < selectedDogs.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setUserAnswer('');
        setFeedback('');
        if (gameMode === 'multiple-choice') {
          setMultipleChoiceOptions(generateMultipleChoiceOptions(selectedDogs[nextQuestion].dogBreed));
        }
      } else {
        setGameState('finished');
      }
    }, 2000);
  };

  const shareScore = () => {
    const text = `I just scored ${score}/100 points in the Dog Breed Guessing Game! 🐕 Can you beat my score?`;
    if (navigator.share) {
      navigator.share({
        title: 'Dog Breed Game Score',
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href);
      alert('Score copied to clipboard!');
    }
  };

  const resetGame = () => {
    setGameState('start');
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer('');
    setFeedback('');
  };

  const Fireworks = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-ping"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 1000}ms`,
            animationDuration: '1s'
          }}
        >
          <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
          <div className="absolute -top-2 -left-2 w-8 h-8 border-4 border-yellow-400 rounded-full animate-ping"></div>
        </div>
      ))}
    </div>
  );

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🐕</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dog Breed Game</h1>
          <p className="text-gray-600 mb-6">
            Guess the breed of 10 different dogs and earn points! 
            Get 10 points for each correct answer.
          </p>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4 transition-all duration-300 ${flashRed ? 'bg-red-500' : ''}`}>
        {showFireworks && <Fireworks />}
        
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {selectedDogs.length}
            </div>
            <div className="text-xl font-bold text-green-600">
              Score: {score}
            </div>
          </div>

          <div className="text-center mb-6">
            <Image
              src={`${BASE_URL}/${selectedDogs[currentQuestion]?.hash}`}
              alt="Dog to identify"
              className="w-80 h-80 object-cover rounded-2xl mx-auto shadow-lg"
              width={320}
              height={320}
            />
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              What breed is this dog?
            </h2>
            
            {feedback === '' && (
              <div>
                {gameMode === 'multiple-choice' ? (
                  <div className="space-y-3">
                    {multipleChoiceOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => checkAnswer(option)}
                        className="w-full p-4 bg-gray-100 hover:bg-blue-100 border-2 border-gray-300 hover:border-blue-500 rounded-xl text-lg font-medium text-gray-800 transition-all duration-200"
                      >
                        {option.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && userAnswer.trim() && checkAnswer()}
                      placeholder="Enter the breed name..."
                      className="w-full p-3 border-2 border-gray-300 text-black rounded-xl text-center text-lg mb-4 focus:border-blue-500 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => checkAnswer()}
                      disabled={!userAnswer.trim()}
                      className="bg-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Submit Answer
                    </button>
                  </div>
                )}
              </div>
            )}

            {feedback === 'correct' && (
              <div className="text-center">
                <div className="text-4xl text-green-500 mb-2">✅</div>
                <p className="text-xl text-green-600 font-bold">Correct! +10 points</p>
              </div>
            )}

            {feedback === 'wrong' && (
              <div className="text-center">
                <div className="text-4xl text-red-500 mb-2">❌</div>
                <p className="text-xl text-red-600 font-bold">
                  Wrong! It was a {selectedDogs[currentQuestion]?.dogBreed}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Game Complete!</h1>
          <div className="text-5xl font-bold text-green-600 mb-4">
            {score}/{selectedDogs.length * 10}
          </div>
          <p className="text-gray-600 mb-6">
            {score === selectedDogs.length * 10 ? "Perfect score! You're a dog breed expert! 🎉" :
             score >= 70 ? "Great job! You know your dog breeds! 🐕" :
             score >= 40 ? "Not bad! Keep practicing! 🦴" :
             "Keep learning about dog breeds! 🐾"}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={shareScore}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-pink-500 hover:to-purple-600 transform hover:scale-105 transition-all duration-200"
            >
              Share Score 📱
            </button>
            <button
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              Play Again 🔄
            </button>
          </div>
        </div>
      </div>
    );
  }
};