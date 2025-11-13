import type { WorkflowNode, WorkflowEdge } from '../types/workflow';

export interface ValidationError {
  type: 'error' | 'warning';
  message: string;
  nodeIds?: string[];
  edgeIds?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  parallelGroups?: string[][];
}

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check for start node
  const startNodes = nodes.filter(n => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push({
      type: 'error',
      message: 'Workflow must have at least one start node',
    });
  } else if (startNodes.length > 1) {
    warnings.push({
      type: 'warning',
      message: 'Multiple start nodes detected. Only one will be used.',
      nodeIds: startNodes.map(n => n.id),
    });
  }

  // Check for end node
  const endNodes = nodes.filter(n => n.type === 'end');
  if (endNodes.length === 0) {
    warnings.push({
      type: 'warning',
      message: 'Workflow has no end node. It may run indefinitely.',
    });
  }

  // Check for cycles
  const cycles = detectCycles(nodes, edges);
  if (cycles.length > 0) {
    errors.push({
      type: 'error',
      message: `Detected ${cycles.length} cycle(s) in the workflow. Cycles are not allowed.`,
      nodeIds: cycles.flat(),
    });
  }

  // Check for disconnected nodes
  const disconnected = findDisconnectedNodes(nodes, edges);
  if (disconnected.length > 0) {
    warnings.push({
      type: 'warning',
      message: `Found ${disconnected.length} disconnected node(s)`,
      nodeIds: disconnected,
    });
  }

  // Check for unreachable nodes
  if (startNodes.length > 0) {
    const unreachable = findUnreachableNodes(nodes, edges, startNodes[0].id);
    if (unreachable.length > 0) {
      warnings.push({
        type: 'warning',
        message: `Found ${unreachable.length} unreachable node(s) from start`,
        nodeIds: unreachable,
      });
    }
  }

  // Check for nodes without outgoing edges (except end nodes)
  const deadEnds = nodes.filter(
    n => n.type !== 'end' && !edges.some(e => e.source === n.id)
  );
  if (deadEnds.length > 0) {
    warnings.push({
      type: 'warning',
      message: `Found ${deadEnds.length} node(s) without outgoing connections`,
      nodeIds: deadEnds.map(n => n.id),
    });
  }

  // Detect parallel execution groups
  const parallelGroups = detectParallelGroups(nodes, edges);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    parallelGroups,
  };
}

function detectCycles(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const path: string[] = [];

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const outgoingEdges = edges.filter(e => e.source === nodeId);
    for (const edge of outgoingEdges) {
      if (!visited.has(edge.target)) {
        if (dfs(edge.target)) {
          return true;
        }
      } else if (recursionStack.has(edge.target)) {
        // Found a cycle
        const cycleStart = path.indexOf(edge.target);
        cycles.push(path.slice(cycleStart));
        return true;
      }
    }

    recursionStack.delete(nodeId);
    path.pop();
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  }

  return cycles;
}

function findDisconnectedNodes(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] {
  return nodes
    .filter(node => {
      const hasIncoming = edges.some(e => e.target === node.id);
      const hasOutgoing = edges.some(e => e.source === node.id);
      return !hasIncoming && !hasOutgoing && node.type !== 'start';
    })
    .map(n => n.id);
}

function findUnreachableNodes(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  startNodeId: string
): string[] {
  const reachable = new Set<string>();
  const queue: string[] = [startNodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (reachable.has(current)) continue;

    reachable.add(current);

    const outgoingEdges = edges.filter(e => e.source === current);
    for (const edge of outgoingEdges) {
      if (!reachable.has(edge.target)) {
        queue.push(edge.target);
      }
    }
  }

  return nodes.filter(n => !reachable.has(n.id)).map(n => n.id);
}

export function detectParallelGroups(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): string[][] {
  const groups: string[][] = [];
  const processed = new Set<string>();

  // Find nodes that have multiple outgoing edges (fan-out points)
  const fanOutNodes = nodes.filter(
    n => edges.filter(e => e.source === n.id).length > 1
  );

  for (const fanOutNode of fanOutNodes) {
    const outgoingEdges = edges.filter(e => e.source === fanOutNode.id);
    const parallelNodes = outgoingEdges.map(e => e.target);

    // Check if these nodes converge at a common node (fan-in point)
    const convergencePoint = findConvergencePoint(parallelNodes, edges);

    if (convergencePoint && parallelNodes.length > 1) {
      const group = parallelNodes.filter(id => !processed.has(id));
      if (group.length > 1) {
        groups.push(group);
        group.forEach(id => processed.add(id));
      }
    }
  }

  return groups;
}

function findConvergencePoint(nodeIds: string[], edges: WorkflowEdge[]): string | null {
  // Find common descendants
  const descendants = nodeIds.map(id => findAllDescendants(id, edges));

  if (descendants.length === 0) return null;

  // Find intersection of all descendant sets
  const intersection = descendants[0].filter(desc =>
    descendants.every(set => set.includes(desc))
  );

  return intersection.length > 0 ? intersection[0] : null;
}

function findAllDescendants(nodeId: string, edges: WorkflowEdge[]): string[] {
  const descendants: string[] = [];
  const queue: string[] = [nodeId];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;

    visited.add(current);

    const outgoing = edges.filter(e => e.source === current);
    for (const edge of outgoing) {
      descendants.push(edge.target);
      queue.push(edge.target);
    }
  }

  return descendants;
}

export function getNodeDepth(nodeId: string, nodes: WorkflowNode[], edges: WorkflowEdge[]): number {
  const startNode = nodes.find(n => n.type === 'start');
  if (!startNode || nodeId === startNode.id) return 0;

  const depths = new Map<string, number>();
  depths.set(startNode.id, 0);

  const queue: string[] = [startNode.id];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;

    visited.add(current);
    const currentDepth = depths.get(current) || 0;

    const outgoing = edges.filter(e => e.source === current);
    for (const edge of outgoing) {
      const newDepth = currentDepth + 1;
      const existingDepth = depths.get(edge.target);

      if (existingDepth === undefined || newDepth < existingDepth) {
        depths.set(edge.target, newDepth);
      }

      queue.push(edge.target);
    }
  }

  return depths.get(nodeId) || -1;
}
