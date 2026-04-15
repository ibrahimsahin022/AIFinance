import React, { useState } from 'react';
import { Wallet, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../api';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(`${getApiBaseUrl()}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: firstName.trim() || 'Kullanıcı',
                    lastName: lastName.trim() || '—',
                    email,
                    password
                })
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                let msg = 'Kayıt başarısız.';
                try {
                    const issue = await response.json();
                    msg = issue.message || issue.Message || msg;
                } catch {
                    msg = `Sunucu hatası (${response.status}).`;
                }
                setError(msg);
            }
        } catch (err) {
            const base = getApiBaseUrl();
            setError(
                `API'ye ulaşılamadı (${base}). Önce BackendCsharp'ta "dotnet run" ile API'yi başlatın; ardından PostgreSQL şifresinin appsettings.json ile aynı olduğundan emin olun.`
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-inter p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-slate-900 px-6 py-8 flex flex-col items-center justify-center">
                    <Wallet className="text-blue-400 mb-2" size={48} />
                    <h1 className="text-3xl font-extrabold text-white tracking-wide">Kayıt Ol</h1>
                    <p className="text-slate-400 mt-2 text-sm">Finansal asistanınıza katılın</p>
                </div>
                
                <div className="p-8">
                    {error && (
                        <div className="mb-4 bg-rose-50 text-rose-600 px-4 py-3 rounded-lg text-sm border border-rose-100">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-lg text-sm border border-emerald-100">
                            Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ad</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="İsteğe bağlı"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="İsteğe bağlı"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">E-posta Adresi</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="ornek@gmail.com"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors mt-6"
                        >
                            <UserPlus size={20} />
                            Hesap Oluştur
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center text-sm text-slate-500 border-t border-slate-100 pt-6 flex flex-col gap-2">
                        <span>Zaten hesabınız var mı?</span>
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                            Giriş Yap
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
