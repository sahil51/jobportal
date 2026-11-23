import React, { useState, useEffect } from 'react';
import { X, UploadCloud, AlertCircle } from 'lucide-react';

export default function JobFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const STATUS_OPTIONS = ['Draft', 'Requested', 'Posted', 'Filled'];
  const CATEGORY_OPTIONS = ['Full-time', 'Part-time', 'Intern', 'Contract', 'Remote'];

  const [title, setTitle] = useState('');
  const [statusList, setStatusList] = useState(['Draft']);
  const [categoryList, setCategoryList] = useState(['Full-time']);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setStatusList(Array.isArray(initialData.status) ? initialData.status : ['Draft']);
      setCategoryList(Array.isArray(initialData.category) ? initialData.category : ['Full-time']);
      setAddress(initialData.address || '');
      setCity(initialData.city || '');
      setState(initialData.state || '');
      setStartDate(initialData.start_date || '');
      setEndDate(initialData.end_date || '');
      setDescription(initialData.description || '');
      setImageFile(null);

      if (initialData.profile_picture) {
        const fullUrl = initialData.profile_picture.startsWith('http')
          ? initialData.profile_picture
          : `http://127.0.0.1:8000${initialData.profile_picture}`;
        setImagePreview(fullUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      setTitle('');
      setStatusList(['Posted']);
      setCategoryList(['Full-time']);
      setAddress('');
      setCity('');
      setState('');
      setStartDate('');
      setEndDate('');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
    }

    setErrorMsg('');
  }, [initialData]);

  if (!isOpen) return null;

  const handleToggleStatus = (val) => {
    if (statusList.includes(val)) {
      setStatusList(statusList.filter(item => item !== val));
    } else {
      setStatusList([...statusList, val]);
    }
  };

  const handleToggleCategory = (val) => {
    if (categoryList.includes(val)) {
      setCategoryList(categoryList.filter(item => item !== val));
    } else {
      setCategoryList([...categoryList, val]);
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Job Title is required.');
      return;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        setErrorMsg('Validation Error: End Date cannot be before Start Date.');
        return;
      }
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('status', JSON.stringify(statusList));
    formData.append('category', JSON.stringify(categoryList));
    formData.append('address', address);
    formData.append('city', city);
    formData.append('state', state);
<<<<<<< Updated upstream
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
=======
    formData.append('start_date', startDate || '');
    formData.append('end_date', endDate || '');
>>>>>>> Stashed changes
    formData.append('description', description);

    if (imageFile) {
      formData.append('profile_picture', imageFile);
    }

    try {
      await onSubmit(formData, initialData ? initialData.id : null);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Something went wrong while saving job.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{initialData ? 'Edit Job Posting' : 'Post a New Job'}</h2>
          <button className="close-button" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errorMsg && (
            <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', padding: '10px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Job Profile Picture</label>
            <div
              className="dropzone-container"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <input
                id="file-upload-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              {imagePreview ? (
                <div>
                  <img src={imagePreview} alt="Preview" className="dropzone-preview" />
                  <p className="dropzone-text">Click or drop to replace image</p>
                </div>
              ) : (
                <div>
                  <UploadCloud size={32} style={{ color: '#999', margin: '0 auto 6px auto' }} />
                  <p className="dropzone-text">Drag & drop picture here, or <b>browse</b></p>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Senior Backend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status (Multi-select)</label>
            <div className="tags-container">
              {STATUS_OPTIONS.map((st) => (
                <span
                  key={st}
                  className={`tag-chip ${statusList.includes(st) ? 'active' : ''}`}
                  onClick={() => handleToggleStatus(st)}
                >
                  {st}
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Category (Multi-select)</label>
            <div className="tags-container">
              {CATEGORY_OPTIONS.map((cat) => (
                <span
                  key={cat}
                  className={`tag-chip ${categoryList.includes(cat) ? 'active' : ''}`}
                  onClick={() => handleToggleCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 100 Innovation Way"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Karnataka"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Describe roles and requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
