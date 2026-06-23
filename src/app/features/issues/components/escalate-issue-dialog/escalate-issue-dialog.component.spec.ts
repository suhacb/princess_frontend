import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EscalateIssueDialogComponent } from './escalate-issue-dialog.component';

function setup() {
  const closeFn = vi.fn();
  TestBed.configureTestingModule({
    imports: [EscalateIssueDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: { issueTitle: 'Login fails' } },
      { provide: MatDialogRef, useValue: { close: closeFn } },
    ],
  });
  const fixture = TestBed.createComponent(EscalateIssueDialogComponent);
  fixture.detectChanges();
  return { fixture, closeFn };
}

describe('EscalateIssueDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows issue title', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Login fails');
  });

  it('Escalate button disabled when reason empty', () => {
    const { fixture } = setup();
    const btn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Escalate'));
    expect(btn?.disabled).toBe(true);
  });

  it('closes with payload when reason provided', () => {
    const { fixture, closeFn } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ escalation_reason: 'Critical path affected' });
    fixture.detectChanges();
    const btn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Escalate'));
    btn?.click();
    expect(closeFn).toHaveBeenCalledWith({ escalation_reason: 'Critical path affected' });
  });
});
