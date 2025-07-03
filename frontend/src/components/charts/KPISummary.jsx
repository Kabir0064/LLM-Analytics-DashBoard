import KPICard from './KPIcard';
function KPISummary({ data }) {
  // Calculate KPIs from the data
  const calculateKPIs = () => {
    if (!data || !data.tableData) return [];

    const { headers, rows } = data.tableData;
    
    // Generic calculations based on available data
    if (data.kpi === 'sales revenue') {
      const totalRevenue = rows.reduce((sum, row) => sum + (row.TOTAL_REVENUE || 0), 0);
      const avgRevenue = totalRevenue / rows.length;
      
      return [
        {
          title: 'Total Revenue',
          value: `$${(totalRevenue / 1000000).toFixed(2)}M`,
          change: '+12.5%',
          trend: 'up',
          icon: 'revenue'
        },
        {
          title: 'Avg Revenue',
          value: `$${(avgRevenue / 1000000).toFixed(2)}M`,
          change: '+8.3%',
          trend: 'up',
          icon: 'target'
        },
        {
          title: 'Industries',
          value: rows.length,
          change: '0%',
          trend: 'neutral',
          icon: 'users'
        },
        {
          title: 'Period',
          value: '2025 YTD',
          change: null,
          trend: 'neutral',
          icon: 'activity'
        }
      ];
    } else if (data.kpi === 'lead conversion rate') {
      const avgConversion = rows.reduce((sum, row) => sum + (row.CONVERSION_RATE || 0), 0) / rows.length;
      const totalLeads = rows.reduce((sum, row) => sum + (row.TOTAL_LEADS || 0), 0);
      
      return [
        {
          title: 'Avg Conversion',
          value: `${(avgConversion * 100).toFixed(1)}%`,
          change: '+5.2%',
          trend: 'up',
          icon: 'target'
        },
        {
          title: 'Total Leads',
          value: totalLeads.toLocaleString(),
          change: '+18.7%',
          trend: 'up',
          icon: 'users'
        },
        {
          title: 'Sources',
          value: rows.length,
          change: '0%',
          trend: 'neutral',
          icon: 'activity'
        },
        {
          title: 'Best Source',
          value: rows[0]?.LEAD_SOURCE || 'N/A',
          change: null,
          trend: 'neutral',
          icon: 'revenue'
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