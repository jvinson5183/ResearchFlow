import React from 'react';
import {
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Table,
  Text,
} from '@fluentui/react-components';
import { Test } from '../types';
import { TestListItem } from './TestListItem';

interface TestListProps {
  tests: Test[];
  onEditTest: (test: Test) => void;
  onDeleteTest: (testId: string) => void;
  moveTest: (dragIndex: number, hoverIndex: number) => void;
}

export const TestList: React.FC<TestListProps> = ({ tests, onEditTest, onDeleteTest, moveTest }) => {
  return (
    <div>
      <Table aria-label="Tests table">
        <TableHeader>
          <TableRow>
            <TableHeaderCell style={{ width: '50px' }} />
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Est. Duration</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.length > 0 ? (
            tests.map((test, index) => (
              <TestListItem 
                key={test.id} 
                test={test} 
                index={index}
                onEdit={onEditTest} 
                onDelete={onDeleteTest}
                moveTest={moveTest}
              />
            ))
          ) : (
            <TableRow>
              <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
                <Text>No tests available</Text>
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}; 