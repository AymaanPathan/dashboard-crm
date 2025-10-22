/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReusableListPage } from "@/components/reuseable/Lists/ReusableList";
import { ILeadNotes } from "@/models/lead.model";
import { Edit3, FileText, Plus, Trash2, User } from "lucide-react";
import React from "react";

export interface LeadNote {
  isAddingNote: boolean;
  setIsAddingNote: (adding: boolean) => void;
  leadNotes: ILeadNotes[];
  newNote: string;
  setNewNote: (note: string) => void;
  handleAddNote: () => void;
  handleEditNote?: (note: ILeadNotes) => void;
  handleDeleteNote?: (note: ILeadNotes) => void;
}

export const LeadNotesPage: React.FC<LeadNote> = ({
  isAddingNote,
  setIsAddingNote,
  leadNotes,
  newNote,
  setNewNote,
  handleAddNote,
  handleEditNote,
  handleDeleteNote,
}) => {
  const columns = [
    {
      key: "content",
      render: (note: ILeadNotes) => (
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-sm font-medium text-gray-900">
                {note.userName}
              </span>
              <span className="text-xs text-gray-400 ml-2">
                {note?.createdAt?.toLocaleString() || ""}
                {note.updatedAt !== note.createdAt && " · edited"}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {note.note}
          </p>
        </div>
      ),
    },
  ];

  const actions = [];

  if (handleEditNote) {
    actions.push({
      icon: Edit3,
      onClick: handleEditNote,
      label: "Edit note",
    });
  }

  if (handleDeleteNote) {
    actions.push({
      icon: Trash2,
      onClick: handleDeleteNote,
      label: "Delete note",
    });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Content Section */}
      <div className="mx-auto px-6 py-8">
        {/* Add Note Button */}
        {leadNotes.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setIsAddingNote(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Note
            </button>
          </div>
        )}
        {/* Add Note Input */}
        {isAddingNote && (
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a note..."
                  className="w-full p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
                  rows={4}
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote("");
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Notes List */}
        <ReusableListPage
          title="Lead Notes"
          data={leadNotes}
          headers={columns.map((col: any) => ({
            label: col.label,
            key: col.key,
            colSpan: col.colSpan || 3, // adjust based on your layout
          }))}
          renderRow={(note: ILeadNotes) => (
            <>
              {/* Example: Replace with your actual row rendering */}
              <div className="col-span-1">
                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              </div>
              <div className="col-span-4">
                <p className="text-sm text-gray-900">{note.userName}</p>
                <p className="text-xs text-gray-500">{note.note}</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm text-gray-700">{note.createdById}</p>
              </div>
              <div className="col-span-2 text-sm text-gray-500">
                {note?.createdAt?.toLocaleString() || ""}
              </div>
            </>
          )}
          onAddClick={() => setIsAddingNote(true)}
          emptyState={{
            title: "No notes yet",
            description: "Start documenting your interactions with this lead",
            actionText: "Create Note",
          }}
        />
      </div>
    </div>
  );
};
