import { useState, useEffect, useRef } from 'react';

function AnimatedNumber({ value, duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const numericValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^0-9.-]/g, '')) || 0
      : value;

    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const startValue = displayValue || 0;
    const endValue = numericValue;

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (endValue - startValue) * easeOutQuart;
      
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    startTime.current = null;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  if (typeof value === 'string' && value.startsWith('₹')) {
    return `₹${typeof displayValue === 'number' ? displayValue.toFixed(2) : displayValue}`;
  }

  return typeof displayValue === 'number' 
    ? Number.isInteger(parseFloat(value)) ? Math.round(displayValue) : displayValue.toFixed(2)
    : displayValue;
}

export default function StatCard({ title, value, icon, color = 'green', delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const iconBgClasses = {
    green: 'bg-green-100',
    blue: 'bg-blue-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100'
  };

  const iconHoverClasses = {
    green: 'group-hover:bg-green-200',
    blue: 'group-hover:bg-blue-200',
    yellow: 'group-hover:bg-yellow-200',
    red: 'group-hover:bg-red-200',
    purple: 'group-hover:bg-purple-200'
  };

  const gradientClasses = {
    green: 'from-green-500/5 to-transparent',
    blue: 'from-blue-500/5 to-transparent',
    yellow: 'from-yellow-500/5 to-transparent',
    red: 'from-red-500/5 to-transparent',
    purple: 'from-purple-500/5 to-transparent'
  };

  return (
    <div
      ref={cardRef}
      className={`
        group relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 
        hover-lift cursor-pointer overflow-hidden
        transition-all duration-300 ease-out
        ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
      `}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium transition-colors group-hover:text-gray-700">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2 number-animate">
            <AnimatedNumber value={value} duration={1200} />
          </p>
        </div>
        <div 
          className={`
            ${iconBgClasses[color]} ${iconHoverClasses[color]} 
            rounded-full p-4 transition-all duration-300
            ${isHovered ? 'scale-110 rotate-3' : 'scale-100'}
          `}
        >
          <span className={`text-2xl block transition-transform duration-300 ${isHovered ? 'animate-bounce-gentle' : ''}`}>
            {icon}
          </span>
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${
        color === 'green' ? 'from-green-400 to-green-600' :
        color === 'blue' ? 'from-blue-400 to-blue-600' :
        color === 'yellow' ? 'from-yellow-400 to-yellow-600' :
        color === 'red' ? 'from-red-400 to-red-600' :
        'from-purple-400 to-purple-600'
      } transition-all duration-300 ${isHovered ? 'w-full' : 'w-0'}`}></div>
    </div>
  );
}
