import { Code2 } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { FunctionNodeProps } from '../../types/nodeProps';

export function FunctionNode({ data }: FunctionNodeProps) {
  return (
    <BaseNode
      data={data}
      color="border-blue-400 shadow-blue-200"
      icon={<Code2 className="text-blue-600" size={22} />}
    >
      {data.functionCode && (
        <div className="text-xs text-gray-600 font-mono bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-lg mt-2 overflow-hidden border border-slate-200">
          {data.functionCode.substring(0, 50)}
          {data.functionCode.length > 50 && '...'}
        </div>
      )}
    </BaseNode>
  );
}
