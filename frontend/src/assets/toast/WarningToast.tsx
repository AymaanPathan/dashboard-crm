import toast from "react-hot-toast";

interface WarningToastProps {
  title: string;
  description?: string;
  duration?: number;
}

const WarningToast = ({
  title,
  description,
  duration = 4000,
}: WarningToastProps) => {
  toast(title, {
    description,
    className:
      "bg-yellow-100 text-yellow-900 border border-yellow-400 shadow-md rounded-md px-4 py-3",
    duration,
  });
};

export default WarningToast;
