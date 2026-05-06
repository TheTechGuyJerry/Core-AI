import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, ArrowDown, Sparkles, Bot, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message as MessageComponent } from './Message';
import { chatStream, Message } from '../lib/gemini';
import { cn } from '../lib/utils';

type Theme = 'default' | 'midnight' | 'emerald' | 'violet' | 'crimson';

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>('default');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const assistantMessage: Message = { role: 'model', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      const stream = chatStream([...messages, userMessage]);
      let fullContent = '';

      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = fullContent;
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const themes: { id: Theme; name: string; color: string }[] = [
    { id: 'default', name: 'Modern', color: 'bg-blue-600' },
    { id: 'midnight', name: 'Midnight', color: 'bg-neutral-900' },
    { id: 'emerald', name: 'Emerald', color: 'bg-emerald-600' },
    { id: 'violet', name: 'Violet', color: 'bg-violet-600' },
    { id: 'crimson', name: 'Crimson', color: 'bg-rose-600' },
  ];

  return (
    <div className={cn(
      "flex h-screen flex-col bg-[var(--bg-main)] overflow-hidden transition-colors duration-300",
      theme !== 'default' && `theme-${theme}`
    )}>
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-main)] px-6 py-4 z-20">
        <div className="flex items-center gap-3">
          <div 
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg shadow-[var(--primary-glow)]"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[var(--text-main)]">Core AI</h1>
            <p className="text-xs text-[var(--text-muted)] font-medium tracking-wide">POWERED BY GEMINI</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary)] transition-all"
              title="Change theme"
            >
              <Palette size={20} />
            </button>
            
            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] p-2 shadow-xl z-50 shadow-black/10"
                >
                  <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Select Theme</p>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)] transition-all",
                        theme === t.id && "bg-[var(--bg-secondary)] font-semibold"
                      )}
                    >
                      <div className={cn("h-4 w-4 rounded-full", t.color)} />
                      {t.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button
            onClick={clearChat}
            className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-red-500 transition-all"
            title="Clear chat"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--bg-secondary)]"
              style={{ color: 'var(--primary)' }}
            >
              <Sparkles size={40} />
            </motion.div>
            <h2 className="mb-2 text-2xl font-bold text-[var(--text-main)]">How can I help you today?</h2>
            <p className="max-w-md text-[var(--text-muted)]">
              I am Core AI, an assistant designed to help you with anything.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Write a Python script for automation",
                "Explain how transformers work in AI",
                "Draft a polite resignation letter",
                "Suggest 5 healthy breakfast ideas"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="rounded-xl border border-[var(--border-color)] p-4 text-left text-sm text-[var(--text-muted)] hover:border-[var(--primary)] hover:bg-[var(--bg-secondary)] transition-all active:scale-[0.98]"
                  style={{ color: 'var(--text-main)' }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl pb-32">
            {messages.map((message, index) => (
              <MessageComponent key={index} {...message} role={message.role} />
            ))}
            {isLoading && messages[messages.length - 1].content === '' && (
                <div className="flex gap-4 p-6 bg-[var(--bg-secondary)] border-y border-[var(--border-color)]">
                    <div 
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white animate-pulse"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                        <Bot size={18} />
                    </div>
                    <div className="flex gap-1 py-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] animate-bounce"></div>
                    </div>
                </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="fixed bottom-32 right-8 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg hover:brightness-110 transition-all z-10"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <ArrowDown size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="mx-auto w-full max-w-4xl p-6">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] p-2 shadow-xl shadow-black/5 transition-all focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-glow)]"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 resize-none bg-transparent px-4 py-3 text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none min-h-[52px] max-h-48"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
              input.trim() && !isLoading
                ? "text-white hover:brightness-110"
                : "bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-not-allowed"
            )}
            style={{ backgroundColor: input.trim() && !isLoading ? 'var(--primary)' : undefined }}
          >
            <Send size={18} />
          </button>
        </form>
        <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">
          Core AI responses should be reviewed carefully.
        </p>
      </div>
    </div>
  );
}
