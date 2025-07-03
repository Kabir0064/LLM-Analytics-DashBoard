import DataTable from '../components/data/DataTable';
import CodeBlock from '../components/data/CodeBlock';
import NarrativeText from '../components/data/NarrativeText';
import { samplePayloads } from '../data/mocks/samplePayloads';

function TestComponents() {
  // Get the first sample payload
  const payload = samplePayloads[0];
  const { result } = payload;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Component Test Page
        </h1>

        {/* Test DataTable */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            1. DataTable Component
          </h2>
          <div className="bg-white rounded-lg shadow p-6">
            <DataTable 
              headers={result.tableData.headers}
              rows={result.tableData.rows}
            />
          </div>
        </section>

        {/* Test CodeBlock */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            2. CodeBlock Component
          </h2>
          <div className="bg-white rounded-lg shadow p-6">
            <CodeBlock code={result.sql} />
          </div>
        </section>

        {/* Test NarrativeText */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            3. NarrativeText Component
          </h2>
          <div className="bg-white rounded-lg shadow p-6">
            <NarrativeText text={result.narrative} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default TestComponents;