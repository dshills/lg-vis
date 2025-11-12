// Core LangGraph-Go workflow types

export type NodeType =
  | 'start'
  | 'end'
  | 'function'
  | 'llm'
  | 'tool'
  | 'conditional';

export interface Position {
  x: number;
  y: number;
}

// State configuration
export interface StateField {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface StateSchema {
  fields: StateField[];
}

// Reducer function configuration
export interface Reducer {
  type: 'append' | 'overwrite' | 'merge' | 'custom';
  customCode?: string;
}

// Node data structures
export interface BaseNodeData {
  label: string;
  description?: string;
}

export interface FunctionNodeData extends BaseNodeData {
  functionCode: string;
  inputState: string[];
  outputState: string[];
}

export interface LLMNodeData extends BaseNodeData {
  provider: 'openai' | 'anthropic' | 'google';
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  inputState: string[];
  outputState: string[];
}

export interface ToolNodeData extends BaseNodeData {
  toolName: string;
  toolCode: string;
  inputState: string[];
  outputState: string[];
}

export interface ConditionalNodeData extends BaseNodeData {
  predicateCode: string;
  inputState: string[];
}

export type NodeData =
  | BaseNodeData
  | FunctionNodeData
  | LLMNodeData
  | ToolNodeData
  | ConditionalNodeData;

// Workflow node
export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: Position;
  data: NodeData;
}

// Edge types
export type EdgeType = 'default' | 'conditional';

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
  condition?: string; // For conditional edges
}

// Complete workflow definition
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  stateSchema: StateSchema;
  reducers: Record<string, Reducer>;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata: {
    version: string;
    created: string;
    modified: string;
  };
}

// Execution configuration
export interface ExecutionConfig {
  enableCheckpointing: boolean;
  parallelExecution: boolean;
  timeout?: number;
}
