import { Wrench } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { ToolNodeProps } from '../../types/nodeProps';

export function ToolNode({ data }: ToolNodeProps) {
  return (
    <BaseNode
      data={data}
      color="border-orange-500"
      icon={<Wrench className="text-orange-600" size={20} />}
    >
      {data.toolName && (
        <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded mt-2 inline-block">
          {data.toolName}
        </div>
      )}
    </BaseNode>
  );
}
