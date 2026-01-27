interface CuragoLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function CuragoLogo({ className = '', size = 'md' }: CuragoLogoProps) {
  const sizes = {
    sm: { width: 90, height: 24, fontSize: 18 },
    md: { width: 120, height: 32, fontSize: 24 },
    lg: { width: 180, height: 48, fontSize: 36 },
  }

  const { width, height, fontSize } = sizes[size]

  return (
    <svg
      viewBox="0 0 120 32"
      width={width}
      height={height}
      className={className}
      aria-label="Curago"
    >
      <text
        x="0"
        y="25"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        letterSpacing="-0.5"
      >
        <tspan fill="currentColor">Cura</tspan>
        <tspan fill="var(--primary)">go</tspan>
      </text>
    </svg>
  )
}
