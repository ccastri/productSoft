// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { environment } from '../../environments/environment';
// const base_url = environment.base_url;
// // const httpOptions = {
// //   // headers: new HttpHeaders({
// //   //   // public user : User;
// //   //   'Content-Type': 'application/json',
// //   //   'Authorization'
// //   // }),
// // };

// @Injectable({
//   providedIn: 'root',
// })
// export class FileUploadService {
//   constructor(private http: HttpClient) {}

//   async updatePhoto(
//     file: File | any,
//     type: 'users' | 'doctors' | 'hospitals',
//     id: string | any
//   ) {
//     try {
//       const url = `${base_url}/uploads/${type}/${id}`;

//       const formData = new FormData();
//       // // this.userObj = new User('', '', file.toString(), '', false, '', '');

//       formData.append('img', file);
//       console.log(file);
//       // // User = new User();

//       const resp = await fetch(url, {
//         method: 'PUT',

//         headers: {
//           'x-token': localStorage.getItem('token') || '',
//         },
//         body: formData,
//       });

//       // console.log(resp.body);

//       // debugger;
//       const data = await resp.json();
//       // console.log(data);
//       // console.log(data);
//       if (data.ok) {
//         return data.fileName;
//       } else {
//         console.log(data.msg);
//         return false;
//       }
//     } catch (err) {
//       console.log(err);
//       return false;
//     }
//   }
// }
