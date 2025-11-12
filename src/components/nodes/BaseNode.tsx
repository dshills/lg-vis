import { Handle, Position } from 'reactflow';
import type { ReactNode } from 'react';

interface BaseNodeProps {
  data: {
    label: string;
    description?: string;
  };
  children?: ReactNode;
  color: string;
  icon?: ReactNode;
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
}

export function BaseNode({
  data,
  children,
  color,
  icon,
  showSourceHandle = true,
  showTargetHandle = true,
}: BaseNodeProps) {
  return (
    <div className={`rounded-lg border-2 ${color} bg-white shadow-md min-w-[200px] max-w-[300px]`}>
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
        />
      )}

      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className="font-semibold text-gray-800 truncate">{data.label}</div>
        </div>

        {data.description && (
          <div className="text-xs text-gray-600 mb-2">{data.description}</div>
        )}

        {children}
      </div>

      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
        />
      )}
    </div>
  );
}
