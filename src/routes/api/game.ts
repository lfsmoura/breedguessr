import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"
import { env } from "cloudflare:workers"

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

export const Route = createFileRoute("/api/game")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const count = Number(url.searchParams.get("count")) || 10

          // Fetch random dogs
          const dogsResult = await env.DB.prepare(
            "SELECT id, dog_breed, image, hash FROM dogs ORDER BY RANDOM() LIMIT ?"
          )
            .bind(count)
            .all<Dog>()

          const dogs = dogsResult.results

          // For each dog, get 3 wrong breeds and create shuffled options
          const questions: GameQuestion[] = await Promise.all(
            dogs.map(async (dog: Dog) => {
              const wrongBreedsResult = await env.DB.prepare(
                "SELECT DISTINCT dog_breed FROM dogs WHERE dog_breed != ? ORDER BY RANDOM() LIMIT 3"
              )
                .bind(dog.dog_breed)
                .all<{ dog_breed: string }>()

              const wrongBreeds = wrongBreedsResult.results.map((r: { dog_breed: string }) => r.dog_breed)
              const allOptions = [dog.dog_breed, ...wrongBreeds]

              // Shuffle options
              for (let i = allOptions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]]
              }

              return {
                dog,
                options: allOptions,
              }
            })
          )

          return json({ questions })
        } catch (error) {
          console.error("Error creating game:", error)
          return json({ error: "Failed to create game" }, { status: 500 })
        }
      },
    },
  },
})
