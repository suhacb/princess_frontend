import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MemberListComponent } from './member-list.component';
import { MemberService } from '../../services/member.service';
import { ProjectService } from '../../../projects/services/project.service';
import { Member } from '../../contracts/member.contracts';
import { Project } from '../../../projects/contracts/project.contracts';

const stubProject: Project = {
  id: 5,
  name: 'Alpha',
  reference: 'PROJ-001',
  status: 'initiation',
  currentStageName: null,
  tolerances: { time: { min: null, max: null }, cost: { min: null, max: null }, scope: null, risk: null, quality: null, benefit: null },
  createdBy: 'jdoe',
  createdAt: '2026-01-01T00:00:00Z',
};

const stubMember: Member = {
  id: 1,
  person: { id: 10, name: 'Alice', email: 'alice@example.com', jobTitle: 'PM', organization: 'Acme' },
  role: 'project_manager',
  side: 'customer',
  createdAt: '2026-01-01T00:00:00Z',
};

function setup(members: Member[] = [], project: Project | null = stubProject) {
  const membersSignal = signal(members);
  const loadingSignal = signal(false);

  const memberService = {
    members: membersSignal.asReadonly(),
    loading: loadingSignal.asReadonly(),
    list: vi.fn().mockReturnValue(of(members)),
    update: vi.fn().mockReturnValue(of(stubMember)),
    remove: vi.fn().mockReturnValue(of(undefined)),
  };

  const projectService = {
    selectedProject: signal<Project | null>(project).asReadonly(),
  };

  TestBed.configureTestingModule({
    imports: [MemberListComponent, BrowserAnimationsModule],
    providers: [
      provideRouter([]),
      { provide: MemberService, useValue: memberService },
      { provide: ProjectService, useValue: projectService },
    ],
  });

  const fixture: ComponentFixture<MemberListComponent> = TestBed.createComponent(MemberListComponent);
  fixture.detectChanges();
  return { fixture, memberService };
}

describe('MemberListComponent', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('calls memberService.list when project is loaded', () => {
    const { memberService } = setup();
    expect(memberService.list).toHaveBeenCalledWith(5);
  });

  it('shows empty state when no members', () => {
    const { fixture } = setup([]);
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('renders member rows', () => {
    const { fixture } = setup([stubMember]);
    expect(fixture.nativeElement.textContent).toContain('Alice');
    expect(fixture.nativeElement.querySelector('app-member-role-chip')).toBeTruthy();
  });

  it('shows person meta when jobTitle and organization are present', () => {
    const { fixture } = setup([stubMember]);
    expect(fixture.nativeElement.textContent).toContain('PM · Acme');
  });

  it('shows confirm UI when remove is initiated', () => {
    const { fixture } = setup([stubMember]);
    const removeBtn = fixture.nativeElement.querySelector('.remove-btn') as HTMLButtonElement;
    removeBtn.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Remove Alice?');
  });

  it('hides confirm UI after cancel', () => {
    const { fixture } = setup([stubMember]);
    const removeBtn = fixture.nativeElement.querySelector('.remove-btn') as HTMLButtonElement;
    removeBtn.click();
    fixture.detectChanges();
    const cancelBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.trim() === 'Cancel');
    cancelBtn?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.confirm-remove')).toBeFalsy();
  });

  it('calls remove on confirm', () => {
    const { fixture, memberService } = setup([stubMember]);
    (fixture.nativeElement.querySelector('.remove-btn') as HTMLButtonElement).click();
    fixture.detectChanges();
    const confirmBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Remove') && !b.classList.contains('remove-btn'));
    confirmBtn?.click();
    expect(memberService.remove).toHaveBeenCalledWith(5, 1);
  });

  it('shows remove error when last project manager', () => {
    const { fixture, memberService } = setup([stubMember]);
    memberService.remove.mockReturnValue(throwError(() => new Error('422')));
    (fixture.nativeElement.querySelector('.remove-btn') as HTMLButtonElement).click();
    fixture.detectChanges();
    const confirmBtn = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(b => b.textContent?.includes('Remove') && !b.classList.contains('remove-btn'));
    confirmBtn?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Cannot remove the last project manager');
  });
});
