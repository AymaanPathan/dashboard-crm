import { toast } from "sonner";

interface ToastProps {
  title: string;
  description?: string;
  duration?: number;
}

const SuccessToast = ({ title, description, duration = 3000 }: ToastProps) => {
  toast.success(title, {
    description,
    duration,
    className:
      "bg-green-50 text-green-800 border border-green-400 shadow-sm rounded-md px-4 py-3",
  });
};

export default SuccessToast;
