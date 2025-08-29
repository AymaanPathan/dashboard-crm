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

        console.log("Dropped item:", item);
        console.log("Target hoveredIndex:", hoveredIndex);

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

      const result = dispatch(
        updateLeadStatus({
          leadId: item.id,
          oldStage: item.stageId,
          newStage: stage.stageId,
          oldPosition: item.index,
          newPosition: hoveredIndex ?? stage.leads.length,
        })
      );

      console.log("res", result);

      console.log("Lead moved:", leads);
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
      className={`rounded-lg border transition-colors ${
        isOver && canDrop
          ? "bg-blue-50 border-blue-300"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{stage.stageName}</h3>
        <span className="text-sm text-gray-500">
          {stage.leads?.length || 0} leads
        </span>
      </div>

      <div className="p-4 space-y-4 min-h-[400px]">
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
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center text-blue-600">
            Drop lead here
          </div>
        )}
      </div>
    </div>
  );
};
