import React, { useState } from 'react';
import { Plus, Phone, Trash2, Edit, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface FakeContact {
  id: string;
  name: string;
  phone: string;
  category: string;
}

const ContactsPage: React.FC = () => {
  const { user, addEmergencyContact, removeEmergencyContact } = useAuth();
  const { isDark } = useTheme();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFakeForm, setShowFakeForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', relationship: '' });
  const [fakeContacts, setFakeContacts] = useState<FakeContact[]>([
    { id: '1', name: 'John Doe', phone: '+1 (555) 123-4567', category: 'Friend' },
    { id: '2', name: 'Jane Smith', phone: '+1 (555) 987-6543', category: 'Colleague' }
  ]);
  const [fakeFormData, setFakeFormData] = useState({ name: '', phone: '', category: '' });

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.relationship) {
      addEmergencyContact(formData);
      setFormData({ name: '', phone: '', relationship: '' });
      setShowAddForm(false);
    }
  };

  const handleAddFakeContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (fakeFormData.name && fakeFormData.phone && fakeFormData.category) {
      const newContact: FakeContact = {
        id: Date.now().toString(),
        ...fakeFormData
      };
      setFakeContacts([...fakeContacts, newContact]);
      setFakeFormData({ name: '', phone: '', category: '' });
      setShowFakeForm(false);
    }
  };

  const removeFakeContact = (id: string) => {
    setFakeContacts(fakeContacts.filter(contact => contact.id !== id));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} pb-20`}>
      <div className="p-4">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 mb-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Emergency Contacts
            </h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </button>
          </div>

          <div className="space-y-3">
            {user?.emergencyContacts?.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center justify-between p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold">
                      {contact.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {contact.name}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {contact.relationship} • {contact.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(`tel:${contact.phone}`)}
                    className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-300 hover:scale-110 shadow-md"
                    title={`Call ${contact.name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeEmergencyContact(contact.id)}
                    className="p-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all duration-300 hover:scale-110 shadow-md"
                    title={`Remove ${contact.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {(!user?.emergencyContacts || user.emergencyContacts.length === 0) && (
              <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No emergency contacts added</p>
                <p className="text-sm">Add contacts for quick emergency access</p>
              </div>
            )}
          </div>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Fake Contacts
            </h2>
            <button
              onClick={() => setShowFakeForm(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Fake Contact
            </button>
          </div>

          <div className="space-y-3">
            {fakeContacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center justify-between p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold">
                      {contact.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {contact.name}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {contact.category} • {contact.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFakeContact(contact.id)}
                  className="p-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all duration-300 hover:scale-110 shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-md`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Add Emergency Contact
            </h3>
            <form onSubmit={handleAddContact} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full p-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full p-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                required
              />
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className={`w-full p-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                required
              >
                <option value="">Select Relationship</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Emergency Services">Emergency Services</option>
              </select>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`flex-1 py-3 rounded-lg border ${
                    isDark ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {showFakeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-md`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Add Fake Contact
            </h3>
            <form onSubmit={handleAddFakeContact} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={fakeFormData.name}
                onChange={(e) => setFakeFormData({ ...fakeFormData, name: e.target.value })}
                className={`w-full p-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={fakeFormData.phone}
                onChange={(e) => setFakeFormData({ ...fakeFormData, phone: e.target.value })}
                className={`w-full p-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                required
              />
              <select
                value={fakeFormData.category}
                onChange={(e) => setFakeFormData({ ...fakeFormData, category: e.target.value })}
                className={`w-full p-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                required
              >
                <option value="">Select Category</option>
                <option value="Friend">Friend</option>
                <option value="Colleague">Colleague</option>
                <option value="Family">Family</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFakeForm(false)}
                  className={`flex-1 py-3 rounded-lg border ${
                    isDark ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsPage;