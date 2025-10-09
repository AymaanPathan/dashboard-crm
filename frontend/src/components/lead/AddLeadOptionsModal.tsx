import { FileSpreadsheet, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Card, CardContent } from "../ui/card";

interface AddLeadOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForm: () => void;
  onSelectExcel: () => void;
}

export const AddLeadOptionsModal = (
  AddLeadOptionsModalProps: AddLeadOptionsModalProps
) => {
  const { isOpen, onClose, onSelectForm, onSelectExcel } =
    AddLeadOptionsModalProps;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-2xl p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-base font-semibold text-gray-900">
            Add New Leads
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-2">
          <Card
            className="border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer rounded-lg shadow-sm hover:shadow-md"
            onClick={onSelectForm}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-0.5">
                    Create Single Lead
                  </h3>
                  <p className="text-xs text-gray-500">
                    Add one lead manually using a form
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer rounded-lg shadow-sm hover:shadow-md"
            onClick={onSelectExcel}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-0.5">
                    Import from Excel
                  </h3>
                  <p className="text-xs text-gray-500">
                    Upload Excel file with multiple leads
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
