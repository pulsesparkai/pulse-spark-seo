# AI Engine Logos

Place SVG logo files here with these exact names:

- `chatgpt.svg` - ChatGPT logo (24x24px recommended)
- `claude.svg` - Claude logo (24x24px recommended)  
- `perplexity.svg` - Perplexity logo (24x24px recommended)
- `gemini.svg` - Google Gemini logo (24x24px recommended)
- `deepseek.svg` - DeepSeek logo (24x24px recommended)

## Usage

Once you add the SVG files, update `src/components/shared/AIEngineIcon.tsx` to import and use them:

```tsx
import ChatGPTLogo from '@/assets/ai-engines/chatgpt.svg';
import ClaudeLogo from '@/assets/ai-engines/claude.svg';
// etc.
```

The component will automatically use SVGs when available, falling back to emoji placeholders.

## Components using AI engine icons:
- `src/components/dashboard/AIEngineVisibility.tsx` 
- `src/components/dashboard/CompetitiveIntelligence.tsx`
- `src/pages/AOECanvas.tsx`
- `src/components/dashboard/CitationFeed.tsx`
- `src/components/site-audit/AEOIssuesSection.tsx`