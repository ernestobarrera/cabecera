# Changelog

## [0.6.0] - 2026-07-05

- **Dictado → nota receptora**: marca con 🎙️ (en la barra de título de una nota) cuál recibe el dictado; la nota elegida queda resaltada y el widget Dictado muestra su destino y hace un destello sobre ella al enviar. Así queda claro adónde va el texto cuando hay varias notas.
- **Corregido el reenvío del dictado**: al enviar a la nota, el cuadro de dictado se vacía; antes conservaba el texto ya enviado y, al seguir hablando, lo reenviaba.
- **Calendario con fines de semana en color**: domingos en rojo, sábados en ámbar (también en las cabeceras).
- **Festivos nacionales de España** en el calendario, sin conexión: los fijos más el Viernes Santo (calculado a partir de la Pascua), con el nombre al pasar el ratón. Un pack puede añadir además festivos locales o autonómicos.

## [0.5.0] - 2026-07-04

- **Calculadora**: widget de ejecución inmediata (sin `eval`), con soporte completo de teclado (números, `+ − * /`, Enter, retroceso, Escape, `%`, `±`).
- **Dictado por voz**: transcribe con el micrófono (Web Speech API de Edge/Chrome, español), texto editable, copiar y enviar a Nota. Si el navegador no lo soporta, la Guía recuerda la alternativa nativa de Windows (Win+H) sobre cualquier cuadro de texto.
- **Reloj analógico por defecto** (conmutable a digital).
- **Corregido: el reloj nacía invisible** — la comprobación de ciclo de vida se ejecutaba antes de insertar la ventana en el DOM y cancelaba su propio intervalo; ahora el guard vive solo en el tick.
- **Corregido: el menú Inicio se cortaba** con más de ~9 widgets (overflow oculto); ahora la rejilla de widgets tiene scroll propio y las acciones quedan siempre visibles.

## [0.4.0] - 2026-07-04

- **Corregido el aviso de conflicto recurrente**: la vigilancia no corre durante el propio guardado; un cambio de fecha del archivo con contenido idéntico (habitual con OneDrive) ya no cuenta como conflicto; al volver a la pestaña se comprueba de inmediato; y si la página está abierta en dos pestañas, avisa.
- **5 widgets nuevos**: Markdown (editor + vista, con todo el HTML escapado antes de formatear), Imagen (pegar con Ctrl+V o arrastrar; se reescala y viaja en `datos.json`), Temporizador (cuenta atrás, cronómetro y alarma con aviso sonoro), Calendario (con semana ISO) y Buscadores (plantillas de URL con `%s`, ampliables).
- **Reloj analógico** conmutable con el digital.
- **Enlaces**: edición por enlace y «⇱ todo» para abrir el grupo completo.
- **Títulos de ventana editables** (doble clic en la barra de título; viajan en los packs como `t`).
- **Packs en modo añadir**: casilla para sumar un pack al escritorio sin sustituirlo.
- **Guía integrada** (qué es, cómo funciona por dentro, seguridad, atajos) y **píldora informativa** en la barra (semana ISO y día del año, tareas pendientes, consejos de uso).
- **Detección de cambios por contenido**: la vigilancia compara el texto del archivo, no solo marcas de tiempo — una edición externa de `datos.json` (por ejemplo, de un agente) se detecta siempre, aunque no actualice `updatedAt`.
- **Aviso de tamaño**: si los datos superan 5 MB (imágenes), la página avisa de que la sincronización puede ir lenta.
- `normalizePack` ampliada a los tipos nuevos. **Suite de tests versionada** en `tests/test.js` (sin dependencias: sintaxis, XSS del Markdown, saneado de packs maliciosos y validación de los packs incluidos).

## [0.3.0] - 2026-07-04

- El proyecto pasa a llamarse **Cabecera** ("tu página de cabecera"). Renombrado global, incluidas claves de almacenamiento (`cabecera-*`), base IndexedDB y campo de formato de packs (`cabeceraPack`).
- Publicado en GitHub Pages: https://ernestobarrera.github.io/cabecera/

## [0.2.1] - 2026-07-04

Endurecimiento tras auditoría de robustez y seguridad:

- **Conflicto**: con un conflicto de sincronización abierto se bloquea todo autoguardado hasta que el usuario decide (antes, un guardado pendiente podía sobrescribir los cambios remotos).
- **Packs tratados como contenido no confiable**: `normalizePack()` con esquema estricto — solo URLs http/https, dimensiones numéricas acotadas, textos truncados, tipos de widget en lista blanca, y el fondo de un pack solo puede ser preset o archivo local (nunca URL remota). Con test automatizado de pack malicioso.
- **Bandeja tolerante a escrituras concurrentes**: `inbox.txt` se relee justo antes de cada escritura; las líneas añadidas por otros programas no se pierden.
- **Restaurar copia**: acción de menú que recupera la copia previa al último pack o el escritorio local previo a conectar carpeta.
- **Comprobar novedades** del pack seguido a demanda.

## [0.2.0] - 2026-07-04

- Modo local por defecto: la página funciona al primer segundo; la carpeta sincronizada (OneDrive) es opcional.
- Sistema de packs: escritorios preconfigurados en JSON, cargables desde el menú, por URL (`?pack=`) o desde archivo.
- "Seguir pack compartido": un `pack.json` en una carpeta compartida sincronizada (OneDrive/Teams); la página avisa cuando el mantenedor lo actualiza. Copia local automática antes de aplicar cualquier pack.
- Packs iniciales `sanitarios` y `basico`. Widget de bienvenida. Licencia MIT.

## [0.1.0] - 2026-07-04

- Escritorio de widgets: enlaces con buscador tipo lanzador (tecla `/`), notas, tareas, portapapeles de fragmentos, QR y reloj.
- Ventanas arrastrables y redimensionables, fondos personalizables (degradados, URL, `fondo.jpg` de la carpeta).
- Datos en `datos.json` en una carpeta elegida por el usuario (File System Access API), guardado automático, vigilancia de cambios externos y aviso de conflicto.
- Bandeja de entrada `inbox.txt` con conversión a nota/tarea/clip y parámetro `?add=texto`.
