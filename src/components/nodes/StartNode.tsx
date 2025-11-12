import { Play } from 'lucide-react';
import { BaseNode } from './BaseNode';

export function StartNode({ data }: any) {
  return (
    <BaseNode
      data={data}
      color="border-green-500"
      icon={<Play className="text-green-600" size={20} />}
      showTargetHandle={false}
    />
  );
}
