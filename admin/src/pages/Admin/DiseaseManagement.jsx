import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'

const DiseaseManagement = () => {
  const [diseases, setDiseases] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDisease, setEditingDisease] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    symptoms: [''],
    causes: [''],
    treatments: [''],
    prevention: [''],
    category: 'infectious',
    severity: 'medium',
    contagious: false,
    ageGroup: ['adult'],
    gender: ['all'],
    riskFactors: [''],
    complications: [''],
    diagnosticTests: [''],
    medications: [''],
    lifestyleChanges: [''],
    chatbotKeywords: [''],
    chatbotResponses: ['']
  })

  const categories = ['infectious', 'chronic', 'genetic', 'autoimmune', 'cancer', 'mental_health', 'cardiovascular', 'respiratory', 'digestive', 'neurological', 'other']
  const severities = ['low', 'medium', 'high', 'critical']
  const ageGroups = ['infant', 'child', 'teen', 'adult', 'elderly']
  const genders = ['male', 'female', 'all']

  useEffect(() => {
    fetchDiseases()
  }, [])

  const fetchDiseases = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/disease/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setDiseases(data.diseases)
      }
    } catch (error) {
      console.error('Error fetching diseases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        symptoms: formData.symptoms.filter(s => s.trim()),
        causes: formData.causes.filter(c => c.trim()),
        treatments: formData.treatments.filter(t => t.trim()),
        prevention: formData.prevention.filter(p => p.trim()),
        riskFactors: formData.riskFactors.filter(r => r.trim()),
        complications: formData.complications.filter(c => c.trim()),
        diagnosticTests: formData.diagnosticTests.filter(d => d.trim()),
        medications: formData.medications.filter(m => m.trim()),
        lifestyleChanges: formData.lifestyleChanges.filter(l => l.trim()),
        chatbotKeywords: formData.chatbotKeywords.filter(k => k.trim()),
        chatbotResponses: formData.chatbotResponses.filter(r => r.trim())
      }

      const url = editingDisease 
        ? `${import.meta.env.VITE_API_URL}/api/disease/${editingDisease._id}`
        : `${import.meta.env.VITE_API_URL}/api/disease/add`
      
      const method = editingDisease ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(cleanedData)
      })
      
      const data = await response.json()
      if (data.success || data.message) {
        setShowAddForm(false)
        setEditingDisease(null)
        resetForm()
        fetchDiseases()
      }
    } catch (error) {
      console.error('Error saving disease:', error)
    }
  }

  const handleEdit = (disease) => {
    setEditingDisease(disease)
    setFormData({
      name: disease.name,
      description: disease.description,
      symptoms: disease.symptoms.length > 0 ? disease.symptoms : [''],
      causes: disease.causes.length > 0 ? disease.causes : [''],
      treatments: disease.treatments.length > 0 ? disease.treatments : [''],
      prevention: disease.prevention.length > 0 ? disease.prevention : [''],
      category: disease.category,
      severity: disease.severity,
      contagious: disease.contagious,
      ageGroup: disease.ageGroup.length > 0 ? disease.ageGroup : ['adult'],
      gender: disease.gender.length > 0 ? disease.gender : ['all'],
      riskFactors: disease.riskFactors.length > 0 ? disease.riskFactors : [''],
      complications: disease.complications.length > 0 ? disease.complications : [''],
      diagnosticTests: disease.diagnosticTests.length > 0 ? disease.diagnosticTests : [''],
      medications: disease.medications.length > 0 ? disease.medications : [''],
      lifestyleChanges: disease.lifestyleChanges.length > 0 ? disease.lifestyleChanges : [''],
      chatbotKeywords: disease.chatbotKeywords.length > 0 ? disease.chatbotKeywords : [''],
      chatbotResponses: disease.chatbotResponses.length > 0 ? disease.chatbotResponses : ['']
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this disease record?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/disease/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        })
        const data = await response.json()
        if (data.message) {
          fetchDiseases()
        }
      } catch (error) {
        console.error('Error deleting disease:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      symptoms: [''],
      causes: [''],
      treatments: [''],
      prevention: [''],
      category: 'infectious',
      severity: 'medium',
      contagious: false,
      ageGroup: ['adult'],
      gender: ['all'],
      riskFactors: [''],
      complications: [''],
      diagnosticTests: [''],
      medications: [''],
      lifestyleChanges: [''],
      chatbotKeywords: [''],
      chatbotResponses: ['']
    })
  }

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    })
  }

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({
      ...formData,
      [field]: newArray.length > 0 ? newArray : ['']
    })
  }

  const updateArrayItem = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({
      ...formData,
      [field]: newArray
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="m-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Disease Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <img src={assets.add_icon} alt="" className="w-5 h-5" />
          Add Disease
        </button>
      </div>

      {/* Add/Edit Disease Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingDisease ? 'Edit Disease' : 'Add New Disease'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingDisease(null)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disease Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {severities.map(severity => (
                      <option key={severity} value={severity}>
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="contagious"
                    checked={formData.contagious}
                    onChange={(e) => setFormData({...formData, contagious: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="contagious" className="text-sm font-medium text-gray-700">
                    Contagious
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                {formData.symptoms.map((symptom, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={symptom}
                      onChange={(e) => updateArrayItem('symptoms', index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter symptom"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('symptoms', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('symptoms')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Symptom
                </button>
              </div>

              {/* Causes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Causes</label>
                {formData.causes.map((cause, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={cause}
                      onChange={(e) => updateArrayItem('causes', index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter cause"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('causes', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('causes')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Cause
                </button>
              </div>

              {/* Treatments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatments</label>
                {formData.treatments.map((treatment, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={treatment}
                      onChange={(e) => updateArrayItem('treatments', index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter treatment"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('treatments', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('treatments')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Treatment
                </button>
              </div>

              {/* Chatbot Training Data */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Chatbot Training Data</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords for Chatbot</label>
                  {formData.chatbotKeywords.map((keyword, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => updateArrayItem('chatbotKeywords', index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter keyword"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('chatbotKeywords', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('chatbotKeywords')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Keyword
                  </button>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chatbot Responses</label>
                  {formData.chatbotResponses.map((response, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <textarea
                        value={response}
                        onChange={(e) => updateArrayItem('chatbotResponses', index, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter chatbot response"
                        rows="2"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('chatbotResponses', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('chatbotResponses')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Response
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingDisease(null)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingDisease ? 'Update Disease' : 'Add Disease'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disease List */}
      <div className="bg-white rounded-lg border-2 border-gray-100">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Severity</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Symptoms</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {diseases.map((disease) => (
                  <tr key={disease._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium">{disease.name}</span>
                        <p className="text-sm text-gray-500 mt-1">{disease.description.substring(0, 100)}...</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        disease.category === 'infectious' ? 'bg-red-100 text-red-800' :
                        disease.category === 'chronic' ? 'bg-orange-100 text-orange-800' :
                        disease.category === 'cancer' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {disease.category.charAt(0).toUpperCase() + disease.category.slice(1).replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        disease.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        disease.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        disease.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {disease.symptoms.slice(0, 3).join(', ')}
                        {disease.symptoms.length > 3 && '...'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(disease)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(disease._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiseaseManagement
