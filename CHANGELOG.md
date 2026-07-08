# Changelog

## [0.23.0] - 2026-07-08

- **Color de ventana en Nota y Tareas, más minimalista.** El color tipo post-it deja de mostrarse siempre en el cuerpo de la nota: ahora hay un botón **●** en la barra de título, oculto hasta pasar el ratón (igual que las etiquetas). El widget de Tareas gana la misma opción de color para toda la ventana (además del color por tarea, que ya existía).
- **Escritorios reordenables.** Arrastra una pestaña de espacio sobre otra para cambiar su orden.
- **Color de pestaña automático.** Si el fondo de un escritorio es uno de los degradados predefinidos, su pestaña se tiñe sola con el tono medio de ese fondo — sin selector de color aparte que mantener.
- Guía integrada y `guia.html` actualizados con los tres cambios. Test nuevo (`gradientAvgHex`).

## [0.22.0] - 2026-07-07

- **Captura rápida: escribe y Cabecera lo coloca.** La paleta (Ctrl+K) ahora también **crea**: `t llamar a Juan @mañana` (tarea con fecha), `n idea` (nota), `c fragmento` (clip), una URL pegada (enlace al grupo «Capturados») o `v 12-16/8` (vacaciones en el calendario global; admite concepto: `v 12/8 guardia`). La primera opción de la paleta muestra qué se creará y en qué espacio; Enter confirma. Si lo escrito no encaja con la gramática, la paleta sigue siendo búsqueda normal — sin modos.
- **La misma gramática en la Bandeja.** Una línea de `inbox.txt` que siga la gramática (escrita por ti desde el móvil, por una macro de teclado o por un agente de IA) ofrece su conversión sugerida con el destino visible; un clic la convierte. **Nada se crea sin confirmación humana**, línea a línea. Es el mismo lenguaje para personas y programas: local, determinista y sin red.
- Reglas deliberadamente predecibles: prefijo en minúscula, fechas `@hoy`/`@mañana`/`@DD/MM` (siempre año actual; otro año se escribe explícito) y, ante cualquier duda, no se interpreta. Fecha imposible en una tarea (`@31/2`) no se pierde: queda en el texto.
- Gramática documentada como **contrato estable** en el README (sección Integraciones), la guía integrada y `guia.html`. Parser puro `parseCapture` con batería propia de tests (fechas frontera, año bisiesto, no-parseos).

## [0.21.1] - 2026-07-07

- **Corregido: maximizar/restaurar entre monitores distintos.** Una ventana maximizada en un monitor grande podía abrirse desbordada en uno pequeño, y al restaurar podía saltar a coordenadas fuera de pantalla. Ahora la geometría maximizada se recalcula siempre contra la pantalla actual (al cargar, al restaurar y al redimensionar la ventana del navegador), y la restauración re-encaja el tamaño y la posición guardados para que la ventana quede visible. Con tests de cambio de viewport y de datos manipulados.

## [0.21.0] - 2026-07-07

- **Aviso propio de tareas con fecha.** Las tareas vencidas (⏰) o que vencen hoy (📌) tienen ahora su propio indicador fijo en la barra, separado de la píldora informativa rotatoria; cada clic salta a la siguiente tarea afectada, aunque esté en otro espacio. La píldora conserva la semana ISO, el progreso global y los consejos.
- **Barra de espacios más clara con muchas pestañas.** El botón **＋** queda siempre visible (ya no se pierde al final del scroll), las pestañas se desplazan con la rueda del ratón, los bordes se desvanecen cuando hay más pestañas ocultas, los nombres largos se recortan con puntos suspensivos y la pestaña activa se mantiene a la vista.
- **Desplegar sin solapes.** Si pliegas todos los widgets, los autoordenas y luego los despliegas, Cabecera detecta que el layout compacto ya no cabe y los reordena sola.
- **Ventanas con imán.** Al arrastrar una ventana se alinea automáticamente con los bordes del escritorio y con las demás ventanas (alineación y adyacencia con hueco uniforme); mantén **Alt** para moverla libre.
- **Maximizar/restaurar.** Nuevo botón **⛶** en la barra de cada ventana: la amplía a todo el escritorio y **❐** la devuelve exactamente a su tamaño y posición anteriores. Ideal para Año, Markdown o Calendario.
- **Escape cierra.** La tecla Esc cierra el modal abierto, el tour o el menú, en ese orden.
- **Autoordenar acotado.** El autoordenado ya no puede dejar ventanas enteras por debajo del borde inferior: la barra de título queda siempre accesible y, si no caben todas, lo avisa.
- **Los toasts ya no tapan el dock.** Los avisos emergentes aparecen por encima de los accesos rápidos inferiores.
- Guía integrada, `guia.html` y consejos de la píldora actualizados. Test nuevo del imán de arrastre (`snapPosition`).

## [0.20.0] - 2026-07-07

- **Calendario más legible y explicativo.** El widget mensual se adapta mejor al ampliar, muestra una ayuda visible para añadir días y añade resumen de hábiles/festivos y conceptos del mes.
- **Conceptos canónicos ampliados.** Las marcas de calendario incluyen vacaciones, asuntos, antigüedad, formación/docencia, exámenes, conciliación, familiar, consulta médica, deber público, traslado, compensación horaria y festivos locales/nacionales.
- **Festivos manuales en rojo.** Los festivos locales o nacionales añadidos por el usuario se pintan en rojo y entran en el cálculo de días hábiles/festivos.
- **Nuevo widget Permisos.** Permite registrar días u horas por concepto y ver el cómputo anual, interoperando con los widgets Calendario y Año mediante las mismas marcas globales.
- **Vista Año con resumen.** El widget Año muestra hábiles, festivos laborables y totales por concepto junto a los 12 meses.
- **Tareas con color discreto.** Cada tarea puede llevar una barra de color visible y un selector que aparece solo al pasar el ratón.
- **Alta de widgets más visible.** Al crear widgets pequeños como Reloj, Cabecera prioriza que aparezcan completos dentro de la pantalla.
- **Guía actualizada.** La ayuda integrada, `guia.html` y `README.md` explican calendario, permisos, festivos y cómputo anual.

## [0.19.0] - 2026-07-06

- **Paleta centrada con Ctrl+K.** El menú Inicio sigue siendo el panel completo de widgets y ajustes; Ctrl+K (o `/`) abre ahora una paleta central más parecida a un lanzador de comandos.
- **Accesos mínimos en el escritorio.** Abajo a la derecha hay una entrada discreta a Ctrl+K, Autoordenar, Papelera e información básica del proyecto.
- **Crear widgets con doble clic en el escritorio.** Doble clic sobre una zona vacía abre el menú junto al puntero para añadir widgets más rápido.
- **Alta de widgets más visible.** Los widgets nuevos buscan un hueco libre antes de aparecer, evitando que queden tapados por ventanas existentes.
- **Sincronización más accionable.** El estado de sincronización de la barra inferior ahora se puede pulsar: en modo local abre la conexión de carpeta; en modo sincronizado comprueba cambios.
- **Tareas editables, ordenables y con avisos.** Cada tarea se puede editar inline, arrastrar para reordenar, subir/bajar, anotar y mandar a papelera; el botón 📅 permite fecha, hora de aviso local y nota.
- **Temporizador rediseñado.** Cuenta atrás con diales manejables por rueda/flechas, presets rápidos, sonidos configurables, cronómetro con vueltas y alarma local con etiqueta.
- **Calendario con marcas canónicas.** Cualquier calendario permite marcar rangos como vacaciones, guardia, curso o personal; las marcas viven en el estado global y se pintan también en el widget Año.
- **Widget Año.** Nueva vista anual con los 12 meses, festivos, marcas de calendario y año persistente.
- **Widget Archivos más prudente.** Explorador de una carpeta local elegida por el usuario, en modo lectura. No recuerda la carpeta salvo que se marque explícitamente, permite olvidarla y explica que las aperturas `blob:` son URLs temporales locales.
- **Papelera segura.** Los widgets y elementos no privados se pueden restaurar desde la papelera. Las notas no se guardan ahí: solo tienen deshacer inmediato.
- **Autoordenar widgets.** Acción para redistribuir las ventanas del escritorio en una cuadrícula limpia, visible también desde el acceso inferior derecho.
- **Renombrado inline.** Ventanas y espacios dejan de usar `prompt()` del navegador: se editan directamente en su título o pestaña.
- **Ayuda cuando el navegador bloquea ventanas emergentes.** Al abrir un grupo de enlaces, Cabecera explica cómo permitir las pestañas para la web si el navegador bloquea alguna.
- **Favicon propio.** Cabecera ya tiene icono identificativo para pestañas, favoritos y accesos anclados.
- **Etiquetas solo en hover.** El botón de etiqueta y la tira de etiquetas quedan ocultos en reposo para mantener el escritorio más minimalista; el editor de etiquetas ya no depende de `prompt()`.
- **Guía inicial actualizada.** La ayuda integrada y `guia.html` explican calendario con marcas, tareas con avisos, temporizador, dock inferior, privacidad de archivos y filosofía del proyecto.

## [0.18.1] - 2026-07-05

- **Corregido: las etiquetas se veían siempre en equipos con pantalla táctil.** Ahora la reserva a hover usa `any-hover`, así que basta con tener ratón o trackpad; en móviles sin ratón siguen visibles.

## [0.18.0] - 2026-07-05

- **Tareas con vencimiento e histórico.** Cada tarea admite una fecha de vencimiento (📅), con aviso a la vista: <span>vencida</span> en rojo, «hoy» en ámbar, o la fecha si es futura; las pendientes se ordenan por fecha. Al completar una tarea ya no se pierde: pasa a un **histórico de hechas** (botón «🗂️ Hechas») con su propio buscador; desde ahí puedes restaurarla o borrarla. La barra inferior avisa de tareas vencidas o que vencen hoy.

## [0.17.0] - 2026-07-05

- **Tour interactivo.** Un recorrido guiado con foco (coach-marks) que resalta cada zona y explica lo esencial: añadir widgets, espacios, plegar, la barra de cada widget y sincronizar. Aparece solo la primera vez, y puedes lanzarlo cuando quieras desde la Guía («▶ Hacer el tour»), desde la paleta (Ctrl+K → «Tour interactivo») o desde la guía completa. Termina enlazando a la guía.

## [0.16.1] - 2026-07-05

- **Corregido: se había perdido el renombrar ventanas** (doble clic en el título). Al añadir el arrastre entre espacios, el widget se volvía «no clicable» nada más pulsar; ahora eso solo ocurre cuando de verdad empiezas a arrastrar, así que el doble clic para renombrar vuelve a funcionar.
- **Las etiquetas de un widget solo se muestran al pasar el ratón** (en el móvil, sin ratón, siguen visibles): estado en reposo más limpio.

## [0.16.0] - 2026-07-05

- **Guía completa (`guia.html`).** Una página-manual independiente que explica cómo funciona todo: empezar, widgets, espacios, etiquetas, la paleta, móvil, packs, sincronización, atajos y privacidad. Se abre desde la Guía integrada, desde el widget de bienvenida y desde la paleta (Ctrl+K → «Guía completa»), y es compartible como enlace (`…/cabecera/guia.html`). No es una portada-puerta: el escritorio sigue abriéndose directo.

## [0.15.0] - 2026-07-05

- **Etiquetas (eje transversal).** Cada widget puede llevar etiquetas (botón **🏷️** en su barra de título). Al hacer clic en una etiqueta —o buscarla en Ctrl+K— la vista deja solo los widgets con esa etiqueta, **a través de todos los espacios**; un indicador en la barra permite quitar el filtro. Es el segundo eje de organización: espacios (pestañas) + etiquetas (transversal).

## [0.14.0] - 2026-07-05

- **Plegar widgets (minimizar).** Cada ventana tiene un chevron **▾** en su barra de título que la enrolla a solo la cabecera; el botón **⊟** de la barra inferior pliega o despliega todas de una vez. El estado plegado se guarda. Al saltar a un widget con la búsqueda, se despliega solo.
- **Arreglada la vista móvil**: los widgets ya no se quedaban colapsados por dentro; ahora conservan su altura y son manejables (apilados a ancho completo). Pliégalos con ▾ para navegar cómodo en el móvil.

## [0.13.0] - 2026-07-05

- **Vista móvil.** En pantallas pequeñas, los widgets se apilan a ancho completo (misma información y edición, sin el escritorio libre): pensada para consultar y usar Cabecera desde el móvil. En pantalla grande sigue el escritorio de ventanas de siempre. El mismo `datos.json` sirve para ambos.
- El botón «⇱ N» de los grupos de enlaces ahora se ve siempre (antes solo al pasar el ratón), como recordatorio.

## [0.12.0] - 2026-07-05

- **Mover widgets entre espacios arrastrando**: arrastra una ventana por su barra de título y suéltala sobre la pestaña de otro espacio (se resalta al pasar por encima) para llevar ese widget allí.
- **Botón «⇱ N» en los grupos de enlaces**: muestra cuántos enlaces abre de una vez, como recordatorio a la vista. Guía y consejos actualizados.

## [0.11.0] - 2026-07-05

- **Espacios (escritorios múltiples).** En la barra, junto a Inicio, hay pestañas de espacios: **＋** crea uno nuevo, un **clic** cambia de espacio, **doble clic** lo renombra y **✕** lo elimina. Cada espacio tiene sus propios widgets y su propio fondo — ideal para separar por especialidad o proyecto. La búsqueda (Ctrl+K) mira en **todos** los espacios y salta al que corresponda.

## [0.10.0] - 2026-07-05

- **Nuevo formato interno de datos, preparado para escritorios múltiples.** Tu `datos.json` pasa a un formato con «espacios» (por ahora uno solo). La conversión es automática y transparente, y se guarda una copia del formato anterior por si acaso. No cambia nada visible todavía: es la base sobre la que llegarán las pestañas por especialidad, la vista móvil y los packs que se actualizan sin pisar tu trabajo. (Si tienes Cabecera abierta en varias pestañas, recárgalas tras actualizar.)
- **Menos avisos de conflicto falsos**: si la carpeta sincronizada cambia la fecha del archivo sin cambiar su contenido (algo habitual con OneDrive), ya no se muestra aviso de conflicto.
- Interno: reconectar la carpeta ya no acumula comprobaciones periódicas.

## [0.9.0] - 2026-07-05

- **Rutinas de pestañas desde la paleta**: cualquier grupo de enlaces con más de un enlace aparece en la paleta (Ctrl+K) como «Abrir grupo: …» y abre todas sus pestañas de una vez. Es la forma de montar un ritual diario (p. ej. tu radar de noticias): agrupas los enlaces una vez y lo lanzas con dos teclas. (El botón «⇱ todo» del propio grupo sigue estando.)

## [0.8.0] - 2026-07-05

- **Notas de colores (post-it)**: cada nota tiene una fila de colores para teñirla (amarillo, rosa, verde, azul, naranja) o dejarla sin color. El color viaja en los datos y en los packs.
- **Analítica ambiental en la barra**: la píldora informativa añade el recuento de widgets y enlaces, el progreso de tareas (hechas/total) y un aviso cuando hoy es festivo. Todo se calcula en local; no se envía nada a ningún sitio.

## [0.7.0] - 2026-07-05

- **Paleta de comandos (Ctrl+K)**: el buscador del menú Inicio pasa de buscar solo enlaces a buscar en **todo** —notas, tareas, fragmentos, Markdown, dictado, buscadores— y a **ejecutar comandos** (añadir cualquier widget, abrir Packs, Fondo, Exportar, etc.). Búsqueda por varias palabras; al elegir un resultado de contenido, salta a ese widget, lo trae al frente y lo destella. Se abre con `Ctrl+K` (o con `/` como antes).

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
