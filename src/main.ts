import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
// import { environment } from './environments/environment';
// import * as dotenv from 'dotenv';

// ! Lo encontré en chat GPT
// if (environment.production) {
//   enableProdMode();
// }

// dotenv.config();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
