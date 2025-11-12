import { Code2 } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { FunctionNodeProps } from '../../types/nodeProps';

export function FunctionNode({ data }: FunctionNodeProps) {
  return (
    <BaseNode
      data={data}
      color="border-blue-500"
      icon={<Code2 className="text-blue-600" size={20} />}
    >
      {data.functionCode && (
        <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded mt-2 overflow-hidden">
          {data.functionCode.substring(0, 50)}
          {data.functionCode.length > 50 && '...'}
        </div>
      )}
    </BaseNode>
  );
}
