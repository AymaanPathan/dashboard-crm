import { toast } from "sonner";

interface InfoToastProps {
  title: string;
  description?: string;
  duration?: number;
}

const InfoToast = ({ title, description, duration = 4000 }: InfoToastProps) => {
  toast(title, {
    description,
    className:
      "bg-blue-100 text-blue-900 border border-blue-400 shadow-md rounded-md px-4 py-3",
    duration,
  });
};

export default InfoToast;
