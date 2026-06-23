import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResolveIssueDialogComponent } from './resolve-issue-dialog.component';

function setup() {
  const closeFn = vi.fn();
  TestBed.configureTestingModule({
    imports: [ResolveIssueDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: { issueTitle: 'Login fails' } },
      { provide: MatDialogRef, useValue: { close: closeFn } },
    ],
  });
  const fixture = TestBed.createComponent(ResolveIssueDialogComponent);
  fixture.detectChanges();
  return { fixture, closeFn };
}

describe('ResolveIssueDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows issue title', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Login fails');
  });

  it('Mark Resolved button disabled when resolution empty', () => {
    const { fixture } = setup();
    const btn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Mark Resolved'));
    expect(btn?.disabled).toBe(true);
  });

  it('closes with payload when resolution provided', () => {
    const { fixture, closeFn } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ resolution: 'Fixed by updating config' });
    fixture.detectChanges();
    const btn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Mark Resolved'));
    btn?.click();
    expect(closeFn).toHaveBeenCalledWith({ resolution: 'Fixed by updating config' });
  });
});
