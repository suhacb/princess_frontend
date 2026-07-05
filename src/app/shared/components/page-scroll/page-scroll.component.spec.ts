import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageScrollComponent } from './page-scroll.component';

@Component({
  imports: [PageScrollComponent],
  template: `<app-page-scroll><p class="projected">Content</p></app-page-scroll>`,
})
class HostComponent {}

describe('PageScrollComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('projects its content', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.projected')?.textContent).toContain('Content');
  });

  it('renders as a block-level scroll container', () => {
    const host = fixture.nativeElement.querySelector('app-page-scroll') as HTMLElement;
    const styles = getComputedStyle(host);
    expect(styles.display).toBe('block');
    expect(styles.overflowY).toBe('auto');
  });
});
