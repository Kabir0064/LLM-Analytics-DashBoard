import { Sparklines, SparklinesLine, SparklinesSpots, SparklinesReferenceLine } from 'react-sparklines';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

function DataTable({ headers, rows }) {
  // Handle empty data gracefully
  if (!headers || !rows || rows.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  // Check if we have monthly data for sparklines
  const hasMonthlyData = rows[0]?.MONTHLY_DATA;

  // Generate sparkline data from monthly data
  const getSparklineData = (monthlyData, metric) => {
    if (!monthlyData) return [];
    
    if (metric === 'revenue') {
      return monthlyData.map(m => m.revenue);
    } else if (metric === 'rate') {
      return monthlyData.map(m => m.rate * 100);
    } else if (metric === 'volume') {
      return monthlyData.map(m => m.volume || m.leads);
    }
    return [];
  };

  // Get trend indicator
  const getTrendIndicator = (trend) => {
    if (trend === 'up' || trend === 'improving') {
      return <FiTrendingUp className="w-4 h-4 text-green-500" />;
    } else if (trend === 'down' || trend === 'declining') {
      return <FiTrendingDown className="w-4 h-4 text-red-500" />;
    } else {
      return <FiMinus className="w-4 h-4 text-gray-400" />;
    }
  };

  // Format cell value based on type
  const formatCellValue = (value, header) => {
    if (typeof value === 'number') {
      if (header.includes('RATE') || header.includes('GROWTH')) {
        return `${(value * 100).toFixed(1)}%`;
      } else if (header.includes('REVENUE') || header.includes('SIZE')) {
        return `$${value.toLocaleString()}`;
      } else {
        return value.toLocaleString();
      }
    }
    return value;
  };

  // Determine sparkline color based on trend
  const getSparklineColor = (trend) => {
    if (trend === 'up' || trend === 'improving') return '#10B981';
    if (trend === 'down' || trend === 'declining') return '#EF4444';
    return '#3B82F6';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
            {hasMonthlyData && (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  6-Month Trend
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {headers.map((header, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {formatCellValue(row[header], header)}
                </td>
              ))}
              {hasMonthlyData && (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTrendIndicator(row.TREND)}
                      <span className="ml-2 text-sm text-gray-600">
                        {row.GROWTH_RATE ? 
                          `${row.GROWTH_RATE > 0 ? '+' : ''}${(row.GROWTH_RATE * 100).toFixed(1)}%` : 
                          row.TREND
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-32 h-10">
                      <Sparklines 
                        data={getSparklineData(
                          row.MONTHLY_DATA, 
                          row.TOTAL_REVENUE ? 'revenue' : 'rate'
                        )}
                        height={40}
                        width={120}
                        margin={5}
                      >
                        <SparklinesLine 
                          color={getSparklineColor(row.TREND)} 
                          style={{ strokeWidth: 2 }}
                        />
                        <SparklinesSpots 
                          size={2}
                          style={{ fill: getSparklineColor(row.TREND) }}
                        />
                        <SparklinesReferenceLine 
                          type="mean" 
                          style={{ stroke: '#94A3B8', strokeOpacity: 0.5, strokeDasharray: '2, 2' }}
                        />
                      </Sparklines>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Table Summary */}
      {hasMonthlyData && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Sparklines show:</span> 6-month trend with mean reference line. 
            Green = improving, Red = declining, Blue = stable
          </p>
        </div>
      )}
    </div>
  );
}

export default DataTable;