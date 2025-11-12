import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Plus, Trash2, Database } from 'lucide-react';
import type { StateField } from '../../types/workflow';

export function StateSchemaPanel() {
  const { workflow, updateStateSchema, addStateField, updateReducer, removeReducer } = useWorkflowStore();
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('string');

  if (!workflow) return null;

  const handleAddField = () => {
    if (newFieldName.trim()) {
      addStateField(newFieldName.trim(), newFieldType);
      setNewFieldName('');
      setNewFieldType('string');
    }
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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Database className="text-blue-600" size={24} />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">State Schema</h2>
            <p className="text-sm text-gray-500">Define workflow state structure</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Add new field */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add State Field</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddField()}
              placeholder="Field name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              Add Field
            </button>
          </div>
        </div>

        {/* Field list */}
        <div className="space-y-4">
          {workflow.stateSchema.fields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database size={48} className="mx-auto mb-2 opacity-30" />
              <p>No state fields defined yet</p>
              <p className="text-sm">Add fields to define your workflow state</p>
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
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-semibold text-gray-800">{field.name}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {field.type}
            </span>
            {field.required && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                required
              </span>
            )}
          </div>
          {field.description && (
            <p className="text-sm text-gray-600">{field.description}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(field.name)}
          className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-600 hover:text-blue-700 mb-2"
      >
        {expanded ? '▼ Hide details' : '▶ Show details'}
      </button>

      {expanded && (
        <div className="space-y-3 pt-3 border-t border-gray-100">
          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={field.type}
              onChange={(e) => onUpdateType(field.name, e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={field.description || ''}
              onChange={(e) => onUpdateDescription(field.name, e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
