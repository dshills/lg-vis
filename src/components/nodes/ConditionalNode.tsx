import { GitBranch } from 'lucide-react';
import { Handle, Position } from 'reactflow';
import type { ConditionalNodeProps } from '../../types/nodeProps';

export function ConditionalNode({ data }: ConditionalNodeProps) {
  return (
    <div className="
      rounded-xl border-2 border-pink-400 shadow-pink-200 bg-gradient-to-br from-white to-gray-50
      shadow-lg hover:shadow-xl transition-all duration-300
      min-w-[220px] max-w-[320px] backdrop-blur-sm
      hover:scale-[1.02] cursor-pointer relative
    ">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gradient-to-br !from-blue-400 !to-blue-600 !w-4 !h-4 !border-2 !border-white !shadow-md transition-transform hover:!scale-125"
      />

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
            <GitBranch className="text-pink-600" size={22} />
          </div>
          <div className="font-bold text-gray-900 truncate text-base">{data.label}</div>
        </div>

        {data.description && (
          <div className="text-xs text-gray-600 mb-3 leading-relaxed">{data.description}</div>
        )}

        {data.predicateCode && (
          <div className="text-xs text-gray-600 font-mono bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-lg mt-2 overflow-hidden border border-slate-200">
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
        className="!bg-gradient-to-br !from-emerald-400 !to-emerald-600 !w-4 !h-4 !border-2 !border-white !shadow-md !left-[30%] transition-transform hover:!scale-125"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="!bg-gradient-to-br !from-rose-400 !to-rose-600 !w-4 !h-4 !border-2 !border-white !shadow-md !left-[70%] transition-transform hover:!scale-125"
      />
    </div>
  );
}
