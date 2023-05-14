import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
// import { LoadUser } from '../interfaces/load-users.interface';

// import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // public auth2: any;
  // public user: User;

  public isAuth = new BehaviorSubject<boolean>(false);
  constructor(
    // private http: HttpClient,
    // private router: Router,
    // private ngZone: NgZone,
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe((user) => {
      this.isAuth.next(!!user);
    });
    //   this.googleInit();
    // }
    // get token(): string {
    //   return localStorage.getItem('token') || '';
    // }
    // get role(): 'ADMIN_ROLE' | 'USER_ROLE' | '' {
    //   return this.user.role;
    // }
    // get uid(): string {
    //   return this.user.uid || '';
    // }
    // get headers() {
    //   return {
    //     headers: {
    //       'x-token': this.token,
    //     },
    //   };
  }
  // isLoggedIn(): Observable<boolean> {
  //   return this.user$.pipe(map((user) => user !== null));
  // }
  login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.isAuth.next(true);
        console.log(result);
        return result;
      });
  }
  logout() {
    return this.afAuth.signOut();
  }

  async register(email: string, password: string, displayName: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    await this.createUser(
      (userCredential.user as firebase.User).uid,
      email,
      displayName
    );
    return userCredential;
  }

  public async createUser(uid: string, email: string, displayName: string) {
    const db = getFirestore();
    const userRef = collection(db, 'users');
    const userData = {
      uid,
      email,
      displayName,
    };
    return addDoc(userRef, userData);
  }
}

//   getLocalStorage(token: string, menu: any) {
//     localStorage.setItem('token', token); //New token version stored in resp.token
//     localStorage.setItem('menu', JSON.stringify(menu));
//   }

//   googleInit() {
//     return new Promise((resolve: any) => {
//       gapi.load('auth2', () => {
//         // Retrieve the singleton for the GoogleAuth library and set up the client.
//         this.auth2 = gapi.auth2.init({
//           client_id:
//             '173031288157-04e11udn1m1lrqkv4k0bg8h9u8oqf2jf.apps.googleusercontent.com',
//           cookiepolicy: 'single_host_origin',
//         });
//         resolve();
//       });
//     });
//   }

//   logout() {
//     localStorage.removeItem('token');
//     localStorage.removeItem('menu');
//     // TODO: Delete menu
//     this.auth2.signOut().then(() => {
//       this.ngZone.run(() => {
//         this.router.navigateByUrl('/login');
//       });
//     });
//   }

//   tokenValidation(): Observable<boolean> {
//     return this.http
//       .get(`${base_url}/login/renew`, {
//         headers: {
//           'x-token': this.token,
//         },
//       })
//       .pipe(
//         map((resp: any) => {
//           console.log(resp);
//           const { email, google, name, role, img = '', uid } = resp.user;
//           this.user = new User(name, email, img, '', google, role, uid);

//           console.log(resp.user);
//           this.getLocalStorage(resp.token, resp.menu); //New token version stored in resp.token
//           return true;
//         }),
//         // map((resp: any) => true),
//         catchError((err) => of(false)) //atrapa el error que viene del pipe con la peticion y deuelve un observable
//       );
//   }

// createUser(formData: RegisterForm) {
//   return this.http
//     .post(`${base_url}/users`, formData)
//     .pipe
// tap((resp: any) => {
//   this.getLocalStorage(resp.token, resp.menu);
// })
//     ();
// }

//   updateProfile(data: { email: string; name: string; role: string }) {
//     return this.http.put(`${base_url}/users/${this.uid}`, data, this.headers);
//   }

//   login(formData: LoginForm) {
//     return this.http.post(`${base_url}/login`, formData).pipe(
//       tap((resp: any) => {
//         this.getLocalStorage(resp.token, resp.menu);
//       })
//     );
//   }

//   loginGoogle(token: string) {
//     return this.http.post(`${base_url}/login/google`, { token }).pipe(
//       tap((resp: any) => {
//         this.getLocalStorage(resp.token, resp.menu);
//       })
//     );
//   }
//   loadUsers(since: number = 0) {
//     // base_url = localhost:3000/api/users?since=0
//     const url = `${base_url}/users?since=${since}`;
//     return this.http.get<LoadUser>(url, this.headers).pipe(
//       map((resp) => {
//         const user = resp.user.map(
//           (user) =>
//             new User(
//               user.name,
//               user.email,
//               user.img,
//               '',
//               user.google,
//               user.role,
//               user.uid
//             )
//         );
//         return {
//           total: resp.total,
//           user,
//         };
//         // console.log(resp);
//       })
//     );
//   }
//   deleteUser(user: User) {
//     const url = `${base_url}/users/${user.uid}`;
//     return this.http.delete(url, this.headers);
//   }

//   saveUser(data: User) {
//     console.log(data);
//     return this.http.put(`${base_url}/users/${data.uid}`, data, this.headers);
//   }
// }
