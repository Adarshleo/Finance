/**
 * FamFinance - Interactive Visual Analytics & Charts
 * Supports Chart.js (via CDN) with full native HTML5 Canvas fallback for 100% offline support.
 */

(function(root) {
  const PALETTE = [
    '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', 
    '#8b5cf6', '#14b8a6', '#f43f5e', '#3b82f6', '#84cc16'
  ];

  let categoryChartInstance = null;
  let trendChartInstance = null;

  /**
   * Render Category Spending Donut Chart
   */
  function renderCategoryChart(canvasId, categoryData, currency = '₹') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const labels = Object.keys(categoryData);
    const dataValues = Object.values(categoryData);

    if (labels.length === 0 || dataValues.reduce((a, b) => a + b, 0) === 0) {
      renderEmptyChart(canvas, 'No expenses recorded yet');
      return;
    }

    // If Chart.js is loaded from CDN
    if (window.Chart) {
      if (categoryChartInstance) {
        categoryChartInstance.destroy();
      }

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const textColor = isLight ? '#475569' : '#cbd5e1';

      categoryChartInstance = new window.Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: dataValues,
            backgroundColor: PALETTE.slice(0, labels.length),
            borderColor: isLight ? '#ffffff' : '#111827',
            borderWidth: 2,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: textColor,
                font: { family: 'Plus Jakarta Sans', size: 11 },
                boxWidth: 12,
                padding: 12
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const val = context.parsed;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percent = Math.round((val / total) * 100);
                  return ` ${context.label}: ${currency}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${percent}%)`;
                }
              }
            }
          }
        }
      });
      return;
    }

    // Native Canvas Fallback (offline mode)
    renderNativeDonut(canvas, labels, dataValues, currency);
  }

  /**
   * Render 6-Month Income vs Expense Trend Chart
   */
  function renderTrendChart(canvasId, transactions, currency = '₹') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Generate last 6 months keys
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('default', { month: 'short' });
      months.push({ key, label });
    }

    const incomeMap = {};
    const expenseMap = {};
    months.forEach(m => {
      incomeMap[m.key] = 0;
      expenseMap[m.key] = 0;
    });

    transactions.forEach(t => {
      const mKey = t.date.substring(0, 7);
      if (incomeMap[mKey] !== undefined) {
        if (t.type === 'income') incomeMap[mKey] += t.amount;
        if (t.type === 'expense') expenseMap[mKey] += t.amount;
      }
    });

    const monthLabels = months.map(m => m.label);
    const incomeData = months.map(m => incomeMap[m.key]);
    const expenseData = months.map(m => expenseMap[m.key]);

    if (window.Chart) {
      if (trendChartInstance) {
        trendChartInstance.destroy();
      }

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const textColor = isLight ? '#475569' : '#94a3b8';
      const gridColor = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)';

      trendChartInstance = new window.Chart(canvas, {
        type: 'bar',
        data: {
          labels: monthLabels,
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              backgroundColor: '#10b981',
              borderRadius: 6,
              maxBarThickness: 24
            },
            {
              label: 'Expenses',
              data: expenseData,
              backgroundColor: '#f43f5e',
              borderRadius: 6,
              maxBarThickness: 24
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: textColor,
                font: { family: 'Plus Jakarta Sans', size: 12 },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  return ` ${ctx.dataset.label}: ${currency}${ctx.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } }
            },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { family: 'Plus Jakarta Sans' },
                callback: val => `${currency}${val >= 1000 ? (val / 1000) + 'k' : val}`
              }
            }
          }
        }
      });
      return;
    }

    // Native Bar Chart Fallback (offline mode)
    renderNativeBar(canvas, monthLabels, incomeData, expenseData, currency);
  }

  function renderNativeDonut(canvas, labels, values, currency) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const total = values.reduce((sum, val) => sum + val, 0);
    const centerX = rect.width / 2;
    const centerY = (rect.height - 30) / 2;
    const outerRadius = Math.min(centerX, centerY) * 0.8;
    const innerRadius = outerRadius * 0.68;

    let startAngle = -Math.PI / 2;

    values.forEach((val, i) => {
      const sliceAngle = (val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'light' ? '#0f172a' : '#f8fafc';
    ctx.font = '700 16px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${currency}${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, centerX, centerY - 6);

    ctx.font = '500 11px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Total Spent', centerX, centerY + 14);
  }

  function renderNativeBar(canvas, labels, income, expense, currency) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const maxVal = Math.max(...income, ...expense, 100);
    const paddingBottom = 30;
    const paddingTop = 30;
    const chartHeight = rect.height - paddingBottom - paddingTop;
    const groupWidth = rect.width / labels.length;
    const barWidth = Math.min(16, (groupWidth - 20) / 2);

    labels.forEach((lbl, i) => {
      const groupX = i * groupWidth + (groupWidth / 2);

      // Income Bar
      const incHeight = (income[i] / maxVal) * chartHeight;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(groupX - barWidth - 2, paddingTop + (chartHeight - incHeight), barWidth, incHeight);

      // Expense Bar
      const expHeight = (expense[i] / maxVal) * chartHeight;
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(groupX + 2, paddingTop + (chartHeight - expHeight), barWidth, expHeight);

      // Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lbl, groupX, rect.height - 10);
    });
  }

  function renderEmptyChart(canvas, message) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = '#64748b';
    ctx.font = '13px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, rect.width / 2, rect.height / 2);
  }

  root.FamCharts = {
    renderCategoryChart,
    renderTrendChart
  };
})(window);
