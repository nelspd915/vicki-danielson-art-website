"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    // Add animate-on-scroll class to all scroll-animate elements initially
    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => {
      // Only add the hidden state to elements that aren't in the initial viewport
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.8) {
        el.classList.add("animate-on-scroll");
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("animate-on-scroll");
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Observe all elements with the scroll-animate class
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return null; // This component doesn't render anything
}
