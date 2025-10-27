import React from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

type AnimationType =
  | "fadeIn"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleIn"
  | "scaleUp"
  | "rotateIn"
  | "bounceUp";

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
  bidirectional?: boolean;
}

const animations = {
  fadeIn: {
    initial: "opacity-0",
    animate: "opacity-100",
    exit: "opacity-0",
    transition: "transition-opacity ease-out",
  },
  slideUp: {
    initial: "opacity-0 translate-y-8",
    animate: "opacity-100 translate-y-0",
    exit: "opacity-0 translate-y-8",
    transition: "transition-all ease-out",
  },
  slideDown: {
    initial: "opacity-0 -translate-y-8",
    animate: "opacity-100 translate-y-0",
    exit: "opacity-0 -translate-y-8",
    transition: "transition-all ease-out",
  },
  slideLeft: {
    initial: "opacity-0 translate-x-8",
    animate: "opacity-100 translate-x-0",
    exit: "opacity-0 translate-x-8",
    transition: "transition-all ease-out",
  },
  slideRight: {
    initial: "opacity-0 -translate-x-8",
    animate: "opacity-100 translate-x-0",
    exit: "opacity-0 -translate-x-8",
    transition: "transition-all ease-out",
  },
  scaleIn: {
    initial: "opacity-0 scale-95",
    animate: "opacity-100 scale-100",
    exit: "opacity-0 scale-95",
    transition: "transition-all ease-out",
  },
  scaleUp: {
    initial: "opacity-0 scale-90",
    animate: "opacity-100 scale-100",
    exit: "opacity-0 scale-90",
    transition: "transition-all ease-out",
  },
  rotateIn: {
    initial: "opacity-0 rotate-3 scale-95",
    animate: "opacity-100 rotate-0 scale-100",
    exit: "opacity-0 rotate-3 scale-95",
    transition: "transition-all ease-out",
  },
  bounceUp: {
    initial: "opacity-0 translate-y-12",
    animate: "opacity-100 translate-y-0",
    exit: "opacity-0 translate-y-12",
    transition: "transition-all ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
  },
};

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animation = "fadeIn",
  duration = 600,
  delay = 0,
  className = "",
  threshold = 0.1,
  triggerOnce = true,
  bidirectional = false,
}) => {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold,
    triggerOnce,
    bidirectional,
  });

  const animationConfig = animations[animation];

  const style = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  // Determine which animation state to use
  const getAnimationState = () => {
    if (isVisible) {
      return animationConfig.animate;
    } else if (bidirectional) {
      return animationConfig.exit;
    } else {
      return animationConfig.initial;
    }
  };

  return (
    <div
      ref={elementRef}
      style={style}
      className={`
        ${animationConfig.transition} 
        ${getAnimationState()}
        ${className}
        ${
          isVisible && className.includes("animate-when-visible")
            ? "animate-when-visible"
            : ""
        }
      `.trim()}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
