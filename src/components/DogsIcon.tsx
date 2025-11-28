import { motion } from 'motion/react'

export function DogsIcon() {
  const cardStyle = "w-16 h-16 flex items-center justify-center text-3xl rounded-xl border-3 border-[#3d3d3d] bg-[#fff3b0] shadow-[4px_4px_0_#3d3d3d]"

  return (
    <div className="relative h-24 w-32 flex items-center justify-center mb-4">
      {/* Carta de trás - sai pela direita */}
      <motion.div
        className={`${cardStyle} absolute`}
        animate={{
          x: [0, 30, 0],
          zIndex: [0, 0, 2],
          rotate: [5, 10, -5],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        🐶
      </motion.div>

      {/* Carta da frente - sobe na diagonal e vai pra trás */}
      <motion.div
        className={`${cardStyle} absolute`}
        animate={{
          x: [0, -15, 0],
          y: [0, -10, 0],
          scale: [1, 1.1, 1],
          zIndex: [2, 2, 0],
          rotate: [-5, -15, 5],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        🐕
      </motion.div>
    </div>
  )
}
