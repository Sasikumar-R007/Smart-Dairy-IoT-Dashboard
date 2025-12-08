import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import CowForm from '../components/CowForm';

export default function CowManagement({ language }) {
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCow, setEditingCow] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const t = (key) => {
    const translations = {
      en: {
        cowManagement: 'Cow Management',
        addCow: 'Add New Cow',
        totalCows: 'Total Cows',
        name: 'Name',
        cowId: 'Cow ID',
        earTagId: 'Ear Tag ID',
        breed: 'Breed',
        age: 'Age',
        milkYield: 'Milk Yield',
        status: 'Status',
        actions: 'Actions',
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        healthy: 'Healthy',
        warning: 'Warning',
        alert: 'Alert',
        confirmDelete: 'Are you sure you want to delete this cow?',
        cancel: 'Cancel',
        yes: 'Yes, Delete',
        cowAddedSuccess: 'Cow added successfully!',
        cowUpdatedSuccess: 'Cow updated successfully!',
        cowDeletedSuccess: 'Cow deleted successfully!',
        years: 'years',
        liters: 'L',
        loading: 'Loading...',
        noCows: 'No cows found. Add your first cow!',
        lactation: 'Lactation',
        temperature: 'Temp',
        zone: 'Zone'
      },
      ta: {
        cowManagement: 'மாடு மேலாண்மை',
        addCow: 'புதிய மாடு சேர்',
        totalCows: 'மொத்த மாடுகள்',
        name: 'பெயர்',
        cowId: 'மாடு எண்',
        earTagId: 'காது டேக் எண்',
        breed: 'இனம்',
        age: 'வயது',
        milkYield: 'பால் உற்பத்தி',
        status: 'நிலை',
        actions: 'செயல்கள்',
        view: 'பார்',
        edit: 'திருத்து',
        delete: 'நீக்கு',
        healthy: 'ஆரோக்கியமான',
        warning: 'எச்சரிக்கை',
        alert: 'அபாய எச்சரிக்கை',
        confirmDelete: 'இந்த மாட்டை நீக்க விரும்புகிறீர்களா?',
        cancel: 'ரத்துசெய்',
        yes: 'ஆம், நீக்கு',
        cowAddedSuccess: 'மாடு வெற்றிகரமாக சேர்க்கப்பட்டது!',
        cowUpdatedSuccess: 'மாடு வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
        cowDeletedSuccess: 'மாடு வெற்றிகரமாக நீக்கப்பட்டது!',
        years: 'ஆண்டுகள்',
        liters: 'லி',
        loading: 'ஏற்றுகிறது...',
        noCows: 'மாடுகள் இல்லை. உங்கள் முதல் மாட்டை சேருங்கள்!',
        lactation: 'பால் நிலை',
        temperature: 'வெப்பநிலை',
        zone: 'பகுதி'
      }
    };
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  useEffect(() => {
    loadCows();
  }, []);

  const loadCows = async () => {
    try {
      const data = await api.getCows();
      setCows(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading cows:', error);
      setLoading(false);
    }
  };

  const handleSave = async (cowData) => {
    try {
      if (editingCow) {
        await api.updateCow(editingCow.id, cowData);
        setMessage({ type: 'success', text: t('cowUpdatedSuccess') });
      } else {
        await api.addCow(cowData);
        setMessage({ type: 'success', text: t('cowAddedSuccess') });
      }
      setShowForm(false);
      setEditingCow(null);
      loadCows();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving cow:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteCow(id);
      setMessage({ type: 'success', text: t('cowDeletedSuccess') });
      setDeleteConfirm(null);
      loadCows();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting cow:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'healthy': return t('healthy');
      case 'warning': return t('warning');
      case 'alert': return t('alert');
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('cowManagement')}</h1>
            <p className="text-gray-500 mt-1">{t('totalCows')}: {cows.length}</p>
          </div>
          <button
            onClick={() => { setEditingCow(null); setShowForm(true); }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-medium shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('addCow')}
          </button>
        </div>

        {cows.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🐄</div>
            <p className="text-gray-500 text-lg">{t('noCows')}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('earTagId')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('breed')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('age')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('milkYield')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('zone')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cows.map((cow) => (
                    <tr key={cow.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{cow.name || cow.id}</div>
                        <div className="text-sm text-gray-500">{cow.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cow.earTagId || cow.rfidTag}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cow.breed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cow.age} {t('years')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {cow.currentYield} {t('liters')}/day
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cow.zone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(cow.status)}`}>
                          {getStatusText(cow.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/cow/${cow.id}`)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {t('view')}
                          </button>
                          <button
                            onClick={() => { setEditingCow(cow); setShowForm(true); }}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            {t('edit')}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(cow)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            {t('delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showForm && (
          <CowForm
            cow={editingCow}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingCow(null); }}
            language={language}
          />
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="text-5xl mb-4">🐄</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('confirmDelete')}
                </h3>
                <p className="text-gray-500 mb-6">
                  {deleteConfirm.name || deleteConfirm.id} ({deleteConfirm.earTagId || deleteConfirm.rfidTag})
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm.id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    {t('yes')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
