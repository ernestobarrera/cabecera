# Changelog

## [0.67.0] - 2026-08-11 — desplegar devuelve el tamaño, y marcar una etiqueta la aplica

- **Una ventana plegada vuelve a su alto de verdad al desplegarla.** Si se había pintado ya plegada
  —al recargar, o al volver a su escritorio—, se abría a la altura de su cabecera y había que
  estirarla a mano para que cupiera algo. El alto guardado nunca se perdió: faltaba devolverlo.
- **En Tareas, además, se recalcula lo que cabe en la primera página** al desplegar, porque la
  paginación se mide sobre lo pintado y una ventana plegada no mide nada.
- **Marcar una etiqueta en el selector ya la aplica**, sin pulsar Guardar. El editor sigue abierto
  para marcar varias seguidas; **Guardar** queda para lo que escribes a mano en el campo de texto.
- No se ha cambiado el modelo de selección (un clic reemplaza / Ctrl añade): en un widget lo normal
  es añadir una etiqueta a las que ya tiene, y así un clic despistado borraría el resto.

## [0.66.0] - 2026-08-09 — la etiqueta de sistema dice para qué sirve

- **Al pasar el ratón por una etiqueta `ia-*` se explica su rol**, en el chip del widget y también en
  el selector de etiquetas. Antes solo veías el nombre, así que elegir una exigía saberla de memoria.
- El texto sale del mismo sitio que la cabecera ⓘ del widget, así que **no pueden decir cosas
  distintas**.
- **Las etiquetas tuyas no se explican**, a propósito: significan lo que tú quieras y el producto no
  opina sobre ellas. Solo las de sistema llevan contrato, y siguen distinguidas por color.

## [0.65.0] - 2026-08-09 — el contador cuenta los robots que se ven

- **Los contadores `· 🤖 n` de Pendientes y Hechas cuentan ahora todos los robots**, ámbar y grises.
  Desde 0.64.0 la fila pintaba robot en dos casos y los contadores seguían contando solo uno, así
  que dabas por vista una tarea con robot y en «Hechas» no aparecía nada. Un índice que esconde
  parte de lo que se ve.
- **La urgencia pasa a ser el color del contador, no su existencia:** en ámbar si alguno de esos
  robots te pide algo, apagado si todos solo informan. Así sabes cuántos hay sin que te reclamen.
- **El filtro devuelve exactamente lo que cuenta el número que lo abre.** Era el contrato de 0.59.0
  y se había roto al añadir el robot gris.
- Es el tercer sitio por el que salía el mismo defecto (0.62.0, 0.63.0 y este). La familia entera
  cuelga ya de una sola función, con test que lo fija.

## [0.64.0] - 2026-08-09 — el robot vuelve, apagado: contestar tiene que notarse

- **Cuando el agente te contesta algo informativo, la tarea muestra 🤖 gris.** En 0.62.0 caía en el
  mismo 💬 que una conversación en la que habías hablado tú el último, así que una respuesta nueva
  **no cambiaba nada en la fila**: no había forma de enterarse de que el agente había escrito.
- **Tres estados, y cada uno dice una cosa:** `🤖 ámbar` = te pide algo, no avanza sin ti ·
  `🤖 gris` = te ha contestado y no espera nada, léelo cuando quieras · `💬 gris` = hablaste tú el
  último, no hay nada nuevo.
- El robot recupera además su papel de **acuse de recibo**: al responder pasa a 💬 y así confirmas
  que tu «Vale» ha entrado, que es cómo lo venías usando.
- Sigue sin guardarse ningún «leído»: los tres estados salen del orden de la conversación y de lo
  que declara cada entrada.

## [0.63.0] - 2026-08-09 — el contador de «Hechas» cuenta lo que cerraste sin contestar

- **Cerrar una tarea sin contestar lo último del agente ya cuenta en `🗂️ Hechas · 🤖 n`.** Antes el
  contador solo miraba lo que llegaba **después** de cerrarla, sobre la premisa de que lo anterior
  «ya lo habías leído, por eso cerraste». Era falsa: la fila seguía pintando 🤖 y el contador decía
  0, así que el aviso y el recuento se contradecían mirándose.
- **Se cae la fecha de cierre de la ecuación.** La pregunta pasa a ser «¿la cerraste sin contestar
  lo que te pedía?» y hay **una sola regla en todo el producto**: fila, contador de Pendientes,
  contador de Hechas y los dos filtros salen de la misma función. Es el tercer parche del mismo
  agujero (0.50.0, 0.59.0) y el primero que lo cierra entero en vez de por el borde.
- El 🤖 de la fila **sigue viéndose en las cerradas**, como pedías: persiste como constancia de que
  el mensaje se leyó, y ahora el contador acompaña en vez de desmentirlo.
- Medido antes de tocar: en tu archivo el contador pasa de 0 a **2** en la bandeja y de 0 a **4** en
  «probar». Lo informativo (0.62.0) no cuenta aquí tampoco.

## [0.62.0] - 2026-08-09 — el 🤖 solo se enciende cuando el agente te pide algo

- **El ámbar deja de significar «habló el agente» y pasa a significar «te pide algo».** Hasta ahora
  se encendía igual cuando había una decisión esperándote que cuando el agente solo decía
  «recibido, encolado»: te cobraba un clic y una lectura para devolverte nada. Un aviso que la
  mitad de las veces viene vacío se aprende a ignorar entero, y entonces el que sí traía algo
  tampoco se abre.
- **Dos señales con significados distintos:** 🤖 ámbar = el agente te pide algo y no lo has
  contestado, no avanza sin ti. 💬 gris = hay conversación pero no te debe nada, léela cuando
  quieras. El contador de la pestaña y el filtro cuentan lo mismo que pinta la fila.
- **Ya no tienes que cerrar avisos.** A lo informativo no hace falta contestar: el silencio vale,
  igual que en «probar». Con eso, un «Vale» vuelve a significar una sola cosa —aceptas—, en vez de
  servir también para apagar un robot que no traía nada.
- El turno **se sigue deduciendo del orden**, sin ningún «leído» guardado: quien escribe la entrada
  declara si necesita respuesta, y eso ya no cambia nunca. Nada que pueda desincronizarse entre tus
  dos equipos ni entre agentes.
- Lo escrito antes de esta versión **no se apaga solo**: sin esa marca se sigue tratando como
  ámbar, antes que esconder algo que sí esperaba respuesta.

## [0.61.0] - 2026-08-09 — anclar una tarea arriba

- **Cada tarea tiene un botón 📌 en su barra de acciones.** Lo anclado va **siempre arriba**, con
  cualquier criterio de orden —a mano, por fecha de alta, por vencimiento— y dentro de cada grupo
  se respeta el criterio que hayas elegido. Una tarea anclada se ve como tal sin pasar el ratón: un
  📌 delante del texto y un filete en el borde izquierdo.
- Solo ordena en **Pendientes**. «Hechas» es un histórico cronológico y flotar cosas ahí mentiría
  sobre cuándo las cerraste; la marca 📌 sí se sigue viendo.
- **No se arrastra entre una anclada y una sin anclar**, y **↑ ↓ saltan al vecino que se ve**: antes,
  con la lista filtrada o paginada, la flecha podía mover el dato sin mover nada en pantalla.
- Nota: la barra de acciones gana un botón, así que reserva unos píxeles más a la derecha de cada
  fila. Se mide sola (desde 0.58.2), pero si lo notas, el siguiente recorte natural son ↑ ↓, que
  hacen lo mismo que el asa ⋮⋮.

## [0.60.0] - 2026-08-09 — buscar mira en las dos listas y las separa

- **El buscador de una lista de tareas busca ahora en pendientes y en hechas a la vez**, y presenta
  los resultados **agrupados**: primero las pendientes bajo su subtítulo, y detrás las hechas,
  tachadas, bajo el suyo. Cada subtítulo lleva su recuento y se queda a la vista mientras te
  desplazas. Antes buscaba solo en la pestaña en la que estuvieras, lo que obligaba a buscar dos
  veces y a acertar a la primera: buscar y navegar son cosas distintas — navegando importa la
  pestaña, buscando importa dónde está lo que buscas, que es justo lo que no sabes.
- El desplegable de orden sigue rigiendo, pero solo sobre el grupo de pendientes; las hechas van
  siempre por cuándo las cerraste. Mientras buscas no se puede arrastrar para reordenar: en una
  lista que mezcla los dos estados, «arriba» no significa nada.
- La paginación cuenta tareas, no subtítulos, y el subtítulo se repite al empezar cada página.

## [0.59.0] - 2026-08-09 — el contador dice la verdad y lleva a las tareas

- **El aviso 🤖 de «Hechas» contaba mal, y contaba de menos.** Solo avisaba de las respuestas
  llegadas *estrictamente después* de cerrar la tarea; pero cuando un agente cierra una tarea la
  cierra y contesta en la misma escritura, con el mismo instante, y ese caso —el más frecuente y el
  único en el que la respuesta llega sin que la hayas visto— no contaba. En una lista real de 181
  tareas, el aviso decía **1** cuando había **9**.
- **Los recuentos 🤖 son ahora el botón que lleva a esas tareas.** Pulsa el de cualquiera de las dos
  pestañas y la lista se queda solo con ellas; el de la pestaña en la que no estás te lleva allí ya
  filtrado. Mientras el filtro está puesto se ve en la barra, con un botón para quitarlo: un filtro
  que esconde tareas sin decirlo es peor que no tenerlo.
- **La pestaña y la búsqueda ya no se pierden solas.** Abrir «Hechas», buscar algo y esperar unos
  segundos te devolvía a «Pendientes» con la caja vacía, porque cada guardado reconstruye la lista.
  La página ya sobrevivía desde 0.49.0 y el borrador desde 0.51.0; ahora todo el estado de la vista
  vive en el mismo sitio, así que el próximo que se añada tampoco podrá olvidarse de sobrevivir.
- **El menú Inicio ya no recorta las tarjetas contra el epígrafe «Configuración».** Ese bloque no
  podía encogerse, así que al aparecer resultados de búsqueda el único que cedía sitio era la
  rejilla de tipos. Ahora la rejilla tiene un mínimo garantizado —**medido** sobre tu tipografía y tu
  pantalla, no estimado— y son los resultados y la configuración los que ceden y se desplazan.
- El contador de la paginación decía «pendientes» también en «Hechas».

## [0.58.2] - 2026-08-09 — la fecha solo se aparta donde estorba, y el hueco se mide

- **La fecha y el vencimiento ya no desaparecen al pasar el ratón por una tarea de varias líneas.**
  Ahí los botones van abajo y la fecha arriba: no se estorban, y esconderla era regalar información
  por una regla que no miraba si hacía falta. En las tareas de **una sola línea** sigue cediendo,
  porque en una fila de esa altura no caben las dos cosas — lo único que lo evitaría es reservar
  sitio permanente a los botones, y eso deja un páramo a la derecha de la hora en todas las filas.
- **El hueco que se reserva a los botones ahora se mide, no se estima.** En 0.58.1 puse 104 px
  calculados a ojo, y cada píxel de más ahí lo paga el texto de todas las tareas: se estrechan y
  ocupan más líneas. Ahora se mide la barra de verdad, una vez, con tu tipografía y tu pantalla, y
  se reserva **lo mínimo** que hace falta para que no tape la marca 💬/🤖. Si tu navegador dibuja
  los iconos más estrechos, recuperas ese ancho para el texto.
- Como efecto de lo anterior, la clasificación «esta fila es de una línea» se rehace al **estrechar
  la ventana**, no solo al repintar la lista.

## [0.58.1] - 2026-08-09 — la marca de conversación se queda donde estaba, y ahora nadie la tapa

Corrección de la versión anterior. En 0.58.0 moví la marca 💬/🤖 al principio de la fila para que
los botones no pudieran alcanzarla. Funcionaba, pero **cambiaba un diseño que no había que cambiar**:
el problema era una degradación de una versión anterior, no el sitio de la marca.

- **La marca vuelve a su sitio de siempre**, tras el texto y delante de la fecha.
- **Y ya no la tapa nadie, en ninguna longitud de tarea.** El hueco de los botones sale de donde
  siempre debió salir: la **columna de la fecha**, que ahora reserva ancho suficiente para que la
  banda quepa entera sin llegar hasta la marca. Antes reservaba 74 px y la banda mide unos 122, así
  que en una tarea de **una sola línea sin vencimiento** —el caso normal— se comía la marca; con
  vencimiento sobraba sitio, y por eso el fallo parecía caprichoso.
- **Deshecho el atajo que causó la degradación:** desde 0.56.0 la marca se ocultaba al pasar el
  ratón, y eso la escondía también en tareas de varias líneas, donde funcionaba bien desde 0.51.0.
- La reserva está atada a un test que **hace la cuenta** y a otro que **cuenta los botones** de la
  banda: si alguien le añade uno, la suite avisa antes de que la marca vuelva a quedar debajo.

## [0.58.0] - 2026-08-09 — la marca de conversación se muda, y el menú se queda con un solo buscador

Cuatro cosas que estorbaban a diario, y la primera llevaba tres versiones sin arreglarse del todo.

- **La marca 💬/🤖 de una tarea ya no desaparece nunca.** Vivía al final de la fila, que es
  justo donde flotan los botones al pasar el ratón, así que cada intento de que no se tapara
  acababa escondiéndola: primero la tapaban los botones, después se ocultaba sola. Y en una tarea
  de varias líneas desaparecía **sin que nada la tapara siquiera**. La causa no era el ancho de los
  botones, era la vecindad: mientras compartieran el mismo extremo, cada arreglo movía el problema
  de sitio. Ahora la marca vive **al principio de la fila, entre la casilla y el texto**, donde los
  botones —anclados al borde derecho— no pueden alcanzarla en ninguna geometría. De paso, las
  marcas quedan en columna y se ve de un vistazo qué tareas tienen respuesta esperándote. La fecha
  y el vencimiento sí siguen cediendo su sitio: son datos, no avisos.
- **El menú Inicio se queda con un solo buscador.** Había dos cajas casi iguales en el mismo panel
  —«Buscar en todo» arriba y «Filtrar tipos…» dentro de «Añadir widget»— que respondían distinto a
  lo mismo. La de arriba ahora filtra las dos zonas: los resultados y la rejilla de tipos. Mientras
  escribes una captura (`t llamar a Juan`, `v 12-16/8`) la rejilla se queda quieta, porque ahí
  estás escribiendo contenido, no buscando un tipo.
- **Y encuentra de verdad lo que dice encontrar.** Buscar «vacaciones» seguía sin ofrecer
  **Permisos**: la coincidencia existía, pero se caía por el corte de diez resultados, porque el
  contenido que también dice «vacaciones» iba delante. Ahora los tipos de widget tienen plaza
  reservada al final de la lista y el contenido cede sitio antes que ellos.
- **La lista de resultados ya no aplasta la rejilla de widgets.** Con el menú Inicio abierto y algo
  escrito, los resultados crecían hasta dejar «Añadir widget» reducido a una franja. Cada zona
  tiene ahora su tope y su propio desplazamiento.
- **<kbd>Ctrl</kbd>+<kbd>Enter</kbd> guarda en el editor de fecha y nota de una tarea.** Estaba
  anunciado en la lista de atajos y ahí no funcionaba, que es la peor combinación posible.

## [0.57.0] - 2026-08-07 — la papelera deja de pesar, sin dejar de ser una papelera

Un tercio del archivo de datos que tus equipos releen continuamente era papelera: 346 KB de widgets
enteros, con sus imágenes dentro. El tope que había contaba **elementos**, no bytes, así que treinta
elementos podían ser treinta kilobytes o tres megas. Esto lo arregla, y de paso arregla algo peor
que apareció al revisarlo.

- **Lo que sale de la papelera va a un archivo de recuperación, no al vacío.** Al pulsar **Reducir…**
  se te dice cuántos elementos y cuántos bytes van a salir —los más antiguos primero— y, si aceptas,
  se escriben en `cabecera-papelera/` dentro de tu carpeta de datos: **un archivo por cada vez que
  reduces**, que no se toca nunca más. Ese archivo **no se relee**, y por eso deja de pesar. Puedes
  recuperar de ahí cuando quieras con **🗄️ Archivo de papelera**, y recuperar **copia**: el archivo
  se queda intacto.
- **Primero se escribe, luego se comprueba leyéndolo, y solo entonces se quita.** Si algo falla, no
  se quita nada. Como mucho puedes acabar con un elemento repetido; nunca con ninguno. Y sin carpeta
  conectada la reducción no se hace y te lo dice, porque sin carpeta no hay dónde poner la red.
- **La papelera dice lo que ocupa**, siempre que tenga algo, y por encima de 200 KB aparece un aviso
  🗑️ en la barra de abajo. La acción se llama **Revisar**, no «Vaciar»: nada se mueve sin que veas
  antes qué se mueve. **Lo que ya tenías acumulado no se ha tocado**: sigue ahí hasta que decidas.
- **Corregido un fallo que podía perder o resucitar elementos entre tus dos equipos.** La papelera se
  combinaba juntando las dos listas y cortando a treinta. Eso tenía dos consecuencias silenciosas: lo
  que quitabas en un equipo **volvía** cuando el otro sincronizaba, y con muchos elementos por lado el
  corte **descartaba los del otro equipo** sin decir nada. Ahora se combina elemento a elemento, como
  ya se hacía con los escritorios que sigues, y **ningún camino recorta la papelera en silencio**: el
  tope de treinta sigue existiendo, pero como objetivo de la reducción, que archiva antes de quitar.

## [0.56.0] - 2026-08-07 — cinco cosas que no hacían lo que decían

- **El menú Inicio ya no se cierra al pulsar una categoría.** Filtrar por «Trabajo» o «Tiempo» cerraba el menú entero, así que la novedad de la versión anterior era prácticamente inusable. La causa estaba escondida: al pulsar una categoría, la fila se repinta, y para cuando se comprobaba si el clic había caído dentro del menú, el botón pulsado ya no estaba en la página — así que contaba como clic fuera. Ahora se mira el **camino que recorrió el clic**, que no se borra, y eso cierra la familia entera del fallo, no solo este caso.
- **Los dos buscadores del menú entienden lo mismo.** La caja de arriba, que es la que tiene el foco al abrir, no conocía los sinónimos: escribir ahí «vacaciones» no encontraba **Permisos**, aunque el filtro de tipos de más abajo sí. Dos buscadores en el mismo panel que responden distinto a lo mismo desconciertan con razón.
- **<kbd>Ctrl</kbd>+clic derecho abre Inicio de verdad.** Estaba anunciado en la lista de atajos desde la versión anterior y lo implementado era Ctrl+**doble** clic. Un atajo escrito y no implementado gasta la confianza en toda la lista, así que ahora existe, y el atajo también se lee al pasar el ratón por el botón **⊞ Inicio**.
- **El tamaño de letra funciona.** Se aplicaba de una forma que el diseño de la página no podía obedecer: la opción existía, se guardaba, y no cambiaba nada. Ahora agranda **el contenido de las ventanas y los diálogos** —donde se lee— sin mover ninguna ventana de sitio, y se combina con el zoom de una ventana suelta. La barra de abajo y los menús que salen junto al puntero se quedan igual a propósito: se colocan con medidas calculadas y escalarlos los descolocaría. La etiqueta del ajuste ya no promete «todo el sitio», que no era cierto.
- **La marca 💬/🤖 deja de quedar tapada** por los botones al pasar el ratón en tareas de una línea. Cedían el sitio la fecha y el vencimiento, pero no la marca, que va a su izquierda y la banda de botones es más ancha que las dos juntas. Mientras la tapa, el propio botón de responder hace de señal, en ámbar si hay respuesta sin contestar.
- **El historial de la calculadora sobrevive al cambio de escritorio.** Era de sesión a propósito —no se guarda nunca, porque sería un registro de lo que has estado mirando en consulta—, pero se borraba con cualquier repintado, que es mucho menos que una sesión. Ahora dura lo que dura la pestaña, que es lo que decía.
- **El marcador 🏷️ vive siempre en la barra de abajo**, junto al aviso de tareas: dice cuántas etiquetas hay en uso y al pulsarlo las despliega con su recuento para filtrar de un clic. Iba detrás del filtro que cruza escritorios a propósito: un control siempre a la vista que solo filtrase el escritorio activo habría sido peor que no tenerlo.

## [0.55.0] - 2026-08-07 — menú Inicio con categorías, zoom por ventana y accesibilidad

- **El menú Inicio agrupa los tipos por categorías, con su recuento y un buscador.** Trabajo, Tiempo, Herramientas y Contenido, y el número de cada una. El buscador entiende **sinónimos**: escribes «vacaciones» y aparece **Permisos**, aunque no se llame así — un buscador que solo case con el nombre no sirve a quien no se sabe los nombres. Con un único resultado, `Enter` lo añade. Además la rejilla **se genera de la lista de tipos**: estaba escrita a mano y podía quedarse atrás.
- **Zoom por ventana.** Ampliar o reducir el contenido de una ventana concreta sin cambiar su tamaño: útil para ver entera una tabla ancha, o para agrandar la letra de una nota que lees de lejos. Está en el clic derecho —ampliar, reducir, volver al 100 %, escribir el porcentaje— y con **Ctrl+rueda** encima de la ventana.
- **Tamaño de letra y contraste alto**, en ⚙ Ajustes generales. El tamaño (110 % o 125 %) afecta **al texto, no a la geometría**: tus ventanas no se mueven de sitio. El contraste alto aclara bordes y texto atenuado sin tocar los colores de estado, porque el rojo de «vencido» y el ámbar de «hoy» significan algo.

## [0.54.0] - 2026-08-07 — el filtro de etiqueta deja de ser ciego, y la fila respira

- **El filtro de etiqueta dice qué hay fuera de este escritorio.** Seguía actuando solo dentro del escritorio activo —y la guía llegó a prometer lo contrario durante meses—. Ahora el indicador de la barra muestra **cuántos widgets hay aquí y cuántos en otros escritorios**, y al pulsarlo te lleva sin perder el filtro: si solo hay otro, salta directo; si hay varios, eliges. Lo que sigue sin hacerse, a propósito, es pintar a la vez widgets de escritorios distintos: las posiciones son por escritorio y se solaparían sin remedio.
- **El margen a la derecha de la fecha, otra vez más pequeño.** Pasa de 46 a 20 px. El sitio que necesitan los botones lo pone ahora la propia **columna de fecha**, con ancho fijo y alineada a la derecha, como en un gestor de correo: el hueco queda dentro de una columna alineada —que se lee como orden— en vez de al final de la fila —que se lee como olvido—.

## [0.53.0] - 2026-08-07 — la etiqueta trae su contrato puesto, y la lista se ordena

- **Poner una etiqueta `ia-` aplica sola la cabecera ⓘ y el color.** Antes había que escribirla a mano en cada widget, con una redacción distinta cada vez. Ahora la cabecera se *deriva* del contrato vigente: si mañana cambia la convención, se actualizan solas —**retroactivamente**— las que puso Cabecera. **Lo que hayas escrito tú no se toca jamás**, ni la cabecera ni el color. Y el selector ofrece las `ia-` aunque no uses ninguna todavía: antes solo mostraba las ya usadas, así que la primera era imposible de elegir de la lista.
- **La lista de tareas se puede ordenar**: a mano (como siempre), por fecha de alta —recientes o antiguas arriba— o por vencimiento. El criterio se guarda por lista y viaja entre equipos. Con un orden automático el arrastre se desactiva, porque mover algo a mano no lo dejaría movido; al volver a «a mano», tu orden sigue exactamente como lo dejaste.
- **Los atajos se anuncian junto a la función que evitan**, en la paleta y en el menú del clic derecho, y hay una lista completa dentro de la app (**⌨️ Atajos de teclado** en Ctrl+K). Salen todos de una tabla única, así que no puede haber un atajo que exista y no se anuncie.
- **Un widget que recibe contenido nuevo se señala** con un contorno en el color del escritorio: cuando otro equipo o un asistente escribe en él, deja de pasar desapercibido. **No se apaga al pasar el ratón** —eso lo daría por leído sin haberlo leído—: se apaga al entrar en el widget.
- **La alarma del temporizador deja rastro.** Sonaba y mostraba un aviso pasajero; si no estabas delante, no quedaba nada. Ahora persiste un **⏰ en la barra de abajo** hasta que lo atiendes, y al pulsarlo te lleva al temporizador que sonó. Un canal para el instante y otro para el rastro, sin un tercero.
- **En segundo plano, el archivo se relee cada 30 segundos en vez de cada 4.** En una pestaña que llevas horas sin mirar, 900 lecturas por hora de un archivo de 1 MB no vigilan nada. No se apaga del todo: los avisos de tareas y de versión siguen vivos, y al volver comprueba de inmediato.

## [0.52.0] - 2026-08-07 — moverse por una lista larga, y dejar de empujar el escritorio

- **Las etiquetas ya no mueven nada.** Aparecían al pasar el ratón, en una franja bajo el título, y eso empujaba el contenido de cada ventana hacia abajo según recorrías el escritorio. Ahora son **insignias pequeñas junto al nombre, siempre visibles**: no se mueve nada y ves de un vistazo cómo está etiquetado cada widget. Las `ia-*` se distinguen en azul.
- **Dos pestañas con su propio recuento: 📋 Pendientes (n) y 🗂️ Hechas (n).** Antes había un botón que alternaba y mostraba el número de la vista contraria, que se leía como si fuera el de donde estabas. Además el aviso **· 🤖 n** aparece ahora **en las dos**: en Pendientes, lo que espera respuesta tuya; en Hechas, lo que llegó después de cerrarla. Antes solo existía el de Hechas, y por eso se podía ver un robot en el contador sin encontrar la tarea.
- **El buscador filtra la vista en la que estés**, no solo las hechas. Con listas largas, lo que más se busca es una tarea viva que se ha ido a la página 7.
- **La cabecera ⓘ se puede leer entera.** Se mostraba en una sola línea recortada y el resto vivía en el tooltip. Ahora ocupa dos líneas y el botón **⌄** la despliega completa; el clic sobre el texto sigue abriendo la edición.
- **Corregido el margen que dejó la versión anterior.** Al arreglar que los botones taparan el final de la fila, 0.51.0 reservó el ancho entero de la banda y dejó la hora flotando lejos del borde con un hueco vacío detrás. Ahora la fecha va pegada al borde y **cede su sitio a los botones** solo mientras pasas el ratón: nada tapado, ningún salto y ningún margen raro.

## [0.51.0] - 2026-08-07 — cuatro cosas que estorbaban a diario

- **Lo que estabas escribiendo en «Nueva tarea…» ya no se pierde.** Bastaba cambiar de escritorio —o que llegara una actualización desde el otro equipo— para que la caja se vaciara sin avisar. Era el único de estos fallos que **destruía trabajo**, y por eso va el primero. El texto a medio escribir se conserva por lista mientras la pestaña siga abierta; al crear la tarea, se limpia.
- **La banda de botones ya no tapa el final de la fila.** Flota sobre ella, y ahí es donde viven la fecha, el vencimiento y la marca 💬/🤖: al pasar el ratón los ocultaba, y en una tarea de una sola línea tapaba además el final del propio texto. Ahora la fila **reserva ese hueco siempre**, así que nada se cubre y el alto de la fila no cambia al pasar por encima.
- **Al responder dentro de una tarea, el texto ya no se estruja en una columna.** El cuadro de conversación entraba al lado del texto en vez de debajo, y una tarea normal pasaba a ocupar quince líneas. Ahora ocupa la fila entera, como el de vencimiento.
- **🕘 Historial y 🧪 Unidades vuelven a verse en la calculadora.** En una ventana baja, el teclado empujaba las dos pestañas fuera del recorte y las funciones parecían no existir. Ahora cede el teclado, que se puede apretar, y no el único acceso que hay a ellas.

## [0.50.0] - 2026-08-06 — responder de un clic, y aviso de lo que llegó después de cerrar

- **Botón «👍 Vale» en la conversación.** Hasta ahora, la única forma de quitar el 🤖 de una tarea era escribir algo, aunque solo quisieras decir «ok». Ahora se hace de un clic, y sigue quedando una respuesta fechada: **un «Vale» con fecha es constancia de que lo leíste; una marca de visto no lo sería.** Si ya habías escrito algo, el botón manda lo tuyo — nunca se traga lo que estabas escribiendo.
- **«Hechas» avisa de lo que llegó tarde.** Si alguien responde en una tarea *después* de que la dieras por hecha, el botón muestra `🗂️ Hechas (12) · 🤖 2`. La tarea **no se reabre**: cerrar sigue siendo cosa tuya, y esto es información, no trabajo pendiente. El aviso se apaga tarea a tarea, según respondes a cada una.

## [0.49.0] - 2026-08-06 — la versión a la vista, la página que no se pierde y el 🤖 que ya no se tapa

- **La versión que estás usando se ve en la barra de abajo.** Tras recargar no había forma de saber si la página que tienes delante es la recién publicada. Ahora está escrita, y **al pulsarla comprueba en el momento** si hay una más nueva: si la hay, se enciende en ámbar y el siguiente clic recarga.
- **La lista de tareas ya no vuelve a la primera página sola.** Con muchas tareas, cualquier guardado o relectura reconstruye la lista, y eso te devolvía al principio: si estabas en la página 3, había que volver a recorrerla entera. La posición se conserva mientras sea la misma lista (cambiar a «Hechas» o filtrar sí empieza por el principio).
- **Al pasar el ratón por una tarea ya no se tapa la marca de conversación.** La banda de botones flota sobre el final de la fila y ocultaba justo el 💬/🤖 en el momento de ir a por él. Ahora **el botón de responder es la propia señal**: se pinta 🤖 en ámbar cuando hay una respuesta sin contestar.
- **La fecha de alta se ve en la fila, no solo en el tooltip.** De hoy, la hora; de otro día, el día y el mes. Las tareas nuevas guardan además la hora. Un dato que hay que ir a buscar no sirve para hacerte una idea de un vistazo.

## [0.48.4] - 2026-08-06 — se ve de un vistazo qué conversación te está esperando

- **Una tarea con una respuesta sin contestar se marca con 🤖** en lugar del 💬 habitual, y en color de aviso. Desaparece sola en cuanto respondes. No hay ningún «leído» que mantener: se deduce de quién habló el último, así que no puede quedarse desfasado.
- **Al editar una respuesta, la burbuja pasa a ocupar todo el ancho.** Antes se quedaba del tamaño del texto anterior y escribir ahí era incómodo.
- **Editar una respuesta que no es tuya avisa antes:** seguirá figurando como de su autor, marcada como editada. Puedes hacerlo —el archivo es tuyo— pero sin que la autoría se pierda por el camino.

## [0.48.3] - 2026-08-05 — las respuestas se pueden corregir, y el clic derecho llega a las ventanas

- **Ahora se puede editar y borrar una respuesta.** En la versión anterior quedaban selladas para siempre, y bastaba escribir algo por error para tener un borrón permanente. Se corrige con la regla de cualquier mensajero: **se edita y se borra, y lo editado queda marcado como editado**. Borrar ofrece Deshacer.
- **El clic derecho también funciona encima de una ventana**, y ofrece lo suyo delante: copiar el texto de una nota o un documento, renombrar, etiquetas, color, cabecera, privado, plegar y cerrar; debajo siguen las acciones del escritorio. Dentro de un campo de texto o con algo seleccionado sigue saliendo el menú del navegador, que es donde están pegar y el corrector.

## [0.48.2] - 2026-08-05 — conversación por tarea de verdad, y clic derecho en el escritorio

- **Clic derecho sobre el fondo del escritorio**: menú rápido con **añadir widget, buscar, ordenar, plegar todo, cambiar el fondo y papelera**. Encima de una ventana sigue saliendo el menú del navegador, que es donde están copiar y pegar. Cada entrada llama al comando que ya existía, así que hace exactamente lo mismo que su botón.

- **Responder y recordar dejan de compartir formulario.** En 0.48.1 el botón 💬 abría el editor de vencimiento con otro icono, así que para contestar tenías delante un campo «Fecha» que no pintaba nada. Ahora **la conversación tiene su propio editor**: el hilo de lo dicho, quién lo dijo y cuándo, y un cuadro para responder. **La fecha y el autor se ponen solos**, y una respuesta ya escrita no se puede reescribir — una conversación que se puede editar no sirve para saber qué pasó.
- **Tres cosas separadas y sin mezclarse:** el **vencimiento y el aviso** (📅) son una fecha futura que eliges tú; la **nota** es texto libre que amplías cuando quieras; la **conversación** (💬) son entradas selladas. La tarea muestra 💬 y el número de respuestas cuando hay varias.
- **El editor de vencimiento ya se puede cerrar con un botón.** Antes había que saber que se cerraba con Esc.

## [0.48.1] - 2026-08-05 — responder a una tarea, etiquetas que se ofrecen solas, y arreglos de la calculadora

- **Nuevo botón 💬 en cada tarea: responder.** Escribes tu respuesta y se guarda **con la fecha delante y sin borrar lo anterior**, así que una tarea acumula la conversación en lugar de una nota suelta. Cuando una tarea tiene conversación, aparece un 💬 junto a su texto: pasa el ratón para leerla entera, o haz clic para contestar. Ya no hace falta copiar una tarea a otra lista para comentarla.
- **Las etiquetas ya no dependen de tu memoria.** Al editarlas se muestran **todas las que ya usas, en cualquier escritorio**, para marcarlas o desmarcarlas con un clic; el campo de texto sigue ahí para crear una nueva. Antes era un campo en blanco, y bastaba escribir «clinica» donde otro día pusiste «clínica» para partir en dos el mismo eje.
- **Calculadora, tres correcciones de lo publicado esta misma mañana:** el teclado numérico **no desaparecía** al abrir Historial o Unidades y empujaba los campos fuera de la ventana; teclear en un campo de conversión **escribía también en el visor** de la calculadora; y la lista desplegable de magnitudes se veía **con muy poco contraste**, porque el sistema la pintaba con su propio tema. Además, al abrir un panel **la ventana crece sola** si sus campos no caben.

## [0.48.0] - 2026-08-05 — las opciones de cada ventana dejan de estar escondidas, y la calculadora se vuelve clínica

- **Nuevo botón ⋯ en la barra de título de cada ventana**, siempre visible. Despliega lo que antes solo aparecía al pasar el ratón y era, en la práctica, invisible: **etiquetas, color de ventana, cabecera ⓘ y marcar como privado**. Ninguna de esas cuatro cosas se podía hacer desde ningún otro sitio, así que quien no descubría el botón no sabía que existían. De paso la barra pasa de ocho botones a cinco. Un widget ya marcado como privado sigue enseñando su 👁 en reposo, porque eso es estado y no una opción.
- **La calculadora estrena 🕘 Historial**: las últimas operaciones de la sesión, y un clic en cualquiera reutiliza su resultado. No se guarda al cerrar la ventana, a propósito.
- **Y estrena 🧪 Unidades: conversión de magnitudes clínicas** entre unidades convencionales e internacionales — glucosa, creatinina, colesterol, triglicéridos, urea, calcio, bilirrubina, ácido úrico y HbA1c. Escribes en cualquiera de los dos lados y el otro se actualiza. **El factor empleado se muestra siempre debajo** (es el peso molecular de la sustancia) para que se pueda comprobar, y cada magnitud se redondea con los decimales que usa el laboratorio. La HbA1c es la excepción declarada: se convierte con la ecuación acordada entre las dos escalas, no con un peso molecular.
- **Aviso claro al elegir «Ahora no»** en la pantalla de sincronización: si tus datos se quedan solo en el navegador, ahora se te dice que no viajan a otro equipo y que **se pierden si limpias los datos de navegación**. El indicador de la barra inferior lo repite al pasar el ratón.

## [0.47.1] - 2026-08-05 — el widget Markdown ya admite color y cabecera

- **Markdown se pone al nivel de Nota y Tareas:** ahora también puedes darle **color de ventana** y una **cabecera ⓘ** que explique qué guarda ese documento. No había ninguna razón para que fuera el único que no los tenía. Los dos botones viven donde los demás, en la barra de título al pasar el ratón, y la cabecera se edita haciendo clic sobre ella.

## [0.47.0] - 2026-08-05 — las tareas recuerdan cuándo las anotaste

- **Cada tarea nueva guarda su fecha de alta.** Pasa el ratón por el texto de una tarea y te dice el día en que la escribiste, vengas de donde vengas: del campo «Nueva tarea…», de la paleta `Ctrl+K`, de arrastrar un enlace o de una línea de `inbox.txt`. Las tareas anteriores a esta versión no la llevan, porque no se puede inventar.
- La fecha es la de **tu reloj**, no la universal: una tarea anotada a la una de la madrugada lleva el día que marcaba la pared, no el de ayer.
- Es un dato **tuyo y privado**: no viaja en los packs ni en los escritorios que compartes.
- **La guía decía algo que no era cierto** sobre las etiquetas: prometía que el filtro dejaba a la vista los widgets etiquetados «en cualquier espacio», y en realidad actúa dentro del escritorio en el que estés. Corregido, y explicado dónde encontrar el botón 🏷️, que vive en la barra de título y solo aparece al pasar el ratón.

## [0.46.2] - 2026-08-04 — preparación interna: análisis de legibilidad

- **Groundwork invisible.** Cabecera incorpora el análisis de legibilidad de **Notas.IA**: detecta si un texto está en español o en inglés (sin dejarse engañar por los tecnicismos ingleses de un texto español), cuenta palabras, oraciones y sílabas, y calcula el índice de lectura con la escala **INFLESZ** para castellano y Flesch para inglés, con su interpretación en palabras («normal, prensa general», «muy difícil, universitario»). **Todavía no aparece en ninguna parte de la interfaz**: es la maquinaria, a la espera de decidir dónde vive.
- El análisis se mantiene idéntico al del proyecto original, que sigue siendo su fuente: aquí no se cambian ni las fórmulas ni los umbrales.

## [0.46.1] - 2026-08-04 — vaciar una columna ya no desplaza el escritorio

- **Si te llevas a otro escritorio la última ventana de la primera columna, las demás se quedan donde estaban.** Antes el escritorio se corría una columna a la izquierda —parecía que de tres columnas pasaba a dos— aunque tú no hubieras movido nada más. Ocurría porque la rejilla se deducía a partir de la ventana situada más a la izquierda, así que al quedarse vacía la primera columna se tomaba la segunda por primera. Ahora la rejilla parte del origen que le corresponde al escritorio, y solo recurre a deducirlo cuando ese origen no explica lo que hay guardado.
- **Y ese desplazamiento ya no se queda escrito.** Al soltar una ventana en la columna vacía, la posición que se guardaba era la de la columna de al lado, de modo que el descuadre viajaba al otro ordenador. Corregido de raíz: es el mismo cálculo el que se ha arreglado.

## [0.46.0] - 2026-08-01 — el widget Markdown entiende tablas, y pegar deja de perder la estructura

- **Las tablas se ven como tablas.** Escríbelas con barras verticales (`| Fuente | Rigor |` y debajo `|---|---|`) y el widget Markdown las presenta con cabecera fija, alineación por columna (`:---`, `:---:`, `---:`) y desplazamiento horizontal **dentro de su caja**: una tabla ancha nunca ensancha el escritorio ni mueve a las ventanas vecinas.
- **En ventana estrecha o en el móvil, cada fila pasa a ser una ficha** con el nombre de la columna delante de cada dato, para que una tabla de seis columnas siga leyéndose sin desplazar.
- **Nuevo botón 📋 Pegar** (y `Ctrl+V` con el documento enfocado). Reconoce lo que traes en el portapapeles —una tabla copiada de una web o de la respuesta de un agente, un trozo de **Excel o Google Sheets**, un CSV con comillas y comas dentro de las celdas, o un JSON con una lista de fichas— y lo convierte en una tabla Markdown.
- **Siempre te enseña antes en qué se va a convertir**, con el formato detectado y cuántas filas y columnas salen, y tú eliges: reemplazar el documento, añadir al final o pegarlo tal cual como texto. Nada se importa sin ese clic, y ante la duda el contenido se queda como texto.
- **Del HTML copiado solo se leen los textos y los enlaces** (y solo `http`/`https`): ese HTML no se guarda, no se muestra y no se ejecuta nunca. Lo que se guarda sigue siendo Markdown, que es texto legible y editable.
- **La lista de tareas deja de dar saltos.** Los botones de cada tarea ya no aparecían «debajo» empujando una fila entera: ahora flotan sobre el final de su propia línea, así que pasar el ratón por la lista, o entrar a editar, no mueve ni una tarea de sitio. En pantallas táctiles siguen debajo, que es donde tienen sentido. Además, el hueco del texto mide exactamente lo mismo leyendo que escribiendo, y salir de la edición sin haber cambiado nada deja de repintar la lista entera.
- **Al pegar, lo que era texto se queda texto.** Si una página copiada trae en una celda algo escrito como un enlace de Markdown, se ve tal cual y no se convierte en un enlace activo: solo un enlace de verdad del origen produce un enlace. Se conservan todos los enlaces de una celda, cada uno con su texto, y las direcciones con paréntesis viajan enteras.
- **Los límites se aplican antes de analizar, no después:** un portapapeles desmesurado se rechaza con su motivo en vez de dejar la página pensando. Y si mientras eliges qué hacer el documento cambia desde otra pestaña o el otro ordenador, no se pega nada y se te dice.

## [0.45.1] - 2026-07-30 — corrige el deshacer de tareas y el crecimiento de la lista, que no funcionaban en uso real

Dos cosas prometidas en 0.43.1 y 0.44.0 no funcionaban fuera del banco de pruebas. Corregidas y verificadas contra un escritorio real.

- **El Deshacer de una tarea reescrita fallaba a los pocos segundos.** Si tienes Cabecera sincronizada entre equipos, cada vez que se relee el archivo compartido se reconstruye el estado por dentro, y el deshacer perdía el rastro de la tarea: contestaba «esa tarea ya no está» aunque nadie la hubiera tocado. Ahora identifica la tarea por su identificador, que sobrevive a la sincronización. La protección de siempre no cambia: si la tarea cambió después, no se pisa.
- **Ctrl+Z no hacía nada si el cursor estaba en el campo «Nueva tarea…»**, que es justo donde suele quedarse tras editar. En un campo vacío no hay nada que deshacer, así que ahora la pulsación llega al deshacer de Cabecera. Dentro de un campo con texto sigue mandando el del navegador.
- **La lista de tareas apenas crecía en ventanas ya grandes.** El tope era una medida pensada para «Ordenar» (640 px), de modo que una ventana de 600 px crecía 40 px: invisible. Ahora el tope es el alto de la pantalla, y la ventana crece de verdad antes de empezar a pasar de página.

## [0.45.0] - 2026-07-29 — un solo sitio para saber cuál de los tres archivos necesitas

- **Nuevo: «📦 Guardar, compartir o reutilizar…»** (menú Inicio y Ctrl+K). Cabecera maneja tres archivos que por fuera son iguales —todos `.json`— y hacen cosas muy distintas: la **copia de seguridad**, el **escritorio compartido** y el **pack**. Ahora eliges por lo que quieres hacer, y cada uno dice también **para qué NO sirve**, que es donde nacía la confusión.
- **La cautela sanitaria va delante del gesto, no después del error:** un archivo que sale de tu ordenador no se puede revocar; comparte solo recursos públicos y marca como privados (👁) los widgets que no deben salir. La copia de seguridad sí lleva todo, y se guarda donde guardarías datos clínicos.
- Si el escritorio que tienes delante **no puede compartirse** (tiene widgets privados o listas de trabajo con agentes), se te dice ahí mismo y el botón queda desactivado, en vez de dejarte llegar al rechazo.
- Los comandos sueltos de siempre (Exportar copia, Importar copia, Abrir escritorio compartido, Packs) siguen igual: el panel nuevo lleva a ellos, no los sustituye.

## [0.44.0] - 2026-07-29 — la lista de tareas se agranda sola y luego pasa de página

- **Añadir tareas ya no obliga a agrandar la ventana a mano.** La lista crece sola a medida que añades, hasta un tope razonable, y las ventanas de debajo hacen sitio (si no cabe, se queda como está en vez de solaparse).
- **Pasado ese tope, aparecen unas flechas ‹ 1/4 › para pasar de página**, con el total de pendientes al lado. **Nunca se corta el texto de una tarea**: se pasa de página por tareas enteras, y una tarea muy larga ocupa su página entera antes que quedarse a medias.
- Mirar el histórico de «Hechas» no agranda la ventana: solo pasa de página.

## [0.43.1] - 2026-07-29 — deshacer una tarea reescrita, y saber a qué nota fue un texto largo

- **Reescribir una tarea ya tiene vuelta atrás.** Al confirmar un cambio de texto aparece **Deshacer**, y **Ctrl+Z** (fuera de un campo de escritura) devuelve el texto anterior. Antes, una vez confirmada la edición, lo escrito antes se perdía. No se deshace si la tarea cambió después o si el cambio vino de otro equipo.
- **Un texto largo convertido en nota deja rastro de dónde fue.** La nota nueva se llama como el titular de la tarea, y la tarea guarda en su **ⓘ** a qué nota se movió el texto y en qué fecha. El texto de la tarea deja de arrastrar el «→ texto completo en la nota»: la lista vuelve a leerse como una lista, y la procedencia se conserva sin ocupar la línea.

## [0.43.0] - 2026-07-29 — las columnas se adaptan solas a cada pantalla, en los dos sentidos

- **Un escritorio de columnas encaja ahora en cualquier pantalla, sin pedirte nada.** Cambiar de monitor, abrir el portátil o estrechar la ventana del navegador reajusta las columnas **al instante y en los dos sentidos** —también al volver a una pantalla más ancha, que era donde se quedaba corto—. Desaparece el botón «Reajustar»: ya no hay nada que reajustar.
- **Por qué antes no encajaba.** Cada escritorio guardaba los **píxeles** del monitor en el que se ordenó por última vez, mientras las columnas se recalculaban con el ancho de la ventana; bastaba abrirlo en otra pantalla para que dejara de cuadrar. Ahora lo que se guarda es **en qué columna** está cada ventana, y el ancho se deriva de la pantalla que estés usando. No hace falta convertir nada: los escritorios existentes funcionan tal cual.
- **Abrir Cabecera sigue sin modificar tu archivo de datos.** El reajuste es solo dibujo, así que no escribe nada: por eso puede ser automático sin riesgo de que dos equipos con el mismo archivo se pisen al abrirlo.
- **La colocación libre sigue siendo tuya.** Una ventana colocada con **Alt** fuera de las columnas, redimensionada a mano o maximizada se queda exactamente donde la dejaste.
- **Un widget nuevo nace con el mismo ancho que sus vecinos**, también cuando lo creas en un monitor distinto de aquel en el que ordenaste el escritorio (antes adoptaba el ancho de la pantalla del momento y era el único descuadrado en la otra).

## [0.42.0] - 2026-07-28 — una tarea que es un texto largo se muda a una nota

- **Una tarea que en realidad es un texto largo se ofrece convertir en nota.** Si escribes o pegas más de 300 caracteres en una tarea, aparece un aviso con **«Convertir en nota»**: el texto completo se muda a una nota nueva y la tarea conserva el titular. Se ofrece, nunca se hace solo.

## [0.41.0] - 2026-07-28 — el escritorio se adapta a la pantalla, y un escritorio compartido se abre desde el archivo

- **Cambiar de monitor ya no deja widgets fuera de la pantalla.** Si al cambiar de pantalla o de resolución algún widget queda **fuera del área visible** —donde no podías alcanzarlo, porque el escritorio no se desplaza en horizontal—, Cabecera lo reordena en columnas y te ofrece **Deshacer**. Si la pantalla nueva es más ancha no toca nada: te ofrece un botón **Reajustar**. Y al **abrir** en otra pantalla nunca reordena sola, también te lo ofrece. Fuera de esto sigue sin recolocar al cargar, sincronizar, aplicar un pack o restaurar una copia.
- **Un widget nuevo nace ya encajado en su columna**, con el ancho de esa columna y en el carril con menos contenido. Antes nacía con un ancho fijo, quedaba más estrecho que el resto y había que ordenar a mano.
- **Nuevo: «Abrir escritorio compartido».** Un escritorio exportado con «Compartir este escritorio» solo se podía abrir **siguiéndolo por una dirección web**, así que exportar el tuyo y volver a abrirlo obligaba a subirlo antes a un servidor. Ahora se abre **desde el archivo**, sin red: menú Inicio → «Abrir escritorio compartido» (o Ctrl+K). Se comprueba la huella del archivo, se te dice qué trae y se crea un **escritorio nuevo**, tuyo y editable; ninguno de los tuyos se toca. Dar un pack o una copia por error se rechaza con su explicación.
- **El asa de arrastre de las tareas ya se ve.** Estaba a la vista solo al pasar el ratón y, en una tarea larga, quedaba a media altura: en la práctica no se podía arrastrar. Ahora es visible siempre, se ancla arriba y en la vista «Hechas» se muestra inerte (ahí no se reordena).

## [0.40.8] - 2026-07-24 — seguir un escritorio compartido por dirección web

- **Nuevo: seguir un escritorio por URL** (Ctrl+K → «Seguir un escritorio por URL», o el botón **＋** del grupo «Seguidos» en la barra de pestañas). Aparece como una pestaña de **solo lectura**: puedes verlo, pero no editarlo. Con **↻ Comprobar** traes su última versión (te pregunta antes de reemplazar tu copia, nunca lo hace solo), y con **📋 Copiar a un espacio mío** te lo llevas a un escritorio propio y editable. Cierra el círculo de «Compartir este escritorio»: uno exporta, otro sigue.
- **Privacidad por diseño:** la copia de lo seguido vive **solo en este equipo** (no viaja en tu archivo de datos); el primer contacto con el servidor lo inicias siempre tú; se exige `https`, se comprueba que la huella del contenido coincide, y las direcciones de redes locales/privadas se rechazan.

## [0.40.7] - 2026-07-24 — «Importar copia» ya no borra tus escritorios con un archivo equivocado

- **Corrección importante.** «Importar copia» reemplazaba TODO tu contenido con el archivo que le dieras, sin comprobar qué era: si por error le dabas un **escritorio compartido** (el que produce «Compartir este escritorio»), un **pack**, o cualquier otro JSON, tus escritorios desaparecían. Ahora **valida el archivo antes de tocar nada**: si no es una copia de Cabecera te avisa y **no cambia nada**, y si lo es, guarda una copia previa recuperable en «Restaurar copia» antes de reemplazar. Un escritorio compartido y un pack se reconocen y se rechazan con su explicación.

## [0.40.6] - 2026-07-24 — compartir un escritorio como archivo

- **Nuevo: «Compartir este escritorio».** Desde la paleta (Ctrl+K) puedes **exportar el escritorio activo a un archivo** para pasárselo a quien quieras. Se incluyen enlaces (con sus notas), notas, listas de tareas, portapapeles y markdown; **los widgets privados y las listas de trabajo con agentes no se comparten** (si el escritorio tiene alguno, te avisa para que lo muevas a un espacio personal antes). Antes de exportar ves un resumen de lo que se comparte y un aviso de que una copia difundida no se puede revocar. Es la primera mitad de «escritorios compartidos»: *seguir* uno por dirección web llega después.
- Cada escritorio compartido recibe un identificador estable, para que en el futuro una actualización se reconozca como el mismo origen.

## [0.40.5] - 2026-07-24 — botón Hechas más a mano y cimientos de seguridad para seguir escritorios

- **El botón «Hechas / Pendientes» de las listas de tareas ya no se esconde al final.** Estaba bajo la lista y, si tenías muchas tareas, había que bajar para verlo. Ahora vive en una barra fija justo bajo el campo de «Nueva tarea», siempre a la vista.
- **Groundwork invisible (seguir escritorios).** Cabecera incorpora la maquinaria de seguridad que necesitará para *traer* un escritorio compartido por dirección web sin riesgos: una forma única y determinista de calcular la «huella» de un escritorio (para reconocer si cambió), y una descarga endurecida que solo admite `https`, rechaza redirecciones y credenciales, y **bloquea direcciones de redes locales o privadas**. Todavía no hay forma de seguir ni ver un escritorio desde la interfaz — esto solo asegura los cimientos.

## [0.40.4] - 2026-07-24 — preparación interna para seguir escritorios (tercera pieza)

- **Groundwork invisible.** Cabecera prepara por dentro la maquinaria para *ver* un escritorio seguido sin poder tocarlo por error: distingue una vista propia (editable) de una vista de solo lectura, y deja listos los cierres de seguridad para que ningún comando modifique en silencio tu escritorio mientras miras el de otra persona. También aprende a guardar en este dispositivo —nunca en tu archivo de datos— la copia local de lo seguido, validándola con severidad al leerla. **Todavía no hay forma de seguir ni de ver un escritorio desde la interfaz** — eso llega después, con su propia revisión. No cambia nada de lo que ves ni de cómo se usa Cabecera.

## [0.40.3] - 2026-07-24 — preparación interna para seguir escritorios

- **Groundwork invisible (segunda pieza).** Cabecera ya sabe guardar la *decisión* de seguir un escritorio compartido de otra persona, y combinarla correctamente entre tus equipos: si dejas de seguir uno en un equipo, no reaparece al sincronizar; si el mismo lo cambias en dos sitios a la vez, se te avisa en vez de decidir por ti. Solo se guarda la referencia (dirección y nombre); el contenido seguido vivirá en cada dispositivo, nunca en tu archivo de datos, y una dirección con credenciales dentro se rechaza antes de guardarla. **Todavía no hay forma de seguir un escritorio desde la interfaz** — eso, y verlo, llegan después. Esto solo prepara el terreno; no cambia nada de lo que ves ni de cómo se usa Cabecera.

## [0.40.2] - 2026-07-24 — corrección de la preparación interna

- **Los identificadores internos ya no se «olvidan» al combinar cambios de dos equipos.** La combinación reconstruye el archivo campo a campo y se dejaba fuera la marca que indica que tus elementos ya tienen identificador. Se recuperaba sola al recargar, pero durante ese hueco un elemento recién creado podía recibir un identificador basado en su posición y chocar con otro creado a la vez en el otro equipo. Sin efecto visible; corregido con prueba propia.

## [0.40.1] - 2026-07-23 — preparación interna para compartir

- **Groundwork invisible.** Cada tarea, enlace, grupo y elemento de portapapeles de tus escritorios recibe ahora un identificador interno estable, necesario para lo que viene (seguir escritorios compartidos, sincronizar entre equipos sin pisar cambios). Se asigna en memoria y viaja con tu próximo guardado; en dos equipos que abren el mismo archivo se genera igual, para que luego cada elemento se reconozca como el mismo. **No cambia nada de lo que ves ni de cómo se usa Cabecera** — solo prepara el terreno.

## [0.40.0] - 2026-07-23 — notas en los enlaces

- **Cada enlace puede llevar ahora una nota breve.** El botón ✎ de un enlace gana el campo «Nota»: «guía 2025, ver tabla 3», «para residentes», «mejor con VPN»… Se muestra atenuada bajo el enlace y nítida al pasar el ratón o al navegar con el teclado (en pantalla táctil, siempre visible); también aparece en el globito del enlace. Tope de 500 caracteres: si te pasas, se avisa y **no se guarda cortada**. Es además el primer paso del plan de compartir: una lista de enlaces *comentada* vale mucho más que una lista pelada.
- Los packs pueden traer notas en sus enlaces. Desde una fuente externa, una nota pasada de tamaño **rechaza el pack entero con su motivo** — la misma regla de «nada se recorta en silencio» de la 0.39.4.

## [0.39.5] - 2026-07-22 — estabilización, segunda parte: identidad y gestos

Cierra las últimas correcciones de la misma revisión externa. Sin funciones nuevas: cuatro comportamientos que podían mover o fijar cosas sin que las pidieras.

- **El escritorio que estás mirando ya no cambia solo.** Si el otro equipo reordenaba las pestañas, la sincronización aceptaba el orden nuevo pero conservaba tu posición *por número* — y esa posición podía ser ahora otro escritorio. La pestaña activa se conserva por **identidad**: sigues mirando el mismo escritorio, esté donde esté en la barra.
- **Cancelar el arrastre de una ventana maximizada la deja exactamente como estaba.** Antes, si el gesto se interrumpía (por ejemplo, al perder el foco la ventana), quedaba internamente «restaurada» aunque en pantalla siguiera pareciendo maximizada, y un guardado posterior fijaba ese estado a medias.
- **Redimensionar tras cambiar de monitor hace sitio con las medidas que ves.** El cálculo de empuje mezclaba la geometría guardada (que podía ser la del monitor anterior) con la visible; ahora todo el gesto trabaja sobre lo que hay en pantalla, igual que el arrastre.
- **Limpieza de identificadores internos.** Los duplicados o con caracteres problemáticos (solo posibles en un archivo de datos editado a mano o corrupto) se regeneran al cargar: un duplicado podía hacer que dos widgets se confundieran entre sí al combinar cambios entre equipos.

## [0.39.4] - 2026-07-22 — tercera vuelta de seguridad en packs

Cierra los dos últimos hallazgos de la misma revisión externa. Afecta solo a packs de terceros; es requisito previo para poder compartir escritorios por dirección más adelante.

- **El límite de descarga ahora es real.** El tope de 2 MiB se comprobaba después de haber descargado y guardado en memoria el archivo entero (y contaba caracteres, no bytes). Ahora la descarga **se corta en el acto** al superar el presupuesto, tiene un tiempo máximo de espera, rechaza de entrada respuestas que ya declaran ser demasiado grandes y **no sigue redirecciones**: diste permiso para conectar con un sitio concreto, no con el que ese sitio decida enviarte. El mismo límite se aplica al abrir o seguir un pack por archivo, comprobado antes de leerlo.
- **Un pack de una fuente externa ya no se recorta en silencio.** Si una nota, tarea o enlace supera los límites del formato, el pack **se rechaza entero y te dice el motivo**, en vez de aplicarse cortado a media frase — en contenido clínico, un texto mutilado puede acabar diciendo lo contrario que el original. Antes de aplicar, también se indica cuántos widgets quedan fuera por el perfil de fuentes externas. Los packs que abres tú desde un archivo local se comportan como siempre.

## [0.39.3] - 2026-07-22 — estabilización: columnas, conflicto y packs seguidos

Tres correcciones de comportamiento encontradas en una revisión externa, cada una con su prueba en la suite. No añaden funciones nuevas: cierran huecos que podían dejar el escritorio en un estado que no habías pedido.

- **Ordenar y arrastrar ya no dejan «Mes» y «Año» medio encima de la columna de al lado.** Estos dos widgets tienen un ancho mínimo por debajo del cual se vuelven ilegibles. Si pedías más columnas de las que caben con ellos, Cabecera guardaba un ancho imposible y, al recargar, el widget se ensanchaba solo hasta su mínimo y pisaba la columna vecina. Ahora el número de columnas se ajusta a lo que de verdad cabe con el widget más ancho del escritorio —el control **▤** lo indica («4→3»)— y ninguna ventana se guarda más estrecha que su mínimo, así que lo que ves es lo que queda tras recargar.
- **Con la barra de conflicto abierta ya no se pierde lo que escribes.** Si mientras decides «conservar lo del otro equipo / lo tuyo» tocas un widget que también había cambiado en el otro equipo, ese nuevo choque **se te muestra y se te vuelve a preguntar**, en lugar de resolverse con el mismo botón sin que lo hubieras visto. La decisión vale solo para lo que la barra te había presentado.
- **Un pack que sigues se actualiza siempre en su escritorio, no en el que tengas abierto.** El aviso «tiene novedades» ahora **nombra el escritorio destino** y «Aplicar» actúa sobre ese, aunque hayas cambiado de pestaña mientras tanto. Si ese escritorio ya no existe, te lo dice en vez de sustituir otro por error.

## [0.39.2] - 2026-07-21 — segunda vuelta de seguridad en packs

Continuación de la 0.39.1, cerrando lo que quedaba de la misma revisión externa. Sigue afectando solo a packs de terceros.

- **Un pack que se actualiza solo ya no puede traer «capacidades», solo contenido.** Al seguir una fuente (por dirección o por archivo compartido) confías no solo en lo que ves hoy, sino en todo lo que llegue mañana. Por eso, desde una fuente seguida solo se aceptan **enlaces, notas, tareas, portapapeles y markdown**. Queda fuera, entre otros, el widget de Buscadores: un pack ajeno podría haber instalado un buscador que enviara **tus búsquedas al servidor de quien lo publicó**. Abrir un pack suelto desde un archivo, que ves entero y una sola vez, no cambia.
- **Un pack ya no puede hacerse pasar por tus widgets de trabajo con agentes.** Los nombres reservados (los que empiezan por «Cabecera ·») se descartan al importar, para que un pack no pueda colar texto en lo que tus asistentes leen por nombre.
- **Todas las descargas de packs pasan ya por la misma puerta.** El campo «Packs → dirección» hacía su propia descarga y se había quedado sin las protecciones que sí tenía el enlace `?pack=`. Ahora hay una única vía: pregunta antes de conectar, rechaza direcciones con credenciales dentro, no envía cookies ni procedencia, comprueba la respuesta y rechaza descargas desmedidas.

## [0.39.1] - 2026-07-21 — actualización de seguridad

Tres fallos en la importación de packs, encontrados en una revisión de seguridad externa y **verificados reproduciendo el ataque** antes y después del arreglo. Afectaban solo a quien abriera un pack de terceros (archivo o enlace `?pack=`); los packs propios y los incluidos nunca estuvieron implicados. **Si usas packs compartidos, recarga la página (F5) para tener esta versión.**

- **Un pack podía ejecutar código en tu página.** El campo de imagen de un pack se aceptaba comprobando solo que empezara por `data:image/`, y luego se insertaba tal cual en el HTML: una comilla bastaba para salir del atributo y colar JavaScript, que se ejecutaba con todos tus datos delante. Ahora se exige exactamente el formato que genera la propia app y, además, la imagen nunca se inserta como texto en el HTML — se asigna como propiedad, así que una cadena manipulada no puede convertirse en código. Doble capa, con prueba automática que intenta el ataque.
- **Aplicar un pack borraba mucho más de lo que decía.** El aviso hablaba de sustituir «tu escritorio actual», pero en realidad se llevaba por delante **todos los demás escritorios**, las marcas del calendario, tus conceptos propios, la papelera y los ajustes de ⚙. Ahora sustituye únicamente los widgets del escritorio en el que estás —el aviso lo dice con su nombre— y el resto queda intacto. Además, si la copia de seguridad previa no se puede guardar, ya **no se aplica nada**: antes ese fallo se ignoraba y te quedabas sin escritorio y sin copia.
- **Un enlace podía aplicar un pack sin preguntarte.** En la primera visita, `?pack=<dirección>` se descargaba y aplicaba sin ninguna confirmación. Ahora siempre se pregunta, y en dos pasos: primero si quieres conectar con ese servidor (avisando de que verá tu dirección IP), y después si quieres aplicar lo que ha llegado. La descarga tampoco envía ya cookies ni la dirección de procedencia.

## [0.39.0] - 2026-07-20

- **Si pides 4 columnas, son 4.** Hasta ahora, elegir 4 (o 3) en el control **▤** podía quedarse en 2 en pantallas medianas, aunque las columnas hubieran cabido de sobra. La causa: un único ancho mínimo de columna servía a la vez para decidir cuántas columnas pone **Auto** y para recortar tu elección manual. Ahora son dos cosas distintas: Auto sigue igual de conservador (prefiere columnas anchas antes que apretadas), pero **el número que eliges a mano se respeta mientras las ventanas quepan de verdad**. El aviso «4→2» solo aparece ya cuando ni así caben.
- **Arrastra marcadores también a Notas y Tareas.** Lo que ya funcionaba en el widget de Enlaces vale ahora para los otros dos destinos naturales: suelta un marcador de la barra del navegador (o un enlace de cualquier página) sobre una **Nota** y se añade al final, una línea por enlace; suéltalo sobre una lista de **Tareas** y se convierte en tarea, con su URL clicable. El widget se resalta al pasar por encima, y si el título del marcador no aporta nada más que el dominio, se deja solo la dirección.

## [0.38.0] - 2026-07-20

- **Un solo botón «Ordenar».** «Autoordenar» y «Reordenar este escritorio» eran dos comandos distintos con resultados distintos; ahora es uno: **🧭 Ordenar** (barra inferior, menú Inicio, Ctrl+K) coloca el escritorio según tu política de columnas actual, y el control **▤** elige Auto/2/3/4 y lo aplica en el mismo gesto — ya no hace falta un paso aparte. Como siempre, es un gesto tuyo: Cabecera nunca reordena sola al cargar, sincronizar, cambiar de pantalla, aplicar un pack o restaurar una copia.
- **Tareas, Enlaces y Portapapeles se ajustan a su contenido al Ordenar.** Si una lista de tareas solo tiene 2 ítems, ya no se queda con un hueco enorme debajo: su alto se ajusta a lo que realmente ocupa (con un mínimo y un máximo razonables; más allá del máximo, scroll interno). El resto de widgets —notas, calendario, archivos…— conserva su alto tal cual, porque ahí el espacio es tuyo, no sobra.
- **Estirar una ventana ya no exige que quede perfectamente alineada a su columna.** Antes, para que la de abajo hiciera sitio, tenías que crecer sin salirte del carril. Ahora, si al agrandar hacia abajo invades a otra ventana de verdad —esté o no en tu misma columna—, esa ventana baja; y si encoges desde el borde inferior, las de abajo suben para cerrar el hueco. Encoger desde el borde superior no recoloca nada (el inferior queda fijo). Deshacer, como siempre.
- **Deshacer de Ordenar restaura también el número de columnas**, no solo las posiciones.

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
