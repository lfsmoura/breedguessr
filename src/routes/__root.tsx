import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import posthog from 'posthog-js'

import appCss from '../styles.css?url'

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-orange-200 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-8xl font-chewy text-amber-800 mb-4">404</h1>
        <p className="text-2xl font-chewy text-amber-700 mb-8">
          Oops! This page ran away like a lost puppy.
        </p>
        <Link
          to="/"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-chewy text-xl px-8 py-3 rounded-full transition-colors shadow-lg"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'BreedGuessr - Dog Breed Guessing Game',
      },
      {
        name: 'description',
        content: 'Test your knowledge of dog breeds in this fun guessing game!',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Chewy&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
        precedence: 'high',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (import.meta.env.DEV) return

    posthog.init("phc_vNrirJpJwdfZk7LtwrRmpxKKpluWRmmVhWnFqRXcylr", {
      api_host: "https://us.i.posthog.com",
      ui_host: "https://us.posthog.com",
      capture_pageview: 'history_change',
      capture_pageleave: true,
      capture_exceptions: true,
    })
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <footer className="bg-white py-4 text-center">
          <a
            href="https://criadordecruzadinhas.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Create cool crossword puzzles for study or play
          </a>
          <div className="mt-2 text-sm">
            <Link to="/about" className="text-gray-500 hover:text-gray-700">
              About
            </Link>
            <span className="mx-2 text-gray-300">·</span>
            <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-700">
              Privacy Policy
            </Link>
          </div>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}
