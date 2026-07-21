import { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export default function ServicesManager() {
  const { services, addService, updateService, deleteService } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('Examination Services');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    fields: []
  });
  const [newField, setNewField] = useState({ name: '', type: 'text', required: false });

  const categories = Object.keys(services);

  const handleAddField = () => {
    if (newField.name) {
      setFormData(prev => ({
        ...prev,
        fields: [...prev.fields, newField]
      }));
      setNewField({ name: '', type: 'text', required: false });
    }
  };

  const handleRemoveField = (index) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingService) {
      updateService(currentCategory, editingService.id, formData);
    } else {
      addService(currentCategory, formData);
    }
    setShowModal(false);
    setEditingService(null);
    setFormData({ name: '', price: '', description: '', image: '', fields: [] });
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData(service);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Services Manager</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-xl hover:scale-105"
        >
          <i className="fas fa-plus mr-2"></i> Add Service
        </button>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCurrentCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${currentCategory === cat ? 'bg-[#4169E1] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services[currentCategory]?.map(service => (
          <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={service.image} alt={service.name} className="w-full h-40 object-cover" />
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
              <p className="text-2xl font-bold text-[#4169E1] mb-2">{service.price}</p>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              {service.fields.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Custom Fields:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.fields.map((field, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{field.name}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-medium hover:bg-blue-200 transition-colors"
                >
                  <i className="fas fa-edit mr-1"></i> Edit
                </button>
                <button
                  onClick={() => deleteService(currentCategory, service.id)}
                  className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-xl font-medium hover:bg-red-200 transition-colors"
                >
                  <i className="fas fa-trash mr-1"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => { setShowModal(false); setEditingService(null); setFormData({ name: '', price: '', description: '', image: '', fields: [] }); }} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={currentCategory}
                  onChange={(e) => setCurrentCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Fields</label>
                <div className="space-y-2 mb-4">
                  {formData.fields.map((field, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl">
                      <span className="text-gray-700 font-medium">{field.name} ({field.type}) {field.required ? '(required)' : ''}</span>
                      <button type="button" onClick={() => handleRemoveField(i)} className="text-red-500 hover:text-red-700"><i className="fas fa-times"></i></button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Field name"
                    value={newField.name}
                    onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                    className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                  />
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value }))}
                    className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20"
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="file">File</option>
                    <option value="textarea">Textarea</option>
                  </select>
                  <button type="button" onClick={handleAddField} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors">Add</button>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingService(null); setFormData({ name: '', price: '', description: '', image: '', fields: [] }); }}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#4169E1] hover:bg-[#3658c9] text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-xl hover:scale-105"
                >
                  {editingService ? 'Update' : 'Add'} Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
