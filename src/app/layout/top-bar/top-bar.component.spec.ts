import { TestBed, ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TopBarComponent } from './top-bar.component';
import { LayoutService } from '../../core/services/layout.service';

function makeLayoutService(collapsed = false) {
  const sidebarCollapsed = signal(collapsed);
  return {
    sidebarCollapsed,
    toggleSidebar: vi.fn().mockImplementation(() => sidebarCollapsed.update(v => !v)),
    isMobile: signal(false),
    isTablet: signal(false),
    isDesktop: signal(true),
  };
}

describe('TopBarComponent', () => {
  let fixture: ComponentFixture<TopBarComponent>;
  let mockLayout: ReturnType<typeof makeLayoutService>;

  beforeEach(async () => {
    mockLayout = makeLayoutService();
    await TestBed.configureTestingModule({
      imports: [TopBarComponent],
      providers: [
        provideRouter([]),
        { provide: LayoutService, useValue: mockLayout },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TopBarComponent);
    fixture.detectChanges();
  });

  it('creates successfully', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the user initials', () => {
    const avatar = fixture.nativeElement.querySelector('.top-bar__avatar-initials');
    expect(avatar?.textContent?.trim()).toBe('BŠ');
  });

  it('calls toggleSidebar() when the menu button is clicked', () => {
    fixture.nativeElement.querySelector('.top-bar__menu-btn').click();
    expect(mockLayout.toggleSidebar).toHaveBeenCalled();
  });

  it('shows "menu" icon when sidebar is expanded', () => {
    mockLayout.sidebarCollapsed.set(false);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.top-bar__menu-btn mat-icon');
    expect(icon?.textContent?.trim()).toBe('menu');
  });

  it('shows "menu_open" icon when sidebar is collapsed', () => {
    mockLayout.sidebarCollapsed.set(true);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.top-bar__menu-btn mat-icon');
    expect(icon?.textContent?.trim()).toBe('menu_open');
  });
});
