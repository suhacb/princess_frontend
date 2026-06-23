import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('starts with isLoading false', () => {
    expect(service.isLoading()).toBe(false);
  });

  it('isLoading becomes true after start()', () => {
    service.start();
    expect(service.isLoading()).toBe(true);
  });

  it('isLoading returns false after matching start() and stop()', () => {
    service.start();
    service.stop();
    expect(service.isLoading()).toBe(false);
  });

  it('requires all start() calls to be matched by stop() before isLoading is false', () => {
    service.start();
    service.start();
    service.stop();
    expect(service.isLoading()).toBe(true);
    service.stop();
    expect(service.isLoading()).toBe(false);
  });

  it('stop() when already at zero does not cause negative count', () => {
    service.stop();
    expect(service.isLoading()).toBe(false);
  });

  it('subsequent start()/stop() cycles work correctly after an underflow', () => {
    service.stop();
    service.start();
    expect(service.isLoading()).toBe(true);
    service.stop();
    expect(service.isLoading()).toBe(false);
  });
});
