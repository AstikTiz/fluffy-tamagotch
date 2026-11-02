import React, { useState } from 'react';
import { Pet, ReactionState, EmotionFood, IncomingLetter } from '../types';
import { FluffyPetAvatar } from './FluffyPetAvatar';
import { sounds } from '../utils/audio';
import {
  Heart,
  Footprints,
  Mail,
  Palette,
  Cloud,
  Users,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  Info,
  Clock,
  Compass,
  Monitor
} from 'lucide-react';

interface DesktopWidgetProps {
  pet: Pet;
  reaction: ReactionState;
  onPetClick: () => void;
  onOpenFeed: () => void;
  onOpenPark: () => void;
  onOpenMail: () => void;
  onOpenCustomization: () => void;
  onOpenCloudSync: () => void;
  onOpenPetSelector: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  widgetMode: 'desktop' | 'compact' | 'window';
  onSetWidgetMode: (mode: 'desktop' | 'compact' | 'window') => void;
  desktopThemeClass: string;
  letters: IncomingLetter[];
}

export const DesktopWidget: React.FC<DesktopWidgetProps> = ({
  pet,
  reaction,
  onPetClick,
  onOpenFeed,
  onOpenPark,
  onOpenMail,
  onOpenCustomization,
  onOpenCloudSync,
  onOpenPetSelector,
  soundEnabled,
  onToggleSound,
  widgetMode,
  onSetWidgetMode,
  desktopThemeClass,
  letters,
}) => {
  const unreadCount = letters.filter((l) => !l.read).length;
  const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDateStr = new Date().toLocaleDateString('ru-RU', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between overflow-hidden select-none">
      {/* Desktop Background & Atmosphere */}
      <div className={`absolute inset-0 -z-10 ${desktopThemeClass} transition-colors duration-700`}>
        {/* Soft atmospheric gradient blurs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Top Desktop Bar */}
      <header className="px-6 py-3 bg-slate-950/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between text-xs text-slate-300 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-black text-white text-sm tracking-tight">
            <span className="text-pink-400">🐾</span>
            <span>Тамагочи Виджет</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Питомец: <strong className="text-pink-300">{pet.name}</strong></span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-slate-400 border border-white/5">
            Ур. {pet.stats.level}
          </span>
        </div>

        {/* Top Right Status & Controls */}
        <div className="flex items-center gap-3">
          {/* Unread Mail Pill */}
          <button
            onClick={onOpenMail}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
              unreadCount > 0
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Почта</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Звук включён' : 'Звук выключен'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Cloud Sync */}
          <button
            onClick={onOpenCloudSync}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-xs font-semibold transition-all"
            title="Облачная синхронизация устройств"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Облако</span>
          </button>

          {/* Clock */}
          <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-white/10 font-bold text-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentTimeStr}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-4 z-10">
        {/* Floating Desktop Tamagotchi Widget Card */}
        <div className="relative w-full max-w-sm rounded-[36px] bg-slate-900/75 dark:bg-slate-950/80 backdrop-blur-2xl border border-white/15 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col items-center">
          {/* Card Upper Controls */}
          <div className="w-full flex items-center justify-between mb-2">
            <button
              onClick={onOpenPetSelector}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-bold text-slate-300 hover:text-white transition-all"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Сменить питомца</span>
            </button>

            <button
              onClick={onOpenCustomization}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-[11px] font-bold text-purple-300 transition-all"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Внешность</span>
            </button>
          </div>

          {/* Central Pet Avatar */}
          <div className="my-2">
            <FluffyPetAvatar
              pet={pet}
              reaction={reaction}
              onPetClick={onPetClick}
              size={210}
            />
          </div>

          {/* Pet Name & Activity Tag */}
          <div className="text-center mt-1 mb-4">
            <h1 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
              <span>{pet.name}</span>
              <span className="text-sm">
                {pet.species === 'bunny'
                  ? '🐰'
                  : pet.species === 'fox'
                  ? '🦊'
                  : pet.species === 'bear'
                  ? '🐻'
                  : '🐲'}
              </span>
            </h1>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
              {pet.activityLevel === 'sleepy'
                ? 'Уютная Сплюшка 💤'
                : pet.activityLevel === 'calm'
                ? 'Спокойный Дзен 🍵'
                : pet.activityLevel === 'playful'
                ? 'Игривый Попрыгун 🐾'
                : 'Молниеносный Энерджайзер ⚡'}
            </p>
          </div>

          {/* Vital Stats Gauges */}
          <div className="w-full grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/60 border border-white/5 mb-4 text-center">
            {/* Happiness */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 mb-0.5 flex items-center justify-center gap-1">
                <span>💖 Счастье</span>
              </div>
              <div className="text-sm font-black text-pink-400">
                {Math.round(pet.stats.happiness)}%
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300"
                  style={{ width: `${pet.stats.happiness}%` }}
                />
              </div>
            </div>

            {/* Satiety / Emotion Hunger */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 mb-0.5 flex items-center justify-center gap-1">
                <span>✨ Сытость</span>
              </div>
              <div className="text-sm font-black text-amber-400">
                {Math.round(pet.stats.satiety)}%
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300"
                  style={{ width: `${pet.stats.satiety}%` }}
                />
              </div>
            </div>

            {/* Steps & Walk */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 mb-0.5 flex items-center justify-center gap-1">
                <span>🌲 Шаги</span>
              </div>
              <div className="text-sm font-black text-emerald-400">
                {pet.stats.stepsWalked}
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, (pet.stats.stepsWalked % 200) / 2)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons: Feed Emotions & Walk in Park */}
          <div className="w-full grid grid-cols-2 gap-2.5">
            <button
              onClick={onOpenFeed}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white font-extrabold text-xs shadow-lg shadow-pink-500/25 hover:from-pink-400 hover:to-pink-500 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>Покормить</span>
            </button>

            <button
              onClick={onOpenPark}
              className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Footprints className="w-4 h-4" />
              <span>Выгулять</span>
            </button>
          </div>

          <div className="mt-3 text-[10px] text-slate-500 text-center">
            Нажмите на пушистика, чтобы погладить и услышать мурлыканье!
          </div>
        </div>
      </main>

      {/* Bottom Desktop Taskbar / Dock */}
      <footer className="px-6 py-3 bg-slate-950/60 backdrop-blur-md border-t border-white/5 flex items-center justify-between text-xs z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPark}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Виртуальный Парк</span>
          </button>

          <button
            onClick={onOpenMail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs font-semibold"
          >
            <Mail className="w-3.5 h-3.5 text-pink-400" />
            <span>Почтовая Станция</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span>Облачный статус: <strong className="text-emerald-400">Синхронизировано</strong></span>
        </div>
      </footer>
    </div>
  );
};
