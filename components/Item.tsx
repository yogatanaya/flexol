// components/Item.tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Grid size (150px * 150px)
const GRID_SIZE = 150;
const ITEM_GAP = 5;

interface ItemProps {
  id: string;
  x: number;
  y: number;
}

export const Item = ({ id, x, y }: ItemProps) => {
  // Use the useDraggable hook from dnd-kit to enable dragging
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  // Calculate the correct transformation by combining x, y, and current transform
  // let finalX = transform?.x ? x + transform.x : x;
  // let finalY = transform?.y ? y + transform.y : y;
  // finalX = finalX < 0 ? 0 : finalX;
  // finalY = finalY < 0 ? 0 : finalY;

  let finalX = x + (transform?.x || 0);
  let finalY = y + (transform?.y || 0);

  // Style for each item
  const style = { 
    position: 'absolute',
    width: GRID_SIZE - 10,
    height: GRID_SIZE - 10,
    transform: CSS.Translate.toString({
      x: finalX + ITEM_GAP,
      y: finalY + ITEM_GAP,
    }),
    backgroundColor: isDragging ? 'lightgrey' : 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '30px',
    cursor: 'grab',
    zIndex: isDragging ? 2 : 1, 
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.1)',
  };
  

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className='grid grid-rows-3 grid-flow-col'>
        <div>
          <h1 className='text-1xl text-black font-extrabold'>$TOKEN</h1>
        </div>
        <div className='row'>
          <p className='text-3xl text-green-500 font-extrabold'>PL%</p>
        </div>
      </div>
    </div>
  );
};

export default Item;
