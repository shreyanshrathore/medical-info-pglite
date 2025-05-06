import { useDatabase } from "../context/DatabaseContext";
import SqlEditor from "../components/SqlEditor";

const QueryPatients = () => {
  const { executeQuery, queryHistory, loading } = useDatabase();

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          SQL Query Interface
        </h1>
        <p className="text-gray-600 mt-1">
          Run custom SQL queries against your patient database
        </p>
      </div>

      <SqlEditor
        onExecute={executeQuery}
        queryHistory={queryHistory}
        isLoading={loading}
      />

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          Available Tables
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <h4 className="text-md font-medium text-gray-900">patients</h4>
            <ul className="text-sm text-gray-600 ml-4">
              <li>
                <code>id</code> - SERIAL PRIMARY KEY
              </li>
              <li>
                <code>first_name</code> - TEXT
              </li>
              <li>
                <code>last_name</code> - TEXT
              </li>
              <li>
                <code>date_of_birth</code> - TEXT
              </li>
              <li>
                <code>gender</code> - TEXT
              </li>
              <li>
                <code>email</code> - TEXT
              </li>
              <li>
                <code>phone</code> - TEXT
              </li>
              <li>
                <code>address</code> - TEXT
              </li>
              <li>
                <code>medical_history</code> - TEXT
              </li>
              <li>
                <code>allergies</code> - TEXT
              </li>
              <li>
                <code>emergency_contact</code> - TEXT
              </li>
              <li>
                <code>insurance_provider</code> - TEXT
              </li>
              <li>
                <code>insurance_number</code> - TEXT
              </li>
              <li>
                <code>created_at</code> - TIMESTAMP
              </li>
              <li>
                <code>updated_at</code> - TIMESTAMP
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-900">query_history</h4>
            <ul className="text-sm text-gray-600 ml-4">
              <li>
                <code>id</code> - SERIAL PRIMARY KEY
              </li>
              <li>
                <code>query</code> - TEXT
              </li>
              <li>
                <code>timestamp</code> - TIMESTAMP
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">
          Example Queries
        </h3>
        <div className="space-y-2">
          <div>
            <h4 className="text-md font-medium text-gray-900">Basic Queries</h4>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
              SELECT * FROM patients;
            </pre>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto mt-2">
              SELECT first_name, last_name, email FROM patients ORDER BY
              last_name;
            </pre>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-900">Filtering</h4>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
              SELECT * FROM patients WHERE gender = 'female';
            </pre>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto mt-2">
              SELECT * FROM patients WHERE created_at NOW() - INTERVAL '7 days';
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryPatients;
