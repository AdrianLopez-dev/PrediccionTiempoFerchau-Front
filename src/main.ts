import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { PrediccionTiempoComponent } from './app/componentes/prediccion-tiempo/prediccion-tiempo.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registrar datos de localización para "es-ES"
registerLocaleData(localeEs, 'es-ES');

bootstrapApplication(PrediccionTiempoComponent, appConfig)
  .catch((err) => console.error(err));
