// components/Item.tsx
import React, { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { EllipsisHorizontalCircleIcon, EllipsisHorizontalIcon, MinusIcon, TrashIcon } from '@heroicons/react/16/solid';
import { pre } from 'framer-motion/client';

// Grid size (150px * 150px)
const GRID_SIZE = 150;
const ITEM_GAP = 20;

export interface ItemProps {
  id: string;
  x: number;
  y: number;
  token_name: string;
  value: string;
  token_address: string;
  token_img_url: string;
  symbol: string;
  percentage: string;
  indicator: string;
  discardItem: (id: string) => void;
  formType: "watchlist" | "pnl" | "tc" | null;
}

export const Item = ({ 
  id, 
  x,
  y, 
  token_name, 
  symbol,
  percentage,
  indicator,
  value,
  token_address, 
  token_img_url, 
  discardItem,
  formType
  }: ItemProps) => {
  

  // Use the useDraggable hook from dnd-kit to enable dragging
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  // const centerX = useMemo(() => window.innerWidth / 2 - GRID_SIZE /2, []);
  // const centerY = useMemo(() => window.innerHeight / 2 - GRID_SIZE / 2, []);

  // Calculate the correct transformation by combining x, y, and current transform
  let finalX = x * (GRID_SIZE + ITEM_GAP) + (transform?.x ?? 0);
  let finalY = y * (GRID_SIZE + ITEM_GAP) + (transform?.y ?? 0);
  
  finalX = Math.max(finalX, 0);
  finalY = Math.max(finalY, 0);

  // Style for each item
  const style = { 
    position: "absolute",
    width: GRID_SIZE,
    height:GRID_SIZE,
    transform: CSS.Translate.toString({
      x: finalX,
      y: finalY,
      scaleX: 1,
      scaleY: 1
    }),
    backgroundColor: isDragging ? 'lightgrey' : 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '30px',
    cursor: 'grab',
    zIndex: isDragging ? 2 : 1, 
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.1)',
    transition: isDragging ? 'none' : 'transform 0.3s ease'
  };

  const handleRemoveItem = (e: React.MouseEvent) => {
    // e.stopPropagation();
    discardItem(id);
  }

  const getFormattedCoeficient = (value: string) => {
    const num = parseFloat(value);
    const scientific = num.toExponential();
    const [coeficient] = scientific.split("e");
  
    // Format the coefficient (2 decimal points, replace '.' with ',' and remove trailing zeros)
    return parseFloat(coeficient).toFixed(2).replace('.', ',').replace(/0+$/, '');
  }

  const getFormattedExponent = (value: string): string => {
    const num = parseFloat(value);
    const scientific = num.toExponential();
    const [, exponent] = scientific.split("e");
  
    // Format the exponent (return as superscript)
    return `10${exponentToSuperscript(parseInt(exponent))}`;
  };

  const exponentToSuperscript = (exp: number): string => {
    const superscriptMap: { [key: number]: string } = {
      0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 
      // 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "-": "⁻"
    };
  
    return exp
      .toString()
      .split("")
      // .map(char => superscriptMap[parseInt(char)] || superscriptMap[char])
      .join("");
  };
  
  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <div className='relative w-full h-full p-4 bg-white rounded-[30px]'>

        <div className='absolute'>
          <img className="rounded-full border border-brown-100" src={token_img_url} style={{ marginRight: '-24px'}}/>
        </div>

        {/* remove item btn */}
        <button className='absolute top-0 right-0 p-2 bg-transparent rounded-[30px] opacity-0 hover:opacity-100 transition-opacity duration-300'
        onClick={handleRemoveItem}
        >
          <TrashIcon className='size-7 text-gray-200'/>
        </button>

 
        <div className='flex flex-col justify-center items-center'>

          <h5 className="text-1xl font-extrabold text-slate-900 mb-4 ms-[3em]">
            {"$"+ (token_name ?? "")}
          </h5>


          <div className='flex items-center space-x-1 text-2xl font-extrabold text-gray-300'>
            <span>{getFormattedCoeficient(value)}</span> x
            <span className='text-1xl font-extrabold text-gray-300'>{getFormattedExponent(value)}</span>
          </div>

          <label className='text-lg font-semibold text-black ms-12 mt-[0.11em]'>
            {symbol}
          </label>

          {formType == "tc" ? (
            <label className='text-lg font-semibold text-black ms-12'>
              
            </label>
          ): null}


        </div>
      

      </div>
    </div>
  );
};

export default Item;
