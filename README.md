# Seguimiento de Maquinaria

Primera version local de la aplicacion para reemplazar progresivamente el Excel de seguimiento.

## Contenido

- index.html: aplicacion web local.
- styles.css: diseno visual.
- app.js: datos de ejemplo, filtros, formulario, catalogos y exportacion CSV.

## Modelo inicial

Entidad principal: movimiento de maquinaria.

Campos: fecha, numero de guia, maquinaria, emisor, destino, verificacion, chofer, patente, nota y estado calculado.

## Reglas iniciales

- √, V y v se interpretan como verificado.
- × y x se interpretan como rechazado.
- verificacion vacia queda como pendiente.
- destino TALLER marca el movimiento como En taller.
- emisor TALLER marca el movimiento como En huerto.
- Los choferes y vehiculos se administran como catalogos separados.
- Cada movimiento guarda el chofer y la patente usada en ese traslado.

## Siguiente paso

Conectar la importacion real desde SEGUIMIENTO MAQUINARIA.xlsm, tomando la hoja INGRESOS como base principal.
