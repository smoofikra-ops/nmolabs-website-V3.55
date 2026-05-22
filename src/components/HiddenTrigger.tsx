import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';

export const HiddenTrigger = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const { setIsAdminMode } = useSite();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1122') {
      setIsAdminMode(true);
      setShowPrompt(false);
      setPassword('');
      // Force reload CSS variables if they were changed in context but let's do it reactively.
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 w-16 h-16 opacity-0 hover:opacity-[0.02] bg-white z-[90] cursor-default"
        onClick={() => setShowPrompt(true)}
      />
      
      {showPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-white/10 p-8 rounded-2xl w-full max-w-sm relative">
            <button 
              onClick={() => setShowPrompt(false)}
              className="absolute top-4 left-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-6 text-center">وصول الإدارة</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور..."
                  className="w-full bg-black/50 border border-white/10 p-3 rounded-xl focus:border-brand-blue outline-none transition-colors text-center font-english tracking-widest"
                  autoFocus
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                دخول
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
