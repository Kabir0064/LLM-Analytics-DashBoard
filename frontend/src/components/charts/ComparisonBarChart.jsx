import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

function ComparisonBarChart({ data, title }) {
  // Color palette for different bars
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow/Orange
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316'  // Orange
  ];

  const chartData = data.tableData?.rows.map(row => ({
    name: row.INDUSTRY || row.LEAD_SOURCE || 'Item',
    value: row.TOTAL_REVENUE ? row.TOTAL_REVENUE / 1000000 : row.CONVERSION_RATE * 100 || 0,
    secondary: row.TOTAL_LEADS || null
  })) || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value, name, props) => [
              data.kpi === 'sales revenue' ? `$${value.toFixed(2)}M` : `${value.toFixed(1)}%`,
              name
            ]}
            labelStyle={{ fontWeight: 'bold', color: '#374151' }}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Bar 
            dataKey="value" 
            name={data.kpi === 'sales revenue' ? 'Revenue (M$)' : 'Rate (%)'}
            radius={[8, 8, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default ComparisonBarChart;