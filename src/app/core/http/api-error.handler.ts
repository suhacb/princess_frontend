import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { ApiResult } from '../../shared/contracts/api.contracts';

@Injectable({ providedIn: 'root' })
export class ApiErrorHandler {
  private readonly toast = inject(ToastService);

  handle(error: HttpErrorResponse): ApiResult {
    if (error.status >= 500) {
      this.toast.error(`Server error (${error.status}). Please try again later.`);
      return { ok: false, status: error.status };
    }

    if (error.status === 422) {
      this.toast.error('Validation failed. Please check the form.');
      return { ok: false, status: 422, validationErrors: error.error?.errors ?? {} };
    }

    if (error.status === 409) {
      this.toast.error(error.error?.message ?? 'Conflict — the resource cannot be modified in its current state.');
      return { ok: false, status: 409 };
    }

    if (error.status === 403) {
      this.toast.error('You do not have permission to perform this action.');
      return { ok: false, status: 403 };
    }

    if (error.status === 401) {
      this.toast.error('Your session has expired. Please log in again.');
      return { ok: false, status: 401 };
    }

    if (error.status === 404) {
      this.toast.error('The requested resource was not found.');
      return { ok: false, status: 404 };
    }

    this.toast.error(error.error?.message ?? `Request failed (${error.status}).`);
    return { ok: false, status: error.status };
  }
}
