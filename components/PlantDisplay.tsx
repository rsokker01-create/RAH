import React from 'react';
import type { PlantState } from '../types';
import { PlantStatus } from '../types';

interface PlantDisplayProps {
  state: PlantState;
}

// Sub-component for a single leaf to keep the main SVG clean
const Leaf: React.FC<{ x: number, y: number, rotation: number, scale: number, wilted: boolean }> = ({ x, y, rotation, scale, wilted }) => (
  <g 
    transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale}) ${wilted ? 'rotate(30)' : ''}`} 
    className="origin-bottom-left transition-transform duration-700 ease-in-out"
  >
    <path d="M0,0 C15,-15 30,-15 45,0 C30,15 15,15 0,0 Z" fill="url(#leafGradient)" />
    <path d="M2,0 Q 22.5,0 43,0" stroke="var(--leaf-dark-color)" strokeWidth="0.7" fill="none" opacity="0.6" />
  </g>
);


const PlantDisplay: React.FC<PlantDisplayProps> = ({ state }) => {
  const { status, growth } = state;

  const getStatusMessage = () => {
    let color = 'text-green-600 dark:text-green-400';
    switch (status) {
      case PlantStatus.Wilted:
      case PlantStatus.Dried:
        color = 'text-yellow-600 dark:text-yellow-400';
        break;
      case PlantStatus.Frozen:
        color = 'text-blue-400 dark:text-blue-300';
        break;
      case PlantStatus.Broken:
        color = 'text-gray-500 dark:text-gray-400';
        break;
      case PlantStatus.Fruiting:
        color = 'text-pink-500 dark:text-pink-400';
        break;
    }
    return <div className={`absolute bottom-4 right-4 text-xl font-bold p-3 bg-white/70 dark:bg-black/50 rounded-lg shadow-md ${color}`}>{status}</div>;
  };
  
  const plantStyle: React.CSSProperties = {
    '--growth': growth,
    '--stem-color': '#5a3a22',
    '--leaf-color-1': '#228B22',
    '--leaf-color-2': '#3CB371',
    '--leaf-dark-color': '#1A671A',
    '--fruit-color-1': '#FF0000',
    '--fruit-color-2': '#DC143C',
    '--flower-color': '#FFB6C1',
    '--flower-center': '#FFEE00',
  } as React.CSSProperties;

  const isWilted = status === PlantStatus.Wilted || status === PlantStatus.Dried;

  if (isWilted) {
    plantStyle['--leaf-color-1'] = '#C4A484';
    plantStyle['--leaf-color-2'] = '#BDB76B';
    plantStyle['--stem-color'] = '#704214';
    plantStyle['--leaf-dark-color'] = '#8B4513';
  }

  if (status === PlantStatus.Frozen) {
    plantStyle.filter = 'url(#frost)';
  }

  const flowerAnimation = status === PlantStatus.Windy || status === PlantStatus.Broken ? 'animate-fall' : '';
  const plantSway = status === PlantStatus.Windy ? 'rotate(-4 100 170)' : '';
  const plantBreak = status === PlantStatus.Broken ? 'rotate(80 100 170)' : plantSway;

  return (
    <div className="w-full h-full flex flex-col items-center justify-end relative">
       {getStatusMessage()}
       <style>{`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(150px) rotate(360deg); opacity: 0; }
          }
          .animate-fall {
            animation: fall 1.5s ease-in-out forwards;
          }
       `}</style>
      <svg
        viewBox="0 0 200 200"
        className="w-[300px] h-[300px] transition-all duration-1000 ease-in-out"
        style={plantStyle}
      >
        <defs>
            <filter id="frost">
                <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="3" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                <feComponentTransfer>
                    <feFuncA type="table" tableValues="0 1 1 1 1 1 1 1 1 1 1 1"/>
                </feComponentTransfer>
                <feComposite operator="in" in2="SourceGraphic"/>
                <feColorMatrix type="matrix" values="0.8 0 0 0 0.1 0 0.8 0 0 0.1 0 0 0.9 0 0.2 0 0 0 1 0"/>
            </filter>
            <linearGradient id="potGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#D2691E'}} />
                <stop offset="100%" style={{stopColor: '#A0522D'}} />
            </linearGradient>
            <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'var(--leaf-color-2)'}} />
                <stop offset="100%" style={{stopColor: 'var(--leaf-color-1)'}} />
            </linearGradient>
            <radialGradient id="fruitGradient">
                <stop offset="10%" style={{stopColor: 'var(--fruit-color-1)', stopOpacity: 0.8}} />
                <stop offset="95%" style={{stopColor: 'var(--fruit-color-2)'}} />
            </radialGradient>
        </defs>

        {/* Pot */}
        <path d="M 60 180 L 70 195 L 130 195 L 140 180 Z" fill="url(#potGradient)" />
        <path d="M 58 170 L 142 170 L 138 180 L 62 180 Z" fill="#A0522D" />
        
        {/* Plant Group */}
        <g 
            transform={`translate(100 170) scale(1, -1) scale(var(--growth, 1)) translate(-100 -170)`}
            className="origin-bottom transition-transform duration-1000 ease-out"
        >
            <g transform={plantBreak} className="origin-bottom transition-transform duration-500">
              {/* Main Stem */}
              <path 
                  d="M 100 170 C 105 140, 95 120, 100 80 S 105 50, 100 40" 
                  stroke="var(--stem-color)" 
                  strokeWidth="6" 
                  fill="none"
                  strokeLinecap="round"
                  className="transition-colors duration-500"
              />
              {/* Branch */}
              <path 
                  d="M 100 130 C 90 125, 80 110, 70 100" 
                  stroke="var(--stem-color)" 
                  strokeWidth="4" 
                  fill="none" 
                  strokeLinecap="round"
                  className="transition-colors duration-500"
              />
              
              {/* Leaves */}
              <g className="transition-all duration-500">
                  <Leaf x={98} y={145} rotation={-45} scale={1} wilted={isWilted} />
                  <Leaf x={102} y={145} rotation={225} scale={1} wilted={isWilted} />
                  <Leaf x={70} y={105} rotation={-15} scale={0.9} wilted={isWilted} />
                  <Leaf x={98} y={95} rotation={-60} scale={0.8} wilted={isWilted} />
                  <Leaf x={102} y={95} rotation={240} scale={0.8} wilted={isWilted} />
                  <Leaf x={98} y={55} rotation={-75} scale={0.7} wilted={isWilted} />
              </g>
            </g>

            {/* Fruits/Flowers */}
            <g className={`transition-opacity duration-1000 ${status === PlantStatus.Fruiting || status === PlantStatus.Windy || status === PlantStatus.Broken ? 'opacity-100' : 'opacity-0'}`}>
                {/* Fruits are visible only when fruiting */}
                <g transform={plantBreak} className={`origin-bottom transition-all duration-500 ${status === PlantStatus.Fruiting ? 'opacity-100' : 'opacity-0'}`}>
                    <g transform="translate(85, 115)">
                        <circle cx="0" cy="0" r="6" fill="url(#fruitGradient)" />
                        <path d="M 0 -6 Q 2 -8, 4 -7" stroke="#5C4033" strokeWidth="1" fill="none" />
                    </g>
                    <g transform="translate(115, 85)">
                        <circle cx="0" cy="0" r="5" fill="url(#fruitGradient)" />
                        <path d="M 0 -5 Q 1.5 -7, 3 -6" stroke="#5C4033" strokeWidth="1" fill="none" />
                    </g>
                    <g transform="translate(90, 50)">
                         <circle cx="0" cy="0" r="6" fill="url(#fruitGradient)" />
                        <path d="M 0 -6 Q 2 -8, 4 -7" stroke="#5C4033" strokeWidth="1" fill="none" />
                    </g>
                </g>
                {/* Flowers are visible before fruiting and fall in wind */}
                 <g className={flowerAnimation}>
                    <g transform={plantBreak} className="origin-bottom transition-transform duration-500">
                        <g transform="translate(110, 125)">
                            <path d="M0-6 L3-3 L6 0 L3 3 L0 6 L-3 3 L-6 0 L-3-3Z" fill="var(--flower-color)" />
                            <circle cx="0" cy="0" r="2" fill="var(--flower-center)" />
                        </g>
                        <g transform="translate(70, 80)">
                             <path d="M0-5 L2.5-2.5 L5 0 L2.5 2.5 L0 5 L-2.5 2.5 L-5 0 L-2.5-2.5Z" fill="var(--flower-color)" />
                            <circle cx="0" cy="0" r="1.5" fill="var(--flower-center)" />
                        </g>
                        <g transform="translate(115, 50)">
                            <path d="M0-6 L3-3 L6 0 L3 3 L0 6 L-3 3 L-6 0 L-3-3Z" fill="var(--flower-color)" />
                            <circle cx="0" cy="0" r="2" fill="var(--flower-center)" />
                        </g>
                    </g>
                 </g>
            </g>
        </g>
      </svg>
    </div>
  );
};

export default PlantDisplay;