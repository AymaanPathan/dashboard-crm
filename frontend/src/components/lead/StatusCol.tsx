/* eslint-disable @typescript-eslint/no-explicit-any */
import { DragItem, DropCollectedProps, ITEM_TYPE } from "@/models/kanban.model";
import { RootDispatch, RootState } from "@/store";
import { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { LeadCard } from "./LeadCard";
import {
  moveLeadBetweenStatuses,
  updateLeadStatus,
} from "@/store/slices/kanbanSlice";

export const StatusColumn: React.FC<{ stage: any }> = ({ stage }) => {
  const dispatch = useDispatch<RootDispatch>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const leads = useSelector((state: RootState) => state.kanban.leads);

  const handleDrop = useCallback(
    (item: DragItem) => {
      const newPosition =
        hoveredIndex !== null ? hoveredIndex : stage.leads?.length || 0;

      const fullLead = leads.find((l: any) => l.id === item.id);
      if (!fullLead) return;

      // Skip if dropping in the same position
      if (item.stageId === stage.stageId && item.index === newPosition) {
        setHoveredIndex(null);
        return;
      }
      dispatch(
        moveLeadBetweenStatuses({
          leadId: item.id,
          oldStageId: item.stageId,
          newStageId: stage.stageId,
          oldPosition: item.index,
          newPosition: hoveredIndex ?? stage.leads.length,
        })
      );

      dispatch(
        updateLeadStatus({
          leadId: item.id,
          oldStage: item.stageId,
          newStage: stage.stageId,
          oldPosition: item.index,
          newPosition: hoveredIndex ?? stage.leads.length,
        })
      );

      setHoveredIndex(null);
    },
    [hoveredIndex, stage, leads, dispatch]
  );

  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    void,
    DropCollectedProps
  >({
    accept: ITEM_TYPE,
    drop: handleDrop as any,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop as any}
      className={`bg-gray-50/30 h-screen rounded-md flex flex-col transition-all duration-200 hadow-sm ${
        isOver && canDrop
          ? "bg-gray-100/50 ring-2 ring-gray-400/50 border-gray-400 shadow-md"
          : ""
      } w-[220px] sm:w-[240px]`}
    >
      {/* Header */}
      <div className="px-3 pt-2.5 pb-2 flex-shrink-0 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-800 tracking-tight">
            {stage.stageName}
          </h3>
          <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200/60">
            {stage.leads?.length || 0}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-2 py-2 space-y-1.5 overflow-y-auto scrollbar-custom scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {stage.leads?.map((lead: any, index: number) => {
          return (
            <div key={`${lead.id}-${index}`}>
              <LeadCard
                key={lead.id}
                leadData={lead}
                index={index}
                stageData={stage}
                onHover={setHoveredIndex}
              />
            </div>
          );
        })}

        {isOver && canDrop && (
          <div className="border-2 border-dashed border-gray-400 bg-gray-100/50 rounded-lg py-6 text-center text-xs text-gray-700 font-medium transition-all">
            Drop lead here
          </div>
        )}

        {(!stage.leads || stage.leads.length === 0) && !isOver && (
          <div className="py-12 text-center text-xs text-gray-400 font-normal">
            No leads yet
          </div>
        )}
      </div>
    </div>
  );
};
