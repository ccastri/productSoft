import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  Route,
  UrlSegment,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.afAuth.authState.pipe(
      take(1),
      map((user) => {
        // For simulating there's no user you can do if (user !== null)
        if (user) {
          console.log(user);
          // El usuario está autenticado, permitir el acceso a la ruta
          return true;
        } else {
          // El usuario no está autenticado, redirigir a la página de inicio de sesión
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkUserAuthentication();
  }

  private checkUserAuthentication(): Observable<boolean | UrlTree> {
    return this.afAuth.authState.pipe(
      take(1),
      map((user) => {
        if (user !== null) {
          // User is authenticated, allow access
          return true;
        } else {
          // User is not authenticated, redirect to the login page
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}
