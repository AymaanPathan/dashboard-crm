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
    await dispatch(addExcelLead({ file: file!, assigneeId: selectedAssignee }));
    onClose();
    await dispatch(fetchLeadForKanban());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl border border-gray-100 shadow-xl max-w-lg w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Import Leads from Excel
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-400 bg-blue-50" : "border-gray-200"
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
              />

              {file ? (
                <div className="space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Drop your Excel file here
                    </p>
                    <p className="text-xs text-gray-500">or</p>
                    <label
                      htmlFor="file-upload"
                      className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                    >
                      browse to upload
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">
                    Supports .xlsx and .xls files
                  </p>
                </div>
              )}
            </div>

            {/* Template Download Link */}
            <div className="text-center">
              <a
                href="/test_leads_import.xlsx"
                download
                className="text-sm text-blue-600 hover:underline"
              >
                Download Excel Template
              </a>
            </div>

            {/* Assignee Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Assign all leads to
              </label>
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addExcel}
                disabled={!file || !selectedAssignee}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Import Leads
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
