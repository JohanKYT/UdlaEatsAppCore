-- data.sql

-- 1. Inserción de Roles Base (Ignorar si existen)
INSERT INTO roles (id, role_name) VALUES (1, 'ADMIN'), (2, 'USER'), (3, 'RESTAURANT') ON CONFLICT DO NOTHING;

-- 2. Administrador Global
INSERT INTO users (id, name, email, password, role_id, account_status)
VALUES (1, 'Administrador Global', 'admin.core@udla.edu.ec', 'AdminUdla2026.', 1, 'APPROVED')
    ON CONFLICT DO NOTHING;

-- 3. Generación masiva de 500 Estudiantes
INSERT INTO users (id, name, email, password, role_id, account_status)
SELECT
    i + 1,
    'Estudiante Udla ' || i,
    'estudiante' || i || '@udla.edu.ec',
    'password123',
    2,
    'APPROVED'
FROM generate_series(1, 500) AS i
    ON CONFLICT DO NOTHING;

-- 4. Generación masiva de 20 Restaurantes
INSERT INTO users (id, name, email, password, role_id, account_status, campus, opening_time, closing_time)
SELECT
    i + 501,
    'Restaurante Local ' || i,
    'restaurante' || i || '@udla.edu.ec',
    'password123',
    3,
    'APPROVED',
    CASE WHEN i % 2 = 0 THEN 'UDLA Park' ELSE 'Granados' END,
    '07:00',
    '19:30'
FROM generate_series(1, 20) AS i
    ON CONFLICT DO NOTHING;

-- 5. Generación masiva de 2000 Órdenes Históricas (Distribuidas aleatoriamente)
INSERT INTO order_logs (id, item_name, order_day_of_week, order_date, order_time, restaurant_id, user_id)
SELECT
    i,
    CASE (i % 4) WHEN 0 THEN 'Hamburguesa' WHEN 1 THEN 'Pizza' WHEN 2 THEN 'Ensalada' ELSE 'Almuerzo' END,
    CASE (i % 5) WHEN 0 THEN 1 WHEN 1 THEN 2 WHEN 2 THEN 3 WHEN 3 THEN 4 ELSE 5 END,
    CURRENT_DATE, -- Se agregó la fecha obligatoria
    time '12:00:00' + random() * (time '14:30:00' - time '12:00:00'),
    (random() * 19 + 501)::int,
    (random() * 499 + 2)::int
FROM generate_series(1, 2000) AS i
    ON CONFLICT DO NOTHING;