import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { provideRouter, Router, Routes, TitleStrategy } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { Title } from '@angular/platform-browser';
import { PageTitleStrategy } from './page-title.strategy';

@Component({ template: '', standalone: true })
class StubComponent {}

const routes: Routes = [
  { path: 'dashboard', component: StubComponent, title: 'Dashboard' },
  { path: 'home', component: StubComponent },
];

describe('PageTitleStrategy', () => {
  let titleService: Title;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideLocationMocks(),
        { provide: TitleStrategy, useClass: PageTitleStrategy },
      ],
    });
    titleService = TestBed.inject(Title);
    router = TestBed.inject(Router);
    vi.spyOn(titleService, 'setTitle');
  });

  it('sets title as "Route | Princess" when the route has a title', async () => {
    await router.navigate(['/dashboard']);
    expect(titleService.setTitle).toHaveBeenCalledWith('Dashboard | Princess');
  });

  it('sets title as "Princess" when the route has no title', async () => {
    await router.navigate(['/home']);
    expect(titleService.setTitle).toHaveBeenCalledWith('Princess');
  });
});
