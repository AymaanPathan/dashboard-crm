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
      className={`bg-white h-screen flex flex-col transition-all duration-300 ease-out ${
        isOver && canDrop ? "bg-gray-50/40 ring-1 ring-gray-900/5" : ""
      } w-[260px]`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">
            {stage.stageName}
          </h3>
          <span className="text-xs text-gray-500 font-normal">
            {stage.leads?.length || 0}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
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
          <div className="border border-dashed border-gray-300 bg-gray-50/50 rounded-md py-8 text-center text-sm text-gray-400 font-normal transition-all duration-200">
            Drop here
          </div>
        )}

        {(!stage.leads || stage.leads.length === 0) && !isOver && (
          <div className="py-16 text-center text-sm text-gray-400 font-normal">
            No leads
          </div>
        )}
      </div>
    </div>
  );
};
