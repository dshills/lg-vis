import { Brain } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { LLMNodeProps } from '../../types/nodeProps';

export function LLMNode({ data }: LLMNodeProps) {
  return (
    <BaseNode
      data={data}
      color="border-purple-500"
      icon={<Brain className="text-purple-600" size={20} />}
    >
      {data.provider && (
        <div className="flex items-center gap-2 mt-2">
          <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
            {data.provider}
          </div>
          {data.model && (
            <div className="text-xs text-gray-600 truncate">{data.model}</div>
          )}
        </div>
      )}
    </BaseNode>
  );
}
