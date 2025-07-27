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

  // Handle different payload types
  let chartData = [];
  
  if (data.id === 3) {
    // ID3 - Sales Rep Performance Comparison
    chartData = data.result.tableData.rows.map(rep => ({
      name: rep.REP_NAME.split(' ')[0], // First name
      fullName: rep.REP_NAME,
      revenue: Math.round(rep.TOTAL_REVENUE / 1000), // Revenue in $k
      quota: Math.round(rep.QUOTA_ATTAINMENT * 100), // Quota percentage
      deals: rep.DEALS_COUNT,
      avgDeal: Math.round(rep.AVG_DEAL_SIZE / 1000) // Avg deal size in $k
    }));
  } else {
    // ID1 & ID2 - Original logic
    chartData = data.result?.tableData?.rows.map(row => ({
      name: row.INDUSTRY || row.LEAD_SOURCE || 'Item',
      value: row.TOTAL_REVENUE ? row.TOTAL_REVENUE / 1000000 : row.CONVERSION_RATE * 100 || 0,
      secondary: row.TOTAL_LEADS || null
    })) || [];
  }

  // Custom tooltip for different data types
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{item.fullName || label}</p>
          {item.revenue ? (
            // ID3 - Sales Rep data
            <>
              <p style={{ color: payload[0].color }}>Revenue: ${item.revenue}k</p>
              <p className="text-sm text-gray-600">Quota: {item.quota}%</p>
              <p className="text-sm text-gray-600">Deals: {item.deals}</p>
              <p className="text-sm text-gray-600">Avg Deal: ${item.avgDeal}k</p>
            </>
          ) : (
            // Original data
            <p style={{ color: payload[0].color }}>
              {payload[0].name}: {payload[0].value}
            </p>
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
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {data.id === 3 ? (
            // ID3 - Sales Rep bars with revenue and quota
            <>
              <Bar 
                dataKey="revenue" 
                name="Revenue ($k)"
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </>
          ) : (
            // Original bar chart
            <Bar 
              dataKey="value" 
              name={data.kpi === 'sales revenue' ? 'Revenue (M$)' : 'Rate (%)'}
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default ComparisonBarChart;