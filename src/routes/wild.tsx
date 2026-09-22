import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import App from '../App';

export const wildRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wild',
  component: () => <App initialViewMode="bananas_wild" />,
});
