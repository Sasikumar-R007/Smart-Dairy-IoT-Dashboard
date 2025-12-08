import { useState, useEffect } from 'react';

export default function CowForm({ cow, onSave, onCancel, language }) {
  const [formData, setFormData] = useState({
    name: '',
    earTagId: '',
    rfidTag: '',
    breed: 'Sahiwal',
    dob: '',
    weight: 400,
    lactationStage: 'Peak',
    currentYield: 10,
    temperature: 38.5,
    activityScore: 75,
    ruminationScore: 80,
    zone: 'Milking Area',
    lat: 11.0168,
    lng: 76.9558
  });

  const t = (key) => {
    const translations = {
      en: {
        addCow: 'Add New Cow',
        editCow: 'Edit Cow',
        name: 'Name',
        earTagId: 'Ear Tag ID',
        rfidTag: 'RFID Tag',
        breed: 'Breed',
        dateOfBirth: 'Date of Birth',
        weight: 'Weight (kg)',
        lactationStage: 'Lactation Stage',
        currentYield: 'Current Milk Yield (L/day)',
        temperature: 'Temperature (°C)',
        activityScore: 'Activity Score',
        ruminationScore: 'Rumination Score',
        zone: 'Zone',
        save: 'Save',
        cancel: 'Cancel',
        milkingArea: 'Milking Area',
        feedingArea: 'Feeding Area',
        restArea: 'Rest Area',
        grazingArea: 'Grazing Area',
        peak: 'Peak',
        mid: 'Mid',
        early: 'Early',
        dry: 'Dry',
        late: 'Late'
      },
      ta: {
        addCow: 'புதிய மாடு சேர்',
        editCow: 'மாடு திருத்து',
        name: 'பெயர்',
        earTagId: 'காது டேக் எண்',
        rfidTag: 'RFID டேக்',
        breed: 'இனம்',
        dateOfBirth: 'பிறந்த தேதி',
        weight: 'எடை (கிகி)',
        lactationStage: 'பால் கொடுக்கும் நிலை',
        currentYield: 'தற்போதைய பால் உற்பத்தி (லி/நாள்)',
        temperature: 'வெப்பநிலை (°C)',
        activityScore: 'செயல்பாடு மதிப்பெண்',
        ruminationScore: 'அசை மதிப்பெண்',
        zone: 'பகுதி',
        save: 'சேமி',
        cancel: 'ரத்துசெய்',
        milkingArea: 'பால் கறக்கும் பகுதி',
        feedingArea: 'தீவன பகுதி',
        restArea: 'ஓய்வு பகுதி',
        grazingArea: 'மேய்ச்சல் பகுதி',
        peak: 'உச்சம்',
        mid: 'நடுத்தர',
        early: 'ஆரம்பம்',
        dry: 'வறண்ட',
        late: 'தாமதமான'
      }
    };
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  useEffect(() => {
    if (cow) {
      setFormData({
        name: cow.name || '',
        earTagId: cow.earTagId || '',
        rfidTag: cow.rfidTag || '',
        breed: cow.breed || 'Sahiwal',
        dob: cow.dob || '',
        weight: cow.weight || 400,
        lactationStage: cow.lactationStage || 'Peak',
        currentYield: cow.currentYield || 10,
        temperature: cow.temperature || 38.5,
        activityScore: cow.activityScore || 75,
        ruminationScore: cow.ruminationScore || 80,
        zone: cow.zone || 'Milking Area',
        lat: cow.lat || 11.0168,
        lng: cow.lng || 76.9558
      });
    }
  }, [cow]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const breeds = ['Sahiwal', 'Gir', 'Red Sindhi', 'Tharparkar', 'Kankrej', 'Ongole', 'Kangayam', 'Umblachery', 'Bargur', 'Pulikulam', 'Alambadi', 'Holstein', 'Jersey', 'HF Cross'];
  const lactationStages = ['Peak', 'Mid', 'Early', 'Late', 'Dry'];
  const zones = ['Milking Area', 'Feeding Area', 'Rest Area', 'Grazing Area'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {cow ? t('editCow') : t('addCow')}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={language === 'ta' ? 'எ.கா. லக்ஷ்மி' : 'e.g. Lakshmi'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('earTagId')}</label>
              <input
                type="text"
                name="earTagId"
                value={formData.earTagId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="TN-MAS-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('rfidTag')}</label>
              <input
                type="text"
                name="rfidTag"
                value={formData.rfidTag}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="RFID001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('breed')}</label>
              <select
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {breeds.map(breed => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('dateOfBirth')}</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('weight')}</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="100"
                max="800"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('lactationStage')}</label>
              <select
                name="lactationStage"
                value={formData.lactationStage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {lactationStages.map(stage => (
                  <option key={stage} value={stage}>{t(stage.toLowerCase())}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('currentYield')}</label>
              <input
                type="number"
                name="currentYield"
                value={formData.currentYield}
                onChange={handleChange}
                min="0"
                max="30"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('temperature')}</label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                min="36"
                max="42"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('zone')}</label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {zones.map(zone => (
                  <option key={zone} value={zone}>
                    {language === 'ta' ? 
                      (zone === 'Milking Area' ? 'பால் கறக்கும் பகுதி' :
                       zone === 'Feeding Area' ? 'தீவன பகுதி' :
                       zone === 'Rest Area' ? 'ஓய்வு பகுதி' : 'மேய்ச்சல் பகுதி') 
                      : zone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('activityScore')}</label>
              <input
                type="number"
                name="activityScore"
                value={formData.activityScore}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('ruminationScore')}</label>
              <input
                type="number"
                name="ruminationScore"
                value={formData.ruminationScore}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-medium"
            >
              {t('save')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
