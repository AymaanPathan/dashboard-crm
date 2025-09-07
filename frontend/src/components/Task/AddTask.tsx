"use client";
import React, { useState } from "react";
import {
  Plus,
  X,
  Calendar,
  Clock,
  User,
  Flag,
  FileText,
  Tag,
  ChevronDown,
} from "lucide-react";

interface AddTaskProps {
  leadId?: string;
  onTaskCreated?: (task: any) => void;
  onClose?: () => void;
}

interface Task {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  assignedTo: string;
  priority: "low" | "medium" | "high";
  type: string;
  tags: string[];
}

const AddTask: React.FC<AddTaskProps> = ({
  leadId,
  onTaskCreated,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState<Task>({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    assignedTo: "",
    priority: "medium",
    type: "call",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");

  const taskTypes = [
    { value: "call", label: "Phone Call" },
    { value: "email", label: "Send Email" },
    { value: "meeting", label: "Meeting" },
    { value: "follow-up", label: "Follow Up" },
    { value: "demo", label: "Product Demo" },
    { value: "proposal", label: "Send Proposal" },
    { value: "other", label: "Other" },
  ];

  const priorityColors = {
    low: "bg-green-50 text-green-700 border-green-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    high: "bg-red-50 text-red-700 border-red-200",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create task object with leadId
    const newTask = {
      ...task,
      id: Date.now().toString(), // Temporary ID
      leadId,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    // Call onTaskCreated callback if provided
    if (onTaskCreated) {
      onTaskCreated(newTask);
    }

    // Reset form
    setTask({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      assignedTo: "",
      priority: "medium",
      type: "call",
      tags: [],
    });

    setIsOpen(false);

    // Show success message (you might want to use a toast library)
    console.log("Task created successfully:", newTask);
  };

  const addTag = () => {
    if (newTag.trim() && !task.tags.includes(newTag.trim())) {
      setTask((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTask((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="h-4 w-4" />
            Add New Task
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="h-5 w-5 text-gray-400" />
          Add New Task
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Task Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={task.title}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter task title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Task Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Task Type</label>
          <div className="relative">
            <select
              value={task.type}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              {taskTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Priority</label>
          <div className="flex gap-2">
            {(["low", "medium", "high"] as const).map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => setTask((prev) => ({ ...prev, priority }))}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                  task.priority === priority
                    ? priorityColors[priority]
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Flag className="h-3 w-3 inline mr-1" />
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) =>
                  setTask((prev) => ({ ...prev, dueDate: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Due Time
            </label>
            <div className="relative">
              <input
                type="time"
                value={task.dueTime}
                onChange={(e) =>
                  setTask((prev) => ({ ...prev, dueTime: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Assigned To */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Assign To</label>
          <div className="relative">
            <input
              type="text"
              value={task.assignedTo}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, assignedTo: e.target.value }))
              }
              placeholder="Enter assignee name or email..."
              className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tags</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="relative">
            <textarea
              value={task.description}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Add task description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Task
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
