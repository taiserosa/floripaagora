/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Music, Store, Activity, GraduationCap, SlidersHorizontal, Search, 
  Plus, Heart, Sparkles, MapPin, Calendar, Clock, 
  Share2, Star, Navigation, Filter, CheckCircle, HeartCrack, 
  ChevronRight, ChevronLeft, X, Info, Phone, Compass, Users 
} from 'lucide-react';

import { CulturalEvent, Category } from './types';
import { INITIAL_EVENTS, CATEGORIES_CONFIG } from './data';
import AndroidFrame from './components/AndroidFrame';
import EventDetailsDrawer from './components/EventDetailsDrawer';
import AddEventModal from './components/AddEventModal';

export default function App() {
  // Database states with LocalStorage persistence
  const [events, setEvents] = useState<CulturalEvent[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Navigation state (Android inner WebView bottom nav)
  const [activeTab, setActiveTab] = useState<'explorer' | 'favorites' | 'about'>('explorer');

  // Interactive filtering states
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all' | 'favorites'>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('Bares e Pubs');
  
  // UI state overlays
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<CulturalEvent | null>(null);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDeleteSuccessToast, setShowDeleteSuccessToast] = useState(false);

  // New specific states matching the required mockup flow
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isOutrosSearched, setIsOutrosSearched] = useState(false);
  const [dateInputVal, setDateInputVal] = useState<string>('');

  // Sync typed date input value if selectedDate is changed/cleared from elsewhere
  useEffect(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        const [y, m, d] = parts;
        setDateInputVal(`${d}/${m}/${y}`);
      }
    } else {
      setDateInputVal('');
    }
  }, [selectedDate]);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    
    // Strip non-digits
    let digits = raw.replace(/\D/g, '');
    if (digits.length > 8) {
      digits = digits.slice(0, 8);
    }

    // Format as DD/MM/YYYY
    let formatted = '';
    if (digits.length > 0) {
      formatted += digits.slice(0, 2);
    }
    if (digits.length > 2) {
      formatted += '/' + digits.slice(2, 4);
    }
    if (digits.length > 4) {
      formatted += '/' + digits.slice(4, 8);
    }

    setDateInputVal(formatted);

    // If fully typed, update selectedDate filter
    if (formatted.length === 10) {
      const parts = formatted.split('/');
      if (parts.length === 3) {
        const [d, m, y] = parts;
        const dNum = parseInt(d, 10);
        const mNum = parseInt(m, 10);
        const yNum = parseInt(y, 10);

        // Verify basic date values
        if (dNum >= 1 && dNum <= 31 && mNum >= 1 && mNum <= 12 && yNum >= 1000 && yNum <= 2999) {
          const isoDate = `${y}-${m}-${d}`;
          setSelectedDate(isoDate);
          if (selectedCategory === 'outros') {
            setIsOutrosSearched(true);
          }
        }
      }
    } else {
      // If cleared, reset selectedDate filter
      if (formatted.length === 0) {
        setSelectedDate('');
      }
    }
  };

  // Initialize DB and Favorites from LocalStorage on mount
  const [isLoadingRealEvents, setIsLoadingRealEvents] = useState(false);
  const [realEventsSource, setRealEventsSource] = useState<string>('');

  const fetchRealEvents = async (forceRefresh = false) => {
    setIsLoadingRealEvents(true);
    try {
      const res = await fetch(`/api/real-events${forceRefresh ? '?refresh=true' : ''}`);
      const data = await res.json();
      if (data.events && Array.isArray(data.events)) {
        // Retrieve custom user-created events from the local database
        let userCreated: CulturalEvent[] = [];
        try {
          const stored = localStorage.getItem('floripa_events_db_v3');
          if (stored) {
            const list = JSON.parse(stored) as CulturalEvent[];
            // Original IDs are 's1', 's2', 's3', 'f1', etc., or 'real-f1' from server fallback, 'api-' from search API
            const initialIds = new Set(['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'e1', 'e2', 'e3', 'c1', 'c2', 'c3', 'o1', 'o2', 'o3']);
            userCreated = list.filter(e => !initialIds.has(e.id) && !e.id.startsWith('api-') && !e.id.startsWith('real-'));
          }
        } catch (err) {
          console.error('Error identifying user-created events:', err);
        }

        // Merge user additions with newly retrieved real events from web
        const merged = [...userCreated, ...data.events];
        setEvents(merged);
        localStorage.setItem('floripa_events_db_v3', JSON.stringify(merged));

        let sourceText = 'Servidor';
        if (data.source === 'gemini_search_grounding') {
          sourceText = 'Google Search IA ✦';
        } else if (data.source === 'static_real_fallback') {
          sourceText = 'Eventos Reais (Local)';
        } else if (data.source === 'cache') {
          sourceText = 'Cache da IA ✦';
        } else if (data.source === 'cache_fallback') {
          sourceText = 'Cache local offline';
        }
        if (data.error) {
          const errMsg = String(data.error).toLowerCase();
          if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('exhausted')) {
            sourceText += ' (Cota Limite - Usando Local)';
          } else {
            sourceText += ' (Modo Local)';
          }
        }
        setRealEventsSource(sourceText);
      }
    } catch (e) {
      console.error('Error fetching real events:', e);
      setRealEventsSource('Offline / Fallback Local');
    } finally {
      setIsLoadingRealEvents(false);
    }
  };

  useEffect(() => {
    try {
      const persistedEvents = localStorage.getItem('floripa_events_db_v3');
      if (persistedEvents) {
        let list = JSON.parse(persistedEvents);
        if (Array.isArray(list)) {
          const filtered = list.filter(e => 
            !e.title || e.title.toLowerCase().trim() !== 'feira de artigos culturais'
          );
          if (filtered.length !== list.length) {
            localStorage.setItem('floripa_events_db_v3', JSON.stringify(filtered));
            list = filtered;
          }
        }
        setEvents(list);
      } else {
        setEvents(INITIAL_EVENTS);
        localStorage.setItem('floripa_events_db_v3', JSON.stringify(INITIAL_EVENTS));
      }

      const persistedFavs = localStorage.getItem('floripa_favorites_v3');
      if (persistedFavs) {
        setFavorites(JSON.parse(persistedFavs));
      }
    } catch (e) {
      console.error('Error loading data from localStorage', e);
      setEvents(INITIAL_EVENTS);
    }

    // Proactively fetch real events from search-grounding/node server on mount
    fetchRealEvents();
  }, []);

  // Sync favorites
  const persistFavorites = (nextFavs: string[]) => {
    setFavorites(nextFavs);
    try {
      localStorage.setItem('floripa_favorites_v3', JSON.stringify(nextFavs));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFavorite = (eventId: string) => {
    const isAlreadyFav = favorites.includes(eventId);
    let next: string[];
    if (isAlreadyFav) {
      next = favorites.filter(id => id !== eventId);
    } else {
      next = [...favorites, eventId];
    }
    persistFavorites(next);
  };

  // Sync newly added user events
  const handleAddEvent = (newEvent: CulturalEvent) => {
    const updated = [newEvent, ...events];
    setEvents(updated);
    try {
      localStorage.setItem('floripa_events_db_v3', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const handleDeleteEvent = (eventId: string) => {
    const updated = events.filter(e => e.id !== eventId);
    setEvents(updated);
    try {
      localStorage.setItem('floripa_events_db_v3', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSelectedEventForDetail(null);
    setShowDeleteSuccessToast(true);
    setTimeout(() => {
      setShowDeleteSuccessToast(false);
    }, 4500);
  };

  // Safe Back/Home reset
  const handleHomeReset = () => {
    setSelectedCategory('all');
    setSelectedSubCategory('Bares e Pubs');
    setSelectedDate('');
    setIsOutrosSearched(false);
    setActiveTab('explorer');
  };

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setSelectedDate('');
    if (cat === 'outros') {
      setSelectedSubCategory('Bares e Pubs');
      setIsOutrosSearched(false);
    }
  };

  // Subcategories of "Outros"
  const subCategoriesOutrosList = [
    'Bares e Pubs',
    'Palestras',
    'Restaurantes',
    'Teatro e Espetáculos',
    'Promoções',
    'Exposições',
    'Happy Hour'
  ];

  // Dynamic filtered events list based on the active selection & date input
  const categoryFilteredEvents = useMemo(() => {
    return events.filter(event => {
      if (selectedCategory && selectedCategory !== 'all') {
        if (selectedCategory === 'favorites') {
          return favorites.includes(event.id);
        }
        if (event.category !== selectedCategory) return false;
        if (selectedCategory === 'outros' && selectedSubCategory) {
          if (event.subCategory !== selectedSubCategory) return false;
        }
      } else {
        return false;
      }
      if (selectedDate) {
        if (event.date !== selectedDate) return false;
      }
      return true;
    });
  }, [events, selectedCategory, selectedSubCategory, selectedDate, favorites]);

  return (
    <AndroidFrame onHomeClick={handleHomeReset}>
      {/* Toast feedback for new event suggestions */}
      {showSuccessToast && (
        <div id="toast-notif" className="absolute top-4 left-4 right-4 bg-emerald-600 text-white p-3.5 rounded-2xl shadow-xl z-55 flex items-center gap-2.5 animate-slide-up border border-emerald-500">
          <CheckCircle className="w-5 h-5 text-emerald-100 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold block font-display">Sucesso! Novo evento agendado</span>
            <span>Ele foi adicionado ao Floripa Agora e salvo localmente.</span>
          </div>
        </div>
      )}

      {/* Toast feedback for deleted event suggestions */}
      {showDeleteSuccessToast && (
        <div id="toast-delete-notif" className="absolute top-4 left-4 right-4 bg-red-600 text-white p-3.5 rounded-2xl shadow-xl z-55 flex items-center gap-2.5 animate-slide-up border border-red-500">
          <CheckCircle className="w-5 h-5 text-red-100 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold block font-display">Evento excluído com sucesso!</span>
            <span>O evento sugerido foi removido do seu dispositivo.</span>
          </div>
        </div>
      )}

      {/* Full Bleed Deep Blue App Layout */}
      <div id="viewport-app" className="flex-1 flex flex-col h-full bg-[#062f63] font-sans relative overflow-hidden select-none">
        {/* Glowing circuit tracks background overlay */}
        <CircuitBg />

        {/* Small header actions for suggest */}
        <div className="absolute top-3 right-4 z-40 flex items-center gap-2">
          <button
            onClick={() => setIsSuggestModalOpen(true)}
            className="p-1 px-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 hover:text-white rounded-full transition-all text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-white/15 cursor-pointer"
            title="Sugerir novo evento para a agenda"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Sugerir</span>
          </button>
        </div>

        {/* Dynamic content rendering */}
        {selectedCategory === 'all' ? (
          /* =======================================================
             SCREEN 1: WELCOME SCREEN (IMAGE 1)
             ======================================================= */
          <div className="flex-1 flex flex-col justify-between items-center px-6 py-12 text-center text-white z-10">
            <div className="h-6"></div>

            {/* Greeting Headline Box */}
            <div className="max-w-md my-auto px-1">
              <h1 className="text-base sm:text-xl font-sans font-semibold tracking-wide text-white leading-relaxed">
                Bem-vindo(a) à “Floripa Agora” – A Agenda Cultural de Florianópolis!
              </h1>
            </div>

            {/* White Pill Buttons Layout (Feiras, Shows, Esportes, Cursos, Outros) */}
            <div className="flex flex-col items-center gap-4 w-full max-w-[210px] my-auto">
              {(['feiras', 'shows', 'esportes', 'cursos', 'outros'] as Category[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className="w-full bg-white text-[#2c5fd3] font-bold text-sm py-2 px-6 rounded-full shadow-md hover:bg-slate-100 active:scale-95 transition-all text-center cursor-pointer capitalize"
                >
                  {cat === 'outros' ? 'Outros' : cat}
                </button>
              ))}

              <div className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 p-0.5 rounded-full shadow-lg active:scale-95 transition-all cursor-pointer mt-1">
                <button
                  onClick={() => handleSelectCategory('favorites' as any)}
                  className="w-full bg-[#062f63] hover:bg-[#0c3e7a] text-amber-300 font-extrabold text-xs py-2 px-4 rounded-full flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  Meus Favoritos ({favorites.length})
                </button>
              </div>
            </div>

            {/* Bottom Authors Credits */}
            <div className="text-[10px] text-white/50 tracking-wide font-sans mt-auto leading-relaxed">
              <span>FMP-SC • Taíse da Rosa • Palhoça / SC</span>
            </div>
          </div>
        ) : (
          /* =======================================================
             SCREEN 2-6: CATEGORY & LIST SCREEN (IMAGES 2-6)
             ======================================================= */
          <div className="flex-1 flex flex-col px-6 pt-5 pb-8 text-white z-10 relative h-full">
            {/* Top Exit Navigation Row */}
            <div className="flex justify-between items-center mb-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDate('');
                  setIsOutrosSearched(false);
                }}
                className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors cursor-pointer text-xs font-bold font-sans"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar ao início
              </button>

              {/* Reset Date Filter Helper if Active */}
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="text-[10px] text-sky-200 border border-sky-400/30 bg-sky-500/10 px-2.5 py-0.5 rounded-full font-bold hover:bg-sky-500/20 active:scale-95"
                >
                  Limpar data
                </button>
              )}
            </div>

            {/* 1. Category Title Header */}
            <h2 className="text-[26px] font-display font-black text-center tracking-tight text-white uppercase mt-2 select-none">
              {CATEGORIES_LABELS[selectedCategory]}
            </h2>

            {/* Live API Sync Banner indicating real-time Google Search integrations / localized offline real events */}
            <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] text-white/80 bg-white/5 border border-white/10 p-1 px-3 rounded-full w-fit mx-auto select-none">
              <Sparkles className={`w-3.5 h-3.5 text-sky-300 ${isLoadingRealEvents ? 'animate-spin' : ''}`} />
              <span className="font-semibold tracking-wide">
                {isLoadingRealEvents ? 'Buscando eventos reais na web...' : `API Eventos Reais: Sincronizado via ${realEventsSource || 'Servidor'}`}
              </span>
              <button 
                onClick={() => fetchRealEvents(true)}
                disabled={isLoadingRealEvents}
                type="button"
                className="ml-1 px-1.5 py-0.5 bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-50 text-sky-200 hover:text-white rounded text-[9px] font-black uppercase cursor-pointer transition-all"
              >
                Atualizar
              </button>
            </div>

            {/* First White Horizontal Line */}
            <hr className="border-t border-white opacity-100 my-4" />

            {/* 2. Calendar Grid Text Row */}
            <div className="flex items-center justify-center gap-2.5 mb-2.5 font-sans">
              <SpecialCalendarIcon />
              <span className="text-[16px] sm:text-[18px] font-sans font-medium text-white tracking-wide">
                Informe a data
              </span>
            </div>

            {/* 3. Date Picker Pill Container with Direct Format input */}
            <div className="relative w-full max-w-[210px] h-[38px] mx-auto rounded-full bg-white hover:bg-slate-100 shadow-md transition-all flex items-center mb-4 border border-white/40">
              <input
                type="text"
                value={dateInputVal}
                onChange={handleDateInputChange}
                placeholder="dia/mês/ano"
                className="w-full h-full bg-transparent text-center border-none outline-none text-[#2c5fd3] font-sans font-bold text-[14px] tracking-wide placeholder:text-blue-400/50"
              />
              <div className="absolute right-3.5 top-[9px] w-5 h-5 flex items-center justify-center cursor-pointer pointer-events-none opacity-85 text-[#2c5fd3]">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const rawVal = e.target.value;
                  setSelectedDate(rawVal);
                  if (rawVal) {
                    const [y, m, d] = rawVal.split('-');
                    setDateInputVal(`${d}/${m}/${y}`);
                  } else {
                    setDateInputVal('');
                  }
                  if (selectedCategory === 'outros') {
                    setIsOutrosSearched(true);
                  }
                }}
                className="absolute right-3.5 top-[9px] w-5 h-5 opacity-0 cursor-pointer"
                title="Escolher no calendário"
              />
            </div>

            {/* Second White Horizontal Line */}
            <hr className="border-t border-white opacity-100 my-4" />

            {/* Scrollable Event Content Listing */}
            <div className="flex-grow flex flex-col overflow-hidden min-h-0">
              {selectedCategory === 'outros' && !isOutrosSearched ? (
                /* =======================================================
                   SUB VIEW: "OUTROS" FILTER SELECTOR (IMAGE 6)
                   ======================================================= */
                <div className="flex-grow flex flex-col justify-between overflow-hidden">
                  <div className="flex flex-col gap-2 select-none text-center flex-grow justify-center mb-1">
                    <span className="text-[14px] font-sans font-medium text-white flex items-center justify-center gap-1.5 mb-1.5">
                      Selecione o tipo de evento
                    </span>

                    {/* Blue text in white rounded border container box, centered and elongated */}
                    <div className="border border-white/95 rounded-[24px] bg-[#062f63]/40 backdrop-blur-sm overflow-hidden h-[290px] flex flex-col shadow-inner p-1">
                      <div className="overflow-y-auto custom-scrollbar flex flex-col gap-0.5 py-1 px-1.5 flex-1 select-none">
                        {subCategoriesOutrosList.map(sub => {
                          const isSelected = selectedSubCategory === sub;
                          return (
                            <button
                              key={sub}
                              onClick={() => setSelectedSubCategory(sub)}
                              className={`w-full text-center py-2 px-4 rounded-xl text-[14px] font-sans transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-[#2c5fd3] font-black shadow-sm'
                                  : 'text-white/95 hover:bg-white/5 font-semibold'
                              }`}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* White Pill "Pesquisar" Button */}
                  <button
                    onClick={() => setIsOutrosSearched(true)}
                    className="w-full max-w-[190px] mx-auto bg-white text-[#2c5fd3] font-bold text-sm py-2 px-6 rounded-full shadow-md hover:bg-slate-100 active:scale-95 transition-all text-center mt-2 cursor-pointer select-none"
                  >
                    Pesquisar
                  </button>
                </div>
              ) : (
                /* =======================================================
                   SUB VIEW: EVENTS LIST PREVIEW (IMAGES 2-5)
                   ======================================================= */
                <div className="flex-grow flex flex-col overflow-hidden">
                  {selectedCategory === 'outros' && (
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] text-sky-200 font-bold uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-lg">
                        Filtro: {selectedSubCategory}
                      </span>
                      <button
                        onClick={() => setIsOutrosSearched(false)}
                        className="text-[10px] text-white/80 hover:underline cursor-pointer font-bold"
                      >
                        Alterar Tipo
                      </button>
                    </div>
                  )}

                  {categoryFilteredEvents.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 gap-2">
                      <p className="text-xs text-white/70 font-medium">Nenhum evento registrado nesta data nesta categoria.</p>
                      <button
                        onClick={() => setSelectedDate('')}
                        className="px-3.5 py-1.5 bg-white text-[#2c5fd3] hover:bg-slate-100 active:scale-95 text-[11px] font-black rounded-full transition-all cursor-pointer shadow-md mt-1 font-sans"
                      >
                        Ver todos da categoria
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto pr-3.5 custom-scrollbar flex flex-col gap-6.5 select-text">
                      {categoryFilteredEvents.map(event => {
                        const { titlePart, datePart } = getFormattedEventText(event);
                        const isFree = event.price.toLowerCase().includes('gratuito') || 
                                      event.price.toLowerCase().includes('grátis') || 
                                      event.price.toLowerCase().includes('franca') ||
                                      event.price.toLowerCase().includes('aberta');
                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEventForDetail(event)}
                            className="flex items-start gap-3.5 cursor-pointer text-[13px] sm:text-[14px] leading-relaxed group"
                          >
                            <SpecialCheckIcon />
                            <div className="flex-1 flex flex-col gap-1 select-text">
                              <span className="text-white hover:text-sky-100 transition-colors">
                                <span className="underline font-bold decoration-white/60 underline-offset-4 group-hover:decoration-sky-300">
                                  {titlePart}
                                </span>
                                <span className="font-sans font-medium">{datePart}</span>
                              </span>
                              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase border ${
                                  isFree 
                                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35' 
                                    : 'bg-amber-500/15 text-amber-300 border-amber-500/35'
                                }`}>
                                  {isFree ? '🎟️ Entrada Gratuita' : `💰 Ingresso: ${event.price}`}
                                </span>
                                {event.comunidade && (
                                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/35 tracking-wider uppercase flex items-center gap-0.5">
                                    👥 Sugerido por usuário
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Slide detailed event card drawer view */}
      <EventDetailsDrawer 
        event={selectedEventForDetail} 
        onClose={() => setSelectedEventForDetail(null)}
        isFavorite={selectedEventForDetail ? favorites.includes(selectedEventForDetail.id) : false}
        onToggleFavorite={() => selectedEventForDetail && handleToggleFavorite(selectedEventForDetail.id)}
        onDeleteEvent={handleDeleteEvent}
      />

      {/* Suggest Event Creation Modal form */}
      <AddEventModal 
        isOpen={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        onAddEvent={handleAddEvent}
      />
    </AndroidFrame>
  );
}

// Map mapping names
const CATEGORIES_LABELS: Record<string, string> = {
  feiras: 'Feiras',
  shows: 'Shows',
  esportes: 'Esportes',
  cursos: 'Cursos',
  outros: 'Outros',
  favorites: 'Meus Favoritos'
};

// Date formatting helper
function formatToDisplayDate(dateStr: string) {
  if (!dateStr) return 'dd/mm/aaaa';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

// Text formatting helper
function getFormattedEventText(event: CulturalEvent) {
  if (event.id === 'f1') {
    return {
      titlePart: "Feira de camisas de futebol de Florianópolis",
      datePart: " - Data de realização: 14/03/2026 09:00 - 14/03/2026 19:00"
    };
  }
  if (event.id === 'f2') {
    return {
      titlePart: "Feira de Colecionismo",
      datePart: ": nos dias 06, 07 e 08 de março (sexta, sábado e domingo), no corredor das Lojas Americanas (entrada gratuita)"
    };
  }
  if (event.id === 's1') {
    return {
      titlePart: "Projeto Mini Tour - Especial Soul Brasileiro no Tetro Pedro Ivo",
      datePart: " - Data de realização: 21/05/2026 20:00 - 21/05/2026 22:00"
    };
  }
  if (event.id === 's2') {
    return {
      titlePart: "Tradicional Baile das Mães do Lira Tênis Clube",
      datePart: " - Data de realização: 15/05/2026 21:00 - 16/05/2026 00:00"
    };
  }
  if (event.id === 'e1') {
    return {
      titlePart: "Transmissão da Copa do Mundo em Florianópolis: Villa Romana Shopping",
      datePart: " - Data de realização: 11/06/2026 10:00 - 19/07/2026 22:00"
    };
  }
  if (event.id === 'c1') {
    return {
      titlePart: "Aulas de Surf em Florianópolis",
      datePart: " - Data de realização: 08/04/2026 07:00 - 30/12/2026 22:00"
    };
  }
  // Fallback
  const dStr = event.date.split('-').reverse().join('/');
  return {
    titlePart: event.title,
    datePart: ` - Data de realização: ${dStr} ${event.time} - ${dStr} 22:00`
  };
}

// Custom highly realistic calendar icon
function SpecialCalendarIcon() {
  return (
    <svg className="w-8 h-8 text-white stroke-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" />
      <circle cx="7" cy="14" r="1.5" fill="currentColor" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
      <circle cx="7" cy="18" r="1.5" fill="currentColor" />
      <path d="M11 18l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Special check circle icon
function SpecialCheckIcon() {
  return (
    <svg className="w-5 h-5 text-white stroke-[2.5] shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Procedural Circuit Background renderer
function CircuitBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Radial Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e3d7c] via-[#062f63] to-[#02142d]"></div>
      
      {/* Techno circuitry graphics matching screenshots */}
      <svg className="absolute inset-0 w-full h-full opacity-45 stroke-[#2c5fd3] stroke-[1.2]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-light" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g filter="url(#glow-light)" opacity="0.6">
          <path d="M -50 200 L 150 200 L 250 300 L 250 450 L 350 550 L 500 550" fill="none" />
          <path d="M 400 100 L 300 200 L 200 200 L 120 280 L 120 400 L 50 470" fill="none" strokeDasharray="4 4" />
          <path d="M 100 700 L 220 580 L 300 580 L 380 660 L 380 800" fill="none" />
          <path d="M 450 350 L 350 350 L 280 420 L 150 420" fill="none" />
          <path d="M 50 50 L 120 120 L 280 120 L 310 150" fill="none" />
        </g>

        <g fill="#2c5fd3" filter="url(#glow-light)">
          <circle cx="150" cy="200" r="4" />
          <circle cx="250" cy="300" r="4" />
          <circle cx="350" cy="550" r="4" />
          <circle cx="300" cy="200" r="4" />
          <circle cx="120" cy="280" r="4" />
          <circle cx="120" cy="400" r="4" />
          <circle cx="220" cy="580" r="4" />
          <circle cx="300" cy="580" r="4" />
          <circle cx="380" cy="660" r="4" />
          <circle cx="350" cy="350" r="4" />
          <circle cx="280" cy="420" r="4" />
          <circle cx="120" cy="120" r="4" />
          <circle cx="280" cy="120" r="4" />
        </g>

        <g fill="#93c5fd" opacity="0.45">
          <circle cx="100" cy="150" r="1.5" />
          <circle cx="320" cy="450" r="1.5" />
          <circle cx="80" cy="620" r="1.5" />
          <circle cx="390" cy="220" r="1.5" />
          <circle cx="180" cy="720" r="1.5" />
        </g>
      </svg>
    </div>
  );
}
