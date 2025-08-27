/* eslint-disable @typescript-eslint/no-explicit-any */
import { DragItem, DropCollectedProps, ITEM_TYPE } from "@/models/kanban.model";
import { Statusdata } from "@/models/org.model";
import { RootDispatch } from "@/store";
import { moveLeadBetweenStatuses } from "@/store/slices/orgSlice";
import { useCallback } from "react";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { LeadCard } from "./LeadCard";

export const StatusColumn: React.FC<{ status: Statusdata }> = ({ status }) => {
  const dispatch = useDispatch<RootDispatch>();

  const handleDrop = useCallback(
    (item: DragItem) => {
      if (item.statusName !== status.name) {
        dispatch(
          moveLeadBetweenStatuses({
            leadId: item.id,
            fromStatusName: item.statusName,
            toStatusName: status.name,
          })
        );
      }
    },
    [dispatch, status.name]
  );

  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    void,
    DropCollectedProps
  >({
    accept: ITEM_TYPE,
    drop: handleDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const backgroundColor = isOver && canDrop ? "bg-blue-50" : "bg-white";
  const borderColor = isOver && canDrop ? "border-blue-300" : "border-gray-200";

  return (
    <div
      ref={drop as any}
      className={`${backgroundColor} rounded-lg border ${borderColor} transition-colors`}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{status.name}</h3>
        <span className="text-sm text-gray-500">
          {status.leadIds?.length || 0} leads
        </span>
      </div>

      {/* Lead Cards */}
      <div className="p-4 space-y-4 min-h-[400px]">
        {status.leadIds?.map((leadId: string) => (
          <LeadCard key={leadId} leadId={leadId} statusName={status.name} />
        ))}

        {/* Drop zone indicator */}
        {isOver && canDrop && (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center text-blue-600">
            Drop lead here
          </div>
        )}
      </div>
    </div>
  );
};
