import type { ComponentType } from 'react';
import FarmerDashboard from './FarmerDashboard';
import AgronomistDashboard from './AgronomistDashboard';
import AdminDashboard from './AdminDashboard';
import OverviewDashboardContent from './OverviewDashboardContent';
import type { UserRole } from '../../types';

export function getDashboardByRole(role: UserRole | string): ComponentType {
  switch (role) {
    case 'agronomist':
      return AgronomistDashboard;
    case 'admin':
    case 'super_admin':
      return AdminDashboard;
    case 'farmer':
    default:
      return FarmerDashboard;
  }
}

export { FarmerDashboard, AgronomistDashboard, AdminDashboard, OverviewDashboardContent };
