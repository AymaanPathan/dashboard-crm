import { ILeadNotes } from "@/models/lead.model";
import { Edit3, FileText, Send, Trash2, User } from "lucide-react";
import React from "react";

export interface LeadNote {
  isAddingNote: boolean;
  setIsAddingNote: (adding: boolean) => void;
  leadNotes: ILeadNotes[];
  newNote: string;
  setNewNote: (note: string) => void;
  handleAddNote: () => void;
}

export const LeadNotesPage: React.FC<LeadNote> = ({
  isAddingNote,
  setIsAddingNote,
  leadNotes,
  newNote,
  setNewNote,
  handleAddNote,
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
              <p className="text-sm text-gray-500 mt-1">
                Document your interactions and important information
              </p>
            </div>
            {!isAddingNote && (
              <button
                onClick={() => setIsAddingNote(true)}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
              >
                New Note
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto px-8 py-8">
        {/* Add Note Input */}
        {isAddingNote && (
          <div className="mb-6 bg-white border border-gray-100 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a note..."
                  className="w-full p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
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
        {leadNotes.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-12 w-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-1">
              No notes yet
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Start documenting your interactions with this lead
            </p>
            <button
              onClick={() => setIsAddingNote(true)}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors"
            >
              Create Note
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {leadNotes.map((note) => (
              <div
                key={note.id}
                className="group bg-white hover:bg-gray-50 border border-gray-100 rounded-lg p-5 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
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
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {note.note}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
