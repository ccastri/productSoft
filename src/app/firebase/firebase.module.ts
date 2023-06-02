import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  exports: [AngularFireModule, AngularFireAuthModule],
})
export class FirebaseModule {}

// Needs to fix the node module in:
// node_modules>@angular>fire/compat/firestore/interfaces.d.ts
// Add some <T> 4 times and you're done:
// export interface DocumentSnapshotExists<T> extends firebase.firestore.DocumentSnapshot<T>
// export interface QueryDocumentSnapshot<T> extends firebase.firestore.QueryDocumentSnapshot<T>
// export interface QuerySnapshot<T> extends firebase.firestore.QuerySnapshot<T>
// export interface DocumentChange<T> extends firebase.firestore.DocumentChange<T>
