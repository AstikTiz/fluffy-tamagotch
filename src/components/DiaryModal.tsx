import React, { useState } from 'react';
import { DiaryEntry, DiaryEntryType, Pet } from '../types';
import { sounds } from '../utils/audio';
import {
  BookOpen,
  Calendar,
  Sparkles,
  Trophy,
  Footprints,
  Award,
  Plus,
  Filter,
  X,
  Clock,
  Download,
  Bookmark,
  Check,
  Heart,
} from 'lucide-react';

interface DiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  diaryEntries: DiaryEntry[];
  currentPet: Pet;
  allPets: Pet[];
  onAddCustomEntry: (title: string, desc: string, emoji: string) => void;
}

export const DiaryModal: React.FC<DiaryModalProps> = ({
  isOpen,
  onClose,
  diaryEntries,
  currentPet,
  allPets,
  onAddCustomEntry,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [petFilter, setPetFilter] = useState<string>(currentPet.id);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDesc, setNoteDesc] = useState('');
  const [noteEmoji, setNoteEmoji] = useState('✨');

  if (!isOpen) return null;

  // Filter entries
  const filteredEntries = diaryEntries.filter((entry) => {
    const matchesPet = petFilter === 'all' || entry.petId === petFilter;
    const matchesType = filterType === 'all' || entry.type === filterType;
    return matchesPet && matchesType;
  });

  // Calculate statistics
  const petEntries = diaryEntries.filter((e) => petFilter === 'all' || e.petId === petFilter);
  const totalEntries = petEntries.length;
  const levelUpCount = petEntries.filter((e) => e.type === 'level_up').length;
  const accessoriesFound = petEntries.filter((e) => e.type === 'accessory_found').length;
  const maxSteps = petEntries
    .filter((e) => e.type === 'walk_record' && e.meta?.steps)
    .reduce((max, e) => Math.max(max, e.meta?.steps || 0), currentPet.stats.stepsWalked);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    onAddCustomEntry(
      noteTitle.trim(),
      noteDesc.trim() || 'Памятная запись в личном дневнике кукольного зверька.',
      noteEmoji
    );

    setNoteTitle('');
    setNoteDesc('');
    setIsAddingNote(false);
    sounds.playLevelUp();
  };

  const handleExportDiary = () => {
    const textContent = filteredEntries
      .map((entry) => {
        const dateStr = new Date(entry.timestamp).toLocaleString('ru-RU');
        return `[${dateStr}] ${entry.emoji} ${entry.title} (${entry.petName})\n${entry.description}\n`;
      })
      .join('\n----------------------------------------\n\n');

    const fullDoc = `📖 ДНЕВНИК ПАМЯТНЫХ СОБЫТИЙ: ${currentPet.name}\nСоздан в стиле покадровой анимации 1950-х\n\n${textContent}`;

    const blob = new Blob([fullDoc], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diary_${currentPet.name}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    sounds.playPop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-['Nunito',sans-serif]">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-900/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Bookmark Ribbon Decor */}
        <div className="absolute top-0 right-14 w-6 h-10 bg-rose-700 shadow-md border-b-2 border-rose-900 clip-ribbon z-30 pointer-events-none" />

        {/* Vintage Leather / Linen Journal Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-amber-100 flex items-center gap-2">
                <span>Дневник Питомца</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Хроника 1950s
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Автоматическая летопись достижений, находок и рекордов
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDiary}
              className="p-2 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition-colors"
              title="Экспорт дневника в файл"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="px-6 py-3 bg-stone-950/50 border-b border-stone-800/80 grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-[10px] text-stone-400 font-bold">Записей</div>
            <div className="text-sm font-black text-amber-300">{totalEntries}</div>
          </div>
          <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-[10px] text-stone-400 font-bold">Уровни</div>
            <div className="text-sm font-black text-yellow-400">ур.{currentPet.stats.level}</div>
          </div>
          <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-[10px] text-stone-400 font-bold">Находки</div>
            <div className="text-sm font-black text-rose-400">{accessoriesFound}</div>
          </div>
          <div className="p-2 rounded-xl bg-stone-900/60 border border-stone-800">
            <div className="text-[10px] text-stone-400 font-bold">Рекорд шагов</div>
            <div className="text-sm font-black text-emerald-400">{maxSteps}</div>
          </div>
        </div>

        {/* Filter & Pet Switcher Controls */}
        <div className="p-4 bg-stone-950/40 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2">
          {/* Pet select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-stone-400 font-bold">Питомец:</span>
            <select
              value={petFilter}
              onChange={(e) => setPetFilter(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-stone-800 border border-stone-700 text-xs font-bold text-amber-200 focus:outline-none"
            >
              <option value="all">Все питомцы</option>
              {allPets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species === 'bunny' ? 'Кролик' : p.species === 'fox' ? 'Лисичка' : p.species === 'bear' ? 'Мишка' : 'Дракончик'})
                </option>
              ))}
            </select>
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Все события' },
              { id: 'level_up', label: '⭐ Уровни' },
              { id: 'accessory_found', label: '👑 Находки' },
              { id: 'walk_record', label: '🌲 Прогулки' },
              { id: 'custom_memory', label: '✨ Память' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sounds.playPop();
                  setFilterType(f.id);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterType === f.id
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-stone-800/60 text-stone-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              setIsAddingNote(!isAddingNote);
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all ml-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Заметка</span>
          </button>
        </div>

        {/* Note Composer Modal Section */}
        {isAddingNote && (
          <form
            onSubmit={handleCreateNote}
            className="p-4 bg-stone-950/80 border-b border-amber-900/40 space-y-3 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-200">Добавить памятную запись:</span>
              <div className="flex gap-1.5">
                {['✨', '💖', '🎬', '☕', '🌟', '🐾', '🎀'].map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setNoteEmoji(emoji)}
                    className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center transition-transform ${
                      noteEmoji === emoji ? 'bg-amber-500 text-stone-950 scale-110' : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              required
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Заголовок воспоминания (например: Первое знакомство)"
              className="w-full px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            />

            <textarea
              rows={2}
              value={noteDesc}
              onChange={(e) => setNoteDesc(e.target.value)}
              placeholder="Короткий памятный комментарий..."
              className="w-full px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNote(false)}
                className="px-3 py-1 rounded-xl text-xs text-stone-400 hover:text-white"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 shadow"
              >
                Сохранить в дневник
              </button>
            </div>
          </form>
        )}

        {/* Timeline Entries List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <div className="text-4xl mb-2">📜</div>
              <div className="text-sm font-semibold">Пока нет записей в дневнике</div>
              <div className="text-xs mt-1 text-stone-500">
                Записи появляются автоматически при повышении уровня, прогулках в парке и находках!
              </div>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const formattedDate = new Date(entry.timestamp).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              const formattedTime = new Date(entry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-stone-800/50 border border-stone-700/60 hover:border-amber-500/40 transition-all flex items-start gap-3.5 shadow-sm"
                >
                  {/* Event Icon Chip */}
                  <div className="w-10 h-10 rounded-2xl bg-stone-900 border border-stone-700 flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
                    {entry.emoji}
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-sm text-amber-100 truncate">
                        {entry.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-stone-400 flex-shrink-0">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>{formattedDate}, {formattedTime}</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed mb-2">
                      {entry.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-stone-900/80 text-amber-300 font-semibold border border-stone-700/50">
                        🐾 {entry.petName}
                      </span>

                      {entry.type === 'level_up' && entry.meta?.level && (
                        <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/30">
                          Уровень {entry.meta.level} ⭐
                        </span>
                      )}

                      {entry.type === 'accessory_found' && entry.meta?.accessoryName && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                          {entry.meta.accessoryEmoji || '👑'} {entry.meta.accessoryName}
                        </span>
                      )}

                      {entry.type === 'walk_record' && entry.meta?.steps && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          🌲 {entry.meta.steps} шагов
                        </span>
                      )}

                      {entry.meta?.locationName && (
                        <span className="px-2 py-0.5 rounded-md bg-stone-900 text-stone-400">
                          📍 {entry.meta.locationName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>
            Записи сохраняются в облаке и памяти устройства
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
