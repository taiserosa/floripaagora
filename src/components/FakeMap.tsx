/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, Car, Bus, Bike, Navigation } from 'lucide-react';

interface FakeMapProps {
  locationName: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
}

export default function FakeMap({ locationName, neighborhood, latitude, longitude }: FakeMapProps) {
  const [transportMode, setTransportMode] = useState<'car' | 'bus' | 'bike'>('car');
  const [loadingRoute, setLoadingRoute] = useState(false);

  useEffect(() => {
    setLoadingRoute(true);
    const timer = setTimeout(() => {
      setLoadingRoute(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [transportMode, latitude, longitude]);

  // Interpolate coordinate to coordinate system in our 200x300 SVG Florianopolis grid
  // Florianopolis is approx: Latitude -27.35 to -27.85, Longitude -48.35 to -48.60
  const mapY = Math.max(10, Math.min(290, ((latitude - (-27.40)) / (-0.45)) * 280 + 10));
  const mapX = Math.max(10, Math.min(190, ((longitude - (-48.62)) / (0.28)) * 180 + 10));

  // Default "You are here" pin (Centro / Ponte Hercílio Luz area)
  const userX = 75;
  const userY = 120;

  // Let's draw some simulated points
  const landmarks = [
    { name: 'Centro / TiCen', x: 75, y: 120 },
    { name: 'Lagoa da Conceição', x: 125, y: 140 },
    { name: 'Jurerê Internacional', x: 105, y: 40 },
    { name: 'Campeche', x: 130, y: 220 },
    { name: 'Santo Antônio de Lisboa', x: 90, y: 80 },
    { name: 'Canasvieiras', x: 135, y: 30 }
  ];

  // Route statistics based on distance
  const getRouteStats = () => {
    const distFactor = Math.sqrt(Math.pow(mapX - userX, 2) + Math.pow(mapY - userY, 2));
    const km = Math.round(distFactor * 0.18 + 2);
    
    switch (transportMode) {
      case 'car':
        return {
          time: `${Math.round(km * 1.5 + 4)} min`,
          summary: 'Via SC-401 ou Rodvia Beira-Mar',
          distance: `${km} km`,
          cost: `R$ ${Math.round(km * 0.65 + 3)} (Gasolina)`,
          instruction: 'Rotas desimpedidas ruma a ' + neighborhood
        };
      case 'bus':
        return {
          time: `${Math.round(km * 3.5 + 15)} min`,
          summary: 'Conexão via TI-CEN ou Terminal do Bairro',
          distance: `${km} km`,
          cost: 'R$ 6,00 (Consorcio Fênix)',
          instruction: 'Embarcar na integração mais próxima de Florianópolis'
        };
      case 'bike':
        return {
          time: `${Math.round(km * 4 + 10)} min`,
          summary: 'Via ciclovias e acostamentos',
          distance: `${km} km`,
          cost: 'Gratuito',
          instruction: 'Pedale com atenção especial no trânsito urbano'
        };
    }
  };

  const stats = getRouteStats();

  return (
    <div id="fake-map-container" className="bg-slate-50 border border-slate-100 rounded-2xl p-4 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-600 animate-spin-slow" />
          <span className="text-sm font-semibold text-slate-800">Mapa de Floripa (Simulação)</span>
        </div>
        <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded-full">
          Gps Ativo
        </span>
      </div>

      <div className="relative w-full h-[220px] bg-sky-100/65 rounded-xl border border-sky-100 overflow-hidden flex items-center justify-center">
        {/* SVG Drawing the beautiful island contour map of Florianópolis */}
        <svg viewBox="0 0 200 300" className="absolute inset-0 w-full h-full text-emerald-500 fill-emerald-100 stroke-emerald-300 stroke-2" style={{ maxHeight: '100%' }}>
          {/* Outer ocean background is canvas background */}
          {/* Continent portion */}
          <path d="M -10,80 Q -5,100 10,110 T 30,140 T 15,180 T -10,210 L -10,310 L -20,310 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
          
          {/* Island Body of Santa Catarina */}
          <path d="
            M 110,12 
            Q 135,10 150,25 
            Q 160,35 155,55 
            Q 165,70 150,90 
            Q 170,115 155,140 
            Q 160,165 145,185 
            Q 155,200 135,225 
            Q 145,245 125,270 
            Q 115,290 100,292
            Q 90,294 92,275
            Q 85,260 100,240
            Q 95,220 110,200
            Q 90,175 105,150
            Q 75,135 70,125
            Q 65,115 80,105
            Q 95,95 85,80
            Q 85,65 100,45
            Q 90,30 110,12 
            Z" 
            fill="#dcfce7" 
            stroke="#a7f3d0" 
            strokeWidth="2" 
          />

          {/* Bridges connection (Arthur Caton / Hercílio Luz / Pedro Ivo) */}
          <line x1="30" y1="130" x2="70" y2="125" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3,1" />

          {/* Landmarks labels for fun styling */}
          <text x="35" y="115" fontSize="5" fill="#64748b" fontWeight="bold">Ponte</text>
          <text x="95" y="25" fontSize="5" fill="#475569">Jurerê</text>
          <text x="135" y="145" fontSize="5" fill="#475569">Lagoa</text>
          <text x="132" y="235" fontSize="5" fill="#475569">Campeche</text>

          {/* ROUTE LINE */}
          {!loadingRoute && (
            <path 
              d={`M ${userX},${userY} Q ${(userX + mapX)/2 - 10},${(userY + mapY)/2 - 15} ${mapX},${mapY}`}
              fill="none" 
              stroke={transportMode === 'car' ? '#2563eb' : transportMode === 'bus' ? '#ea580c' : '#16a34a'} 
              strokeWidth="2.5" 
              strokeLinecap="round"
              strokeDasharray={transportMode === 'bus' ? '6,3' : 'none'}
              className="animate-[dash_2s_linear_infinite]"
            />
          )}

          {/* Start Location Pin (Centro) */}
          <circle cx={userX} cy={userY} r="8" fill="#3b82f6" fillOpacity="0.2" className="animate-pulse" />
          <circle cx={userX} cy={userY} r="3" fill="#2563eb" stroke="#ffffff" strokeWidth="1" />

          {/* Target Event Location Pin (Dynamic) */}
          <g transform={`translate(${mapX}, ${mapY})`}>
            <circle cx="0" cy="0" r="10" fill="#ef4444" fillOpacity="0.2" className="animate-pulse" />
            {/* Custom pin icon shape */}
            <path 
              d="M 0,-7 C -3,-7 -5,-5 -5,-2 C -5,2 0,7 0,7 C 0,7 5,2 5,-2 C 5,-5 3,-7 0,-7 Z" 
              fill="#ef4444" 
              stroke="#ffffff" 
              strokeWidth="0.8" 
            />
            <circle cx="0" cy="-2" r="1.5" fill="#ffffff" />
          </g>
        </svg>

        {loadingRoute && (
          <div id="route-loading-overlay" className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-500 font-medium">Autocalculando melhor rota...</span>
          </div>
        )}

        {/* Dynamic floating navigation indicator */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md border border-slate-100 rounded-lg px-2 py-1 flex items-center gap-1.5 shadow-sm text-[10px] font-semibold text-slate-700">
          <Navigation className="w-3 h-3 text-blue-600 animate-bounce" />
          <span>Sua Localização → {neighborhood}</span>
        </div>
      </div>

      {/* Transit mode selectors and itinerary cards */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <button
          id={`mode-car-btn`}
          onClick={() => setTransportMode('car')}
          className={`flex flex-col items-center py-2 px-1 rounded-xl border text-xs transition-all duration-250 cursor-pointer ${
            transportMode === 'car'
              ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium shadow-sm'
              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Car className="w-4 h-4 mb-1" />
          <span>De Carro</span>
        </button>

        <button
          id={`mode-bus-btn`}
          onClick={() => setTransportMode('bus')}
          className={`flex flex-col items-center py-2 px-1 rounded-xl border text-xs transition-all duration-250 cursor-pointer ${
            transportMode === 'bus'
              ? 'bg-orange-50 border-orange-200 text-orange-700 font-medium shadow-sm'
              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Bus className="w-4 h-4 mb-1" />
          <span>De Ônibus</span>
        </button>

        <button
          id={`mode-bike-btn`}
          onClick={() => setTransportMode('bike')}
          className={`flex flex-col items-center py-2 px-1 rounded-xl border text-xs transition-all duration-250 cursor-pointer ${
            transportMode === 'bike'
              ? 'bg-green-50 border-green-200 text-green-700 font-medium shadow-sm'
              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Bike className="w-4 h-4 mb-1" />
          <span>De Bicicleta</span>
        </button>
      </div>

      {/* Route Info Panel */}
      <div className="mt-3 p-3 bg-white border border-slate-100 rounded-xl flex flex-col gap-1 text-slate-700 shadow-sm animate-fade-in">
        <div className="flex justify-between items-center border-b border-slate-50 pb-1.5 mb-1">
          <span className="text-xs text-slate-400 font-medium">Estimativa de Tempo</span>
          <span className="text-sm font-bold text-slate-800">{stats.time}</span>
        </div>
        <div className="text-xs font-semibold text-slate-800">Direções: {stats.instruction}</div>
        <div className="text-[11px] text-slate-500 flex justify-between mt-1">
          <span>Distância: {stats.distance}</span>
          <span className="font-semibold text-blue-600">{stats.cost}</span>
        </div>
        <div className="text-[10px] text-slate-400 italic mt-1.5 border-t border-slate-100 pt-1 text-center">
          {stats.summary} • Dados fictícios sincronizados em tempo real.
        </div>
      </div>
    </div>
  );
}
