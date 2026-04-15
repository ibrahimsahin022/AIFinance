import React, { useState, useEffect } from 'react';
import {
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    PlusCircle,
    BrainCircuit,
    CreditCard,
    PieChart,
    LogOut,
    X
} from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
    const { user, token, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal Form State
    const [transactionType, setTransactionType] = useState('Expense');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    
    // Category Management
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Fetch categories when creating transaction depending on type (Income/Expense)
    useEffect(() => {
        if (isModalOpen && token) {
            fetchCategories();
        }
    }, [isModalOpen, transactionType, token]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/categories?type=${transactionType}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
                if (data.length > 0) {
                    setSelectedCategoryId(data[0].id);
                    setIsNewCategory(false);
                } else {
                    setSelectedCategoryId('');
                    setIsNewCategory(true);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === 'NEW') {
            setIsNewCategory(true);
            setSelectedCategoryId('');
        } else {
            setIsNewCategory(false);
            setSelectedCategoryId(value);
        }
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!amount || amount <= 0) {
            setError('Lütfen geçerli bir tutar giriniz.');
            return;
        }

        if (isNewCategory && !newCategoryName.trim()) {
            setError('Lütfen yeni kategori adını giriniz.');
            return;
        }

        const payload = {
            Type: transactionType,
            Amount: parseFloat(amount),
            Date: new Date(date).toISOString(),
            Description: description,
            CategoryId: isNewCategory ? null : selectedCategoryId,
            NewCategoryName: isNewCategory ? newCategoryName.trim() : null
        };

        try {
            const res = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccessMsg('İşlem başarıyla eklendi!');
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSuccessMsg(null);
                    // TODO: Refresh dashboard totals/transactions here
                }, 1500);
            } else {
                const data = await res.json();
                setError(data.message || 'İşlem eklenemedi.');
            }
        } catch (err) {
            setError('Sunucu hatası oluştu.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-inter relative">
            {/* Üst Menü */}
            <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2">
                    <Wallet className="text-blue-400" size={28} />
                    <h1 className="text-xl font-bold tracking-wide">AIFinance</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold text-slate-300">
                        Hoş geldin, {user?.UserEmail?.split('@')[0] || "Kullanıcı"}
                    </div>
                    <button 
                        onClick={logout}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-sm text-slate-300 transition"
                    >
                        <LogOut size={16} /> Çıkış Yap
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SOL VE ORTA SÜTUN */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Bakiye Özet Kartları */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-2">
                            <span className="text-slate-400 font-medium text-sm">Toplam Bakiye</span>
                            <h2 className="text-3xl font-extrabold text-slate-800">₺45,250.00</h2>
                            <span className="text-emerald-500 text-sm font-semibold flex items-center gap-1 mt-2">
                                <ArrowUpCircle size={16} /> +12.5% (Geçen aya göre)
                            </span>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-2">
                            <span className="text-slate-400 font-medium text-sm">Aylık Gelir</span>
                            <h2 className="text-2xl font-bold text-emerald-600">₺15,400.00</h2>
                            <div className="w-full bg-slate-100 h-2 mt-auto rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-3/4"></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-2">
                            <span className="text-slate-400 font-medium text-sm">Aylık Gider</span>
                            <h2 className="text-2xl font-bold text-rose-500">₺4,150.00</h2>
                            <div className="w-full bg-slate-100 h-2 mt-auto rounded-full overflow-hidden">
                                <div className="bg-rose-500 h-full w-1/4"></div>
                            </div>
                        </div>
                    </div>

                    {/* Son İşlemler & Yeni İşlem Arka Planı */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <CreditCard size={20} className="text-slate-400" />
                                Son İşlemler
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <PlusCircle size={16} />
                                Yeni İşlem
                            </button>
                        </div>

                        <div className="divide-y divide-slate-100">
                            <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                        <ArrowDownCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Migros Market</p>
                                        <p className="text-xs text-slate-400">Market & Mutfak • 12 Oct 2024</p>
                                    </div>
                                </div>
                                <span className="font-bold text-rose-600">-₺1,250.00</span>
                            </div>
                            <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <ArrowUpCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Aylık Maaş Yansıması</p>
                                        <p className="text-xs text-slate-400">Maaş • 10 Oct 2024</p>
                                    </div>
                                </div>
                                <span className="font-bold text-emerald-600">+₺15,400.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SAĞ SÜTUN */}
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <PieChart size={20} className="text-slate-400" />
                            Dağılım Özeti
                        </h3>
                        <div className="h-48 rounded-full border-8 border-slate-50 flex items-center justify-center bg-slate-100">
                            <span className="text-slate-400 text-sm">Grafik Bileşeni Yeri</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200 shadow-inner relative overflow-hidden">
                        <div className="absolute -right-8 -top-8 text-blue-200 opacity-20">
                            <BrainCircuit size={120} />
                        </div>
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                                <BrainCircuit size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-blue-900">AI Tavsiyesi</h3>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white relative z-10 shadow-sm text-sm text-slate-700 leading-relaxed">
                            <p>
                                Geçen aya oranla <strong>Market</strong> harcamalarınızda <strong>%18 artış</strong> analiz ettim.
                                Belirlediğiniz genel aylık hedefinizi aşmamak için önümüzdeki 2 hafta boyunca market bütçenizi sınırlandırmanızı öneririm.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* YENİ İŞLEM MODALI */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <PlusCircle size={20} className="text-blue-600" />
                                Yeni İşlem Ekle
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {error && <div className="mb-4 bg-rose-50 text-rose-600 px-3 py-2 rounded-lg text-sm border border-rose-100">{error}</div>}
                            {successMsg && <div className="mb-4 bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg text-sm border border-emerald-100">{successMsg}</div>}
                            
                            <form onSubmit={handleTransactionSubmit} className="space-y-4">
                                
                                {/* Tür Seçimi */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">İşlem Türü</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            type="button" 
                                            onClick={() => setTransactionType('Expense')}
                                            className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 border font-medium transition ${transactionType === 'Expense' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                        >
                                            <ArrowDownCircle size={18} /> Gider
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setTransactionType('Income')}
                                            className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 border font-medium transition ${transactionType === 'Income' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                        >
                                            <ArrowUpCircle size={18} /> Gelir
                                        </button>
                                    </div>
                                </div>

                                {/* Kategori Seçimi */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Kategori
                                    </label>
                                    <select 
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        value={isNewCategory ? 'NEW' : selectedCategoryId}
                                        onChange={handleCategoryChange}
                                    >
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                        <option value="NEW">+ Yeni Kategori Ekle</option>
                                    </select>
                                </div>

                                {/* Yeni Kategori İsmi */}
                                {isNewCategory && (
                                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <label className="block text-xs font-semibold text-blue-800 mb-1">Yeni Kategori Adı</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-3 py-2 border border-white rounded mt-1 outline-none text-sm focus:border-blue-300"
                                            placeholder="Örn: Market, Fatura, Maaş vb."
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Miktar & Tarih */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Tutar (₺)</label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            required
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
                                        <input 
                                            type="date" 
                                            required
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Açıklama */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama (Opsiyonel)</label>
                                    <input 
                                        type="text" 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        placeholder="İşlem detayı..."
                                    />
                                </div>

                                {/* Gönder */}
                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg transition-colors shadow flex items-center justify-center gap-2"
                                    >
                                        Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
