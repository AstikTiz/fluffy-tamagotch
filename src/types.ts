export type PetSpecies = 'bunny' | 'fox' | 'bear' | 'dragon';

export type ActivityLevel = 'sleepy' | 'calm' | 'playful' | 'hyperactive';

export type EmotionType = 'joy' | 'love' | 'calm' | 'inspiration' | 'curiosity' | 'wonder';

export interface EmotionFood {
  id: EmotionType;
  name: string;
  emoji: string;
  desc: string;
  primaryColor: string;
  glowColor: string;
  satietyGain: number;
  happinessGain: number;
  energyGain: number;
  serenityGain: number;
  xpGain: number;
  soundFrequency: number;
}

export type FurTexture = 'fluffy' | 'felt_wool' | 'clay' | 'tweed';

export type FurPattern =
  | 'solid'       // Однотонный шерстяной фетр
  | 'spotted'     // Винтажный горошек / Пятнышки
  | 'striped'     // Твидовые полоски
  | 'tweed'       // Фактурный твид / меланж
  | 'patchwork'   // Лоскутный фетровый узор
  | 'belly_patch'; // Светлая грудка и животик

export type EyeStyle = 'bead_button' | 'clay_sparkle' | 'sleepy_slit' | 'happy_arch' | 'pie_cut';

export type HatId =
  | 'none'
  | 'newsboy'      // 1950s Кепка газетчика
  | 'bowler'       // Винтажный котелок
  | 'fedora'       // Фетровая шляпа 1950-х
  | 'beanie'       // Вязаная шапочка с помпоном
  | 'aviator'      // Очки и шлем пилота 50-х
  | 'party_cone'   // Картонный колпак с серпантином
  | 'crown';       // Кукольная золотая корона

export type ScarfId =
  | 'none'
  | 'striped_wool'  // Красно-белый шерстяной шарф
  | 'cozy_cowl'     // Мягкий объёмный хомут
  | 'polka_kerchief' // Шейный платок в горошек
  | 'fringe_scarf'  // Тёплый клетчатый шарф с бахромой
  | 'bowtie';       // Винтажная бабочка

export interface PetCustomization {
  primaryColor: string;
  secondaryColor: string;
  furTexture: FurTexture;
  furPattern: FurPattern;
  eyeStyle: EyeStyle;
  hat: HatId;
  scarf: ScarfId;
  scale: number;
  stopMotionFx: boolean; // 1950s stop-motion jerky frame rate simulation
}

export type PetMood = 
  | 'ecstatic' 
  | 'happy' 
  | 'content' 
  | 'curious' 
  | 'sleepy' 
  | 'hungry' 
  | 'bored' 
  | 'excited' 
  | 'walking';

export interface PetStats {
  happiness: number;   // 0 - 100
  energy: number;      // 0 - 100
  satiety: number;     // 0 - 100 (emotional nourishment)
  serenity: number;    // 0 - 100
  affection: number;   // 0 - 100
  level: number;
  xp: number;
  stepsWalked: number;
  lastWalkTime: number;
  lastFedTime: number;
  currentMood: PetMood;
}

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  activityLevel: ActivityLevel;
  customization: PetCustomization;
  stats: PetStats;
  createdAt: number;
  unlockedHats: HatId[];
  unlockedScarves: ScarfId[];
}

export type AndroidWidgetSize = '2x2' | '3x3' | '4x2' | '4x3' | '4x4';

export interface AndroidWidgetConfig {
  size: AndroidWidgetSize;
  widthCells: number;
  heightCells: number;
  isTransparentBg: boolean;
  showQuickFeed: boolean;
}

export type ParkLocationId = 'meadow' | 'forest' | 'pond' | 'crystals' | 'stars';

export interface ParkLocation {
  id: ParkLocationId;
  name: string;
  desc: string;
  weather: 'sunny' | 'breezy' | 'petal_rain' | 'starlight' | 'fireflies';
  bgGradient: string;
  musicMood: 'playful' | 'tranquil' | 'mystic' | 'warm';
  discoveriesCount: number;
}

export interface IncomingLetter {
  id: string;
  from: string;
  subject: string;
  body: string;
  emotion: 'love' | 'joy' | 'work' | 'calm' | 'surprise';
  timestamp: number;
  read: boolean;
}

export interface ReactionState {
  type: 'idle' | 'eating' | 'petting' | 'letter_alert' | 'walking' | 'level_up' | 'sleeping';
  textBubble?: string;
  emotionEmoji?: string;
  activeUntil: number;
  meta?: any;
}

export interface DesktopTheme {
  id: string;
  name: string;
  backgroundClass: string;
  wallpaperUrl?: string;
  isDark: boolean;
}

export type DiaryEntryType =
  | 'level_up'
  | 'accessory_found'
  | 'walk_record'
  | 'adoption'
  | 'custom_memory';

export interface DiaryEntry {
  id: string;
  petId: string;
  petName: string;
  petSpecies: PetSpecies;
  type: DiaryEntryType;
  title: string;
  description: string;
  emoji: string;
  timestamp: number;
  meta?: {
    level?: number;
    accessoryName?: string;
    accessoryEmoji?: string;
    steps?: number;
    locationName?: string;
  };
}
