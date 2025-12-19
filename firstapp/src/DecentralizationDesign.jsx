import React from 'react';

export default function DecentralizationDesign() {
  // Calculate points for octagon
  const octagonSize = 320;
  const octagonCenter = octagonSize / 2;
  const octagonRadius = octagonSize / 2;
  const octagonPoints = [];
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i - Math.PI / 2; // Start from top
    const x = octagonCenter + octagonRadius * Math.cos(angle);
    const y = octagonCenter + octagonRadius * Math.sin(angle);
    octagonPoints.push(`${x},${y}`);
  }

  // Calculate points for rotated square (45 degrees)
  // The square should touch the midpoints of the octagon sides
  // Distance from center to midpoint of octagon side = radius * cos(π/8)
  const distanceToMidpoint = octagonRadius * Math.cos(Math.PI / 8);
  const squareSize = distanceToMidpoint * 2; // Full diagonal of the square
  const squareHalf = squareSize / 2;
  
  // Square points before rotation (axis-aligned)
  const squarePoints = [
    `${octagonCenter - squareHalf},${octagonCenter - squareHalf}`, // top-left
    `${octagonCenter + squareHalf},${octagonCenter - squareHalf}`, // top-right
    `${octagonCenter + squareHalf},${octagonCenter + squareHalf}`, // bottom-right
    `${octagonCenter - squareHalf},${octagonCenter + squareHalf}`  // bottom-left
  ];

  // Generate complex dashed line pattern (decagon-like structure)
  const generateDashedLines = () => {
    const lines = [];
    const centerX = octagonCenter;
    const centerY = octagonCenter;
    const squareHalfSize = squareHalf;
    
    // Create a dense, interconnected mesh pattern
    // Decagon (10-sided) star pattern with multiple layers
    const numPoints = 10;
    const layers = [
      { radius: squareHalfSize * 0.25, connections: true },
      { radius: squareHalfSize * 0.4, connections: true },
      { radius: squareHalfSize * 0.55, connections: true },
      { radius: squareHalfSize * 0.7, connections: true }
    ];
    
    // Generate points for each layer
    layers.forEach((layer, layerIdx) => {
      const points = [];
      for (let i = 0; i < numPoints; i++) {
        const angle = (Math.PI * 2 / numPoints) * i;
        points.push({
          x: centerX + layer.radius * Math.cos(angle),
          y: centerY + layer.radius * Math.sin(angle),
          angle: angle
        });
      }
      
      // Connect points within the same layer
      if (layer.connections) {
        for (let i = 0; i < points.length; i++) {
          const next = (i + 1) % points.length;
          lines.push(
            <line 
              key={`layer-${layerIdx}-connect-${i}`} 
              x1={points[i].x} 
              y1={points[i].y} 
              x2={points[next].x} 
              y2={points[next].y} 
              stroke="#000" 
              strokeWidth="1" 
              strokeDasharray="5 5" 
              fill="none" 
            />
          );
          
          // Connect to opposite point (creates star pattern)
          const opposite = (i + numPoints / 2) % points.length;
          lines.push(
            <line 
              key={`layer-${layerIdx}-star-${i}`} 
              x1={points[i].x} 
              y1={points[i].y} 
              x2={points[opposite].x} 
              y2={points[opposite].y} 
              stroke="#000" 
              strokeWidth="1" 
              strokeDasharray="5 5" 
              fill="none" 
            />
          );
        }
      }
      
      // Connect to adjacent layers
      if (layerIdx < layers.length - 1) {
        const nextLayer = layers[layerIdx + 1];
        const nextPoints = [];
        for (let i = 0; i < numPoints; i++) {
          const angle = (Math.PI * 2 / numPoints) * i;
          nextPoints.push({
            x: centerX + nextLayer.radius * Math.cos(angle),
            y: centerY + nextLayer.radius * Math.sin(angle)
          });
        }
        
        for (let i = 0; i < points.length; i++) {
          lines.push(
            <line 
              key={`layer-${layerIdx}-to-${layerIdx + 1}-${i}`} 
              x1={points[i].x} 
              y1={points[i].y} 
              x2={nextPoints[i].x} 
              y2={nextPoints[i].y} 
              stroke="#000" 
              strokeWidth="1" 
              strokeDasharray="5 5" 
              fill="none" 
            />
          );
        }
      }
      
      // Connect to square perimeter
      for (let i = 0; i < points.length; i += 2) {
        // Find closest point on square perimeter
        const angle = points[i].angle;
        let closestX, closestY;
        if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
          closestX = centerX + (Math.cos(angle) > 0 ? squareHalfSize : -squareHalfSize);
          closestY = centerY + squareHalfSize * Math.tan(angle);
        } else {
          closestY = centerY + (Math.sin(angle) > 0 ? squareHalfSize : -squareHalfSize);
          closestX = centerX + squareHalfSize / Math.tan(angle);
        }
        
        lines.push(
          <line 
            key={`layer-${layerIdx}-to-square-${i}`} 
            x1={points[i].x} 
            y1={points[i].y} 
            x2={closestX} 
            y2={closestY} 
            stroke="#000" 
            strokeWidth="1" 
            strokeDasharray="5 5" 
            fill="none" 
          />
        );
      }
    });
    
    return lines;
  };

  return (
    <div 
      className="w-full h-screen flex items-center justify-center overflow-hidden relative"
      style={{
        backgroundColor: '#F8F8F8'
      }}
    >
      {/* Dotted grid background */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(211, 211, 211, 0.4) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0'
        }} 
      />

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-black pointer-events-none" style={{ borderLeftWidth: '1px', borderTopWidth: '1px' }} />
      <div className="absolute top-8 right-8 w-12 h-12 border-black pointer-events-none" style={{ borderRightWidth: '1px', borderTopWidth: '1px' }} />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-black pointer-events-none" style={{ borderLeftWidth: '1px', borderBottomWidth: '1px' }} />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-black pointer-events-none" style={{ borderRightWidth: '1px', borderBottomWidth: '1px' }} />

      {/* Text labels */}
      <div className="absolute top-12 right-12 text-xs font-mono text-black tracking-wider pointer-events-none" style={{ fontFamily: 'Consolas, monospace' }}>
        // 002
      </div>
      <div className="absolute bottom-12 left-12 text-xs font-mono text-black tracking-wider pointer-events-none" style={{ fontFamily: 'Consolas, monospace' }}>
        // DECENTRALIZATION
      </div>

      {/* Main geometric design */}
      <svg 
        width={octagonSize}
        height={octagonSize}
        viewBox={`0 0 ${octagonSize} ${octagonSize}`}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <defs>
          {/* Gradient for the rotated square - light purple/lavender to light blue/cyan */}
          <linearGradient id="squareGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A9A4ED" stopOpacity="1" />
            <stop offset="50%" stopColor="#B8B4E8" stopOpacity="1" />
            <stop offset="100%" stopColor="#A4E0ED" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer octagon */}
        <polygon
          points={octagonPoints.join(' ')}
          fill="none"
          stroke="#000000"
          strokeWidth="1.5"
        />

        {/* Inner rotated square with gradient fill */}
        <rect
          x={octagonCenter - squareHalf}
          y={octagonCenter - squareHalf}
          width={squareSize}
          height={squareSize}
          fill="url(#squareGradient)"
          stroke="#000000"
          strokeWidth="1.5"
          transform={`rotate(45 ${octagonCenter} ${octagonCenter})`}
        />

        {/* Complex dashed line pattern overlay */}
        <g transform={`rotate(45 ${octagonCenter} ${octagonCenter})`}>
          {generateDashedLines()}
        </g>
      </svg>
    </div>
  );
}
