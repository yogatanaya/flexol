import React, { useState } from 'react';
import {
  DndContext,
  useSensor,
  PointerSensor,
  rectIntersection
} from '@dnd-kit/core';
import { Item } from './Item'; // Import the Item component

// Grid size (150px * 150px)
const GRID_SIZE = 150;

const initialItems = [
  { id: 'item-1', x: 0, y: 0 },
  { id: 'item-2', x: 150, y: 0 },
];

export const Grid = () => {
  const [items, setItems] = useState(initialItems);

  // Sensors for pointer input
  const sensors = [useSensor(PointerSensor)];

  const roundToGrid = (value, gridSize) => Math.round(value / gridSize) * gridSize;
  const handleDragEnd = (event) => {
    const { active, delta } = event;
  
     // Find the currently dragged item
  const currentItem = items.find((item) => item.id === active.id);

  if (!currentItem) return;

  // Get the current X and Y of the item and add the delta
    let newX = roundToGrid(currentItem.x + delta.x, GRID_SIZE);
    let newY = roundToGrid(currentItem.y + delta.y, GRID_SIZE);
    newX = newX < 0 ? 0 : newX;
    newY = newY < 0 ? 0 : newY;
  
    console.log(`Dragged item: ${active.id}`);
    console.log(`NewX: ${newX}, NewY: ${newY}`);
    console.log(`Position Occupied: ${isPositionOccupied(newX, newY)}`);
  
    // Cancel movement if the new position is occupied
    if (!isPositionOccupied(newX, newY)) {
      setItems((items) =>
        items.map((item) =>
          item.id === active.id ? { ...item, x: newX, y: newY } : item
        )
      );
    } else {
      console.log(`Position ${newX}, ${newY} is occupied, canceling move.`);
    }
  };
  
  // Check if any item occupies the given position
  const isPositionOccupied = (x, y) => {
    items.forEach((item) => {
      console.log(`Checking position: Item ID ${item.id}, X: ${item.x}, Y: ${item.y}`);
    });
  
    const occupied = items.some((item) => item.x === x && item.y === y);
    console.log(`Position (${x}, ${y}) is ${occupied ? "occupied" : "free"}`);
    
    return occupied;
  };
  
  return (

    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection} // Use collision detection to handle overlap
        onDragEnd={handleDragEnd}
      >
        <div className="grid-container relative w-full h-full">
          {items.map((item) => (
            <Item key={item.id} id={item.id} x={item.x} y={item.y} />
          ))}
        </div>
      </DndContext>
    </div>
   
  );
};

export default Grid;
