"use client";
import React, { useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  Target,
  AlertCircle,
  MessageSquare,
  Calendar,
  FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "@/store";
import { getLeadLogs } from "@/store/slices/leadSlice";
import { ReusableList } from "../reuseable/Lists/ReusableList";

interface LogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  type:
    | "status_change"
    | "task"
    | "communication"
    | "note"
    | "meeting"
    | "other";
  metadata?: {
    from?: string;
    to?: string;
    taskTitle?: string;
    duration?: string;
  };
}

interface LeadLogsProps {
  leadId?: string;
  className?: string;
}

const LeadLogs: React.FC<LeadLogsProps> = ({ leadId, className = "" }) => {
  const leadLogs = useSelector((state: RootState) => state.lead.leadLogs);
  const dispatch: RootDispatch = useDispatch();

  useEffect(() => {
    dispatch(getLeadLogs(leadId!));
  }, [dispatch, leadId]);

  const getLogIcon = (type: string) => {
    switch (type) {
      case "status_change":
        return <Target className="h-4 w-4 text-blue-500" />;
      case "task":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "communication":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "meeting":
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case "note":
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case "status_change":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "task":
        return "bg-green-100 text-green-700 border-green-200";
      case "communication":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "meeting":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "note":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const logTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - logTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return logTime.toLocaleDateString();
  };

  const renderMetadata = (log: LogEntry) => {
    if (!log.metadata) return null;

    const { metadata } = log;

    if (log.type === "status_change" && metadata.from && metadata.to) {
      return (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
            {metadata.from}
          </span>
          <ArrowRight className="h-3 w-3 text-gray-400" />
          <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
            {metadata.to}
          </span>
        </div>
      );
    }

    if (metadata.taskTitle) {
      return (
        <div className="mt-1">
          <span className="text-xs text-gray-500">Task: </span>
          <span className="text-xs font-medium text-gray-700">
            {metadata.taskTitle}
          </span>
        </div>
      );
    }

    if (metadata.duration) {
      return (
        <div className="mt-1">
          <span className="text-xs text-gray-500">Duration: </span>
          <span className="text-xs font-medium text-gray-700">
            {metadata.duration}
          </span>
        </div>
      );
    }

    return null;
  };

  const columns = [
    {
      key: "content",
      render: (log: LogEntry) => (
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {log.userName}
              </span>
              <span className="text-sm text-gray-600">{log.action}</span>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatRelativeTime(log.timestamp)}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-2">{log.details}</p>

          {renderMetadata(log)}

          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getLogTypeColor(
                log.type
              )}`}
            >
              {log.type.replace("_", " ")}
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={`${leadLogs.length > 0 && `bg-white`} ${className}`}>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <ReusableList
            items={leadLogs}
            columns={columns}
            maxHeight="calc(100vh - 200px)"
            emptyState={{
              icon: Clock,
              title: "No activity yet",
              description: "Activity will appear here as actions are taken",
            }}
            getItemIcon={(log: LogEntry) => (
              <div className="flex-shrink-0 h-10 w-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                {getLogIcon(log.type)}
              </div>
            )}
            className=""
          />
        </div>
      </div>
    </div>
  );
};

export default LeadLogs;
