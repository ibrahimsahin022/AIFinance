import React, { useState } from 'react';
import { Wallet, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getApiBaseUrl } from '../api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token ?? data.Token);
            } else {
                const issue = await response.json();
                setError(issue.message || "Giriş başarısız.");
            }
        } catch {
            const base = getApiBaseUrl();
            setError(
                `API'ye ulaşılamadı (${base}). Backend'i çalıştırın: BackendCsharp klasöründe "dotnet run".`
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-inter p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-slate-900 px-6 py-8 flex flex-col items-center justify-center">
                    <Wallet className="text-blue-400 mb-2" size={48} />
                    <h1 className="text-3xl font-extrabold text-white tracking-wide">AIFinance</h1>
                    <p className="text-slate-400 mt-2 text-sm">Finansal asistanınıza hoş geldiniz</p>
                </div>
                
                <div className="p-8">
                    {error && (
                        <div className="mb-4 bg-rose-50 text-rose-600 px-4 py-3 rounded-lg text-sm border border-rose-100">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 transition-colors mt-6"
                        >
                            <LogIn size={20} />
                            Giriş Yap
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center text-sm text-slate-500 border-t border-slate-100 pt-6 flex flex-col gap-2">
                        <span>Hesabınız yok mu?</span>
                        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                            Hemen Kayıt Olun
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
