/* 
  SQL para inicializar la base de datos, con las tablas y los seeds inicales 
*/

-- TABLAS

CREATE TABLE categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE branches (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE products (
  id          SERIAL        PRIMARY KEY,
  name        VARCHAR(150)  NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url   VARCHAR(500),
  category_id INT           NOT NULL REFERENCES categories(id)
);

CREATE TABLE inventory (
  product_id INT NOT NULL REFERENCES products(id),
  branch_id  INT NOT NULL REFERENCES branches(id),
  stock      INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  PRIMARY KEY (product_id, branch_id)
);

CREATE TABLE sales (
  id        SERIAL      PRIMARY KEY,
  branch_id INT         NOT NULL REFERENCES branches(id),
  sold_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()  
);

CREATE TABLE sale_items (
  id         SERIAL        PRIMARY KEY,
  sale_id    INT           NOT NULL REFERENCES sales(id),
  product_id INT           NOT NULL REFERENCES products(id),
  quantity   INT           NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  UNIQUE (sale_id, product_id) 
);

-- ÍNDICES

CREATE INDEX idx_products_category   ON products(category_id);
CREATE INDEX idx_inventory_branch    ON inventory(branch_id);
CREATE INDEX idx_sales_branch_date   ON sales(branch_id, sold_at);
CREATE INDEX idx_sale_items_sale     ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product  ON sale_items(product_id);

-- SEED INICIAL

INSERT INTO categories (name) VALUES
  ('Laptops'),
  ('Periféricos'),
  ('Componentes');

INSERT INTO branches (name) VALUES
  ('Centro'),
  ('Norte'),
  ('Occidente');