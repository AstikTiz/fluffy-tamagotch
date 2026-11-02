import React, { useState } from 'react';
import { Pet, ActivityLevel, FurPattern, HatId, ScarfId } from '../types';
import {
  RETRO_1950S_PALETTE,
  FUR_PATTERNS_CATALOG,
  HATS_CATALOG,
  SCARVES_CATALOG,
} from '../constants/initialData';
import { FluffyPetAvatar } from './FluffyPetAvatar';
import { sounds } from '../utils/audio';
import {
  Palette,
  Sparkles,
  X,
  Check,
  Clapperboard,
  Activity,
  Sliders,
  Paintbrush,
} from 'lucide-react';

interface CustomizationModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPet: Pet) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  pet,
  isOpen,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'colors_patterns' | 'accessories' | 'animation_activity'>('colors_patterns');
  const [tempPet, setTempPet] = useState<Pet>({ ...pet });

  if (!isOpen) return null;

  const handleSave = () => {
    sounds.playLevelUp();
    onSave(tempPet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in font-['Nunito',sans-serif]">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-amber-900/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header with 1950s Retro Stop-Motion Banner */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-amber-100 flex items-center gap-2">
                <span>Мастерская Кукол 1950-х</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Stop-Motion
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Кастомизация цвета, шерсти, винтажных шляпок и шарфиков
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 px-6 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('colors_patterns')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'colors_patterns'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Цвет и узор шёрстки</span>
          </button>

          <button
            onClick={() => setActiveTab('accessories')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'accessories'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Шляпки и шарфики</span>
          </button>

          <button
            onClick={() => setActiveTab('animation_activity')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'animation_activity'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Анимация и активность</span>
          </button>
        </div>

        {/* Modal Body with Live Stop-Motion Preview */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Live Stop-Motion Puppet Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-stone-950/60 rounded-3xl border border-stone-800/80 shadow-inner">
            <div className="relative p-2 rounded-2xl bg-gradient-to-b from-stone-900/60 to-stone-950 border border-stone-800 flex items-center justify-center w-full min-h-[220px]">
              <FluffyPetAvatar
                pet={tempPet}
                reaction={{
                  type: 'idle',
                  textBubble: 'Кукольный стиль 50-х! ✨',
                  activeUntil: Date.now() + 3000,
                }}
                size={180}
                interactive={false}
              />
            </div>

            <div className="mt-4 w-full">
              <label className="text-[11px] font-bold text-amber-200/80 block mb-1">
                Имя кукольного зверька:
              </label>
              <input
                type="text"
                value={tempPet.name}
                onChange={(e) => setTempPet({ ...tempPet, name: e.target.value })}
                className="w-full px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Stop-motion toggle tag */}
            <div className="mt-3 w-full flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-[11px]">
              <span className="text-stone-300 font-semibold flex items-center gap-1">
                <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
                <span>Эффект 12 fps (Stop-Motion)</span>
              </span>
              <input
                type="checkbox"
                checked={tempPet.customization.stopMotionFx}
                onChange={(e) =>
                  setTempPet({
                    ...tempPet,
                    customization: {
                      ...tempPet.customization,
                      stopMotionFx: e.target.checked,
                    },
                  })
                }
                className="accent-amber-500 w-4 h-4 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="md:col-span-7 space-y-5">
            {activeTab === 'colors_patterns' && (
              <>
                {/* 1950s Color Palette */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-amber-100 flex items-center gap-1.5">
                      <Paintbrush className="w-3.5 h-3.5 text-amber-400" />
                      <span>Винтажная палитра 1950-х (Фетр и глина):</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {RETRO_1950S_PALETTE.map((preset, idx) => {
                      const isSel =
                        tempPet.customization.primaryColor === preset.primary;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            sounds.playPop();
                            setTempPet({
                              ...tempPet,
                              customization: {
                                ...tempPet.customization,
                                primaryColor: preset.primary,
                                secondaryColor: preset.secondary,
                              },
                            });
                          }}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-semibold text-left transition-all ${
                            isSel
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                              : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                          }`}
                        >
                          <div className="flex -space-x-1">
                            <span
                              className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/40 shadow-sm"
                              style={{ backgroundColor: preset.secondary }}
                            />
                          </div>
                          <span className="truncate">{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Hex Picker Option */}
                  <div className="mt-3 flex items-center gap-3 p-2.5 rounded-xl bg-stone-950/50 border border-stone-800">
                    <span className="text-[11px] font-bold text-stone-400">Свой оттенок:</span>
                    <input
                      type="color"
                      value={tempPet.customization.primaryColor}
                      onChange={(e) =>
                        setTempPet({
                          ...tempPet,
                          customization: {
                            ...tempPet.customization,
                            primaryColor: e.target.value,
                          },
                        })
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={tempPet.customization.primaryColor}
                      onChange={(e) =>
                        setTempPet({
                          ...tempPet,
                          customization: {
                            ...tempPet.customization,
                            primaryColor: e.target.value,
                          },
                        })
                      }
                      className="w-24 px-2 py-1 rounded-lg bg-stone-800 border border-stone-700 text-xs font-mono text-amber-200 uppercase"
                    />
                  </div>
                </div>

                {/* Fur Patterns Catalog */}
                <div>
                  <label className="text-xs font-bold text-amber-100 block mb-2">
                    Узор шёрстки (Needle-Felt & Patchwork):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FUR_PATTERNS_CATALOG.map((pattern) => {
                      const isSel = tempPet.customization.furPattern === pattern.id;
                      return (
                        <button
                          key={pattern.id}
                          type="button"
                          onClick={() => {
                            sounds.playPop();
                            setTempPet({
                              ...tempPet,
                              customization: {
                                ...tempPet.customization,
                                furPattern: pattern.id,
                              },
                            });
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSel
                              ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10'
                              : 'bg-stone-800/60 border-stone-700/60 hover:bg-stone-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-lg">{pattern.emoji}</span>
                            {isSel && <Check className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <div className="text-xs font-bold text-stone-200">
                            {pattern.name}
                          </div>
                          <div className="text-[10px] text-stone-400 leading-tight mt-0.5 line-clamp-2">
                            {pattern.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'accessories' && (
              <>
                {/* 1950s Hats */}
                <div>
                  <label className="text-xs font-bold text-amber-100 block mb-2">
                    Шляпки и головные уборы 1950-х:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {HATS_CATALOG.map((hatItem) => {
                      const isSel = tempPet.customization.hat === hatItem.id;
                      return (
                        <button
                          key={hatItem.id}
                          type="button"
                          onClick={() => {
                            sounds.playPop();
                            setTempPet({
                              ...tempPet,
                              customization: {
                                ...tempPet.customization,
                                hat: hatItem.id,
                              },
                            });
                          }}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                            isSel
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                              : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                          }`}
                        >
                          <span className="text-xl">{hatItem.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold truncate">
                              {hatItem.name}
                            </div>
                            <div className="text-[10px] text-stone-400 truncate">
                              {hatItem.desc}
                            </div>
                          </div>
                          {isSel && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 1950s Scarves */}
                <div>
                  <label className="text-xs font-bold text-amber-100 block mb-2">
                    Шарфики и шейные украшения:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {SCARVES_CATALOG.map((scarfItem) => {
                      const isSel = tempPet.customization.scarf === scarfItem.id;
                      return (
                        <button
                          key={scarfItem.id}
                          type="button"
                          onClick={() => {
                            sounds.playPop();
                            setTempPet({
                              ...tempPet,
                              customization: {
                                ...tempPet.customization,
                                scarf: scarfItem.id,
                              },
                            });
                          }}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                            isSel
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                              : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800'
                          }`}
                        >
                          <span className="text-xl">{scarfItem.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold truncate">
                              {scarfItem.name}
                            </div>
                            <div className="text-[10px] text-stone-400 truncate">
                              {scarfItem.desc}
                            </div>
                          </div>
                          {isSel && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'animation_activity' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-400">
                  Уровень активности влияет на скорость пошаговой кукольной анимации и частоту эмоциональных запросов:
                </p>

                {[
                  {
                    id: 'sleepy' as ActivityLevel,
                    title: 'Сплюшка (Медленный кукольный ритм)',
                    emoji: '💤',
                    desc: 'Мягкие ступенчатые движения, редкое дыхание, экономия сытости. Уютно дремлет.',
                    cadence: 'Каденс: 3.6 сек',
                  },
                  {
                    id: 'calm' as ActivityLevel,
                    title: 'Спокойный (Сбалансированный)',
                    emoji: '🍵',
                    desc: 'Плавный кукольный дзен, классическая советско-чешская анимация 1950-х.',
                    cadence: 'Каденс: 2.6 сек',
                  },
                  {
                    id: 'playful' as ActivityLevel,
                    title: 'Игривый (Бодрый попрыгун)',
                    emoji: '🐾',
                    desc: 'Частые прыжки, виляние ушками и хвостиком, просится на прогулку в парк.',
                    cadence: 'Каденс: 1.8 сек',
                  },
                  {
                    id: 'hyperactive' as ActivityLevel,
                    title: 'Энерджайзер (Молниеносный)',
                    emoji: '⚡',
                    desc: 'Быстрые щелкающие кадры, искры из глаз, молниеносные реакции на письма.',
                    cadence: 'Каденс: 1.2 сек',
                  },
                ].map((level) => {
                  const isSel = tempPet.activityLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setTempPet({ ...tempPet, activityLevel: level.id });
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        isSel
                          ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-stone-800/50 border-stone-700/60 hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-amber-100 flex items-center gap-2">
                          <span className="text-xl">{level.emoji}</span>
                          <span>{level.title}</span>
                        </span>
                        {isSel && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <p className="text-xs text-stone-400 mb-2 leading-relaxed">
                        {level.desc}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-stone-950 text-[10px] font-semibold text-amber-300">
                        {level.cadence}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950/80 border-t border-stone-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Сохранить образ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
