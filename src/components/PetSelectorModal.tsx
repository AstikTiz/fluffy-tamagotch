import React, { useState } from 'react';
import { Pet, PetSpecies, ActivityLevel } from '../types';
import { INITIAL_PETS } from '../constants/initialData';
import { FluffyPetAvatar } from './FluffyPetAvatar';
import { sounds } from '../utils/audio';
import { Users, Plus, Check, X, Sparkles, Clapperboard } from 'lucide-react';

interface PetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pets: Pet[];
  activePetId: string;
  onSelectPet: (petId: string) => void;
  onAddNewPet: (newPet: Pet) => void;
}

export const PetSelectorModal: React.FC<PetSelectorModalProps> = ({
  isOpen,
  onClose,
  pets,
  activePetId,
  onSelectPet,
  onAddNewPet,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSpecies, setNewSpecies] = useState<PetSpecies>('bunny');
  const [newActivity, setNewActivity] = useState<ActivityLevel>('playful');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const speciesDefault = INITIAL_PETS.find((p) => p.species === newSpecies) || INITIAL_PETS[0];

    const created: Pet = {
      id: `pet_${newSpecies}_${Date.now()}`,
      name: newName.trim(),
      species: newSpecies,
      activityLevel: newActivity,
      customization: {
        ...speciesDefault.customization,
      },
      stats: {
        happiness: 90,
        energy: 90,
        satiety: 80,
        serenity: 85,
        affection: 80,
        level: 1,
        xp: 0,
        stepsWalked: 0,
        lastWalkTime: Date.now(),
        lastFedTime: Date.now(),
        currentMood: 'happy',
      },
      createdAt: Date.now(),
      unlockedHats: ['none', 'newsboy', 'beanie'],
      unlockedScarves: ['none', 'striped_wool', 'bowtie'],
    };

    sounds.playLevelUp();
    onAddNewPet(created);
    setIsCreating(false);
    setNewName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in font-['Nunito',sans-serif]">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-700/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Кукольные Питомцы 1950-х</h2>
              <p className="text-xs text-stone-400">
                Переключайтесь между пушистиками или приютите нового кукольного героя
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

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {!isCreating ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pets.map((p) => {
                  const isActive = p.id === activePetId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        sounds.playPop();
                        onSelectPet(p.id);
                      }}
                      className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                        isActive
                          ? 'bg-gradient-to-br from-amber-950/60 via-stone-900 to-stone-950 border-amber-500/80 shadow-lg shadow-amber-500/10'
                          : 'bg-stone-800/40 border-stone-700/60 hover:bg-stone-800/80'
                      }`}
                    >
                      <div className="w-16 h-16 flex-shrink-0">
                        <FluffyPetAvatar
                          pet={p}
                          reaction={{ type: 'idle', activeUntil: 0 }}
                          size={64}
                          interactive={false}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-extrabold text-sm text-white truncate">
                            {p.name}
                          </span>
                          {isActive && (
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black uppercase">
                              На виджете
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-2">
                          <span>Уровень {p.stats.level}</span>
                          <span>•</span>
                          <span>{p.stats.stepsWalked} шагов</span>
                        </div>
                        <div className="text-[10px] text-amber-300 font-semibold mt-1">
                          {p.activityLevel === 'sleepy'
                            ? '💤 Сплюшка'
                            : p.activityLevel === 'calm'
                            ? '🍵 Спокойный'
                            : p.activityLevel === 'playful'
                            ? '🐾 Игривый'
                            : '⚡ Энерджайзер'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Pet Button */}
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsCreating(true);
                }}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-stone-700 hover:border-amber-500/60 hover:bg-stone-800/40 text-stone-300 hover:text-amber-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Создать нового кукольного зверька</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs text-amber-400 hover:underline mb-2 block"
              >
                ← Назад к списку зверьков
              </button>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Имя нового персонажа:
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Например: Люмик, Пончик, Рыжик"
                  className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Вид куклы:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'bunny', name: 'Кролик Пушок 🐰' },
                    { id: 'fox', name: 'Лисичка Кицунэ 🦊' },
                    { id: 'bear', name: 'Медвежонок 🐻' },
                    { id: 'dragon', name: 'Дракончик 🐲' },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setNewSpecies(s.id as PetSpecies)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                        newSpecies === s.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-stone-800 border-stone-700 text-stone-400'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Темп кукольной анимации:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'sleepy', name: 'Сплюшка 💤' },
                    { id: 'calm', name: 'Спокойный 🍵' },
                    { id: 'playful', name: 'Игривый 🐾' },
                    { id: 'hyperactive', name: 'Энерджайзер ⚡' },
                  ].map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() => setNewActivity(a.id as ActivityLevel)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-colors ${
                        newActivity === a.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-stone-800 border-stone-700 text-stone-400'
                      }`}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>Оживить кукольного зверька!</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
