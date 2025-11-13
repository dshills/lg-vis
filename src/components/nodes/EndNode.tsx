import { Square } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { EndNodeProps } from '../../types/nodeProps';

export function EndNode({ data }: EndNodeProps) {
  return (
    <BaseNode
      data={data}
      color="border-rose-400 shadow-rose-200"
      icon={<Square className="text-rose-600" size={22} />}
      showSourceHandle={false}
    />
  );
}
