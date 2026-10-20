import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  MessageCircle,
  Instagram,
  User,
  ChevronDown,
  Building2,
  KeyRound,
  Calculator,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { OFFICIAL_LOGO_URL, BROKER_EMAIL, DISPLAY_PHONE, INSTAGRAM_URL, getWhatsAppUrl } from '../utils/whatsapp';
import aiAvatarImage from '../assets/images/ai_assistant_avatar_1792539248157.jpg';

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  action?: {
    type: 'whatsapp' | 'instagram' | 'catalog' | 'financing';
    label: string;
    url?: string;
  };
  time: string;
}

export const VirtualAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Olá! Sou a consultora virtual de inteligência artificial da TFT Corretor Imobiliário. Posso te orientar sobre imóveis disponíveis, venda, locação, simuladores de financiamento e agendamento com Thiago Teixeira. Como posso te ajudar?',
      time: 'Agora',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping]);

  const quickQuestions = [
    'Quais imóveis estão disponíveis?',
    'Como funciona para vender meu imóvel?',
    'Como simular financiamento habitacional?',
    'Quais as etapas para comprar um imóvel?',
    'Quero falar direto com o Thiago Teixeira',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Formulate knowledge-based response
    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = '';
      let action: Message['action'] = {
        type: 'whatsapp',
        label: 'Conversar com Thiago no WhatsApp',
        url: getWhatsAppUrl('geral'),
      };

      if (q.includes('disponív') || q.includes('imóve') || q.includes('imove') || q.includes('catálogo') || q.includes('sítio') || q.includes('casa')) {
        reply = 'Temos excelentes opções cadastradas, incluindo o Sítio de 1.800 m² (ampla área verde e refúgio natural) e a Casa Geminada Duplex no Bairro Giovani em Coronel Fabriciano (3 quartos, 1 suíte e garagem). Posso te passar os detalhes completos e agendar uma visita!';
        action = {
          type: 'whatsapp',
          label: 'Consultar Imóveis no WhatsApp',
          url: getWhatsAppUrl('compra'),
        };
      } else if (q.includes('vender') || q.includes('anunciar') || q.includes('capta') || q.includes('proprietário')) {
        reply = 'Para vender com a TFT, fazemos um levantamento completo das características do seu imóvel, avaliação de referências reais de mercado, fotografia qualificada e divulgação estratégica sem desvalorizar seu patrimônio.';
        action = {
          type: 'whatsapp',
          label: 'Avaliar e Anunciar no WhatsApp',
          url: getWhatsAppUrl('venda'),
        };
      } else if (q.includes('financia') || q.includes('banco') || q.includes('parcela') || q.includes('caixa') || q.includes('juros')) {
        reply = 'Trabalhamos com apoio a simulações nas principais instituições oficiais: Caixa Econômica, Itaú, Santander, Banco do Brasil, Bradesco e Banrisul. Temos também um simulador no site para você estimar parcelas nas tabelas Price e SAC!';
        action = {
          type: 'whatsapp',
          label: 'Tirar Dúvidas sobre Financiamento',
          url: getWhatsAppUrl('financiamento'),
        };
      } else if (q.includes('aluga') || q.includes('locaç') || q.includes('locac') || q.includes('inquilino')) {
        reply = 'Na locação, organizamos todo o encontro entre proprietário e locatário com vistoria descritiva, clareza sobre garantias e acompanhamento até a entrega das chaves.';
        action = {
          type: 'whatsapp',
          label: 'Falar sobre Locação no WhatsApp',
          url: getWhatsAppUrl('locacao'),
        };
      } else if (q.includes('thiago') || q.includes('corretor') || q.includes('telefone') || q.includes('contato')) {
        reply = `O corretor responsável é Thiago Teixeira. Você pode falar diretamente pelo WhatsApp (${DISPLAY_PHONE}) ou acompanhar nosso trabalho pelo Instagram oficial!`;
        action = {
          type: 'whatsapp',
          label: 'Falar com Thiago no WhatsApp',
          url: getWhatsAppUrl('geral'),
        };
      } else if (q.includes('instagram') || q.includes('rede') || q.includes('foto')) {
        reply = 'Você pode acompanhar fotos exclusivas dos imóveis, bastidores de visitas e dicas imobiliárias diretamente no nosso Instagram @tftcorretorimobiliario!';
        action = {
          type: 'instagram',
          label: 'Abrir Instagram @tftcorretorimobiliario',
          url: INSTAGRAM_URL,
        };
      } else {
        reply = 'Cada negociação imobiliária envolve planos e decisões importantes. Nosso compromisso é com informação clara e confiança. O Thiago Teixeira está à disposição para tirar todas as suas dúvidas diretamente!';
        action = {
          type: 'whatsapp',
          label: 'Chamar Thiago no WhatsApp',
          url: getWhatsAppUrl('geral'),
        };
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        action,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Button on the Left Side with Human AI Avatar */}
      <div className="fixed bottom-6 left-6 z-40">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-[#0B2B20] text-white p-1.5 sm:pr-4 rounded-full shadow-2xl hover:bg-[#134636] border-2 border-[#C8A251] transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#C8A251]/30"
            aria-label="Abrir assistente virtual humana de IA"
          >
            {/* Human AI Avatar */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/80 shadow-md shrink-0 bg-[#071C15]">
              <img
                src={aiAvatarImage}
                alt="Assistente Virtual IA"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0B2B20]" />
            </div>

            {/* Label only on sm+ screens */}
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">
                  Assistente IA
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#C8A251]" />
              </div>
              <span className="text-[10px] text-gray-300">
                Tire suas dúvidas agora
              </span>
            </div>

            {/* Notification badge */}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8A251] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#C8A251] text-[9px] text-[#0B2B20] font-bold items-center justify-center">
                  1
                </span>
              </span>
            )}
          </button>
        ) : null}
      </div>

      {/* Floating Chat Window Modal on the Left */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[92vw] sm:w-[380px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#0B2B20] text-white px-5 py-4 flex items-center justify-between border-b border-[#1A4535]">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#C8A251] shrink-0 bg-[#071C15] shadow">
                <img
                  src={aiAvatarImage}
                  alt="Assistente Virtual IA"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0B2B20]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold font-editorial">Consultora Virtual IA</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#C8A251]/20 text-[#C8A251] font-semibold">Online</span>
                </div>
                <p className="text-[10px] text-gray-300">TFT Corretor Imobiliário · Atendimento</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              aria-label="Minimizar assistente"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Contact Bar in Header */}
          <div className="bg-[#071C15] px-4 py-2 flex items-center justify-between text-[11px] text-gray-300 border-b border-gray-800">
            <span>Canais Oficiais:</span>
            <div className="flex items-center gap-3">
              <a
                href={getWhatsAppUrl('geral')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#25D366] hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>
              <span className="text-gray-600">·</span>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-pink-400 hover:underline"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9FAF8] text-xs max-h-[380px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#C8A251] shrink-0 mt-0.5 shadow-xs">
                    <img
                      src={aiAvatarImage}
                      alt="Avatar IA"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 leading-relaxed shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-[#0B2B20] text-white rounded-br-xs'
                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-xs'
                    }`}
                  >
                    <p>{m.text}</p>

                    {/* Contextual Action Button to WhatsApp / Instagram */}
                    {m.action && (
                      <div className="mt-3 pt-2.5 border-t border-gray-100 flex flex-col gap-1.5">
                        <a
                          href={m.action.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-bold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-lg transition shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>{m.action.label}</span>
                        </a>

                        <a
                          href={INSTAGRAM_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                          <Instagram className="w-3 h-3 text-pink-600" />
                          <span>Ver no Instagram @tftcorretorimobiliario</span>
                        </a>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 px-1">{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-[#C8A251] shrink-0">
                  <img
                    src={aiAvatarImage}
                    alt="Avatar IA"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A251] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A251] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A251] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Chips */}
          <div className="p-2.5 bg-gray-50 border-t border-gray-200/80 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 text-[10px] font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-[#0B2B20] hover:text-white hover:border-[#0B2B20] transition shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B2B20] focus:border-transparent"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 bg-[#0B2B20] text-white rounded-lg hover:bg-[#134636] disabled:opacity-40 transition"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
