import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ProjectService } from '../../features/projects/services/project.service';
import { ShellStore } from '../services/shell.store';

export const projectContextGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const projectService = inject(ProjectService);
  const shellStore = inject(ShellStore);
  const router = inject(Router);

  const id = Number(route.paramMap.get('id'));
  if (!id) return router.createUrlTree(['/projects']);

  // If project is already loaded and matches, just sync the signal
  const current = projectService.selectedProject();
  if (current?.id === id) {
    shellStore.setProject(id);
    return true;
  }

  return projectService.load(id).pipe(
    map(() => {
      shellStore.setProject(id);
      return true;
    }),
    catchError(() => of(router.createUrlTree(['/projects']))),
  );
};
