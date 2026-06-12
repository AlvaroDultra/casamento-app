/**
 * ============================================================
 *  PERSONALIZAÇÃO DO CASAMENTO
 * ============================================================
 *  Este é o ÚNICO arquivo que você precisa editar para cada
 *  casamento novo. Troque os textos, as cores e as imagens
 *  em /public e está pronto.
 *
 *  As cores são aplicadas automaticamente como tema (CSS
 *  variables) em toda a aplicação.
 * ============================================================
 */

export const wedding = {
  /** Nome do casal, ex: "Ana & João" */
  coupleNames: "Ana & João",

  /** Data do casamento (ISO: AAAA-MM-DD) */
  weddingDate: "2026-08-15",

  /** Hashtag oficial mostrada no app */
  hashtag: "#AnaeJoao2026",

  /** Mensagem de boas-vindas na tela de entrada */
  welcomeMessage: "Compartilhe aqui suas fotos e vídeos do nosso grande dia 💛",

  /** Frase curta abaixo do título no login/registro */
  tagline: "A nossa festa pelos olhos de quem a viveu",

  /**
   * Imagens (coloque os arquivos na pasta /public)
   *  - logo:  ícone/monograma do casal (quadrado, ex: 200x200)
   *  - hero:  foto de capa grande da tela de entrada
   */
  logo: "/logo.svg",
  hero: "/hero.jpg",

  /** Tema de cores — use HEX */
  theme: {
    primary: "#b08d57",      // cor principal (botões, destaques)
    primaryDark: "#8a6d40",  // variação escura (hover)
    accent: "#f7f1e8",       // fundo suave / cartões
  },

  /** Fontes (Google Fonts já carregadas no layout) */
  fontDisplay: "'Cormorant Garamond', Georgia, serif", // nomes e títulos
  fontBody: "'Inter', system-ui, sans-serif",          // textos e interface
} as const;

export type WeddingConfig = typeof wedding;
