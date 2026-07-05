import { Component } from '@angular/core';

@Component({
  selector: 'app-page-scroll',
  standalone: true,
  template: `<ng-content />`,
  styles: [`:host { display: block; height: 100%; overflow-y: auto; }`],
})
export class PageScrollComponent {}
