import { create } from 'zustand';
import { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import type { Connection, Edge, EdgeChange, Node, NodeChange } from 'reactflow';
import type { Workflow, StateSchema, Reducer, NodeType } from '../types/workflow';

interface WorkflowState {
  // Current workflow
  workflow: Workflow | null;

  // React Flow nodes and edges
  nodes: Node[];
  edges: Edge[];

  // Selected elements
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // Actions
  setWorkflow: (workflow: Workflow) => void;
  createNewWorkflow: (name: string) => void;

  // Node operations
  onNodesChange: (changes: NodeChange[]) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;

  // Edge operations
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  deleteEdge: (edgeId: string) => void;
  setSelectedEdge: (edgeId: string | null) => void;

  // State schema operations
  updateStateSchema: (schema: StateSchema) => void;
  addStateField: (name: string, type: string) => void;

  // Reducer operations
  updateReducer: (fieldName: string, reducer: Reducer) => void;
  removeReducer: (fieldName: string) => void;
}

const createDefaultWorkflow = (name: string): Workflow => ({
  id: crypto.randomUUID(),
  name,
  description: '',
  stateSchema: {
    fields: [],
  },
  reducers: {},
  nodes: [],
  edges: [],
  metadata: {
    version: '1.0.0',
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
});

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflow: null,
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,

  setWorkflow: (workflow) => {
    // Convert workflow nodes to React Flow nodes
    const rfNodes: Node[] = workflow.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    }));

    // Convert workflow edges to React Flow edges
    const rfEdges: Edge[] = workflow.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      label: edge.label,
      data: { condition: edge.condition },
    }));

    set({ workflow, nodes: rfNodes, edges: rfEdges });
  },

  createNewWorkflow: (name) => {
    const workflow = createDefaultWorkflow(name);
    set({ workflow, nodes: [], edges: [] });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  addNode: (type, position) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type,
      position,
      data: { label: `${type} node` },
    };

    set({
      nodes: [...get().nodes, newNode],
    });

    // Update workflow
    const { workflow } = get();
    if (workflow) {
      workflow.nodes.push({
        id: newNode.id,
        type: type as NodeType,
        position,
        data: newNode.data,
      });
      workflow.metadata.modified = new Date().toISOString();
      set({ workflow: { ...workflow } });
    }
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });

    // Update workflow
    const { workflow } = get();
    if (workflow) {
      const nodeIndex = workflow.nodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex !== -1) {
        workflow.nodes[nodeIndex].data = { ...workflow.nodes[nodeIndex].data, ...data };
        workflow.metadata.modified = new Date().toISOString();
        set({ workflow: { ...workflow } });
      }
    }
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });

    // Update workflow
    const { workflow } = get();
    if (workflow) {
      workflow.nodes = workflow.nodes.filter((n) => n.id !== nodeId);
      workflow.edges = workflow.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
      workflow.metadata.modified = new Date().toISOString();
      set({ workflow: { ...workflow } });
    }
  },

  setSelectedNode: (nodeId) => {
    set({ selectedNodeId: nodeId, selectedEdgeId: null });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    const edge: Edge = {
      id: crypto.randomUUID(),
      source: connection.source!,
      target: connection.target!,
      type: 'default',
    };

    set({
      edges: addEdge(edge, get().edges),
    });

    // Update workflow
    const { workflow } = get();
    if (workflow) {
      workflow.edges.push({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'default',
      });
      workflow.metadata.modified = new Date().toISOString();
      set({ workflow: { ...workflow } });
    }
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
    });

    // Update workflow
    const { workflow } = get();
    if (workflow) {
      workflow.edges = workflow.edges.filter((e) => e.id !== edgeId);
      workflow.metadata.modified = new Date().toISOString();
      set({ workflow: { ...workflow } });
    }
  },

  setSelectedEdge: (edgeId) => {
    set({ selectedEdgeId: edgeId, selectedNodeId: null });
  },

  updateStateSchema: (schema) => {
    const { workflow } = get();
    if (workflow) {
      workflow.stateSchema = schema;
      workflow.metadata.modified = new Date().toISOString();
      set({ workflow: { ...workflow } });
    }
  },

  addStateField: (name, type) => {
    const { workflow } = get();
    if (workflow) {
      workflow.stateSchema.fields.push({
        name,
        type,
        required: false,
      });
      workflow.metadata.modified = new Date().toISOString();
      set({ workflow: { ...workflow } });
    }
  },

  updateReducer: (fieldName, reducer) => {
    const { workflow } = get();
    if (workflow) {
      workflow.reducers[fieldName] = reducer;
      workflow.metadata.modified = new Date().toISOString();
      set({ workflow: { ...workflow } });
    }
  },

  removeReducer: (fieldName) => {
    const { workflow } = get();
    if (workflow && workflow.reducers[fieldName]) {
      const newReducers = { ...workflow.reducers };
      delete newReducers[fieldName];
      workflow.reducers = newReducers;
      workflow.metadata.modified = new Date().toISOString();
      set({ workflow: { ...workflow } });
    }
  },
}));
