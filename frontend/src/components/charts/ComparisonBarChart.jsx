import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

function ComparisonBarChart({ data, title, selectedYear = '2025' }) {
  // Color palette for different bars and industries
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

  // Industry color mapping for consistent visualization
  const industryColors = {
    'Tech': '#3B82F6',      // Blue
    'Finance': '#10B981',   // Green
    'Health': '#EF4444',    // Red
    'Education': '#8B5CF6', // Purple
    'Retail': '#F59E0B'     // Orange
  };

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
  } else if (data.id === 11) {
    // ID11 - Quarterly Revenue by Industry (Stacked Bar Chart)
    const quarters = [...new Set(data.result.tableData.rows.map(row => row.QUARTER))].sort();
    
    chartData = quarters.map(quarter => {
      const quarterData = data.result.tableData.rows.filter(row => row.QUARTER === quarter);
      const quarterObj = {
        name: new Date(quarter).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        fullQuarter: quarter,
        total: 0
      };
      
      // Add revenue for each industry
      quarterData.forEach(row => {
        quarterObj[row.INDUSTRY] = Math.round(row.REVENUE / 1000); // Revenue in $k
        quarterObj.total += row.REVENUE;
      });
      
      quarterObj.total = Math.round(quarterObj.total / 1000); // Total in $k
      return quarterObj;
    });
  } else if (data.id === 4) {
    // ID4 - Industry Performance Comparison (2025 data)
    const currentYearData = data.result.tableData.rows.filter(row => row.YEAR === 2025);
    chartData = currentYearData.map(row => ({
      name: row.INDUSTRY,
      value: parseFloat((row.CONVERSION_RATE * 100).toFixed(1)), // Conversion rate %
      totalLeads: row.TOTAL_LEADS,
      converted: row.CONVERTED_LEADS,
      // Calculate year-over-year change
      yoyChange: (() => {
        const prevYearData = data.result.tableData.rows.find(r => r.INDUSTRY === row.INDUSTRY && r.YEAR === 2024);
        if (prevYearData) {
          return parseFloat(((row.CONVERSION_RATE - prevYearData.CONVERSION_RATE) * 100).toFixed(1));
        }
        return 0;
      })()
    }));
  } else if (data.id === 4) {
    // ID4 - Industry performance comparison for selected year with YoY change
    const yearData = data.result.tableData.rows.filter(row => row.YEAR.toString() === selectedYear);
    const prevYear = (parseInt(selectedYear) - 1).toString();
    const prevYearData = data.result.tableData.rows.filter(row => row.YEAR.toString() === prevYear);
    
    chartData = yearData.map(industryRow => {
      const prevYearRow = prevYearData.find(row => row.INDUSTRY === industryRow.INDUSTRY);
      const yoyChange = prevYearRow 
        ? ((industryRow.CONVERSION_RATE - prevYearRow.CONVERSION_RATE) / prevYearRow.CONVERSION_RATE * 100).toFixed(1)
        : 0;
      
      return {
        name: industryRow.INDUSTRY,
        value: parseFloat((industryRow.CONVERSION_RATE * 100).toFixed(1)),
        secondary: industryRow.TOTAL_LEADS,
        yoyChange: parseFloat(yoyChange)
      };
    });
  } else if (data.id === 5) {
    // ID5 - Yearly conversion comparison
    chartData = data.result.tableData.rows.map(row => ({
      name: row.YEAR.toString(),
      value: parseFloat((row.CONVERSION_RATE * 100).toFixed(1)), // Conversion rate %
      totalLeads: row.TOTAL_LEADS,
      converted: row.CONVERTED_LEADS,
      // Calculate year-over-year change
      yoyChange: (() => {
        const currentIndex = data.result.tableData.rows.findIndex(r => r.YEAR === row.YEAR);
        const nextYearData = data.result.tableData.rows[currentIndex - 1]; // Data is sorted DESC by year
        if (nextYearData && currentIndex > 0) {
          return parseFloat(((row.CONVERSION_RATE - nextYearData.CONVERSION_RATE) * 100).toFixed(1));
        }
        return 0;
      })()
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
      
      if (data.id === 11) {
        // ID11 - Quarterly Revenue by Industry (Stacked)
        // Check if hovering over specific industry segment
        if (payload.length === 1 && payload[0].dataKey !== 'total') {
          const industry = payload[0].dataKey;
          const revenue = payload[0].value;
          return (
            <div className="bg-white p-3 border rounded-lg shadow-lg">
              <p className="font-semibold">{label}</p>
              <p style={{ color: industryColors[industry] }} className="font-medium">
                {industry}: ${revenue}k
              </p>
              <p className="text-sm text-gray-600">
                {((revenue / item.total) * 100).toFixed(1)}% of quarter total
              </p>
            </div>
          );
        }
        
        // Show all industries for the quarter
        return (
          <div className="bg-white p-3 border rounded-lg shadow-lg">
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-gray-600 mb-2">Total: ${item.total}k</p>
            <div className="space-y-1">
              {Object.keys(industryColors)
                .filter(industry => item[industry])
                .sort((a, b) => item[b] - item[a]) // Sort by revenue descending
                .map(industry => (
                  <div key={industry} className="flex justify-between items-center">
                    <span style={{ color: industryColors[industry] }} className="text-sm font-medium">
                      {industry}:
                    </span>
                    <span className="text-sm">${item[industry]}k</span>
                  </div>
                ))}
            </div>
          </div>
        );
      }
      
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
          ) : item.totalLeads ? (
            // ID4 - Industry conversion data
            <>
              <p style={{ color: payload[0].color }}>Conversion Rate: {item.value}%</p>
              <p className="text-sm text-gray-600">Total Leads: {item.totalLeads}</p>
              <p className="text-sm text-gray-600">Converted: {item.converted}</p>
              <p className="text-sm text-gray-600">
                YoY Change: {item.yoyChange > 0 ? '+' : ''}{item.yoyChange}%
              </p>
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
          {data.id === 11 ? (
            // ID11 - Stacked Bar Chart for Quarterly Revenue by Industry
            <>
              {['Tech', 'Finance', 'Health', 'Education', 'Retail'].map((industry, index, array) => (
                <Bar 
                  key={industry}
                  dataKey={industry} 
                  stackId="quarter"
                  name={industry}
                  fill={industryColors[industry]}
                  radius={index === array.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} // Rounded top only for the topmost stack
                />
              ))}
            </>
          ) : data.id === 3 ? (
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
          ) : data.id === 4 ? (
            // ID4 - Industry conversion rate comparison
            <>
              <Bar 
                dataKey="value" 
                name="Conversion Rate (%)"
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