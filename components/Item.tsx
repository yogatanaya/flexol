// components/Item.tsx
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { EllipsisHorizontalCircleIcon, EllipsisHorizontalIcon, MinusIcon, TrashIcon } from '@heroicons/react/16/solid';

// Grid size (150px * 150px)
const GRID_SIZE = 180;
const ITEM_GAP = 6;

export interface ItemProps {
  id: string;
  x: number;
  y: number;
  token_name: string;
  token_address: string;
  trade_count: number;
  token_img_url: string;
  discardItem: (id: string) => void;
}

export const Item = ({ 
  id, 
  x,
  y, 
  token_name, 
  token_address, 
  trade_count, 
  token_img_url, 
  discardItem 
  }: ItemProps) => {

    const [ isCollapsed, setIsCollapsed ] = useState(false);
  
    const handleCollapsed = (e: React.MouseEvent) => {
      e.stopPropagation();

      setIsCollapsed(!isCollapsed);
    }

    const handleRemoveItem = (e: React.MouseEvent) => {
      e.stopPropagation();

      discardItem(id);
    }


    // Use the useDraggable hook from dnd-kit to enable dragging
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const centerX = window.innerWidth / 2 - GRID_SIZE/2;
  const centerY = window.innerHeight /2 - GRID_SIZE/2;

  // Calculate the correct transformation by combining x, y, and current transform
  let finalX = transform?.x ? x + centerX: x;
  let finalY = transform?.y ? y + centerY : y;
  
  finalX = finalX < 0 ? 0 : finalX;
  finalY = finalY < 0 ? 0 : finalY;

  // Style for each item
  const style = { 
    position: 'absolute',
    width: GRID_SIZE - 10,
    height: isCollapsed ? (GRID_SIZE /2) - 1 : GRID_SIZE - 1,
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
    transition: 'height 0.3s ease'
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className='relative w-full h-full p-4 bg-white rounded-[30px]'>

        {/* token image in left corner */}
        {!isCollapsed && (
          <div className='absolute -top-5 -left-5'>
            <img className="rounded-full" src={token_img_url}/>
          </div>
        )}

        {/* remove item btn */}
        <button className='absolute top-0 right-0 p-2 bg-transparent rounded-[30px] opacity-0 hover:opacity-100 transition-opacity duration-300'
        onClick={handleRemoveItem}
        >
          <TrashIcon className='size-7 text-gray-200'/>
        </button>

        {/* collapsed content */}
        {isCollapsed ? (
          <div className='flex items-center justify-center w-full'>
            <h5 className='text-1xl font-extrabold text-slate-900 text-center'>{token_name}</h5>
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center'>
            <h5 className="text-1xl font-extrabold text-slate-900 mb-4">{token_name}</h5>
            <div className='text-3xl font-extrabold'>
              {trade_count ?? 0}x <span className='text-lg font-semibold'></span> 
            </div>
          </div>
        )}

        <div className='flex justify-center mt-1'>
          <button className='bg-transparent bottom-2 mt-3' onClick={handleCollapsed}>
            <EllipsisHorizontalIcon className='size-7 text-gray-400'/>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Item;
