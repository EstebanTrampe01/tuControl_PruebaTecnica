Prueba Técnica TuControl – Web Developer
Una empresa de retail tecnológico necesita una herramienta interna para operar mejor su
catálogo, sus existencias y sus ventas.
Situación
NovaTech Store es una cadena de tiendas de tecnología que comparte un mismo catálogo
para toda la empresa, pero administra existencias por sucursal. Actualmente varias partes de
su operación se resuelven de forma manual y quieren dar un primer paso hacia una
herramienta interna que les permita trabajar con más orden.
La empresa ya tiene definidas tres categorías fijas para su catálogo: Laptops, Periféricos y
Componentes. También opera con tres sucursales fijas: Centro, Norte y Occidente. Puedes
tratarlas como datos iniciales del sistema (seed).
El precio de cada producto es único para toda la empresa, pero la disponibilidad depende de
cada sucursal. Además, cuando una venta se registra, esperan que la solución refleje de forma
coherente el efecto de esa operación sobre las existencias.
Lo que necesita esta empresa
NovaTech necesita una herramienta que le permita gestionar de forma ordenada su catálogo
de productos y las existencias que cada sucursal tiene disponibles. Hoy ese control se lleva
de manera informal, lo que complica saber en qué sucursal hay unidades de un producto
determinado y cuántas. La herramienta debe permitir tener visibilidad clara sobre el estado
del inventario en cada punto de venta, y ofrecer la posibilidad de definir o ajustar cuántas
unidades de cada producto hay disponibles en cada sucursal.
El otro eje central del sistema es el registro de ventas. Cada venta ocurre en una sucursal
específica e involucra uno o más productos. Al registrar esa operación, el sistema debe
reflejar su efecto de forma coherente sobre el inventario disponible. No se contempla
autenticación, devoluciones, traslados entre sucursales ni integración con facturación: el
objetivo es tener un flujo operativo básico que funcione de forma confiable y que sea fácil
de entender y revisar.
La herramienta también debe ayudar a los equipos a entender cómo está funcionando la
operación comercial. Para eso, NovaTech necesita poder consultar qué productos se están
vendiendo más en cada sucursal dentro de un período determinado, de forma que puedan
tomar decisiones simples de inventario o reposición. Esta consulta es parte del entregable y
debe estar disponible tanto desde la interfaz como a través de un endpoint dedicado.
Parte del valor de esta prueba está en cómo interpretas el dominio, qué decisiones tomas
frente a los casos que no están completamente especificados, y cuán coherente y sostenible
resulta tu implementación.
Reporte solicitado
Además del flujo operativo, la empresa necesita un reporte para monitorear su operación: top
productos vendidos por sucursal en un rango de fechas. Este reporte debe resolverse
mediante una consulta SQL escrita y ejecutada directamente —sin delegarla a un ORM—,
independientemente de las herramientas que utilices en el resto del backend. Debe exponerse
a través de un endpoint y ser visible desde la interfaz. Como mínimo debe permitir identificar
la sucursal, el producto, la cantidad vendida y el total vendido en el período consultado.
Restricciones técnicas
• El frontend debe estar desarrollado con Next.js.
• El backend debe estar desarrollado con Node.js y estar separado del frontend. Next.js
no debe utilizarse como backend; se recomienda organizar ambas partes en carpetas
separadas dentro del mismo repositorio.
• Debes usar una base de datos SQL relacional de tu preferencia.
• La solución debe estar dockerizada.
• No es necesario implementar autenticación.
• No hay restricciones sobre librerías o utilidades de CSS.
Entregables
• Repositorio privado con separación clara entre frontend y backend.
• README con instrucciones suficientes para ejecutar y revisar la solución
localmente.
• Capturas de pantalla que evidencien el funcionamiento de las principales
funcionalidades de la solución
• Diagrama entidad-relación.
• Consulta SQL del reporte en un lugar fácilmente ubicable dentro del repositorio.
Consideraciones de entrega
• Crea un repositorio en GitHub y manténlo privado.
• Agrega al usuario damianpeaf como colaborador.
• Al finalizar, envía el enlace del repositorio por correo a damian@tucontrol.com.
• No es obligatorio desplegar la aplicación en un entorno público.