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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-xl mx-4 overflow-hidden bg-white shadow-2xl rounded-xl border border-gray-200/60 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex flex-col max-h-[85vh]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-all duration-200 group"
            >
              <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {children}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 cursor-pointer py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 cursor-pointer text-sm font-medium bg-black hover:bg-gray-900 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
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
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-2.5 pb-2">
        <div className="text-gray-900 w-4 h-4 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
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
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${
            icon ? "pl-10 pr-4" : "px-4"
          } py-2.5 text-sm bg-white border rounded-lg transition-all duration-200 focus:outline-none placeholder:text-gray-400 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50"
              : "border-gray-200 hover:border-gray-300 focus:border-black focus:ring-4 focus:ring-gray-50"
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
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
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:border-black focus:ring-4 focus:ring-gray-50 resize-none placeholder:text-gray-400"
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
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          className={`w-full h-11 px-4 text-sm text-left bg-white border rounded-lg transition-all duration-200 focus:outline-none flex items-center justify-between ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50"
              : "border-gray-200 hover:border-gray-300 focus:border-black focus:ring-4 focus:ring-gray-50"
          }`}
        >
          <span
            className={value ? "text-gray-900 font-medium" : "text-gray-400"}
          >
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  onToggle();
                }}
                className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${
                  index === 0 ? "rounded-t-lg" : ""
                } ${index === options.length - 1 ? "rounded-b-lg" : ""} ${
                  value === option.value
                    ? "bg-gray-50 font-semibold text-gray-900"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600 font-medium mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};

interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
  error,
}) => {
  return (
    <div className="flex items-start space-x-3 group cursor-pointer">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 mt-0.5 text-black border-gray-300 rounded focus:ring-4 focus:ring-gray-100 cursor-pointer transition-all"
      />
      <label
        htmlFor={name}
        className="text-sm text-gray-700 cursor-pointer select-none"
      >
        {label}
      </label>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
