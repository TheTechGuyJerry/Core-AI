import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface MessageProps {
  role: 'user' | 'model';
  content: string;
}

export function Message({ role, content }: MessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full gap-4 p-6",
        isUser ? "bg-[var(--bg-main)]" : "bg-[var(--bg-secondary)] border-y border-[var(--border-color)]"
      )}
    >
      <div className="flex-shrink-0">
        <div 
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            isUser ? "bg-neutral-800 text-white" : "text-white"
          )}
          style={{ backgroundColor: !isUser ? 'var(--primary)' : undefined }}
        >
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            {isUser ? "You" : "Core AI"}
          </span>
          {!isUser && (
            <button
              onClick={copyToClipboard}
              className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--primary-glow)] hover:text-[var(--primary)] transition-colors"
              title="Copy response"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
          )}
        </div>
        
        <div className="prose prose-sm md:prose-base">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
