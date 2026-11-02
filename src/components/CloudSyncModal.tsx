import React, { useState } from 'react';
import { Cloud, Smartphone, Laptop, RefreshCw, Copy, Check, Download, Upload, X, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncCode: string;
  lastSyncedAt: number;
  isSyncing: boolean;
  onTriggerSync: () => void;
  onConnectCode: (code: string) => Promise<boolean>;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  syncCode,
  lastSyncedAt,
  isSyncing,
  onTriggerSync,
  onConnectCode,
  onExportBackup,
  onImportBackup,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    sounds.playPop();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setConnecting(true);

    try {
      const ok = await onConnectCode(inputCode.trim().toUpperCase());
      if (ok) {
        setSuccessMsg('Устройство успешно подключено! Данные синхронизированы.');
        sounds.playLevelUp();
        setInputCode('');
      } else {
        setErrorMsg('Не удалось найти данные для этого кода. Проверьте правильность кода.');
      }
    } catch (e: any) {
      setErrorMsg('Ошибка подключения к облаку.');
    } finally {
      setConnecting(false);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        onImportBackup(text);
        setSuccessMsg('Резервная копия успешно загружена!');
        sounds.playLevelUp();
      } catch (err) {
        setErrorMsg('Некорректный файл резервной копии.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Облачная Синхронизация</h2>
              <p className="text-xs text-slate-400">
                Один тамагочи на всех ваших устройствах: ноутбуке, планшете и смартфоне
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Active Cloud Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Ваш Облачный Ключ Устройства
                </span>
              </div>
              <button
                onClick={onTriggerSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-cyan-300 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Синхронизация...' : 'Обновить'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-xl font-black text-cyan-300 tracking-wider bg-slate-950/80 px-4 py-2.5 rounded-xl border border-cyan-500/30 select-all">
                {syncCode}
              </div>
              <button
                onClick={handleCopy}
                className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all active:scale-95 flex items-center justify-center"
                title="Скопировать код"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Автосохранение каждые 15 сек.</span>
              </span>
              <span>
                {lastSyncedAt > 0
                  ? `Синхронизировано: ${new Date(lastSyncedAt).toLocaleTimeString()}`
                  : 'Ожидание первой синхронизации'}
              </span>
            </div>
          </div>

          {/* Connect Another Device Form */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
            <h3 className="text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <Laptop className="w-4 h-4 text-purple-400" />
              <span>Подключить другое устройство по коду:</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Введите код с вашего основного устройства, чтобы объединить питомцев:
            </p>

            <form onSubmit={handleConnect} className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Например: FLUFFY-894"
                className="flex-1 font-mono uppercase px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={connecting || !inputCode.trim()}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-md shadow-purple-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {connecting ? 'Подключение...' : 'Подключить'}
              </button>
            </form>

            {successMsg && (
              <div className="mt-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="mt-2.5 text-xs text-rose-400 font-semibold">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Offline Backup & Import */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-300">Резервная копия (JSON)</div>
              <div className="text-[10px] text-slate-500">
                Для ручного переноса или архивации данных
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onExportBackup}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Скачать JSON</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Восстановить</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
