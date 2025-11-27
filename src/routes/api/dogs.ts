import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"
import { env } from "cloudflare:workers"

export interface Dog {
  id: number
  dog_breed: string
  image: string
  hash: string
}

export const Route = createFileRoute("/api/dogs")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const count = Number(url.searchParams.get("count")) || 10

          const result = await env.DB.prepare(
            "SELECT id, dog_breed, image, hash FROM dogs ORDER BY RANDOM() LIMIT ?"
          )
            .bind(count)
            .all<Dog>()

          return json({ dogs: result.results })
        } catch (error) {
          console.error("Error fetching dogs:", error)
          return json({ error: "Failed to fetch dogs" }, { status: 500 })
        }
      },
    },
  },
})
