import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { ApiResource } from '../../../shared/contracts/api.contracts';
import {
  CreateProductPayload,
  Product,
  ProductApiResource,
  UpdateProductPayload,
  mapProduct,
} from '../contracts/work-package.contracts';

function addChildToTree(tree: Product[], child: Product): Product[] {
  return tree.map(p =>
    p.id === child.parentId
      ? { ...p, children: [...p.children, child] }
      : { ...p, children: addChildToTree(p.children, child) },
  );
}

function updateNode(tree: Product[], updated: Product): Product[] {
  return tree.map(p =>
    p.id === updated.id
      ? { ...updated, children: p.children }
      : { ...p, children: updateNode(p.children, updated) },
  );
}

function removeNode(tree: Product[], id: number): Product[] {
  return tree
    .filter(p => p.id !== id)
    .map(p => ({ ...p, children: removeNode(p.children, id) }));
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);

  private readonly _products = signal<Product[]>([]);
  private readonly _loading = signal(false);

  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();

  list(projectId: number): Observable<Product[]> {
    this._loading.set(true);
    return this.api
      .get<ApiResource<ProductApiResource[]>>(`/projects/${projectId}/products/tree`)
      .pipe(
        map(res => res.data.map(mapProduct)),
        tap(products => {
          this._products.set(products);
          this._loading.set(false);
        }),
        catchError(err => {
          this._loading.set(false);
          throw err;
        }),
      );
  }

  create(projectId: number, payload: CreateProductPayload): Observable<Product> {
    return this.api
      .post<ApiResource<ProductApiResource>>(`/projects/${projectId}/products`, payload)
      .pipe(
        map(res => mapProduct(res.data)),
        tap(product => {
          if (product.parentId === null) {
            this._products.update(list => [...list, product]);
          } else {
            this._products.update(list => addChildToTree(list, product));
          }
        }),
      );
  }

  update(projectId: number, productId: number, payload: UpdateProductPayload): Observable<Product> {
    return this.api
      .patch<ApiResource<ProductApiResource>>(
        `/projects/${projectId}/products/${productId}`,
        payload,
      )
      .pipe(
        map(res => mapProduct(res.data)),
        tap(updated => this._products.update(list => updateNode(list, updated))),
      );
  }

  remove(projectId: number, productId: number): Observable<void> {
    return this.api
      .delete<void>(`/projects/${projectId}/products/${productId}`)
      .pipe(tap(() => this._products.update(list => removeNode(list, productId))));
  }

  baseline(projectId: number, productId: number): Observable<Product> {
    return this.api
      .post<ApiResource<ProductApiResource>>(
        `/projects/${projectId}/products/${productId}/baseline`,
        {},
      )
      .pipe(
        map(res => mapProduct(res.data)),
        tap(updated => this._products.update(list => updateNode(list, updated))),
      );
  }
}
