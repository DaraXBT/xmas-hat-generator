import React, { useEffect, useRef } from "react";

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wind: number;
  opacity: number;
}

const SnowEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let snowflakes: Snowflake[] = [];
    const particleCount = 150; // Number of snowflakes

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize snowflakes
    const initSnowflakes = () => {
      snowflakes = [];
      for (let i = 0; i < particleCount; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5, // Radius between 0.5 and 2.5
          speed: Math.random() * 1 + 0.5, // Speed between 0.5 and 1.5
          wind: Math.random() * 0.5 - 0.25, // Slight wind effect
          opacity: Math.random() * 0.5 + 0.3, // Opacity between 0.3 and 0.8
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakes.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        // Changed to light blue for better visibility on white background
        ctx.fillStyle = `rgba(173, 216, 230, ${flake.opacity})`;
        ctx.fill();

        // Update positions
        flake.y += flake.speed;
        flake.x += flake.wind;

        // Reset if out of view
        if (flake.y > canvas.height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = canvas.width;
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    // Initial setup
    resizeCanvas();
    initSnowflakes();
    animate();

    const handleResize = () => {
      resizeCanvas();
      // Optionally re-init snowflakes or just let them fall
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default SnowEffect;
