import { useState } from 'react';
import { PlayCircle, Save, RotateCcw } from 'lucide-react';
import { QueryHistory } from '../types';

interface SqlEditorProps {
  onExecute: (query: string) => Promise<any>;
  queryHistory: QueryHistory[];
  isLoading: boolean;
}

const SqlEditor = ({ onExecute, queryHistory, isLoading }: SqlEditorProps) => {
  const [query, setQuery] = useState("SELECT * FROM patients");
  const [result, setResult] = useState<{rows: any[], rowCount: number} | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleExecute = async () => {
    try {
      setError(null);
      const queryResult = await onExecute(query);
      setResult(queryResult);
    } catch (err: any) {
      setError(err.message || 'Error executing query');
      setResult(null);
    }
  };

  const handleHistoryClick = (historicalQuery: string) => {
    setQuery(historicalQuery);
  };

  const resetEditor = () => {
    setQuery('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="card animate-fadeIn overflow-hidden">
      <div className="bg-gray-800 p-4 text-white">
        <h3 className="text-lg font-medium mb-2">SQL Query Editor</h3>
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-900 text-white font-mono p-3 rounded border border-gray-700 focus:outline-none focus:border-teal-500 h-36"
            placeholder="Enter SQL query..."
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={resetEditor}
              className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
              title="Reset"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleExecute}
            disabled={isLoading || !query.trim()}
            className="btn bg-teal-600 hover:bg-teal-700 text-white flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayCircle size={16} />
            <span>{isLoading ? 'Executing...' : 'Execute Query'}</span>
          </button>
          <p className="text-sm text-gray-400">Press button to run query</p>
        </div>
      </div>

      {/* Results section */}
      <div className="p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
            <h4 className="font-medium">Error</h4>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Results ({result.rowCount} rows)</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {result.rows.length > 0 &&
                      Object.keys(result.rows[0]).map((key) => (
                        <th
                          key={key}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {Object.values(row).map((value, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-3 py-2 whitespace-nowrap text-sm text-gray-700"
                        >
                          {value?.toString() || 'null'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Query history */}
        <div className="mt-6">
          <h4 className="font-medium mb-2">Recent Queries</h4>
          <div className="border rounded divide-y max-h-60 overflow-y-auto">
            {queryHistory.length === 0 ? (
              <p className="text-gray-500 italic p-3 text-sm">No query history yet</p>
            ) : (
              queryHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleHistoryClick(item.query)}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-mono text-xs text-gray-800 truncate max-w-[80%]">
                      {item.query}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SqlEditor;