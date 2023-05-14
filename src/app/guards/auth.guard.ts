// import { Injectable } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivateChild,
//   CanLoad,
//   Route,
//   Router,
//   RouterStateSnapshot,
//   UrlSegment,
//   UrlTree,
// } from '@angular/router';
// import { Observable, tap } from 'rxjs';
// import { UserService } from '../services/user.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivateChild, CanLoad {
//   constructor(private userService: UserService, private router: Router) {}

//   canLoad(
//     route: Route,
//     segments: UrlSegment[]
//   ):
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree>
//     | boolean
//     | UrlTree {
//     return this.userService.isLoggedIn().pipe(
//       tap((isLoggedIn) => {
//         if (!isLoggedIn) {
//           this.router.navigate(['/login']);
//         }
//       })
//     );
//   }

//   canActivateChild(
//     childRoute: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ):
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree>
//     | boolean
//     | UrlTree {
//     return this.userService.isLoggedIn().pipe(
//       tap((isLoggedIn) => {
//         if (!isLoggedIn) {
//           this.router.navigate(['/login']);
//         }
//       })
//     );
//   }
// }
