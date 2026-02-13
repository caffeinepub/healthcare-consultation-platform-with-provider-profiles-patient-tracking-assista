import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import ProvidersDirectoryPage from './pages/providers/ProvidersDirectoryPage';
import ProviderDetailPage from './pages/providers/ProviderDetailPage';
import ConsultationsPage from './pages/consultations/ConsultationsPage';
import MyCareAssistantPage from './pages/my-care/MyCareAssistantPage';
import NutritionPage from './pages/nutrition/NutritionPage';
import FitnessPage from './pages/fitness/FitnessPage';
import PricingPage from './pages/pricing/PricingPage';
import AccountPage from './pages/account/AccountPage';
import AdminPage from './pages/admin/AdminPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ProvidersDirectoryPage,
});

const providersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/providers',
  component: ProvidersDirectoryPage,
});

const providerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/providers/$providerId',
  component: ProviderDetailPage,
});

const consultationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/consultations',
  component: ConsultationsPage,
});

const myCareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-care',
  component: MyCareAssistantPage,
});

const nutritionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nutrition',
  component: NutritionPage,
});

const fitnessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/fitness',
  component: FitnessPage,
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: PricingPage,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account',
  component: AccountPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  providersRoute,
  providerDetailRoute,
  consultationsRoute,
  myCareRoute,
  nutritionRoute,
  fitnessRoute,
  pricingRoute,
  accountRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

