/* REPORTE DE TOP PRODUCTOS */

-- se calculo por sucursal
-- Parámetros: fecha_inicio, fecha_fin 
-- formato año/mes/dia

SELECT
  b.name                           AS sucursal,
  p.name                           AS producto,
  SUM(si.quantity)                 AS cantidad_vendida,
  SUM(si.quantity * si.unit_price) AS total_vendido
FROM sale_items si
JOIN sales    s ON s.id = si.sale_id
JOIN products p ON p.id = si.product_id
JOIN branches b ON b.id = s.branch_id
WHERE s.sold_at BETWEEN :fecha_inicio AND :fecha_fin
GROUP BY b.name, p.name
ORDER BY b.name, cantidad_vendida DESC;