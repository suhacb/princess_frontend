import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the icon', () => {
    fixture.componentRef.setInput('icon', 'folder_open');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon?.textContent?.trim()).toBe('folder_open');
  });

  it('renders the title', () => {
    fixture.componentRef.setInput('title', 'No projects yet');
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector('.empty-state__title');
    expect(title?.textContent?.trim()).toBe('No projects yet');
  });

  it('renders the message', () => {
    fixture.componentRef.setInput('message', 'Create your first project to get started.');
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('.empty-state__message');
    expect(msg?.textContent?.trim()).toBe('Create your first project to get started.');
  });

  it('does not render the action button when actionLabel is empty', () => {
    fixture.componentRef.setInput('actionLabel', '');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('renders the action button when actionLabel is provided', () => {
    fixture.componentRef.setInput('actionLabel', 'Create project');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn?.textContent?.trim()).toBe('Create project');
  });

  it('emits actionClick when the action button is clicked', () => {
    fixture.componentRef.setInput('actionLabel', 'Go');
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.actionClick.subscribe(() => (emitted = true));
    fixture.nativeElement.querySelector('button').click();
    expect(emitted).toBe(true);
  });
});
