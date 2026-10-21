export const DEFAULT_WHATSAPP_NUMBER = '5531989668814';
export const DISPLAY_PHONE = '+55 (31) 98966-8814';
export const BROKER_EMAIL = 'tft.corretorimobiliario@gmail.com';
export const INSTAGRAM_URL = 'https://www.instagram.com/tftcorretorimobiliario';
export const OFFICIAL_LOGO_URL = 'https://i.postimg.cc/DzTYyHj7/Logo-TFT-Corretor-Imobiliario-em-Verde.png';
export const LOCAL_LOGO_URL = '/assets/logo-tft-verde.png';
export const WATERMARK_LOGO_URL = 'https://i.postimg.cc/DzTYyHj7/Logo-TFT-Corretor-Imobiliario-em-Verde.png';

export type WhatsAppContext = 
  | 'compra'
  | 'venda'
  | 'locacao'
  | 'imovel'
  | 'agendamento'
  | 'financiamento'
  | 'anuncio'
  | 'geral';

export function getWhatsAppUrl(context: WhatsAppContext, extra?: { propertyTitle?: string; date?: string; customText?: string }): string {
  let message = 'Olá, Thiago! Gostaria de conversar sobre oportunidades imobiliárias.';

  switch (context) {
    case 'compra':
      message = 'Olá, Thiago! Acessei seu site e gostaria de ajuda para encontrar um imóvel para comprar.';
      break;
    case 'venda':
      message = 'Olá, Thiago! Gostaria de conversar sobre a venda do meu imóvel.';
      break;
    case 'locacao':
      message = 'Olá, Thiago! Gostaria de conhecer as opções de imóveis para alugar.';
      break;
    case 'imovel':
      if (extra?.propertyTitle) {
        message = `Olá, Thiago! Tenho interesse no imóvel "${extra.propertyTitle}". Poderia me passar mais informações?`;
      } else {
        message = 'Olá, Thiago! Tenho interesse em um imóvel do seu catálogo e gostaria de mais informações.';
      }
      break;
    case 'agendamento':
      if (extra?.propertyTitle) {
        message = `Olá, Thiago! Gostaria de agendar uma visita ao imóvel "${extra.propertyTitle}".`;
      } else {
        message = 'Olá, Thiago! Gostaria de agendar uma visita a um imóvel.';
      }
      break;
    case 'financiamento':
      message = 'Olá, Thiago! Gostaria de conversar sobre as possibilidades de financiamento imobiliário.';
      break;
    case 'anuncio':
      message = 'Olá, Thiago! Gostaria de anunciar meu imóvel para intermediação e divulgação profissional.';
      break;
    case 'geral':
    default:
      if (extra?.customText) {
        message = extra.customText;
      }
      break;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encoded}`;
}
