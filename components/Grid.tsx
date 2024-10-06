import React, { useState } from 'react';
import {
  DndContext,
  useSensor,
  PointerSensor,
  rectIntersection
} from '@dnd-kit/core';
import { Item } from './Item'; // Import the Item component

import Profile from './Profile';

// Grid size (150px * 150px)
const GRID_SIZE = 150;

const initialItems = [
  { id: 'item-1', x: 0 * GRID_SIZE, y: 0*GRID_SIZE },
  { id: 'item-2', x: 1 * GRID_SIZE, y: 0*GRID_SIZE },
  { id: 'item-3', x: 2 * GRID_SIZE, y:0*GRID_SIZE },
  { id: 'item-4', x: 3 * GRID_SIZE, y:0*GRID_SIZE },
  { id: 'item-5', x: 4 * GRID_SIZE, y:0*GRID_SIZE },
  { id: 'item-6', x: 5 * GRID_SIZE, y:0*GRID_SIZE },

  { id: 'item-7', x: 0 * GRID_SIZE, y: 1*GRID_SIZE },
  { id: 'item-8', x: 1 * GRID_SIZE, y: 1*GRID_SIZE },
  { id: 'item-9', x: 2 * GRID_SIZE, y:1*GRID_SIZE },
  { id: 'item-10', x: 3 * GRID_SIZE, y:1*GRID_SIZE },
  { id: 'item-11', x: 4 * GRID_SIZE, y:1*GRID_SIZE },
  { id: 'item-12', x: 5 * GRID_SIZE, y:1*GRID_SIZE }
];

export const Grid = () => {
  const [items, setItems] = useState(initialItems);

  // Sensors for pointer input
  const sensors = [useSensor(PointerSensor)];

  // const roundToGrid = (value, gridSize) => Math.round(value / gridSize) * gridSize;

  const handleDragEnd = (event) => {
    const { active, delta } = event;

    // Find the currently dragged item
    const currentItem = items.find((item) => item.id === active.id);

    if (!currentItem) return;

    setItems((items) => 
      items.map((item) => 
        item.id === active.id 
        ? { ...item, x:currentItem.x, y:currentItem.y+delta.y } 
        : item 
      )
    );

    // Get the current X and Y of the item and add the delta
    /*
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
    */

  };
  
  // Check if any item occupies the given position
  /*
  const isPositionOccupied = (x, y) => {
    items.forEach((item) => {
      console.log(`Checking position: Item ID ${item.id}, X: ${item.x}, Y: ${item.y}`);
    });
  
    const occupied = items.some((item) => item.x === x && item.y === y);
    console.log(`Position (${x}, ${y}) is ${occupied ? "occupied" : "free"}`);
    
    return occupied;
  };
  */

  
  return (

    <>
    <div className='flex px-4 py-4 lg:justify-end sm:justify-center'>
      <div className='flex space-x-2'>
        <button className='bg-slate-900 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 me-2 text-white'>
          <i className='fa-solid fa-share'></i>{" "}{" "}Flex Your Porto
        </button>
        <button className='bg-slate-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2'>
          <i className='fa-solid fa-wallet'></i>{" "}{" "}Connect Wallet
        </button>
      </div>
    </div>
    <div>
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection} // Use collision detection to handle overlap
          onDragEnd={handleDragEnd}
        >
          <Profile/>

          <div className='grid grid-cols-2 gap-4 py-8 sm:p-4 sm:grid-cols-2 lg:grid-cols-3'>
              {items.map((item) => (
                <Item key={item.id} id={item.id} x={item.x} y={item.y} />
              ))}
          </div>
          
        </DndContext>
      </div>
    </div>
    </>
   
  );
};

export default Grid;
