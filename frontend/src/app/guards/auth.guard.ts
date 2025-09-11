import { CanActivateFn, UrlTree, Router } from '@angular/router';
import { inject } from '@angular/core';
import { authState } from '../signals/auth.signal';

export const authGuard: CanActivateFn = () => {
  if (!!authState().token) {
    return true;
  }
  const router = inject(Router);
  return router.parseUrl('/login');
};
