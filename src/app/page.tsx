/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState, useEffect } from 'react';

// Типизация для Telegram WebApp User
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  hash: string;
}

// Моковые данные награды
const rewards = [
  { points: 100, name: 'Стартовая книга' },
  { points: 300, name: 'Редкий персонаж' },
  { points: 500, name: 'VIP бейдж' },
  { points: 1000, name: 'Ранний доступ к маркету' },
];

export default function Home() {
  // Состояния
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [points, setPoints] = useState(0);
  const [rank, setRank] = useState<number | null>(null);
  const [referralLink, setReferralLink] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Получаем пользователя из Telegram WebApp API
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
      const tgUser = (window as any).Telegram.WebApp.initDataUnsafe.user;
      setUser(tgUser);
      // Формируем реферальную ссылку
      setReferralLink(`t.me/BookeBot?start=ref${tgUser.id}`);
      // Здесь можно сделать запрос к /status, чтобы получить баллы и место (мок)
      // Моковые данные:
      setPoints(0);
      setRank(999);
    }
  }, []);

  // Определяем следующую награду
  const nextReward = rewards.find(r => r.points > points) || rewards[rewards.length - 1];
  const progressPercentage = Math.min((points / nextReward.points) * 100, 100);

  // Клик по "Присоединиться"
  const handleJoin = async () => {
    if (!user) return;
    setLoading(true);
    // Моковый POST-запрос на /join
    await new Promise(res => setTimeout(res, 800));
    // В реальном приложении: await fetch('/api/join', ...)
    setIsJoined(true);
    setPoints(20); // Начисляем стартовые баллы
    setRank(158); // Моковое место
    setShowSnackbar(true);
    setLoading(false);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  // Копирование реф-ссылки
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#101014] text-[#ededed]">
      {/* Header */}
      <header className="text-center py-12 px-4">
        <h1 className="text-4xl font-bold mb-2 animate-fade-in">
          Booke Wait List
        </h1>
        <p className="text-[#b0b0b0] text-lg">
          Присоединяйтесь к эксклюзивному сообществу
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 space-y-6">
        {/* Status Card */}
        <div className="card animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Ваше место в рейтинге
            </h2>
            <div className="text-4xl font-bold text-white">
              {rank !== null ? `#${rank}` : '—'}
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Баллы</h3>
            <div className="text-3xl font-bold text-white">
              {points} / {nextReward.points}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Next Reward */}
          <div className="text-center">
            <p className="text-sm text-[#b0b0b0] mb-1">
              🎁 Следующая награда:
            </p>
            <p className="font-semibold text-white">
              {nextReward.name} @{nextReward.points} баллов
            </p>
          </div>
        </div>

        {/* Referral Section */}
        <div className="card animate-fade-in">
          <h3 className="text-xl font-bold mb-4 text-center">
            Приглашайте друзей
          </h3>
          <p className="text-[#b0b0b0] text-center mb-4">
            Получайте +100 баллов за каждого приглашённого друга
          </p>

          {/* Referral Link */}
          <div className="bg-[#23232a] rounded-2xl p-4 mb-4">
            <p className="text-sm text-[#b0b0b0] mb-2">Ваша реферальная ссылка:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-[#18181f] border border-[#23232a] rounded-xl px-3 py-2 text-sm text-white"
              />
              <button
                onClick={copyReferralLink}
                className={`copy-btn ${copied ? 'bg-green-100 text-green-700' : ''}`}
              >
                {copied ? '✓' : 'Копировать'}
              </button>
            </div>
          </div>
        </div>

        {/* Join Button */}
        <div className="text-center animate-fade-in">
          {!isJoined ? (
            <button
              onClick={handleJoin}
              className="btn-primary w-full text-lg py-4"
              disabled={loading}
            >
              {loading ? 'Присоединение...' : 'Присоединиться'}
            </button>
          ) : (
            <div className="bg-[#23232a] border border-green-700 rounded-2xl p-4">
              <div className="text-green-400 font-semibold text-lg">
                ✅ Вы в списке ожидания!
              </div>
              <p className="text-green-400 text-sm mt-1">
                Продолжайте приглашать друзей для получения бонусов
              </p>
            </div>
          )}
        </div>

        {/* Rewards Info */}
        <div className="card animate-fade-in">
          <h3 className="text-xl font-bold mb-4 text-center">
            Система наград
          </h3>
          <div className="space-y-3 text-sm">
            {rewards.map(r => (
              <div key={r.points} className="flex justify-between items-center">
                <span className="text-[#ededed]">🎁 {r.points} баллов</span>
                <span className="font-semibold text-white">{r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Snackbar */}
      {showSnackbar && (
        <div className="snackbar animate-slide-in">
          ✅ Вы успешно присоединились к списку ожидания!
        </div>
      )}
    </div>
  );
}
