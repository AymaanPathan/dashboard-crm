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
      return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "pending":
      return <AlertCircle className="h-4 w-4 text-amber-600" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "in-progress":
      return "text-blue-700 bg-blue-50 border-blue-200";
    case "pending":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "cancelled":
      return "text-red-700 bg-red-50 border-red-200";
    default:
      return "text-slate-700 bg-slate-50 border-slate-200";
  }
};

export const TaskCard = ({ task }: { task: LeadTask }) => {
  const dispatch: RootDispatch = useDispatch();

  const handleComplete = async (taskId: string) => {
    dispatch(optimisticCompleteTask({ taskId, status: "completed" }));

    await dispatch(completeTaskSlice({ taskId, status: "completed" }));
  };
  return (
    <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="mt-1">{getTaskIcon(task.status)}</div>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start gap-3 flex-wrap">
              <h3 className="font-medium text-sm leading-none">{task.title}</h3>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors ${getStatusStyle(
                    task.status
                  )}`}
                >
                  {task.status.replace("-", " ")}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{task?.description}</p>

            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-3 w-3" />
                <span>{task?.createdBy?.username}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Link href={`/crm/lead/${task.leadId}`} passHref>
            <Button variant="outline" size="sm">
              View Lead
            </Button>
          </Link>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {task.status !== "completed" && task.status !== "cancelled" && (
            <Button
              onClick={() => handleComplete(task.id!)}
              size="sm"
              className="gap-1.5"
            >
              <CheckCircle className="h-3 w-3" />
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
