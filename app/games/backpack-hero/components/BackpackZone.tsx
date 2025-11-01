import { Button } from "@/components/ui/button";
import { Item } from "../types";

interface BackpackZoneProps {
  backpackItems: string[];
  correctItems: string[];
  allItems: Item[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemove: (itemId: string) => void;
  onSubmit: () => void;
}

export function BackpackZone({
  backpackItems,
  correctItems,
  allItems,
  onDragOver,
  onDrop,
  onRemove,
  onSubmit,
}: BackpackZoneProps) {
  const getItemById = (id: string) => allItems.find(item => item.id === id);

  return (
    <div 
      className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border-4 border-dashed border-blue-500/50"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>🎒</span> Your Backpack ({backpackItems.length} items)
      </h3>
      
      {backpackItems.length === 0 ? (
        <div className="h-[450px] flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg">
          <div className="text-center text-slate-400">
            <div className="text-6xl mb-4">🎒</div>
            <p className="text-lg">Drag items here</p>
            <p className="text-sm">Choose wisely based on the scenario!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 max-h-[500px] overflow-y-auto">
          {backpackItems.map(itemId => {
            const item = getItemById(itemId);
            if (!item) return null;
            const isCorrect = correctItems.includes(itemId);
            
            return (
              <div
                key={itemId}
                className={`
                  relative p-4 rounded-lg text-center
                  ${isCorrect ? 'bg-green-600/30 border-2 border-green-500' : 'bg-red-600/30 border-2 border-red-500'}
                  transition-all
                `}
              >
                <button
                  onClick={() => onRemove(itemId)}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                >
                  ✕
                </button>
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="text-xs font-semibold leading-tight">{item.name}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 text-center">
        <Button
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3"
        >
          Submit & Next Level →
        </Button>
      </div>
    </div>
  );
}
