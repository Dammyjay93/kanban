import { MotionProps } from 'framer-motion';

export const springTransition = {
  type: "spring",
  bounce: 0.2,
  duration: 0.6,
  damping: 15,
  stiffness: 150
} as const;

export const quickSpringTransition = {
  type: "spring",
  bounce: 0.3,
  duration: 0.4
} as const;

export const cardSpringTransition = {
  type: "spring",
  bounce: 0.2,
  duration: 0.5,
  damping: 20,
  stiffness: 300
} as const;

export const kanbanAnimations = {
  layout: {
    initial: false,
    layout: "position",
    transition: springTransition
  } satisfies Partial<MotionProps>,
  
  cardVariants: {
    dragging: {
      scale: 1,
      opacity: 1
    },
    default: {
      scale: 1,
      opacity: 1
    }
  },
  
  card: {
    initial: false,
    layout: "position",
    transition: cardSpringTransition,
    variants: {
      dragging: {
        scale: 1,
        opacity: 1
      },
      default: {
        scale: 1,
        opacity: 1
      }
    }
  } satisfies Partial<MotionProps>,
  
  dropIndicator: {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    transition: quickSpringTransition
  } satisfies Partial<MotionProps>
} as const; 