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

    // Update workflow immutably
    const { workflow } = get();
    if (workflow) {
      set({
        workflow: {
          ...workflow,
          nodes: [
            ...workflow.nodes,
            {
              id: newNode.id,
              type: type as NodeType,
              position,
              data: newNode.data,
            },
          ],
          metadata: {
            ...workflow.metadata,
            modified: new Date().toISOString(),
          },
        },
      });
    }
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });

    // Update workflow immutably
    const { workflow } = get();
    if (workflow) {
      const nodeIndex = workflow.nodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex !== -1) {
        set({
          workflow: {
            ...workflow,
            nodes: workflow.nodes.map((node, idx) =>
              idx === nodeIndex
                ? { ...node, data: { ...node.data, ...data } }
                : node
            ),
            metadata: {
              ...workflow.metadata,
              modified: new Date().toISOString(),
            },
          },
        });
      }
    }
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });

    // Update workflow immutably
    const { workflow } = get();
    if (workflow) {
      set({
        workflow: {
          ...workflow,
          nodes: workflow.nodes.filter((n) => n.id !== nodeId),
          edges: workflow.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
          metadata: {
            ...workflow.metadata,
            modified: new Date().toISOString(),
          },
        },
      });
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

    // Update workflow immutably
    const { workflow } = get();
    if (workflow) {
      set({
        workflow: {
          ...workflow,
          edges: [
            ...workflow.edges,
            {
              id: edge.id,
              source: edge.source,
              target: edge.target,
              type: 'default',
            },
          ],
          metadata: {
            ...workflow.metadata,
            modified: new Date().toISOString(),
          },
        },
      });
    }
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
    });

    // Update workflow immutably
    const { workflow } = get();
    if (workflow) {
      set({
        workflow: {
          ...workflow,
          edges: workflow.edges.filter((e) => e.id !== edgeId),
          metadata: {
            ...workflow.metadata,
            modified: new Date().toISOString(),
          },
        },
      });
    }
  },

  setSelectedEdge: (edgeId) => {
    set({ selectedEdgeId: edgeId, selectedNodeId: null });
  },

  updateStateSchema: (schema) => {
    const { workflow } = get();
    if (workflow) {
      set({
        workflow: {
          ...workflow,
          stateSchema: schema,
          metadata: {
            ...workflow.metadata,
            modified: new Date().toISOString(),
          },
        },
      });
    }
  },

  addStateField: (name, type) => {
    const { workflow } = get();
    if (workflow) {
      set({
        workflow: {
          ...workflow,
          stateSchema: {
            ...workflow.stateSchema,
            fields: [
              ...workflow.stateSchema.fields,
              {
                name,
                type,
                required: false,
              },
            ],
          },
          metadata: {
            ...workflow.metadata,
            modified: new Date().toISOString(),
          },
        },
      });
    }
  },

  updateReducer: (fieldName, reducer) => {
    const { workflow } = get();
    if (workflow) {
      set({
        workflow: {
          ...workflow,
          reducers: {
            ...workflow.reducers,
            [fieldName]: reducer,
          },
          metadata: {
            ...workflow.metadata,
            modified: new Date().toISOString(),
          },
        },
      });
    }
  },

  removeReducer: (fieldName) => {
    const { workflow } = get();
    if (workflow && workflow.reducers[fieldName]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [fieldName]: _removed, ...remainingReducers } = workflow.reducers;
      set({
        workflow: {
          ...workflow,
          reducers: remainingReducers,
          metadata: {
            ...workflow.metadata,
            modified: new Date().toISOString(),
          },
        },
      });
    }
  },
}));
