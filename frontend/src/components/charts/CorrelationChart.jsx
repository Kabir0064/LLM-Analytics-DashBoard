import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

function CorrelationChart({ data, title }) {
  // Handle different payload types
  let scatterData = [];
  let correlationLabel = '';
  let hasValidData = false;

  if (data.id === 3) {
    // ID3 - Sales Rep Performance Correlation (Quota Attainment vs Revenue)
    if (data.result?.tableData?.rows) {
      scatterData = data.result.tableData.rows.map(rep => ({
        x: Math.round(rep.QUOTA_ATTAINMENT * 100), // Quota attainment %
        y: Math.round(rep.TOTAL_REVENUE / 1000), // Revenue in $k
        name: rep.REP_NAME.split(' ')[0],
        fullName: rep.REP_NAME,
        deals: rep.DEALS_COUNT,
        avgDeal: Math.round(rep.AVG_DEAL_SIZE / 1000)
      }));
      correlationLabel = 'Quota Attainment vs Revenue';
      hasValidData = true;
    }
  } else if (data.correlationData?.volumeVsRate) {
    // ID2 - Original correlation data
    scatterData = data.correlationData.volumeVsRate.map(item => ({
      x: item.volume,
      y: item.rate,
      name: item.source,
      dealSize: item.dealSize
    }));
    correlationLabel = 'Lead Volume vs Conversion Rate';
    hasValidData = true;
  }

  // Check if we have valid correlation data
  if (!hasValidData || scatterData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-400 text-lg">
          No correlation data available for this analysis.
        </div>
      </motion.div>
    );
  }

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

  // Color based on performance metrics
  const getColor = (dataPoint) => {
    if (data.id === 3) {
      // ID3 - Color based on quota attainment
      if (dataPoint.x >= 110) return '#10B981'; // Green for over-performers
      if (dataPoint.x >= 90) return '#3B82F6'; // Blue for on-target
      return '#F59E0B'; // Amber for under-performers
    } else {
      // Original logic - color based on deal size
      if (dataPoint.dealSize >= 50) return '#10B981';
      if (dataPoint.dealSize >= 40) return '#3B82F6';
      return '#F59E0B';
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{dataPoint.fullName || dataPoint.name}</p>
          {data.id === 3 ? (
            // ID3 - Sales Rep tooltip
            <>
              <p className="text-sm text-gray-600">Quota: {dataPoint.x}%</p>
              <p className="text-sm text-gray-600">Revenue: ${dataPoint.y}k</p>
              <p className="text-sm text-gray-600">Deals: {dataPoint.deals}</p>
              <p className="text-sm text-gray-600">Avg Deal: ${dataPoint.avgDeal}k</p>
            </>
          ) : (
            // Original tooltip
            <>
              <p className="text-sm text-gray-600">Volume: {dataPoint.x}</p>
              <p className="text-sm text-gray-600">Conversion: {dataPoint.y}%</p>
              <p className="text-sm text-gray-600">Avg Deal: ${dataPoint.dealSize}k</p>
            </>
          )}
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
        <circle cx={cx} cy={cy} r={8} fill={getColor(payload)} opacity={0.8} />
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
            {correlationLabel} | Correlation: <span className="font-semibold">{correlation}</span>
          </span>
          <div className="flex items-center space-x-2 text-xs">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              {data.id === 3 ? 'Over-performer' : 'High Value'}
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              {data.id === 3 ? 'On-target' : 'Medium'}
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
              {data.id === 3 ? 'Under-performer' : 'Lower'}
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
            name={data.id === 3 ? "Quota Attainment" : "Lead Volume"}
            label={{ 
              value: data.id === 3 ? 'Quota Attainment (%)' : 'Lead Volume', 
              position: 'insideBottom', 
              offset: -10 
            }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name={data.id === 3 ? "Revenue" : "Conversion Rate %"}
            label={{ 
              value: data.id === 3 ? 'Revenue ($k)' : 'Conversion Rate %', 
              angle: -90, 
              position: 'insideLeft' 
            }}
            domain={['dataMin - 50', 'dataMax + 50']}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter 
            name={data.id === 3 ? "Sales Reps" : "Lead Sources"} 
            data={scatterData} 
            shape={<CustomDot />}
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Insights */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Insights:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {data.id === 3 ? (
            // ID3 - Sales Rep insights
            <>
              <li>• {correlation > 0 ? 'Positive' : 'Negative'} correlation ({correlation}) between quota attainment and revenue</li>
              <li>• Michael Nichols: Top performer with 118% quota attainment</li>
              <li>• Higher quota achievers generally drive more revenue</li>
            </>
          ) : (
            // Original insights
            <>
              <li>• {correlation > 0 ? 'Positive' : 'Negative'} correlation ({correlation}) between volume and conversion rate</li>
              <li>• Referral leads: Lowest volume but highest deal value ($52k avg)</li>
              <li>• Ad campaigns: Best balance of volume and conversion rate</li>
            </>
          )}
        </ul>
      </div>
    </motion.div>
  );
}

export default CorrelationChart;