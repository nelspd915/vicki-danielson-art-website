"use client";

export default function ScrollButton() {
  const handleClick = () => {
    const element = document.getElementById("artwork");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 group"
    >
      <span className="inline-flex items-center">
        Explore My Work
        <svg
          className="ml-2 w-5 h-5 transform group-hover:translate-y-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
  );
}
