import { RootDispatch, RootState } from "@/store";
import { addExcelLead, fetchLeadForKanban } from "@/store/slices/kanbanSlice";
import { CheckCircle2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelUploadModal = ({
  isOpen,
  onClose,
}: ExcelUploadModalProps) => {
  const teamMembers = useSelector((state: RootState) => state.user.teamMembers);
  const [dragActive, setDragActive] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch: RootDispatch = useDispatch();

  const handleDrag = (
    e: React.DragEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addExcel = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    await dispatch(addExcelLead({ file: file!, assigneeId: selectedAssignee }));

    clearInterval(progressInterval);
    setUploadProgress(100);

    setTimeout(async () => {
      await dispatch(fetchLeadForKanban({}));
      setIsUploading(false);
      setUploadProgress(0);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-gray-200/60 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
              Import Leads
            </h2>
            <button
              onClick={onClose}
              disabled={isUploading}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive
                  ? "border-gray-400 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />

              {file ? (
                <div className="space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-gray-700 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  {!isUploading && (
                    <button
                      onClick={() => setFile(null)}
                      className="text-xs text-gray-500 hover:text-gray-700 hover:underline"
                    >
                      Remove file
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-10 h-10 text-gray-300 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      Drop your Excel file here
                    </p>
                    <p className="text-xs text-gray-400">or</p>
                    <label
                      htmlFor="file-upload"
                      className="inline-block text-xs text-gray-900 hover:text-gray-700 cursor-pointer font-medium underline decoration-gray-300 hover:decoration-gray-500 underline-offset-2"
                    >
                      browse to upload
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Supports .xlsx and .xls files
                  </p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">
                    Uploading...
                  </span>
                  <span className="text-gray-500">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gray-900 h-full transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Template Download Link */}
            <div className="text-center py-2">
              <a
                href="/test_leads_import.xlsx"
                download
                className="text-xs text-gray-600 hover:text-gray-900 underline decoration-gray-300 hover:decoration-gray-500 underline-offset-2"
              >
                Download Excel Template
              </a>
            </div>

            {/* Assignee Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Assign all leads to
              </label>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                disabled={isUploading}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 text-sm bg-white hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select team member</option>
                {teamMembers.salesReps.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                disabled={isUploading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={addExcel}
                disabled={!file || !selectedAssignee || isUploading}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow"
              >
                {isUploading ? "Importing..." : "Import Leads"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
