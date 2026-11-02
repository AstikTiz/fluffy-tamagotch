import React, { useState, useEffect } from 'react';
import { Pet, ReactionState, HatId, ScarfId, FurPattern } from '../types';

interface FluffyPetAvatarProps {
  pet: Pet;
  reaction: ReactionState;
  onPetClick?: () => void;
  size?: number;
  interactive?: boolean;
}

export const FluffyPetAvatar: React.FC<FluffyPetAvatarProps> = ({
  pet,
  reaction,
  onPetClick,
  size = 220,
  interactive = true,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Stepped stop-motion blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 2800 + Math.random() * 2400);
    return () => clearInterval(blinkInterval);
  }, []);

  const { species, activityLevel, customization, stats } = pet;
  const {
    primaryColor,
    secondaryColor,
    furPattern,
    hat = 'none',
    scarf = 'none',
    stopMotionFx = true,
  } = customization;

  // 1950s Stop-motion stepped animation duration & cadence
  const animDuration =
    activityLevel === 'sleepy'
      ? '3.6s'
      : activityLevel === 'calm'
      ? '2.6s'
      : activityLevel === 'playful'
      ? '1.8s'
      : '1.2s';

  const isEating = reaction.type === 'eating';
  const isPetting = reaction.type === 'petting';
  const isLetterAlert = reaction.type === 'letter_alert';
  const isWalking = reaction.type === 'walking';
  const isSleeping = stats.currentMood === 'sleepy' || reaction.type === 'sleeping';

  // Apply stop-motion stepped timing function
  const stopMotionTiming = stopMotionFx ? 'steps(6, jump-none)' : 'ease-in-out';

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Speech / Mood Bubble */}
      {reaction.textBubble && (
        <div className="absolute -top-11 z-30 px-3 py-1.5 rounded-2xl bg-amber-50/95 dark:bg-stone-900/95 shadow-xl text-xs font-bold text-stone-900 dark:text-amber-100 border border-amber-300/80 dark:border-amber-600/40 backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap animate-bounce font-['Comfortaa',sans-serif]">
          {reaction.emotionEmoji && <span className="text-base">{reaction.emotionEmoji}</span>}
          <span>{reaction.textBubble}</span>
        </div>
      )}

      {/* Floating Letter Alert */}
      {isLetterAlert && (
        <div className="absolute -top-6 -right-2 z-20 animate-pulse bg-gradient-to-r from-amber-400 to-rose-500 text-white p-2 rounded-2xl shadow-lg border-2 border-amber-100 flex items-center gap-1 scale-105">
          <span className="text-xl">💌</span>
          <span className="text-[10px] font-black uppercase tracking-wider bg-red-700 px-1.5 py-0.5 rounded-full">
            Письмо!
          </span>
        </div>
      )}

      {/* Sleeping Zzz */}
      {isSleeping && (
        <div className="absolute -top-6 right-6 z-20 pointer-events-none text-amber-500/80 font-extrabold text-sm animate-pulse space-y-1">
          <div className="translate-x-3 -translate-y-2 text-xs">z</div>
          <div className="translate-x-1.5 -translate-y-1 text-sm">Z</div>
          <div className="text-base">Zzz...</div>
        </div>
      )}

      {/* Main 1950s Stop-Motion Puppet SVG */}
      <svg
        viewBox="0 0 240 240"
        className={`w-full h-full transition-transform duration-200 ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        }`}
        onClick={interactive ? onPetClick : undefined}
        style={{
          filter: 'drop-shadow(0 12px 18px rgba(35, 25, 20, 0.28))',
          transform: `scale(${customization.scale || 1})`,
        }}
      >
        <defs>
          {/* Tactile 1950s stop-motion felt/clay shading gradients */}
          <radialGradient id={`felt_body_${pet.id}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor={adjustColor(primaryColor, 18)} />
            <stop offset="60%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={adjustColor(primaryColor, -28)} />
          </radialGradient>

          <radialGradient id={`felt_belly_${pet.id}`} cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor={adjustColor(secondaryColor, 10)} />
            <stop offset="70%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={adjustColor(secondaryColor, -18)} />
          </radialGradient>

          {/* Button eye gloss filter */}
          <radialGradient id="button_eye_gloss" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#44403c" />
            <stop offset="40%" stopColor="#1c1917" />
            <stop offset="100%" stopColor="#0c0a09" />
          </radialGradient>

          {/* Vintage film grain / texture pattern for 1950s felt */}
          <pattern id="felt_stipple" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.6" fill="rgba(0,0,0,0.06)" />
            <circle cx="4.5" cy="4.5" r="0.6" fill="rgba(255,255,255,0.08)" />
          </pattern>
        </defs>

        {/* 1950s Puppet Stepped Animation Group */}
        <g
          className={isWalking ? 'animate-bounce' : isLetterAlert ? 'animate-pulse' : ''}
          style={{
            transformOrigin: '120px 185px',
            animation: !isWalking
              ? `stopMotionBob ${animDuration} ${stopMotionTiming} infinite`
              : undefined,
          }}
        >
          {/* Ground Contact Shadow (vintage claymation studio look) */}
          <ellipse cx="120" cy="214" rx="66" ry="12" fill="rgba(20, 15, 10, 0.3)" />

          {/* Tail according to species */}
          {renderTail(species, primaryColor, secondaryColor, pet.id)}

          {/* Ears according to species */}
          {renderEars(species, primaryColor, secondaryColor, pet.id, isLetterAlert, isPetting)}

          {/* Dragon wings if dragon */}
          {species === 'dragon' && (
            <g opacity="0.9">
              <path
                d="M 48 114 C 18 80 12 135 52 148 Z"
                fill={adjustColor(primaryColor, 15)}
                stroke={adjustColor(primaryColor, -25)}
                strokeWidth="2"
              />
              <path
                d="M 192 114 C 222 80 228 135 188 148 Z"
                fill={adjustColor(primaryColor, 15)}
                stroke={adjustColor(primaryColor, -25)}
                strokeWidth="2"
              />
            </g>
          )}

          {/* Main Felt Puppet Body */}
          <ellipse
            cx="120"
            cy="144"
            rx="70"
            ry="66"
            fill={`url(#felt_body_${pet.id})`}
            stroke={adjustColor(primaryColor, -30)}
            strokeWidth="1.5"
          />

          {/* Subtle Felt Fabric Texture Overlay */}
          <ellipse
            cx="120"
            cy="144"
            rx="70"
            ry="66"
            fill="url(#felt_stipple)"
            pointerEvents="none"
          />

          {/* Hand-crafted Seam Stitch Lines (1950s puppet craft) */}
          <path
            d="M 120 78 L 120 100"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1.5"
            strokeDasharray="2,2"
            fill="none"
          />

          {/* Fur Pattern Overlay (Spotted, Striped, Tweed, Patchwork, Belly Patch) */}
          {renderFurPattern(furPattern, primaryColor, secondaryColor, pet.id)}

          {/* Cheek Tufts (soft vintage puppet fluff) */}
          <path
            d="M 62 136 C 48 142 50 152 64 156 C 52 162 58 170 70 166 Z"
            fill={primaryColor}
            stroke={adjustColor(primaryColor, -25)}
            strokeWidth="1.2"
          />
          <path
            d="M 178 136 C 192 142 190 152 176 156 C 188 162 182 170 170 166 Z"
            fill={primaryColor}
            stroke={adjustColor(primaryColor, -25)}
            strokeWidth="1.2"
          />

          {/* 1950s Hand-painted Rouge Blush */}
          <g fill="#e17076" opacity="0.45">
            <ellipse cx="80" cy="148" rx="10" ry="6" />
            <ellipse cx="160" cy="148" rx="10" ry="6" />
          </g>

          {/* 1950s Glass Bead / Button Eyes */}
          {renderEyes(isBlinking, isSleeping, isPetting, isEating, isLetterAlert)}

          {/* Stitched Clay Nose */}
          <polygon
            points="114,131 126,131 120,137"
            fill="#881337"
            stroke="#4c0519"
            strokeWidth="1"
          />

          {/* Handcrafted Stitched Mouth */}
          {renderMouth(isEating, isPetting, isLetterAlert, isSleeping)}

          {/* Stitched Puppet Paws */}
          <g>
            <ellipse
              cx="92"
              cy="194"
              rx="15"
              ry="10"
              fill={secondaryColor}
              stroke={adjustColor(primaryColor, -25)}
              strokeWidth="1.2"
            />
            {/* Paw stitch indentation */}
            <line x1="88" y1="192" x2="88" y2="201" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" />
            <line x1="96" y1="192" x2="96" y2="201" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" />

            <ellipse
              cx="148"
              cy="194"
              rx="15"
              ry="10"
              fill={secondaryColor}
              stroke={adjustColor(primaryColor, -25)}
              strokeWidth="1.2"
            />
            <line x1="144" y1="192" x2="144" y2="201" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" />
            <line x1="152" y1="192" x2="152" y2="201" stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" />
          </g>

          {/* Letter in paw when alert */}
          {isLetterAlert && (
            <g transform="translate(100, 150) rotate(-5)">
              <rect
                x="0"
                y="0"
                width="40"
                height="26"
                rx="3"
                fill="#fffbeb"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              <path d="M 0 0 L 20 15 L 40 0" fill="none" stroke="#d97706" strokeWidth="1.2" />
              <circle cx="20" cy="13" r="5" fill="#dc2626" />
              <text x="20" y="16" fontSize="7" textAnchor="middle" fill="#fff" fontWeight="bold">♥</text>
            </g>
          )}

          {/* 1950s Scarf Accessory (Renders over body) */}
          {renderScarf(scarf)}

          {/* 1950s Hat Accessory (Renders atop head) */}
          {renderHat(hat, species)}
        </g>
      </svg>

      {/* Mood Badge */}
      <div className="mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/70 border border-stone-700/60 backdrop-blur-md text-xs shadow-sm">
        <span
          className={`w-2 h-2 rounded-full ${
            stats.happiness > 75
              ? 'bg-amber-400 animate-pulse'
              : stats.happiness > 45
              ? 'bg-emerald-400'
              : 'bg-rose-400'
          }`}
        />
        <span className="font-semibold text-stone-200">
          {stats.currentMood === 'ecstatic'
            ? 'Восторг!'
            : stats.currentMood === 'happy'
            ? 'Счастлив'
            : stats.currentMood === 'curious'
            ? 'Любопытен'
            : stats.currentMood === 'sleepy'
            ? 'Дремлет'
            : stats.currentMood === 'hungry'
            ? 'Ждёт эмоций'
            : stats.currentMood === 'walking'
            ? 'В парке'
            : 'Спокоен'}
        </span>
      </div>
    </div>
  );
};

// Color adjuster
function adjustColor(hex: string, percent: number): string {
  try {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + percent;
    let b = ((num >> 8) & 0x00ff) + percent;
    let g = (num & 0x0000ff) + percent;
    r = Math.min(255, Math.max(0, r));
    b = Math.min(255, Math.max(0, b));
    g = Math.min(255, Math.max(0, g));
    return `#${((1 << 24) + (r << 16) + (b << 8) + g).toString(16).slice(1)}`;
  } catch (e) {
    return hex;
  }
}

// 1950s Fur Patterns
function renderFurPattern(
  pattern: FurPattern,
  primaryColor: string,
  secondaryColor: string,
  petId: string
) {
  switch (pattern) {
    case 'belly_patch':
      return (
        <ellipse
          cx="120"
          cy="154"
          rx="44"
          ry="38"
          fill={`url(#felt_belly_${petId})`}
          stroke={adjustColor(secondaryColor, -20)}
          strokeWidth="1.2"
        />
      );

    case 'spotted':
      return (
        <g fill={secondaryColor} opacity="0.85">
          <circle cx="85" cy="115" r="7" />
          <circle cx="155" cy="115" r="7" />
          <circle cx="120" cy="100" r="5" />
          <circle cx="95" cy="165" r="9" />
          <circle cx="145" cy="165" r="9" />
          <circle cx="120" cy="175" r="6" />
        </g>
      );

    case 'striped':
      return (
        <g stroke={secondaryColor} strokeWidth="6" strokeLinecap="round" opacity="0.85">
          <path d="M 75 125 Q 120 135 165 125" />
          <path d="M 72 145 Q 120 158 168 145" />
          <path d="M 78 165 Q 120 178 162 165" />
        </g>
      );

    case 'tweed':
      return (
        <g stroke={adjustColor(primaryColor, -25)} strokeWidth="1.2" opacity="0.6">
          {/* Tweed herringbone stitches */}
          <path d="M 90 120 L 96 126 L 102 120 L 108 126 L 114 120" fill="none" />
          <path d="M 126 120 L 132 126 L 138 120 L 144 126 L 150 120" fill="none" />
          <path d="M 95 140 L 101 146 L 107 140 L 113 146 L 119 140" fill="none" />
          <path d="M 125 140 L 131 146 L 137 140 L 143 146 L 149 140" fill="none" />
          <path d="M 98 160 L 104 166 L 110 160 L 116 166 L 122 160" fill="none" />
          <path d="M 124 160 L 130 166 L 136 160 L 142 166 L 148 160" fill="none" />
        </g>
      );

    case 'patchwork':
      return (
        <g>
          {/* Handcrafted felt patches */}
          <path
            d="M 90 135 L 120 130 L 115 160 L 85 155 Z"
            fill={secondaryColor}
            opacity="0.85"
            stroke={adjustColor(primaryColor, -30)}
            strokeWidth="1.2"
            strokeDasharray="3,2"
          />
          <path
            d="M 130 145 L 155 140 L 150 170 L 125 165 Z"
            fill={adjustColor(secondaryColor, -15)}
            opacity="0.85"
            stroke={adjustColor(primaryColor, -30)}
            strokeWidth="1.2"
            strokeDasharray="3,2"
          />
        </g>
      );

    case 'solid':
    default:
      return null;
  }
}

// 1950s Glass Bead Eyes
function renderEyes(
  blinking: boolean,
  sleeping: boolean,
  petting: boolean,
  eating: boolean,
  alert: boolean
) {
  if (blinking || sleeping) {
    // Stepped closed puppet eye line
    return (
      <g stroke="#262626" strokeWidth="3.2" strokeLinecap="round" fill="none">
        <path d="M 88 122 Q 97 127 106 122" />
        <path d="M 134 122 Q 143 127 152 122" />
      </g>
    );
  }

  if (petting || eating) {
    // Vintage happy crescent arcs
    return (
      <g stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <path d="M 86 123 Q 96 114 106 123" />
        <path d="M 134 123 Q 144 114 154 123" />
      </g>
    );
  }

  if (alert) {
    // Wide glass bead eyes with star sparkle
    return (
      <g>
        <ellipse cx="96" cy="120" rx="12" ry="14" fill="url(#button_eye_gloss)" />
        <ellipse cx="144" cy="120" rx="12" ry="14" fill="url(#button_eye_gloss)" />
        {/* Pinprick reflections */}
        <circle cx="93" cy="116" r="3.5" fill="#ffffff" />
        <circle cx="99" cy="123" r="1.5" fill="#ffffff" />
        <circle cx="141" cy="116" r="3.5" fill="#ffffff" />
        <circle cx="147" cy="123" r="1.5" fill="#ffffff" />
      </g>
    );
  }

  // Classic 1950s glossy black bead puppet eyes
  return (
    <g>
      <ellipse cx="96" cy="120" rx="10" ry="12" fill="url(#button_eye_gloss)" />
      <ellipse cx="144" cy="120" rx="10" ry="12" fill="url(#button_eye_gloss)" />
      {/* Specular highlights */}
      <circle cx="93" cy="116" r="3.5" fill="#ffffff" />
      <circle cx="141" cy="116" r="3.5" fill="#ffffff" />
      <circle cx="98" cy="122" r="1.5" fill="#ffffff" opacity="0.7" />
      <circle cx="146" cy="122" r="1.5" fill="#ffffff" opacity="0.7" />
    </g>
  );
}

// 1950s Stitched Mouth
function renderMouth(eating: boolean, petting: boolean, alert: boolean, sleeping: boolean) {
  if (sleeping) {
    return (
      <path
        d="M 117 141 Q 120 143 123 141"
        stroke="#44403c"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    );
  }

  if (eating) {
    return (
      <g>
        <ellipse cx="120" cy="144" rx="7" ry="8" fill="#9f1239" stroke="#4c0519" strokeWidth="1" />
        <path d="M 115 146 Q 120 143 125 146" fill="#fb7185" />
      </g>
    );
  }

  if (petting || alert) {
    return (
      <path
        d="M 113 139 Q 120 148 127 139"
        fill="#be123c"
        stroke="#44403c"
        strokeWidth="1.5"
      />
    );
  }

  // Stitched puppet thread smile
  return (
    <path
      d="M 113 139 Q 117 144 120 140 Q 123 144 127 139"
      stroke="#292524"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
  );
}

// 1950s Ears
function renderEars(
  species: string,
  primaryColor: string,
  secondaryColor: string,
  petId: string,
  alert: boolean,
  petting: boolean
) {
  const earWiggle = alert ? '-translate-y-2' : petting ? 'translate-y-1' : '';

  if (species === 'bunny') {
    return (
      <g className={`transition-all duration-300 ${earWiggle}`}>
        {/* Felt Bunny Wire Ears */}
        <path
          d="M 86 86 C 66 12 88 4 98 68 Z"
          fill={`url(#felt_body_${petId})`}
          stroke={adjustColor(primaryColor, -25)}
          strokeWidth="1.8"
        />
        <path d="M 87 76 C 78 28 87 20 94 66 Z" fill="#fbcfe8" opacity="0.8" />
        {/* Stitch mark on ear */}
        <line x1="88" y1="45" x2="94" y2="45" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" />

        <path
          d="M 154 86 C 174 12 152 4 142 68 Z"
          fill={`url(#felt_body_${petId})`}
          stroke={adjustColor(primaryColor, -25)}
          strokeWidth="1.8"
        />
        <path d="M 153 76 C 162 28 153 20 146 66 Z" fill="#fbcfe8" opacity="0.8" />
        <line x1="146" y1="45" x2="152" y2="45" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" />
      </g>
    );
  }

  if (species === 'fox') {
    return (
      <g className={`transition-all duration-300 ${earWiggle}`}>
        <polygon
          points="62,90 85,25 105,80"
          fill={`url(#felt_body_${petId})`}
          stroke={adjustColor(primaryColor, -25)}
          strokeWidth="1.8"
        />
        <polygon points="69,85 85,38 99,78" fill="#fef3c7" />
        <polygon
          points="178,90 155,25 135,80"
          fill={`url(#felt_body_${petId})`}
          stroke={adjustColor(primaryColor, -25)}
          strokeWidth="1.8"
        />
        <polygon points="171,85 155,38 141,78" fill="#fef3c7" />
      </g>
    );
  }

  if (species === 'bear') {
    return (
      <g className={`transition-all duration-300 ${earWiggle}`}>
        <circle cx="75" cy="65" r="23" fill={`url(#felt_body_${petId})`} stroke={adjustColor(primaryColor, -25)} strokeWidth="1.8" />
        <circle cx="75" cy="65" r="13" fill="#fed7aa" opacity="0.85" />
        <circle cx="165" cy="65" r="23" fill={`url(#felt_body_${petId})`} stroke={adjustColor(primaryColor, -25)} strokeWidth="1.8" />
        <circle cx="165" cy="65" r="13" fill="#fed7aa" opacity="0.85" />
      </g>
    );
  }

  // Dragon puppet horns & ears
  return (
    <g className={`transition-all duration-300 ${earWiggle}`}>
      <path d="M 70 82 C 45 42 70 32 92 77 Z" fill={`url(#felt_body_${petId})`} stroke={adjustColor(primaryColor, -25)} strokeWidth="1.8" />
      <path d="M 170 82 C 195 42 170 32 148 77 Z" fill={`url(#felt_body_${petId})`} stroke={adjustColor(primaryColor, -25)} strokeWidth="1.8" />
      {/* Felt horns */}
      <polygon points="95,65 102,40 108,65" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
      <polygon points="145,65 138,40 132,65" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
    </g>
  );
}

// 1950s Puppet Tails
function renderTail(
  species: string,
  primaryColor: string,
  secondaryColor: string,
  petId: string
) {
  if (species === 'bunny') {
    return (
      <circle
        cx="178"
        cy="188"
        r="18"
        fill="#f5ebd9"
        stroke={adjustColor(primaryColor, -25)}
        strokeWidth="1.5"
      />
    );
  }
  if (species === 'fox') {
    return (
      <g className="animate-wiggle" style={{ transformOrigin: '175px 175px' }}>
        <path
          d="M 160 170 C 220 160 235 110 205 90 C 185 110 180 140 160 170 Z"
          fill={`url(#felt_body_${petId})`}
          stroke={adjustColor(primaryColor, -25)}
          strokeWidth="1.5"
        />
        <path
          d="M 205 90 C 215 105 200 120 185 110 Z"
          fill="#fef3c7"
          stroke={adjustColor(primaryColor, -25)}
          strokeWidth="1.2"
        />
      </g>
    );
  }
  if (species === 'dragon') {
    return (
      <path
        d="M 160 185 Q 210 195 215 155 Q 200 165 155 178 Z"
        fill={`url(#felt_body_${petId})`}
        stroke={adjustColor(primaryColor, -25)}
        strokeWidth="1.5"
      />
    );
  }
  // Bear stubby puppet tail
  return (
    <circle
      cx="172"
      cy="184"
      r="14"
      fill={`url(#felt_body_${petId})`}
      stroke={adjustColor(primaryColor, -25)}
      strokeWidth="1.5"
    />
  );
}

// 1950s Hats
function renderHat(hat: HatId, species: string) {
  switch (hat) {
    case 'newsboy':
      // 1950s Tweed Flat Cap
      return (
        <g transform="translate(120, 72)">
          {/* Cap Body */}
          <ellipse cx="0" cy="0" rx="36" ry="16" fill="#78716c" stroke="#44403c" strokeWidth="1.5" />
          {/* Brim */}
          <path d="M -28 6 Q 0 16 28 6" stroke="#292524" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Center Button */}
          <circle cx="0" cy="-6" r="3.5" fill="#292524" />
        </g>
      );

    case 'bowler':
      // 1950s English Bowler Hat
      return (
        <g transform="translate(120, 68)">
          {/* Crown */}
          <path d="M -22 4 C -24 -24 24 -24 22 4 Z" fill="#292524" stroke="#1c1917" strokeWidth="1.5" />
          {/* Ribbon */}
          <rect x="-22" y="-1" width="44" height="5" fill="#dc2626" />
          {/* Curved Brim */}
          <ellipse cx="0" cy="5" rx="32" ry="6" fill="#1c1917" />
        </g>
      );

    case 'fedora':
      // 1950s Detective Fedora
      return (
        <g transform="translate(120, 66)">
          {/* Indented Crown */}
          <path d="M -24 4 C -20 -20 -8 -15 0 -22 C 8 -15 20 -20 24 4 Z" fill="#57534e" stroke="#292524" strokeWidth="1.5" />
          {/* Silk band */}
          <rect x="-24" y="-1" width="48" height="5" fill="#1c1917" />
          {/* Brim */}
          <ellipse cx="0" cy="5" rx="35" ry="7" fill="#44403c" stroke="#292524" strokeWidth="1" />
        </g>
      );

    case 'beanie':
      // Chunky Knit Winter Beanie with Pompom
      return (
        <g transform="translate(120, 66)">
          {/* Beanie Dome */}
          <path d="M -26 6 C -28 -22 28 -22 26 6 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
          {/* Ribbed Brim */}
          <rect x="-28" y="2" width="56" height="8" rx="3" fill="#f87171" stroke="#b91c1c" strokeWidth="1" />
          {/* Fluffy Yarn Pompom */}
          <circle cx="0" cy="-22" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
        </g>
      );

    case 'aviator':
      // 1950s Aviator Helmet & Goggles
      return (
        <g transform="translate(120, 72)">
          {/* Leather Cap */}
          <path d="M -26 4 C -28 -20 28 -20 26 4 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
          {/* Ear flaps */}
          <path d="M -26 4 L -24 16 L -18 14 L -20 4 Z" fill="#78350f" />
          <path d="M 26 4 L 24 16 L 18 14 L 20 4 Z" fill="#78350f" />
          {/* Brass Goggles */}
          <circle cx="-12" cy="6" r="10" fill="#93c5fd" stroke="#ca8a04" strokeWidth="3" />
          <circle cx="12" cy="6" r="10" fill="#93c5fd" stroke="#ca8a04" strokeWidth="3" />
          <line x1="-2" y1="6" x2="2" y2="6" stroke="#ca8a04" strokeWidth="3" />
          <line x1="-15" y1="3" x2="-8" y2="9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="9" y1="3" x2="16" y2="9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case 'party_cone':
      // Birthday Party Cone Hat
      return (
        <g transform="translate(120, 56)">
          <polygon points="0,-28 -18,16 18,16" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="-10" y1="4" x2="10" y2="-12" stroke="#ec4899" strokeWidth="3" />
          <line x1="-14" y1="12" x2="14" y2="-4" stroke="#06b6d4" strokeWidth="3" />
          {/* Tinsel top */}
          <circle cx="0" cy="-28" r="5" fill="#f43f5e" />
        </g>
      );

    case 'crown':
      // Puppet Golden Crown
      return (
        <g transform="translate(120, 68)">
          <polygon
            points="-22,0 -16,-18 -6,-6 0,-22 6,-6 16,-18 22,0"
            fill="#fbbf24"
            stroke="#b45309"
            strokeWidth="1.5"
          />
          <circle cx="0" cy="-14" r="2.5" fill="#dc2626" />
          <circle cx="-12" cy="-11" r="2" fill="#2563eb" />
          <circle cx="12" cy="-11" r="2" fill="#16a34a" />
        </g>
      );

    case 'none':
    default:
      return null;
  }
}

// 1950s Scarves
function renderScarf(scarf: ScarfId) {
  switch (scarf) {
    case 'striped_wool':
      // Red and white knit scarf
      return (
        <g>
          {/* Neck wrap */}
          <path
            d="M 85 168 C 105 178 135 178 155 168 C 160 176 148 184 120 184 C 92 184 80 176 85 168 Z"
            fill="#dc2626"
            stroke="#991b1b"
            strokeWidth="1.5"
          />
          {/* Stripes */}
          <line x1="98" y1="171" x2="103" y2="181" stroke="#ffffff" strokeWidth="4" />
          <line x1="120" y1="172" x2="120" y2="184" stroke="#ffffff" strokeWidth="4" />
          <line x1="140" y1="171" x2="136" y2="181" stroke="#ffffff" strokeWidth="4" />
          {/* Dangling tail with fringe */}
          <rect x="134" y="176" width="14" height="26" rx="2" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
          <line x1="134" y1="184" x2="148" y2="184" stroke="#ffffff" strokeWidth="3" />
          <line x1="134" y1="194" x2="148" y2="194" stroke="#ffffff" strokeWidth="3" />
          {/* Fringe threads */}
          <line x1="136" y1="202" x2="136" y2="207" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="141" y1="202" x2="141" y2="207" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="146" y1="202" x2="146" y2="207" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      );

    case 'cozy_cowl':
      // Chunky Knit Cowl Collar
      return (
        <g>
          <ellipse cx="120" cy="174" rx="36" ry="12" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
          {/* Cable knit ribbing marks */}
          <path d="M 96 170 Q 100 176 96 182" stroke="#78350f" strokeWidth="1.5" fill="none" />
          <path d="M 110 171 Q 114 177 110 183" stroke="#78350f" strokeWidth="1.5" fill="none" />
          <path d="M 124 171 Q 128 177 124 183" stroke="#78350f" strokeWidth="1.5" fill="none" />
          <path d="M 138 170 Q 142 176 138 182" stroke="#78350f" strokeWidth="1.5" fill="none" />
        </g>
      );

    case 'polka_kerchief':
      // 1950s Silk Polka Neckerchief
      return (
        <g>
          <polygon points="90,166 120,188 150,166" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.2" />
          {/* Polka dots */}
          <circle cx="106" cy="172" r="2" fill="#ffffff" />
          <circle cx="134" cy="172" r="2" fill="#ffffff" />
          <circle cx="120" cy="178" r="2" fill="#ffffff" />
          {/* Side knot */}
          <circle cx="112" cy="168" r="4.5" fill="#1d4ed8" />
        </g>
      );

    case 'fringe_scarf':
      // Plaid blanket fringe scarf
      return (
        <g>
          <path
            d="M 85 168 C 105 178 135 178 155 168 C 158 174 148 183 120 183 C 92 183 82 174 85 168 Z"
            fill="#059669"
            stroke="#065f46"
            strokeWidth="1.5"
          />
          {/* Tartan lines */}
          <line x1="90" y1="174" x2="150" y2="174" stroke="#fde047" strokeWidth="1.5" />
          <rect x="136" y="174" width="14" height="24" rx="2" fill="#059669" stroke="#065f46" strokeWidth="1" />
          <line x1="143" y1="174" x2="143" y2="198" stroke="#fde047" strokeWidth="1.5" />
          {/* Fringe */}
          <line x1="138" y1="198" x2="138" y2="204" stroke="#065f46" strokeWidth="1.5" />
          <line x1="143" y1="198" x2="143" y2="204" stroke="#065f46" strokeWidth="1.5" />
          <line x1="148" y1="198" x2="148" y2="204" stroke="#065f46" strokeWidth="1.5" />
        </g>
      );

    case 'bowtie':
      // 1950s Velvet Bowtie
      return (
        <g transform="translate(120, 172)">
          <polygon points="-16,-6 -16,6 0,0" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
          <polygon points="16,-6 16,6 0,0" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
          <circle cx="0" cy="0" r="4.5" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
        </g>
      );

    case 'none':
    default:
      return null;
  }
}
