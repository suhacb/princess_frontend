import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoadingBarComponent } from './loading-bar.component';
import { LoadingService } from '../../../core/services/loading.service';

describe('LoadingBarComponent', () => {
  let fixture: ComponentFixture<LoadingBarComponent>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingBarComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LoadingBarComponent);
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('does not render the progress bar when not loading', () => {
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeNull();
  });

  it('renders the progress bar when loading starts', () => {
    loadingService.start();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).not.toBeNull();
  });

  it('hides the progress bar when loading stops', () => {
    loadingService.start();
    fixture.detectChanges();
    loadingService.stop();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-bar')).toBeNull();
  });
});
