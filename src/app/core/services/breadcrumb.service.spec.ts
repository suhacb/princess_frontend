import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideRouter, Routes, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { BreadcrumbService } from './breadcrumb.service';

@Component({ template: '<router-outlet />', standalone: true, imports: [RouterOutlet] })
class RootComponent {}

@Component({ template: '', standalone: true })
class StubComponent {}

const routes: Routes = [
  {
    path: 'projects',
    component: StubComponent,
    data: { breadcrumb: 'Projects' },
    children: [
      {
        path: ':id',
        component: StubComponent,
        data: { breadcrumb: 'Project Detail' },
      },
    ],
  },
  {
    path: 'no-crumb',
    component: StubComponent,
  },
];

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RootComponent],
      providers: [provideRouter(routes), provideLocationMocks()],
    });

    service = TestBed.inject(BreadcrumbService);
    router = TestBed.inject(Router);

    const fixture = TestBed.createComponent(RootComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('starts with empty breadcrumbs', () => {
    expect(service.breadcrumbs()).toEqual([]);
  });

  it('builds a single breadcrumb when navigating to a route with breadcrumb data', async () => {
    await router.navigate(['/projects']);
    expect(service.breadcrumbs().length).toBe(1);
    expect(service.breadcrumbs()[0].label).toBe('Projects');
  });

  it('includes the correct URL in the breadcrumb item', async () => {
    await router.navigate(['/projects']);
    expect(service.breadcrumbs()[0].url).toBe('/projects');
  });

  it('does not create a breadcrumb for routes without breadcrumb data', async () => {
    await router.navigate(['/no-crumb']);
    expect(service.breadcrumbs()).toEqual([]);
  });

  it('builds breadcrumbs for nested routes accumulating the URL', async () => {
    await router.navigate(['/projects', '42']);
    const crumbs = service.breadcrumbs();
    expect(crumbs.length).toBe(2);
    expect(crumbs[0].label).toBe('Projects');
    expect(crumbs[1].label).toBe('Project Detail');
    expect(crumbs[1].url).toContain('42');
  });

  it('updates breadcrumbs on subsequent navigations', async () => {
    await router.navigate(['/projects']);
    expect(service.breadcrumbs().length).toBe(1);
    await router.navigate(['/no-crumb']);
    expect(service.breadcrumbs()).toEqual([]);
  });
});
