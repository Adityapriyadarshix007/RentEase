import React from 'react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

const ChartComponent = ({ type, data, options, height = 300 }) => {
  const chartTypes = {
    line: Line,
    bar: Bar,
    doughnut: Doughnut,
    pie: Pie
  };

  const Chart = chartTypes[type];

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 10
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        borderColor: '#3B82F6',
        borderWidth: 1
      }
    },
    scales: type === 'line' || type === 'bar' ? {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
          drawBorder: false
        },
        ticks: {
          callback: (value) => {
            if (value >= 1000) return `₹${value / 1000}k`;
            return `₹${value}`;
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    } : {}
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div style={{ height: `${height}px` }}>
      <Chart data={data} options={mergedOptions} />
    </div>
  );
};

export default ChartComponent;