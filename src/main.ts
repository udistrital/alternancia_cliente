import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

localStorage.setItem('menu', 'W3siTm9tYnJlIjoiSW5pY2lvIiwiSWNvbm8iOiJob21lIiwiVXJsIjoicGFnZXMiLCJPcGNpb25lcyI6W119LHsiSWQiOjY2NCwiTm9tYnJlIjoiSW5mb3JtYWNp824gQuFzaWNhIiwiVXJsIjoicGFnZXMvaW5mb3JtYWNpb25fYmFzaWNhIiwiVGlwb09wY2lvbiI6Ik1lbvoiLCJPcGNpb25lcyI6bnVsbH0seyJJZCI6NjY2LCJOb21icmUiOiJDb21vcmJpbGlkYWRlcyIsIlVybCI6InBhZ2VzL2NvbW9yYmlsaWRhZGVzIiwiVGlwb09wY2lvbiI6Ik1lbvoiLCJPcGNpb25lcyI6bnVsbH1d')

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

