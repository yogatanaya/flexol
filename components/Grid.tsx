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
    x: 0, 
    y: 0,
    token_name: '$HNTUSD',
    title: 'Portfolio 1',
    description: '!!!lorem ipsum!!!',
    wallet_val: '+55.25%',
    token_img_url: 'https://placehold.co/50x50'
  },
  { id: 'item-2',
    x: 150, 
    y: 0,
    token_name: '$ETHUSD',
    title: 'Portfolio 2',
    description: '!!!lorem ipsum!!!',
    wallet_val: '+0.00%',
    token_img_url: 'https://placehold.co/50x50'
  },
  { id: 'item-3',
    x: 300, 
    y:0,
    token_name: '$BNBUSD',
    title: 'Portfolio 3',
    description: '!!!lorem ipsum!!!',
    wallet_val: '+00.00%',
    token_img_url: 'https://placehold.co/50x50'
  },
];


export const Grid = () => {

  const [items, setItems] = useState(initialItems);

  const [titleElm, setTitleElm] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [description, setDescription] = useState("");

  const [formOpened, setFormOpened] = useState(false);

  const handleTitleElmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleElm(event.target.value);
  }

  const handleTokenNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokenName(event.target.value);
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  }

  const handleFormOpened = () => {
    setFormOpened(prevState => !prevState);
  }

  const handleElementSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newItem = {
      id: `item-${items.length + 1}`,
      x: 0,
      y: 0,
      token_name: tokenName,
      title: titleElm,
      description: description,
      wallet_val: '+0.00%',
      token_img_url: 'https://placehold.co/50x50'
    };
    setItems(prevItems => [...prevItems, newItem]);
    setFormOpened(false);
    setTitleElm('');
    setTokenName('');
    setDescription('');
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
        <button className='bg-slate-900 font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 me-2 text-white'>
          <i className='fa-solid fa-share'></i>{" "}{" "}Flex Your Porto
        </button>
        <button className='bg-slate-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2'>
          <i className='fa-solid fa-wallet'></i>{" "}{" "}Connect Wallet
        </button>
      </div>
    </div>

    <div className='flex justify-center items-center w-full py-8'>
      <div className='flex flex-col ms-10'>
      {formOpened ? (
        <form onSubmit={handleElementSubmit} className='flex flex-col space-y-2 w-full max-w-md'>
          <div className='flex flex-col'>
              <label htmlFor='titleElm' className='mb-1 text-sm font-medium text-gray-400'>Title</label>
              <input
              type='text'
              value={titleElm}
              onChange={handleTitleElmChange}
              placeholder='e. g: My Portfolio'
              autoFocus={true}
              className='text-2xl font-extrabold py-1 px-2 border-b-2 border-white bg-transparent focus:outline-none text-white'
              />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='description' className='mb-1 text-sm font-medium text-gray-400'>Description</label>
            <input
              type='text'
              value={description}
              onChange={handleDescriptionChange}
              placeholder='e. g: My HODL Savings✨'
              autoFocus={true}
              className='text-2xl font-extrabold py-1 px-2 border-b-2 border-white bg-transparent focus:outline-none text-white'
              />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='tokenName' className='mb-1 text-sm font-medium text-gray-400'>Token Name</label>
            <input
            type='text'
            value={tokenName}
            onChange={handleTokenNameChange}
            placeholder='e. g: $HNTUSD or $ETH'
            autoFocus={true}
            className='text-2xl font-extrabold py-1 px-2 border-b-2 border-white bg-transparent focus:outline-none text-white'
            />
          </div>
          <button type="submit" className='bg-pink-500 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 me-2 text-white'>
            Submit
          </button>
        </form>
        ):(
        <button className='bg-pink-500 font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 me-2 text-white'
        onClick={handleFormOpened}
        >
          <i className='fa-solid fa-plus'></i>{" "}New Element
        </button>
        )}
      </div>
      <Profile/>
    </div>

    <div className='flex justify-center items-center'>
      <DndContext 
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      >
        <div className='relative' style={{ width: '450px', height: '340px' }}>   
          {items.map((item) => (
            <Item 
            key={item.id} 
            id={item.id} 
            x={item.x} 
            y={item.y} 
            title={item.title}
            token_name={item.token_name}
            description={item.description}
            wallet_val={item.wallet_val}
            token_img_url={item.token_img_url}
            />
          ))} 
        </div>
      </DndContext>
    </div>
  </>
   
  );
};

export default Grid;
