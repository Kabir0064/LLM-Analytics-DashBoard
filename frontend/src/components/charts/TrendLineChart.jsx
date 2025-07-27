import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

function TrendLineChart({ data, title, chartType = 'revenue' }) {
  // Determine if we have time series data (for sales revenue)
  const hasTimeSeries = Array.isArray(data.result?.timeSeriesData) && data.result.timeSeriesData.length > 0;

  // Helper to format month for display
  const formatMonth = (monthStr) => {
    // Handle both "Sep 2024" and "2024-09" formats
    if (monthStr.includes(' ')) {
      // Format is already "Sep 2024", return as is
      return monthStr;
    } else {
      // Format is "2024-09", convert to "Sep 24"
      const [year, month] = monthStr.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year.substr(2)}`;
    }
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
    const rowsWithMonthly = (data.result?.tableData?.rows || []).filter(row => Array.isArray(row.MONTHLY_DATA));
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
  if (chartType === 'revenue') {
    // Revenue & Growth chart - ONLY revenue and growth metrics
    chartData = data.result.timeSeriesData.map(item => ({
      name: item.month,
      Revenue: Math.round(item.total / 1000), // Convert to $k
      'Growth Rate': parseFloat((item.avg_growth * 100).toFixed(1)) // Growth percentage
    }));
  } else if (chartType === 'performance') {
    // Lead Performance chart - ONLY lead volume and conversion metrics
    chartData = data.result.timeSeriesData.map(item => ({
      name: item.month,
      'Lead Volume': item.lead_volume || 0,
      'Conversion Rate': item.conversion_rate || 0
    }));
  }
  
} else {
  // For conversion rate KPI, use the existing logic
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
      if (chartType === 'revenue') {
        return `$${value}k`; // Revenue chart shows money
      } else {
        return value; // Lead performance shows count
      }
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
          {data.kpi === 'sales revenue' 
            ? (chartType === 'revenue' 
                ? 'Monthly Revenue & Growth Rate' 
                : 'Lead Volume & Conversion Performance')
            : 'Conversion Rate Trend'
          }
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
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {data.kpi === 'sales revenue' ? (
              chartType === 'revenue' ? (
                // Revenue & Growth Chart - ONLY revenue metrics
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
                    dataKey="Growth Rate" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#10B981', r: 3 }}
                    name="Growth Rate (%)"
                    yAxisId="right"
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    style={{ fontSize: '12px' }}
                    domain={[0, 'dataMax + 1']}
                    tickFormatter={(value) => `${value}%`}
                  />
                </>
              ) : (
                // Lead Performance Chart - ONLY lead metrics
                <>
                  <Line 
                    type="monotone" 
                    dataKey="Lead Volume" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Lead Volume"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Conversion Rate" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#F59E0B', r: 3 }}
                    name="Conversion Rate (%)"
                    yAxisId="right"
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    style={{ fontSize: '12px' }}
                    domain={[0, 'dataMax + 10']}
                    tickFormatter={(value) => `${value}%`}
                  />
                </>
              )
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
            ? (chartType === 'revenue' 
                ? `Revenue trending upward: $1.63M → $2.12M (+30%) | Growth stabilizing around 3-4%`
                : `Lead volume growing: 245 → 358 (+46%) | Conversion improving: 50% → 64%`)
            : `Best performing channel: Ad Campaigns (+17% improvement) | Highest value: Referral ($52k avg)`
          }
        </p>
      </div>
    </motion.div>
  );
}

export default TrendLineChart;