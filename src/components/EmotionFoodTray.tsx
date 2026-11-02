import React from 'react';
import { EmotionFood, EmotionType } from '../types';
import { EMOTION_FOODS } from '../constants/initialData';
import { Sparkles, Heart, Zap, Waves, Lightbulb, Compass, Award } from 'lucide-react';

interface EmotionFoodTrayProps {
  onFeed: (food: EmotionFood) => void;
  petHunger: number;
}

export const EmotionFoodTray: React.FC<EmotionFoodTrayProps> = ({
  onFeed,
  petHunger,
}) => {
  const getIcon = (id: EmotionType) => {
    switch (id) {
      case 'love':
        return <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />;
      case 'joy':
        return <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />;
      case 'calm':
        return <Waves className="w-5 h-5 text-cyan-400" />;
      case 'inspiration':
        return <Lightbulb className="w-5 h-5 text-purple-400" />;
      case 'curiosity':
        return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'wonder':
        return <Sparkles className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="bg-slate-900/80 dark:bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <span>✨ Кормление Эмоциями</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Сытость: {Math.round(petHunger)}%
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Пушистик питается чистыми чувствами, вдохновением и радостью
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {EMOTION_FOODS.map((food) => {
          return (
            <button
              key={food.id}
              onClick={() => onFeed(food)}
              className="group relative flex flex-col text-left p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 hover:border-pink-500/50 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/10 active:translate-y-0"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-2xl p-1.5 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                  {food.emoji}
                </span>
                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-pink-500/20 transition-colors">
                  {getIcon(food.id)}
                </div>
              </div>

              <span className="font-bold text-sm text-slate-200 group-hover:text-pink-300 transition-colors">
                {food.name}
              </span>
              <span className="text-[11px] text-slate-400 line-clamp-2 mt-1 mb-2 leading-tight">
                {food.desc}
              </span>

              {/* Stat gains badges */}
              <div className="flex flex-wrap gap-1 mt-auto pt-1 border-t border-white/5 text-[10px] font-semibold text-slate-300">
                <span className="text-pink-400">+{food.happinessGain} Счастье</span>
                <span className="text-amber-400">+{food.xpGain} XP</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
