import React, { useState, useEffect } from 'react';
import { Pet, ParkLocationId, HatId } from '../types';
import { PARK_LOCATIONS, HATS_CATALOG } from '../constants/initialData';
import { FluffyPetAvatar } from './FluffyPetAvatar';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Footprints, MapPin, Sparkles, Play, X } from 'lucide-react';

interface VirtualParkModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
  onWalkComplete: (steps: number, happinessBonus: number, foundHat?: HatId) => void;
}

export const VirtualParkModal: React.FC<VirtualParkModalProps> = ({
  pet,
  isOpen,
  onClose,
  onWalkComplete,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<ParkLocationId>('meadow');
  const [isWalking, setIsWalking] = useState(false);
  const [walkSteps, setWalkSteps] = useState(0);
  const [targetSteps, setTargetSteps] = useState(60);
  const [discoveredItem, setDiscoveredItem] = useState<{ name: string; emoji: string } | null>(null);
  const [butterflies, setButterflies] = useState<{ id: number; x: number; y: number }[]>([]);

  const currentLocation = PARK_LOCATIONS.find((loc) => loc.id === selectedLocation) || PARK_LOCATIONS[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWalking && walkSteps < targetSteps) {
      interval = setInterval(() => {
        setWalkSteps((prev) => {
          const next = prev + 1;
          sounds.playWalkStep();

          if (next === 25 && !discoveredItem) {
            triggerDiscovery();
          }

          if (next >= targetSteps) {
            finishWalk(next);
          }
          return next;
        });
      }, 170);
    }
    return () => clearInterval(interval);
  }, [isWalking, walkSteps, targetSteps]);

  useEffect(() => {
    if (isWalking) {
      const bList = Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 15 + Math.random() * 60,
      }));
      setButterflies(bList);
    } else {
      setButterflies([]);
    }
  }, [isWalking]);

  const triggerDiscovery = () => {
    const findings = [
      { name: 'Лазурный четырёхлистный клевер', emoji: '🍀' },
      { name: 'Винтажная пуговица 1950-х', emoji: '🔘' },
      { name: 'Радужное пёрышко для шляпки', emoji: '🪶' },
      { name: 'Шёлковая лента для котелка', emoji: '🎀' },
    ];
    const picked = findings[Math.floor(Math.random() * findings.length)];
    setDiscoveredItem(picked);
    sounds.playLevelUp();
  };

  const startWalk = () => {
    setIsWalking(true);
    setWalkSteps(0);
    setDiscoveredItem(null);
  };

  const finishWalk = (finalSteps: number) => {
    setIsWalking(false);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    sounds.playLevelUp();

    let unlockedHat: HatId | undefined = undefined;
    const locked = HATS_CATALOG.filter(
      (h) => h.id !== 'none' && !pet.unlockedHats?.includes(h.id)
    );
    if (locked.length > 0 && Math.random() > 0.4) {
      unlockedHat = locked[0].id;
    }

    onWalkComplete(finalSteps, 35, unlockedHat);
  };

  const catchButterfly = (id: number) => {
    sounds.playPop();
    setWalkSteps((s) => s + 5);
    setButterflies((prev) => prev.filter((b) => b.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in font-['Nunito',sans-serif]">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-700/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Виртуальный Парк Прогулок</h2>
              <p className="text-xs text-stone-400">
                Регулярные прогулки кукольного зверька в парке для его счастья
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

        {/* Location selector pills */}
        <div className="p-4 bg-stone-950/40 border-b border-stone-800/80 flex gap-2 overflow-x-auto no-scrollbar">
          {PARK_LOCATIONS.map((loc) => {
            const active = loc.id === selectedLocation;
            return (
              <button
                key={loc.id}
                disabled={isWalking}
                onClick={() => {
                  setSelectedLocation(loc.id);
                  sounds.playPop();
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-stone-800/70 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{loc.name}</span>
              </button>
            );
          })}
        </div>

        {/* Scenic Walking Stage */}
        <div
          className={`relative flex-1 min-h-[300px] flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-b ${currentLocation.bgGradient}`}
        >
          {/* Ambient elements */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-4 left-6 text-3xl animate-bounce">🌸</div>
            <div className="absolute top-12 right-10 text-2xl animate-pulse">🍃</div>
            <div className="absolute bottom-16 left-12 text-2xl animate-pulse">✨</div>
            <div className="absolute top-20 left-1/3 text-xl animate-bounce">🦋</div>
          </div>

          {/* Interactive Butterflies */}
          {butterflies.map((b) => (
            <button
              key={b.id}
              onClick={() => catchButterfly(b.id)}
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
              className="absolute z-20 cursor-pointer p-2 text-2xl animate-bounce transform hover:scale-125 transition-transform"
              title="Поймать бабочку! (+5 шагов)"
            >
              🦋
            </button>
          ))}

          {/* Walking Pet representation */}
          <div className="relative z-10 flex flex-col items-center">
            <FluffyPetAvatar
              pet={pet}
              reaction={{
                type: isWalking ? 'walking' : 'idle',
                textBubble: isWalking ? 'Топаем по тропинке! 🐾' : 'Куда пойдём?',
                emotionEmoji: isWalking ? '🌲' : '🐾',
                activeUntil: Date.now() + 5000,
              }}
              size={180}
              interactive={false}
            />

            {/* Stepping Path Indicator */}
            {isWalking && (
              <div className="w-64 mt-3 bg-black/50 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg text-center">
                <div className="flex justify-between text-xs font-bold text-stone-200 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Шаги: {walkSteps} / {targetSteps}</span>
                  </span>
                  <span className="text-emerald-400 font-extrabold">
                    {Math.round((walkSteps / targetSteps) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-200 rounded-full"
                    style={{ width: `${(walkSteps / targetSteps) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Discovery Banner */}
            {discoveredItem && (
              <div className="mt-3 px-4 py-2 rounded-2xl bg-amber-500 text-stone-950 font-black text-xs shadow-xl animate-bounce flex items-center gap-2">
                <span className="text-xl">{discoveredItem.emoji}</span>
                <span>Найдена находка: {discoveredItem.name}!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-stone-200">{currentLocation.name}</div>
            <div className="text-[11px] text-stone-400">{currentLocation.desc}</div>
          </div>

          {!isWalking ? (
            <button
              onClick={startWalk}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Начать прогулку</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 animate-pulse">
              <Footprints className="w-4 h-4" />
              <span>Кукольный зверёк наслаждается тропинкой...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
