import { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { validateWorkflow } from '../../lib/workflowValidation';
import type { ValidationResult } from '../../lib/workflowValidation';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export function WorkflowToolbar() {
  const { workflow, nodes } = useWorkflowStore();
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (workflow) {
      const result = validateWorkflow(workflow.nodes, workflow.edges);
      setValidation(result);
    }
  }, [workflow?.nodes, workflow?.edges, workflow]);

  if (!validation) return null;

  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          hasErrors
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : hasWarnings
            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {hasErrors ? (
          <AlertCircle size={18} />
        ) : hasWarnings ? (
          <AlertTriangle size={18} />
        ) : (
          <CheckCircle size={18} />
        )}
        <span className="font-medium">
          {hasErrors ? 'Invalid' : hasWarnings ? 'Warnings' : 'Valid'}
        </span>
        {(hasErrors || hasWarnings) && (
          <span className="text-sm">
            ({validation.errors.length + validation.warnings.length})
          </span>
        )}
      </button>

      {showDetails && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Workflow Validation</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-4 space-y-3">
            {/* Errors */}
            {validation.errors.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700 mb-2">
                  <AlertCircle size={16} />
                  Errors ({validation.errors.length})
                </h4>
                <div className="space-y-2">
                  {validation.errors.map((error, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800"
                    >
                      {error.message}
                      {error.nodeIds && error.nodeIds.length > 0 && (
                        <div className="mt-1 text-xs text-red-600">
                          Nodes: {error.nodeIds.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {validation.warnings.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-700 mb-2">
                  <AlertTriangle size={16} />
                  Warnings ({validation.warnings.length})
                </h4>
                <div className="space-y-2">
                  {validation.warnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800"
                    >
                      {warning.message}
                      {warning.nodeIds && warning.nodeIds.length > 0 && (
                        <div className="mt-1 text-xs text-yellow-600">
                          Nodes: {warning.nodeIds.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Parallel execution groups */}
            {validation.parallelGroups && validation.parallelGroups.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-2">
                  <Info size={16} />
                  Parallel Execution Groups ({validation.parallelGroups.length})
                </h4>
                <div className="space-y-2">
                  {validation.parallelGroups.map((group, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800"
                    >
                      <div className="font-medium mb-1">Group {idx + 1}</div>
                      <div className="text-xs text-blue-600">
                        {group.length} nodes can execute in parallel
                      </div>
                      <div className="mt-1 text-xs text-blue-600">
                        {group.map(nodeId => {
                          const node = nodes.find(n => n.id === nodeId);
                          return node?.data.label || nodeId;
                        }).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success state */}
            {!hasErrors && !hasWarnings && (
              <div className="p-4 bg-green-50 border border-green-200 rounded text-sm text-green-800 text-center">
                <CheckCircle size={24} className="mx-auto mb-2" />
                <div className="font-medium">Workflow is valid</div>
                <div className="text-xs text-green-600 mt-1">
                  No errors or warnings detected
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
