import React, { useRef, useState } from 'react';
import { TableCell, TableRow, Text, Button, makeStyles, tokens, shorthands } from '@fluentui/react-components';
import { EditRegular, DeleteRegular, DragRegular, ChevronDownRegular, ChevronRightRegular } from '@fluentui/react-icons';
import { Test, TestStatus } from '../types';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import type { Identifier } from 'dnd-core';
import { amberDark, redDark, greenDark } from '@radix-ui/colors';

export const ItemTypes = {
  TEST: 'test',
};

const useStyles = makeStyles({
  previewRow: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  previewCell: {
    padding: '16px 12px',
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke1),
  },
  previewContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '16px',
  },
  previewSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  previewLabel: {
    fontWeight: 'bold',
    color: tokens.colorNeutralForeground3,
    marginBottom: '4px',
  },
  previewItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  testStatus: {
    padding: '2px 8px',
    ...shorthands.borderRadius('4px'),
    display: 'inline-flex',
    width: 'fit-content',
    fontWeight: '500',
  },
  statusPending: {
    backgroundColor: amberDark.amber4,
    color: amberDark.amber11,
  },
  statusInProgress: {
    backgroundColor: redDark.red4,
    color: redDark.red11,
  },
  statusCompleted: {
    backgroundColor: greenDark.green4,
    color: greenDark.green11,
  },
});

interface TestListItemProps {
  test: Test;
  index: number;
  onEdit: (test: Test) => void;
  onDelete: (testId: string) => void;
  moveTest: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const TestListItem: React.FC<TestListItemProps> = ({ test, index, onEdit, onDelete, moveTest }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const classes = useStyles();
  const rowRef = useRef<HTMLTableRowElement>(null);
  const dragIconRef = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ItemTypes.TEST,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!rowRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = rowRef.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveTest(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TEST,
    item: () => {
      return { id: test.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Apply the drop ref to the row
  drop(rowRef);
  
  // Apply the drag ref to the drag handle
  drag(dragIconRef);

  const opacity = isDragging ? 0.4 : 1;

  const handleRowClick = () => {
    setIsExpanded(!isExpanded);
  };

  const getStatusClassName = () => {
    switch (test.status) {
      case TestStatus.Pending:
        return classes.statusPending;
      case TestStatus.InProgress:
        return classes.statusInProgress;
      case TestStatus.Completed:
        return classes.statusCompleted;
      default:
        return '';
    }
  };

  const getStatusLabel = () => {
    return test.status;
  };

  return (
    <>
      <TableRow 
        ref={rowRef} 
        style={{ opacity, cursor: 'pointer' }} 
        data-handler-id={handlerId}
        onClick={handleRowClick}
      >
        <TableCell style={{ width: '50px', textAlign: 'center' }}>
          <div 
            ref={dragIconRef} 
            style={{ 
              cursor: 'grab', 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px'
            }}
            aria-label="Drag handle"
            role="graphics-symbol"
            onClick={(e) => e.stopPropagation()}
          >
            <DragRegular />
          </div>
        </TableCell>
        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isExpanded ? <ChevronDownRegular /> : <ChevronRightRegular />}
            <Text weight="semibold">{test.name}</Text>
          </div>
        </TableCell>
        <TableCell>
          <Text>{test.description || 'N/A'}</Text>
        </TableCell>
        <TableCell>
          <Text>{test.estimatedDuration} min</Text>
        </TableCell>
        <TableCell style={{ display: 'flex', gap: '8px' }}>
          <Button 
            icon={<EditRegular />} 
            aria-label={`Edit ${test.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(test);
            }} 
            appearance="subtle"
          />
          <Button
            icon={<DeleteRegular />}
            aria-label={`Delete ${test.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(test.id);
            }}
            appearance="subtle"
            style={{ color: 'var(--colorStatusDanger)' }}
          />
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow className={classes.previewRow}>
          <TableCell colSpan={5} className={classes.previewCell}>
            <div className={classes.previewContent}>
              <div className={classes.previewSection}>
                <div className={classes.previewItem}>
                  <Text className={classes.previewLabel}>Status: </Text>
                  <div className={`${classes.testStatus} ${getStatusClassName()}`}>
                    {getStatusLabel()}
                  </div>
                </div>
                
                <div className={classes.previewItem}>
                  <Text className={classes.previewLabel}>Estimated Duration: </Text>
                  <Text>{test.estimatedDuration} minutes</Text>
                </div>
              </div>
              
              <div className={classes.previewSection}>
                <div className={classes.previewItem}>
                  <Text className={classes.previewLabel}>Description: </Text>
                  <Text>{test.description || 'No description provided.'}</Text>
                </div>
                
                <div className={classes.previewItem}>
                  <Text className={classes.previewLabel}>Test ID: </Text>
                  <Text>{test.id}</Text>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}; 