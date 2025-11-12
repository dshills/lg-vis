import { Square } from 'lucide-react';
import { BaseNode } from './BaseNode';

export function EndNode({ data }: any) {
  return (
    <BaseNode
      data={data}
      color="border-red-500"
      icon={<Square className="text-red-600" size={20} />}
      showSourceHandle={false}
    />
  );
}
