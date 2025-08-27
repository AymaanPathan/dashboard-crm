/* eslint-disable @typescript-eslint/no-explicit-any */
import { DragItem, DropCollectedProps, ITEM_TYPE } from "@/models/kanban.model";
import { Statusdata } from "@/models/org.model";
import { RootDispatch } from "@/store";
import { updateLeadStatus } from "@/store/slices/leadSlice";
import { useCallback } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { LeadCard } from "./LeadCard";
import { moveLeadBetweenStatuses } from "@/store/slices/orgSlice";

export const StatusColumn: React.FC<{ status: Statusdata }> = ({ status }) => {
  const dispatch = useDispatch<RootDispatch>();

  const handleDrop = useCallback(
    async (item: DragItem) => {
      console.log("Dropped item:", item);
      await dispatch(
        updateLeadStatus({
          leadId: item.id,
          newStatus: status.name,
          oldStatus: item.statusName,
          oldPosition: 0,
          newPosition: 0,
        })
      );
      dispatch(
        moveLeadBetweenStatuses({
          leadId: item.id,
          fromStatusName: item.statusName,
          toStatusName: status.name,
        })
      );
    },

    [dispatch, status.name]
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

  const highlight = isOver && canDrop;

  return (
    <div
      ref={drop as any}
      className={`rounded-lg border transition-colors ${
        highlight ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{status.name}</h3>
        <span className="text-sm text-gray-500">
          {status.leadIds?.length || 0} leads
        </span>
      </div>

      <div className="p-4 space-y-4 min-h-[400px]">
        {status.leadIds?.map((leadId: string) => (
          <LeadCard key={leadId} leadId={leadId} statusName={status.name} />
        ))}

        {highlight && (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center text-blue-600">
            Drop lead here
          </div>
        )}
      </div>
    </div>
  );
};
