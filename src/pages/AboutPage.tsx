import React from 'react';
import { ShieldCheck, MessageCircle, Mail, Phone, Instagram, CheckCircle2, HeartHandshake, Compass } from 'lucide-react';
import { OFFICIAL_LOGO_URL, BROKER_EMAIL, DISPLAY_PHONE, INSTAGRAM_URL, getWhatsAppUrl } from '../utils/whatsapp';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Visual Box */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl bg-white">
            <img
              src="https://i.postimg.cc/jjjGKzwv/Whats-App-Image-2026-10-20-at-18-16-56.jpg"
              alt="Thiago Teixeira - TFT Corretor Imobiliário"
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="p-6 bg-[#0B2B20] text-white space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#C8A251] bg-black shrink-0">
                  <img
                    src={OFFICIAL_LOGO_URL}
                    alt="Logo TFT"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-editorial">
                    Thiago Teixeira
                  </h3>
                  <p className="text-xs text-[#C8A251] uppercase tracking-wider">
                    TFT Corretor Imobiliário
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-300 italic pt-1">
                “Seu sonho, meu compromisso.”
              </p>
            </div>
          </div>
        </div>

        {/* Text Presentation */}
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
            01 · Perfil Profissional
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B2B20] font-editorial leading-tight">
            Negócios imobiliários com clareza, presença e confiança.
          </h1>

          <div className="space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed font-light">
            <p>
              Sou <strong>Thiago Teixeira</strong>, corretor de imóveis. Meu trabalho é transformar um processo que pode parecer complexo em uma jornada mais organizada, objetiva e segura.
            </p>
            <p>
              Antes de falar de metragem, preço ou contrato, procuro entender o que realmente importa para cada cliente: <em>prazo, objetivo, orçamento, localização e prioridades</em>.
            </p>
            <blockquote className="p-4 bg-gray-50 border-l-2 border-[#C8A251] italic text-[#0B2B20] text-sm font-editorial">
              “Um bom negócio começa com informação clara e termina com confiança.”
            </blockquote>
            <p>
              Com atuação dedicada no estado de Minas Gerais — atendendo Coronel Fabriciano, Vale do Aço e regiões vizinhas —, dedico-me a acompanhar cada etapa da negociação com responsabilidade, ética e disponibilidade genuína.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={getWhatsAppUrl('geral')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-md transition shadow"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Falar Diretamente com Thiago</span>
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider font-semibold text-[#0B2B20] bg-gray-100 hover:bg-gray-200 rounded-md transition"
            >
              <Instagram className="w-4 h-4" />
              <span>Acompanhar no Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* 6 Core Commitments from PDF Page 19 */}
      <div className="bg-[#0B2B20] text-white rounded-2xl p-8 lg:p-14 shadow-xl space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
            18 · Relação Profissional
          </span>
          <h2 className="text-3xl font-bold font-editorial">
            O negócio termina. A confiança deve permanecer.
          </h2>
          <p className="text-sm text-gray-300 font-light">
            Meu compromisso é oferecer uma experiência profissional do primeiro contato à conclusão, tratando cada negociação com atenção e respeito.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              letter: 'E',
              title: 'Ética',
              desc: 'Postura responsável e respeito irrestrito a todas as partes envolvidas.',
            },
            {
              letter: 'T',
              title: 'Transparência',
              desc: 'Informações claras e sem omissões para que o cliente possa decidir com plena segurança.',
            },
            {
              letter: 'O',
              title: 'Organização',
              desc: 'Controle das etapas, conferência de documentos e encaminhamentos comerciais organizados.',
            },
            {
              letter: 'C',
              title: 'Comunicação',
              desc: 'Atualizações periódicas e explicações em linguagem simples, objetiva e acessível.',
            },
            {
              letter: 'R',
              title: 'Respeito',
              desc: 'Sem pressão comercial desnecessária em decisões que envolvem o patrimônio e o futuro da família.',
            },
            {
              letter: 'A',
              title: 'Acompanhamento',
              desc: 'Presença ativa até a formalização do contrato, registro e entrega definitiva das chaves.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-[#0F3528] border border-[#1A4535] space-y-2"
            >
              <div className="w-8 h-8 rounded-full bg-[#1A4535] text-[#C8A251] font-bold text-sm flex items-center justify-center">
                {item.letter}
              </div>
              <h3 className="text-base font-bold text-white font-editorial">
                {item.title}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#1A4535] text-center">
          <p className="text-sm text-[#C8A251] italic font-editorial">
            “Mais do que intermediar imóveis, meu objetivo é construir relações de confiança.”
          </p>
        </div>
      </div>

      {/* Direct Contact Channels */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-[#0B2B20] font-editorial mb-6">
          Canais de Atendimento Oficial
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
            <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs text-gray-500 uppercase block">WhatsApp / Celular</span>
              <span className="font-semibold text-gray-800">{DISPLAY_PHONE}</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#C8A251] shrink-0" />
            <div>
              <span className="text-xs text-gray-500 uppercase block">E-mail Comercial</span>
              <span className="font-semibold text-gray-800 text-xs sm:text-sm break-all">{BROKER_EMAIL}</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
            <Instagram className="w-5 h-5 text-pink-600 shrink-0" />
            <div>
              <span className="text-xs text-gray-500 uppercase block">Instagram Oficial</span>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-800 hover:text-[#C8A251]">
                @tftcorretorimobiliario
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
