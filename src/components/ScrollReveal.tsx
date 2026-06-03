"use client";

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

const ScrollReveal = ({ children, direction = 'up', delay = 0 }: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getDirectionClasses = () => {
    switch (direction) {
      case 'up': return isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0';
      case 'down': return isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0';
      case 'left': return isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0';
      case 'right': return isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0';
      default: return isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${getDirectionClasses()}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;