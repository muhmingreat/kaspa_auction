'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: number
  animated?: boolean
}

export function Logo({ className, size = 40, animated = true }: LogoProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "w-full h-full text-[#4F46E5]",
          animated && "animate-logo-float"
        )}
      >
        {/* Outer Hexagon - Kaspa Identity */}
        <path
          d="M50 8L86.4 29V71L50 92L13.6 71V29L50 8Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
          className={cn(animated && "animate-logo-draw")}
        />

        {/* The "K" Bolt - Modern, Fast, Unique */}
        <path
          d="M38 25V75M38 50L65 30L45 55L70 45L40 85L50 65L38 75"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(animated && "animate-logo-strike")}
          fill="currentColor"
          fillOpacity="0.1"
        />

        {/* Gavel Head Details */}
        <path
          d="M60 75H75M60 82H75"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className={cn(animated && "animate-logo-tap")}
        />
      </svg>

      <style jsx>{`
        @keyframes logo-draw {
          0% { stroke-dasharray: 0 400; opacity: 0; }
          100% { stroke-dasharray: 400 400; opacity: 1; }
        }
        @keyframes logo-strike {
          0%, 100% { filter: drop-shadow(0 0 0px #4F46E5); transform: scale(1); }
          50% { filter: drop-shadow(0 0 8px rgba(79, 70, 229, 0.4)); transform: scale(1.02); }
        }
        @keyframes logo-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes logo-tap {
          0%, 100% { opacity: 1; transform: translateX(0); }
          50% { opacity: 0.6; transform: translateX(2px); }
        }
        .animate-logo-draw {
          animation: logo-draw 2s ease-out forwards;
        }
        .animate-logo-strike {
          animation: logo-strike 3s ease-in-out infinite;
          transform-origin: center;
        }
        .animate-logo-float {
          animation: logo-float 5s ease-in-out infinite;
        }
        .animate-logo-tap {
          animation: logo-tap 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
