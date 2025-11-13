import { GitBranch } from 'lucide-react';
import { Handle, Position } from 'reactflow';
import type { ConditionalNodeProps } from '../../types/nodeProps';

export function ConditionalNode({ data }: ConditionalNodeProps) {
  return (
    <div className="rounded-lg border-2 border-pink-500 bg-white shadow-md min-w-[200px] max-w-[300px] relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
      />

      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="text-pink-600" size={20} />
          <div className="font-semibold text-gray-800 truncate">{data.label}</div>
        </div>

        {data.description && (
          <div className="text-xs text-gray-600 mb-2">{data.description}</div>
        )}

        {data.predicateCode && (
          <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded mt-2 overflow-hidden">
            {data.predicateCode.substring(0, 50)}
            {data.predicateCode.length > 50 && '...'}
          </div>
        )}
      </div>

      {/* Multiple output handles for conditional branching */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-white !left-[30%]"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="!bg-red-500 !w-3 !h-3 !border-2 !border-white !left-[70%]"
      />
    </div>
  );
}
