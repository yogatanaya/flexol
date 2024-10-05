import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  PointerSensor,
  rectIntersection,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Item } from './Item'; // Import the Item component

// Grid size (150px * 150px)
const GRID_SIZE = 150;

const initialItems = [
  { id: 'item-1', x: 0, y: 0 },
  { id: 'item-2', x: 150, y: 150 },
];

export const Grid = () => {
  const [items, setItems] = useState(initialItems);

  // Sensors for pointer input
  const sensors = [useSensor(PointerSensor)];

  // Handle the drag end event
  const handleDragEnd = (event) => {
    const { active, over, delta } = event;

    // Detect collision
    if (over && active.id !== over.id) {
      // Push logic if a collision is detected
      pushItems(over.id);
    }

    setItems((items) =>
      items.map((item) =>
        item.id === active.id
          ? {
              ...item,
              x: Math.max(0, Math.round((item.x + delta.x) / GRID_SIZE) * GRID_SIZE),
              y: Math.max(0, Math.round((item.y + delta.y) / GRID_SIZE) * GRID_SIZE),
            }
          : item
      )
    );
  };

  const pushItems = (overId) => {
    // Find the item being overlapped
    const overlappedItem = items.find((item) => item.id === overId);

    if (!overlappedItem) return;

    // Find the next available position based on current position
    const nextPosition = findNextAvailablePosition(overlappedItem.x, overlappedItem.y);

    // Move the overlapped item to the next available position
    setItems((items) =>
      items.map((item) =>
        item.id === overId
          ? {
              ...item,
              x: nextPosition.x,
              y: nextPosition.y,
            }
          : item
      )
    );
  };

  const findNextAvailablePosition = (x, y) => {
    // Check if the next position down is available
    const nextY = y + GRID_SIZE;
    const nextX = x + GRID_SIZE;
    
    if (!isPositionOccupied(x, nextY)) {
      return { x, y: nextY };
    }

    if (!isPositionOccupied(nextX, y)) {
      return { x: nextX, y };
    }

    return { x, y };
  };

  const isPositionOccupied = (x, y) => {
    // Check if any item occupies this position
    return items.some((item) => item.x === x && item.y === y);
  };

  return (
    <div>
     <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection} // Detects overlap between items
        onDragEnd={handleDragEnd}
      >
        <div className="grid-container relative w-full h-full bg-gray-100">
          {items.map((item) => (
            <Item key={item.id} id={item.id} x={item.x} y={item.y} />
          ))}
        </div>
      </DndContext>
    </div>
   
  );
};

export default Grid;
