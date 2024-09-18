import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { PrediccionTiempoComponent } from './app/componentes/prediccion-tiempo/prediccion-tiempo.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registrar datos de localización para "es-ES"
registerLocaleData(localeEs, 'es-ES');

const bootstrap = () => bootstrapApplication(PrediccionTiempoComponent, config);

export default bootstrap;
