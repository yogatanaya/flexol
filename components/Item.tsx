import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Grid size (150px * 150px)
const GRID_SIZE = 150;

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
  let finalX = transform?.x ? x + transform.x : x;
  let finalY = transform?.y ? y + transform.y : y;
  finalX = finalX < 0 ? 0 : finalX;
  finalY = finalY < 0 ? 0 : finalY;

  // Style for each item
  const style = {
    position: 'absolute',
    width: GRID_SIZE,
    height: GRID_SIZE,
    transform: CSS.Translate.toString({
      x: finalX,
      y: finalY,
    }),
    backgroundColor: isDragging ? 'lightgrey' : 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '25px',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
};

export default Item;
