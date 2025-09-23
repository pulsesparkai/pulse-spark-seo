import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Sparkles, X, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickQuestions = [
  {
    question: "What should I optimize first?",
    answer: "Based on your site analysis, here are your top priorities:\n\n1. **Add Schema Markup** (147 product pages) - High impact, easy fix\n2. **Fix Missing H1 Tags** (23 pages) - Critical for SEO\n3. **Optimize Thin Content** (45 pages) - Improve user engagement\n\nStarting with schema markup could improve your rich snippet visibility by ~15%.",
    suggestions: ["Show me schema examples", "How to add H1 tags", "Content optimization tips"]
  },
  {
    question: "Why is my score low?",
    answer: "Your current SEO score of 72/100 is affected by:\n\n**Major Issues:**\n• Missing structured data (-15 points)\n• Poor internal linking (-8 points)\n• Slow page speed on mobile (-5 points)\n\n**Quick Wins:**\n• Add FAQ schema to 15 pages (+6 points)\n• Optimize images with alt text (+4 points)\n• Fix duplicate meta descriptions (+3 points)",
    suggestions: ["Fix structured data", "Improve page speed", "Optimize internal links"]
  },
  {
    question: "How to beat competitor?",
    answer: "Competitor analysis shows you're behind in:\n\n**Content Gaps:**\n• They have 23% more comprehensive guides\n• Missing comparison pages (high-value keywords)\n• Weak FAQ sections\n\n**Technical Advantages:**\n• Better Core Web Vitals (0.3s faster LCP)\n• More complete schema markup\n• Superior internal linking structure\n\n**Your Opportunities:**\n• Target their weak long-tail keywords\n• Create better product comparison content\n• Improve local SEO presence",
    suggestions: ["Show keyword gaps", "Create comparison pages", "Local SEO strategy"]
  }
];

export function AIAssistantModal({ isOpen, onClose }: AIAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when modal opens
      setMessages([{
        id: Date.now().toString(),
        content: "Hi! I'm your SEO AI assistant. I can help you understand your site's performance and suggest optimizations. Try asking one of the questions below, or ask me anything!",
        isUser: false,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length]);

  const handleQuickQuestion = (question: string) => {
    const quickQ = quickQuestions.find(q => q.question === question);
    if (!quickQ) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: question,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: quickQ.answer,
        isUser: false,
        timestamp: new Date(),
        suggestions: quickQ.suggestions,
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I can help you with that! Let me analyze your current SEO performance and provide specific recommendations based on your site's data.",
        "That's a great question! Based on your recent crawl data, I can see several opportunities for improvement. Let me break this down for you.",
        "Let me check your latest SEO metrics and competitor analysis to give you the most accurate advice.",
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date(),
        suggestions: ["Run full site audit", "Check competitor gaps", "Optimize for mobile"],
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="font-semibold text-lg">AI SEO Assistant</h2>
            <Badge variant="secondary" className="text-xs">Online</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.suggestions.map((suggestion, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-accent"
                          onClick={() => handleQuickQuestion(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground p-3 rounded-lg max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-xs">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {messages.length === 1 && (
          <div className="p-4 border-t border-border">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">Quick questions to get started:</p>
              <div className="grid gap-2">
                {quickQuestions.map((q, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto p-3"
                    onClick={() => handleQuickQuestion(q.question)}
                  >
                    <div className="flex items-center gap-2">
                      {index === 0 && <TrendingUp className="h-4 w-4 text-muted-foreground" />}
                      {index === 1 && <AlertTriangle className="h-4 w-4 text-muted-foreground" />}
                      {index === 2 && <Users className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-sm">{q.question}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 p-4 border-t border-border">
          <Input
            placeholder="Ask me anything about your SEO..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}