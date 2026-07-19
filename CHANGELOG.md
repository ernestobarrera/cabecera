# Changelog

## [0.37.0] - 2026-07-18

- **Editar en dos equipos a la vez ya casi nunca molesta.** Hasta ahora, si tu archivo cambiaba en otro equipo mientras editabas aquí, salía siempre la barra de conflicto y tenías que elegir un lado entero. Ahora Cabecera **combina sola** los dos lados cuando los cambios afectan a widgets distintos (que es lo normal): verás un aviso «Combinado con cambios de otro equipo» y sigues a lo tuyo.
- **La barra de conflicto, solo para el choque real — y te dice cuál es.** Aparece únicamente si los dos equipos tocaron **el mismo widget**, nombrándolo («Cambió en los dos lados: “…”»). Los botones de siempre deciden solo sobre lo que choca; todo lo demás ya viene combinado, y lo que escribas mientras la barra está abierta no se pierde.
- **Copia de seguridad antes de cada combinación.** Tu escritorio previo queda guardado en este equipo y se recupera en Inicio → «Restaurar copia», por si una combinación no te convence.

## [0.36.0] - 2026-07-16

- **Arrastra marcadores al widget de Enlaces.** Un marcador arrastrado desde la barra del navegador — o un enlace desde cualquier página — se suelta encima del widget y se añade al grupo donde lo dejes (el widget se ilumina al pasar por encima). Solo se aceptan direcciones http(s); si el arrastre trae título (según el navegador), se usa; si no, se pone el dominio y lo editas con ✎.
- **Reordena los enlaces arrastrándolos.** Cada enlace tiene ahora un asa ⋮⋮ (visible al pasar el ratón, como en Tareas): arrastra para cambiar el orden, moverlo a otro grupo o llevarlo a otro widget de enlaces.
- **Soltar algo fuera de un widget ya no navega la página.** Antes, si al arrastrar un marcador fallabas el destino, el navegador abandonaba Cabecera para abrir esa URL; ahora el suelto fuera de un destino válido simplemente no hace nada.

## [0.35.0] - 2026-07-14

- **Redimensionar desde cualquier borde.** Las ventanas se estiran ahora desde sus **cuatro bordes y cuatro esquinas** (antes, solo la esquina inferior derecha): el cursor cambia al acercarte y el lado opuesto queda fijo, como en las ventanas del sistema. Durante el gesto no se guarda nada — el tamaño se confirma al soltar, y si el gesto se cancela (por ejemplo al cambiar de ventana), todo vuelve exactamente a como estaba. La recolocación de la columna al crecer hacia abajo funciona igual desde cualquier asa.

## [0.34.0] - 2026-07-14

- **Panel de configuración general (⚙).** La rueda dentada que faltaba: en el acceso inferior derecho (y en Inicio y la paleta como «Ajustes generales»). Nada se aplica hasta pulsar **Guardar** — abrir, mirar o cancelar no toca nada — y las preferencias viajan con tus datos entre equipos. Dos ajustes de estreno, elegidos por tener uso real hoy:
  - **Tipografía de todo el sitio:** tres familias cuidadas (Sistema, Humanista, Clásica), con vista previa en vivo al cambiar el selector (Cancelar o Esc la revierten). El código sigue monoespaciado. Por seguridad solo se guardan identificadores de una lista cerrada — nunca nombres de fuente arbitrarios.
  - **Columnas de los escritorios nuevos:** con qué número de columnas (o Auto) nace un escritorio al crearlo. Los existentes no cambian, y solo el gesto de crear espacio consulta esta preferencia: cargar, sincronizar o restaurar jamás recolocan nada.

## [0.33.0] - 2026-07-14

- **«Reordenar este escritorio»: columnas de verdad, cuando tú lo pidas.** En el menú **▤** de la barra hay un botón nuevo que coloca de una vez todos los widgets del escritorio en las columnas elegidas: cada uno adopta el ancho de su columna y se apilan sin huecos, en el orden en que estaban (los plegados reservan su altura real, para que nada se solape al desplegarlos). Es siempre un gesto tuyo — elegir el número de columnas sigue sin mover nada, y Cabecera jamás recoloca sola al cargar, sincronizar o cambiar de pantalla. Deshacer doble: el botón del aviso y «Deshacer último reordenado» en el propio menú, que se queda ahí hasta el siguiente reordenado o la recarga; restaura todo o nada (si algo cambió entre medias, no deja el escritorio a medias). Si el resultado no cupiera en el área máxima del escritorio, se cancela entero con un aviso.
- **Con columnas fijas, ocupan todo el ancho.** Al fijar 2, 3 o 4 columnas, los carriles reparten el ancho completo de la pantalla (como los escritorios de columnas clásicos); en Auto se mantiene el ancho moderado con la cuadrícula centrada de siempre.
- **Las columnas se ven.** Con un número fijo, unos separadores verticales finísimos marcan las columnas en todo momento (no solo al arrastrar), sin estorbar: están debajo de los widgets y no se pueden clicar. En Auto desaparecen.
- **Un widget que sobresale ya no molesta a la columna de al lado.** Cada widget pertenece ahora a una sola columna (aquella donde tiene la mayor parte); si sobresale unos pocos píxeles hacia la vecina, esa invasión pequeña se ignora al recolocar — antes podía empujar hacia abajo a los widgets de la columna vecina.

## [0.32.0] - 2026-07-14

- **Los escritorios se leen mejor con cualquier fondo.** Las pestañas de espacio de la barra inferior tienen ahora texto más luminoso y un relleno sutil, la barra es un poco más opaca, y el velo oscuro que la página pone sobre el fondo **se adapta solo a la claridad del fondo elegido**: con fondos claros el velo aumenta para que el texto siga leyéndose bien, con fondos oscuros no cambia nada.
- **Más fondos de serie: de 6 a 14.** Nuevos degradados (océano, púrpura noche, granate, arena, niebla, tierra) y dos colores lisos oscuros. Los 6 originales conservan su sitio: si ya tenías uno elegido, no cambia.
- **Cabecera ⓘ también en las listas de tareas.** El botón ⓘ de la barra de título (visible al pasar el ratón) permite ponerle a una lista de tareas una línea que explica qué guarda, igual que en las notas: discreta, y nítida al pasar el ratón. Clic en la línea para editarla; vacía, se quita.

## [0.31.0] - 2026-07-13

- **Las columnas ahora ocupan el hueco.** Al sacar una ventana de una columna para llevarla a otra, las que quedaban debajo **suben a cerrar el hueco** que deja; y si la mueves dentro de su misma columna, esa columna se reorganiza de una vez. Todo con botón **Deshacer**.
- **Estirar una ventana recoloca las de debajo.** Si agrandas hacia abajo una ventana que está en una columna y pisa a la de debajo, esta **baja para hacer sitio** al soltar (con Deshacer). Solo ocurre al crecer en alto dentro de una columna; estirar a lo ancho o fuera de una columna no recoloca nada.
- **Animación de flujo.** Las ventanas que se recolocan **viajan** suavemente a su nuevo sitio (~150 ms) en vez de saltar, para dar sensación de continuidad. Respeta la preferencia del sistema «reducir movimiento» (sin animación si la tienes activada).
- **Elegir el número de columnas.** Un control **«▤»** en la barra inferior permite fijar las guías de arrastre en **Auto, 2, 3 o 4** columnas por escritorio (Auto = según el ancho de la pantalla, como hasta ahora). Solo afecta a los siguientes arrastres: no recoloca lo que ya tienes. Si eliges más columnas de las que caben en tu pantalla, lo indica (por ejemplo «4→2»). En el móvil el control se oculta (no hay arrastre), pero tu elección se conserva.

## [0.30.1] - 2026-07-13

- **Corrección interna del arrastre por columnas:** si al soltar una ventana en una columna el reacomodo de las de debajo se saliera del área máxima del escritorio, la operación se cancela con un aviso («no cabe ahí») en vez de dejar alguna ventana fuera de alcance. Caso extremo (columnas muy cargadas cerca del fondo); no cambia el uso normal. Con test.

## [0.30.0] - 2026-07-13

- **Ventanas de diálogo propias, coherentes en todo el sitio.** Los avisos de confirmación (borrar un espacio, quitar un concepto, aplicar un pack, restaurar una copia) y el editor de enlaces dejan de usar los cuadros grises del navegador y pasan a un diálogo propio, con el mismo estilo minimalista que el resto de la aplicación: Esc cancela, Enter confirma la acción principal. El **editor de enlaces** es ahora un formulario con Título y URL en un solo diálogo (antes eran dos ventanitas seguidas del navegador).
- **Arrastrar una ventana maximizada la restaura.** Antes había que restaurarla (❐) antes de moverla; ahora, si agarras una ventana maximizada por su barra y la arrastras, se restaura sola a su tamaño anterior y la llevas donde quieras — como en el escritorio del sistema.
- **Editar una tarea larga muestra el texto entero.** El editor de una tarea pasa de una sola línea a un cuadro que crece con el texto, así ves y editas toda la tarea aunque sea larga (Enter confirma).
- **Enlaces desde Ctrl+K aunque no escribas `https://`.** Si tecleas un dominio a secas (`hospitalclinic.org`, `www.sitio.com/ruta`), la paleta lo reconoce y lo ofrece como enlace, completándolo con `https://`. Antes solo funcionaba con la dirección completa o el prefijo `e`.

## [0.29.0] - 2026-07-12

- **Columnas guiadas al arrastrar (estilo Netvibes).** Al mover una ventana, el escritorio muestra 2, 3 o 4 carriles según el ancho de tu pantalla; la ventana se **encaja en el carril** donde apuntes (adopta el ancho del carril y conserva su alto) y las ventanas que estaban debajo **hacen sitio hacia abajo** — se marcan mientras arrastras para que veas quién se moverá. Al soltar, todo se reordena en un solo paso con un botón **Deshacer**. La tecla **Alt** sigue dejando la ventana libre, exactamente donde la sueltes, sin carriles. Los carriles solo aparecen durante el arrastre; una vez dentro de un carril te mantienes en él hasta que cruzas de lleno al vecino (sin parpadeos). Con un filtro de etiqueta activo se mantiene el comportamiento anterior (no se recolocan ventanas ocultas). Es el nivel 1 de tu idea; construido sobre revisión externa del diseño, con tests y prueba en navegador.
- **El escritorio ahora tiene scroll vertical.** Si tienes más ventanas de las que caben, el escritorio se desplaza hacia abajo para alcanzarlas (antes se quedaban al borde inferior). Al arrastrar cerca del borde superior o inferior, el escritorio se desplaza solo para que puedas llevar una ventana lejos. **Autoordenar** reparte las ventanas por todo el lienzo en vez de apretujarlas en la pantalla. Maximizar cubre la parte visible y bloquea el desplazamiento mientras esté activo. Tus posiciones y tamaños guardados no se tocan.

## [0.28.0] - 2026-07-11

- **Cabecera avisa cuando hay una versión nueva.** La página vive en pestañas abiertas durante días y solo se actualiza al recargar: era fácil estar usando una versión antigua sin saberlo (y creer que algo «no funciona» cuando ya está arreglado). Ahora la página consulta de vez en cuando su propia versión publicada — un archivo `version.txt` de una línea, servido por el mismo sitio que ya te sirve la app: sin cuentas, sin rastreo, sin terceros — y, si hay una más nueva, aparece un aviso discreto y permanente abajo a la derecha con un botón **Recargar**. El botón se desactiva solo mientras haya cambios guardándose (y lo re-comprueba en el último instante), así recargar nunca puede perder trabajo; si hay un aviso de conflicto de sincronización, el de versión se retira y vuelve al resolverse. La ✕ lo cierra por esa sesión. Honesto: tras publicar, el aviso puede tardar unos 10 minutos en aparecer (caché del servidor). Con tests (comparación de versiones estricta, versión única en app/archivo/changelog, sin consultas simultáneas, bloqueo del botón).
- **Tus conceptos de calendario, por delante y con chips clicables.** En el editor de marcas (Mes → clic en un día), el desplegable «Tipo» muestra ahora el grupo **«Tus conceptos» al principio**, antes que los conceptos estándar; y hacer clic en el chip de un concepto lo selecciona directamente como tipo de la marca (la ✕ del chip sigue siendo borrar el concepto, con confirmación). Con tests.

## [0.27.1] - 2026-07-11

- **Corregido: el clic de tarea completada ya no enmudece.** Cada sonido creaba y cerraba su propio contexto de audio; si la salida de sonido tardaba en abrirse más que el propio tono (típico con auriculares Bluetooth o tras un rato en silencio), el clic moría antes de oírse — sonaba la primera vez y luego no. Ahora todos los sonidos (avisos y clic) comparten un único contexto de audio que se mantiene vivo. Con invariantes en tests.
- **Corregido: el recuento de la píldora se actualiza al cambiar de espacio.** El «🧩 N widgets · N notas» de la barra mostraba los del espacio anterior hasta el siguiente ciclo de 45 segundos; ahora se refresca con cada cambio.
- **Archivos: la limitación de «Fecha» en carpetas, explicada donde se usa.** Las carpetas van siempre arriba y ordenadas por nombre porque el navegador no ofrece su fecha de modificación (solo la de los archivos); ahora lo cuenta el propio botón «Fecha» al pasar el ratón, y la guía lo recoge.

## [0.27.0] - 2026-07-11

- **Arrastrar con sombra de destino: ves dónde quedará la ventana antes de soltarla.** Hasta ahora, al arrastrar, la propia ventana saltaba al imán sin avisar. Ahora la ventana sigue al puntero con suavidad y una sombra discreta muestra el destino exacto (alineado con bordes y ventanas vecinas); al soltar, la ventana se asienta ahí con una transición corta (se respeta `prefers-reduced-motion`). Si el destino solapa otra ventana, la sombra lo avisa con un tinte — el solape sigue permitido: el escritorio es libre y con **Alt** la ventana queda exactamente donde la dejes, sin sombra. La sombra ya no encaja contra ventanas ocultas por el filtro de etiquetas.
- **El arrastre ya no puede guardar posiciones a medias.** Durante el movimiento no se toca el estado: la posición se confirma una sola vez al soltar. Antes, un arrastre largo podía coincidir con el guardado automático y persistir una posición intermedia. La cancelación (pérdida de foco, gesto interrumpido) devuelve la ventana a su sitio sin escribir nada.
- **Núcleo geométrico unificado (interno).** Las piezas de layout (imán, encuadre, autoordenar, colocación de widgets nuevos) comparten ahora un inventario único de constantes y planificadores puros con tests. Honesto: **«Autoordenar» puede dar resultados ligeramente distintos** a partir de esta versión — el empaquetado calculaba las filas con un alto mínimo menor que el real visible (120 frente a los 140 que ya pintaba el CSS) y algunos widgets podían quedar más juntos de lo que estaban en pantalla; ahora mide lo que ves. Tus tamaños y posiciones guardados no se tocan.
- Con tests nuevos (destino del arrastre, planificadores de autoordenado y de huecos, invariantes de la transacción de arrastre) y verificación completa en navegador. Guía y tour actualizados.

## [0.26.1] - 2026-07-10

- **Conceptos de calendario propios, ahora reutilizables de verdad y sin confusiones al borrar.** Tres arreglos nacidos de uso real: (1) el botón «Guardar» del editor de marcas pasa a llamarse **«Añadir marca»** — siempre creaba una marca nueva, así que tras borrar una marca parecía que el borrado «no se guardaba» cuando en realidad se estaba añadiendo otra; quitar una marca se aplica al momento (ahora lo confirma un aviso) y basta con Cerrar. (2) Quitar un **concepto** propio (✕ del chip) pide confirmación y explica la diferencia con quitar la marca de un día, para no perder conceptos sin querer. (3) Al crear un concepto, el aviso indica el paso restante («Añadir marca» lo aplica a la fecha).
- **La gramática `v` acepta tus conceptos propios.** `v 12/8 avisos` marca el calendario con tu concepto «Avisos» (mayúsculas, tildes y guiones se toleran); si el concepto no existe —ni canónico ni tuyo—, la línea sigue sin parsear, como siempre. La pista de sintaxis y la guía lo recogen. Con tests (parser puro con lista de conceptos, casos con tilde/guion, rechazo estricto).
- **Completar una tarea suena con un clic breve.** Un toque discreto grave→agudo al marcar la casilla (nunca al desmarcar), sin archivos de audio y respetando la política de autoplay. Pequeño refuerzo del trabajo hecho.

## [0.26.0] - 2026-07-10

- **Privacidad escénica: comparte pantalla sin exponer tus notas.** Marca cualquier widget como privado con el botón **👁** de su barra de título (tenue cuando está marcado) y actívala desde el **👁 del acceso inferior derecho** o el comando «Privacidad» de la paleta. Los widgets privados se cubren con un panel opaco, su título pasa al genérico del tipo y sus etiquetas se ocultan; tampoco aparecen en la paleta (ni contenido, ni título, ni enlaces, ni etiquetas), los avisos de sus tareas suenan sin mostrar el texto y el salto ⏰/📌 solo va a tareas visibles. En directo no se pueden cambiar marcas (imposible destapar por un clic accidental) y el modo es de cada dispositivo: la sincronización no puede apagarlo a distancia ni una recarga lo desactiva. **Honestidad:** es privacidad visual, no cifrado — los datos siguen en claro en tu archivo; y en directo, papelera y bandeja muestran su contenido al abrirlas. Revisión externa del cambio antes de publicar: cerró cuatro fugas adicionales (el Dictado ya no revela el título de una nota privada como destino, la paleta abierta se recalcula al activar el modo, las listas privadas no se ofrecen como destino de captura y un filtro de etiqueta previo se limpia al activar). Con tests (marca estricta en el saneo, fugas de paleta/etiquetas/avisos y las cuatro anteriores cubiertas contra regresión) y guía actualizada.

## [0.25.1] - 2026-07-10

- **Corregido: «Tarea en “X”» resuelve su lista de destino en el momento del clic.** La opción de la paleta recordaba el widget exacto de cuando se pintó; si una sincronización desde otro equipo llegaba con la paleta abierta, el clic podía anunciar éxito sin guardar la tarea. Ahora el destino viaja por identificadores y se localiza contra el estado vigente al confirmar; si la lista ya no existe, se avisa en vez de fingir. Hallazgo de revisión externa; con test contra regresión.
- **Integración continua:** cada cambio publicado en el repositorio ejecuta automáticamente la suite de tests (GitHub Actions). No cambia nada para el usuario; es una red de seguridad del proyecto.
- **README: invariantes del proyecto.** Los compromisos que no cambian entre versiones (abrir nunca escribe, nada se crea sin confirmación humana, todo formato externo se sanea, sin cuentas ni telemetría ni credenciales almacenadas, intercambio con agentes manual y explícito) quedan enumerados como contrato público, separados del esquema interno, que sigue libre de evolucionar.

## [0.25.0] - 2026-07-10

- **Corregido: editar una tarea ya no recorta su texto.** Al confirmar la edición de una tarea, el texto se truncaba a 300 caracteres — las tareas largas (pegadas o convertidas desde la Bandeja) se amputaban a mitad de palabra. Ya no hay tope al editar, igual que no lo hay al crear. Con test contra regresión.
- **Los avisos de tareas ya suenan también al abrir por la mañana.** El navegador bloquea el audio hasta el primer gesto del usuario (política de autoplay), así que los avisos que saltaban nada más abrir se veían pero no sonaban. Ahora ese sonido se encola y suena con tu primer clic o tecla.
- **Tareas más legibles: el texto ocupa todo el ancho.** Los botones de cada tarea (color, editar, subir/bajar, fecha, borrar) ya no roban espacio a la derecha: aparecen debajo del texto al pasar el ratón. En pantallas táctiles se muestran siempre.
- **URLs clicables en las tareas.** Una dirección `https://…` pegada en el texto de una tarea se convierte en enlace (se abre en pestaña nueva); la puntuación de alrededor queda fuera del enlace. Con tests (escape previo, esquemas no web rechazados).
- **Las notas ganan cabecera opcional.** El botón ⓘ de la barra de título (oculto hasta pasar el ratón) permite escribir una línea que explique qué guarda esa nota; se muestra discreta sobre el texto y nítida al pasar el ratón. Clic sobre ella para editarla; vacía, desaparece.
- **Conceptos de calendario propios, con tu color.** Si «Avisos» o «Urgencias» no existen entre los conceptos canónicos, créalos desde el editor de marcas (**＋ Concepto propio**): nombre y color propios, visibles en Mes, Año, Permisos y los resúmenes. Se pueden quitar (sus marcas pasan a «Otro» conservando la etiqueta). El saneado del archivo los acepta y los limita (máx. 24, color hex, sin pisar los canónicos).
- **La captura `t …` puede elegir lista de destino.** Si tienes widgets de tareas con nombre («dudas clínicas», «curiosidades»…), la paleta ofrece, además del destino habitual, «Tarea en “X”» para cada lista nombrada (máx. 3, las del espacio activo primero) — sin cambiar la gramática: la línea se escribe igual.
- **Archivos: cabeceras de columna clicables.** Nombre, Tipo, Fecha y Tamaño como cabeceras; un clic ordena por esa columna y otro invierte el sentido (▲/▼), que queda guardado. Sustituye al desplegable de ordenación.
- **Doble clic en el escritorio abre la paleta.** La paleta es ya el centro de Cabecera (buscar, ejecutar y crear con la gramática), así que el doble clic sobre una zona vacía la abre directamente; el menú de creación de widgets junto al puntero sigue disponible con **Ctrl + doble clic**.
- **Fin de las escrituras fantasma: abrir Cabecera ya no escribe nunca tu archivo.** Dos guardados automáticos podían escribir `datos.json` sin que tocaras nada — el reajuste de ventanas maximizadas al cambiar el tamaño del navegador, y el registro «ya avisé» de las alarmas de tareas al dispararse. Ese segundo caso era exactamente el conflicto matutino: abrías la pestaña, saltaban los avisos de la noche y Cabecera escribía sobre la versión vieja antes de que tu nube bajara la buena, generando copias en conflicto. Ahora los cambios automáticos viven en memoria y viajan a disco con tu siguiente edición real; tu arrastre y redimensionado manual siguen guardándose como siempre.
- **Guardián de frescura al volver a la pestaña.** Tras más de un minuto en segundo plano (donde el navegador congela la vigilancia periódica), el primer guardado espera a comprobar la sincronización — verás «comprobando sincronización…» un instante — para no escribir sobre una versión anticuada mientras tu nube todavía descarga.
- Coste asumido y honesto: si un aviso de tarea suena y cierras sin editar nada, al reabrir puede sonar una vez más. Con tests nuevos (comportamiento por modo e invariantes contra regresión de los puntos auditados).
- **Los widgets ya no se quedan fuera de encuadre al cambiar de ordenador o de tamaño de ventana.** Antes, un widget guardado en un monitor grande podía aparecer parcial o totalmente fuera de la pantalla en un portátil, sin forma de recuperarlo salvo autoordenar. Ahora cada widget se ajusta automáticamente al espacio visible disponible al abrir Cabecera, sin necesidad de tocar nada; tu posición y tamaño guardados no se pierden — solo se ajusta lo que ves, y se guarda de verdad únicamente si arrastras, redimensionas o autoordenas. El caso de tener más widgets abiertos de los que caben a la vez sigue pendiente de una solución propia (scroll, panorámica o rejilla) — de momento cada uno se ajusta por separado. Con tests (`fitRectToViewport`, `planViewportLayout`) cubriendo portátil, monitor grande, 4K, ventana estrecha, widgets plegados/maximizados y muchos widgets a la vez.

## [0.24.0] - 2026-07-08

- **Mes y Año se redimensionan con criterio.** Ambos widgets tienen ahora tamaño mínimo propio (no se pueden encoger hasta ser ilegibles), el Año añade columnas de una en una al crecer (la letra baja suave, sin saltos) y los widgets Mes existentes ganan una sola vez el nuevo alto por defecto, con más aire para el resumen.
- **El widget Archivos gana buscador y ordenación.** Busca por nombre dentro de la carpeta concedida (incluye subcarpetas) y ordena por nombre, tipo o tamaño, con tamaños legibles. Con tests (`matchesTerm`, `extOf`, `humanSize`).
- **«Calendario» pasa a llamarse «Mes»**, y tanto Mes como Año escalan ahora su tipografía al tamaño real de la ventana: amplíalos y se leen, no solo se estiran.
- **Arrastre de pestañas más claro.** La pestaña que arrastras se atenúa y una barra de acento animada señala el lado exacto de inserción, sin parpadeos. El punto de color ● de Nota/Tareas muestra una rueda de color cuando aún no hay color elegido.
- **Más seguro al conectar carpeta de sincronización.** Leer y vigilar `datos.json` ya no fabrica el archivo si falta de forma transitoria (nube aún sincronizando): antes, cualquier ausencia momentánea podía crear un archivo vacío en silencio. Y si la carpeta conectada no tiene aún `datos.json`, Cabecera pregunta antes de crear nada («Reintentar» / «Crear aquí» / elegir otra carpeta), en vez de sembrar un escritorio nuevo sin avisar. Guía actualizada con una nota sobre copias en conflicto y el historial de versiones de tu propia nube.
- **La paleta recuerda la gramática de captura donde se usa.** Al abrir Ctrl+K en vacío aparecen chips discretos («t tarea», «n nota», «c clip», «e enlace», «v 12-16/8») que rellenan el prefijo con un clic, más un acceso a la sintaxis completa de la guía. Y si tecleas un prefijo incompleto o con una fecha imposible (`v 31/2`), una línea de pista te enseña la sintaxis correcta sin interrumpir la búsqueda. Con test propio (`captureHint`).

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
