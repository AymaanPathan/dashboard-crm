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
      <DialogContent className="sm:max-w-md bg-white border-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add New Leads
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-4">
          <Card
            className="border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
            onClick={onSelectForm}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    Create Single Lead
                  </h3>
                  <p className="text-sm text-gray-500">
                    Add one lead manually using a form
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
            onClick={onSelectExcel}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    Import from Excel
                  </h3>
                  <p className="text-sm text-gray-500">
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
