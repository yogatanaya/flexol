import React, { act, useEffect, useState } from 'react';
import {
  DndContext,
  useSensor,
  PointerSensor,
  rectIntersection
} from '@dnd-kit/core';

import Image from 'next/image';

import { ChartPieIcon, CheckBadgeIcon, CircleStackIcon, CurrencyDollarIcon, PaperAirplaneIcon, PlusCircleIcon } from '@heroicons/react/16/solid';
import { PresentationChartLineIcon } from '@heroicons/react/16/solid';
import { PercentBadgeIcon } from '@heroicons/react/16/solid';
import { CalculatorIcon } from '@heroicons/react/16/solid';
import { ShareIcon } from '@heroicons/react/16/solid';
import { WalletIcon } from '@heroicons/react/16/solid';
import { XCircleIcon } from '@heroicons/react/16/solid';
import { BookmarkIcon } from '@heroicons/react/16/solid';

import { Item, ItemProps } from './Item'; // Import the Item component
import Profile from './Profile';

import axios from 'axios';
import { a } from 'framer-motion/client';

// Grid size (150px * 150px)
const GRID_SIZE = 150;

const initialItems: ItemProps[] = [
  /*
  { id: 'item-1', 
    x: 0, 
    y: 0,
    token_name: '$HNTUSD',
    token_address: '',
    trade_count: 5,
    token_img_url: 'https://placehold.co/50x50'
  },
  { id: 'item-2',
    x: 150, 
    y: 0,
    token_name: '$ETHUSD',
    token_address: '',
    trade_count: 2,
    token_img_url: 'https://placehold.co/50x50'
  },
  { id: 'item-3',
    x: 300, 
    y:0,
    token_name: '$BNBUSD',
    token_address: '',
    trade_count: 4,
    token_img_url: 'https://placehold.co/50x50'
  },
  { id: 'item-4',
    x: 450, 
    y:0,
    token_name: '$TOKEN4',
    token_address: '',
    trade_count: 4,
    token_img_url: 'https://placehold.co/50x50'
  }
  */
];


export const Grid = () => {

  const [items, setItems] = useState<ItemProps[]>([]);
  
  const [tokenName, setTokenName ] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");

  const [formOpened, setFormOpened] = useState(false);

  const [formType, setFormType ] = useState<"watchlist" | "pnl" | "tc" | null >();

  const [error, setError] = useState(null);

  const handleChangeTokenAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(event.target.value);
  }

  const handleChangeTokenName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokenName(event.target.value);
  }

  const handleFormOpened = (type: "watchlist" | "pnl" | "tc") => {
    setFormType(type);
    setFormOpened(prevState => !prevState);
  }

  const handleElementSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    let apiUrl = "https://api.dexscreener.com/latest/dex/search?q=";

    let type = formType;
    
    const fetchData = async() => {

      try 
      {
        let res = await axios.get(`${apiUrl}${tokenAddress}`);

        let totalItems = items.length;

        const itemsPerRow = 6;

        let currentX = (totalItems % itemsPerRow) * GRID_SIZE;
        let currentY = Math.floor(totalItems / itemsPerRow) * GRID_SIZE;

        let data = res.data.pairs[0];

        let tokenName = "";

        switch(type) 
        {
          case 'watchlist': 
            tokenName = data.baseToken.name;
          break;
          case 'pnl': 
            tokenName = 'Unknown';
          break;
          case 'tc':
            tokenName = 'Unknown';
          break;
        }

        let imgUrl = data.info.imageUrl;
        let randomNum = Math.floor(Math.random() * 100) +1;

        let newItems = {
          id: 'Item-'+randomNum,
          x: currentX,
          y: currentY,
          token_name: tokenName,
          token_address: tokenAddress,
          token_img_url: imgUrl
        }

        setItems(prevItems => [...prevItems, newItems]);

  
      } catch(err: any) {
        setError(err.message);
      }

    }

    fetchData();
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
  
    // console.log(`Dragged item: ${active.id}`);
    // console.log(`NewX: ${newX}, NewY: ${newY}`);
    // console.log(`Position Occupied: ${isPositionOccupied(newX, newY)}`);
  
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
    // items.forEach((item) => {
    //   console.log(`Checking position: Item ID ${item.id}, X: ${item.x}, Y: ${item.y}`);
    // });
  
    const occupied = items.some((item) => item.x === x && item.y === y);
    // console.log(`Position (${x}, ${y}) is ${occupied ? "occupied" : "free"}`);
    
    return occupied;
  };

  const handleDiscardItem = (id: any) => { 
    
    setItems(items.filter((item) => item.id !== id));
    
  }
  
  return (
    <>
    
    <div className='flex justify-between px-4 py-4 lg:justify-end sm:justify-center'>
      <div className='flex space-x-2'>
        <button className='bg-slate-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 flex items-center'>
          <WalletIcon className='size-5'/>&nbsp;&nbsp;Connect Wallet
        </button>
      </div>
    </div>

    <div className='flex flex-col justify-center items-center w-full py-2'>
      <div className='flex justify-center items-center w-[90vw] max-w-[90vw]'>
        <Profile/>
      </div>
    </div>

    <div className='flex justify-center items-center min-h-screen'>
      <DndContext 
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      >
        {/* CENTER DRAGGABLE AREA */}
        <div className='relative w-[90vw] max-w-full h-[90vh] flex justify-center'>
          <div className='relative w-full h-full items-center'>   
            {items.map((item) => (
              <Item key={item.id} {...item} discardItem={handleDiscardItem}/>
            ))} 
          </div>
        </div>
      </DndContext>
    </div>

    <div className='relative w-full'>
      {formOpened ? (

        <div className='relative w-full'>
          <div className='fixed bottom-4 left-0 right-0 flex justify-center z-50'>
            <form onSubmit={handleElementSubmit} className='flex flex-col space-y-2 w-full max-w-md'>

              <div className='flex items-center space-x-2'>
                <input
                  type='text'
                  value={tokenAddress}
                  onChange={handleChangeTokenAddress}
                  placeholder='Paste Token Address from Your Wallet'
                  autoFocus={true}
                  className='text-1xl font-medium py-2 px-2 border-1 bg-white border-white bg-transparent focus:outline-none text-slate-800 rounded-full w-full'
                  />

                  <button className='mx-1 text-white rounded-full bg-transparent p-2'>
                    <CheckBadgeIcon className='size-7'/>
                  </button>
                  <button className='mx-1 text-gray-100 bg-transparent' onClick={handleFormOpened}>
                    <XCircleIcon className='size-7'/>
                  </button>
              </div>

            
            </form>
          </div>
        </div>

       
      ):(
        <div className='relative w-full'>

          <div className='fixed bottom-4 left-0 right-0 flex justify-center z-50'>
            <div className='flex items-center bg-gray-100 rounded-full p-2 shadow-lg space-x-2'>
              
              <div className='relative group'>
                <button className='bg-green-400 font-bold p-2 rounded-full focus:outline-none focus:ring-2 me-2 text-white flex items-center'>
                  <ShareIcon className='size-5'/>&nbsp;&nbsp;Flex
                </button>
              </div>

              <div className='relative group'>
                <button className='bg-white p-2 rounded-full mx-1 text-slate-900' onClick={() => handleFormOpened("watchlist")}>
                  <PresentationChartLineIcon className='size-5'/>
                </button>
                <span className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  WatchList
                </span>
              </div>

              <div className='relative group'>
                <button className='bg-white p-2 rounded-full mx-1 text-slate-900' onClick={() => handleFormOpened("pnl")}>
                  <PercentBadgeIcon className='size-5'/>
                </button>
                <span className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  PnL
                </span>
              </div>
                  
              <div className='relative group'>
                <button className='bg-white p-2 rounded-full mx-1 text-slate-900' onClick={() => handleFormOpened("tc")}>
                  <CurrencyDollarIcon className='size-5'/>
                </button>
                <span className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Transaction Count
                </span>
              </div>

              <div className='relative group'>
                <div className='w-24 h-12 overflow-hidden'>
                  <img src='/FLEXOL.svg' alt="logo" className='ml-2 -mt-5'
                  style={{ width: '150px', height: '90px', objectFit: 'cover'}}
                  />      
                </div>
              </div>

            </div>

          </div>  

        </div>
      )}

     
    </div>

  </>
   
  );
};

export default Grid;
