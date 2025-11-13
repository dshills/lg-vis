import { useMemo, useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { validateWorkflow } from '../../lib/workflowValidation';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export function WorkflowToolbar() {
  const { workflow, nodes } = useWorkflowStore();
  const [showDetails, setShowDetails] = useState(false);

  const validation = useMemo(() => {
    if (!workflow) return null;
    return validateWorkflow(workflow.nodes, workflow.edges);
  }, [workflow]);

  if (!validation) return null;

  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg hover:scale-105 ${
          hasErrors
            ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700'
            : hasWarnings
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700'
            : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700'
        }`}
      >
        {hasErrors ? (
          <AlertCircle size={20} />
        ) : hasWarnings ? (
          <AlertTriangle size={20} />
        ) : (
          <CheckCircle size={20} />
        )}
        <span>
          {hasErrors ? 'Invalid' : hasWarnings ? 'Warnings' : 'Valid'}
        </span>
        {(hasErrors || hasWarnings) && (
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
            {validation.errors.length + validation.warnings.length}
          </span>
        )}
      </button>

      {showDetails && (
        <div className="absolute top-full right-0 mt-3 w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 z-50">
          <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-2xl">
            <h3 className="font-bold text-gray-900 text-lg">Workflow Validation</h3>
            <button
              onClick={() => setShowDetails(false)}
              className="p-2 hover:bg-white rounded-lg transition-all duration-200 hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-5 space-y-4">
            {/* Errors */}
            {validation.errors.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-red-700 mb-3">
                  <AlertCircle size={18} />
                  Errors ({validation.errors.length})
                </h4>
                <div className="space-y-2">
                  {validation.errors.map((error, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl text-sm text-red-900 shadow-sm"
                    >
                      <div className="font-semibold">{error.message}</div>
                      {error.nodeIds && error.nodeIds.length > 0 && (
                        <div className="mt-2 text-xs text-red-700 font-mono bg-red-100 px-2 py-1 rounded-lg inline-block">
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
                <h4 className="flex items-center gap-2 text-sm font-bold text-amber-700 mb-3">
                  <AlertTriangle size={18} />
                  Warnings ({validation.warnings.length})
                </h4>
                <div className="space-y-2">
                  {validation.warnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl text-sm text-amber-900 shadow-sm"
                    >
                      <div className="font-semibold">{warning.message}</div>
                      {warning.nodeIds && warning.nodeIds.length > 0 && (
                        <div className="mt-2 text-xs text-amber-700 font-mono bg-amber-100 px-2 py-1 rounded-lg inline-block">
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
                <h4 className="flex items-center gap-2 text-sm font-bold text-blue-700 mb-3">
                  <Info size={18} />
                  Parallel Execution Groups ({validation.parallelGroups.length})
                </h4>
                <div className="space-y-2">
                  {validation.parallelGroups.map((group, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl text-sm text-blue-900 shadow-sm"
                    >
                      <div className="font-bold mb-2">Group {idx + 1}</div>
                      <div className="text-xs text-blue-700 mb-2 font-semibold">
                        {group.length} nodes can execute in parallel
                      </div>
                      <div className="text-xs text-blue-700 font-mono bg-blue-100 px-2 py-1.5 rounded-lg">
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
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl text-sm text-emerald-900 text-center shadow-sm">
                <CheckCircle size={32} className="mx-auto mb-3 text-emerald-600" />
                <div className="font-bold text-base">Workflow is valid</div>
                <div className="text-xs text-emerald-700 mt-2">
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
