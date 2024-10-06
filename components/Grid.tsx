import React, { act, useState } from 'react';
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
  { id: 'item-1', 
    x: 0 * GRID_SIZE, 
    y: 0*GRID_SIZE,
    token_name: '$HNTUSD',
    title: 'Portfolio 1',
    description: '!!!lorem ipsum!!!',
    profit_val: '+55.25%',
    loss_val: '0.00%',
    token_img_url: 'https://placehold.co/50x50'
  },
  { id: 'item-2',
    x: 1 * GRID_SIZE, 
    y: 0*GRID_SIZE,
    token_name: '$ETHUSD',
    title: 'Portfolio 2',
    description: '!!!lorem ipsum!!!',
    profit_val: '+0.00%',
    loss_val: '-2.55%',
    token_img_url: 'https://placehold.co/50x50'
  },
  { id: 'item-3',
    x: 2 * GRID_SIZE, 
    y:0*GRID_SIZE,
    token_name: '$BNBUSD',
    title: 'Portfolio 3',
    description: '!!!lorem ipsum!!!',
    profit_val: '+00.00%',
    loss_val: '-20.45%',
    token_img_url: 'https://placehold.co/50x50'
  },
];


export const Grid = () => {

  const [items, setItems] = useState(initialItems);

  console.log(items);

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

          <h1 className='text-2xl text-white font-extrabold ms-8 mt-8'>My Assets</h1>

          <div className='grid grid-cols-2 gap-4 py-8 sm:p-4 sm:grid-cols-2 lg:grid-cols-3'>
              {items.map((item) => (
                <Item 
                key={item.id} 
                id={item.id} 
                x={item.x} 
                y={item.y} 
                title={item.title}
                token_name={item.token_name}
                description={item.description}
                profit_val={item.profit_val}
                loss_val={item.loss_val}
                token_img_url={item.token_img_url}
                />
              ))}
          </div>
          
        </DndContext>
      </div> 

    </div>
    </>
   
  );
};

export default Grid;
