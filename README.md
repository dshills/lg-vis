# LangGraph-Go Workflow Builder

A visual workflow builder for creating and managing [langgraph-go](https://github.com/dshills/langgraph-go) workflows. Build stateful, graph-based AI/LLM workflows with an intuitive drag-and-drop interface.

## Features

### Phase 1 - Foundation & Core Functionality
- ✅ **Visual Workflow Canvas**: Interactive drag-and-drop workflow builder powered by React Flow
- ✅ **Custom Node Types**:
  - **Start Node**: Entry point for workflows
  - **Function Node**: Custom Go functions with code editor
  - **LLM Node**: AI model integrations (OpenAI, Anthropic, Google)
  - **Tool Node**: External tool integrations
  - **Conditional Node**: Branch logic with predicate functions
  - **End Node**: Workflow exit points
- ✅ **Node Editor Panel**: Configure node properties, code, and settings
- ✅ **Workflow Management**: Save, load, import, and export workflows
- ✅ **Type-Safe State Management**: Zustand-powered state with TypeScript

### Phase 2 (Current) - Workflow Features
- ✅ **State Schema Editor**: Visual editor to define workflow state structure
  - Add/remove state fields with Go types (string, int, []string, map, etc.)
  - Mark fields as required
  - Add descriptions to fields
- ✅ **Reducer Configuration**: Configure how state fields merge
  - Overwrite strategy (replace with new value)
  - Append strategy (add to arrays/slices)
  - Merge strategy (deep merge for maps)
  - Custom reducer code for complex logic
- ✅ **Workflow Validation**: Real-time validation with detailed error/warning messages
  - Cycle detection (prevents infinite loops)
  - Disconnected node detection
  - Unreachable node detection
  - Missing start/end node warnings
  - Dead-end detection
- ✅ **Parallel Execution Groups**: Automatic detection and visualization
  - Visual overlay showing nodes that can execute in parallel
  - Grouped bounding boxes with color coding
  - Toggle on/off for cleaner view
- ✅ **Validation Toolbar**: Real-time status indicator
  - Shows workflow validity (Valid/Warnings/Invalid)
  - Expandable details panel with all issues
  - Lists parallel execution opportunities

### Upcoming Features
- 🚧 **Go Code Generation**: Export workflows as runnable langgraph-go code
- 🚧 **Workflow Simulation**: Dry-run and debug workflows
- 🚧 **Checkpoint Visualization**: View and manage workflow checkpoints
- 🚧 **Example Gallery**: Pre-built workflow templates
- 🚧 **Auto-layout**: Automatically arrange nodes for optimal readability

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Canvas**: React Flow
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Creating a Workflow

1. Click the **"Add Node"** button in the top-left corner
2. Select a node type from the menu
3. Click on a node to edit its properties in the right panel
4. Connect nodes by dragging from one handle to another
5. Configure each node with the appropriate settings

### Node Types

#### Start Node
- Entry point for your workflow
- Only one connection point (output)
- No configuration needed

#### Function Node
- Execute custom Go functions
- Configure:
  - Function code (Go syntax)
  - Input state fields
  - Output state fields

#### LLM Node
- Call AI models for text generation
- Configure:
  - Provider (OpenAI, Anthropic, Google)
  - Model name
  - System prompt
  - Temperature
  - Max tokens

#### Tool Node
- Integrate external tools
- Configure:
  - Tool name
  - Tool implementation code
  - Input/output state

#### Conditional Node
- Branch workflow based on conditions
- Configure:
  - Predicate function (returns true/false)
  - Two output handles: true (green) and false (red)

#### End Node
- Exit point for workflow
- Only one connection point (input)
- No configuration needed

### Managing State Schema

The State Schema tab allows you to define the structure of your workflow's state:

1. Click the **"State Schema"** tab at the top
2. Click **"Add Field"** to create a new state field
3. Enter the field name and select the Go type
4. Click on a field to expand its details:
   - Change the type
   - Add a description
   - Mark as required
   - Configure the reducer strategy:
     - **Overwrite**: Replace the old value with new (default)
     - **Append**: Add to existing arrays/slices
     - **Merge**: Deep merge for maps/objects
     - **Custom**: Write your own reducer function in Go

### Workflow Validation

The validation toolbar in the header shows real-time workflow status:

- **Green (Valid)**: No errors or warnings
- **Yellow (Warnings)**: Workflow will run but has potential issues
- **Red (Invalid)**: Workflow has errors that must be fixed

Click the validation button to see detailed information about:
- Errors (must fix): Cycles, invalid structure
- Warnings (optional): Disconnected nodes, unreachable nodes, missing end nodes
- Parallel execution groups detected

### Parallel Execution Groups

The workflow builder automatically detects nodes that can run in parallel:

1. Toggle **"Parallel Groups"** button in the top-left to show/hide
2. Parallel nodes are highlighted with colored bounding boxes
3. Each group shows how many nodes can execute concurrently
4. View all groups in the validation toolbar details

### Saving and Loading

- **Save**: Saves workflow to browser local storage
- **Export**: Download workflow as JSON file
- **Import**: Load workflow from JSON file

### Keyboard Shortcuts

- **Delete**: Remove selected node
- **Escape**: Deselect node
- **Mouse Wheel**: Zoom in/out
- **Click + Drag**: Pan canvas

## Project Structure

```
src/
├── components/
│   ├── canvas/
│   │   └── WorkflowCanvas.tsx    # Main canvas component
│   ├── nodes/                     # Custom node components
│   │   ├── StartNode.tsx
│   │   ├── EndNode.tsx
│   │   ├── FunctionNode.tsx
│   │   ├── LLMNode.tsx
│   │   ├── ToolNode.tsx
│   │   └── ConditionalNode.tsx
│   └── panels/
│       └── NodeEditorPanel.tsx    # Node property editor
├── store/
│   └── workflowStore.ts           # Zustand state management
├── types/
│   └── workflow.ts                # TypeScript type definitions
├── App.tsx                        # Main application
└── main.tsx                       # Entry point
```

## Development

### Adding New Node Types

1. Define the node type in `src/types/workflow.ts`
2. Create a new node component in `src/components/nodes/`
3. Register the node in `WorkflowCanvas.tsx`
4. Add editor fields in `NodeEditorPanel.tsx`

### State Management

The application uses Zustand for state management. The main store is in `src/store/workflowStore.ts` and manages:
- Workflow data
- React Flow nodes and edges
- Selected elements
- Node and edge operations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Related Projects

- [langgraph-go](https://github.com/dshills/langgraph-go) - The Go framework this tool generates code for
- [React Flow](https://reactflow.dev/) - The workflow canvas library

## Roadmap

### Phase 2 - Workflow Features
- State schema visual editor
- Reducer function configuration
- Parallel execution groups
- Route validation and cycle detection

### Phase 3 - Code Generation
- Export to Go code
- Generate complete langgraph-go projects
- Configuration file generation

### Phase 4 - Advanced Features
- Workflow simulation and debugging
- Checkpoint visualization
- Execution history replay
- Tutorial and example workflows
