import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { provideAnimations } from '@angular/platform-browser/animations';
import { API_CONFIG } from '../lib/angular/tokens';
import { APP_BASE_URL } from './app-url.token';
import { environment } from '../environments/environment';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: APP_BASE_URL, useValue: environment.apiBaseUrl },
    { provide: API_CONFIG, useValue: { baseURL: environment.apiBaseUrl } }
  ]
};
