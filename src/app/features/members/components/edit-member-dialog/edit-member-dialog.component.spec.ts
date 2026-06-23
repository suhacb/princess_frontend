import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditMemberDialogComponent } from './edit-member-dialog.component';
import { Member } from '../../contracts/member.contracts';

const stubMember: Member = {
  id: 1,
  person: { id: 10, name: 'Alice', email: 'alice@example.com', jobTitle: null, organization: null },
  role: 'project_manager',
  side: 'customer',
  createdAt: '2026-01-01T00:00:00Z',
};

function setup(member: Member = stubMember) {
  const closeFn = vi.fn();
  TestBed.configureTestingModule({
    imports: [EditMemberDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: { member } },
      { provide: MatDialogRef, useValue: { close: closeFn } },
    ],
  });
  const fixture: ComponentFixture<EditMemberDialogComponent> = TestBed.createComponent(EditMemberDialogComponent);
  fixture.detectChanges();
  return { fixture, closeFn };
}

describe('EditMemberDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows member name in title', () => {
    const { fixture } = setup();
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });

  it('closes with payload on confirm', () => {
    const { fixture, closeFn } = setup();
    const saveBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Save'));
    saveBtn?.click();
    expect(closeFn).toHaveBeenCalledWith({ role: 'project_manager', side: 'customer' });
  });

  it('closes with null on cancel', () => {
    const { fixture, closeFn } = setup();
    const cancelBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Cancel'));
    cancelBtn?.click();
    expect(closeFn).toHaveBeenCalledWith('');
  });
});
