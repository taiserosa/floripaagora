/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calendar, MapPin, DollarSign, Clock, Tag } from 'lucide-react';
import { CulturalEvent, Category } from '../types';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: CulturalEvent) => void;
}

const NEIGHBORHOODS = [
  { name: 'Agronômica', lat: -27.5802, lng: -48.5146 },
  { name: 'Centro', lat: -27.5969, lng: -48.5494 },
  { name: 'Lagoa da Conceição', lat: -27.6033, lng: -48.4635 },
  { name: 'Campeche', lat: -27.6833, lng: -48.4833 },
  { name: 'Jurerê Internacional', lat: -27.4412, lng: -48.4988 },
  { name: 'Santo Antônio de Lisboa', lat: -27.5028, lng: -48.5147 },
  { name: 'Saco Grande', lat: -27.5485, lng: -48.5042 },
  { name: 'Trindade', lat: -27.5862, lng: -48.5229 },
  { name: 'Coqueiros', lat: -27.6067, lng: -48.5775 },
  { name: 'Ingleses', lat: -27.4356, lng: -48.3978 },
  { name: 'Joaquina', lat: -27.6288, lng: -48.4475 }
];

const SUB_CATEGORIES_OUTROS = [
  'Bares e Pubs',
  'Palestras',
  'Restaurantes',
  'Teatro e Espetáculos',
  'Promoções',
  'Exposições',
  'Happy Hour'
];

export default function AddEventModal({ isOpen, onClose, onAddEvent }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('shows');
  const [subCategory, setSubCategory] = useState('Bares e Pubs');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [neighborhood, setNeighborhood] = useState('Centro');
  const [address, setAddress] = useState('');
  const [priceType, setPriceType] = useState<'free' | 'paid'>('free');
  const [priceValue, setPriceValue] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Título é obrigatório';
    if (!description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!date) newErrors.date = 'Data é obrigatória';
    if (!time) newErrors.time = 'Hora é obrigatória';
    if (!locationName.trim()) newErrors.locationName = 'Nome do local é obrigatório';
    if (!address.trim()) newErrors.address = 'Endereço é obrigatório';
    if (priceType === 'paid' && !priceValue.trim()) {
      newErrors.price = 'Informe o valor do ingresso';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedNeigh = NEIGHBORHOODS.find(n => n.name === neighborhood) || NEIGHBORHOODS[1]; // default Centro
    
    // Choose dynamic stock illustration based on Category
    const categoryPics: Record<Category, string> = {
      shows: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
      feiras: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80',
      esportes: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
      cursos: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
      outros: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    };

    const newEvent: CulturalEvent = {
      id: String(Date.now()),
      title,
      description,
      category,
      subCategory: category === 'outros' ? subCategory : undefined,
      date,
      time,
      locationName,
      neighborhood,
      address,
      latitude: selectedNeigh.lat,
      longitude: selectedNeigh.lng,
      price: priceType === 'free' ? 'Gratuito' : `R$ ${priceValue}`,
      imageUrl: categoryPics[category],
      featured: false,
      comunidade: true
    };

    onAddEvent(newEvent);
    
    // Reset fields
    setTitle('');
    setDescription('');
    setCategory('shows');
    setSubCategory('Bares e Pubs');
    setDate('');
    setTime('');
    setLocationName('');
    setNeighborhood('Centro');
    setAddress('');
    setPriceType('free');
    setPriceValue('');
    setErrors({});
    onClose();
  };

  return (
    <div id="add-event-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" style={{ contentVisibility: 'auto' }}>
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative max-h-[90vh] flex flex-col border border-slate-100 overflow-hidden">
        {/* Header decoration in blue representing FMP/Floripa Agora branding */}
        <div className="bg-gradient-to-r from-[#062f63] to-[#2c5fd3] px-6 py-4 flex items-center justify-between text-white shadow-sm">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Sugerir Novo Evento</h3>
            <p className="text-xs text-blue-100 font-medium font-sans">Faculdade Municipal de Palhoça (FMP-SC) • Projeto Acadêmico</p>
          </div>
          <button 
            id="close-add-event-modal"
            onClick={onClose} 
            className="p-1.5 hover:bg-white/20 active:bg-white/30 rounded-full transition-all duration-150 cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form Body scrollable */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-slate-850">
          
          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-slate-650 uppercase tracking-widest mb-1 font-display">Nome do Evento</label>
            <div className="relative">
              <input
                id="event-title-input"
                type="text"
                placeholder="Ex. Baile de Aniversário Lira Clube"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl outline-none text-sm transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-105 ${
                  errors.title ? 'border-red-400 bg-red-50/50' : 'border-slate-205'
                }`}
              />
            </div>
            {errors.title && <span className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.title}</span>}
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-bold text-slate-650 uppercase tracking-widest mb-1.5 font-display">Categoria / Seção</label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['feiras', 'shows', 'esportes', 'cursos', 'outros'] as Category[]).map(cat => {
                const labels: Record<Category, string> = {
                  feiras: 'Feira',
                  shows: 'Show',
                  esportes: 'Esporte',
                  cursos: 'Curso',
                  outros: 'Outros'
                };
                return (
                  <button
                    key={cat}
                    type="button"
                    id={`modal-cat-btn-${cat}`}
                    onClick={() => setCategory(cat)}
                    className={`text-[11px] py-2 px-1 rounded-xl border text-center font-bold transition-all cursor-pointer truncate ${
                      category === cat
                        ? 'bg-[#2c5fd3] border-[#2c5fd3] text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {labels[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategory Outros Dropdown (Only visible if Category is 'outros') */}
          {category === 'outros' && (
            <div className="animate-slide-up bg-blue-50/40 p-3 rounded-2xl border border-blue-50/80">
              <label className="block text-xs font-bold text-[#062f63] uppercase tracking-widest mb-1 font-display">Tipo do Evento (Seção Outros)</label>
              <select
                id="event-subcategory-input"
                value={subCategory}
                onChange={e => setSubCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl outline-none text-xs font-semibold focus:border-blue-600"
              >
                {SUB_CATEGORIES_OUTROS.map(sub => (
                  <option key={sub} value={sub}>
                    ⚙️ {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Descrição */}
          <div>
            <label className="block text-xs font-bold text-slate-655 uppercase tracking-widest mb-1 font-display">Descrição curta</label>
            <textarea
              id="event-desc-input"
              rows={3}
              placeholder="Descreva detalhes, atrações e informações complementares importantes sobre o evento..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl outline-none text-sm transition-all focus:border-blue-650 focus:ring-2 focus:ring-blue-105 resize-none ${
                errors.description ? 'border-red-400 bg-red-50/50' : 'border-slate-205'
              }`}
            />
            {errors.description && <span className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.description}</span>}
          </div>

          {/* Data e Hora lateral */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-655 uppercase tracking-widest mb-1 flex items-center gap-1 font-display">
                <Calendar className="w-3 h-3 text-[#2c5fd3]" /> Data
              </label>
              <input
                id="event-date-input"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className={`w-full px-2 py-2 border rounded-xl outline-none text-xs transition-all focus:border-blue-600 ${
                  errors.date ? 'border-red-400 bg-red-50/50' : 'border-slate-205'
                }`}
              />
              {errors.date && <span className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.date}</span>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-655 uppercase tracking-widest mb-1 flex items-center gap-1 font-display">
                <Clock className="w-3 h-3 text-[#2c5fd3]" /> Hora de Início
              </label>
              <input
                id="event-time-input"
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className={`w-full px-2 py-2 border rounded-xl outline-none text-xs transition-all focus:border-blue-600 ${
                  errors.time ? 'border-red-400 bg-red-50/50' : 'border-slate-205'
                }`}
              />
              {errors.time && <span className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.time}</span>}
            </div>
          </div>

          {/* Nome do Local e Bairro */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-655 uppercase tracking-widest mb-1 flex items-center gap-1 font-display">
                <MapPin className="w-3 h-3 text-[#2c5fd3]" /> Local Realização
              </label>
              <input
                id="event-loc-name-input"
                type="text"
                placeholder="Ex. Teatro Pedro Ivo"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl outline-none text-sm transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-105 ${
                  errors.locationName ? 'border-red-400 bg-red-50/50' : 'border-slate-205'
                }`}
              />
              {errors.locationName && <span className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.locationName}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-655 uppercase tracking-widest mb-1 font-display">Bairro / Região</label>
              <select
                id="event-neigh-input"
                value={neighborhood}
                onChange={e => setNeighborhood(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl outline-none text-sm focus:border-blue-600 focus:ring-2"
              >
                {NEIGHBORHOODS.map(n => (
                  <option key={n.name} value={n.name}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-xs font-bold text-slate-655 uppercase tracking-widest mb-1 font-display">Endereço Completo</label>
            <input
              id="event-address-input"
              type="text"
              placeholder="Ex. Rodovia SC-401, Km 4"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl outline-none text-sm transition-all focus:border-blue-650 focus:ring-2 ${
                errors.address ? 'border-red-405 bg-red-50/50' : 'border-slate-205'
              }`}
            />
            {errors.address && <span className="text-[10px] text-red-500 font-semibold mt-0.5">{errors.address}</span>}
          </div>

          {/* Ingresso / Preço */}
          <div id="price-section" className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <label className="block text-xs font-bold text-slate-655 uppercase tracking-widest mb-2 flex items-center gap-1 font-display">
              <DollarSign className="w-3.5 h-3.5 text-[#2c5fd3]" /> Ingresso Acadêmico / Comercial
            </label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-2 text-xs text-slate-700 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  value="free"
                  checked={priceType === 'free'}
                  onChange={() => setPriceType('free')}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                Gratuito
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  value="paid"
                  checked={priceType === 'paid'}
                  onChange={() => setPriceType('paid')}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                Pago / Valor Cobrado
              </label>
            </div>

            {priceType === 'paid' && (
              <div className="flex items-center gap-2 mt-1.5 animate-slide-up">
                <span className="text-sm font-bold text-slate-500">R$</span>
                <input
                  id="event-price-input"
                  type="text"
                  placeholder="Ex. 40,00"
                  value={priceValue}
                  onChange={e => setPriceValue(e.target.value)}
                  className={`w-full px-3 py-1.5 border rounded-xl outline-none text-sm transition-all focus:border-blue-600 ${
                    errors.price ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
            )}
            {errors.price && <span className="text-[10px] text-red-500 font-semibold mt-0.5 block">{errors.price}</span>}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              id="cancel-add-event-btn"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-extrabold uppercase tracking-wide text-slate-600 bg-slate-100 active:bg-slate-200 hover:bg-slate-100/80 rounded-2xl transition-all duration-200 cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="submit-add-event-btn"
              className="flex-1 py-3 text-xs font-extrabold uppercase tracking-wide text-white bg-[#062f63] hover:bg-[#2c5fd3] active:bg-[#062f63] rounded-2xl shadow-md cursor-pointer text-center transition-all duration-200"
            >
              Salvar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
