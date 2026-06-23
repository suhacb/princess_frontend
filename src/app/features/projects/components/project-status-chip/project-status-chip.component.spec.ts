import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProjectStatusChipComponent } from './project-status-chip.component';
import { PROJECT_STATUS_LABELS, ProjectStatus } from '../../contracts/project.contracts';

describe('ProjectStatusChipComponent', () => {
  let fixture: ComponentFixture<ProjectStatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStatusChipComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ProjectStatusChipComponent);
  });

  it('renders the correct label for each status', () => {
    for (const [status, label] of Object.entries(PROJECT_STATUS_LABELS) as [ProjectStatus, string][]) {
      fixture.componentRef.setInput('status', status);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent.trim()).toBe(label);
    }
  });

  it('applies the correct CSS class for initiation', () => {
    fixture.componentRef.setInput('status', 'initiation');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.status-chip--initiation')).not.toBeNull();
  });

  it('applies the correct CSS class for delivery', () => {
    fixture.componentRef.setInput('status', 'delivery');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.status-chip--delivery')).not.toBeNull();
  });

  it('applies the correct CSS class for closed', () => {
    fixture.componentRef.setInput('status', 'closed');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.status-chip--closed')).not.toBeNull();
  });
});
