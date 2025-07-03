import DataTable from './DataTable';
import CodeBlock from './CodeBlock';
import NarrativeText from './NarrativeText';
import MetadataPanel from './MetadataPanel';

function PayloadViewer({ payload }) {
  if (!payload) {
    return (
      <div className="text-center py-12 text-gray-500">
        No data selected
      </div>
    );
  }

  const { intent, kpi, operation, result } = payload;

  return (
    <div className="space-y-6">
      {/* Metadata Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Query Metadata
        </h2>
        <MetadataPanel intent={intent} kpi={kpi} operation={operation} />
      </section>

      {/* Narrative Section */}
      {result.narrative && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Analysis Interpretation
          </h2>
          <NarrativeText text={result.narrative} />
        </section>
      )}

      {/* Data Table Section */}
      {result.tableData && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Results Table
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <DataTable 
              headers={result.tableData.headers}
              rows={result.tableData.rows}
            />
          </div>
        </section>
      )}

      {/* SQL Query Section */}
      {result.sql && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            SQL Query
          </h2>
          <div className="bg-white rounded-lg shadow p-4">
            <CodeBlock code={result.sql} />
          </div>
        </section>
      )}
    </div>
  );
}

export default PayloadViewer;