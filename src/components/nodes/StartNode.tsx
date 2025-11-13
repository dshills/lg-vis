import { Play } from 'lucide-react';
import { BaseNode } from './BaseNode';
import type { StartNodeProps } from '../../types/nodeProps';

export function StartNode({ data }: StartNodeProps) {
  return (
    <BaseNode
      data={data}
      color="border-emerald-400 shadow-emerald-200"
      icon={<Play className="text-emerald-600" size={22} />}
      showTargetHandle={false}
    />
  );
}
