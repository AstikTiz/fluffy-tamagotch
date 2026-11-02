import React, { useState } from 'react';
import { IncomingLetter } from '../types';
import { Mail, Send, Sparkles, Heart, Briefcase, Bell, Check, Trash2, X, Globe } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MailStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  letters: IncomingLetter[];
  onSendTestLetter: (letter: Omit<IncomingLetter, 'id' | 'timestamp' | 'read'>) => void;
  onMarkAsRead: (id: string) => void;
  syncCode: string;
}

export const MailStationModal: React.FC<MailStationModalProps> = ({
  isOpen,
  onClose,
  letters,
  onSendTestLetter,
  onMarkAsRead,
  syncCode,
}) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose' | 'webhook'>('inbox');
  const [selectedLetter, setSelectedLetter] = useState<IncomingLetter | null>(null);

  // Form state for compose
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [emotion, setEmotion] = useState<'love' | 'joy' | 'work' | 'calm' | 'surprise'>('love');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    onSendTestLetter({
      from: sender.trim() || 'Почтовый Голубь',
      subject: subject.trim(),
      body: body.trim(),
      emotion,
    });

    setSubject('');
    setBody('');
    setActiveTab('inbox');
    sounds.playMailChime();
  };

  const sendPreset = (type: 'love' | 'joy' | 'work' | 'surprise') => {
    const presets = {
      love: {
        from: 'Тайный Поклонник',
        subject: 'Ты замечательный человек!',
        body: 'Пусть этот день принесёт тебе уют, тепло и много улыбок. Твой пушистик всегда рядом!',
        emotion: 'love' as const,
      },
      joy: {
        from: 'Клуб Пушистых Друзей',
        subject: 'Приглашение на фестиваль звёздной пыли! 🎉',
        body: 'Сегодня в парке будет грандиозный салют из мыльных пузырей и сладкой ваты. Ждём тебя и твоего питомца!',
        emotion: 'joy' as const,
      },
      work: {
        from: 'Руководитель Проекта',
        subject: 'Важное уведомление: дедлайн успешно закрыт!',
        body: 'Отличная работа по запуску! Можно выдохнуть, выпить какао и погладить питомца.',
        emotion: 'work' as const,
      },
      surprise: {
        from: 'Звёздная Обсерватория',
        subject: 'Открыта новая туманность счастья! ✨',
        body: 'Астрономы зафиксировали аномальный уровень милоты прямо на твоём рабочем столе.',
        emotion: 'surprise' as const,
      },
    };

    const p = presets[type];
    onSendTestLetter(p);
    sounds.playMailChime();
  };

  const webhookUrl = `${window.location.origin}/api/mail/incoming`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Почтовая Станция Реакций</h2>
              <p className="text-xs text-slate-400">
                Питомец чутко реагирует на каждое новое входящее письмо!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 gap-3">
          <button
            onClick={() => {
              setActiveTab('inbox');
              setSelectedLetter(null);
            }}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'inbox'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Входящие</span>
            <span className="px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px]">
              {letters.filter((l) => !l.read).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('compose')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'compose'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Тестовое письмо</span>
          </button>

          <button
            onClick={() => setActiveTab('webhook')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'webhook'
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Вебхук / API</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'inbox' && (
            <div>
              {/* Quick simulation presets */}
              <div className="mb-4 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Быстрая симуляция реакций на письма:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => sendPreset('love')}
                    className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-semibold border border-pink-500/30 transition-all flex items-center gap-1"
                  >
                    <span>💌 Тёплое письмо</span>
                  </button>
                  <button
                    onClick={() => sendPreset('joy')}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all flex items-center gap-1"
                  >
                    <span>🎉 Праздничная весть</span>
                  </button>
                  <button
                    onClick={() => sendPreset('work')}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold border border-blue-500/30 transition-all flex items-center gap-1"
                  >
                    <span>💼 Деловое известие</span>
                  </button>
                  <button
                    onClick={() => sendPreset('surprise')}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-all flex items-center gap-1"
                  >
                    <span>✨ Сюрприз</span>
                  </button>
                </div>
              </div>

              {/* Letters list or detail */}
              {selectedLetter ? (
                <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
                  <button
                    onClick={() => setSelectedLetter(null)}
                    className="text-xs text-pink-400 hover:underline mb-3 block"
                  >
                    ← Назад ко всем письмам
                  </button>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">{selectedLetter.subject}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(selectedLetter.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="text-xs text-pink-300 mb-3">От: {selectedLetter.from}</div>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-white/5">
                    {selectedLetter.body}
                  </p>
                </div>
              ) : letters.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-4xl mb-2">📬</div>
                  <div className="text-sm font-semibold">Почтовый ящик пуст</div>
                  <div className="text-xs mt-1">
                    Нажмите кнопку симуляции выше, чтобы отправить тестовое письмо!
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {letters.map((letter) => (
                    <div
                      key={letter.id}
                      onClick={() => {
                        setSelectedLetter(letter);
                        onMarkAsRead(letter.id);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        !letter.read
                          ? 'bg-slate-800/80 border-pink-500/40 hover:border-pink-400 shadow-md shadow-pink-500/5'
                          : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/60 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {letter.emotion === 'love'
                            ? '💌'
                            : letter.emotion === 'joy'
                            ? '🎉'
                            : letter.emotion === 'work'
                            ? '💼'
                            : '✨'}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold ${
                                !letter.read ? 'text-white' : 'text-slate-300'
                              }`}
                            >
                              {letter.subject}
                            </span>
                            {!letter.read && (
                              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate max-w-sm">
                            {letter.from} — {letter.body}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(letter.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'compose' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  От кого (отправитель):
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="Например: Любимый друг, Коллега, Тайная муза"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Тема письма:
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Заголовок письма"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Эмоциональный тон (определяет реакцию пушистика):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'love', name: 'Любовь 💖' },
                    { id: 'joy', name: 'Радость ⚡' },
                    { id: 'work', name: 'Деловое 💼' },
                    { id: 'surprise', name: 'Восторг 🌟' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setEmotion(item.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-colors ${
                        emotion === item.id
                          ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Текст послания:
                </label>
                <textarea
                  required
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Напишите пару тёплых строк..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 hover:from-pink-400 hover:to-rose-400 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Отправить и вызвать реакцию питомца</span>
              </button>
            </form>
          )}

          {activeTab === 'webhook' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                <div className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Входящий Webhook URL для реальных писем и уведомлений:</span>
                </div>
                <code className="block p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-pink-300 select-all border border-slate-800 break-all my-2">
                  {webhookUrl}
                </code>
                <p className="text-[11px] text-slate-400">
                  Вы можете настроить пересылку писем из Gmail, Zapier, IFTTT или любого сервиса, отправляя POST запрос на этот эндпоинт. Питомец мгновенно оживёт на вашем экране!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700">
                <div className="text-xs font-bold text-slate-300 mb-2">Пример запроса (curl):</div>
                <pre className="p-3 rounded-xl bg-slate-950 text-[10px] font-mono text-emerald-300 overflow-x-auto border border-slate-800">
{`curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "syncCode": "${syncCode}",
    "from": "Клиент",
    "subject": "Новый заказ получен!",
    "body": "Поздравляем с новым проектом!",
    "emotion": "joy"
  }'`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
