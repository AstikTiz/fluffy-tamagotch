import React, { useState, useRef } from 'react';
import { Pet, ReactionState, EmotionFood, IncomingLetter, AndroidWidgetSize } from '../types';
import { FluffyPetAvatar } from './FluffyPetAvatar';
import { sounds } from '../utils/audio';
import {
  Sparkles,
  Footprints,
  Mail,
  Palette,
  Cloud,
  Users,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sliders,
  Wifi,
  BatteryCharging,
  Layers,
  Move,
  Settings,
  Camera,
  FolderHeart,
  MessageCircle,
  BookOpen,
} from 'lucide-react';

interface AndroidWidgetContainerProps {
  pet: Pet;
  reaction: ReactionState;
  onPetClick: () => void;
  onOpenFeed: () => void;
  onOpenPark: () => void;
  onOpenMail: () => void;
  onOpenDiary: () => void;
  onOpenCustomization: () => void;
  onOpenCloudSync: () => void;
  onOpenPetSelector: () => void;
  onOpenExportInstall: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  letters: IncomingLetter[];
}

export const AndroidWidgetContainer: React.FC<AndroidWidgetContainerProps> = ({
  pet,
  reaction,
  onPetClick,
  onOpenFeed,
  onOpenPark,
  onOpenMail,
  onOpenDiary,
  onOpenCustomization,
  onOpenCloudSync,
  onOpenPetSelector,
  onOpenExportInstall,
  soundEnabled,
  onToggleSound,
  letters,
}) => {
  // Widget size state (2x2, 3x3, 4x2, 4x3, 4x4)
  const [widgetSize, setWidgetSize] = useState<AndroidWidgetSize>('4x3');
  const [isResizeMode, setIsResizeMode] = useState<boolean>(false);
  const [isTransparent, setIsTransparent] = useState<boolean>(false);

  // Custom dragged dimension scaling
  const [customScale, setCustomScale] = useState<number>(1.0);

  const unreadCount = letters.filter((l) => !l.read).length;
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const getWidgetWidthClass = () => {
    switch (widgetSize) {
      case '2x2':
        return 'w-[260px] min-h-[250px]';
      case '3x3':
        return 'w-[320px] min-h-[340px]';
      case '4x2':
        return 'w-[92%] max-w-[480px] min-h-[230px]';
      case '4x3':
        return 'w-[92%] max-w-[440px] min-h-[380px]';
      case '4x4':
        return 'w-[94%] max-w-[500px] min-h-[460px]';
    }
  };

  const getAvatarSize = () => {
    switch (widgetSize) {
      case '2x2':
        return 140;
      case '3x3':
        return 180;
      case '4x2':
        return 160;
      case '4x3':
        return 200;
      case '4x4':
        return 230;
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between overflow-x-hidden select-none bg-stone-950 font-['Nunito',sans-serif]">
      {/* 1950s Android Wallpaper Atmosphere */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-stone-900 via-zinc-900 to-stone-950">
        {/* Warm nostalgic studio lamps blur */}
        <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Android Top Status Bar */}
      <div className="w-full px-6 py-2 bg-black/40 backdrop-blur-md flex items-center justify-between text-xs font-bold text-stone-300 z-30">
        <div className="flex items-center gap-2">
          <span>{currentTime}</span>
          <span className="text-[10px] text-amber-400 font-normal">🐾 Fluffy Android</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px]">
            <span>5G</span>
            <Wifi className="w-3.5 h-3.5 text-stone-300" />
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>94%</span>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Android Widget Control & Resizing Bar */}
      <div className="px-4 py-2 bg-stone-900/60 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs z-20">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Размер Android-виджета:</span>
          </span>

          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
            {(['2x2', '3x3', '4x2', '4x3', '4x4'] as AndroidWidgetSize[]).map((sz) => (
              <button
                key={sz}
                onClick={() => {
                  sounds.playPop();
                  setWidgetSize(sz);
                }}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  widgetSize === sz
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playPop();
              setIsResizeMode(!isResizeMode);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors ${
              isResizeMode
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-white'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>{isResizeMode ? 'Готово' : 'Рамка размера'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setIsTransparent(!isTransparent);
            }}
            className="px-2.5 py-1 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 hover:text-white text-xs font-bold"
          >
            {isTransparent ? 'Фон: Прозрачный' : 'Фон: Карточка'}
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onOpenExportInstall();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>APK / GitHub</span>
          </button>
        </div>
      </div>

      {/* Main Android Home Screen Canvas */}
      <main className="relative flex-1 flex flex-col items-center justify-center p-4 z-10">
        {/* Resizable Android Widget Wrapper */}
        <div
          className={`relative transition-all duration-300 ${getWidgetWidthClass()} flex flex-col items-center justify-center ${
            isResizeMode ? 'ring-2 ring-amber-400 ring-offset-4 ring-offset-stone-950' : ''
          }`}
          style={{ transform: `scale(${customScale})` }}
        >
          {/* Interactive Android Widget Resize Handles (visible when resize mode active) */}
          {isResizeMode && (
            <>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 border-2 border-white shadow-lg cursor-ns-resize flex items-center justify-center text-[10px] text-stone-950 font-black">
                ↕
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 border-2 border-white shadow-lg cursor-ns-resize flex items-center justify-center text-[10px] text-stone-950 font-black">
                ↕
              </div>
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-400 border-2 border-white shadow-lg cursor-ew-resize flex items-center justify-center text-[10px] text-stone-950 font-black">
                ↔
              </div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-400 border-2 border-white shadow-lg cursor-ew-resize flex items-center justify-center text-[10px] text-stone-950 font-black">
                ↔
              </div>
              <div className="absolute -top-7 right-0 text-[10px] bg-amber-500 text-stone-950 font-black px-2 py-0.5 rounded-full shadow">
                Сетка: {widgetSize}
              </div>
            </>
          )}

          {/* Actual Widget Inner Body */}
          <div
            className={`w-full h-full rounded-[32px] p-4 transition-all duration-300 flex flex-col justify-between ${
              isTransparent
                ? 'bg-stone-950/40 backdrop-blur-md border border-white/10 shadow-xl'
                : 'bg-stone-900/85 backdrop-blur-2xl border border-amber-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
            }`}
          >
            {/* Widget Header Strip */}
            <div className="w-full flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPetSelector}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-xs font-bold text-amber-200 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate max-w-[90px]">{pet.name}</span>
                </button>

                <span className="text-[11px] text-stone-400 font-semibold hidden sm:inline">
                  Ур.{pet.stats.level}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Mail reaction button */}
                <button
                  onClick={onOpenMail}
                  className={`p-1.5 rounded-xl border text-xs font-bold transition-all relative ${
                    unreadCount > 0
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                      : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-white'
                  }`}
                  title="Почтовые реакции"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
                  )}
                </button>

                {/* Diary button */}
                <button
                  onClick={onOpenDiary}
                  className="p-1.5 rounded-xl bg-stone-800/80 border border-stone-700 text-amber-300 hover:text-white hover:bg-stone-700 transition-colors"
                  title="Дневник питомца (События, Уровни, Рекорды)"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                </button>

                {/* Customization modal trigger */}
                <button
                  onClick={onOpenCustomization}
                  className="p-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-colors"
                  title="Кастомизация 1950s (Шляпки, Шарфики, Цвет)"
                >
                  <Palette className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Central Area: Stop-motion puppet avatar */}
            <div className={`flex items-center justify-center my-1 ${widgetSize === '4x2' ? 'flex-row gap-4' : 'flex-col'}`}>
              <div className="flex-shrink-0">
                <FluffyPetAvatar
                  pet={pet}
                  reaction={reaction}
                  onPetClick={onPetClick}
                  size={getAvatarSize()}
                />
              </div>

              {/* Extra stats column if 4x2 layout */}
              {widgetSize === '4x2' && (
                <div className="flex-1 space-y-2">
                  <div className="text-xs font-black text-amber-100 flex items-center gap-1">
                    <span>{pet.name}</span>
                    <span className="text-stone-400 font-normal">
                      ({pet.customization.hat !== 'none' ? 'в шляпке' : 'без шляпки'})
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-300 flex justify-between">
                    <span>Счастье:</span>
                    <strong className="text-pink-400">{Math.round(pet.stats.happiness)}%</strong>
                  </div>
                  <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
                      style={{ width: `${pet.stats.happiness}%` }}
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={onOpenFeed}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Кормить</span>
                    </button>
                    <button
                      onClick={onOpenPark}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <Footprints className="w-3 h-3" />
                      <span>Парк</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls / Quick actions (if size is 3x3, 4x3, 4x4) */}
            {widgetSize !== '2x2' && widgetSize !== '4x2' && (
              <div className="w-full space-y-2 mt-2">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl bg-stone-950/50 border border-stone-800 text-center">
                  <div>
                    <div className="text-[10px] text-stone-400 font-semibold">Счастье</div>
                    <div className="text-xs font-black text-pink-400">{Math.round(pet.stats.happiness)}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-semibold">Сытость</div>
                    <div className="text-xs font-black text-amber-400">{Math.round(pet.stats.satiety)}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400 font-semibold">Шаги</div>
                    <div className="text-xs font-black text-emerald-400">{pet.stats.stepsWalked}</div>
                  </div>
                </div>

                {/* Main Action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onOpenFeed}
                    className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Покормить эмоцией</span>
                  </button>

                  <button
                    onClick={onOpenPark}
                    className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    <span>В парк прогулок</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mini 2x2 Quick Tap Footer */}
            {widgetSize === '2x2' && (
              <div className="w-full flex items-center justify-around pt-1 border-t border-stone-800/80">
                <button
                  onClick={onOpenFeed}
                  className="p-2 text-amber-400 hover:scale-110 transition-transform"
                  title="Кормить"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenPark}
                  className="p-2 text-emerald-400 hover:scale-110 transition-transform"
                  title="Выгулять в парке"
                >
                  <Footprints className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenMail}
                  className="p-2 text-rose-400 hover:scale-110 transition-transform"
                  title="Почта"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Android Bottom App Launcher Dock */}
      <footer className="w-full px-6 py-4 bg-stone-950/70 backdrop-blur-xl border-t border-stone-800 flex items-center justify-around z-20">
        <button
          onClick={onOpenPark}
          className="flex flex-col items-center gap-1 text-[11px] text-stone-300 hover:text-white transition-colors"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow">
            <Footprints className="w-5 h-5" />
          </div>
          <span>Парк</span>
        </button>

        <button
          onClick={onOpenMail}
          className="flex flex-col items-center gap-1 text-[11px] text-stone-300 hover:text-white transition-colors relative"
        >
          <div className="w-11 h-11 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow">
            <Mail className="w-5 h-5" />
          </div>
          <span>Почта</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 right-2 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenDiary}
          className="flex flex-col items-center gap-1 text-[11px] text-stone-300 hover:text-white transition-colors"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shadow">
            <BookOpen className="w-5 h-5" />
          </div>
          <span>Дневник</span>
        </button>

        <button
          onClick={onOpenCustomization}
          className="flex flex-col items-center gap-1 text-[11px] text-stone-300 hover:text-white transition-colors"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow">
            <Palette className="w-5 h-5" />
          </div>
          <span>Гардероб 50-х</span>
        </button>

        <button
          onClick={onOpenCloudSync}
          className="flex flex-col items-center gap-1 text-[11px] text-stone-300 hover:text-white transition-colors"
        >
          <div className="w-11 h-11 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow">
            <Cloud className="w-5 h-5" />
          </div>
          <span>Синхронизация</span>
        </button>
      </footer>
    </div>
  );
};
