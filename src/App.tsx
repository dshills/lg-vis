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
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <Network className="text-blue-300" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white bg-clip-text">LangGraph-Go Workflow Builder</h1>
              <p className="text-sm text-blue-200 font-medium">{workflow.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <WorkflowToolbar />
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
            >
              <Save size={18} />
              Save
            </button>
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
            >
              <FileUp size={18} />
              Import
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20 hover:scale-105"
            >
              <FileDown size={18} />
              Export
            </button>
            <button
              onClick={handleGenerateCode}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
            >
              <FileDown size={18} />
              Generate Go Code
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="flex gap-2 px-6">
            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center gap-2 px-5 py-3 border-b-3 transition-all duration-200 ${
                activeTab === 'workflow'
                  ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Workflow size={20} />
              Workflow
            </button>
            <button
              onClick={() => setActiveTab('state')}
              className={`flex items-center gap-2 px-5 py-3 border-b-3 transition-all duration-200 ${
                activeTab === 'state'
                  ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Database size={20} />
              State Schema
              {workflow.stateSchema.fields.length > 0 && (
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm">
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
