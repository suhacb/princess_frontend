import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateRiskDialogComponent, CreateRiskDialogData } from './create-risk-dialog.component';
import { Member } from '../../../members/contracts/member.contracts';

const stubMember: Member = {
  id: 1,
  person: { id: 10, name: 'Alice', email: null, jobTitle: null, organization: null },
  role: 'project_manager',
  side: null,
  createdAt: '2026-01-01T00:00:00Z',
};

const dialogData: CreateRiskDialogData = { members: [stubMember] };

function setup() {
  const dialogRef = { close: vi.fn() };
  TestBed.configureTestingModule({
    imports: [CreateRiskDialogComponent, BrowserAnimationsModule],
    providers: [
      { provide: MatDialogRef, useValue: dialogRef },
      { provide: MAT_DIALOG_DATA, useValue: dialogData },
    ],
  });
  const fixture: ComponentFixture<CreateRiskDialogComponent> = TestBed.createComponent(CreateRiskDialogComponent);
  fixture.detectChanges();
  return { fixture, dialogRef };
}

describe('CreateRiskDialogComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('creates successfully', () => {
    const { fixture } = setup();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('Raise Risk button is disabled when form is invalid', () => {
    const { fixture } = setup();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
    expect(btn.disabled).toBe(true);
  });

  it('exposes correct proximity values', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.proximities).toContain('imminent');
    expect(comp.proximities).toContain('near');
    expect(comp.proximities).toContain('distant');
  });

  it('exposes correct response type values', () => {
    const { fixture } = setup();
    const comp = fixture.componentInstance as any;
    expect(comp.responseTypes).toContain('avoid');
    expect(comp.responseTypes).toContain('reduce');
    expect(comp.responseTypes).toContain('accept');
  });

  it('closes with payload when form is valid and confirm is called', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.form.patchValue({
      title: 'Server outage',
      probability: 3,
      impact: 4,
      proximity: 'near',
      response_type: 'reduce',
      risk_owner: 10,
    });
    comp.confirm();
    expect(dialogRef.close).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Server outage',
        probability: 3,
        impact: 4,
        proximity: 'near',
        response_type: 'reduce',
        risk_owner: 10,
      }),
    );
  });

  it('does not close when form is invalid', () => {
    const { fixture, dialogRef } = setup();
    const comp = fixture.componentInstance as any;
    comp.confirm();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
