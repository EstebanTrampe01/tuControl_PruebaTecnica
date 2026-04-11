# Manual de Usuario - NovaTech Store

Este documento describe el uso funcional de la aplicacion web/movil para control de catalogo, inventario, ventas y reportes.

## 1. Objetivo del sistema

La herramienta permite:

- Gestionar productos del catalogo compartido
- Ajustar existencias por sucursal
- Registrar ventas con validacion de stock
- Consultar reporte de top productos vendidos por sucursal en un rango de fechas

## 2. Acceso al sistema

### ACCESO SI SE USA VERSION DESPLEGADA

- Frontend: `https://novatech-frontend-757428235694.us-central1.run.app/`
- Backend API: `https://novatech-backend-757428235694.us-central1.run.app/`

### ACCESO SI SE USA LOCAL HOST

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`
- Base de datos PostgreSQL: `localhost:5432`

## 3. Navegacion principal

Desde el menu lateral se accede a:

- Dashboard
- Catalogo
- Inventario
- Ventas
- Reportes

## 4. Flujo guiado por funcionalidades (con evidencias)

### 4.1 Dashboard operativo

![Dashboard](docs/assets/img-user/dashboard.png)

En esta vista se observan indicadores de operacion:

- Total de productos en catalogo.
- Total de ventas del dia.
- Cantidad de productos en stock critico.
- Grafica de Top 5 de productos mas vendidos de la semana.

Esta pantalla es la vista de monitoreo rapido para supervision diaria.

---

### 4.2 Catalogo - listado de productos

![Lista de productos](docs/assets/img-user/lista%20de%20productos.png)

La tabla de catalogo permite:

- Visualizar productos registrados.
- Buscar por nombre, descripcion o categoria.
- Filtrar por categoria.
- Acceder a acciones de ver detalle, editar y eliminar.

---

### 4.3 Catalogo - creacion de producto

![Crear producto](docs/assets/img-user/crear%20producto.png)

Desde el boton **Nuevo Producto** se abre el formulario de alta.

Datos principales:

- Nombre
- Descripcion (opcional)
- Precio
- Categoria
- URL de imagen (opcional)

Al guardar, el producto se agrega al listado y queda disponible para inventario y ventas.

---

### 4.4 Catalogo - detalle de producto

![Detalles de producto](docs/assets/img-user/detalles%20de%20producto.png)

La vista de detalle permite consultar rapidamente la informacion completa del producto sin salir del listado

---

### 4.5 Catalogo - edicion de producto

![Editar producto](docs/assets/img-user/editar%20producto.png)

La edicion permite actualizar datos del producto existente

Proceso: 

- Se cargan los datos actuales en el formulario.
- Al guardar, la tabla se actualiza con los nuevos valores.

---

### 4.6 Catalogo - eliminacion de producto

![Eliminar producto](docs/assets/img-user/eliminar%20producto.png)

La eliminacion solicita confirmacion para evitar acciones accidentales.

Regla funcional:

- Si el producto tiene historial de venta, el sistema aplica baja logica "soft delete".
- Si no tiene referencias, puede eliminarse fisicamente.

---

### 4.7 Inventario - matriz por sucursal

![Inventario matriz](docs/assets/img-user/inventario%20matriz.png)

Esta vista muestra el stock por producto y por sucursal (Centro, Norte, Occidente).

Incluye:

- Busqueda por nombre de producto.
- Filtro por nivel de stock como: alto, medio, critico.
- Lectura de estado de existencias por celda.

---

### 4.8 Inventario - ajuste de stock

![Ajustar inventario](docs/assets/img-user/ajustar%20inventario.png)

Desde una celda se abre el dialogo para ajustar unidades.

Reglas:

- Solo se aceptan numeros enteros mayores o iguales a 0.
- Al confirmar, la celda se actualiza de inmediato.

---

### 4.9 Ventas - formulario de registro

![Venta form](docs/assets/img-user/venta%20form.png)

El formulario de ventas permite:

- Elegir sucursal.
- Buscar y agregar productos al carrito.
- Ajustar cantidades por item.
- Validar disponibilidad antes de confirmar.

Si hay stock insuficiente, el sistema bloquea la confirmacion.

---

### 4.10 Ventas - venta registrada

![Venta registro](docs/assets/img-user/venta%20registro.png)

Al confirmar la venta:

- Se crea el registro de venta.
- Se descuentan existencias en inventario de la sucursal seleccionada.
- La venta aparece en el historial.

---

### 4.11 Reportes - filtros de consulta

![Reportes filtros](docs/assets/img-user/reportes%20filtros.png)

El modulo de reportes permite configurar:

- Fecha inicio
- Fecha fin
- Filtro por sucursal
- Filtro por producto
- Tamano de pagina

La consulta principal corresponde a top productos vendidos por sucursal en el periodo.

---

### 4.12 Reportes - resultados

![Reportes resultados](docs/assets/img-user/reportes%20resultados.png)

El resultado muestra:

- Sucursal
- Producto
- Cantidad vendida
- Total vendido

Tambien incluye visualizacion grafica, total acumulado y paginación.

---

### 4.13 Personalizacion - modo oscuro

![Modo oscuro](docs/assets/img-user/modo%20oscuro.png)

---

### 4.14 Experiencia responsive - vista movil

![Vista movil 1](docs/assets/img-user/vista%20movil%201.jpg)

![Vista movil 2](docs/assets/img-user/vista%20movil%202.jpg)

![Vista movil 3](docs/assets/img-user/vista%20movil%203.jpg)

![Vista movil 4](docs/assets/img-user/vista%20movil%204.jpg)

## 5. Reglas funcionales importantes

- El catalogo es compartido para toda la empresa.
- El inventario se administra por sucursal.
- Una venta reduce stock en la sucursal donde se registra.
- No se permite vender por encima del stock disponible.
- El reporte de top productos se consulta por rango de fechas y sucursal.


## 6. Arquitectura utlizada:

![](docs/assets/diagrams/ARQUITECTURA USADA)


## 7. Flujo de desplieuge
