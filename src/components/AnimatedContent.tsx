import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type AnimatedContentProps = {
  children: ReactNode
  className?: string
}

export function AnimatedContent({
  children,
  className,
}: AnimatedContentProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { scale: 0.992 }}
      whileInView={reduceMotion ? undefined : { scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
