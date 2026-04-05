import React, { useState } from 'react';
import {
    Wallet, ArrowUpRight, ArrowDownLeft, Plus,
    Sparkles, CreditCard, PieChart, Activity, MoreHorizontal,
    Sun, Moon
} from 'lucide-react';

export default function Dashboard() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    // SEO ve Erişilebilirlik (WCAG) uygun renk paletleri dinamik olarak atandı.
    const theme = {
        bg: isDarkMode ? 'bg-slate-950' : 'bg-slate-50',
        text: isDarkMode ? 'text-slate-50' : 'text-slate-900',
        navBg: isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200',
        cardBg: isDarkMode ? 'bg-slate-900 border-slate-800 shadow-slate-900/50' : 'bg-white border-slate-200 shadow-slate-200/50',
        textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
        hoverBg: isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100',
        aiBg: isDarkMode ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border-indigo-500/30'
            : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border-indigo-200',
        aiCardBg: isDarkMode ? 'bg-slate-900/60 border-white/5 text-slate-200'
            : 'bg-white/90 border-indigo-100 text-slate-800',
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${theme.bg} ${theme.text} font-inter selection:bg-blue-500/30`}>

            {/* Üst Navbar */}
            <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b py-4 px-6 md:px-12 flex justify-between items-center transition-colors duration-500 ${theme.navBg}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg">
                        <Wallet className="text-white" size={20} />
                    </div>
                    <h1 className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        AIFinance
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Karanlık/Aydınlık Mod Butonu */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2.5 rounded-full transition-all duration-300 ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        aria-label="Tema Değiştir"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <button className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border transition-colors text-sm font-medium ${theme.cardBg} ${theme.text}`}>
                        <Activity size={16} className="text-emerald-500" />
                        Sistem Aktif
                    </button>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg cursor-pointer hover:scale-105 transition-transform">
                        <div className={`w-full h-full rounded-full flex items-center justify-center text-sm font-bold ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                            AH
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 xl:grid-cols-3 gap-8">

                <div className="xl:col-span-2 space-y-8">

                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Hoş Geldin, Ahmet 👋</h2>
                            <p className={`mt-1 ${theme.textMuted}`}>İşte güncel finansal durumun.</p>
                        </div>
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2">
                            <Plus size={18} />
                            <span className="hidden sm:inline">Yeni İşlem</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Toplam Bakiye (Mavi Vurgulu) */}
                        <div className={`rounded-3xl p-6 border shadow-xl relative overflow-hidden group transition-all duration-300 ${theme.cardBg} hover:-translate-y-1`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Wallet size={80} />
                            </div>
                            <span className={`font-medium text-sm flex items-center gap-2 ${theme.textMuted}`}>
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Toplam Bakiye
                            </span>
                            <h2 className={`text-3xl font-extrabold mt-3 mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₺45,250.00</h2>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                                <ArrowUpRight size={14} /> +12.5% vs geçen ay
                            </span>
                        </div>

                        {/* Aylık Gelir */}
                        <div className={`rounded-3xl p-6 border transition-all duration-300 ${theme.cardBg} hover:-translate-y-1`}>
                            <span className={`font-medium text-sm flex items-center gap-2 ${theme.textMuted}`}>
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Aylık Gelir
                            </span>
                            <h2 className={`text-2xl font-bold mt-3 mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                ₺15,400.00
                            </h2>
                            <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <div className="bg-emerald-500 h-full w-3/4 rounded-full"></div>
                            </div>
                        </div>

                        {/* Aylık Gider */}
                        <div className={`rounded-3xl p-6 border transition-all duration-300 ${theme.cardBg} hover:-translate-y-1`}>
                            <span className={`font-medium text-sm flex items-center gap-2 ${theme.textMuted}`}>
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div> Aylık Gider
                            </span>
                            <h2 className={`text-2xl font-bold mt-3 mb-4 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                                ₺4,150.00
                            </h2>
                            <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <div className="bg-rose-500 h-full w-1/4 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Son İşlemler */}
                    <div className={`rounded-3xl border overflow-hidden shadow-lg transition-colors duration-500 ${theme.cardBg}`}>
                        <div className={`px-6 py-5 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <CreditCard size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                                Son İşlemler
                            </h3>
                            <button className={`text-sm font-semibold ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>
                                Tümünü Gör
                            </button>
                        </div>

                        <div className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>

                            <div className={`px-6 py-4 flex items-center justify-between transition-colors cursor-pointer ${theme.hoverBg}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
                                        <ArrowDownLeft size={22} />
                                    </div>
                                    <div>
                                        <p className={`font-semibold transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Migros Alışverişi</p>
                                        <p className={`text-xs mt-0.5 ${theme.textMuted}`}>Mutfak & Market • Bugün, 14:20</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>-₺1,250.00</span>
                                    <button className={`block ml-auto mt-1 ${theme.textMuted} hover:text-blue-500`}><MoreHorizontal size={16} /></button>
                                </div>
                            </div>

                            <div className={`px-6 py-4 flex items-center justify-between transition-colors cursor-pointer ${theme.hoverBg}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                                        <ArrowUpRight size={22} />
                                    </div>
                                    <div>
                                        <p className={`font-semibold transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Maaş Ödemesi</p>
                                        <p className={`text-xs mt-0.5 ${theme.textMuted}`}>Gelir • Dün, 09:00</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>+₺15,400.00</span>
                                    <button className={`block ml-auto mt-1 ${theme.textMuted} hover:text-blue-500`}><MoreHorizontal size={16} /></button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* SAĞ SÜTUN */}
                <div className="space-y-8">

                    <div className={`relative rounded-3xl p-6 overflow-hidden shadow-xl border transition-colors duration-500 ${theme.aiBg}`}>
                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-400/20'}`}></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-sm ${isDarkMode ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' : 'bg-indigo-100 border-indigo-200 text-indigo-700'}`}>
                                    <Sparkles size={20} className="animate-pulse" />
                                </div>
                                <h3 className={`text-lg font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AIFinance Asistanı</h3>
                            </div>

                            <div className={`backdrop-blur-md rounded-2xl p-5 shadow-sm relative ${theme.aiCardBg}`}>
                                <p className="text-sm leading-relaxed font-semibold">
                                    Geçen aya kıyasla <span className={isDarkMode ? 'text-rose-400' : 'text-rose-600'}>Market</span> harcamalarınızda %18 artış analiz ettim.
                                    Genel hedefini aşmamak için 2 hafta boyunca mutfak bütçesini sınırlandırmanızı öneririm.
                                </p>

                                <div className="mt-5 flex gap-3">
                                    <button className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 shadow-sm ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                                        Öneriyi Uygula
                                    </button>
                                    <button className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'}`}>
                                        Daha Fazla
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-3xl p-6 border shadow-lg transition-colors duration-500 ${theme.cardBg}`}>
                        <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            <PieChart size={20} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                            Dağılım Analizi
                        </h3>

                        <div className="relative h-56 flex items-center justify-center">
                            <div className={`absolute w-40 h-40 rounded-full border-[16px] shadow-inner ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}></div>
                            <div className="absolute w-40 h-40 rounded-full border-[16px] border-emerald-500 border-t-transparent border-r-transparent rotate-45"></div>
                            <div className="absolute w-40 h-40 rounded-full border-[16px] border-rose-500 border-b-transparent border-l-transparent border-r-transparent -rotate-12"></div>
                            <div className="absolute w-40 h-40 rounded-full border-[16px] border-purple-500 border-t-transparent border-b-transparent border-l-transparent rotate-[60deg]"></div>

                            <div className="z-10 flex flex-col items-center justify-center">
                                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>3</span>
                                <span className={`text-xs ${theme.textMuted}`}>Kategori</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
