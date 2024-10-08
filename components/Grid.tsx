import React, { useEffect, useState, useRef, } from 'react';
import Image from 'next/image';
import {
  DndContext,
  useSensor,
  PointerSensor,
  rectIntersection,
} from '@dnd-kit/core';

import {
  ShareIcon,
  PresentationChartLineIcon,
  PercentBadgeIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  XCircleIcon,
  WalletIcon,
} from '@heroicons/react/16/solid';

import { Item, ItemProps } from './Item'; // Import the Item component
import WalletProviderComponent from './Wallet';
import Profile from './Profile';
import axios from 'axios';


// Grid size (150px * 150px)
const GRID_SIZE = 150;

const initialItems: ItemProps[] = [
  {
    id: '1',
    type: 'wl',
    x: 0,
    y: 0,
    symbol: 'ABC',
    token_address: '',
    value: '0.00656',
    token_img_url: 'https://placehold.co/50x50',
  },
  {
    id: '2',
    type: 'tc',
    x: 150,
    y: 0,
    symbol: 'ABC',
    token_address: '',
    value: '7',
    token_img_url: 'https://placehold.co/50x50',
  },
  {
    id: '3',
    type: 'pnl',
    x: 150,
    y: 150,
    symbol: 'ABC',
    token_address: '',
    value: '77.5',
    token_img_url: 'https://placehold.co/50x50',
  },
];

export const Grid = () => {
  const containerRef = useRef(null); 
  const [items, setItems] = useState<ItemProps[]>(initialItems);
  const [itemId, setItemId] = useState(initialItems.length);
  const [tokenAddress, setTokenAddress] = useState(''); 
  const [type, setType] = useState('');
  const [formOpened, setFormOpened] = useState(false);// Initialize form type
  const [isClient, setIsClient] = useState(false); // Track client-side rendering

  // Ensuring client-side rendering to avoid hydration issues
  useEffect(() => {
    setIsClient(true); // Only true after the client has mounted
  }, []);

 

  const handleFormOpened = (type: string) => {
    setFormOpened((prevState) => !prevState);
    setType(type);
  };

  const handleElementSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const apiUrl = 'https://api.dexscreener.com/latest/dex/search?q=';

    // Function to fetch data based on token address
    const fetchData = async (trimmedTokenAddress: string, type: string) => {
      try {
        const res = await axios.get(`${apiUrl}${trimmedTokenAddress}`);
        const totalItems = items.length;
        const itemsPerRow = 6;
        const currentX = (totalItems % itemsPerRow) * GRID_SIZE;
        const currentY = Math.floor(totalItems / itemsPerRow) * GRID_SIZE;

        const data = res.data.pairs[0];
        const symbol = data.quoteToken.symbol;
        const imgUrl = data.info.imageUrl;

        let value;
        switch (type) {
          case 'wl':
            value = data.priceNative.toString();
            break;
          case 'tc':
            setType('LP');
            break;
          case 'pnl':
            setType('Token');
            break;
          default:
            setType('');
            break;
        }

        const newItem = {
          id: `${setItemId((prevItemId) => prevItemId + 1)}`,
          type: type,
          x: currentX,
          y: currentY,
          value: value,
          symbol: symbol,
          token_address: trimmedTokenAddress,
          token_img_url: imgUrl,
        };

        setItems((prevItems) => [...prevItems, newItem]);
        setItemId((prevItemId) => prevItemId + 1);
      } catch (err) {
        console.error(err.message);
      }
    };

    const trimmedTokenAddress = tokenAddress.trim(); // Trim spaces from the input value
    if (trimmedTokenAddress) {
      await fetchData(trimmedTokenAddress, type); // Pass the trimmed value to fetch data
    }
  };

  // Sensors for pointer input
  const sensors = [useSensor(PointerSensor)];

  const roundToGrid = (value: number, gridSize: number) =>
    Math.round(value / gridSize) * gridSize;

  const handleDragEnd = (event: any) => {
    const { active, delta } = event;

    // Find the currently dragged item
    const currentItem = items.find((item) => item.id === active.id);

    if (!currentItem) return;
    // Get the width of the container
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const maxX = containerWidth - 150; // Assuming each item is 150px wide
    

    let newX = roundToGrid(currentItem.x + delta.x, GRID_SIZE);
    let newY = roundToGrid(currentItem.y + delta.y, GRID_SIZE);
    console.log(`OLD : newX: ${newX}, newY: ${newY}`);

    newX = newX < 0 ? 0 : newX;
    newX = Math.min(Math.max(newX, 0), maxX);
    newY = newY < 0 ? 0 : newY;
    console.log(`newX: ${newX}, newY: ${newY}`);
    if (!isPositionOccupied(newX, newY)) {
      setItems((items) =>
        items.map((item) =>
          item.id === active.id
            ? {
                ...item,
                x: newX,
                y: newY,
              }
            : item
        )
      );

    } else {
      console.log(`Position ${newX}, ${newY} is occupied, canceling move.`);
    }
  };
  useEffect(() => {
    console.log("Updated items:", items);
  }, [items]);
  const isPositionOccupied = (x: number, y: number) => {
    return items.some((item) => item.x === x && item.y === y);
  };

  return (
    <div>
      {isClient && ( // Only render after the client has mounted
        <>
          <div className='flex justify-between px-4 py-4 lg:justify-end sm:justify-center'>
            <div className='flex space-x-2'>
            <WalletProviderComponent>
        </WalletProviderComponent>
            </div>
          </div>

          <div className='flex flex-col justify-center items-center w-full py-2'>
            <div className='flex justify-center items-center w-[90vw] max-w-[90vw]'>
              <Profile />
            </div>
          </div>
          <div >
            <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
              <div className='grid-container' ref={containerRef}>
                 {/* Draggable Area */}
                 {items.map((item) => (
                    <Item
                      key={item.id}
                      type={item.type}
                      id={item.id}
                      x={item.x}
                      y={item.y}
                      value={item.value}
                      symbol={item.symbol}
                      token_address={item.token_address}
                      token_img_url={item.token_img_url}
                    />
                  ))}
              </div>
            </DndContext>
          </div>
          <div className='relative w-full'>
            {formOpened ? (
              <div className='relative w-full'>
                <div className='fixed bottom-4 left-0 right-0 flex justify-center z-50'>
                  <form
                    onSubmit={handleElementSubmit}
                    className='flex flex-col space-y-2 w-full max-w-md'
                  >
                    <div className='flex items-center space-x-2'>
                      <input
                        type='text'
                        placeholder='Token address'
                        autoFocus={true}
                        className='text-1xl font-medium py-2 px-2 border-1 bg-white border-white bg-transparent focus:outline-none text-slate-800 rounded-full w-full'
                      />

                      <button className='mx-1 text-white rounded-full bg-transparent p-2'>
                        <CheckBadgeIcon className='size-7' />
                      </button>
                      <button
                        className='mx-1 text-gray-100 bg-transparent'
                        onClick={() => handleFormOpened('')}
                      >
                        <XCircleIcon className='size-7' />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className='relative w-full'>
                <div className='fixed bottom-4 left-0 right-0 flex justify-center z-50'>
                  <div className='flex items-center bg-gray-100 rounded-full p-2 shadow-lg space-x-2'>
                    <div className='relative group'>
                      <button className='bg-green-400 font-bold p-2 rounded-full focus:outline-none focus:ring-2 me-2 text-white flex items-center'>
                        <ShareIcon className='size-5' />
                        &nbsp;&nbsp;Flex
                      </button>
                    </div>

                    <div className='relative group'>
                      <button
                        className='bg-white p-2 rounded-full mx-1 text-slate-900'
                        onClick={() => handleFormOpened('wl')}
                      >
                        <PresentationChartLineIcon className='size-5' />
                      </button>
                      <span className='absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        WatchList
                      </span>
                    </div>

                    <div className='relative group'>
                      <button
                        className='bg-white p-2 rounded-full mx-1 text-slate-900'
                        onClick={() => handleFormOpened('pnl')}
                      >
                        <PercentBadgeIcon className='size-5' />
                      </button>
                      <span className='absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        PnL
                      </span>
                    </div>

                    <div className='relative group'>
                      <button
                        className='bg-white p-2 rounded-full mx-1 text-slate-900'
                        onClick={() => handleFormOpened('tc')}
                      >
                        <CurrencyDollarIcon className='size-5' />
                      </button>
                      <span className='absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        Trade Count
                      </span>
                    </div>

                    <div className='relative group'>
                      <div className='w-24 h-12 overflow-hidden'>
                        <Image
                          src='/FLEXOL.svg'
                          alt='logo'
                          className='ml-2 -mt-5'
                          width={150} // Replace inline style for width
                          height={90} // Replace inline style for height
                          style={{ objectFit: 'cover' }} // You can keep object-fit if necessary
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Grid;
