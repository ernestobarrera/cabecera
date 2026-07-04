# Changelog

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
