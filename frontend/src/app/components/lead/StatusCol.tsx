/* eslint-disable @typescript-eslint/no-explicit-any */
import { DragItem, DropCollectedProps, ITEM_TYPE } from "@/models/kanban.model";
import { Statusdata } from "@/models/org.model";
import { RootDispatch } from "@/store";
import { updateLeadStatus } from "@/store/slices/leadSlice";
import { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { LeadCard } from "./LeadCard";
import { moveLeadBetweenStatuses } from "@/store/slices/leadSlice";
export const StatusColumn: React.FC<{ status: Statusdata }> = ({ status }) => {
  const dispatch = useDispatch<RootDispatch>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDrop = useCallback(
    async (item: DragItem) => {
      const position =
        hoveredIndex !== null ? hoveredIndex : status.leadIds?.length || 0;

      const res = dispatch(
        moveLeadBetweenStatuses({
          leadId: item.id,
          newStatus: status.name,
          oldStatus: item.statusName,
          oldPosition: item.index,
          newPosition: position,
        })
      );
      console.log("res", res);

      await dispatch(
        updateLeadStatus({
          leadId: item.id,
          newStatus: status.name,
          oldStatus: item.statusName,
          oldPosition: item.index,
          newPosition: position,
        })
      );

      setHoveredIndex(null);
    },
    [dispatch, status.name, hoveredIndex, status.leadIds]
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
        <h3 className="font-semibold text-gray-900">{status.name}</h3>
        <span className="text-sm text-gray-500">
          {status.leadIds?.length || 0} leads
        </span>
      </div>

      <div className="p-4 space-y-4 min-h-[400px]">
        {status.leads?.map((lead: any, index: number) => (
          <LeadCard
            key={lead.id}
            leadId={lead.id}
            statusName={status.name}
            index={index}
            onHover={setHoveredIndex}
          />
        ))}

        {isOver && canDrop && (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center text-blue-600">
            Drop lead here
          </div>
        )}
      </div>
    </div>
  );
};
