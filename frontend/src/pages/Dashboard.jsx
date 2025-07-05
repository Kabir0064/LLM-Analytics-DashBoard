import { useState } from 'react';
import PayloadViewer from '../components/data/PayloadViewer';
import KPISummary from '../components/charts/KPISummary';
import TrendLineChart from '../components/charts/TrendLineChart';
import DistributionPieChart from '../components/charts/DistributionPieChart';
import ComparisonBarChart from '../components/charts/ComparisonBarChart';
import { samplePayloads } from '../data/mocks/samplePayloads';
import CorrelationChart from '../components/charts/CorrelationChart';

function Dashboard() {
  const [selectedPayloadId, setSelectedPayloadId] = useState(samplePayloads[0].id);
  const selectedPayload = samplePayloads.find(p => p.id === selectedPayloadId);

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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TrendLineChart 
            data={selectedPayload.result} 
            title="Trend Analysis" 
          />
          <DistributionPieChart 
            data={selectedPayload.result} 
            title="Distribution Breakdown" 
          />
        </div>

        {/* Bar Chart */}
        <div className="mb-8">
          <ComparisonBarChart 
            data={selectedPayload.result} 
            title="Comparative Analysis" 
          />
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