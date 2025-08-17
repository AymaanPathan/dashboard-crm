import { toast } from "sonner";

interface ToastProps {
  title: string;
  description?: string;
  duration?: number;
}

const ErrorToast = ({ title, description, duration = 5000 }: ToastProps) => {
  toast.error(title, {
    description,
    duration,
    className:
      "bg-red-50 text-red-800 border border-red-400 shadow-sm rounded-md px-4 py-3",
  });
};

export default ErrorToast;
