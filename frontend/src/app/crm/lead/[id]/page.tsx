"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Phone, FileText, Receipt } from "lucide-react";
import { RootDispatch, RootState } from "@/store";
import { useParams } from "next/navigation";
import {
  addLeadNote,
  getLeadNotes,
  getOneLeadbyId,
} from "@/store/slices/leadSlice";
import AddTask from "@/components/Task/AddTask";
import LeadLogs from "@/components/lead/LeadLogs";
import { getLeadTasksByLeadIdSlice } from "@/store/slices/leadTaskSlice";
import { CreateQuotationModal } from "@/components/quotation/CreateQuotationModal";
import { getQuotationsByLead } from "@/store/slices/quotationSlice";
import { SidebarDetail } from "../SidebarDetail";
import { LeadTaskPage } from "../LeadTaskPage";
import { LeadQuotationPage } from "../LeadQuotationPage";
import { LeadNotesPage } from "../LeadNotesPage";
import { LeadPageHeader } from "../leadPageHeader";

const LeadDetailsPage = () => {
  const dispatch: RootDispatch = useDispatch();
  const { id } = useParams();
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const tasks = useSelector((state: RootState) => state.leadTasks.leadTasks);
  const leadNotes = useSelector((state: RootState) => state.lead.leadNotes);
  const quotations = useSelector(
    (state: RootState) => state.quotation.quotations
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const openQuotationModal = () => {
    setIsQuotationModalOpen(true);
  };
  const closeQuotationModal = () => {
    setIsQuotationModalOpen(false);
  };

  const currentLead = useSelector((state: RootState) => state.lead.lead);

  useEffect(() => {
    if (currentLead.id) {
      dispatch(getLeadTasksByLeadIdSlice(currentLead.id ?? ""));
    }
  }, [currentLead.id, dispatch]);

  useEffect(() => {
    if (currentLead.id) {
      dispatch(getQuotationsByLead(currentLead.id!));
    }
  }, [currentLead.id, dispatch]);

  useEffect(() => {
    if (currentLead.id) {
      dispatch(getLeadNotes(currentLead.id!));
    }
  }, [currentLead.id, dispatch]);

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getOneLeadbyId(id));
    }
  }, [id, dispatch]);

  const handleAddNote = async () => {
    await dispatch(
      addLeadNote({ leadId: currentLead.id || "", note: newNote })
    );
    setNewNote("");
    setIsAddingNote(false);
  };

  const openQuotationInNewTab = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "logs") {
      setShowAddTask(false);
    } else {
      if (tab !== "tasks") {
        setShowAddTask(false);
      }
    }
  };

  const quickActions = [
    {
      name: "Send Email",
      action: () => console.log("Send email"),
      icon: Mail,
    },
    {
      name: "Schedule Call",
      action: () => console.log("Schedule call"),
      icon: Phone,
    },
    {
      name: "Create Quotation",
      action: openQuotationModal,
      icon: Receipt,
    },
    {
      name: "Add Note",
      action: () => {
        setActiveTab("notes");
        setIsAddingNote(true);
      },
      icon: FileText,
    },
  ];

  return (
    <div className=" bg-white flex overflow-hidden">
      {/* Sidebar */}
      <SidebarDetail
        currentLead={currentLead}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        quickActions={quickActions}
        key={currentLead.id}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <LeadPageHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          tasks={tasks}
          currentLead={currentLead}
          leadNotes={leadNotes}
          openQuotationModal={openQuotationModal}
          quotations={quotations}
          setIsAddingNote={setIsAddingNote}
          setShowAddTask={setShowAddTask}
          showAddTask={showAddTask}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-white">
            {activeTab === "tasks" ? (
              <LeadTaskPage tasks={tasks} setShowAddTask={setShowAddTask} />
            ) : activeTab === "quotations" ? (
              <LeadQuotationPage
                openQuotationInNewTab={openQuotationInNewTab}
                openQuotationModal={openQuotationModal}
                quotations={quotations}
              />
            ) : activeTab === "notes" ? (
              <LeadNotesPage
                handleAddNote={handleAddNote}
                isAddingNote={isAddingNote}
                setIsAddingNote={setIsAddingNote}
                leadNotes={leadNotes}
                newNote={newNote}
                setNewNote={setNewNote}
              />
            ) : (
              activeTab === "logs" && <LeadLogs leadId={currentLead?.id} />
            )}
          </div>

          {showAddTask && activeTab === "tasks" && (
            <div className="w-96 border-l border-gray-200 bg-white flex-shrink-0">
              <AddTask
                leadId={currentLead?.id}
                onClose={() => setShowAddTask(false)}
              />
            </div>
          )}
        </div>
      </div>
      <CreateQuotationModal
        isOpen={isQuotationModalOpen}
        onClose={closeQuotationModal}
        leadData={currentLead}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
    </div>
  );
};

export default LeadDetailsPage;
