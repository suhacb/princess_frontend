import { TestBed, ComponentFixture } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbService, BreadcrumbItem } from '../../core/services/breadcrumb.service';

function makeService(items: BreadcrumbItem[] = []) {
  return { breadcrumbs: signal(items) };
}

describe('BreadcrumbComponent', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;

  async function setup(items: BreadcrumbItem[]) {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        provideRouter([]),
        { provide: BreadcrumbService, useValue: makeService(items) },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.detectChanges();
  }

  it('renders nothing when there is only one or zero breadcrumbs', async () => {
    await setup([{ label: 'Dashboard', url: '/dashboard' }]);
    expect(fixture.nativeElement.querySelector('nav')).toBeNull();
  });

  it('renders the nav element when there are two or more breadcrumbs', async () => {
    await setup([
      { label: 'Projects', url: '/projects' },
      { label: 'My Project', url: '/projects/1' },
    ]);
    expect(fixture.nativeElement.querySelector('nav.breadcrumb')).not.toBeNull();
  });

  it('renders all non-last items as links', async () => {
    await setup([
      { label: 'Projects', url: '/projects' },
      { label: 'My Project', url: '/projects/1' },
    ]);
    const links = fixture.nativeElement.querySelectorAll('a.breadcrumb__item--link');
    expect(links.length).toBe(1);
    expect(links[0].textContent.trim()).toBe('Projects');
  });

  it('renders the last item as a span with aria-current="page"', async () => {
    await setup([
      { label: 'Projects', url: '/projects' },
      { label: 'My Project', url: '/projects/1' },
    ]);
    const current = fixture.nativeElement.querySelector('.breadcrumb__item--current');
    expect(current).not.toBeNull();
    expect(current.getAttribute('aria-current')).toBe('page');
    expect(current.textContent.trim()).toBe('My Project');
  });

  it('renders separator icons between items', async () => {
    await setup([
      { label: 'A', url: '/a' },
      { label: 'B', url: '/b' },
    ]);
    expect(fixture.nativeElement.querySelector('.breadcrumb__separator')).not.toBeNull();
  });
});
