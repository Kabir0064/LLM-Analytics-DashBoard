import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

function TrendLineChart({ data, title }) {
  // Transform data for the chart
  const chartData = data.tableData?.rows.map(row => ({
    name: row.INDUSTRY || row.LEAD_SOURCE || 'Item',
    value: row.TOTAL_REVENUE || row.CONVERSION_RATE * 100 || 0,
    secondary: row.TOTAL_LEADS || null
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #e0e0e0',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', r: 6 }}
            activeDot={{ r: 8 }}
            name={data.kpi === 'sales revenue' ? 'Revenue ($)' : 'Conversion Rate (%)'}
          />
          {chartData[0]?.secondary && (
            <Line 
              type="monotone" 
              dataKey="secondary" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 6 }}
              name="Total Leads"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default TrendLineChart;