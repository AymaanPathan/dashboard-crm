/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReusableListPage } from "@/components/reuseable/Lists/ReusableList";
import { ILeadNotes } from "@/models/lead.model";
import { Edit3, Plus, Trash2, User } from "lucide-react";
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
  const headers = [
    { label: "Note", key: "content" },
    { label: "Date", key: "date" },
    { label: "Actions", key: "actions" },
  ];

  const renderRow = (note: ILeadNotes, index: number) => (
    <>
      {/* Note Content with User Avatar */}
      <td className="px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-900">
                {note.userName}
              </span>
              {note.updatedAt !== note.createdAt && (
                <span className="text-xs text-gray-400">· edited</span>
              )}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {note.note}
            </p>
          </div>
        </div>
      </td>

      {/* Date */}
      <td className="px-5 py-4 align-top">
        <div className="text-sm text-gray-900">
          {note?.createdAt
            ? new Date(note.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {note?.createdAt
            ? new Date(note.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </div>
      </td>

      {/* Actions */}
      <td className="px-5 py-4 align-top">
        <div className="flex items-center gap-2">
          {handleEditNote && (
            <button
              onClick={() => handleEditNote(note)}
              className="p-1.5 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-lg transition-all border border-gray-200/50 shadow-sm hover:shadow-md active:scale-95"
              title="Edit note"
            >
              <Edit3 className="h-4 w-4 text-gray-600" />
            </button>
          )}
          {handleDeleteNote && (
            <button
              onClick={() => handleDeleteNote(note)}
              className="p-1.5 cursor-pointer bg-white/60 backdrop-blur-sm hover:bg-red-50 rounded-lg transition-all border border-gray-200/50 shadow-sm hover:shadow-md active:scale-95 group"
              title="Delete note"
            >
              <Trash2 className="h-4 w-4 text-gray-600 group-hover:text-red-600" />
            </button>
          )}
        </div>
      </td>
    </>
  );

  return (
    <div className="min-h-screen ">
      {/* Content Section */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Add Note Button */}
        {leadNotes.length > 0 && !isAddingNote && (
          <div className="mb-6">
            <button
              onClick={() => setIsAddingNote(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-150 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Add Note
            </button>
          </div>
        )}

        {/* Add Note Input */}
        {isAddingNote && (
          <div className="mb-6 bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-xl p-5 shadow-lg shadow-gray-900/5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a note..."
                  className="w-full p-3 border border-gray-200/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 text-sm bg-white/60 backdrop-blur-sm"
                  rows={4}
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote("");
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
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
          data={leadNotes}
          headers={headers}
          renderRow={renderRow}
          onAddClick={() => setIsAddingNote(true)}
          emptyState={{
            title: "No notes found",
            description: "Start documenting your interactions with this lead",
            actionText: "Create Note",
          }}
        />
      </div>
    </div>
  );
};
