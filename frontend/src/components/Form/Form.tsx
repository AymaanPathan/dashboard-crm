"use client";
import React, { useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Submit",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden bg-white shadow-2xl rounded-2xl"
      >
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-start justify-between mb-8">
            <h2 className="text-3xl font-semibold text-gray-500">{title}</h2>
            <button onClick={onClose} className="flex items-center gap-2 group">
              <span className="text-xs text-gray-400 border border-gray-300 rounded px-1.5 py-0.5 font-mono group-hover:border-gray-400 transition-colors">
                ESC
              </span>
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-160px)] pr-2 -mr-2">
            {children}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 cursor-pointer py-2 text-[15px] text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 cursor-pointer text-[15px] bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

interface FormSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  icon,
  title,
  children,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5 mb-4">
        {icon}
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  icon,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-700">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2">{icon}</div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${
            icon ? "pl-6" : "px-0"
          } py-2.5 text-[15px] bg-transparent border-0 border-b transition-colors focus:outline-none placeholder:text-gray-400 ${
            error
              ? "border-red-300 focus:border-red-500"
              : "border-gray-200 focus:border-gray-900"
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-0 py-2.5 text-[15px] bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 resize-none placeholder:text-gray-400"
      />
    </div>
  );
};

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  error?: string;
  isOpen: boolean;
  onToggle: () => void;
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  error?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select option",
  options,
  error,
  isOpen,
  onToggle,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          className={`w-full h-11 px-4 text-sm text-left bg-white border rounded-lg transition-colors focus:outline-none flex items-center justify-between ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          }`}
        >
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  onToggle();
                }}
                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  value === option.value ? "bg-gray-50 font-medium" : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
};
