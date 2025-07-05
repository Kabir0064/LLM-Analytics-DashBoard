import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

function CorrelationChart({ data, title }) {
  // Check if we have correlation data
  if (!data.correlationData?.volumeVsRate) {
    return null;
  }

  const scatterData = data.correlationData.volumeVsRate.map(item => ({
    x: item.volume,
    y: item.rate,
    name: item.source,
    dealSize: item.dealSize
  }));

  // Calculate correlation coefficient
  const calculateCorrelation = () => {
    const n = scatterData.length;
    const sumX = scatterData.reduce((sum, point) => sum + point.x, 0);
    const sumY = scatterData.reduce((sum, point) => sum + point.y, 0);
    const sumXY = scatterData.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumX2 = scatterData.reduce((sum, point) => sum + point.x * point.x, 0);
    const sumY2 = scatterData.reduce((sum, point) => sum + point.y * point.y, 0);

    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return correlation.toFixed(3);
  };

  const correlation = calculateCorrelation();

  // Color based on deal size
  const getColor = (dealSize) => {
    if (dealSize >= 50) return '#10B981'; // Green for high value
    if (dealSize >= 40) return '#3B82F6'; // Blue for medium value
    return '#F59E0B'; // Amber for lower value
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">Volume: {data.x}</p>
          <p className="text-sm text-gray-600">Conversion: {data.y}%</p>
          <p className="text-sm text-gray-600">Avg Deal: ${data.dealSize}k</p>
        </div>
      );
    }
    return null;
  };

  // Custom dot with label
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill={getColor(payload.dealSize)} opacity={0.8} />
        <text x={cx} y={cy - 12} textAnchor="middle" fill="#374151" fontSize="12" fontWeight="500">
          {payload.name}
        </text>
      </g>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Correlation: <span className="font-semibold">{correlation}</span>
          </span>
          <div className="flex items-center space-x-2 text-xs">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              High Value
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              Medium
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
              Lower
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Lead Volume"
            label={{ value: 'Lead Volume', position: 'insideBottom', offset: -10 }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Conversion Rate %"
            label={{ value: 'Conversion Rate %', angle: -90, position: 'insideLeft' }}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter 
            name="Lead Sources" 
            data={scatterData} 
            shape={<CustomDot />}
          >
            {scatterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.dealSize)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Insights */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Insights:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• {correlation > 0 ? 'Positive' : 'Negative'} correlation ({correlation}) between volume and conversion rate</li>
          <li>• Referral leads: Lowest volume but highest deal value ($52k avg)</li>
          <li>• Ad campaigns: Best balance of volume and conversion rate</li>
        </ul>
      </div>
    </motion.div>
  );
}

export default CorrelationChart;