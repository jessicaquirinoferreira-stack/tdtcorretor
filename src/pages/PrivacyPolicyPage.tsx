import React from 'react';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { BROKER_EMAIL, DISPLAY_PHONE } from '../utils/whatsapp';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="border-b border-gray-200 pb-6 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A251] block">
          Documento Institucional
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0B2B20] font-editorial">
          Política de Privacidade e Proteção de Dados (LGPD)
        </h1>
        <p className="text-xs text-gray-500">
          Última atualização: Outubro de 2026 · TFT Corretor Imobiliário
        </p>
      </div>

      <div className="prose prose-sm text-gray-700 space-y-6 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
            1. Compromisso com a Privacidade
          </h2>
          <p>
            A <strong>TFT Corretor Imobiliário</strong>, representada pelo corretor Thiago Teixeira, preza pelo respeito, confidencialidade e segurança dos dados pessoais fornecidos por visitantes, clientes compradores, vendedores e locatários. Esta política esclarece de forma transparente como os dados são coletados, utilizados e protegidos, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
            2. Dados Coletados e Finalidade
          </h2>
          <p>
            Coletamos exclusivamente as informações necessárias para viabilizar o atendimento imobiliário e a prestação de serviços consultivos:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>Nome completo e telefone / WhatsApp:</strong> para identificação, retorno de contato, agendamento de visitas e envio de propostas.</li>
            <li><strong>E-mail:</strong> para formalização de informações, envio de fichas descritivas de imóveis e comunicados do processo de intermediação.</li>
            <li><strong>Dados do imóvel (quando anunciado pelo proprietário):</strong> endereço, metragem, características construtivas e valor pretendido, com o fim estrito de elaboração do anúncio e estratégia de mercado.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
            3. Não Compartilhamento com Terceiros Não Autorizados
          </h2>
          <p>
            A TFT Corretor Imobiliário não vende, não aluga e não compartilha bancos de dados com empresas de telemarketing ou terceiros não autorizados. Os dados poderão ser compartilhados unicamente com:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Instituições bancárias ou agentes de crédito, <em>apenas quando expressamente solicitado pelo cliente</em> para fins de simulação e análise de financiamento.</li>
            <li>Cartórios e tabelionatos, estritamente para a emissão de certidões, minutas de escrituras e registros de imóveis negociados.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#0B2B20] font-editorial">
            4. Seus Direitos como Titular
          </h2>
          <p>
            Conforme a LGPD, você possui o direito de solicitar a qualquer momento a confirmação da existência de tratamento, acesso aos seus dados, correção de dados incompletos ou a exclusão definitiva do seu cadastro de nossos registros de atendimento.
          </p>
          <p>
            Para exercer seus direitos, basta entrar em contato pelo e-mail <strong>{BROKER_EMAIL}</strong> ou pelo WhatsApp <strong>{DISPLAY_PHONE}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
