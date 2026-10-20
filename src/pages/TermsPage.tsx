import React from 'react';
import { BROKER_EMAIL, DISPLAY_PHONE } from '../utils/whatsapp';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="border-b border-gray-200 pb-6 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
          Documento Institucional
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2B20] font-editorial">
          Termos de Uso do Site
        </h1>
        <p className="text-xs text-gray-500">
          Última atualização: Outubro de 2026 · TFT Corretor Imobiliário
        </p>
      </div>

      <div className="prose prose-sm text-gray-700 space-y-6 leading-relaxed text-xs sm:text-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
            1. Objeto e Aceitação
          </h2>
          <p>
            Ao navegar no site oficial da <strong>TFT Corretor Imobiliário</strong>, o visitante concorda expressamente com os presentes Termos de Uso. O site tem por objetivo apresentar imóveis disponíveis para compra, venda e locação, divulgar conteúdos institucionais e viabilizar o contato inicial entre interessados e o corretor Thiago Teixeira.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
            2. Informações e Disponibilidade dos Imóveis
          </h2>
          <p>
            As informações sobre valores, metragens, taxas condominiais, IPTU e disponibilidade dos imóveis anunciados são fornecidas pelos proprietários ou obtidas em levantamentos preliminares e estão sujeitas a confirmação documental e alteração a qualquer momento sem aviso prévio. A negociação e aquisição só se tornam vinculantes após a formalização dos respectivos instrumentos contratuais assinados pelas partes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
            3. Simuladores Financeiros e Links Externos
          </h2>
          <p>
            Os simuladores e links externos que remetem a instituições bancárias (como Santander, Itaú, Caixa, Banco do Brasil, Banrisul, Bradesco) são disponibilizados em caráter puramente informativo e facilitador. A TFT Corretor Imobiliário não se responsabiliza por termos de concessão de crédito, taxas vigentes, análises cadastrais ou políticas de terceiros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
            4. Propriedade Intelectual
          </h2>
          <p>
            A marca TFT Corretor Imobiliário, textos institucionais, elementos visuais e fotografias originais são de uso exclusivo e protegidos pela legislação de direitos autorais e propriedade intelectual. É vedada a reprodução comercial sem expressa anuência.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
            5. Contato e Esclarecimentos
          </h2>
          <p>
            Em caso de dúvidas referentes a estes termos, entre em contato através do e-mail <strong>{BROKER_EMAIL}</strong> ou pelo WhatsApp <strong>{DISPLAY_PHONE}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
