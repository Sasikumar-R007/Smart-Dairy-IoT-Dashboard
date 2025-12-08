import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navigation({ language, setLanguage }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav className={`
      sticky top-0 z-50 transition-all duration-300
      ${scrolled 
        ? 'bg-gradient-to-r from-green-700/95 to-green-600/95 backdrop-blur-md shadow-lg' 
        : 'bg-gradient-to-r from-green-700 to-green-600 shadow-md'
      }
      text-white
    `}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              🐄
            </div>
            <span className="text-xl font-bold tracking-tight transition-all duration-300 group-hover:tracking-wide">
              {t('appName')}
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-lg 
                    transition-all duration-300 overflow-hidden group
                    ${location.pathname === item.path 
                      ? 'bg-white/20 font-medium shadow-inner' 
                      : 'hover:bg-white/10'
                    }
                  `}
                >
                  <span className={`transition-transform duration-300 ${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <span className="relative">
                    {item.label}
                    {location.pathname === item.path && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full animate-fade-in"></span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1 backdrop-blur-sm">
              <button
                onClick={() => setLanguage('en')}
                className={`
                  relative px-4 py-2 rounded-lg text-sm font-medium 
                  transition-all duration-300 overflow-hidden
                  ${language === 'en' 
                    ? 'bg-white text-green-700 shadow-md scale-105' 
                    : 'hover:bg-white/10'
                  }
                `}
              >
                <span className="relative z-10">EN</span>
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`
                  relative px-4 py-2 rounded-lg text-sm font-medium 
                  transition-all duration-300 overflow-hidden
                  ${language === 'ta' 
                    ? 'bg-white text-green-700 shadow-md scale-105' 
                    : 'hover:bg-white/10'
                  }
                `}
              >
                <span className="relative z-10">தமிழ்</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:hidden pb-3 flex gap-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                transition-all duration-300 text-sm
                ${location.pathname === item.path 
                  ? 'bg-white/20 font-medium shadow-inner scale-[1.02]' 
                  : 'hover:bg-white/10'
                }
              `}
            >
              <span className={`transition-transform duration-300 ${location.pathname === item.path ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
