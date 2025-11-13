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
    <div className={`
      rounded-xl border-2 ${color} bg-gradient-to-br from-white to-gray-50
      shadow-lg hover:shadow-xl transition-all duration-300
      min-w-[220px] max-w-[320px] backdrop-blur-sm
      hover:scale-[1.02] cursor-pointer
    `}>
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-gradient-to-br !from-blue-400 !to-blue-600 !w-4 !h-4 !border-2 !border-white !shadow-md transition-transform hover:!scale-125"
        />
      )}

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {icon && (
            <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
              {icon}
            </div>
          )}
          <div className="font-bold text-gray-900 truncate text-base">{data.label}</div>
        </div>

        {data.description && (
          <div className="text-xs text-gray-600 mb-3 leading-relaxed">{data.description}</div>
        )}

        {children}
      </div>

      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-gradient-to-br !from-purple-400 !to-purple-600 !w-4 !h-4 !border-2 !border-white !shadow-md transition-transform hover:!scale-125"
        />
      )}
    </div>
  );
}
