import React, { useState } from 'react';
import { X, CheckCircle, MessageCircle, Calendar, Send, Shield } from 'lucide-react';
import { Property } from '../types';
import { saveLead } from '../lib/storage';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property;
  type?: 'visita' | 'compra' | 'venda' | 'locacao' | 'financiamento' | 'geral';
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  property,
  type = 'visita',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    saveLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      type,
      propertyId: property?.id,
      propertyTitle: property?.title,
      message: `${preferredDate ? `[Data/Horário Sugerido: ${preferredDate}] ` : ''}${message}`,
      preferredContact: 'whatsapp',
    });

    setSubmitted(true);
  };

  const handleWhatsAppRedirect = () => {
    const text = property
      ? `Olá, Thiago! Meu nome é ${name}. Gostaria de informações/agendar visita ao imóvel "${property.title}". ${preferredDate ? `Disponibilidade sugerida: ${preferredDate}.` : ''}`
      : `Olá, Thiago! Meu nome é ${name}. Entrei em contato pelo formulário do seu site.`;
    const url = getWhatsAppUrl('geral', { customText: text });
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0B2B20] text-white px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-editorial">
              {type === 'visita' ? 'Agendar Visita ao Imóvel' : 'Solicitar Atendimento Exclusivo'}
            </h3>
            {property && (
              <p className="text-xs text-[#C8A251] line-clamp-1 mt-0.5">
                {property.title}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-300 hover:text-white rounded-md transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#0B2B20] font-editorial">
                Solicitação Recebida com Sucesso!
              </h4>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Obrigado, <span className="font-semibold">{name}</span>. Entrarei em contato para confirmar todos os detalhes do seu atendimento.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-lg transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Agilizar pelo WhatsApp Agora</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg transition-colors"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo Silveira"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B2B20] focus:border-transparent transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B2B20] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B2B20] focus:border-transparent transition"
                  />
                </div>
              </div>

              {type === 'visita' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C8A251]" />
                    <span>Melhor dia / horário para visita</span>
                  </label>
                  <input
                    type="text"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    placeholder="Ex: Próximo sábado pela manhã"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B2B20] focus:border-transparent transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Mensagem ou Dúvida (opcional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Conte o que gostaria de saber ou detalhes sobre suas preferências..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0B2B20] focus:border-transparent transition resize-none"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Seus dados são protegidos conforme a LGPD e usados exclusivamente para este contato.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#0B2B20] hover:bg-[#134636] rounded-lg transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Solicitação</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
