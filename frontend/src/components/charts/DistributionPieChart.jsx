import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

function DistributionPieChart({ data, title }) {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  // Handle different payload types
  let chartData = [];
  
  if (data.id === 3) {
    // ID3 - Sales Rep Revenue Distribution
    chartData = data.result.tableData.rows.map(rep => ({
      name: rep.REP_NAME.split(' ')[0], // First name only
      fullName: rep.REP_NAME,
      value: Math.round(rep.TOTAL_REVENUE / 1000), // Convert to $k
      quota: Math.round(rep.QUOTA_ATTAINMENT * 100), // Quota percentage
      deals: rep.DEALS_COUNT
    }));
  } else {
    // ID1 & ID2 - Original logic
    chartData = data.result?.tableData?.rows.map(row => ({
      name: row.INDUSTRY || row.LEAD_SOURCE || 'Item',
      value: row.TOTAL_REVENUE || row.CONVERTED_LEADS || 0
    })) || [];
  }

  // Custom tooltip for different data types
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{item.fullName || item.name}</p>
          <p style={{ color: payload[0].color }}>
            {data.id === 3 ? `Revenue: $${item.value}k` : `Value: ${item.value.toLocaleString()}`}
          </p>
          {item.quota && (
            <p className="text-sm text-gray-600">Quota: {item.quota}%</p>
          )}
          {item.deals && (
            <p className="text-sm text-gray-600">Deals: {item.deals}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default DistributionPieChart;