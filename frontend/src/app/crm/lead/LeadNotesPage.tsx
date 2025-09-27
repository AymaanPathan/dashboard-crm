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
    <div className="p-6">
      {/* Add Note Input */}
      {isAddingNote && (
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add your note here..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                autoFocus
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">
                  Adding note as Current User
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote("");
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Send className="h-3 w-3" />
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {leadNotes.length === 0 ? (
        <div className="text-center py-16">
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notes yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start documenting your interactions with this lead
          </p>
          <button
            onClick={() => setIsAddingNote(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add First Note
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {leadNotes.map((note) => (
            <div
              key={note.id}
              className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
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
                      <span className="text-xs text-gray-500 ml-2">
                        {note?.createdAt?.toLocaleString() || ""}
                        {note.updatedAt !== note.createdAt && " • edited"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="h-3 w-3" />
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
  );
};
