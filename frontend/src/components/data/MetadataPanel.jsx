function MetadataPanel({ intent, kpi, operation }) {
  const metadata = [
    { label: 'Intent', value: intent, color: 'blue' },
    { label: 'Operation', value: operation, color: 'green' },
    { label: 'KPI', value: kpi, color: 'purple' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metadata.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-500 mb-1">
            {item.label}
          </p>
          <p className={`text-lg font-semibold text-${item.color}-600 capitalize`}>
            {item.value || 'N/A'}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MetadataPanel;