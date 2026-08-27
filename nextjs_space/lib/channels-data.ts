export interface Channel {
  id: string
  name: string
  number?: string
  category: 'abertos' | 'esportes' | 'filmes' | 'noticias' | 'infantil' | 'variedades'
  logo: string
  quality: '4K' | '1080p' | '720p'
  description: string
  currentProgram?: string
  servers: {
    name: string
    url: string
    type: 'embed' | 'hls' | 'iframe'
  }[]
  tags: string[]
  isFeatured?: boolean
}

export interface ChannelCategory {
  id: string
  label: string
  icon: string
}

export const CHANNEL_CATEGORIES: ChannelCategory[] = [
  { id: 'todos', label: 'Todos os Canais', icon: '📺' },
  { id: 'abertos', label: 'Canais Abertos', icon: '📡' },
  { id: 'esportes', label: 'Esportes', icon: '⚽' },
  { id: 'filmes', label: 'Filmes & Séries', icon: '🎬' },
  { id: 'noticias', label: 'Notícias', icon: '📰' },
  { id: 'infantil', label: 'Infantil', icon: '👶' },
  { id: 'variedades', label: 'Documentários & Variedades', icon: '🌍' },
]

export const CHANNELS_DATA: Channel[] = [
  // ==================== CANAIS ABERTOS ====================
  {
    id: 'globo-sp',
    name: 'TV Globo SP',
    number: '05',
    category: 'abertos',
    logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Principal emissora do Brasil com novelas, jornalismo, entretenimento e futebol ao vivo.',
    currentProgram: 'Programação Nacional & Futebol Ao Vivo',
    tags: ['Aberto', 'Novelas', 'Futebol', 'Jornalismo'],
    isFeatured: true,
    servers: [
      {
        name: 'Servidor 1 (Ultra HD)',
        url: 'https://megacanais.com/embed/globo-sp',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Stream BR)',
        url: 'https://superflixapi.sbs/tv/globo-sp',
        type: 'iframe',
      },
      {
        name: 'Servidor 3 (PlayerFlix)',
        url: 'https://playerflixapi.com/tv/globo',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'sbt',
    name: 'SBT',
    number: '04',
    category: 'abertos',
    logo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Sistema Brasileiro de Televisão: programas de auditório, novelas infantis, Champions League e variedades.',
    currentProgram: 'Programa do Silvio Santos & Variedades',
    tags: ['Aberto', 'Auditório', 'Desenhos', 'Champions'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/sbt',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/sbt',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'record-tv',
    name: 'Record TV',
    number: '07',
    category: 'abertos',
    logo: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Jornalismo factual, novelas bíblicas, realities como A Fazenda e Paulistão.',
    currentProgram: 'Jornal da Record & Entretenimento',
    tags: ['Aberto', 'Jornalismo', 'Reality', 'Paulistão'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/record',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/record',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'band',
    name: 'Band',
    number: '13',
    category: 'abertos',
    logo: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Rede Bandeirantes: Fórmula 1, Jogo Aberto, MasterChef Brasil e jornalismo dinâmico.',
    currentProgram: 'Fórmula 1 & Jogo Aberto',
    tags: ['Aberto', 'Fórmula 1', 'Futebol', 'Culinária'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/band',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/band',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'tv-cultura',
    name: 'TV Cultura',
    number: '02',
    category: 'abertos',
    logo: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Cultura, educação, Roda Viva, desenhos clássicos e transmissões esportivas e musicais.',
    currentProgram: 'Roda Viva & Cultura Clássica',
    tags: ['Aberto', 'Educativo', 'Debates', 'Infantil'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/tvcultura',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'redetv',
    name: 'RedeTV!',
    number: '09',
    category: 'abertos',
    logo: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&auto=format&fit=crop&q=80',
    quality: '720p',
    description: 'Entretenimento, esportes, NFL, SuperPop e programas ao vivo.',
    currentProgram: 'NFL & Entretenimento',
    tags: ['Aberto', 'NFL', 'Variedades'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/redetv',
        type: 'iframe',
      },
    ],
  },

  // ==================== ESPORTES ====================
  {
    id: 'sportv',
    name: 'SporTV HD',
    number: '39',
    category: 'esportes',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'O canal campeão do esporte: Brasileirão Série A e B, Copa do Brasil, Vôlei e Olimpíadas.',
    currentProgram: 'Brasileirão & Tá na Área',
    tags: ['Esporte', 'Futebol', 'Vôlei', 'Ao Vivo'],
    isFeatured: true,
    servers: [
      {
        name: 'Servidor 1 (1080p)',
        url: 'https://megacanais.com/embed/sportv',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/sportv',
        type: 'iframe',
      },
      {
        name: 'Servidor 3 (Multi-Stream)',
        url: 'https://playerflixapi.com/tv/sportv',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'sportv-2',
    name: 'SporTV 2 HD',
    number: '38',
    category: 'esportes',
    logo: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Transmissões esportivas simultâneas, automobilismo, basquete e atletismo.',
    currentProgram: 'NBB Basquete & Automobilismo',
    tags: ['Esporte', 'Basquete', 'Futebol'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/sportv2',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/sportv-2',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'sportv-3',
    name: 'SporTV 3 HD',
    number: '37',
    category: 'esportes',
    logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Esportes radicais, tênis mundial, surfe WSL e eventos internacionais ao vivo.',
    currentProgram: 'Tênis ATP / WTA & WSL Surfe',
    tags: ['Esporte', 'Tênis', 'Surfe'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/sportv3',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/sportv-3',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'premiere-clubes',
    name: 'Premiere Clubes',
    number: '60',
    category: 'esportes',
    logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=300&auto=format&fit=crop&q=80',
    quality: '4K',
    description: 'O melhor do futebol brasileiro: todos os jogos do Brasileirão Série A e Estaduais ao vivo.',
    currentProgram: 'Futebol Ao Vivo - Brasileirão Série A',
    tags: ['Futebol', 'Premiere', 'Brasileirão', 'Pay-Per-View'],
    isFeatured: true,
    servers: [
      {
        name: 'Servidor 1 (Ultra HD)',
        url: 'https://megacanais.com/embed/premiere-clubes',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/premiere-clubes',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'espn-brasil',
    name: 'ESPN Brasil',
    number: '70',
    category: 'esportes',
    logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Premier League, La Liga, Copa Libertadores, NFL, NBA e Linha de Passe.',
    currentProgram: 'Premier League & Linha de Passe',
    tags: ['Esporte', 'Premier League', 'Libertadores', 'NFL'],
    isFeatured: true,
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/espn-brasil',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/espn-brasil',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'espn-2',
    name: 'ESPN 2',
    number: '71',
    category: 'esportes',
    logo: 'https://images.unsplash.com/photo-1518604667503-4656107b4618?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Futebol europeu, NBA, tênis Grand Slam e SportsCenter.',
    currentProgram: 'NBA Ao Vivo & SportsCenter',
    tags: ['Esporte', 'NBA', 'Tênis', 'Europa'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/espn2',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'espn-4',
    name: 'ESPN 4 (Fox Sports)',
    number: '73',
    category: 'esportes',
    logo: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Libertadores, Sul-Americana, Moto GP e NHL.',
    currentProgram: 'Libertadores & Moto GP',
    tags: ['Esporte', 'Libertadores', 'MotoGP'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/espn4',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'bandsports',
    name: 'BandSports',
    number: '75',
    category: 'esportes',
    logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Tênis Roland Garros, automobilismo Stock Car, motocross e debates esportivos.',
    currentProgram: 'Stock Car & Roland Garros',
    tags: ['Esporte', 'Automobilismo', 'Tênis'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/bandsports',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'tnt-sports',
    name: 'TNT Sports',
    number: '77',
    category: 'esportes',
    logo: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Casa oficial da UEFA Champions League, Paulistão e Brasileirão.',
    currentProgram: 'UEFA Champions League Ao Vivo',
    tags: ['Esporte', 'Champions League', 'Paulistão'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/tnt',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'combate',
    name: 'Combate HD',
    number: '80',
    category: 'esportes',
    logo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'UFC ao vivo, Boxe internacional, Jiu-Jitsu e artes marciais 24 horas por dia.',
    currentProgram: 'UFC Fight Night & Especial Boxe',
    tags: ['Luta', 'UFC', 'Boxe', 'Jiu-Jitsu'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/combate',
        type: 'iframe',
      },
    ],
  },

  // ==================== FILMES & SÉRIES ====================
  {
    id: 'hbo',
    name: 'HBO HD',
    number: '100',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Séries exclusivas premiadas mundialmente, grandes lançamentos de cinema e produções originais HBO.',
    currentProgram: 'Séries Originais & Estreias de Cinema',
    tags: ['Cinema', 'HBO', 'Séries', 'Originais'],
    isFeatured: true,
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/hbo',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/hbo',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'hbo-2',
    name: 'HBO 2',
    number: '101',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Maratonas de séries HBO dubladas e grandes produções de Hollywood.',
    currentProgram: 'Maratona Séries HBO',
    tags: ['Cinema', 'Séries', 'Dublado'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/hbo2',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'telecine-premium',
    name: 'Telecine Premium',
    number: '110',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'As maiores estreias do cinema direto dos cinemas para a sua tela sem intervalos.',
    currentProgram: 'Superestreia Telecine',
    tags: ['Cinema', 'Estreias', 'Telecine', 'Blockbusters'],
    isFeatured: true,
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/telecine-premium',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/telecine-premium',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'telecine-action',
    name: 'Telecine Action',
    number: '111',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Muita adrenalina com filmes de ação, suspense, explosões e ficção científica.',
    currentProgram: 'Festival Ação Máxima',
    tags: ['Ação', 'Suspense', 'Telecine'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/telecine-action',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/telecine-action',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'telecine-pipoca',
    name: 'Telecine Pipoca',
    number: '112',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Os filmes mais divertidos, comédias, aventuras e sucessos de bilheteria dublados.',
    currentProgram: 'Sessão Pipoca & Comédia',
    tags: ['Comédia', 'Dublado', 'Família'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/telecine-pipoca',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'telecine-touch',
    name: 'Telecine Touch',
    number: '113',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Filmes emocionantes, romances inesquecíveis, dramas e histórias baseadas em fatos reais.',
    currentProgram: 'Noite Romântica & Drama',
    tags: ['Drama', 'Romance', 'Telecine'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/telecine-touch',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'telecine-cult',
    name: 'Telecine Cult',
    number: '114',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Clássicos imortais da história do cinema, filmes cult e cinema independente de autor.',
    currentProgram: 'Clássicos do Cinema & Cinema Europeu',
    tags: ['Clássicos', 'Cult', 'Cinema de Arte'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/telecine-cult',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'megapix',
    name: 'Megapix',
    number: '120',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Canal de filmes 100% dublados com grandes sucessos e maratonas imperdíveis.',
    currentProgram: 'Mega Pipoca 100% Dublado',
    tags: ['Dublado', 'Sucessos', 'Maratonas'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/megapix',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'warner-channel',
    name: 'Warner Channel',
    number: '130',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Séries consagradas (The Big Bang Theory, Friends), universo DC e cinema Warner Bros.',
    currentProgram: 'The Big Bang Theory & Filmes DC',
    tags: ['Séries', 'Warner', 'Comédia', 'DC'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/warner',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'universal-tv',
    name: 'Universal TV',
    number: '135',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Séries policiais, Chicago Fire, Law & Order: SVU e filmes de suspense.',
    currentProgram: 'Franquia Chicago & Law & Order',
    tags: ['Policial', 'Chicago', 'Suspense'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/universal',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'sony-channel',
    name: 'Sony Channel',
    number: '140',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Dramas médicos icônicos como Grey\'s Anatomy, The Good Doctor e Shark Tank Brasil.',
    currentProgram: 'Grey\'s Anatomy & The Good Doctor',
    tags: ['Drama', 'Médico', 'Shark Tank'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/sony',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'space',
    name: 'Space HD',
    number: '145',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Muita ação, terror, suspense, artes marciais e eventos especiais de wrestling.',
    currentProgram: 'Especial Terror & Ação Sem Parar',
    tags: ['Terror', 'Ação', 'Suspense'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/space',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'paramount-network',
    name: 'Paramount Network',
    number: '150',
    category: 'filmes',
    logo: 'https://images.unsplash.com/photo-1460881680858-30d870d7b388?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Yellowstone, filmes clássicos e premiados da Paramount Pictures.',
    currentProgram: 'Yellowstone & Cinema Paramount',
    tags: ['Cinema', 'Yellowstone', 'Western'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/paramount',
        type: 'iframe',
      },
    ],
  },

  // ==================== NOTÍCIAS ====================
  {
    id: 'globonews',
    name: 'GloboNews',
    number: '40',
    category: 'noticias',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: '24 horas de notícias do Brasil e do mundo, cobertura em tempo real, política e economia.',
    currentProgram: 'Edição das 18h & Conexão GloboNews',
    tags: ['Notícias', 'Política', 'Economia', '24h'],
    isFeatured: true,
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/globonews',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/globonews',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'cnn-brasil',
    name: 'CNN Brasil',
    number: '577',
    category: 'noticias',
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Jornalismo sério, imparcial e ágil com especialistas e correspondentes no mundo inteiro.',
    currentProgram: 'CNN 360° & Live CNN',
    tags: ['Notícias', 'CNN', 'Mundo'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/cnn-brasil',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'jovem-pan-news',
    name: 'Jovem Pan News',
    number: '576',
    category: 'noticias',
    logo: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Opinião forte, debates políticos, Os Pingos nos Is e cobertura das principais manchetes.',
    currentProgram: 'Os Pingos nos Is & Jornal Jovem Pan',
    tags: ['Notícias', 'Debates', 'Opinião'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/jovempannews',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'bandnews',
    name: 'BandNews TV',
    number: '41',
    category: 'noticias',
    logo: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Noticiário completo a cada 15 minutos, entrevistas e giro pelas capitais do país.',
    currentProgram: 'Jornal BandNews & Giro Mundial',
    tags: ['Notícias', 'Giro', 'Economia'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/bandnews',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'record-news',
    name: 'Record News',
    number: '42',
    category: 'noticias',
    logo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Canal de notícias 24 horas gratuito com transmissões ao vivo e reportagens especiais.',
    currentProgram: 'Hora News & Zapping',
    tags: ['Notícias', 'Factual', 'Gratuito'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/recordnews',
        type: 'iframe',
      },
    ],
  },

  // ==================== INFANTIL ====================
  {
    id: 'cartoon-network',
    name: 'Cartoon Network',
    number: '200',
    category: 'infantil',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Os melhores desenhos do mundo: O Incrível Mundo de Gumball, Hora de Aventura, Ben 10 e Jovens Titãs.',
    currentProgram: 'O Incrível Mundo de Gumball',
    tags: ['Desenhos', 'Infantil', 'Cartoon', 'Animação'],
    isFeatured: true,
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/cartoon-network',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/cartoon-network',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'discovery-kids',
    name: 'Discovery Kids',
    number: '205',
    category: 'infantil',
    logo: 'https://images.unsplash.com/photo-1566140967404-b8b393271a22?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'O canal preferido dos pequenos: Peppa Pig, O Show da Luna, Patrulha Canina e Doki.',
    currentProgram: 'Patrulha Canina & Peppa Pig',
    tags: ['Infantil', 'Educativo', 'Crianças'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/discovery-kids',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'nickelodeon',
    name: 'Nickelodeon',
    number: '210',
    category: 'infantil',
    logo: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Bob Esponja, The Loud House, Henry Danger e séries adolescentes divertidas.',
    currentProgram: 'Bob Esponja Calça Quadrada',
    tags: ['Infantil', 'Bob Esponja', 'Séries Teen'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/nickelodeon',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'gloob',
    name: 'Gloob',
    number: '215',
    category: 'infantil',
    logo: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Miraculous: As Aventuras de Ladybug, Detetives do Prédio Azul (D.P.A.) e animações nacionais.',
    currentProgram: 'Miraculous Ladybug & D.P.A.',
    tags: ['Infantil', 'Ladybug', 'D.P.A.'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/gloob',
        type: 'iframe',
      },
    ],
  },

  // ==================== DOCUMENTÁRIOS & VARIEDADES ====================
  {
    id: 'discovery-channel',
    name: 'Discovery Channel',
    number: '300',
    category: 'variedades',
    logo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Ciência, natureza, tecnologia, sobrevivência extrema, Largados e Pelados e Febre do Ouro.',
    currentProgram: 'Largados e Pelados & Febre do Ouro',
    tags: ['Documentário', 'Natureza', 'Sobrevivência'],
    isFeatured: true,
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/discovery-channel',
        type: 'iframe',
      },
      {
        name: 'Servidor 2 (Alternativo)',
        url: 'https://superflixapi.sbs/tv/discovery-channel',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'history-channel',
    name: 'History Channel',
    number: '305',
    category: 'variedades',
    logo: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Alienígenas do Passado, Trato Feito, O Sócio e grandes mistérios da humanidade.',
    currentProgram: 'Trato Feito & Alienígenas do Passado',
    tags: ['História', 'Mistérios', 'Trato Feito'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/history',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'national-geographic',
    name: 'National Geographic',
    number: '310',
    category: 'variedades',
    logo: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Exploração científica, vida selvagem, culturas ancestrais e expedições pelo planeta.',
    currentProgram: 'Planeta Selvagem & Grandes Expedições',
    tags: ['Natureza', 'Ciência', 'Vida Selvagem'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/national-geographic',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'animal-planet',
    name: 'Animal Planet',
    number: '315',
    category: 'variedades',
    logo: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Dedicado ao reino animal, resgates de bichos, comportamento pet e preservação.',
    currentProgram: 'O Segredo dos Predadores',
    tags: ['Animais', 'Natureza', 'Pets'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/animal-planet',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'multishow',
    name: 'Multishow',
    number: '320',
    category: 'variedades',
    logo: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Shows ao vivo, festivais de música (Rock in Rio, Lollapalooza), humor e realities.',
    currentProgram: 'Vai que Cola & Festivais de Música',
    tags: ['Música', 'Humor', 'Shows', 'Rock in Rio'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/multishow',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'gnt',
    name: 'GNT',
    number: '325',
    category: 'variedades',
    logo: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Gastronomia com Que Marravilha!, decoração, moda, bem-estar e debates inteligentes com Papo de Segunda.',
    currentProgram: 'Papo de Segunda & Gastronomia',
    tags: ['Estilo', 'Gastronomia', 'Debates'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/gnt',
        type: 'iframe',
      },
    ],
  },
  {
    id: 'viva',
    name: 'Canal Viva',
    number: '330',
    category: 'variedades',
    logo: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300&auto=format&fit=crop&q=80',
    quality: '1080p',
    description: 'Novelas clássicas inesquecíveis da TV brasileira, Sai de Baixo, Toma Lá Dá Cá e programas de humor nostálgicos.',
    currentProgram: 'Novelas Clássicas & Sai de Baixo',
    tags: ['Nostalgia', 'Novelas', 'Humor'],
    servers: [
      {
        name: 'Servidor 1 (Principal)',
        url: 'https://megacanais.com/embed/viva',
        type: 'iframe',
      },
    ],
  },
]
