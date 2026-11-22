import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

function showStartupError(title: string, detail: string) {
  try {
    document.body.innerHTML = `<pre style="padding:16px;margin:0;color:#fff;background:#7f1d1d;white-space:pre-wrap;word-break:break-word;font-family:monospace;font-size:13px;line-height:1.4;">${title}\n\n${detail}</pre>`;
  } catch {
    // Si el DOM aún no está listo, no bloquea el manejo del error
  }
}

window.addEventListener('error', (event) => {
  const stack = event.error?.stack ? `\n${event.error.stack}` : '';
  const loc = event.filename ? `\nArchivo: ${event.filename}:${event.lineno}:${event.colno}` : '';
  showStartupError('ERROR AL INICIAR (JS)', `${event.message || 'Error desconocido'}${loc}${stack}`);
});

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  const reason =
    event.reason?.stack ||
    event.reason?.message ||
    (typeof event.reason === 'string' ? event.reason : JSON.stringify(event.reason, null, 2));
  showStartupError('PROMESA RECHAZADA SIN MANEJAR', reason || 'Rechazo sin detalle');
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => {
    console.error(err);
    const detail = err?.stack || err?.message || String(err);
    showStartupError('ERROR EN BOOTSTRAP DE ANGULAR', detail);
  });