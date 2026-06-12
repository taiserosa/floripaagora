/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, BatteryCharging, Signal, Sparkles, Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  onHomeClick?: () => void;
}

export default function AndroidFrame({ children, onHomeClick }: AndroidFrameProps) {
  const [currentTime, setCurrentTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(82);
  const [isCharging, setIsCharging] = useState(false);
  const [fullscreenMode, setFullscreenMode] = useState(false);

  // Simple clock logic
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 10000);
    return () => clearInterval(timer);
  }, []);

  // Soft battery decay/tap charging for interaction
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => {
        if (isCharging) {
          if (prev >= 100) {
            setIsCharging(false);
            return 100;
          }
          return prev + 1;
        } else {
          return prev > 5 ? prev - 1 : 100; // auto refill at 5
        }
      });
    }, 60000); // 1 min

    return () => clearInterval(interval);
  }, [isCharging]);

  const handleBatteryClick = () => {
    setIsCharging(true);
    setBatteryLevel(prev => Math.min(100, prev + 10));
    setTimeout(() => {
      setIsCharging(false);
    }, 5000);
  };

  return (
    <div id="layout-envelope" className="min-h-screen bg-slate-900 flex flex-col items-center justify-center font-sans relative antialiased overflow-hidden p-0 sm:p-4">
      
      {/* Background decorations - lovely blue glowing spheres */}
      <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none"></div>

      {/* Floating control widget at top of desktop screens */}
      <div className="hidden lg:flex items-center gap-3 bg-slate-800/80 border border-slate-700 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg text-xs text-white z-40 mb-3 font-semibold transition-all hover:bg-slate-800">
        <Sparkles className="w-4 h-4 text-blue-400" />
        <span>FMP-SC • Floripa Agora • Projeto de Taíse da Rosa</span>
        <div className="h-4 w-px bg-slate-700 mx-1"></div>
        <button
          id="toggle-viewmode"
          onClick={() => setFullscreenMode(!fullscreenMode)}
          className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-[11px] rounded-full transition-all cursor-pointer font-bold uppercase tracking-wider"
        >
          {fullscreenMode ? (
            <>
              <Smartphone className="w-3.5 h-3.5" />
              Ver modo smartphone
            </>
          ) : (
            <>
              <Monitor className="w-3.5 h-3.5" />
              Ver tela cheia
            </>
          )}
        </button>
      </div>

      {/* Main viewport frame */}
      <div 
        id="device-container"
        className={`relative transition-all duration-500 ${
          fullscreenMode 
            ? 'w-full max-w-7xl h-[92vh] rounded-3xl shadow-2xl border border-slate-700 overflow-hidden bg-white' 
            : 'w-full sm:w-[410px] h-full sm:h-[840px] rounded-[52px] sm:border-[12px] sm:border-slate-800 sm:shadow-2xl bg-white sm:ring-8 sm:ring-slate-700/30 flex flex-col overflow-hidden text-slate-800'
        }`}
      >
        
        {/* Physical Camera element (Only shown in mobile frame mode) */}
        {!fullscreenMode && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center z-50 pointer-events-none hidden sm:block">
            <div className="w-1.5 h-1.5 bg-blue-900 rounded-full"></div>
          </div>
        )}

        {/* Android Status Bar (Native look, responsive colors) */}
        <div 
          id="android-status-bar" 
          className="h-8 bg-blue-900 text-white px-6 flex items-center justify-between text-xs font-semibold z-40 pointer-events-none tracking-tight shrink-0 select-none"
        >
          <span>{currentTime || '11:20'}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-white/90" />
            <Wifi className="w-3.5 h-3.5 text-white/90" />
            <div 
              className="flex items-center gap-0.5 pointer-events-auto cursor-pointer" 
              onClick={handleBatteryClick}
              title="Clique para recarregar simulador"
            >
              {isCharging ? (
                <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <Battery className="w-4 h-4 text-white/90" />
              )}
              <span className="text-[10px] text-white/80">{batteryLevel}%</span>
            </div>
          </div>
        </div>

        {/* Inner Content Area (The actual react applet is injected here) */}
        <div id="android-webview" className="flex-1 min-h-0 w-full flex flex-col bg-slate-50 relative">
          {children}
        </div>

        {/* Android Bottom Navigation Pill Bar (Classic visual accent) */}
        {!fullscreenMode && (
          <div 
            id="android-bottom-gestures" 
            className="h-7 bg-slate-900/95 flex items-center justify-center flex-col shrink-0 relative z-40 text-white/65 border-t border-slate-800 select-none hidden sm:flex"
          >
            {/* Soft simulation buttons */}
            <div className="flex items-center justify-around w-full max-w-[280px] h-full text-slate-400 py-1">
              <button 
                id="android-back-btn" 
                onClick={onHomeClick} 
                className="hover:text-white cursor-pointer p-1 active:scale-90 transition-transform text-xs uppercase font-extrabold tracking-widest flex items-center gap-1"
                title="Voltar ao início"
              >
                ◀︎
              </button>
              <button 
                id="android-home-btn" 
                onClick={onHomeClick} 
                className="w-10 h-3 hover:bg-slate-700/80 bg-slate-600 rounded-full transition-all cursor-pointer"
                title="Ir para Principal de Floripa"
              ></button>
              <button 
                id="android-recents-btn" 
                onClick={() => alert('Floripa Cultura Agenda - Desenvolvido no AI Studio!')} 
                className="hover:text-white cursor-pointer px-2 text-sm"
                title="Recentes"
              >
                ■
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating suggestion for non-desktop frame indicators */}
      <p className="text-[11px] text-slate-500 text-center mt-3 max-w-sm pointer-events-none block lg:hidden">
        Visualizando em celular padrão. No Desktop, veja opções extras de tela cheia.
      </p>
    </div>
  );
}
