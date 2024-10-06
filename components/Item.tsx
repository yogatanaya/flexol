// components/Item.tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Grid size (150px * 150px)
const GRID_SIZE = 150;
const ITEM_GAP = 6;

interface ItemProps {
  id: string;
  x: number;
  y: number;
  token_name: string,
  title: string;
  description: string;
  profit_val: string;
  loss_val: string;
  token_img_url: string;
}

export const Item = ({ id, x, y, token_name, title, description, profit_val, loss_val, token_img_url }: ItemProps) => {
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
        <img className="rounded-full" src={token_img_url}/>
        <h5 className="text-1xl font-medium text-slate-900">{title}</h5>
        <span className="text-1xl text-gray-500 -mt-4">{token_name}</span> 
      </div>
    </div>
  );
};

export default Item;
