import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-comic p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 font-chewy text-center">About BreedGuessr</h1>

        <div className="space-y-4 text-gray-600">
          <p>
            BreedGuessr is a fun quiz game designed to bring awareness of the many dog breed types
            for people who are fond of dogs.
          </p>

          <p>
            Whether you're a dog enthusiast, considering adopting a pet, or simply curious about
            the diversity of dog breeds, this game helps you learn to recognize different breeds
            while having fun!
          </p>

          <h2 className="text-xl font-bold text-gray-700 pt-4 font-chewy">How to Play</h2>
          <p>
            You'll be shown images of dogs and asked to identify their breed from four options.
            Each correct answer earns you 10 points. Try to get a perfect score of 100!
          </p>

          <h2 className="text-xl font-bold text-gray-700 pt-4 font-chewy">Image Credits</h2>
          <p className="text-sm">
            All dog images are sourced from the{' '}
            <a
              href="https://www.kaggle.com/datasets/jessicali9530/stanford-dogs-dataset"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-800"
            >
              Stanford Dogs Dataset
            </a>
            {' '}on Kaggle, which contains images of 120 breeds of dogs from around the world.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="btn-comic font-bold py-3 px-8 text-lg font-chewy inline-block"
          >
            Play Now
          </Link>
        </div>
      </div>
    </div>
  )
}
