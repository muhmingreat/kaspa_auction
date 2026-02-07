import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 24,
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4F46E5',
                }}
            >
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* Outer Hexagon */}
                    <path
                        d="M50 8L86.4 29V71L50 92L13.6 71V29L50 8Z"
                        stroke="currentColor"
                        strokeWidth="8" // Increased stroke for small size visibility
                        strokeLinejoin="round"
                    />
                    {/* K Bolt */}
                    <path
                        d="M38 25V75M38 50L65 30L45 55L70 45L40 85L50 65L38 75"
                        stroke="currentColor"
                        strokeWidth="10" // Increased stroke
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        ),
        {
            ...size,
        }
    )
}
