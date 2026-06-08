import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 3000,
      panelClass: ['princess-snackbar', 'princess-snackbar--success'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 6000,
      panelClass: ['princess-snackbar', 'princess-snackbar--error'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  info(message: string): void {
    this.snackBar.open(message, undefined, {
      duration: 4000,
      panelClass: ['princess-snackbar', 'princess-snackbar--info'],
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
