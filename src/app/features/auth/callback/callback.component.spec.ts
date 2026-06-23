import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CallbackComponent } from './callback.component';

describe('CallbackComponent', () => {
  let fixture: ComponentFixture<CallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallbackComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CallbackComponent);
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a loading spinner', () => {
    expect(fixture.nativeElement.querySelector('mat-spinner')).not.toBeNull();
  });

  it('renders the spinner inside a centered container', () => {
    expect(fixture.nativeElement.querySelector('.callback-container')).not.toBeNull();
  });
});
