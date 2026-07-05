import React, { useState } from 'react';

/**
 * DashboardChart Component
 * A premium, interactive, pure SVG Chart component.
 * Renders Line Charts and Bar Charts for Admin Analytics with hover states.
 */
export default function DashboardChart() {
  const [activeTab, setActiveTab] = useState('performance'); // performance, sales
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Sample analytics datasets
  const monthlyPerformance = [
    { month: 'Jan', inquiries: 25, orders: 12 },
    { month: 'Feb', inquiries: 38, orders: 18 },
    { month: 'Mar', inquiries: 45, orders: 24 },
    { month: 'Apr', inquiries: 55, orders: 32 },
    { month: 'May', inquiries: 72, orders: 48 },
    { month: 'Jun', inquiries: 95, orders: 68 }
  ];

  const productDistribution = [
    { name: 'General BioBlend', stock: 120, sold: 340, color: 'var(--color-crops)' },
    { name: 'Tomato Booster', stock: 350, sold: 512, color: 'var(--color-roots-glow)' },
    { name: 'Chilli Vitalizer', stock: 210, sold: 289, color: 'var(--color-science-glow)' },
    { name: 'Brinjal Bloom', stock: 150, sold: 198, color: 'var(--color-crisis)' }
  ];

  // SVG parameters for Performance Chart
  const svgWidth = 500;
  const svgHeight = 220;
  const padding = 40;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  // Max values for auto-scaling
  const maxVal = 100;

  // Coordinate helper functions
  const getX = (index) => padding + (index / (monthlyPerformance.length - 1)) * chartWidth;
  const getY = (value) => padding + chartHeight - (value / maxVal) * chartHeight;

  // Compile line coordinates path strings
  const inquiryPath = monthlyPerformance.map((d, i) => `${getX(i)},${getY(d.inquiries)}`).join(' L ');
  const orderPath = monthlyPerformance.map((d, i) => `${getX(i)},${getY(d.orders)}`).join(' L ');

  return (
    <div style={{
      background: 'var(--color-card-bg)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid var(--color-card-border)',
      borderRadius: '20px',
      padding: '1.75rem',
      fontFamily: 'var(--font-body)'
    }}>
      {/* Chart Header Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-headers)', fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
            System Analytics Ledger
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Real-time client inquiries & completed orders
          </span>
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '2px' }}>
          <button 
            onClick={() => setActiveTab('performance')}
            style={{
              padding: '0.4rem 1rem', borderRadius: '8px', border: 'none',
              background: activeTab === 'performance' ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
              color: activeTab === 'performance' ? 'var(--color-crops)' : 'var(--color-text-muted)',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-fast)'
            }}
          >
            Leads Trend
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            style={{
              padding: '0.4rem 1rem', borderRadius: '8px', border: 'none',
              background: activeTab === 'sales' ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
              color: activeTab === 'sales' ? 'var(--color-crops)' : 'var(--color-text-muted)',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-fast)'
            }}
          >
            Product Catalog
          </button>
        </div>
      </div>

      {/* PERFORMANCE TREND SVG CHART */}
      {activeTab === 'performance' && (
        <div style={{ position: 'relative' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            {/* Gradients */}
            <defs>
              <linearGradient id="inquiryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-science-glow)" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="var(--color-science-glow)" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-crops)" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="var(--color-crops)" stopOpacity="0"/>
              </linearGradient>
            </defs>

            {/* Grid Helper Lines */}
            {[0, 25, 50, 75, 100].map((tick, i) => (
              <g key={i}>
                <line 
                  x1={padding} 
                  y1={getY(tick)} 
                  x2={svgWidth - padding} 
                  y2={getY(tick)} 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="1"
                />
                <text 
                  x={padding - 10} 
                  y={getY(tick) + 4} 
                  fill="rgba(255,255,255,0.3)" 
                  fontSize="8px" 
                  textAnchor="end"
                >
                  {tick}
                </text>
              </g>
            ))}

            {/* Area Fills */}
            <path 
              d={`M ${padding},${padding + chartHeight} L ${inquiryPath} L ${svgWidth - padding},${padding + chartHeight} Z`} 
              fill="url(#inquiryGrad)"
            />
            <path 
              d={`M ${padding},${padding + chartHeight} L ${orderPath} L ${svgWidth - padding},${padding + chartHeight} Z`} 
              fill="url(#orderGrad)"
            />

            {/* Trend Lines */}
            <path 
              d={`M ${inquiryPath}`} 
              fill="none" 
              stroke="var(--color-science-glow)" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d={`M ${orderPath}`} 
              fill="none" 
              stroke="var(--color-crops)" 
              strokeWidth="2" 
              strokeLinecap="round"
            />

            {/* interactive dot points */}
            {monthlyPerformance.map((d, i) => (
              <g key={i}>
                {/* Inquiry Node */}
                <circle 
                  cx={getX(i)} 
                  cy={getY(d.inquiries)} 
                  r={hoveredPoint?.idx === i && hoveredPoint.type === 'inquiry' ? '6' : '3.5'} 
                  fill="hsl(30, 8%, 10%)" 
                  stroke="var(--color-science-glow)" 
                  strokeWidth="2" 
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={() => setHoveredPoint({ idx: i, type: 'inquiry', val: d.inquiries, label: 'Leads' })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Order Node */}
                <circle 
                  cx={getX(i)} 
                  cy={getY(d.orders)} 
                  r={hoveredPoint?.idx === i && hoveredPoint.type === 'order' ? '6' : '3.5'} 
                  fill="hsl(30, 8%, 10%)" 
                  stroke="var(--color-crops)" 
                  strokeWidth="2" 
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={() => setHoveredPoint({ idx: i, type: 'order', val: d.orders, label: 'Orders' })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                
                {/* Bottom X Labels */}
                <text 
                  x={getX(i)} 
                  y={padding + chartHeight + 15} 
                  fill="rgba(255,255,255,0.4)" 
                  fontSize="9px" 
                  textAnchor="middle"
                >
                  {d.month}
                </text>
              </g>
            ))}
          </svg>

          {/* Interactive Tooltip Overlay */}
          {hoveredPoint && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(5,5,5,0.85)',
              border: `1px solid ${hoveredPoint.type === 'inquiry' ? 'var(--color-science-glow)' : 'var(--color-crops)'}`,
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              display: 'flex',
              gap: '0.5rem',
              zIndex: 10
            }}>
              <span style={{ color: 'var(--color-text-muted)' }}>{hoveredPoint.label}:</span>
              <span style={{ color: '#fff' }}>{hoveredPoint.val} units</span>
            </div>
          )}
        </div>
      )}

      {/* SALES / PRODUCT DISTRIBUTION CHART */}
      {activeTab === 'sales' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          {productDistribution.map((item, idx) => {
            const total = item.stock + item.sold;
            const soldPercentage = (item.sold / total) * 100;

            return (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.name}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    {item.sold} sold / <strong style={{ color: item.color }}>{item.stock} left</strong>
                  </span>
                </div>
                {/* Visual Bar */}
                <div style={{
                  height: '8px',
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  display: 'flex'
                }}>
                  <div style={{
                    width: `${soldPercentage}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, rgba(255,255,255,0.05), ${item.color})`,
                    borderRadius: '4px 0 0 4px',
                    transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
