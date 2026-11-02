/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Pet,
  EmotionFood,
  ReactionState,
  IncomingLetter,
  HatId,
  DiaryEntry,
} from './types';
import { INITIAL_PETS, HATS_CATALOG } from './constants/initialData';
import { sounds } from './utils/audio';
import confetti from 'canvas-confetti';
import { AndroidWidgetContainer } from './components/AndroidWidgetContainer';
import { EmotionFoodTray } from './components/EmotionFoodTray';
import { VirtualParkModal } from './components/VirtualParkModal';
import { MailStationModal } from './components/MailStationModal';
import { CustomizationModal } from './components/CustomizationModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { PetSelectorModal } from './components/PetSelectorModal';
import { DiaryModal } from './components/DiaryModal';
import { ExportInstallModal } from './components/ExportInstallModal';
import { X } from 'lucide-react';

const STORAGE_KEY_PETS = 'fluffy_pets_1950s_v2';
const STORAGE_KEY_ACTIVE_PET = 'fluffy_active_pet_1950s_v2';
const STORAGE_KEY_SYNC_CODE = 'fluffy_sync_code_1950s_v2';
const STORAGE_KEY_LETTERS = 'fluffy_letters_1950s_v2';
const STORAGE_KEY_DIARY = 'fluffy_diary_1950s_v2';

const INITIAL_DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: 'diary_init_1',
    petId: 'pet_bunny_1',
    petName: 'Пушок',
    petSpecies: 'bunny',
    type: 'adoption',
    title: 'Появление на рабочем столе! 🐾',
    description: 'Пушок поселился на домашнем экране Android в винтажном кукольном образе из войлока.',
    emoji: '🎬',
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: 'diary_init_2',
    petId: 'pet_bunny_1',
    petName: 'Пушок',
    petSpecies: 'bunny',
    type: 'accessory_found',
    title: 'Найдена кепка газетчика 1950-х! 🧢',
    description: 'Во время прогулки по Цветочной Поляне Пушок примерил твидовую кепку с пуговкой.',
    emoji: '🧢',
    timestamp: Date.now() - 86400000,
    meta: { accessoryName: 'Кепка газетчика 1950-х', accessoryEmoji: '🧢' },
  },
  {
    id: 'diary_init_3',
    petId: 'pet_bunny_1',
    petName: 'Пушок',
    petSpecies: 'bunny',
    type: 'walk_record',
    title: 'Рекордная прогулка: 160 шагов! 🌲',
    description: 'Пушок исследовал Шепчущую Рощу, поймал двух лазурных бабочек и набрался бодрости.',
    emoji: '🌲',
    timestamp: Date.now() - 3600000,
    meta: { steps: 160, locationName: 'Шепчущая Роща' },
  },
];

export default function App() {
  // 1. Pets State (1950s Stop-motion puppets)
  const [pets, setPets] = useState<Pet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed[0].customization?.furPattern) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PETS;
  });

  const [activePetId, setActivePetId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_PET);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PETS[0].id;
  });

  // 2. Letters State
  const [letters, setLetters] = useState<IncomingLetter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LETTERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'mail_welcome',
        from: 'Анимационная студия 1950-х',
        subject: 'Добро пожаловать в кукольный мир! 🎬',
        body: 'Твой новый пушистик ожил в технике покадровой анимации (stop-motion). Наряжай его в шляпки и шарфики, выгуливай в парке и корми эмоциями!',
        emotion: 'love',
        timestamp: Date.now() - 60000,
        read: false,
      },
    ];
  });

  // 3. Diary Entries State
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DIARY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DIARY_ENTRIES;
  });

  // 4. Cloud Sync State
  const [syncCode, setSyncCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SYNC_CODE);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    const rand = 'FLUFFY-' + Math.floor(100 + Math.random() * 900);
    localStorage.setItem(STORAGE_KEY_SYNC_CODE, rand);
    return rand;
  });

  const [lastSyncedAt, setLastSyncedAt] = useState<number>(Date.now());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // 5. Reactions & Modals
  const [reaction, setReaction] = useState<ReactionState>({
    type: 'idle',
    activeUntil: 0,
  });

  const [isFeedOpen, setIsFeedOpen] = useState(false);
  const [isParkOpen, setIsParkOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isExportInstallOpen, setIsExportInstallOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [isPetSelectorOpen, setIsPetSelectorOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const activePet = pets.find((p) => p.id === activePetId) || pets[0] || INITIAL_PETS[0];

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PETS, JSON.stringify(pets));
      localStorage.setItem(STORAGE_KEY_ACTIVE_PET, activePetId);
      localStorage.setItem(STORAGE_KEY_SYNC_CODE, syncCode);
      localStorage.setItem(STORAGE_KEY_LETTERS, JSON.stringify(letters));
      localStorage.setItem(STORAGE_KEY_DIARY, JSON.stringify(diaryEntries));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [pets, activePetId, syncCode, letters, diaryEntries]);

  // Audio sync
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Reaction timer reset
  useEffect(() => {
    if (reaction.activeUntil > Date.now()) {
      const timeout = setTimeout(() => {
        setReaction({ type: 'idle', activeUntil: 0 });
      }, reaction.activeUntil - Date.now());
      return () => clearTimeout(timeout);
    }
  }, [reaction]);

  // Pet Metabolism & Decay Tick
  useEffect(() => {
    const interval = setInterval(() => {
      setPets((prevPets) =>
        prevPets.map((p) => {
          const decayMultiplier =
            p.activityLevel === 'sleepy'
              ? 0.5
              : p.activityLevel === 'calm'
              ? 0.8
              : p.activityLevel === 'playful'
              ? 1.2
              : 1.6;

          const newSatiety = Math.max(5, p.stats.satiety - 0.3 * decayMultiplier);
          const newHappiness =
            newSatiety < 30
              ? Math.max(10, p.stats.happiness - 0.4)
              : Math.min(100, p.stats.happiness - 0.1);

          let newMood = p.stats.currentMood;
          if (newSatiety < 25) newMood = 'hungry';
          else if (newHappiness > 85) newMood = 'ecstatic';
          else if (newHappiness > 60) newMood = 'happy';
          else if (p.activityLevel === 'sleepy') newMood = 'sleepy';

          return {
            ...p,
            stats: {
              ...p.stats,
              satiety: newSatiety,
              happiness: newHappiness,
              currentMood: newMood,
            },
          };
        })
      );
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Background Cloud Sync
  const triggerCloudSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/sync/${syncCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petsData: pets,
          recentLetters: letters,
          diaryEntries: diaryEntries,
        }),
      });

      if (res.ok) {
        setLastSyncedAt(Date.now());
      }
    } catch (e) {
      console.warn('Sync server offline or connecting', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Poll for incoming webhook emails
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/mail/${syncCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.letters && data.letters.length > 0) {
            setLetters((prev) => {
              const existingIds = new Set(prev.map((l) => l.id));
              const newIncoming = data.letters.filter((l: IncomingLetter) => !existingIds.has(l.id));
              if (newIncoming.length > 0) {
                const latest = newIncoming[0];
                triggerMailReaction(latest);
                return [...newIncoming, ...prev];
              }
              return prev;
            });
          }
        }
      } catch (e) {
        // silent
      }
    }, 12000);
    return () => clearInterval(pollInterval);
  }, [syncCode]);

  // Connect another device via sync code
  const handleConnectCode = async (code: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/sync/${code}`);
      if (res.ok) {
        const data = await res.json();
        if (data.petsData && Array.isArray(data.petsData)) {
          setPets(data.petsData);
          if (data.petsData.length > 0) {
            setActivePetId(data.petsData[0].id);
          }
          if (data.recentLetters) {
            setLetters(data.recentLetters);
          }
          if (data.diaryEntries && Array.isArray(data.diaryEntries)) {
            setDiaryEntries(data.diaryEntries);
          }
          setSyncCode(code);
          setLastSyncedAt(Date.now());
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Pet Click / Petting Handler
  const handlePetClick = () => {
    sounds.playPurr();
    setReaction({
      type: 'petting',
      textBubble: 'Мур-р-р! Мягкий фетр! 🥰',
      emotionEmoji: '💖',
      activeUntil: Date.now() + 2400,
    });

    setPets((prev) =>
      prev.map((p) => {
        if (p.id !== activePet.id) return p;
        return {
          ...p,
          stats: {
            ...p.stats,
            happiness: Math.min(100, p.stats.happiness + 6),
            affection: Math.min(100, p.stats.affection + 5),
            currentMood: 'happy',
          },
        };
      })
    );
  };

  // Feeding Emotion Handler (records Level Up event in Diary!)
  const handleFeedEmotion = (food: EmotionFood) => {
    sounds.playNomNom(food.soundFrequency);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: [food.primaryColor, '#ffffff', '#e5a93b', '#c86d51'],
    });

    setReaction({
      type: 'eating',
      textBubble: `Вкусно! ${food.name}! ✨`,
      emotionEmoji: food.emoji,
      activeUntil: Date.now() + 2800,
    });

    setPets((prev) =>
      prev.map((p) => {
        if (p.id !== activePet.id) return p;

        const newSatiety = Math.min(100, p.stats.satiety + food.satietyGain);
        const newHappiness = Math.min(100, p.stats.happiness + food.happinessGain);
        const newEnergy = Math.min(100, p.stats.energy + food.energyGain);
        const newSerenity = Math.min(100, p.stats.serenity + food.serenityGain);

        let newXp = p.stats.xp + food.xpGain;
        let newLevel = p.stats.level;
        if (newXp >= 100) {
          newLevel += 1;
          newXp -= 100;
          sounds.playLevelUp();

          // Automatically record Level Up event in Diary!
          const levelUpEntry: DiaryEntry = {
            id: 'diary_lvl_' + Date.now(),
            petId: p.id,
            petName: p.name,
            petSpecies: p.species,
            type: 'level_up',
            title: `Повышение уровня: Ур. ${newLevel}! ⭐`,
            description: `${p.name} полакомился эмоцией «${food.name}» и перешёл на новый ${newLevel} уровень кукольного мастерства!`,
            emoji: '⭐',
            timestamp: Date.now(),
            meta: { level: newLevel },
          };
          setDiaryEntries((dPrev) => [levelUpEntry, ...dPrev]);
        }

        return {
          ...p,
          stats: {
            ...p.stats,
            satiety: newSatiety,
            happiness: newHappiness,
            energy: newEnergy,
            serenity: newSerenity,
            xp: newXp,
            level: newLevel,
            lastFedTime: Date.now(),
            currentMood: 'ecstatic',
          },
        };
      })
    );

    setIsFeedOpen(false);
  };

  // Walk completion handler (records Found Accessory and Record Walk in Diary!)
  const handleWalkComplete = (steps: number, happinessBonus: number, foundHat?: HatId) => {
    setPets((prev) =>
      prev.map((p) => {
        if (p.id !== activePet.id) return p;

        const newHats = [...(p.unlockedHats || [])];
        if (foundHat && !newHats.includes(foundHat)) {
          newHats.push(foundHat);
        }

        return {
          ...p,
          unlockedHats: newHats,
          stats: {
            ...p.stats,
            happiness: Math.min(100, p.stats.happiness + happinessBonus),
            stepsWalked: p.stats.stepsWalked + steps,
            lastWalkTime: Date.now(),
            currentMood: 'happy',
          },
        };
      })
    );

    // 1. Automatically record Walk Event in Diary
    const walkEntry: DiaryEntry = {
      id: 'diary_walk_' + Date.now(),
      petId: activePet.id,
      petName: activePet.name,
      petSpecies: activePet.species,
      type: 'walk_record',
      title: `Прогулка в парке: +${steps} шагов! 🌲`,
      description: `${activePet.name} прогулялся по парку, набрался свежего воздуха и получил +${happinessBonus}% к счастью. Общий счёт шагов: ${activePet.stats.stepsWalked + steps}.`,
      emoji: '🌲',
      timestamp: Date.now(),
      meta: { steps },
    };

    // 2. Automatically record Found Accessory if any!
    let hatEntry: DiaryEntry | null = null;
    if (foundHat) {
      const hatObj = HATS_CATALOG.find((h) => h.id === foundHat);
      hatEntry = {
        id: 'diary_hat_' + Date.now(),
        petId: activePet.id,
        petName: activePet.name,
        petSpecies: activePet.species,
        type: 'accessory_found',
        title: `Найден аксессуар: ${hatObj?.name || 'Новая шляпка'}! 👑`,
        description: `${activePet.name} совершил находку в парке и пополнил свой винтажный гардероб 1950-х!`,
        emoji: hatObj?.emoji || '👑',
        timestamp: Date.now() + 10,
        meta: { accessoryName: hatObj?.name, accessoryEmoji: hatObj?.emoji },
      };
    }

    setDiaryEntries((dPrev) => {
      const next = [walkEntry, ...dPrev];
      if (hatEntry) next.unshift(hatEntry);
      return next;
    });

    setReaction({
      type: 'walking',
      textBubble: 'Какая чудесная кукольная прогулка! 🌲',
      emotionEmoji: '🐾',
      activeUntil: Date.now() + 3000,
    });
  };

  // Add custom diary memory note
  const handleAddCustomEntry = (title: string, desc: string, emoji: string) => {
    const customEntry: DiaryEntry = {
      id: 'diary_custom_' + Date.now(),
      petId: activePet.id,
      petName: activePet.name,
      petSpecies: activePet.species,
      type: 'custom_memory',
      title,
      description: desc,
      emoji: emoji || '✨',
      timestamp: Date.now(),
    };
    setDiaryEntries((prev) => [customEntry, ...prev]);
  };

  // Trigger Live Mail Reaction on pet
  const triggerMailReaction = (letter: IncomingLetter) => {
    sounds.playMailChime();

    let text = 'Новое письмо!';
    let emoji = '💌';

    switch (letter.emotion) {
      case 'love':
        text = 'Тебе пришло тёплое письмо! 💖';
        emoji = '💌';
        break;
      case 'joy':
        text = 'Ура, радостная весть! 🎉';
        emoji = '⚡';
        break;
      case 'work':
        text = 'Деловое уведомление принято! 💼';
        emoji = '👓';
        break;
      case 'surprise':
        text = 'Ничего себе, сюрприз! ✨';
        emoji = '🌟';
        break;
    }

    setReaction({
      type: 'letter_alert',
      textBubble: text,
      emotionEmoji: emoji,
      activeUntil: Date.now() + 5000,
    });
  };

  // Send Test Letter Handler
  const handleSendTestLetter = (letterData: Omit<IncomingLetter, 'id' | 'timestamp' | 'read'>) => {
    const newLetter: IncomingLetter = {
      ...letterData,
      id: 'mail_' + Date.now(),
      timestamp: Date.now(),
      read: false,
    };

    setLetters((prev) => [newLetter, ...prev]);
    triggerMailReaction(newLetter);
  };

  const handleMarkAsRead = (id: string) => {
    setLetters((prev) =>
      prev.map((l) => (l.id === id ? { ...l, read: true } : l))
    );
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const exportData = {
      pets,
      activePetId,
      letters,
      diaryEntries,
      syncCode,
      exportedAt: Date.now(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fluffy_android_1950s_backup_${syncCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (jsonStr: string) => {
    const parsed = JSON.parse(jsonStr);
    if (parsed.pets && Array.isArray(parsed.pets)) {
      setPets(parsed.pets);
      if (parsed.activePetId) setActivePetId(parsed.activePetId);
      if (parsed.letters) setLetters(parsed.letters);
      if (parsed.diaryEntries) setDiaryEntries(parsed.diaryEntries);
      if (parsed.syncCode) setSyncCode(parsed.syncCode);
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-stone-950 text-stone-100 font-['Nunito',sans-serif]">
      {/* Android Resizable Widget Primary View */}
      <AndroidWidgetContainer
        pet={activePet}
        reaction={reaction}
        onPetClick={handlePetClick}
        onOpenFeed={() => {
          sounds.playPop();
          setIsFeedOpen(true);
        }}
        onOpenPark={() => {
          sounds.playPop();
          setIsParkOpen(true);
        }}
        onOpenMail={() => {
          sounds.playPop();
          setIsMailOpen(true);
        }}
        onOpenDiary={() => {
          sounds.playPop();
          setIsDiaryOpen(true);
        }}
        onOpenCustomization={() => {
          sounds.playPop();
          setIsCustomizationOpen(true);
        }}
        onOpenCloudSync={() => {
          sounds.playPop();
          setIsCloudSyncOpen(true);
        }}
        onOpenPetSelector={() => {
          sounds.playPop();
          setIsPetSelectorOpen(true);
        }}
        onOpenExportInstall={() => {
          sounds.playPop();
          setIsExportInstallOpen(true);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          setSoundEnabled(!soundEnabled);
          sounds.playPop();
        }}
        letters={letters}
      />

      {/* Emotion Food Tray Drawer / Modal */}
      {isFeedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setIsFeedOpen(false)}
              className="absolute -top-3 -right-3 z-50 p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white border border-stone-700 shadow-xl"
            >
              <X className="w-4 h-4" />
            </button>
            <EmotionFoodTray
              onFeed={handleFeedEmotion}
              petHunger={activePet.stats.satiety}
            />
          </div>
        </div>
      )}

      {/* Virtual Park Walk Modal */}
      <VirtualParkModal
        pet={activePet}
        isOpen={isParkOpen}
        onClose={() => setIsParkOpen(false)}
        onWalkComplete={handleWalkComplete}
      />

      {/* Mail Station & Email Reaction Modal */}
      <MailStationModal
        isOpen={isMailOpen}
        onClose={() => setIsMailOpen(false)}
        letters={letters}
        onSendTestLetter={handleSendTestLetter}
        onMarkAsRead={handleMarkAsRead}
        syncCode={syncCode}
      />

      {/* Diary Panel Modal */}
      <DiaryModal
        isOpen={isDiaryOpen}
        onClose={() => setIsDiaryOpen(false)}
        diaryEntries={diaryEntries}
        currentPet={activePet}
        allPets={pets}
        onAddCustomEntry={handleAddCustomEntry}
      />

      {/* 1950s Pet Customization Modal */}
      <CustomizationModal
        pet={activePet}
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        onSave={(updated) => {
          setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }}
      />

      {/* Cloud Sync Modal */}
      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        syncCode={syncCode}
        lastSyncedAt={lastSyncedAt}
        isSyncing={isSyncing}
        onTriggerSync={triggerCloudSync}
        onConnectCode={handleConnectCode}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Pet Selection & Adoption Modal */}
      <PetSelectorModal
        isOpen={isPetSelectorOpen}
        onClose={() => setIsPetSelectorOpen(false)}
        pets={pets}
        activePetId={activePetId}
        onSelectPet={(id) => {
          setActivePetId(id);
          setIsPetSelectorOpen(false);
          sounds.playLevelUp();
        }}
        onAddNewPet={(newPet) => {
          setPets((prev) => [...prev, newPet]);
          setActivePetId(newPet.id);
          setIsPetSelectorOpen(false);

          // Record adoption event in Diary!
          const adoptEntry: DiaryEntry = {
            id: 'diary_adopt_' + Date.now(),
            petId: newPet.id,
            petName: newPet.name,
            petSpecies: newPet.species,
            type: 'adoption',
            title: `Новый кукольный друг: ${newPet.name}! 🐾`,
            description: `В дружную семью виджета принят кукольный персонаж с характером «${newPet.activityLevel}».`,
            emoji: '🎉',
            timestamp: Date.now(),
          };
          setDiaryEntries((dPrev) => [adoptEntry, ...dPrev]);
        }}
      />

      {/* APK & GitHub Export Modal */}
      <ExportInstallModal
        isOpen={isExportInstallOpen}
        onClose={() => setIsExportInstallOpen(false)}
        appUrl={window.location.origin}
      />
    </div>
  );
}
