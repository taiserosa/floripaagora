/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CulturalEvent } from './types';

export const INITIAL_EVENTS: CulturalEvent[] = [
  // --- SHOWS ---
  {
    id: 's1',
    title: 'Projeto Mini Tour - Especial Soul Brasileiro',
    description: 'Um espetáculo imperdível celebrando os grandes nomes da soul music brasileira, com arranjos eletrizantes que misturam ritmo, metais e muita emoção no palco do renomado Teatro Pedro Ivo.',
    category: 'shows',
    date: '2026-05-21',
    time: '20:00',
    locationName: 'Teatro Pedro Ivo',
    neighborhood: 'Saco Grande',
    address: 'Rodovia SC-401, 4600',
    latitude: -27.5485,
    longitude: -48.5042,
    price: 'R$ 60 (Inteira) / R$ 30 (Meia)',
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 's2',
    title: 'Tradicional Baile das Mães do Lira Tênis Clube',
    description: 'O tradicionalíssimo baile festivo do Lira Tênis Clube em homenagem às mães de Florianópolis. Um ambiente requintado com música ao vivo executada por orquestra espetacular, jantar especial e recepção festiva calorosa.',
    category: 'shows',
    date: '2026-05-15',
    time: '21:00',
    locationName: 'Lira Tênis Clube',
    neighborhood: 'Centro',
    address: 'Rua Felipe Schmidt, 296',
    latitude: -27.5958,
    longitude: -48.5521,
    price: 'R$ 150 (Mesa Individual)',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 's3',
    title: 'Camerata Florianópolis: Clássicos do Rock',
    description: 'A mundialmente aclamada orquestra Catarinense apresenta espetáculo inesquecível de clássicos do rock nacional e internacional.',
    category: 'shows',
    date: '2026-05-23',
    time: '20:30',
    locationName: 'Teatro Ademir Rosa - CIC',
    neighborhood: 'Agronômica',
    address: 'Av. Gov. Irineu Bornhausen, 5600',
    latitude: -27.5802,
    longitude: -48.5146,
    price: 'A partir de R$ 40',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    featured: false
  },

  // --- FEIRAS ---
  {
    id: 'f1',
    title: 'Feira de Camisas de Futebol de Florianópolis',
    description: 'Grande feira temática de colecionadores e entusiastas do manto sagrado! Venda, troca, avaliação e exposição de camisas oficiais raras, antigas e novas de clubes catarinenses e mundiais.',
    category: 'feiras',
    date: '2026-03-14',
    time: '09:00',
    locationName: 'Mercado Público de Florianópolis',
    neighborhood: 'Centro',
    address: 'Rua Conselheiro Mafra, 255',
    latitude: -27.5975,
    longitude: -48.5532,
    price: 'Entrada Grátis',
    imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'f2',
    title: 'Feira de Colecionismo na Lojas Americanas',
    description: 'Um maravilhoso encontro de colecionadores de moedas, selos, cartões postais, carrinhos miniatura, brinquedos vintage e antiguidades. Realizada de sexta a domingo no aconchegante corredor das Lojas Americanas.',
    category: 'feiras',
    date: '2026-03-06',
    time: '10:00',
    locationName: 'Shopping Floripa (Lojas Americanas)',
    neighborhood: 'Saco Grande',
    address: 'Rodovia SC-401, 3116',
    latitude: -27.5501,
    longitude: -48.5034,
    price: 'Acesso Gratuito',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'f3',
    title: 'Feira de Artesanato e Renda de Bilro no Centro Histórico',
    description: 'Tradicional exposição artesanal do folclore açoriano, contando com as clássicas rendeiras manezinhas fiando bilros em tempo real.',
    category: 'feiras',
    date: '2026-05-24',
    time: '14:00',
    locationName: 'Praça Bento Silvério',
    neighborhood: 'Lagoa da Conceição',
    address: 'Rua Henrique Veras do Nascimento, 50',
    latitude: -27.6033,
    longitude: -48.4635,
    price: 'Entrada Franca',
    imageUrl: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&q=80',
    featured: false
  },

  // --- ESPORTES ---
  {
    id: 'e1',
    title: 'Transmissão da Copa do Mundo em Florianópolis',
    description: 'Venha torcer pela nossa seleção com qualidade premium! Telão gigante de altíssima definição 4K, praça de alimentação climatizada do shopping e entretenimento pré e pós jogo.',
    category: 'esportes',
    date: '2026-06-11',
    time: '10:00',
    locationName: 'Villa Romana Shopping',
    neighborhood: 'Santa Mônica',
    address: 'Av. Madre Benvenuta, 687',
    latitude: -27.5912,
    longitude: -48.5135,
    price: 'Acesso Grátis das torcidas',
    imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'e2',
    title: 'Corrida Rústica de Outono do Campeche',
    description: 'Famosa corrida rústica na praia de Florianópolis. Circuitos de 5k e 10k ao longo da maravilhosa areia branca com visual estonteante da Ilha do Campeche.',
    category: 'esportes',
    date: '2026-05-24',
    time: '07:30',
    locationName: 'Point do Riozinho',
    neighborhood: 'Campeche',
    address: 'Av. Pequeno Príncipe, final da praia',
    latitude: -27.6833,
    longitude: -48.4833,
    price: 'Inscrição de R$ 75',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
    featured: false
  },

  // --- CURSOS ---
  {
    id: 'c1',
    title: 'Aulas de Surf Gratuitas e Treino na Joaquina',
    description: 'Curso intensivo de surf voltado para iniciantes de todas as idades na icônica Praia da Joaquina. Início nas areias e prática guiada por profissionais do surfe nativo.',
    category: 'cursos',
    date: '2026-04-08',
    time: '07:00',
    locationName: 'Dunas e Praia da Joaquina',
    neighborhood: 'Joaquina',
    address: 'Estrada Geral da Joaquina, final',
    latitude: -27.6288,
    longitude: -48.4475,
    price: 'Gratuito',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'c2',
    title: 'Workshop Avançado de Renda de Bilro & Tradição Açoriana',
    description: 'Aprenda as famosas técnicas consagradas de bilro com as místicas rendeiras locais. Peças produzidas durante o workshop pertencem ao aluno.',
    category: 'cursos',
    date: '2026-06-13',
    time: '14:30',
    locationName: 'Casarão Cultural Bento Silvério',
    neighborhood: 'Lagoa da Conceição',
    address: 'Praça Bento Silvério, s/n',
    latitude: -27.6035,
    longitude: -48.4632,
    price: 'R$ 20 (Inclui material)',
    imageUrl: 'https://images.unsplash.com/photo-1530124560072-a169d29666d2?auto=format&fit=crop&w=600&q=80',
    featured: false
  },

  // --- OUTROS ---
  {
    id: 'o1',
    title: 'Noite de Bossa Jazz no The Black Swan Pub',
    description: 'O melhor point do happy hour e lazer noturno da Lagoa da Conceição. Venha ouvir bossa nova fundida com improvisações do jazz de Floripa em um clima rústico inglês sensacional.',
    category: 'outros',
    subCategory: 'Bares e Pubs',
    date: '2026-05-22',
    time: '20:30',
    locationName: 'The Black Swan Pub',
    neighborhood: 'Lagoa da Conceição',
    address: 'Rua Henrique Veras do Nascimento, 134',
    latitude: -27.6041,
    longitude: -48.4651,
    price: 'R$ 15 (Couvert artístico)',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    featured: false
  },
  {
    id: 'o2',
    title: 'Simpósio Regional de Inovação de TI na FMP',
    description: 'Encontro para acadêmicos da Faculdade Municipal de Palhoça (FMP) e desenvolvedores regionais focando nas inovações de programação Android nativa e inteligência artificial aplicadas.',
    category: 'outros',
    subCategory: 'Palestras',
    date: '2026-05-29',
    time: '19:00',
    locationName: 'Faculdade Municipal de Palhoça - Auditório',
    neighborhood: 'Centro / Palhoça',
    address: 'Rua João Pereira dos Santos, 305 - Ponte do Imaruim',
    latitude: -27.6185,
    longitude: -48.6512,
    price: 'Inscrição Acadêmica Grátis',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: 'o3',
    title: 'Noite de Peixes & Tradição da Tainha Cozida',
    description: 'Vivencie as melhores e tradicionais iguarias dos manezinhos, localizado numa orla histórica linda de Santa Catarina.',
    category: 'outros',
    subCategory: 'Restaurantes',
    date: '2026-05-31',
    time: '12:00',
    locationName: 'Calçadão de Santo Antônio de Lisboa',
    neighborhood: 'Santo Antônio de Lisboa',
    address: 'Rua Cônego Serpa, Centro Histórico',
    latitude: -27.5028,
    longitude: -48.5147,
    price: 'Entrada Aberta',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
    featured: false
  },
  {
    id: 'o4',
    title: 'Manezinho Sorrateiro e suas Estórias do Folclore',
    description: 'Espetáculo teatral repleto de humor, causos, lendas da Ilha da Magia e sotaque carregado para agradar toda a família e turistas.',
    category: 'outros',
    subCategory: 'Teatro e Espetáculos',
    date: '2026-06-02',
    time: '19:30',
    locationName: 'Teatro Álvaro de Carvalho (TAC)',
    neighborhood: 'Centro',
    address: 'Rua Marechal Guilherme, 26',
    latitude: -27.5969,
    longitude: -48.5494,
    price: 'Apenas R$ 20',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
    featured: false
  },
  {
    id: 'o5',
    title: 'Double Chopp Artesanal da Beira Mar',
    description: 'Esquenta para os amantes de futebol e chopp nativo da ilha. Promoção exclusiva regada a porções típicas de camarão frito.',
    category: 'outros',
    subCategory: 'Promoções',
    date: '2026-05-24',
    time: '18:00',
    locationName: 'Mercado Público de Floripa - Box 32',
    neighborhood: 'Centro',
    address: 'Rua Conselheiro Mafra',
    latitude: -27.5976,
    longitude: -48.5535,
    price: 'Consumação média R$ 30',
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80',
    featured: false
  }
];

export const CATEGORIES_CONFIG = {
  feiras: {
    label: 'Feiras',
    icon: 'Store',
    color: 'from-blue-800 to-blue-900',
    bgColor: 'bg-[#062f63]/10',
    hoverBgColor: 'hover:bg-[#062f63]/20',
    textColor: 'text-[#062f63]',
    borderColor: 'border-[#062f63]/30'
  },
  shows: {
    label: 'Shows',
    icon: 'Music',
    color: 'from-blue-700 to-indigo-800',
    bgColor: 'bg-[#2c5fd3]/10',
    hoverBgColor: 'hover:bg-[#2c5fd3]/20',
    textColor: 'text-[#2c5fd3]',
    borderColor: 'border-[#2c5fd3]/35'
  },
  esportes: {
    label: 'Esportes',
    icon: 'Activity',
    color: 'from-sky-700 to-blue-800',
    bgColor: 'bg-sky-50',
    hoverBgColor: 'hover:bg-sky-100',
    textColor: 'text-sky-800',
    borderColor: 'border-sky-200'
  },
  cursos: {
    label: 'Cursos',
    icon: 'GraduationCap',
    color: 'from-teal-650 to-blue-800',
    bgColor: 'bg-teal-50',
    hoverBgColor: 'hover:bg-teal-100',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-200'
  },
  outros: {
    label: 'Outros',
    icon: 'SlidersHorizontal',
    color: 'from-slate-700 to-slate-900',
    bgColor: 'bg-slate-100',
    hoverBgColor: 'hover:bg-slate-200',
    textColor: 'text-slate-750',
    borderColor: 'border-slate-305'
  }
};
