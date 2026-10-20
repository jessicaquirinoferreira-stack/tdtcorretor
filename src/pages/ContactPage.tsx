import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Instagram, MapPin, Send, CheckCircle2, Shield, Clock } from 'lucide-react';
import { BROKER_EMAIL, DISPLAY_PHONE, INSTAGRAM_URL, getWhatsAppUrl } from '../utils/whatsapp';
import { saveLead } from '../lib/storage';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Dúvida sobre imóvel');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    saveLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      type: 'geral',
      preferredContact: 'whatsapp',
      message: `[Assunto: ${subject}] ${message}`,
    });

    setSubmitted(true);
  };

  const handleWhatsAppRedirect = () => {
    const text = `Olá, Thiago! Meu nome é ${name}. Entrei em contato pelo formulário do seu site a respeito de: "${subject}". Mensagem: ${message}`;
    const url = getWhatsAppUrl('geral', { customText: text });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
          19 · Atendimento & Contato
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2B20] font-editorial leading-tight">
          Vamos Conversar?
        </h1>
        <p className="text-base text-gray-600 leading-relaxed font-light">
          Seja para comprar, vender, alugar ou esclarecer dúvidas sobre financiamento e documentação, estou à disposição para oferecer um atendimento próximo e personalizado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Contact Info & Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0B2B20] text-white p-8 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-2xl font-bold font-editorial text-white">
              Canais Oficiais
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              Atendimento ágil pelo WhatsApp durante o horário comercial e finais de semana para visitas previamente agendadas.
            </p>

            <div className="space-y-4 text-sm pt-2">
              <a
                href={getWhatsAppUrl('geral')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0F3528] hover:bg-[#154636] transition"
              >
                <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">WhatsApp Comercial</span>
                  <span className="font-semibold text-white">{DISPLAY_PHONE}</span>
                </div>
              </a>

              <a
                href={`mailto:${BROKER_EMAIL}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0F3528] hover:bg-[#154636] transition"
              >
                <div className="w-9 h-9 rounded-full bg-[#C8A251] text-[#0B2B20] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">E-mail Direto</span>
                  <span className="font-semibold text-white text-xs truncate block">{BROKER_EMAIL}</span>
                </div>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0F3528] hover:bg-[#154636] transition"
              >
                <div className="w-9 h-9 rounded-full bg-pink-600 text-white flex items-center justify-center shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Instagram</span>
                  <span className="font-semibold text-white">@tftcorretorimobiliario</span>
                </div>
              </a>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0F3528]">
                <div className="w-9 h-9 rounded-full bg-[#1A4535] text-[#C8A251] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Região de Atendimento</span>
                  <span className="text-xs text-gray-200">Coronel Fabriciano, Vale do Aço e cidades vizinhas de Minas Gerais.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-8 lg:p-10 shadow-lg">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-bold text-[#0B2B20] font-editorial">
                Mensagem Enviada!
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Obrigado, <span className="font-semibold">{name}</span>. Entrarei em contato pelo número informado para prosseguirmos com seu atendimento.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition shadow"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Agilizar no WhatsApp Agora</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-[#0B2B20] font-editorial border-b border-gray-100 pb-3">
                Envie uma Mensagem Direta
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(31) 99999-9999"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Assunto Principal
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-[#0B2B20]"
                  >
                    <option value="Quero Comprar um Imóvel">Quero Comprar um Imóvel</option>
                    <option value="Quero Vender meu Imóvel">Quero Vender meu Imóvel</option>
                    <option value="Quero Alugar um Imóvel">Quero Alugar um Imóvel</option>
                    <option value="Dúvida sobre Financiamento">Dúvida sobre Financiamento</option>
                    <option value="Agendamento de Visita">Agendamento de Visita</option>
                    <option value="Outro assunto">Outro assunto</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Mensagem Detalhada
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Conte o que você procura ou como podemos ajudar você..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0B2B20] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Seus dados não são compartilhados com terceiros.</span>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-md transition shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Mensagem</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
