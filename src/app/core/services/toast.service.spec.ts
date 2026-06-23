import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let mockSnackBar: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockSnackBar = { open: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    });

    service = TestBed.inject(ToastService);
  });

  describe('success()', () => {
    it('opens the snackbar with the given message', () => {
      service.success('Saved!');
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Saved!',
        undefined,
        expect.objectContaining({ duration: 3000 }),
      );
    });

    it('uses the success panel class', () => {
      service.success('OK');
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'OK',
        undefined,
        expect.objectContaining({
          panelClass: expect.arrayContaining(['princess-snackbar--success']),
        }),
      );
    });
  });

  describe('error()', () => {
    it('opens the snackbar with a Dismiss action', () => {
      service.error('Something went wrong');
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Something went wrong',
        'Dismiss',
        expect.anything(),
      );
    });

    it('uses the error panel class', () => {
      service.error('Oops');
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Oops',
        'Dismiss',
        expect.objectContaining({
          panelClass: expect.arrayContaining(['princess-snackbar--error']),
        }),
      );
    });

    it('uses a longer duration than success', () => {
      service.success('OK');
      service.error('Bad');
      const successCall = mockSnackBar.open.mock.calls[0][2];
      const errorCall = mockSnackBar.open.mock.calls[1][2];
      expect(errorCall.duration).toBeGreaterThan(successCall.duration);
    });
  });

  describe('info()', () => {
    it('opens the snackbar with the info panel class', () => {
      service.info('Note');
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        'Note',
        undefined,
        expect.objectContaining({
          panelClass: expect.arrayContaining(['princess-snackbar--info']),
        }),
      );
    });
  });
});
