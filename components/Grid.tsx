import React, { act, useState } from 'react';
import {
  DndContext,
  useSensor,
  PointerSensor,
  rectIntersection
} from '@dnd-kit/core';

import { ChartPieIcon, PaperAirplaneIcon, PlusCircleIcon } from '@heroicons/react/16/solid';
import { PresentationChartLineIcon } from '@heroicons/react/16/solid';
import { PercentBadgeIcon } from '@heroicons/react/16/solid';
import { CalculatorIcon } from '@heroicons/react/16/solid';
import { ShareIcon } from '@heroicons/react/16/solid';
import { WalletIcon } from '@heroicons/react/16/solid';
import { XCircleIcon } from '@heroicons/react/16/solid';
import { BookmarkIcon } from '@heroicons/react/16/solid';

import { Item } from './Item'; // Import the Item component
import Profile from './Profile';

// Grid size (150px * 150px)
const GRID_SIZE = 150;

const initialItems = [
  { id: 'item-1', 
    x: 0, 
    y: 0,
    token_name: '$HNTUSD',
    token_address: '',
    trade_count: '5',
    token_img_url: 'https://placehold.co/50x50'
  },
  { id: 'item-2',
    x: 150, 
    y: 0,
    token_name: '$ETHUSD',
    token_address: '',
    trade_count: '2',
    token_img_url: 'https://placehold.co/50x50'
  },
  { id: 'item-3',
    x: 300, 
    y:0,
    token_name: '$BNBUSD',
    token_address: '',
    trade_count: '4',
    token_img_url: 'https://placehold.co/50x50'
  },
];


export const Grid = () => {

  const [items, setItems] = useState(initialItems);
  
  const [tokenName, setTokenName ] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");

  const [formOpened, setFormOpened] = useState(false);

  const handleChangeTokenAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(event.target.value);
  }

  const handleChangeTokenName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokenName(event.target.value);
  }

  const handleFormOpened = () => {
    setFormOpened(prevState => !prevState);
  }

  const handleElementSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const newItem = {
      id: `item-${items.length + 1}`,
      x: 150,
      y: 300,
      token_name: '$Unknown Token',
      trade_count: 0,
      token_address: tokenAddress  ,
      token_img_url: 'https://placehold.co/50x50'
    };

    setItems(prevItems => [...prevItems, newItem]);

    setTokenAddress("");
  }

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
        <button className='bg-slate-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 flex items-center'>
          <WalletIcon className='size-5'/>&nbsp;&nbsp;Connect Wallet
        </button>
      </div>
    </div>

    <div className='flex justify-center items-center w-full py-8'>
      <Profile/>
    </div>

    <div className='flex justify-center items-center'>
      <DndContext 
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      >
        <div style={{ width: '450px', height: '50vh' }}>   
          {items.map((item) => (
            <Item 
            key={item.id} 
            id={item.id} 
            x={item.x} 
            y={item.y} 
            token_name={item.token_name}
            trade_count={item.trade_count}
            token_img_url={item.token_img_url}
            token_address={item.token_address}
            />
          ))} 
        </div>
      </DndContext>
    </div>

    <div className='flex justify-center items-center' >
      {formOpened ? (

        <form onSubmit={handleElementSubmit} className='flex flex-col space-y-2 w-full max-w-md'>
          <div className='relative group'>
            <label htmlFor='token_address' className='mb-1 text-1xl font-extrabold text-gray-100'>Address</label>
            <input
            type='text'
            value={tokenAddress}
            onChange={handleChangeTokenAddress}
            placeholder='Paste Token Address from Your Wallet'
            autoFocus={true}
            className='text-1xl font-medium py-1 px-1 border-1 border-white bg-transparent focus:outline-none text-white rounded-full w-full'
            />

            <div className='relative group'>
              <button className='mx-1 text-white rounded-full bg-transparent p-2'>
                <PlusCircleIcon className='size-7'/>
              </button>
              <button className='mx-1 text-gray-100 bg-transparent' onClick={handleFormOpened}>
                <XCircleIcon className='size-7'/>
              </button>
            </div>


          </div>
        
        </form>
      ):(
        <div className='flex items-center bg-gray-100 rounded-full p-2 shadow-lg'>

          <div className='relative group'>
            <button className='bg-green-400 font-bold p-2 rounded-full focus:outline-none focus:ring-2 me-2 text-white flex items-center'>
              <ShareIcon className='size-5'/>&nbsp;&nbsp;Share
            </button>
          </div>

          <div className='relative group'>
            <button className='bg-white p-2 rounded-full mx-1 text-slate-900' onClick={handleFormOpened}>
              <PresentationChartLineIcon className='size-5'/>
            </button>
            <span className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              WatchList
            </span>
          </div>

          <div className='relative group'>
            <button className='bg-white p-2 rounded-full mx-1 text-slate-900' onClick={handleFormOpened}>
              <PercentBadgeIcon className='size-5'/>
            </button>
            <span className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              PnL
            </span>
          </div>

          <div className='relative group'>
            <button className='bg-white p-2 rounded-full mx-1 text-slate-900' onClick={handleFormOpened}>
              <CalculatorIcon className='size-5'/>
            </button>
            <span className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Transaction Count
            </span>
          </div>
        </div>
      )}

     
    </div>

  </>
   
  );
};

export default Grid;
