import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy-policy')({ component: PrivacyPolicyPage })

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-comic p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 font-chewy text-center">Privacy Policy</h1>

        <div className="space-y-4 text-gray-600 text-sm">
          <p className="text-gray-500 text-xs">Last updated: November 2024</p>

          <h2 className="text-lg font-bold text-gray-700 pt-2 font-chewy">What We Collect</h2>
          <p>
            BreedGuessr uses PostHog for basic analytics. This includes:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Page views and navigation patterns</li>
            <li>Session duration</li>
            <li>General device and browser information</li>
            <li>Error and exception reports to improve the game</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-700 pt-4 font-chewy">What We Don't Collect</h2>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Personal information (name, email, etc.)</li>
            <li>User accounts or login data</li>
            <li>Game scores or playing history tied to individuals</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-700 pt-4 font-chewy">Cookies</h2>
          <p>
            We use minimal cookies required for analytics functionality. These help us understand
            how visitors use the site so we can improve the experience.
          </p>

          <h2 className="text-lg font-bold text-gray-700 pt-4 font-chewy">Third-Party Links</h2>
          <p>
            This site contains links to external websites. We are not responsible for the privacy
            practices of these sites. We encourage you to review their privacy policies.
          </p>

          <h2 className="text-lg font-bold text-gray-700 pt-4 font-chewy">Changes</h2>
          <p>
            We may update this policy from time to time. Any changes will be reflected on this page.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="btn-comic font-bold py-3 px-8 text-lg font-chewy inline-block"
          >
            Back to Game
          </Link>
        </div>
      </div>
    </div>
  )
}
