import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import {
  Download,
  Smartphone,
  Github,
  Terminal,
  Check,
  Copy,
  ExternalLink,
  X,
  Package,
  QrCode,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface ExportInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const ExportInstallModal: React.FC<ExportInstallModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk_github' | 'zip'>('pwa');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      setDownloadError(null);
      setDownloadSuccess(false);
      sounds.playPop();

      const res = await fetch('/api/export-project-zip');
      if (!res.ok) throw new Error('Сервер вернул статус ' + res.status);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fluffy-tamagotchi-project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      sounds.playLevelUp();
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setDownloadError('Ошибка скачивания: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    sounds.playPop();
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const gitCommands = `git init
git add .
git commit -m "🐾 Релиз кукольного тамагочи 1950-х"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/fluffy-tamagotchi.git
git push -u origin main`;

  const capacitorCommands = `npm install
npm run build
npx cap add android
npx cap copy android
npx cap open android`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-['Nunito',sans-serif]">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-amber-900/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                <span>Установка на Телефон и Экспорт</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Android & GitHub
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Установите приложение на телефон или соберите APK через GitHub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 px-6 gap-2">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'pwa'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Установка на телефон (PWA)</span>
          </button>

          <button
            onClick={() => setActiveTab('apk_github')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'apk_github'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Экспорт на GitHub & Сборка APK</span>
          </button>

          <button
            onClick={() => setActiveTab('zip')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'zip'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Скачать проект (ZIP)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white">
                    Самый быстрый способ: Установка в 1 клик на Android
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Приложение настроено как <strong>Progressive Web App (PWA)</strong>. Оно устанавливается на Android в виде полноценного приложения с ярлыком на рабочем столе, работает во весь экран и не требует компиляции APK-файла через компьютер!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Как открыть на вашем телефоне:</span>
                </h4>

                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2.5 rounded-xl bg-stone-900 text-xs font-mono text-emerald-300 select-all border border-stone-800 break-all">
                    {appUrl || window.location.href}
                  </code>
                  <button
                    onClick={() => copyToClipboard(appUrl || window.location.href, 'url')}
                    className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition-colors"
                    title="Скопировать ссылку"
                  >
                    {copiedCmd === 'url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="space-y-2 pt-2 text-xs text-stone-300">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      1
                    </span>
                    <span>Откройте ссылку выше в браузере <strong>Google Chrome</strong> на вашем телефоне.</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      2
                    </span>
                    <span>Нажмите на меню браузера (<strong>три точки ⋮</strong> в правом верхнем углу).</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      3
                    </span>
                    <span>
                      Выберите <strong>«Установить приложение»</strong> (или «Добавить на главный экран»).
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                      ✓
                    </span>
                    <span>
                      Иконка пушистика появится на рабочем столе телефона как нативное приложение!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apk_github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <Github className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">
                    Автоматическая компиляция APK через GitHub Actions
                  </h3>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  В проект уже добавлен готовый рабочий файл <code>.github/workflows/build-apk.yml</code>. Как только вы отправите код на GitHub, сервер GitHub бесплатно скомпилирует готовый <strong>app-debug.apk</strong>, который можно скачать во вкладке «Actions»!
                </p>
              </div>

              {/* Direct assistant push callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-black text-emerald-200 uppercase tracking-wide">
                    Загрузка на GitHub силами ассистента прямо из чата
                  </h4>
                </div>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Вам не обязательно клонировать репозиторий и вводить команды вручную! Напишите ассистенту в чате:
                </p>
                <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-500/20 text-xs text-stone-200 font-mono">
                  1. Ссылку на ваш GitHub-репозиторий (например, <span className="text-amber-300">https://github.com/ВАШ_ЛОГИН/fluffy-tamagotchi</span>)<br/>
                  2. GitHub Personal Access Token (PAT) с правом <span className="text-emerald-300">repo</span> (создаётся на <span className="text-cyan-300">github.com/settings/tokens</span>)<br/>
                  И ассистент одной командой выполнит <code>git push</code> в ваш репозиторий!
                </div>
              </div>

              {/* Instructions to push manually */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Ручная отправка через консоль:</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(gitCommands, 'git')}
                    className="flex items-center gap-1 text-[11px] text-amber-300 hover:underline"
                  >
                    {copiedCmd === 'git' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCmd === 'git' ? 'Скопировано!' : 'Скопировать всё'}</span>
                  </button>
                </div>

                <pre className="p-3 rounded-xl bg-stone-900 font-mono text-[11px] text-emerald-300 overflow-x-auto border border-stone-800 leading-relaxed">
{gitCommands}
                </pre>

                <div className="text-[11px] text-stone-400 space-y-1">
                  <div>1. Создайте новый пустой репозиторий на <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-0.5">github.com/new <ExternalLink className="w-3 h-3" /></a>.</div>
                  <div>2. Замените <code>ВАШ_ЛОГИН</code> на имя вашего аккаунта GitHub.</div>
                  <div>3. После <code>git push</code> перейдите в репозиторий во вкладку <strong>Actions → Build Android APK</strong> и скачайте готовый APK в блоке Artifacts!</div>
                </div>
              </div>

              {/* Local Capacitor build option */}
              <div className="p-4 rounded-2xl bg-stone-800/40 border border-stone-700/60 space-y-2">
                <h4 className="text-xs font-bold text-stone-200">
                  Хотите собрать APK локально в Android Studio?
                </h4>
                <p className="text-[11px] text-stone-400">
                  Скачайте архив проекта (вкладка рядом), распакуйте и выполните в папке:
                </p>
                <pre className="p-2.5 rounded-xl bg-stone-950 font-mono text-[10px] text-amber-300 overflow-x-auto border border-stone-800">
{capacitorCommands}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'zip' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700 space-y-4 text-center py-8">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner text-2xl">
                  📦
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-white">
                    Полный архив исходного кода проекта
                  </h3>
                  <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                    Чистый ZIP-архив со всеми файлами: кукольный тамагочи 1950-х, стили, анимации, серверный бэкенд и workflow для сборки APK.
                  </p>
                </div>

                {downloadError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300">
                    {downloadError}
                  </div>
                )}

                {downloadSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Архив успешно скачан!</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleDownloadZip}
                    disabled={isDownloading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Download className={`w-4 h-4 stroke-[3] ${isDownloading ? 'animate-bounce' : ''}`} />
                    <span>{isDownloading ? 'Формирование архива...' : 'Скачать архив ZIP (быстро)'}</span>
                  </button>

                  <a
                    href="/api/export-project-zip"
                    download="fluffy-tamagotchi-project.zip"
                    className="text-xs text-stone-400 hover:text-amber-300 underline p-2"
                  >
                    Прямая ссылка на файл
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950/80 border-t border-stone-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
