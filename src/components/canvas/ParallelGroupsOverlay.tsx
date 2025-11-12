import { useMemo } from 'react';
import { useReactFlow } from 'reactflow';
import { useWorkflowStore } from '../../store/workflowStore';
import { detectParallelGroups } from '../../lib/workflowValidation';

const GROUP_COLORS = [
  'rgba(59, 130, 246, 0.1)', // blue
  'rgba(139, 92, 246, 0.1)', // purple
  'rgba(236, 72, 153, 0.1)', // pink
  'rgba(251, 146, 60, 0.1)', // orange
  'rgba(34, 197, 94, 0.1)', // green
];

const GROUP_BORDER_COLORS = [
  'rgba(59, 130, 246, 0.4)',
  'rgba(139, 92, 246, 0.4)',
  'rgba(236, 72, 153, 0.4)',
  'rgba(251, 146, 60, 0.4)',
  'rgba(34, 197, 94, 0.4)',
];

// Default dimensions for nodes that haven't been measured yet
const DEFAULT_NODE_WIDTH = 250;
const DEFAULT_NODE_HEIGHT = 100;
const BOUNDING_BOX_PADDING = 20;

export function ParallelGroupsOverlay() {
  const { workflow } = useWorkflowStore();
  const { getNodes } = useReactFlow();

  const groups = useMemo(() => {
    if (!workflow) return [];
    return detectParallelGroups(workflow.nodes, workflow.edges);
  }, [workflow]);

  if (groups.length === 0) return null;

  const rfNodes = getNodes();

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {groups.map((group, groupIdx) => {
        // Find nodes in this group
        const groupNodes = rfNodes.filter(n => group.includes(n.id));
        if (groupNodes.length === 0) return null;

        // Calculate bounding box using actual node dimensions or defaults
        const minX = Math.min(...groupNodes.map(n => n.position.x)) - BOUNDING_BOX_PADDING;
        const minY = Math.min(...groupNodes.map(n => n.position.y)) - BOUNDING_BOX_PADDING;
        const maxX = Math.max(...groupNodes.map(n => {
          const nodeWidth = n.width ?? DEFAULT_NODE_WIDTH;
          return n.position.x + nodeWidth;
        })) + BOUNDING_BOX_PADDING;
        const maxY = Math.max(...groupNodes.map(n => {
          const nodeHeight = n.height ?? DEFAULT_NODE_HEIGHT;
          return n.position.y + nodeHeight;
        })) + BOUNDING_BOX_PADDING;

        const width = maxX - minX;
        const height = maxY - minY;

        return (
          <div
            key={groupIdx}
            className="absolute rounded-lg border-2 border-dashed"
            style={{
              left: minX,
              top: minY,
              width,
              height,
              backgroundColor: GROUP_COLORS[groupIdx % GROUP_COLORS.length],
              borderColor: GROUP_BORDER_COLORS[groupIdx % GROUP_BORDER_COLORS.length],
            }}
          >
            <div
              className="absolute -top-3 left-2 px-2 py-0.5 rounded text-xs font-medium pointer-events-auto"
              style={{
                backgroundColor: GROUP_BORDER_COLORS[groupIdx % GROUP_BORDER_COLORS.length],
                color: 'white',
              }}
            >
              Parallel Group {groupIdx + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
}
