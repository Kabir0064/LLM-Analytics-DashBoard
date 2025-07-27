import KPICard from './KPICard';

function KPISummary({ data }) {
  // Calculate KPIs from the data with real trends
  const calculateKPIs = () => {
    if (!data || !data.tableData) return [];

    const { headers, rows } = data.tableData;
    
    // Calculate trends from monthly data
    const calculateTrend = (monthlyData) => {
      if (!monthlyData || monthlyData.length < 2) return 0;
      
      const firstMonth = monthlyData[0];
      const lastMonth = monthlyData[monthlyData.length - 1];
      
      if (data.kpi === 'sales revenue') {
        const growth = ((lastMonth.revenue - firstMonth.revenue) / firstMonth.revenue) * 100;
        return growth.toFixed(1);
      } else {
        const growth = ((lastMonth.rate - firstMonth.rate) / firstMonth.rate) * 100;
        return growth.toFixed(1);
      }
    };

    // Calculate overall trend across all rows
    const calculateOverallTrend = () => {
      let totalGrowth = 0;
      let count = 0;
      
      rows.forEach(row => {
        if (row.MONTHLY_DATA) {
          const trend = calculateTrend(row.MONTHLY_DATA);
          totalGrowth += parseFloat(trend);
          count++;
        }
      });
      
      return count > 0 ? (totalGrowth / count).toFixed(1) : 0;
    };

    // Special handling for ID4 - industry lead conversion data
    if (data.id === 4) {
      // Filter for 2025 data
      const currentYearData = rows.filter(row => row.YEAR === 2025);
      const avgConversion = currentYearData.reduce((sum, row) => sum + (row.CONVERSION_RATE || 0), 0) / currentYearData.length;
      const totalLeads = currentYearData.reduce((sum, row) => sum + (row.TOTAL_LEADS || 0), 0);
      const totalConverted = currentYearData.reduce((sum, row) => sum + (row.CONVERTED_LEADS || 0), 0);
      
      // Find best performing industry
      const bestIndustry = currentYearData.sort((a, b) => b.CONVERSION_RATE - a.CONVERSION_RATE)[0];
      
      // Calculate year-over-year growth
      const industryYoYGrowth = {};
      ['Education', 'Finance', 'Health', 'Retail', 'Tech'].forEach(industry => {
        const data2025 = rows.find(r => r.INDUSTRY === industry && r.YEAR === 2025);
        const data2024 = rows.find(r => r.INDUSTRY === industry && r.YEAR === 2024);
        if (data2025 && data2024) {
          industryYoYGrowth[industry] = ((data2025.CONVERSION_RATE - data2024.CONVERSION_RATE) / data2024.CONVERSION_RATE * 100).toFixed(1);
        }
      });
      
      const avgYoYGrowth = Object.values(industryYoYGrowth).reduce((sum, val) => sum + parseFloat(val), 0) / Object.values(industryYoYGrowth).length;
      
      return [
        {
          title: 'Avg Conversion',
          value: `${(avgConversion * 100).toFixed(1)}%`,
          change: `${avgYoYGrowth > 0 ? '+' : ''}${avgYoYGrowth.toFixed(1)}% YoY`,
          trend: avgYoYGrowth > 0 ? 'up' : 'down',
          icon: 'target'
        },
        {
          title: 'Total Leads (2025)',
          value: totalLeads.toLocaleString(),
          change: `${totalConverted} converted`,
          trend: 'up',
          icon: 'users'
        },
        {
          title: 'Best Industry',
          value: bestIndustry?.INDUSTRY || 'N/A',
          change: `${(bestIndustry?.CONVERSION_RATE * 100).toFixed(1)}%`,
          trend: 'up',
          icon: 'revenue'
        },
        {
          title: 'Analysis Period',
          value: '3 Years',
          change: '2023-2025',
          trend: 'neutral',
          icon: 'activity'
        }
      ];
    }
    
    // Generic calculations based on available data
    if (data.kpi === 'sales revenue') {
      const totalRevenue = rows.reduce((sum, row) => sum + (row.TOTAL_REVENUE || 0), 0);
      const avgRevenue = totalRevenue / rows.length;
      
      // Calculate best and worst performers
      const sortedByGrowth = [...rows].sort((a, b) => (b.GROWTH_RATE || 0) - (a.GROWTH_RATE || 0));
      const bestPerformer = sortedByGrowth[0];
      const worstPerformer = sortedByGrowth[sortedByGrowth.length - 1];
      
      // Calculate period range
      const allDates = rows.flatMap(row => [row.START_DATE, row.END_DATE]);
      const earliestDate = new Date(Math.min(...allDates.map(d => new Date(d))));
      const latestDate = new Date(Math.max(...allDates.map(d => new Date(d))));
      const monthsDiff = (latestDate.getMonth() - earliestDate.getMonth()) + 
                        (12 * (latestDate.getFullYear() - earliestDate.getFullYear()));
      
      return [
        {
          title: 'Total Revenue',
          value: `$${(totalRevenue / 1000000).toFixed(2)}M`,
          change: `+${calculateOverallTrend()}%`,
          trend: parseFloat(calculateOverallTrend()) > 0 ? 'up' : 'down',
          icon: 'revenue'
        },
        {
          title: 'Best Performer',
          value: bestPerformer.INDUSTRY,
          change: `+${(bestPerformer.GROWTH_RATE * 100).toFixed(1)}%`,
          trend: 'up',
          icon: 'target'
        },
        {
          title: 'Worst Performer',
          value: worstPerformer.INDUSTRY,
          change: `${(worstPerformer.GROWTH_RATE * 100).toFixed(1)}%`,
          trend: worstPerformer.GROWTH_RATE > 0 ? 'up' : 'down',
          icon: 'activity'
        },
        {
          title: 'Analysis Period',
          value: `${monthsDiff} months`,
          change: `${rows.length} industries`,
          trend: 'neutral',
          icon: 'users'
        }
      ];
    } else if (data.kpi === 'lead conversion rate') {
      const avgConversion = rows.reduce((sum, row) => sum + (row.CONVERSION_RATE || 0), 0) / rows.length;
      const totalLeads = rows.reduce((sum, row) => sum + (row.TOTAL_LEADS || 0), 0);
      const totalConverted = rows.reduce((sum, row) => sum + (row.CONVERTED_LEADS || 0), 0);
      
      // Find best and worst sources
      const sortedByRate = [...rows].sort((a, b) => (b.CONVERSION_RATE || 0) - (a.CONVERSION_RATE || 0));
      const bestSource = sortedByRate[0];
      const mostImproved = [...rows].sort((a, b) => {
        const trendA = calculateTrend(a.MONTHLY_DATA);
        const trendB = calculateTrend(b.MONTHLY_DATA);
        return trendB - trendA;
      })[0];
      
      // Calculate average deal size
      const avgDealSize = rows.reduce((sum, row) => sum + (row.AVG_DEAL_SIZE || 0), 0) / rows.length;
      
      return [
        {
          title: 'Avg Conversion',
          value: `${(avgConversion * 100).toFixed(1)}%`,
          change: `+${calculateOverallTrend()}%`,
          trend: parseFloat(calculateOverallTrend()) > 0 ? 'up' : 'down',
          icon: 'target'
        },
        {
          title: 'Total Converted',
          value: totalConverted.toLocaleString(),
          change: `of ${totalLeads.toLocaleString()}`,
          trend: 'up',
          icon: 'users'
        },
        {
          title: 'Best Source',
          value: bestSource?.LEAD_SOURCE || 'N/A',
          change: `${(bestSource?.CONVERSION_RATE * 100).toFixed(1)}%`,
          trend: 'up',
          icon: 'revenue'
        },
        {
          title: 'Most Improved',
          value: mostImproved?.LEAD_SOURCE || 'N/A',
          change: `+${calculateTrend(mostImproved?.MONTHLY_DATA)}%`,
          trend: 'up',
          icon: 'activity'
        }
      ];
    }
    
    return [];
  };

  const kpis = calculateKPIs();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} delay={index * 0.1} />
      ))}
    </div>
  );
}

export default KPISummary;