import { Item } from "../types";

interface ItemCardProps {
  item: Item;
  disabled: boolean;
  onDragStart: (e: React.DragEvent, itemId: string) => void;
}

export function ItemCard({ item, disabled, onDragStart }: ItemCardProps) {
  return (
    <div
      draggable={!disabled}
      onDragStart={(e) => onDragStart(e, item.id)}
      className={`
        bg-slate-700/50 p-4 rounded-lg text-center cursor-move
        transition-all hover:scale-105 hover:bg-slate-700
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-lg'}
      `}
    >
      <div className="text-3xl mb-2">{item.emoji}</div>
      <div className="text-xs font-semibold leading-tight">{item.name}</div>
    </div>
  );
}
