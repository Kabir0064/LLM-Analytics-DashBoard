import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

function TrendLineChart({ data, title, chartType = 'revenue', selectedYear = 2025 }) {
  // Determine if we have time series data (for sales revenue)
  const hasTimeSeries = Array.isArray(data.result?.timeSeriesData) && data.result.timeSeriesData.length > 0;

  // Helper function to format month for display
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
if (hasTimeSeries && data.kpi === 'sales revenue' && data.id !== 3) {
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
  
} else if (data.kpi === 'sales revenue' && data.id === 3) {
  // ID3 - Sales Rep analysis
  if (chartType === 'ranking') {
    // Sales Rep Revenue Ranking - Bar chart data
    chartData = data.result.tableData.rows.map(rep => ({
      name: rep.REP_NAME.split(' ')[0], // First name for x-axis
      fullName: rep.REP_NAME,
      Revenue: Math.round(rep.TOTAL_REVENUE / 1000), // Convert to $k
      'Deals Count': rep.DEALS_COUNT,
      'Quota Attainment': Math.round(rep.QUOTA_ATTAINMENT * 100) // Convert to percentage
    }));
  } else if (chartType === 'performance') {
    // Monthly Performance Trends - Show top 3 reps over time
    const topReps = data.result.tableData.rows.slice(0, 3);
    const months = ['Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24'];
    chartData = months.map(month => {
      const dataPoint = { name: month };
      topReps.forEach(rep => {
        const monthData = rep.MONTHLY_PERFORMANCE.find(m => formatMonth(m.month) === month);
        if (monthData) {
          dataPoint[rep.REP_NAME.split(' ')[0]] = Math.round(monthData.revenue / 1000);
        }
      });
      return dataPoint;
    });
  }
  
} else if (data.kpi === 'lead conversion rate') {
  if (chartType === 'conversion') {
    // For ID4 - Show yearly trends by industry (filtered by selectedYear)
    if (data.id === 4) {
      const yearData = data.result.tableData.rows.filter(row => row.YEAR === selectedYear);
      chartData = yearData.map(row => ({
        name: row.INDUSTRY,
        'Conversion Rate': parseFloat((row.CONVERSION_RATE * 100).toFixed(1)),
        'Total Leads': row.TOTAL_LEADS,
        'Converted Leads': row.CONVERTED_LEADS
      }));
    } else {
      // For other payloads, use the existing logic  
      chartData = createTimeSeriesFromRows();
    }
  } else if (chartType === 'sources') {
    // For ID4 - Show industry comparison across years
    if (data.id === 4) {
      const industries = [...new Set(data.result.tableData.rows.map(row => row.INDUSTRY))];
      const years = [2023, 2024, 2025];
      
      chartData = years.map(year => {
        const dataPoint = { name: year.toString() };
        industries.forEach(industry => {
          const industryData = data.result.tableData.rows.find(row => 
            row.INDUSTRY === industry && row.YEAR === year
          );
          if (industryData) {
            dataPoint[industry] = parseFloat((industryData.CONVERSION_RATE * 100).toFixed(1));
          }
        });
        return dataPoint;
      });
    } else {
      // For other payloads, use the existing logic with monthly data
      const topSources = data.result.tableData.rows
        .sort((a, b) => b.CONVERSION_RATE - a.CONVERSION_RATE)
        .slice(0, 3);
      
      // Create time series for each top source
      const months = ['Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24'];
      chartData = months.map(month => {
        const dataPoint = { name: month };
        topSources.forEach(source => {
          const monthData = source.MONTHLY_DATA.find(m => formatMonth(m.month) === month);
          if (monthData) {
            dataPoint[source.LEAD_SOURCE] = parseFloat((monthData.rate * 100).toFixed(1));
          }
        });
        return dataPoint;
      });
    }
  }
} else {
  // For other KPIs, use the existing logic
  chartData = createTimeSeriesFromRows();
}

  // Helper function to calculate trend direction
  const calculateTrend = (data) => {
    if (!data || data.length < 2) return { direction: 'stable', change: 0 };
    
    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    
    // Get the primary metric value based on chart type
    let startValue, endValue;
    if (chartType === 'conversion' || chartType === 'sources') {
      startValue = firstValue['Conversion Rate'] || Object.values(firstValue).find(val => typeof val === 'number') || 0;
      endValue = lastValue['Conversion Rate'] || Object.values(lastValue).find(val => typeof val === 'number') || 0;
    } else if (chartType === 'ranking') {
      // For ranking, compare top vs bottom performer
      startValue = data[data.length - 1]['Revenue'] || 0; // Bottom performer
      endValue = data[0]['Revenue'] || 0; // Top performer
      const spread = ((endValue - startValue) / startValue) * 100;
      return { direction: 'ranking', change: Math.round(spread) };
    } else if (chartType === 'performance') {
      // For performance, use the first rep's trend (Michael)
      const firstRepKey = Object.keys(firstValue).find(key => key !== 'name');
      if (firstRepKey) {
        startValue = firstValue[firstRepKey] || 0;
        endValue = lastValue[firstRepKey] || 0;
      } else {
        return { direction: 'stable', change: 0 };
      }
    } else {
      startValue = firstValue['Revenue'] || firstValue['Lead Volume'] || 0;
      endValue = lastValue['Revenue'] || lastValue['Lead Volume'] || 0;
    }
    
    if (startValue === 0) return { direction: 'stable', change: 0 };
    
    const change = ((endValue - startValue) / startValue) * 100;
    
    if (change > 5) return { direction: 'improving', change: Math.round(change) };
    if (change < -5) return { direction: 'declining', change: Math.round(change) };
    return { direction: 'stable', change: Math.round(change) };
  };

  const trend = calculateTrend(chartData);

  // Custom tooltip for both KPIs
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {
                entry.name.includes('Revenue') || entry.name.includes('($k)') ? `$${entry.value}k` :
                entry.name.includes('Rate') || entry.name.includes('(%)') || entry.name.includes('Attainment') ? `${entry.value}%` :
                entry.value.toLocaleString()
              }
            </p>
          ))}
          {/* Show full name for ranking chart */}
          {chartType === 'ranking' && payload[0]?.payload?.fullName && (
            <p className="text-xs text-gray-500 mt-1">
              {payload[0].payload.fullName}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick formatter
  const formatYAxis = (value, chartType) => {
    if (chartType === 'conversion' || chartType === 'sources') {
      return `${Math.round(value * 100) / 100}%`;
    } else if (chartType === 'ranking' || chartType === 'performance') {
      return `$${Math.round(value)}k`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
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
        <div className="flex items-center gap-3">
          {/* Trend Direction Indicator */}
          <div className="flex items-center gap-2">
            {trend.direction === 'improving' && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">
                  ↗ Improving (+{trend.change}%)
                </span>
              </>
            )}
            {trend.direction === 'declining' && (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600">
                  ↘ Declining ({trend.change}%)
                </span>
              </>
            )}
            {trend.direction === 'stable' && (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-600">
                  → Stable ({trend.change > 0 ? '+' : ''}{trend.change}%)
                </span>
              </>
            )}
            {trend.direction === 'ranking' && (
              <>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-600">
                  🏆 Performance Gap ({trend.change}%)
                </span>
              </>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {data.kpi === 'sales revenue' 
              ? (data.id === 3 
                  ? (chartType === 'ranking' 
                      ? 'Top 5 Sales Rep Revenue Ranking' 
                      : 'Monthly Performance Trends - Top 3 Reps')
                  : (chartType === 'revenue' 
                      ? 'Monthly Revenue & Growth Rate' 
                      : 'Lead Volume & Conversion Performance'))
              : (chartType === 'conversion'
                  ? 'Overall Conversion Rate Trend'
                  : 'Top 3 Lead Sources Performance')
            }
          </span>
        </div>
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
              tickFormatter={(value) => formatYAxis(value, chartType)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {data.kpi === 'sales revenue' ? (
              data.id === 3 ? (
                // ID3 - Sales Rep Analysis
                chartType === 'ranking' ? (
                  // Sales Rep Revenue Ranking - Single revenue line
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
                      dataKey="Quota Attainment" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#10B981', r: 3 }}
                      name="Quota Attainment (%)"
                      yAxisId="right"
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `${value}%`}
                    />
                  </>
                ) : (
                  // Monthly Performance Trends - Top 3 reps
                  <>
                    <Line 
                      type="monotone" 
                      dataKey="Michael" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Michael Nichols ($k)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Aaron" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Aaron Meyer ($k)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Robyn" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Robyn Howell ($k)"
                    />
                  </>
                )
              ) : (
                // ID1 - Industry Analysis  
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
                      tickFormatter={(value) => `${value}%`}
                    />
                  </>
                )
              )
            ) : data.kpi === 'lead conversion rate' ? (
              chartType === 'conversion' ? (
                // Overall Conversion Rate Trend
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
              ) : (
                // Individual Source Performance - Top 3 sources
                <>
                  <Line 
                    type="monotone" 
                    dataKey="Ad" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Ad (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Web" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Web (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Referral" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Referral (%)"
                  />
                </>
              )
            ) : (
              // Default case for other KPIs
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
            ? (data.id === 3 
                ? (chartType === 'ranking'
                    ? `Top performer: Michael Nichols ($1.06M, 118% quota) | Avg deal size: $46k | Performance spread: $291k`
                    : `Michael trending up: $156k → $175k | Aaron stable around $150k | Robyn improving: $142k → $152k`)
                : (chartType === 'revenue' 
                    ? `Revenue trending upward: $1.63M → $2.12M (+30%) | Growth stabilizing around 3-4%`
                    : `Lead volume growing: 245 → 358 (+46%) | Conversion improving: 50% → 64%`))
            : (chartType === 'conversion'
                ? `Overall conversion improving: 52% → 61% (+17%) | Best performing: Ad Campaigns`
                : `Top performers: Ad (61.4%), Web (60.5%), Referral (59.9%) | Ad showing strongest growth`)
          }
        </p>
      </div>
    </motion.div>
  );
}

export default TrendLineChart;