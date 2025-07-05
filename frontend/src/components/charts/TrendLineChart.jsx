import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

function TrendLineChart({ data, title }) {
  // Determine if we have time series data (for sales revenue)
  const hasTimeSeries = Array.isArray(data.timeSeriesData) && data.timeSeriesData.length > 0;

  // Helper to format month for display
  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year.substr(2)}`;
  };

  // Aggregate MONTHLY_DATA for lead conversion rate
  // const createTimeSeriesFromRows = () => {
  //   const rowsWithMonthly = (data.tableData?.rows || []).filter(row => Array.isArray(row.MONTHLY_DATA));
  //   if (rowsWithMonthly.length === 0) return [];
  //   const monthlyAggregated = {};
  //   rowsWithMonthly.forEach(row => {
  //     row.MONTHLY_DATA.forEach(monthData => {
  //       const monthKey = monthData.month;
  //       if (!monthlyAggregated[monthKey]) {
  //         monthlyAggregated[monthKey] = {
  //           month: monthKey,
  //           totalRevenue: 0,
  //           totalLeads: 0,
  //           totalConverted: 0,
  //           avgRate: 0,
  //           count: 0
  //         };
  //       }
  //       if (data.kpi === 'sales revenue') {
  //         monthlyAggregated[monthKey].totalRevenue += monthData.revenue || 0;
  //         monthlyAggregated[monthKey].totalLeads += monthData.leads || 0;
  //       } else if (data.kpi === 'lead conversion rate') {
  //         monthlyAggregated[monthKey].avgRate += monthData.rate || 0;
  //         monthlyAggregated[monthKey].totalLeads += monthData.volume || 0;
  //         monthlyAggregated[monthKey].totalConverted += monthData.converted || 0;
  //         monthlyAggregated[monthKey].count += 1;
  //       }
  //     });
  //   });
  //   return Object.values(monthlyAggregated).map(month => {
  //     if (data.kpi === 'sales revenue') {
  //       return {
  //         name: formatMonth(month.month),
  //         Revenue: Math.round(month.totalRevenue / 1000),
  //         Leads: month.totalLeads
  //       };
  //     } else {
  //       return {
  //         name: formatMonth(month.month),
  //         'Conversion Rate': month.count > 0 ? parseFloat(((month.avgRate / month.count) * 100).toFixed(1)) : 0,
  //         'Lead Volume': month.totalLeads
  //       };
  //     }
  //   });
  // };

  const createTimeSeriesFromRows = () => {
    const rowsWithMonthly = (data.tableData?.rows || []).filter(row => Array.isArray(row.MONTHLY_DATA));
    if (rowsWithMonthly.length === 0) return [];
    const monthlyAggregated = {};
    rowsWithMonthly.forEach(row => {
      row.MONTHLY_DATA.forEach(monthData => {
        const monthKey = monthData.month;
        if (!monthlyAggregated[monthKey]) {
          monthlyAggregated[monthKey] = {
            month: monthKey,
            avgRate: 0,
            totalLeads: 0,
            totalConverted: 0,
            count: 0
          };
        }
        monthlyAggregated[monthKey].avgRate += monthData.rate || 0;
        monthlyAggregated[monthKey].totalLeads += monthData.volume || 0;
        monthlyAggregated[monthKey].totalConverted += monthData.converted || 0;
        monthlyAggregated[monthKey].count += 1;
      });
    });
    return Object.values(monthlyAggregated)
      .filter(month => month.count > 0 && month.month >= "2024-07" && month.month <= "2024-12")
      .map(month => ({
        name: formatMonth(month.month),
        "Conversion Rate": parseFloat(((month.avgRate / month.count) * 100).toFixed(1)),
        "Lead Volume": month.totalLeads
      }));
  };

  // Build chart data for the chart
let chartData = [];
if (hasTimeSeries && data.kpi === 'sales revenue') {
  chartData = data.timeSeriesData.map(item => ({
    name: formatMonth(item.month),
    Revenue: Math.round(item.total / 1000), // $k
    'Growth %': parseFloat((item.avg_growth * 100).toFixed(1)),
  }));
} else {
  chartData = createTimeSeriesFromRows();
}

  // Custom tooltip for both KPIs
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {
                entry.name.includes('Revenue') ? `$${entry.value}k` :
                entry.name.includes('Rate') || entry.name.includes('%') ? `${entry.value}%` :
                entry.value.toLocaleString()
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick formatter
  const formatYAxis = (value) => {
    if (data.kpi === 'sales revenue') {
      return `$${value}k`;
    }
    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">
          {data.kpi === 'sales revenue' ? 'Monthly Revenue Trend' : 'Conversion Rate Trend'}
        </span>
      </div>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-lg">
          No trend data available for this selection.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              style={{ fontSize: '12px' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              style={{ fontSize: '12px' }}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {data.kpi === 'sales revenue' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="Revenue" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Revenue ($k)"
                />
                <Line 
                  type="monotone" 
                  dataKey="Growth %" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10B981', r: 3 }}
                  name="Growth %"
                />
              </>
            ) : (
              <>
                <Line 
                  type="monotone" 
                  dataKey="Conversion Rate" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Conversion Rate (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="Lead Volume" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  yAxisId="right"
                  dot={{ fill: '#10B981', r: 3 }}
                  name="Lead Volume"
                />
                <YAxis yAxisId="right" orientation="right" style={{ fontSize: '12px' }} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
      {/* Trend Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {data.kpi === 'sales revenue' 
            ? `Overall market growth: 7.8% YoY | Best performer: Tech (+15.2%)`
            : `Best performing channel: Ad Campaigns (+17% improvement) | Highest value: Referral ($52k avg)`
          }
        </p>
      </div>
    </motion.div>
  );
}

export default TrendLineChart;