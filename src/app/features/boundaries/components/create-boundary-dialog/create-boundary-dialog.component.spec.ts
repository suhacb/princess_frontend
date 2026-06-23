import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateBoundaryDialogComponent } from './create-boundary-dialog.component';

function setup() {
  const closeFn = vi.fn();
  TestBed.configureTestingModule({
    imports: [CreateBoundaryDialogComponent, BrowserAnimationsModule],
    providers: [{ provide: MatDialogRef, useValue: { close: closeFn } }],
  });
  const fixture = TestBed.createComponent(CreateBoundaryDialogComponent);
  fixture.detectChanges();
  return { fixture, closeFn };
}

describe('CreateBoundaryDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('Create button is disabled when no type selected', () => {
    const { fixture } = setup();
    const createBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Create'));
    expect(createBtn?.disabled).toBe(true);
  });

  it('shows End Stage Report option', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('End Stage Report');
  });

  it('shows Exception Report option', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Exception Report');
  });
});
