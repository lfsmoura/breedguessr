import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"
import { env } from "cloudflare:workers"

export const Route = createFileRoute("/api/breeds")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const excludeBreed = url.searchParams.get("exclude") || ""
          const count = Number(url.searchParams.get("count")) || 3

          const result = await env.DB.prepare(
            "SELECT DISTINCT dog_breed FROM dogs WHERE dog_breed != ? ORDER BY RANDOM() LIMIT ?"
          )
            .bind(excludeBreed, count)
            .all<{ dog_breed: string }>()

          return json({ breeds: result.results.map((r: { dog_breed: string }) => r.dog_breed) })
        } catch (error) {
          console.error("Error fetching breeds:", error)
          return json({ error: "Failed to fetch breeds" }, { status: 500 })
        }
      },
    },
  },
})
