import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/helpers/routes';

export function RoutesNotFound(): JSX.Element {
  return (
    <Navigate replace to={ROUTES.main} />
  );
}
