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
    style: {
        color: "#ff4d4f", 
    },
    action: {
      label: "close",
      onClick: () => console.log("close"),
    },
  });
};

export default ErrorToast;
