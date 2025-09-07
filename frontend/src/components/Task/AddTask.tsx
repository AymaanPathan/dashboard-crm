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
  AlertCircle,
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskTypes = [
    { value: "call", label: "Phone Call", icon: "📞" },
    { value: "email", label: "Send Email", icon: "✉️" },
    { value: "meeting", label: "Meeting", icon: "🤝" },
    { value: "follow-up", label: "Follow Up", icon: "🔄" },
    { value: "demo", label: "Product Demo", icon: "🎯" },
    { value: "proposal", label: "Send Proposal", icon: "📋" },
    { value: "other", label: "Other", icon: "📝" },
  ];

  const priorityOptions = [
    {
      value: "low",
      label: "Low",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      value: "medium",
      label: "Medium",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      value: "high",
      label: "High",
      color: "text-red-600 bg-red-50 border-red-200",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create task object with leadId
    const newTask = {
      ...task,
      id: Date.now().toString(),
      leadId,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    // Simulate API call
    setTimeout(() => {
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

      setIsSubmitting(false);
      console.log("Task created successfully:", newTask);
    }, 500);
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-neutral-100 rounded-lg flex items-center justify-center">
            <Plus className="h-4 w-4 text-neutral-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-900">
              Add New Task
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Create a task for this lead
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider">
              Task Title
            </label>
            <input
              type="text"
              required
              value={task.title}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400"
            />
          </div>

          {/* Task Type */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider">
              Type
            </label>
            <div className="relative">
              <select
                value={task.type}
                onChange={(e) =>
                  setTask((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent appearance-none cursor-pointer"
              >
                {taskTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() =>
                    setTask((prev) => ({
                      ...prev,
                      priority: priority.value as any,
                    }))
                  }
                  className={`px-3 py-2 text-xs font-medium rounded-md border transition-all ${
                    task.priority === priority.value
                      ? priority.color
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <Flag className="h-3 w-3 inline mr-1" />
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) =>
                    setTask((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Due Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={task.dueTime}
                  onChange={(e) =>
                    setTask((prev) => ({ ...prev, dueTime: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                />
                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider">
              Assign To
            </label>
            <div className="relative">
              <input
                type="text"
                value={task.assignedTo}
                onChange={(e) =>
                  setTask((prev) => ({ ...prev, assignedTo: e.target.value }))
                }
                placeholder="Enter name or email..."
                className="w-full px-3 py-2 pl-9 text-sm bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400"
              />
              <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-neutral-100 text-neutral-600 rounded-md hover:bg-neutral-200 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded border border-neutral-200"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 text-neutral-500 hover:text-neutral-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider">
              Description
            </label>
            <div className="relative">
              <textarea
                value={task.description}
                onChange={(e) =>
                  setTask((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Add any additional details..."
                rows={4}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-neutral-100">
            <button
              type="submit"
              disabled={isSubmitting || !task.title.trim()}
              className="w-full px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-md hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating Task...
                </div>
              ) : (
                "Create Task"
              )}
            </button>

            {!task.title.trim() && (
              <div className="flex items-center gap-2 mt-2 text-xs text-amber-600">
                <AlertCircle className="h-3 w-3" />
                Task title is required
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
