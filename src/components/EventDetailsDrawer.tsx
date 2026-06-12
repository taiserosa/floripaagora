/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, DollarSign, Share2, Star, Navigation, 
  CheckCircle, Compass, CreditCard 
} from 'lucide-react';
import { CulturalEvent } from '../types';
import { CATEGORIES_CONFIG } from '../data';
import FakeMap from './FakeMap';

interface EventDetailsDrawerProps {
  event: CulturalEvent | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDeleteEvent?: (id: string) => void;
}

function getEventImageByKeywords(event: CulturalEvent): string {
  if (!event) return 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80';

  // Normalize string to remove accents and special characters
  const normalizeText = (text: string) => {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const titleNorm = normalizeText(event.title);
  const descNorm = normalizeText(event.description);
  const subCatNorm = normalizeText(event.subCategory || '');
  const catNorm = normalizeText(event.category || '');

  // 1. Explicit high-precision overrides for the specific events requested by the user:
  if (titleNorm.includes('copa do mundo')) {
    return 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=800&q=80'; // Beautiful fans cheering / stadium soccer world cup vibe
  }
  if (titleNorm.includes('camisas de futebol')) {
    return 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80'; // Group wearing colorful retro/team jerseys, perfect fit
  }
  if (titleNorm.includes('feira de artesanato e renda de bilro')) {
    return 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=800&q=80'; // Highly intricate, detailed elegant white handmade lace texturing
  }
  if (titleNorm.includes('workshop avancado de renda de bilro')) {
    return 'https://images.unsplash.com/photo-1530124560072-a169d29666d2?auto=format&fit=crop&w=800&q=80'; // Close-up of hands crafting with textile/lace threading
  }

  // Define our prioritized matcher rule-set based on Title first, then description terms
  const ruleSet = [
    {
      keywords: ['surf', 'joaquina', 'campeche', 'praia', 'mar', 'onda'],
      url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['futebol', 'copa', 'camisa', 'jogo', 'partida', 'avai', 'figueirense', 'estadio', 'campo'],
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['corrida', 'rustica', 'maratona', 'atletismo', 'pedestre', 'caminhada', 'running'],
      url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['camerata', 'orquestra', 'sinfonica', 'violino', 'concerto', 'classico', 'opera'],
      url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['jazz', 'soul', 'bossa', 'mpb', 'violao', 'acustico', 'blues', 'saxofone'],
      url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['baile', 'dança', 'danca', 'lira', 'festa', 'mae', 'debutante', 'party'],
      url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['colecionis', 'colecao', 'colecionador', 'numismatica', 'moeda', 'selo', 'antiguidade', 'vintage', 'reliquia'],
      url: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['artesanato', 'renda', 'bilro', 'rendeira', 'feito a mao', 'manualidade', 'tecelagem', 'agulha', 'artesanal'],
      url: 'https://images.unsplash.com/photo-1488459718432-36af503673ae?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['chopp', 'cerveja', 'pub', 'bar', 'happy hour', 'coquetel', 'drink', 'beira mar', 'bebida'],
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['simposio', 'computacao', 'ia', 'ti', 'inovacao', 'tecnologia', 'programacao', 'desenvolvimento', 'workshop', 'seminario', 'palestra', 'estudo', 'fmp'],
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['peixe', 'tainha', 'frutos do mar', 'camarao', 'culinaria', 'gastronomia', 'almoco', 'jantar', 'chef', 'comida', 'restaurante', 'peixaria'],
      url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['teatro', 'espetaculo', 'ator', 'palco', 'comedia', 'drama', 'peca', 'estoria', 'folclore', 'lenda', 'cultural', 'manezinho'],
      url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['cinema', 'filme', 'cine', 'curta', 'longa', 'documentario', 'tela', 'pipoca'],
      url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['galeria', 'museu', 'pintura', 'tela', 'arte', 'escultura', 'exposicao', 'quadro'],
      url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['yoga', 'ioga', 'meditacao', 'zen', 'pilates', 'saude', 'bem estar', 'relaxamento'],
      url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['fotografia', 'foto', 'camera', 'lente', 'retrato'],
      url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
    },
    {
      keywords: ['crianca', 'infantil', 'kids', 'brinquedo', 'recreacao', 'teatrinho', 'palhaco', 'diversao'],
      url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // First try of high precision: match title only
  for (const rule of ruleSet) {
    if (rule.keywords.some(keyword => titleNorm.includes(keyword))) {
      return rule.url;
    }
  }

  // Second try: match description / subCategory / category
  for (const rule of ruleSet) {
    if (
      rule.keywords.some(keyword => descNorm.includes(keyword)) ||
      rule.keywords.some(keyword => subCatNorm.includes(keyword)) ||
      rule.keywords.some(keyword => catNorm.includes(keyword))
    ) {
      return rule.url;
    }
  }

  // Dynamic search fallback by extracting actual words from the title!
  const stopWords = new Set([
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'para', 'com', 'por', 'pelo', 'pela',
    'um', 'uma', 'uns', 'umas', 'e', 'o', 'a', 'os', 'as', 'que', 'se', 'ao', 'aos', 'ou', 'sua', 'seu',
    'suas', 'seus', 'esta', 'este', 'estas', 'estes', 'isso', 'isto', 'nao', 'sim', 'com', 'sem', 'como',
    'mais', 'menos', 'muito', 'pouco', 'especial', 'tradicional', 'projeto', 'mini', 'tour', 'regional',
    'florianopolis', 'floripa', 'catarina', 'sc'
  ]);

  const titleWords = titleNorm
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  if (titleWords.length > 0) {
    const searchQuery = titleWords.slice(0, 3).join(',');
    return `https://images.unsplash.com/featured/800x600/?${encodeURIComponent(searchQuery)}`;
  }

  // Final fallback by standard categories
  if (catNorm === 'shows') {
    return 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80';
  }
  if (catNorm === 'feiras') {
    return 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80';
  }
  if (catNorm === 'esportes') {
    return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80';
  }
  if (catNorm === 'cursos') {
    return 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80';
  }

  return 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80';
}

export default function EventDetailsDrawer({ 
  event, 
  onClose, 
  isFavorite, 
  onToggleFavorite,
  onDeleteEvent
}: EventDetailsDrawerProps) {
  const [showMap, setShowMap] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    setShowConfirmDelete(false);
  }, [event?.id]);

  if (!event) return null;

  const config = CATEGORIES_CONFIG[event.category] || CATEGORIES_CONFIG.shows;

  const handleShare = () => {
    const textToCopy = `🎟️ Agenda Cultural Floripa: ${event.title}\n📅 Data: ${event.date}\n⏰ Hora: ${event.time}\n📍 Local: ${event.locationName} (${event.neighborhood})\n💰 Valor: ${event.price}\nCompartilhado via app!`;
    navigator.clipboard.writeText(textToCopy);
    setShowShareNotification(true);
    setTimeout(() => {
      setShowShareNotification(false);
    }, 2500);
  };

  const handleTicketAction = () => {
    if (event.price.toLowerCase().includes('gratuito')) {
      setTicketStatus('Sucesso! Evento com entrada gratuita. Basta comparecer ao local no horário indicado.');
    } else {
      setTicketStatus(`Simulação de Compra Iniciada! Os lotes estão abertos para ${event.title}. Preço estimado: ${event.price}. Redirecionando para plataforma oficial (simulado).`);
    }
    setTimeout(() => {
      setTicketStatus(null);
    }, 5000);
  };

  return (
    <div id="event-detail-backdrop" className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex justify-center items-end sm:items-center p-0 sm:p-4 animate-fade-in" style={{ contentVisibility: 'auto' }}>
      <div 
        id="detail-window" 
        className="w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-3xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl border border-slate-100 outline-none pb-safe animate-slide-up"
      >
        
        {/* Detail Image Header Banner */}
        <div className="relative w-full h-[180px] sm:h-[200px] bg-slate-100 flex-shrink-0">
          <img 
            src={event.imageUrl && event.imageUrl.trim() !== '' ? event.imageUrl : getEventImageByKeywords(event)} 
            alt={event.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              // Fallback based on event category
              const catPics: Record<string, string> = {
                shows: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80',
                feiras: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80',
                esportes: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
                cursos: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
                outros: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=80',
              };
              target.src = catPics[event.category] || catPics.shows;
            }}
            className="w-full h-full object-cover" 
          />
          {/* Cover gradient layer for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/35 to-transparent"></div>

          {/* Floaters on image */}
          <button 
            id="back-close-detail"
            onClick={onClose} 
            className="absolute top-4 left-4 p-2 bg-slate-900/40 hover:bg-slate-900/60 active:bg-slate-900 text-white rounded-full backdrop-blur-sm transition-all duration-150 cursor-pointer"
            title="Fechar Detalhes"
          >
            <X className="w-5 h-5" />
          </button>

          <button 
            id="fav-btn-on-detail"
            onClick={onToggleFavorite} 
            className="absolute top-4 right-4 p-2.5 bg-slate-900/40 hover:bg-slate-900/60 active:bg-slate-900 text-white rounded-full backdrop-blur-sm transition-all duration-150 cursor-pointer"
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-white'}`} />
          </button>

          {/* Bottom title layer overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-800 px-2.5 py-1 rounded-[6px] bg-white/95 inline-block mb-1.5 shadow-sm">
              {config.label}
            </span>
            <h2 className="text-lg font-extrabold text-white leading-tight drop-shadow-md">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Action icons row */}
        <div className="grid grid-cols-3 border-b border-slate-100 text-slate-600 font-medium text-xs py-3.5 bg-slate-50/50">
          <button 
            id="share-action-btn"
            onClick={handleShare} 
            className="flex flex-col items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Compartilhar</span>
          </button>

          <button 
            id="route-action-btn"
            onClick={() => setShowMap(!showMap)} 
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              showMap ? 'text-blue-600 font-bold' : 'hover:text-blue-600'
            }`}
          >
            <Navigation className={`w-4 h-4 ${showMap ? 'text-blue-600 animate-pulse' : 'text-blue-500'}`} />
            <span>{showMap ? 'Ocultar Rota' : 'Como Chegar'}</span>
          </button>

          <button 
            id="quick-fav-action-btn"
            onClick={onToggleFavorite} 
            className="flex flex-col items-center gap-1 hover:text-amber-500 transition-colors cursor-pointer"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
            <span>{isFavorite ? 'Favoritado' : 'Favoritar'}</span>
          </button>
        </div>

        {/* Content body layout */}
        <div className="p-6 flex flex-col gap-5 flex-grow overflow-y-auto">
          {/* Notification banner */}
          {showShareNotification && (
            <div id="share-success-banner" className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold animate-slide-up">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Link e dados copiados para sua área de transferência!</span>
            </div>
          )}

          {ticketStatus && (
            <div id="ticket-success-banner" className="bg-blue-50 text-blue-800 border border-blue-100 rounded-xl px-4 py-3 text-xs font-medium space-y-1 animate-slide-up">
              <div className="font-bold text-blue-900 flex items-center gap-1">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Informativo de Convite
              </div>
              <p>{ticketStatus}</p>
            </div>
          )}

          {/* Description */}
          <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
            {event.description}
          </div>

          {/* Specifications grid cards */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="p-3 bg-blue-50/40 border border-blue-50/80 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Cronograma
              </span>
              <span className="text-xs font-black text-slate-800">
                {new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { 
                  weekday: 'short', 
                  day: 'numeric', 
                  month: 'short' 
                })}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Data do Evento</span>
            </div>

            <div className="p-3 bg-blue-50/40 border border-blue-50/80 rounded-2xl flex flex-col gap-1.5 shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Horário
              </span>
              <span className="text-xs font-black text-slate-800">{event.time}h</span>
              <span className="text-[10px] text-slate-500 font-medium">Abertura / Início</span>
            </div>

            <div className="p-3 bg-blue-50/40 border border-blue-50/80 rounded-2xl flex flex-col gap-1.5 shadow-sm col-span-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Local da Realização
              </span>
              <span className="text-xs font-black text-slate-850 leading-tight">
                {event.locationName}
              </span>
              <span className="text-[11px] text-slate-500 font-semibold mb-1">
                {event.neighborhood} • {event.address}
              </span>
            </div>

            <div className="p-3 bg-blue-50/40 border border-blue-50/80 rounded-2xl flex flex-col gap-1.5 shadow-sm col-span-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-blue-650" /> Entrada / Tarifário
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-850">
                  {event.price}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  event.price.toLowerCase().includes('gratuito') 
                    ? 'bg-emerald-100 text-emerald-850' 
                    : 'bg-amber-100 text-amber-850'
                }`}>
                  {event.price.toLowerCase().includes('gratuito') ? 'Grátis' : 'Ingresso'}
                </span>
              </div>
            </div>
          </div>

          {/* Active FakeMap simulation routing system */}
          {showMap && (
            <div className="mt-2 animate-slide-up">
              <FakeMap 
                locationName={event.locationName}
                neighborhood={event.neighborhood}
                latitude={event.latitude}
                longitude={event.longitude}
              />
            </div>
          )}

          {/* Order tickets or secure attendance call to action */}
          <button
            id="ticket-buy-or-go-btn"
            onClick={handleTicketAction}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer uppercase tracking-wider"
          >
            <Compass className="w-4 h-4" />
            <span>
              {event.price.toLowerCase().includes('gratuito') 
                ? 'Garantir Presença Gratuitamente' 
                : 'Adquirir Ingresso / Ver Opções'}
            </span>
          </button>

          {event.comunidade && onDeleteEvent && (
            <div className="w-full mt-2.5">
              {!showConfirmDelete ? (
                <button
                  id="delete-suggested-event-btn"
                  onClick={() => setShowConfirmDelete(true)}
                  className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider border border-red-500/30 font-sans"
                >
                  🗑️ Excluir Evento Sugerido
                </button>
              ) : (
                <div id="confirm-delete-box" className="p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-3 font-sans animate-slide-up">
                  <p className="text-xs text-red-950 font-bold leading-relaxed text-center">
                    Tem certeza de que quer excluir permanentemente este evento sugerido do seu celular?
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-black tracking-wider uppercase">
                    <button
                      id="confirm-delete-yes-btn"
                      onClick={() => onDeleteEvent(event.id)}
                      className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-2.5 px-3 rounded-xl cursor-pointer text-center transition-all shadow-sm"
                    >
                      Sim, Excluir
                    </button>
                    <button
                      id="confirm-delete-cancel-btn"
                      onClick={() => setShowConfirmDelete(false)}
                      className="bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-705 text-slate-700 py-2.5 px-3 rounded-xl cursor-pointer text-center transition-all shadow-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
