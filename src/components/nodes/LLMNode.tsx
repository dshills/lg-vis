import { Brain } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { LLMNodeProps } from '../../types/nodeProps';

export function LLMNode({ data }: LLMNodeProps) {
  return (
    <BaseNode
      data={data}
      color="border-purple-400 shadow-purple-200"
      icon={<Brain className="text-purple-600" size={22} />}
    >
      {data.provider && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <div className="text-xs font-semibold bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-200">
            {data.provider}
          </div>
          {data.model && (
            <div className="text-xs font-medium text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 truncate">
              {data.model}
            </div>
          )}
        </div>
      )}
    </BaseNode>
  );
}
