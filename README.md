# Cabecera

**Tu página de cabecera.** Página de inicio personalizable estilo "escritorio de widgets": enlaces con buscador, notas, tareas, portapapeles de fragmentos, generador QR y reloj, sobre fondo personalizable. Un solo `index.html` sin build, sin cuentas, sin servidor de datos y sin telemetría.

**Principio de diseño: tus datos son un archivo tuyo.** El código se sirve como página estática; los datos viven donde tú decidas — en el navegador, o en un `datos.json` dentro de una carpeta tuya (idealmente de OneDrive, para tener el mismo escritorio en el trabajo y en casa).

## Almacenamiento por capas

1. **Modo local (por defecto):** entras y funciona. Todo se guarda en el navegador (localStorage). Vale para cualquier navegador.
2. **Modo sincronizado (opcional):** menú Inicio → "Sincronizar equipos" → eliges una carpeta (p. ej. `OneDrive\cabecera-datos`). Los datos pasan a `datos.json` en esa carpeta. La ruta distinta entre equipos no importa: cada PC elige su carpeta una vez y el navegador recuerda el permiso (File System Access API; requiere Edge o Chrome y servir la página por HTTP/HTTPS).

Si conectas una carpeta vacía, tu escritorio local se traslada. Si la carpeta ya tiene datos (tu otro PC), esos ganan y tu versión local queda como copia (`cabecera-local-prev` en localStorage).

## Packs: escritorios preconfigurados y compartidos

Un **pack** es un escritorio ya montado (widgets, enlaces, fondo) definido en un JSON. Tres formas de cargarlo:

- **Menú Inicio → Packs**: packs incluidos (`Sanitario`, `Básico`).
- **Por URL**: `…/index.html?pack=sanitarios` o `?pack=https://cualquier-sitio/mi-pack.json`. Compartir un escritorio = compartir una URL.
- **Seguir un pack compartido** (la opción para equipos/centros): elige un `pack.json` que viva en una carpeta compartida sincronizada (OneDrive compartido, biblioteca de Teams/SharePoint con sincronización local). Quien mantiene el pack tiene permiso de escritura en M365; el resto, solo lectura. Cuando el mantenedor lo actualiza, la cabecera avisa y ofrece aplicar las novedades. **La gobernanza de permisos la pone M365; aquí no hay servidor ninguno.**

Antes de aplicar cualquier pack se guarda copia automática del escritorio actual (`cabecera-backup-antes-pack`).

### Formato de pack

```json
{
  "cabeceraPack": 1,
  "name": "Mi equipo",
  "settings": { "wallpaper": { "type": "preset", "value": 2 } },
  "widgets": [
    { "type": "links", "x": 40, "y": 40, "w": 300, "h": 300,
      "data": { "groups": [ { "name": "Grupo", "links": [ { "t": "Título", "u": "https://…" } ] } ] } },
    { "type": "notes" }, { "type": "todo" }, { "type": "clock" }
  ]
}
```

`type` ∈ `links | notes | todo | clips | qr | clock`. Posición y tamaño opcionales.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Toda la aplicación (HTML+CSS+JS vanilla) |
| `qrcode.js` | Librería QR (qrcode-generator, MIT) |
| `packs/*.json` | Packs incluidos |

En la **carpeta de datos** (modo sincronizado): `datos.json` (estado), `inbox.txt` (bandeja de entrada), `fondo.jpg`/`fondo.png` (fondo sincronizado, opcional).

## Puesta en marcha

**Versión publicada:** https://ernestobarrera.github.io/cabecera/

**Servidor local (desarrollo):**

```powershell
cd cabecera
python -m http.server 8765   # abrir http://localhost:8765
```

El código es público pero no contiene ningún dato; los datos siempre quedan en tu navegador o en tu carpeta.

## Integraciones

- **Bandeja (`inbox.txt`)**: cualquier línea escrita por otro programa (una macro de teclado, un agente, el móvil vía OneDrive) aparece en la página para convertirla en nota/tarea/clip.
- **Agentes**: `datos.json` es JSON legible/editable; la página recarga cambios externos en ≤4 s.
- **`?add=texto`**: añade a la bandeja (bookmarklets, accesos directos).
- **Sincronización y conflictos**: guardado automático, vigilancia del archivo cada 4 s, barra de conflicto si dos equipos editan a la vez (gana quien tú decidas).

## Límites conocidos

- Modo sincronizado y packs-desde-archivo: solo Edge/Chrome (File System Access API) y por HTTP(S), no `file://`.
- Sin fusión automática de conflictos (aviso y elección manual; con un solo usuario es raro).
- v1 pensada para pantalla de escritorio; sin vista móvil.
- Sin RSS todavía: requiere un proxy (CORS) — decisión de fase posterior.

## Uso responsable en entorno sanitario

Sin datos identificables de pacientes: ni en notas, ni en tareas, ni en la bandeja. No es historia clínica ni soporte diagnóstico. En PC compartido, usa perfil de navegador propio; localStorage y `datos.json` no están cifrados.
