import { Link, useLocation } from 'react-router-dom';

export default function Navigation({ language, setLanguage }) {
  const location = useLocation();

  const t = (key) => {
    const translations = {
      en: {
        appName: 'Smart Dairy IoT',
        dashboard: 'Dashboard',
        cowManagement: 'Cow Management',
        english: 'English',
        tamil: 'Tamil'
      },
      ta: {
        appName: 'ஸ்மார்ட் டெய்ரி IoT',
        dashboard: 'முகப்பு',
        cowManagement: 'மாடு மேலாண்மை',
        english: 'ஆங்கிலம்',
        tamil: 'தமிழ்'
      }
    };
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  const navItems = [
    { path: '/', label: t('dashboard'), icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { path: '/manage', label: t('cowManagement'), icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    )}
  ];

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="text-3xl">🐄</div>
            <span className="text-xl font-bold">{t('appName')}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    location.pathname === item.path 
                      ? 'bg-white/20 font-medium' 
                      : 'hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  language === 'en' 
                    ? 'bg-white text-green-700' 
                    : 'hover:bg-white/10'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  language === 'ta' 
                    ? 'bg-white text-green-700' 
                    : 'hover:bg-white/10'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:hidden pb-3 flex gap-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition text-sm ${
                location.pathname === item.path 
                  ? 'bg-white/20 font-medium' 
                  : 'hover:bg-white/10'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
