# BreedGuessr - Dog Breed Guessing Game

A fun dog breed guessing game built with TanStack Start and React.

## Tech Stack

- **Framework**: TanStack Start
- **Styling**: Tailwind CSS v4
- **Analytics**: PostHog
- **Package Manager**: bun

## Getting Started

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

## Scripts

| Command         | Action                           |
| :-------------- | :------------------------------- |
| `bun run dev`   | Start development server         |
| `bun run build` | Build for production             |
| `bun run serve` | Preview production build locally |

## Project Structure

```
src/
├── routes/
│   ├── __root.tsx      # Root layout with PostHog
│   └── index.tsx       # Main game component
├── data/
│   └── index-dataset.json  # Dog breed dataset
├── router.tsx          # TanStack Router setup
└── styles.css          # Tailwind CSS
```
