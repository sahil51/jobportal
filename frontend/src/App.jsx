import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, BarChart2, Briefcase, RefreshCw } from 'lucide-react';
import JobCard from './components/JobCard';
import JobFormModal from './components/JobFormModal';
import AnalyticsModal from './components/AnalyticsModal';

export default function App() {
  const API_BASE = 'http://127.0.0.1:8000/api/jobs/';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter) params.append('status', statusFilter);

      const url = `${API_BASE}?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('API fetch failed');

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, statusFilter]);

  const handleSaveJob = async (formData, jobId) => {
    const isEdit = Boolean(jobId);
    const url = isEdit ? `${API_BASE}${jobId}/` : API_BASE;
    const method = isEdit ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      const firstKey = Object.keys(errorData)[0];
      const message = Array.isArray(errorData[firstKey]) ? errorData[firstKey][0] : errorData[firstKey];
      throw new Error(message || 'Validation or Server Error');
    }

    await fetchJobs();
  };

  const handleDeleteJob = async (id, title) => {
    const confirmed = window.confirm(`Do you want to delete ${title}?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== id));
      }
    } catch (err) {
      alert('error');
    }
  };

  const handleDuplicateJob = async (id) => {
    try {
      const response = await fetch(`${API_BASE}${id}/duplicate/`, {
        method: 'POST',
      });

      if (response.ok) {
        const newJob = await response.json();
        const originalIndex = jobs.findIndex(j => j.id === id);

        if (originalIndex !== -1) {
          const updated = [...jobs];
          updated.splice(originalIndex + 1, 0, newJob);
          setJobs(updated);
        } else {
          setJobs([newJob, ...jobs]);
        }
      }
    } catch (err) {
      alert('error');
    }
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setIsFormOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  return (
    <div className="app-container">
      <header className="header-bar">
        <div>
          <h1 className="brand-title">
            <Briefcase size={28} color="#0066cc" />
            Job Flow Dashboard
          </h1>
          <p className="brand-subtitle">
            Manage job postings, track applications, and visualize analytics
          </p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setIsAnalyticsOpen(true)}>
            <BarChart2 size={16} />
            Analytics Dashboard
          </button>

          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <PlusCircle size={16} />
            Post Job
          </button>
        </div>
      </header>

      <section className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search jobs by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Posted">Posted</option>
          <option value="Draft">Draft</option>
          <option value="Requested">Requested</option>
          <option value="Filled">Filled</option>
        </select>

        <button className="btn btn-secondary" onClick={fetchJobs} title="Reload Jobs">
          <RefreshCw size={16} />
        </button>
      </section>

      <main>
        {loading ? (
          <div className="state-container">
            <div className="spinner"></div>
            <h3>Loading Job Postings...</h3>
            <p style={{ color: '#666', marginTop: '6px' }}>Connecting to Django REST API</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="state-container">
            <Briefcase size={48} style={{ color: '#999', margin: '0 auto 12px auto' }} />
            <h3>No Jobs Found</h3>
            <p style={{ color: '#666', marginTop: '6px' }}>
              {searchQuery || statusFilter
                ? 'Try clearing your search query or status filter to see all jobs.'
                : 'Your database is currently empty. Click "Post Job" to create your first listing.'}
            </p>
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={handleOpenCreate}>
              Post Job Now
            </button>
          </div>
        ) : (
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteJob}
                onDuplicate={handleDuplicateJob}
              />
            ))}
          </div>
        )}
      </main>

      <JobFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveJob}
        initialData={editingJob}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </div>
  );
}
