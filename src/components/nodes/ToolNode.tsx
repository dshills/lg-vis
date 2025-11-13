import { Wrench } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { ToolNodeProps } from '../../types/nodeProps';

export function ToolNode({ data }: ToolNodeProps) {
  return (
    <BaseNode
      data={data}
      color="border-orange-400 shadow-orange-200"
      icon={<Wrench className="text-orange-600" size={22} />}
    >
      {data.toolName && (
        <div className="text-xs font-semibold bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 px-3 py-1.5 rounded-lg mt-2 inline-block border border-orange-200">
          {data.toolName}
        </div>
      )}
    </BaseNode>
  );
}
