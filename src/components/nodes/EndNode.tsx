import { Square } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { EndNodeProps } from '../../types/nodeProps';

export function EndNode({ data }: EndNodeProps) {
  return (
    <BaseNode
      data={data}
      color="border-red-500"
      icon={<Square className="text-red-600" size={20} />}
      showSourceHandle={false}
    />
  );
}
