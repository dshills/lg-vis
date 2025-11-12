// React Flow node prop types
import type { NodeProps } from 'reactflow';

export interface BaseNodeData {
  label: string;
  description?: string;
}

export interface FunctionNodeData extends BaseNodeData {
  functionCode?: string;
  inputState?: string[];
  outputState?: string[];
}

export interface LLMNodeData extends BaseNodeData {
  provider?: 'openai' | 'anthropic' | 'google';
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  inputState?: string[];
  outputState?: string[];
}

export interface ToolNodeData extends BaseNodeData {
  toolName?: string;
  toolCode?: string;
  inputState?: string[];
  outputState?: string[];
}

export interface ConditionalNodeData extends BaseNodeData {
  predicateCode?: string;
  inputState?: string[];
}

// Node props types for each node type
export type StartNodeProps = NodeProps<BaseNodeData>;
export type EndNodeProps = NodeProps<BaseNodeData>;
export type FunctionNodeProps = NodeProps<FunctionNodeData>;
export type LLMNodeProps = NodeProps<LLMNodeData>;
export type ToolNodeProps = NodeProps<ToolNodeData>;
export type ConditionalNodeProps = NodeProps<ConditionalNodeData>;
