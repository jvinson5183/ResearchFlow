import React, { useState, useCallback } from 'react';
import {
  Title1,
  Button,
  makeStyles,
  shorthands,
  tokens,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
} from '@fluentui/react-components';
import { AddRegular } from '@fluentui/react-icons';
import { TestList } from '../features/tests/components/TestList';
import { AddTestDialog } from '../features/tests/components/AddTestDialog';
import { Test, TestStatus } from '../features/tests/types';
import update from 'immutability-helper';

const useStyles = makeStyles({
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.margin(0, 0, tokens.spacingVerticalL, 0),
  },
});

const initialTests: Test[] = [
  {
    id: 't1',
    name: 'Cognitive Assessment A',
    description: 'Standardized cognitive function test, version A.',
    estimatedDuration: 30,
    status: TestStatus.Pending,
  },
  {
    id: 't2',
    name: 'Motor Skills Test B',
    description: 'Assesses fine and gross motor skills.',
    estimatedDuration: 45,
    status: TestStatus.InProgress,
  },
  {
    id: 't3',
    name: 'User Feedback Survey',
    description: 'Gathers user feedback post-testing.',
    estimatedDuration: 15,
    status: TestStatus.Completed,
  },
];

export const TestsPage: React.FC = () => {
  const classes = useStyles();
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [isAddTestDialogOpen, setIsAddTestDialogOpen] = useState(false);
  
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [isEditTestDialogOpen, setIsEditTestDialogOpen] = useState(false);
  
  // For delete confirmation
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAddTestSubmit = (newTestData: Omit<Test, 'id'>) => {
    const newTest: Test = {
      ...newTestData,
      id: `t${Date.now()}`,
      status: newTestData.status || TestStatus.Pending, 
    };
    setTests(prevTests => [...prevTests, newTest]);
    setIsAddTestDialogOpen(false);
  };

  const handleOpenEditDialog = (test: Test) => {
    setEditingTest(test);
    setIsEditTestDialogOpen(true);
  };

  const handleEditTestSubmit = (updatedTestData: Omit<Test, 'id'>) => {
    if (!editingTest) return;
    setTests(prevTests => 
      prevTests.map(test => 
        test.id === editingTest.id ? { ...editingTest, ...updatedTestData } : test 
      )
    );
    setIsEditTestDialogOpen(false);
    setEditingTest(null);
  };
  
  const handleOpenDeleteDialog = (testId: string) => {
    setTestToDelete(testId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteTest = () => {
    if (!testToDelete) return;
    setTests(prevTests => prevTests.filter(test => test.id !== testToDelete));
    setIsDeleteDialogOpen(false);
    setTestToDelete(null);
  };

  // Callback for react-dnd to move tests
  const moveTest = useCallback((dragIndex: number, hoverIndex: number) => {
    // Debug drag events
    console.log(`Moving test from index ${dragIndex} to ${hoverIndex}`);
    
    setTests((prevTests: Test[]) => {
      // Make a shallow copy of the tests array
      const updatedTests = [...prevTests];
      
      // Get the test that is being dragged
      const draggedTest = updatedTests[dragIndex];
      
      // Remove the test at dragIndex
      updatedTests.splice(dragIndex, 1);
      
      // Insert the test at hoverIndex
      updatedTests.splice(hoverIndex, 0, draggedTest);
      
      return updatedTests;
    });
  }, []);

  return (
    <div>
      <div className={classes.pageHeader}>
        <Title1 as="h1">Tests</Title1>
        <Button 
          icon={<AddRegular />} 
          appearance="primary" 
          onClick={() => setIsAddTestDialogOpen(true)}
        >
          Add Test
        </Button>
      </div>
      <TestList 
        tests={tests} 
        onEditTest={handleOpenEditDialog}
        onDeleteTest={handleOpenDeleteDialog}
        moveTest={moveTest}
      />
      
      {/* Dialog for Adding a Test */}
      <AddTestDialog
        open={isAddTestDialogOpen}
        onOpenChange={setIsAddTestDialogOpen}
        onSubmit={handleAddTestSubmit}
      />

      {/* Dialog for Editing a Test */}
      {editingTest && (
        <AddTestDialog
          open={isEditTestDialogOpen}
          onOpenChange={(isOpen) => {
            setIsEditTestDialogOpen(isOpen);
            if (!isOpen) setEditingTest(null); 
          }}
          initialData={editingTest} 
          onSubmit={handleEditTestSubmit}
        />
      )}
      
      {/* Confirmation Dialog for Deleting a Test */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(event, data) => setIsDeleteDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete Test</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this test? This action cannot be undone.
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button appearance="primary" onClick={handleDeleteTest}>
                Delete
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}; 