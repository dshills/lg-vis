import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Plus, Trash2, Database, AlertCircle } from 'lucide-react';
import type { StateField } from '../../types/workflow';

// Validates Go identifier naming rules
function isValidGoIdentifier(name: string): boolean {
  if (!name) return false;
  // Must start with letter or underscore
  // Can contain letters, digits, and underscores
  const goIdentifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return goIdentifierRegex.test(name);
}

export function StateSchemaPanel() {
  const { workflow, updateStateSchema, addStateField, updateReducer, removeReducer } = useWorkflowStore();
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('string');
  const [fieldError, setFieldError] = useState('');

  if (!workflow) return null;

  const handleFieldNameChange = (value: string) => {
    setNewFieldName(value);
    setFieldError(''); // Clear error when user types
  };

  const validateFieldName = (name: string): string | null => {
    const trimmedName = name.trim();

    // Check if empty
    if (!trimmedName) {
      return 'Field name cannot be empty';
    }

    // Check for valid Go identifier
    if (!isValidGoIdentifier(trimmedName)) {
      return 'Field name must be a valid Go identifier (start with letter/underscore, contain only letters, digits, and underscores)';
    }

    // Check for duplicates
    if (workflow.stateSchema.fields.some(f => f.name === trimmedName)) {
      return 'Field name already exists';
    }

    // Check for Go reserved keywords
    const goKeywords = [
      'break', 'case', 'chan', 'const', 'continue', 'default', 'defer',
      'else', 'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import',
      'interface', 'map', 'package', 'range', 'return', 'select', 'struct',
      'switch', 'type', 'var',
    ];
    if (goKeywords.includes(trimmedName.toLowerCase())) {
      return 'Field name cannot be a Go reserved keyword';
    }

    return null;
  };

  const handleAddField = () => {
    const error = validateFieldName(newFieldName);
    if (error) {
      setFieldError(error);
      return;
    }

    addStateField(newFieldName.trim(), newFieldType);
    setNewFieldName('');
    setNewFieldType('string');
    setFieldError('');
  };

  const handleRemoveField = (fieldName: string) => {
    const updatedFields = workflow.stateSchema.fields.filter(f => f.name !== fieldName);
    updateStateSchema({ fields: updatedFields });

    // Remove associated reducer
    removeReducer(fieldName);
  };

  const handleToggleRequired = (fieldName: string) => {
    const updatedFields = workflow.stateSchema.fields.map(f =>
      f.name === fieldName ? { ...f, required: !f.required } : f
    );
    updateStateSchema({ fields: updatedFields });
  };

  const handleUpdateFieldType = (fieldName: string, type: string) => {
    const updatedFields = workflow.stateSchema.fields.map(f =>
      f.name === fieldName ? { ...f, type } : f
    );
    updateStateSchema({ fields: updatedFields });
  };

  const handleUpdateDescription = (fieldName: string, description: string) => {
    const updatedFields = workflow.stateSchema.fields.map(f =>
      f.name === fieldName ? { ...f, description } : f
    );
    updateStateSchema({ fields: updatedFields });
  };

  const handleUpdateReducer = (fieldName: string, reducerType: 'append' | 'overwrite' | 'merge' | 'custom') => {
    updateReducer(fieldName, { type: reducerType });
  };

  const handleUpdateCustomReducer = (fieldName: string, code: string) => {
    const currentReducer = workflow.reducers[fieldName] || { type: 'overwrite' as const };
    updateReducer(fieldName, { ...currentReducer, customCode: code });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <Database className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">State Schema</h2>
            <p className="text-sm text-gray-600 font-medium">Define workflow state structure</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Add new field */}
        <div className="mb-6 p-5 bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-blue-200 shadow-lg">
          <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-blue-600" />
            Add State Field
          </h3>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => handleFieldNameChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddField()}
                placeholder="Field name (e.g., userInput, messageCount)"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 font-medium ${
                  fieldError
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-gray-200 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white'
                }`}
              />
              {fieldError && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
                  <AlertCircle size={16} />
                  <span className="font-medium">{fieldError}</span>
                </div>
              )}
            </div>
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer font-medium"
            >
              <option value="string">string</option>
              <option value="int">int</option>
              <option value="float64">float64</option>
              <option value="bool">bool</option>
              <option value="[]string">[]string</option>
              <option value="[]int">[]int</option>
              <option value="map[string]string">map[string]string</option>
              <option value="map[string]interface{}">map[string]interface{}</option>
              <option value="interface{}">interface{}</option>
            </select>
            <button
              onClick={handleAddField}
              disabled={!newFieldName.trim()}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <Plus size={20} />
              Add Field
            </button>
          </div>
        </div>

        {/* Field list */}
        <div className="space-y-4">
          {workflow.stateSchema.fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300">
              <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl w-fit mx-auto mb-4">
                <Database size={56} className="opacity-40" />
              </div>
              <p className="text-lg font-semibold text-gray-700">No state fields defined yet</p>
              <p className="text-sm text-gray-600 mt-1">Add fields above to define your workflow state</p>
            </div>
          ) : (
            workflow.stateSchema.fields.map((field) => (
              <StateFieldEditor
                key={field.name}
                field={field}
                reducer={workflow.reducers[field.name]}
                onRemove={handleRemoveField}
                onToggleRequired={handleToggleRequired}
                onUpdateType={handleUpdateFieldType}
                onUpdateDescription={handleUpdateDescription}
                onUpdateReducer={handleUpdateReducer}
                onUpdateCustomReducer={handleUpdateCustomReducer}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface StateFieldEditorProps {
  field: StateField;
  reducer?: { type: 'append' | 'overwrite' | 'merge' | 'custom'; customCode?: string };
  onRemove: (name: string) => void;
  onToggleRequired: (name: string) => void;
  onUpdateType: (name: string, type: string) => void;
  onUpdateDescription: (name: string, description: string) => void;
  onUpdateReducer: (name: string, type: 'append' | 'overwrite' | 'merge' | 'custom') => void;
  onUpdateCustomReducer: (name: string, code: string) => void;
}

function StateFieldEditor({
  field,
  reducer,
  onRemove,
  onToggleRequired,
  onUpdateType,
  onUpdateDescription,
  onUpdateReducer,
  onUpdateCustomReducer,
}: StateFieldEditorProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-2 border-gray-200 rounded-2xl p-5 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-mono font-bold text-gray-900 text-base">{field.name}</span>
            <span className="text-xs font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-lg border border-blue-300">
              {field.type}
            </span>
            {field.required && (
              <span className="text-xs font-semibold bg-gradient-to-r from-red-100 to-rose-200 text-red-800 px-3 py-1 rounded-lg border border-red-300">
                required
              </span>
            )}
          </div>
          {field.description && (
            <p className="text-sm text-gray-700 leading-relaxed">{field.description}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(field.name)}
          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all duration-200 hover:scale-110"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm font-semibold text-blue-600 hover:text-blue-700 mb-3 flex items-center gap-1 transition-colors"
      >
        <span>{expanded ? '▼' : '▶'}</span>
        {expanded ? 'Hide details' : 'Show details'}
      </button>

      {expanded && (
        <div className="space-y-4 pt-4 border-t-2 border-gray-200">
          {/* Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Type
            </label>
            <select
              value={field.type}
              onChange={(e) => onUpdateType(field.name, e.target.value)}
              className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer font-medium"
            >
              <option value="string">string</option>
              <option value="int">int</option>
              <option value="float64">float64</option>
              <option value="bool">bool</option>
              <option value="[]string">[]string</option>
              <option value="[]int">[]int</option>
              <option value="map[string]string">map[string]string</option>
              <option value="map[string]interface{}">map[string]interface{}</option>
              <option value="interface{}">interface{}</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={field.description || ''}
              onChange={(e) => onUpdateDescription(field.name, e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Optional description"
            />
          </div>

          {/* Required toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={field.required}
                onChange={() => onToggleRequired(field.name)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Required field</span>
            </label>
          </div>

          {/* Reducer type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Reducer Strategy
            </label>
            <select
              value={reducer?.type || 'overwrite'}
              onChange={(e) => onUpdateReducer(field.name, e.target.value as 'append' | 'overwrite' | 'merge' | 'custom')}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="overwrite">Overwrite - Replace with new value</option>
              <option value="append">Append - Add to existing (arrays/slices)</option>
              <option value="merge">Merge - Deep merge (maps/objects)</option>
              <option value="custom">Custom - Write custom reducer</option>
            </select>
          </div>

          {/* Custom reducer code */}
          {reducer?.type === 'custom' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Custom Reducer Code
              </label>
              <textarea
                value={reducer.customCode || ''}
                onChange={(e) => onUpdateCustomReducer(field.name, e.target.value)}
                rows={6}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none"
                placeholder={`func(prev ${field.type}, delta ${field.type}) ${field.type} {\n  // Your merge logic\n  return delta\n}`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
