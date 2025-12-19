import React, { useState, useEffect, useRef } from 'react';

export default function GeometricDesign() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Separate state for orbital design
  const [orbitalMousePosition, setOrbitalMousePosition] = useState({ x: 0, y: 0 });
  const [orbitalSmoothPosition, setOrbitalSmoothPosition] = useState({ x: 0, y: 0 });
  const orbitalContainerRef = useRef(null);
  const orbitalAnimationFrameRef = useRef(null);

  const mainContainerRef = useRef(null);

  // Smooth mouse following with premium easing
  useEffect(() => {
    const updateSmoothPosition = () => {
      setSmoothPosition(prev => {
        const lagFactor = 0.12; // Smooth, fluid following
        const dx = (mousePosition.x - prev.x) * lagFactor;
        const dy = (mousePosition.y - prev.y) * lagFactor;
        
        return {
          x: prev.x + dx,
          y: prev.y + dy
        };
      });
      
      animationFrameRef.current = requestAnimationFrame(updateSmoothPosition);
    };

    animationFrameRef.current = requestAnimationFrame(updateSmoothPosition);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

  // Smooth mouse following for orbital design with soft inertia
  useEffect(() => {
    const updateOrbitalSmoothPosition = () => {
      setOrbitalSmoothPosition(prev => {
        const lagFactor = 0.15; // Smooth, fluid following with soft inertia
        const dx = (orbitalMousePosition.x - prev.x) * lagFactor;
        const dy = (orbitalMousePosition.y - prev.y) * lagFactor;
        
        return {
          x: prev.x + dx,
          y: prev.y + dy
        };
      });
      
      orbitalAnimationFrameRef.current = requestAnimationFrame(updateOrbitalSmoothPosition);
    };

    orbitalAnimationFrameRef.current = requestAnimationFrame(updateOrbitalSmoothPosition);
    
    return () => {
      if (orbitalAnimationFrameRef.current) {
        cancelAnimationFrame(orbitalAnimationFrameRef.current);
      }
    };
  }, [orbitalMousePosition]);


  // Mouse tracking with distance-based activation
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Only move if mouse is within reasonable distance (creates a "hover zone")
    if (distance < 400) {
      setMousePosition({
        x: deltaX * 0.25, // Subtle, elegant movement
        y: deltaY * 0.25
      });
    } else {
      setMousePosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Mouse tracking for orbital design - follows mouse cursor within limited distance
  const handleOrbitalMouseMove = (e) => {
    if (!orbitalContainerRef.current) return;
    
    const rect = orbitalContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Limit the maximum distance circles can move from center
    const maxDistance = 80;
    
    if (distance > 0) {
      const limitedDistance = Math.min(distance, maxDistance);
      const scale = limitedDistance / distance;
      
      setOrbitalMousePosition({
        x: deltaX * 0.3 * scale,
        y: deltaY * 0.3 * scale
      });
    } else {
      setOrbitalMousePosition({ x: 0, y: 0 });
    }
  };

  const handleOrbitalMouseLeave = () => {
    setOrbitalMousePosition({ x: 0, y: 0 });
  };

  // Position swap interpretation:
  // Originally: Small solid was at middle layer (224px), Small dashed was at innermost (192px)
  // After swap: Small solid now at innermost (192px), Small dashed now at middle (224px)

  return (
    <>
      <style>{`
        @keyframes dashLoop {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 48;
          }
        }
        
        @keyframes dashLoopReverse {
          0% {
            stroke-dashoffset: 48;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes dashRotate {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 14;
          }
        }
        
        @keyframes rotateEllipse1 {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes rotateEllipse2 {
          0% {
            transform: rotate(60deg);
          }
          100% {
            transform: rotate(420deg);
          }
        }
        
        @keyframes rotateEllipse3 {
          0% {
            transform: rotate(120deg);
          }
          100% {
            transform: rotate(480deg);
          }
        }
        
        @keyframes dashMove1 {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 28;
          }
        }
        
        @keyframes dashMove2 {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -28;
          }
        }
        
        @keyframes dashMove3 {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 28;
          }
        }
      `}</style>
      <div 
        ref={mainContainerRef}
        className="w-full min-h-screen flex flex-col overflow-hidden relative"
        style={{
          backgroundColor: '#fefefe'
        }}
      >
        {/* First Design - Geometric Squares */}
        <div 
          ref={containerRef}
          className="w-full h-screen flex items-center justify-center overflow-hidden relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Subtle dot grid background */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(42, 42, 42, 0.15) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0'
            }} 
          />

          {/* Corner brackets */}
          <div className="absolute top-8 left-8 w-12 h-12 border-black pointer-events-none" style={{ borderLeftWidth: '0.5px', borderTopWidth: '0.5px' }} />
          <div className="absolute top-8 right-8 w-12 h-12 border-black pointer-events-none" style={{ borderRightWidth: '0.5px', borderTopWidth: '0.5px' }} />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-black pointer-events-none" style={{ borderLeftWidth: '0.5px', borderBottomWidth: '0.5px' }} />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-black pointer-events-none" style={{ borderRightWidth: '0.5px', borderBottomWidth: '0.5px' }} />

          {/* Top label */}
          <div className="absolute top-12 right-12 text-xs font-mono text-gray-800 tracking-wider pointer-events-none">
            // 001
          </div>

          {/* Bottom label */}
          <div className="absolute bottom-12 left-12 text-xs font-mono text-gray-800 tracking-wider pointer-events-none">
            // PERFORMANCE
          </div>

        {/* Main container - ALL elements follow mouse cursor */}
        <div 
          className="relative flex items-center justify-center pointer-events-none"
          style={{
            width: '420px',
            height: '420px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${smoothPosition.x}px), calc(-50% + ${smoothPosition.y}px))`,
            willChange: 'transform'
          }}
        >
          {/* Background gradient layers - three-layered soft color shadows */}
          {/* Layer 1: Soft yellow to purple gradient */}
          <div 
            className="absolute rounded-full"
            style={{ 
              width: '420px',
              height: '420px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle at 30% 70%, rgba(255, 248, 220, 0.35) 0%, rgba(230, 230, 250, 0.3) 50%, transparent 75%)',
              filter: 'blur(60px)',
              zIndex: 0
            }}
          />

          {/* Layer 2: Purple to blue gradient */}
          <div 
            className="absolute rounded-full"
            style={{ 
              width: '380px',
              height: '380px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle at 50% 30%, rgba(221, 160, 221, 0.3) 0%, rgba(176, 224, 230, 0.25) 50%, transparent 70%)',
              filter: 'blur(50px)',
              zIndex: 0
            }}
          />

          {/* Layer 3: Blue accent */}
          <div 
            className="absolute rounded-full"
            style={{ 
              width: '340px',
              height: '340px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle at 70% 50%, rgba(173, 216, 230, 0.25) 0%, transparent 60%)',
              filter: 'blur(40px)',
              zIndex: 0
            }}
          />

          {/* Large solid square - rotated 45deg */}
          <svg 
            className="absolute"
            style={{ 
              width: '320px',
              height: '320px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              zIndex: 2
            }}
            viewBox="0 0 320 320"
          >
            <defs>
              <linearGradient id="largeSolidFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(224, 231, 255, 0.15)" />
                <stop offset="50%" stopColor="rgba(199, 210, 254, 0.2)" />
                <stop offset="100%" stopColor="rgba(224, 231, 255, 0.15)" />
              </linearGradient>
            </defs>
            <rect
              x="0.25"
              y="0.25"
              width="319.5"
              height="319.5"
              fill="url(#largeSolidFill)"
              stroke="#000000"
              strokeWidth="1.5"
            />
          </svg>

          {/* Large dashed square - axis-aligned */}
          <svg 
            className="absolute"
            style={{ 
              width: '288px',
              height: '288px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3
            }}
            viewBox="0 0 288 288"
          >
            <defs>
              <linearGradient id="largeDashedFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(219, 234, 254, 0.15)" />
                <stop offset="50%" stopColor="rgba(191, 219, 254, 0.2)" />
                <stop offset="100%" stopColor="rgba(219, 234, 254, 0.15)" />
              </linearGradient>
            </defs>
            <rect
              x="0.25"
              y="0.25"
              width="287.5"
              height="287.5"
              fill="url(#largeDashedFill)"
              stroke="#000000"
              strokeWidth="1.5"
              strokeDasharray="12 6"
              style={{
                strokeDashoffset: 0,
                animation: 'dashLoop 3s linear infinite'
              }}
            />
          </svg>

          {/* Small dashed square - axis-aligned, at previous position of small solid square (middle layer) */}
          <svg 
            className="absolute"
            style={{ 
              width: '224px',
              height: '224px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 4
            }}
            viewBox="0 0 224 224"
          >
            <rect
              x="0.25"
              y="0.25"
              width="223.5"
              height="223.5"
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
              strokeDasharray="10 5"
              style={{
                strokeDashoffset: 0,
                animation: 'dashLoopReverse 2.5s linear infinite'
              }}
            />
          </svg>

          {/* Small solid square - rotated 45deg, at previous position of small dashed square (innermost) */}
          <svg 
            className="absolute"
            style={{ 
              width: '192px',
              height: '192px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              zIndex: 5
            }}
            viewBox="0 0 192 192"
          >
            <rect
              x="0.25"
              y="0.25"
              width="191.5"
              height="191.5"
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        </div>

        {/* Second Design - Orbital Circles */}
        <div 
          ref={orbitalContainerRef}
          className="w-full h-screen flex items-center justify-center overflow-hidden relative"
          style={{
            backgroundColor: '#fefefe'
          }}
          onMouseMove={handleOrbitalMouseMove}
          onMouseLeave={handleOrbitalMouseLeave}
        >
          {/* Subtle dot grid background */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(42, 42, 42, 0.15) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0'
            }} 
          />

          {/* Main container for concentric circles - all follow mouse cursor */}
          <div 
            className="relative flex items-center justify-center pointer-events-none"
            style={{
              width: '500px',
              height: '500px',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${orbitalSmoothPosition.x}px), calc(-50% + ${orbitalSmoothPosition.y}px))`,
              willChange: 'transform'
            }}
          >
            {/* Outer large solid circle with gradient background */}
            <svg 
              className="absolute"
              style={{ 
                width: '400px',
                height: '400px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2
              }}
              viewBox="0 0 400 400"
            >
              <defs>
                <radialGradient id="bigCircleGradient" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="rgba(255, 182, 193, 0.25)" />
                  <stop offset="40%" stopColor="rgba(255, 165, 0, 0.2)" />
                  <stop offset="70%" stopColor="rgba(255, 20, 147, 0.25)" />
                  <stop offset="100%" stopColor="rgba(221, 160, 221, 0.2)" />
                </radialGradient>
              </defs>
              <circle
                cx="200"
                cy="200"
                r="199"
                fill="url(#bigCircleGradient)"
                stroke="#000000"
                strokeWidth="1"
              />
            </svg>

            {/* Middle large solid circle */}
            <svg 
              className="absolute"
              style={{ 
                width: '320px',
                height: '320px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 3
              }}
              viewBox="0 0 320 320"
            >
              <circle
                cx="160"
                cy="160"
                r="159"
                fill="none"
                stroke="#000000"
                strokeWidth="1"
              />
            </svg>

            {/* Small dashed circle - follows mouse more than other circles */}
            <svg 
              className="absolute"
              style={{ 
                width: '230px',
                height: '230px',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${orbitalSmoothPosition.x * 0.7}px), calc(-50% + ${orbitalSmoothPosition.y * 0.7}px))`,
                zIndex: 4,
                willChange: 'transform'
              }}
              viewBox="0 0 230 230"
            >
              <circle
                cx="115"
                cy="115"
                r="114"
                fill="none"
                stroke="#000000"
                strokeWidth="1"
                strokeDasharray="8 6"
                style={{
                  animation: 'dashRotate 0.3s linear infinite'
                }}
              />
            </svg>

            {/* Complete horizontal ellipse - wraps around circles */}
            <svg 
              className="absolute"
              style={{ 
                width: '600px',
                height: '500px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 5
              }}
              viewBox="0 0 600 500"
            >
              <defs>
                <mask id="ellipseMask">
                  <rect width="600" height="500" fill="white" />
                  <circle cx="300" cy="250" r="199.5" fill="black" />
                </mask>
                <clipPath id="ellipseFrontClip">
                  <rect x="0" y="250" width="600" height="250" />
                </clipPath>
              </defs>
              {/* Front part of ellipse (in front of circles) - fully visible */}
              <ellipse
                cx="300"
                cy="250"
                rx="290"
                ry="55"
                fill="none"
                stroke="#000000"
                strokeWidth="1"
                clipPath="url(#ellipseFrontClip)"
              />
              {/* Back part of ellipse (behind circles) - only visible outside big circle */}
              <ellipse
                cx="300"
                cy="250"
                rx="290"
                ry="55"
                fill="none"
                stroke="#000000"
                strokeWidth="1"
                mask="url(#ellipseMask)"
                style={{
                  clipPath: 'inset(0 0 50% 0)'
                }}
              />
            </svg>
          </div>
        </div>

        {/* Third Design - Vertical Bars with Circle Connection */}
        <div 
          className="w-full h-screen flex items-center justify-center overflow-hidden relative"
          style={{
            backgroundColor: '#fefefe'
          }}
        >
          {/* Subtle dot grid background */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(42, 42, 42, 0.15) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0'
            }} 
          />

          {/* Main container */}
          <div 
            className="relative flex flex-col items-center justify-center pointer-events-none"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute'
            }}
          >
            {/* Central Circle Design - Image 2 */}
            <div 
              className="absolute"
              style={{
                top: '30%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
            >
              <svg 
                width="300"
                height="300"
                viewBox="0 0 300 300"
              >
                <defs>
                  <radialGradient id="blueGlow" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="rgba(100, 149, 237, 0.6)" />
                    <stop offset="50%" stopColor="rgba(100, 149, 237, 0.3)" />
                    <stop offset="100%" stopColor="rgba(100, 149, 237, 0)" />
                  </radialGradient>
                </defs>
                
                {/* Outermost faint grey outline ring */}
                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="none"
                  stroke="rgba(100, 100, 100, 0.2)"
                  strokeWidth="1"
                />
                
                {/* Second expanding ring - light blue glow */}
                <circle
                  cx="150"
                  cy="150"
                  r="120"
                  fill="url(#blueGlow)"
                  stroke="rgba(100, 149, 237, 0.4)"
                  strokeWidth="1"
                />
                
                {/* First expanding ring - brighter blue glow */}
                <circle
                  cx="150"
                  cy="150"
                  r="100"
                  fill="rgba(100, 149, 237, 0.5)"
                  stroke="rgba(100, 149, 237, 0.6)"
                  strokeWidth="1"
                />
                
                {/* Central solid blue circle with dark outline */}
                <circle
                  cx="150"
                  cy="150"
                  r="50"
                  fill="rgba(100, 149, 237, 0.7)"
                  stroke="#000000"
                  strokeWidth="1.5"
                />
                
                {/* Innermost dark center dot */}
                <circle
                  cx="150"
                  cy="150"
                  r="15"
                  fill="#000000"
                />
              </svg>
            </div>

            {/* Connecting line from circle to bars - Image 2 */}
            <div 
              className="absolute"
              style={{
                top: '30%',
                left: '50%',
                width: '1px',
                height: '40%',
                backgroundColor: '#000000',
                transform: 'translateX(-50%)',
                pointerEvents: 'none'
              }}
            />

            {/* Vertical Bars at bottom */}
            <div 
              className="absolute"
              style={{
                bottom: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '2px',
                alignItems: 'flex-end',
                height: '200px',
                width: '90%',
                maxWidth: '1200px',
                justifyContent: 'center'
              }}
            >
              {Array.from({ length: 120 }).map((_, i) => {
                // Deterministic pattern using sine and cosine waves
                const baseHeight = 80;
                const wave1 = Math.sin(i * 0.08) * 40;
                const wave2 = Math.cos(i * 0.12) * 30;
                const wave3 = Math.sin(i * 0.05) * 20;
                const trend = (i / 120) * 60; // Gradual increase from left to right
                const finalHeight = baseHeight + wave1 + wave2 + wave3 + trend;
                return (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: `${Math.max(20, finalHeight)}px`,
                      backgroundColor: 'rgba(100, 100, 100, 0.6)',
                      minHeight: '20px'
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Fourth Design - Rotating Elliptical Rings */}
        <div 
          className="w-full h-screen flex items-center justify-center overflow-hidden relative"
          style={{
            backgroundColor: '#fefefe'
          }}
        >
          {/* Subtle dot grid background */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(42, 42, 42, 0.15) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0'
            }} 
          />

          {/* Soft gradient glow background */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(200, 180, 255, 0.08) 0%, rgba(180, 200, 255, 0.05) 50%, transparent 70%)',
              filter: 'blur(80px)'
            }}
          />

          {/* Main container */}
          <div 
            className="relative flex items-center justify-center pointer-events-none"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute'
            }}
          >
            <svg 
              width="1200"
              height="1200"
              viewBox="0 0 1200 1200"
              style={{
                position: 'relative'
              }}
            >
              <defs>
                {/* Gradient matching the image: white center, pinkish-purple top-left, bluish-purple bottom-right */}
                <radialGradient id="circleGradient" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
                  <stop offset="30%" stopColor="rgba(255, 240, 250, 0.8)" />
                  <stop offset="50%" stopColor="rgba(255, 200, 240, 0.6)" />
                  <stop offset="70%" stopColor="rgba(220, 200, 255, 0.5)" />
                  <stop offset="100%" stopColor="rgba(200, 220, 255, 0.4)" />
                </radialGradient>
              </defs>

              {/* Central solid circle - Smaller size */}
              <circle
                cx="600"
                cy="600"
                r="220"
                fill="url(#circleGradient)"
                stroke="rgba(80, 80, 80, 0.8)"
                strokeWidth="1.5"
              />

              {/* First dashed elliptical ring - horizontal direction (0°), more curved, fixed position, moving dashes fast */}
              <g transform="rotate(0 600 600)">
                <ellipse
                  cx="600"
                  cy="600"
                  rx="220"
                  ry="70"
                  fill="none"
                  stroke="rgba(80, 80, 80, 0.8)"
                  strokeWidth="1"
                  strokeDasharray="12 8"
                  style={{
                    animation: 'dashMove1 1s linear infinite'
                  }}
                />
              </g>

              {/* Second dashed elliptical ring - rotated 60°, more curved, fixed position, moving dashes fast */}
              <g transform="rotate(60 600 600)">
                <ellipse
                  cx="600"
                  cy="600"
                  rx="220"
                  ry="70"
                  fill="none"
                  stroke="rgba(80, 80, 80, 0.8)"
                  strokeWidth="1"
                  strokeDasharray="12 8"
                  style={{
                    animation: 'dashMove2 1.2s linear infinite'
                  }}
                />
              </g>

              {/* Third dashed elliptical ring - rotated 120°, more curved, fixed position, moving dashes fast */}
              <g transform="rotate(120 600 600)">
                <ellipse
                  cx="600"
                  cy="600"
                  rx="220"
                  ry="70"
                  fill="none"
                  stroke="rgba(80, 80, 80, 0.8)"
                  strokeWidth="1"
                  strokeDasharray="12 8"
                  style={{
                    animation: 'dashMove3 1.5s linear infinite'
                  }}
                />
              </g>
            </svg>
          </div>
        </div>

      </div>
    </>
  );
}

