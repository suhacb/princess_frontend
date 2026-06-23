import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateIssueDialogComponent } from './create-issue-dialog.component';

function setup() {
  const closeFn = vi.fn();
  TestBed.configureTestingModule({
    imports: [CreateIssueDialogComponent, BrowserAnimationsModule],
    providers: [{ provide: MatDialogRef, useValue: { close: closeFn } }],
  });
  const fixture = TestBed.createComponent(CreateIssueDialogComponent);
  fixture.detectChanges();
  return { fixture, closeFn };
}

describe('CreateIssueDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('Raise Issue button is disabled when form is empty', () => {
    const { fixture } = setup();
    const btn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Raise Issue'));
    expect(btn?.disabled).toBe(true);
  });

  it('has all issue types as options', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.types).toContain('problem');
    expect(comp.types).toContain('concern');
    expect(comp.types).toContain('rfc');
    expect(comp.types).toContain('off_spec');
  });

  it('has all priorities as options', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.priorities).toContain('low');
    expect(comp.priorities).toContain('critical');
  });

  it('closes with payload when form is valid and confirmed', () => {
    const { fixture, closeFn } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ issue_type: 'problem', priority: 'high', title: 'Login fails', description: '' });
    fixture.detectChanges();
    const btn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Raise Issue'));
    btn?.click();
    expect(closeFn).toHaveBeenCalledWith(expect.objectContaining({
      issue_type: 'problem', priority: 'high', title: 'Login fails',
    }));
  });

  it('sends null description when description is empty', () => {
    const { fixture, closeFn } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({ issue_type: 'concern', priority: 'low', title: 'Minor concern', description: '' });
    fixture.detectChanges();
    const btn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Raise Issue'));
    btn?.click();
    expect(closeFn).toHaveBeenCalledWith(expect.objectContaining({ description: null }));
  });
});
