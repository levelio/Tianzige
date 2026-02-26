interface MascotProps {
  size?: 'sm' | 'md' | 'lg'
  mood?: 'happy' | 'excited' | 'encouraging'
}

export function Mascot({ size = 'md', mood = 'happy' }: MascotProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const moods = {
    happy: '😊',
    excited: '🤩',
    encouraging: '💪',
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center`}>
      <span className="text-4xl filter drop-shadow-lg">{moods[mood]}</span>
    </div>
  )
}
