export const ITEM_TYPE = "LEAD" as const;

export interface DragItem {
  id: string;
  statusName: string;
  type: typeof ITEM_TYPE;
  index: number;
}

export interface DragCollectedProps {
  isDragging: boolean;
}

export interface DropCollectedProps {
  isOver: boolean;
  canDrop: boolean;
}
