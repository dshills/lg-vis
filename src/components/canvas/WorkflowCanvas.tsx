import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import { Plus } from 'lucide-react';
import {
  StartNode,
  EndNode,
  FunctionNode,
  LLMNode,
  ToolNode,
  ConditionalNode,
} from '../nodes';

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  function: FunctionNode,
  llm: LLMNode,
  tool: ToolNode,
  conditional: ConditionalNode,
};

export function WorkflowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    addNode,
  } = useWorkflowStore();

  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const reactFlowInstance = useReactFlow();

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setShowNodeMenu(false);
  }, [setSelectedNode]);

  const handleAddNodeClick = useCallback(
    (event: React.MouseEvent) => {
      const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
      setMenuPosition({ x: bounds.right + 10, y: bounds.top });
      setShowNodeMenu(!showNodeMenu);
    },
    [showNodeMenu]
  );

  const handleNodeTypeSelect = useCallback(
    (type: string) => {
      // Get center of viewport
      const { x, y, zoom } = reactFlowInstance.getViewport();
      const centerX = (window.innerWidth / 2 - x) / zoom;
      const centerY = (window.innerHeight / 2 - y) / zoom;

      addNode(type, { x: centerX, y: centerY });
      setShowNodeMenu(false);
    },
    [addNode, reactFlowInstance]
  );

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'start':
                return '#22c55e';
              case 'end':
                return '#ef4444';
              case 'function':
                return '#3b82f6';
              case 'llm':
                return '#8b5cf6';
              case 'tool':
                return '#f59e0b';
              case 'conditional':
                return '#ec4899';
              default:
                return '#6b7280';
            }
          }}
          className="bg-white border border-gray-200"
        />
        <Panel position="top-left" className="bg-white rounded-lg shadow-lg p-2">
          <button
            onClick={handleAddNodeClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Node
          </button>
        </Panel>
      </ReactFlow>

      {/* Node type menu */}
      {showNodeMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          <div className="flex flex-col gap-1 min-w-[200px]">
            <button
              onClick={() => handleNodeTypeSelect('start')}
              className="px-4 py-2 text-left hover:bg-green-50 rounded-md transition-colors"
            >
              <div className="font-semibold text-green-700">Start Node</div>
              <div className="text-xs text-gray-600">Entry point</div>
            </button>
            <button
              onClick={() => handleNodeTypeSelect('function')}
              className="px-4 py-2 text-left hover:bg-blue-50 rounded-md transition-colors"
            >
              <div className="font-semibold text-blue-700">Function Node</div>
              <div className="text-xs text-gray-600">Custom logic</div>
            </button>
            <button
              onClick={() => handleNodeTypeSelect('llm')}
              className="px-4 py-2 text-left hover:bg-purple-50 rounded-md transition-colors"
            >
              <div className="font-semibold text-purple-700">LLM Node</div>
              <div className="text-xs text-gray-600">AI model call</div>
            </button>
            <button
              onClick={() => handleNodeTypeSelect('tool')}
              className="px-4 py-2 text-left hover:bg-orange-50 rounded-md transition-colors"
            >
              <div className="font-semibold text-orange-700">Tool Node</div>
              <div className="text-xs text-gray-600">External tool</div>
            </button>
            <button
              onClick={() => handleNodeTypeSelect('conditional')}
              className="px-4 py-2 text-left hover:bg-pink-50 rounded-md transition-colors"
            >
              <div className="font-semibold text-pink-700">Conditional Node</div>
              <div className="text-xs text-gray-600">Branch logic</div>
            </button>
            <button
              onClick={() => handleNodeTypeSelect('end')}
              className="px-4 py-2 text-left hover:bg-red-50 rounded-md transition-colors"
            >
              <div className="font-semibold text-red-700">End Node</div>
              <div className="text-xs text-gray-600">Exit point</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
