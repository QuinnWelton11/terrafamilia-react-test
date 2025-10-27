import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  bidirectional?: boolean;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -100px 0px",
    triggerOnce = true,
    bidirectional = false,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const elementRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Track scroll direction if bidirectional
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      lastScrollY.current = currentScrollY;
    };

    if (bidirectional) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce && !bidirectional) {
            setHasTriggered(true);
          }
        } else {
          if (!triggerOnce || bidirectional) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      if (bidirectional) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [threshold, rootMargin, triggerOnce, bidirectional, hasTriggered]);

  return { elementRef, isVisible, scrollDirection };
};
