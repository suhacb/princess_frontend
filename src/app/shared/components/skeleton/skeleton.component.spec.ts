import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let fixture: ComponentFixture<SkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SkeletonComponent);
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a .skeleton element', () => {
    expect(fixture.nativeElement.querySelector('.skeleton')).not.toBeNull();
  });

  it('applies default width of 100%', () => {
    const el = fixture.nativeElement.querySelector('.skeleton') as HTMLElement;
    expect(el.style.width).toBe('100%');
  });

  it('applies default height of 1rem', () => {
    const el = fixture.nativeElement.querySelector('.skeleton') as HTMLElement;
    expect(el.style.height).toBe('1rem');
  });

  it('applies default border-radius of 4px', () => {
    const el = fixture.nativeElement.querySelector('.skeleton') as HTMLElement;
    expect(el.style.borderRadius).toBe('4px');
  });

  it('applies custom width when provided', () => {
    fixture.componentRef.setInput('width', '240px');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.skeleton') as HTMLElement;
    expect(el.style.width).toBe('240px');
  });

  it('applies custom height when provided', () => {
    fixture.componentRef.setInput('height', '48px');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.skeleton') as HTMLElement;
    expect(el.style.height).toBe('48px');
  });

  it('applies custom border-radius when provided', () => {
    fixture.componentRef.setInput('borderRadius', '50%');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.skeleton') as HTMLElement;
    expect(el.style.borderRadius).toBe('50%');
  });
});
