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

  it('applies management group class for project_manager', () => {
    const fixture = setup('project_manager');
    expect(fixture.nativeElement.querySelector('.role-chip--management')).toBeTruthy();
  });

  it('applies board group class for executive', () => {
    const fixture = setup('executive');
    expect(fixture.nativeElement.querySelector('.role-chip--board')).toBeTruthy();
  });

  it('applies observer group class for observer', () => {
    const fixture = setup('observer');
    expect(fixture.nativeElement.querySelector('.role-chip--observer')).toBeTruthy();
  });
});
