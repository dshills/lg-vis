import { useWorkflowStore } from '../../store/workflowStore';
import { X, Trash2 } from 'lucide-react';

export function NodeEditorPanel() {
  const { nodes, selectedNodeId, setSelectedNode, updateNodeData, deleteNode } = useWorkflowStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return null;
  }

  const handleClose = () => {
    setSelectedNode(null);
  };

  const handleDelete = () => {
    if (selectedNodeId) {
      deleteNode(selectedNodeId);
      setSelectedNode(null);
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(selectedNode.id, { label: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(selectedNode.id, { description: e.target.value });
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Edit Node</h2>
          <p className="text-sm text-gray-500 capitalize">{selectedNode.type} node</p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={selectedNode.data.label || ''}
            onChange={handleLabelChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Node label"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={selectedNode.data.description || ''}
            onChange={handleDescriptionChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Optional description"
          />
        </div>

        {/* Type-specific fields */}
        {selectedNode.type === 'function' && <FunctionNodeFields node={selectedNode} />}
        {selectedNode.type === 'llm' && <LLMNodeFields node={selectedNode} />}
        {selectedNode.type === 'tool' && <ToolNodeFields node={selectedNode} />}
        {selectedNode.type === 'conditional' && <ConditionalNodeFields node={selectedNode} />}

        {/* Node ID */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Node ID
          </label>
          <div className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded">
            {selectedNode.id}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          <Trash2 size={18} />
          Delete Node
        </button>
      </div>
    </div>
  );
}

// Type-specific field components
function FunctionNodeFields({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(node.id, { functionCode: e.target.value });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Function Code
      </label>
      <textarea
        value={node.data.functionCode || ''}
        onChange={handleCodeChange}
        rows={10}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
        placeholder="func(ctx context.Context, state S) (S, error) {&#10;  // Your code here&#10;  return state, nil&#10;}"
      />
    </div>
  );
}

function LLMNodeFields({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Provider
        </label>
        <select
          value={node.data.provider || 'openai'}
          onChange={(e) => updateNodeData(node.id, { provider: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="google">Google</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model
        </label>
        <input
          type="text"
          value={node.data.model || ''}
          onChange={(e) => updateNodeData(node.id, { model: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="gpt-4, claude-3-opus, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          System Prompt
        </label>
        <textarea
          value={node.data.systemPrompt || ''}
          onChange={(e) => updateNodeData(node.id, { systemPrompt: e.target.value })}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="System prompt for the LLM..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperature
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={node.data.temperature || 0.7}
            onChange={(e) => updateNodeData(node.id, { temperature: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Tokens
          </label>
          <input
            type="number"
            value={node.data.maxTokens || 1000}
            onChange={(e) => updateNodeData(node.id, { maxTokens: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

function ToolNodeFields({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tool Name
        </label>
        <input
          type="text"
          value={node.data.toolName || ''}
          onChange={(e) => updateNodeData(node.id, { toolName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tool identifier"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tool Code
        </label>
        <textarea
          value={node.data.toolCode || ''}
          onChange={(e) => updateNodeData(node.id, { toolCode: e.target.value })}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
          placeholder="// Tool implementation"
        />
      </div>
    </div>
  );
}

function ConditionalNodeFields({ node }: { node: any }) {
  const { updateNodeData } = useWorkflowStore();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Predicate Code
      </label>
      <textarea
        value={node.data.predicateCode || ''}
        onChange={(e) => updateNodeData(node.id, { predicateCode: e.target.value })}
        rows={10}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
        placeholder="func(state S) bool {&#10;  // Return true or false&#10;  return true&#10;}"
      />
      <p className="text-xs text-gray-500 mt-1">
        Return true for the left branch, false for the right branch
      </p>
    </div>
  );
}
