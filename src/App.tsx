import { useEffect, useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeEditorPanel } from './components/panels/NodeEditorPanel';
import { StateSchemaPanel } from './components/panels/StateSchemaPanel';
import { WorkflowToolbar } from './components/panels/WorkflowToolbar';
import { useWorkflowStore } from './store/workflowStore';
import { FileDown, FileUp, Save, Network, Workflow, Database } from 'lucide-react';

type Tab = 'workflow' | 'state';

function App() {
  const { workflow, createNewWorkflow, selectedNodeId } = useWorkflowStore();
  const [activeTab, setActiveTab] = useState<Tab>('workflow');

  useEffect(() => {
    // Initialize with a new workflow if none exists
    if (!workflow) {
      createNewWorkflow('My Workflow');
    }
  }, [workflow, createNewWorkflow]);

  const handleExport = () => {
    if (workflow) {
      const dataStr = JSON.stringify(workflow, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${workflow.name.replace(/\s+/g, '-')}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const workflow = JSON.parse(event.target?.result as string);
            useWorkflowStore.getState().setWorkflow(workflow);
          } catch {
            alert('Invalid workflow file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSave = () => {
    // Save to local storage
    if (workflow) {
      localStorage.setItem('lg-vis-workflow', JSON.stringify(workflow));
      alert('Workflow saved to local storage!');
    }
  };

  const handleGenerateCode = () => {
    // TODO: Implement code generation
    alert('Code generation coming soon!');
  };

  if (!workflow) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Network className="text-blue-600" size={28} />
            <div>
              <h1 className="text-xl font-bold text-gray-800">LangGraph-Go Workflow Builder</h1>
              <p className="text-sm text-gray-500">{workflow.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <WorkflowToolbar />
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Save size={18} />
              Save
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FileUp size={18} />
              Import
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FileDown size={18} />
              Export
            </button>
            <button
              onClick={handleGenerateCode}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FileDown size={18} />
              Generate Go Code
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex gap-1 px-6">
            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'workflow'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Workflow size={18} />
              Workflow
            </button>
            <button
              onClick={() => setActiveTab('state')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'state'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Database size={18} />
              State Schema
              {workflow.stateSchema.fields.length > 0 && (
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                  {workflow.stateSchema.fields.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 relative overflow-hidden">
          {activeTab === 'workflow' ? (
            <>
              <WorkflowCanvas />
              {selectedNodeId && <NodeEditorPanel />}
            </>
          ) : (
            <StateSchemaPanel />
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
