import { useState, useEffect } from 'react';
import PayloadViewer from '../components/data/PayloadViewer';
import KPISummary from '../components/charts/KPISummary';
import TrendLineChart from '../components/charts/TrendLineChart';
import DistributionPieChart from '../components/charts/DistributionPieChart';
import ComparisonBarChart from '../components/charts/ComparisonBarChart';
import { samplePayloads } from '../data/mocks/samplePayloads';
import CorrelationChart from '../components/charts/CorrelationChart';

function Dashboard() {
  const [selectedPayloadId, setSelectedPayloadId] = useState(samplePayloads[0].id);
  const [activeChart, setActiveChart] = useState('trend');
  const selectedPayload = samplePayloads.find(p => p.id === selectedPayloadId);
  
  // Dynamic default for trend chart based on KPI type and payload
  const getDefaultTrendChart = () => {
    if (selectedPayload.kpi === 'sales revenue') {
      if (selectedPayload.id === 3) return 'ranking'; // ID3 - Sales Rep ranking
      return 'revenue'; // ID1 - Industry revenue
    }
    if (selectedPayload.kpi === 'lead conversion rate') return 'conversion';
    return 'revenue';
  };
  
  const [activeTrendChart, setActiveTrendChart] = useState(getDefaultTrendChart());

  // Reset trend chart when payload changes
  useEffect(() => {
    setActiveTrendChart(getDefaultTrendChart());
  }, [selectedPayloadId]);

  // Chart options
  const chartOptions = [
    { id: 'trend', label: 'Trend Analysis', icon: '📈' },
    { id: 'pie', label: 'Distribution', icon: '🥧' },
    { id: 'bar', label: 'Comparison', icon: '📊' },
    { id: 'correlation', label: 'Correlation', icon: '🔗' }
  ];

  // Trend chart sub-options - dynamic based on KPI type and payload
  const getTrendChartOptions = () => {
    if (selectedPayload.kpi === 'sales revenue') {
      if (selectedPayload.id === 3) {
        // ID3 - Sales Rep performance analysis
        return [
          { id: 'ranking', label: 'Rep Ranking', icon: '🏆' },
          { id: 'performance', label: 'Monthly Performance', icon: '📈' }
        ];
      } else {
        // ID1 - Industry revenue analysis
        return [
          { id: 'revenue', label: 'Revenue Trend', icon: '💰' },
          { id: 'performance', label: 'Lead Performance', icon: '👥' }
        ];
      }
    } else if (selectedPayload.kpi === 'lead conversion rate') {
      return [
        { id: 'conversion', label: 'Conversion Trends', icon: '📈' },
        { id: 'sources', label: 'Source Performance', icon: '🎯' }
      ];
    }
    return [
      { id: 'revenue', label: 'Revenue Trend', icon: '💰' },
      { id: 'performance', label: 'Lead Performance', icon: '👥' }
    ];
  };

  const trendChartOptions = getTrendChartOptions();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                LLM Analytics Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600"></span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Query Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Analysis
          </label>
          <select
            value={selectedPayloadId}
            onChange={(e) => setSelectedPayloadId(Number(e.target.value))}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {samplePayloads.map(payload => (
              <option key={payload.id} value={payload.id}>
                {payload.title}
              </option>
            ))}
          </select>
        </div>

        {/* KPI Summary Cards */}
        <KPISummary data={selectedPayload.result} />

        {/* Chart Toggle Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 w-full mb-2">Visualizations:</h3>
            {chartOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveChart(option.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeChart === option.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Chart Display */}
        <div className="mb-8">
          {activeChart === 'trend' && (
            <div>
              {/* Trend Chart Sub-Toggle */}
              <div className="mb-4">
                <div className="flex gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200 w-fit">
                  {trendChartOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setActiveTrendChart(option.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                        activeTrendChart === option.id
                          ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <span>{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Render the selected trend chart */}
              <TrendLineChart 
                key={activeTrendChart} // Force re-mount when chart type changes
                data={selectedPayload} 
                title={
                  selectedPayload.kpi === 'sales revenue' 
                    ? (activeTrendChart === 'revenue' ? 'Revenue & Growth Trend' : 'Lead Performance Trend')
                    : (activeTrendChart === 'conversion' ? 'Conversion Rate Trends' : 'Lead Source Performance')
                }
                chartType={activeTrendChart}
              />
            </div>
          )}
          {activeChart === 'pie' && (
            <DistributionPieChart 
              data={selectedPayload} 
              title="Distribution Breakdown" 
            />
          )}
          {activeChart === 'bar' && (
            <ComparisonBarChart 
              data={selectedPayload} 
              title="Comparative Analysis" 
            />
          )}
          {activeChart === 'correlation' && (
            <CorrelationChart 
              data={selectedPayload} 
              title="Correlation Analysis" 
            />
          )}
        </div>

        {/* Main Content - Original Payload Viewer */}
        <main>
          <PayloadViewer payload={selectedPayload} />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;