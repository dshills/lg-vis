import { Play } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { StartNodeProps } from '../../types/nodeProps';

export function StartNode({ data }: StartNodeProps) {
  return (
    <BaseNode
      data={data}
      color="border-green-500"
      icon={<Play className="text-green-600" size={20} />}
      showTargetHandle={false}
    />
  );
}
