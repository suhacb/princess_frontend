import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberRoleChipComponent } from './member-role-chip.component';

function setup(role: string) {
  TestBed.configureTestingModule({ imports: [MemberRoleChipComponent] });
  const fixture = TestBed.createComponent(MemberRoleChipComponent);
  fixture.componentRef.setInput('role', role);
  fixture.detectChanges();
  return fixture;
}

describe('MemberRoleChipComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('shows Project Manager label', () => {
    const fixture = setup('project_manager');
    expect(fixture.nativeElement.textContent).toContain('Project Manager');
  });

  it('shows Executive label', () => {
    const fixture = setup('executive');
    expect(fixture.nativeElement.textContent).toContain('Executive');
  });

  it('shows Observer label', () => {
    const fixture = setup('observer');
    expect(fixture.nativeElement.textContent).toContain('Observer');
  });
});
