import React from 'react';
import { FluentProvider } from '@fluentui/react-components';
import { Routes, Route, Navigate } from 'react-router-dom';
import { researchFlowTheme } from './styles/theme';
import { Layout } from './components/Layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { MembersPage } from './pages/MembersPage';
import { TestsPage } from './pages/TestsPage';
import { ChatPage } from './pages/ChatPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <FluentProvider theme={researchFlowTheme}>
      <DndProvider backend={HTML5Backend}>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<div><p>Page Not Found</p></div>} />
          </Routes>
        </Layout>
      </DndProvider>
    </FluentProvider>
  );
}

export default App;
