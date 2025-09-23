interface AIEngineIconProps {
  engine: 'chatgpt' | 'claude' | 'perplexity' | 'gemini' | 'deepseek';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AIEngineIcon({ engine, size = 'md', className = '' }: AIEngineIconProps) {
  // Fallback emojis until SVG logos are added
  const fallbackIcons = {
    chatgpt: '🤖',
    claude: '🔮', 
    perplexity: '🔍',
    gemini: '💎',
    deepseek: '🎯'
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  // Try to load SVG, fallback to emoji
  try {
    // This will be replaced with actual SVG imports once logos are added
    // import ChatGPTLogo from '@/assets/ai-engines/chatgpt.svg';
    // import ClaudeLogo from '@/assets/ai-engines/claude.svg';
    // etc.
    
    return (
      <span className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        {fallbackIcons[engine]}
      </span>
    );
  } catch {
    return (
      <span className={`inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        {fallbackIcons[engine]}
      </span>
    );
  }
}