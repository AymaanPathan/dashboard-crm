import {
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  User,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { LeadTask } from "@/models/leadTask.model";
import { RootDispatch } from "@/store";
import { useDispatch } from "react-redux";
import {
  completeTaskSlice,
  optimisticCompleteTask,
} from "@/store/slices/leadTaskSlice";
import Link from "next/link";

const getTaskIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return <CheckCircle className="h-3.5 w-3.5 text-gray-400" />;
    case "in-progress":
      return <Clock className="h-3.5 w-3.5 text-gray-600" />;
    case "pending":
      return <AlertCircle className="h-3.5 w-3.5 text-gray-600" />;
    case "cancelled":
      return <XCircle className="h-3.5 w-3.5 text-gray-400" />;
    default:
      return <AlertCircle className="h-3.5 w-3.5 text-gray-400" />;
  }
};

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "text-gray-600 bg-gray-50";
    case "in-progress":
      return "text-gray-700 bg-gray-100";
    case "pending":
      return "text-gray-700 bg-gray-100";
    case "cancelled":
      return "text-gray-500 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export const TaskCard = ({ task }: { task: LeadTask }) => {
  const dispatch: RootDispatch = useDispatch();

  const handleComplete = async (taskId: string) => {
    dispatch(optimisticCompleteTask({ taskId, status: "completed" }));

    await dispatch(completeTaskSlice({ taskId, status: "completed" }));
  };
  return (
    <div className="group rounded-md border border-gray-200 bg-white px-4 py-3 transition-all hover:bg-gray-50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-0.5 shrink-0">{getTaskIcon(task.status)}</div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-sm text-gray-900 leading-tight">
                {task.title}
              </h3>
              <span
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${getStatusStyle(
                  task.status
                )}`}
              >
                {task.status.replace("-", " ")}
              </span>
            </div>

            {task?.description && (
              <p className="text-sm text-gray-600 leading-snug line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-0.5">
              <User className="h-3 w-3" />
              <span>{task?.createdBy?.username}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/crm/lead/${task.leadId}`} passHref>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-normal text-gray-700 hover:bg-gray-100"
            >
              View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-gray-100"
          >
            <MoreHorizontal className="h-3.5 w-3.5 text-gray-600" />
          </Button>

          {task.status !== "completed" && task.status !== "cancelled" && (
            <Button
              onClick={() => handleComplete(task.id!)}
              size="sm"
              className="gap-1 h-7 px-2 text-xs font-medium bg-black hover:bg-gray-800 text-white"
            >
              <CheckCircle className="h-3 w-3" />
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
