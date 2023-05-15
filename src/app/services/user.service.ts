import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
// import { LoadUser } from '../interfaces/load-users.interface';

// import { User } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // public auth2: any;
  // public user: User;

  public isAuth = new BehaviorSubject<boolean>(false);
  constructor(public afAuth: AngularFireAuth) {
    // Esto garantiza que haya un usuario
    this.afAuth.authState.subscribe((user) => {
      this.isAuth.next(!!user);
    });
  }
  // async/await login:
  // async login(email: string, password: string) {
  //   try {
  //     const result = await this.afAuth.signInWithEmailAndPassword(
  //       email,
  //       password
  //     );
  //     this.isAuth.next(true);
  // Swal.fire('Completado', 'Usuario Cerró Sesión', 'success');
  //     console.log(result);
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // !Login without async/await
  login(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.isAuth.next(true);
        console.log(result);
        return result;
      });
  }
  // !async await logout
  async logout() {
    try {
      await this.afAuth.signOut();
      // Swal.fire('Completado', 'Usuario Cerró Sesión', 'success');
    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  }
  // ! Async/await register
  // async register(email: string, password: string, displayName: string) {
  //   try {
  //     const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
  //     await this.createUser(userCredential.user.uid, email, displayName);
  //     Swal.fire('Success', 'Registration successful!', 'success');
  //     return userCredential;
  //   } catch (error) {
  //     Swal.fire('Error', 'Failed to register', 'error');
  //     throw error;
  //   }
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
