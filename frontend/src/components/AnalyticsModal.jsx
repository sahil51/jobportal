import React, { useEffect, useState } from 'react';
import { X, BarChart3 } from 'lucide-react';

export default function AnalyticsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/analytics/')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load analytics:', err);
        setLoading(false);
      });
  }, []);

  const COLORS = ['#0066cc', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const renderPieChart = (statusList) => {
    if (!statusList || statusList.length === 0) {
      return <p style={{ color: '#6b7280', fontSize: '13px' }}>No status data available.</p>;
    }

    let cumulativeAngle = 0;
    const slices = statusList.map((item, idx) => {
      const sliceAngle = (item.percentage / 100) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + sliceAngle;
      cumulativeAngle += sliceAngle;

      const x1 = 100 + 80 * Math.cos((Math.PI * (startAngle - 90)) / 180);
      const y1 = 100 + 80 * Math.sin((Math.PI * (startAngle - 90)) / 180);
      const x2 = 100 + 80 * Math.cos((Math.PI * (endAngle - 90)) / 180);
      const y2 = 100 + 80 * Math.sin((Math.PI * (endAngle - 90)) / 180);

      const largeArc = sliceAngle > 180 ? 1 : 0;
      const pathData = statusList.length === 1 ? `M 100 20 A 80 80 0 1 1 99.99 20 Z`
      : `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

      return (
        <path
          key={idx}
          d={pathData}
          fill={COLORS[idx % COLORS.length]}
          stroke="#ffffff"
          strokeWidth="2"
        />
      );
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width="180" height="180" viewBox="0 0 200 200">
          {slices}
        </svg>

        <div className="chart-legend">
          {statusList.map((item, idx) => (
            <div key={idx} className="legend-item">
              <span>
                <span className="legend-color-dot" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                {item.name}
              </span>
              <b>{item.percentage}% ({item.count})</b>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBarChart = (items, label) => {
    if (!items || items.length === 0) {
      return <p style={{ color: '#6b7280', fontSize: '13px' }}>No {label.toLowerCase()} data found.</p>;
    }

    const maxCount = Math.max(...items.map(i => i.count), 1);

    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, idx) => {
          const widthPct = Math.round((item.count / maxCount) * 100);
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600 }}>{item.name}</span>
                <span style={{ color: '#6b7280' }}>{item.count} {item.count === 1 ? 'job' : 'jobs'}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${widthPct}%`,
                    height: '100%',
                    background: '#0066cc',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '850px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="#0066cc" />
            <h2 className="modal-title">Job Analytics & Geographic Breakdown</h2>
          </div>
          <button className="close-button" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div className="spinner"></div>
              <p>Calculating live statistics from database...</p>
            </div>
          ) : data ? (
            <div>
              <div style={{ marginBottom: '14px', background: '#eff6ff', padding: '10px 16px', borderRadius: '6px', color: '#1e40af', fontWeight: 'bold', fontSize: '13px' }}>
                Total Active Job Records: {data.total_jobs}
              </div>

              <div className="analytics-grid">
                <div className="chart-card">
                  <h4 className="chart-title">Status Distribution (%)</h4>
                  {renderPieChart(data.status_distribution)}
                </div>

                <div className="chart-card">
                  <h4 className="chart-title">Jobs by City</h4>
                  {renderBarChart(data.city_breakdown, 'City')}
                </div>

                <div className="chart-card">
                  <h4 className="chart-title">Jobs by State</h4>
                  {renderBarChart(data.state_breakdown, 'State')}
                </div>
              </div>
            </div>
          ) : (
            <p>Failed to load analytics.</p>
          )}
        </div>
      </div>
    </div>
  );
}
