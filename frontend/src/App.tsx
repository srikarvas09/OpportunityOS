import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="organizations" element={<OrganizationsPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
