import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly breadcrumbs = signal<BreadcrumbItem[]>([]);

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs.set(this.build(this.route.root));
      });
  }

  private build(
    route: ActivatedRoute,
    url = '',
    crumbs: BreadcrumbItem[] = []
  ): BreadcrumbItem[] {
    for (const child of route.children) {
      const segment = child.snapshot.url.map((s) => s.path).join('/');
      const nextUrl = segment ? `${url}/${segment}` : url;
      const label = child.snapshot.data['breadcrumb'] as string | undefined;
      if (label) crumbs.push({ label, url: nextUrl });
      this.build(child, nextUrl, crumbs);
    }
    return crumbs;
  }
}
