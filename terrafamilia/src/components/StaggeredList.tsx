import React, { useEffect, useRef, useState } from "react";

interface StaggeredListProps {
  children: React.ReactNode;
  delay?: number; // Delay between each item in ms
  animation?: "slideUp" | "bounceUp" | "fadeIn";
  threshold?: number;
  className?: string;
}

const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  delay = 200,
  animation = "slideUp",
  threshold = 0.2,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const animationStyles = {
    slideUp: {
      initial: "opacity-0 translate-y-4",
      animate: "opacity-100 translate-y-0",
    },
    bounceUp: {
      initial: "opacity-0 translate-y-8 scale-95",
      animate: "opacity-100 translate-y-0 scale-100",
    },
    fadeIn: {
      initial: "opacity-0",
      animate: "opacity-100",
    },
  };

  const currentAnimation = animationStyles[animation];

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`
            transition-all duration-600 ease-out
            ${isVisible ? currentAnimation.animate : currentAnimation.initial}
          `}
          style={{
            transitionDelay: isVisible ? `${index * delay}ms` : "0ms",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default StaggeredList;
