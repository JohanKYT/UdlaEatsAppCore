-- 1. Inserción de Roles Base
INSERT INTO roles (id, role_name) VALUES (1, 'ADMIN'), (2, 'USER'), (3, 'RESTAURANT') ON CONFLICT DO NOTHING;

-- 2. Administrador Global (ID: 1)
INSERT INTO users (id, name, email, password, role_id, account_status, penalty_points)
VALUES (1, 'Administrador Global', 'admin.core@udla.edu.ec', 'AdminUdla2026.', 1, 'APPROVED', 0)
    ON CONFLICT DO NOTHING;

-- 3. Generación masiva de Estudiantes (IDs del 2 al 500)
INSERT INTO users (id, name, email, password, role_id, account_status, penalty_points)
SELECT
    i,
    'Estudiante Udla ' || i,
    'estudiante' || i || '@udla.edu.ec',
    'password123',
    2,
    'APPROVED',
    0
FROM generate_series(2, 500) AS i
    ON CONFLICT DO NOTHING;

-- 4. Generación masiva de Usuarios Restaurante (IDs del 501 al 520)
INSERT INTO users (id, name, email, password, role_id, account_status, penalty_points, campus, opening_time, closing_time)
SELECT
    i,
    'Usuario Restaurante ' || i,
    'restaurante' || i || '@udla.edu.ec',
    'password123',
    3,
    'APPROVED',
    0,
    CASE WHEN i % 2 = 0 THEN 'UDLA Park' ELSE 'Granados' END,
    '07:00',
    '19:30'
FROM generate_series(501, 520) AS i
    ON CONFLICT DO NOTHING;

-- 5. Creación de la Información de los Restaurantes en su tabla respectiva (IDs del 1 al 20)
-- Esto soluciona el error de Foreign Key. Enlaza el ID del restaurante con el ID del usuario (501 a 520).
INSERT INTO restaurant_info (id, user_id, campus_location, open_time, close_time, phone_number, is_verified_by_admin)
SELECT
    i - 500,
    i,
    CASE WHEN i % 2 = 0 THEN 'UDLA Park' ELSE 'Granados' END,
    '07:00:00',
    '19:30:00',
    '0999999999',
    true
FROM generate_series(501, 520) AS i
    ON CONFLICT DO NOTHING;

-- 6. Generación masiva de 2000 Órdenes Históricas
INSERT INTO order_logs (id, item_name, order_day_of_week, order_date, order_time, status, restaurant_id, user_id)
SELECT
    i,
    CASE (i % 4) WHEN 0 THEN 'Hamburguesa' WHEN 1 THEN 'Pizza' WHEN 2 THEN 'Ensalada' ELSE 'Almuerzo' END,
    CASE (i % 5) WHEN 0 THEN 'MONDAY' WHEN 1 THEN 'TUESDAY' WHEN 2 THEN 'WEDNESDAY' WHEN 3 THEN 'THURSDAY' ELSE 'FRIDAY' END,
    CURRENT_DATE,
    time '12:00:00' + random() * (time '14:30:00' - time '12:00:00'),
    'COMPLETED',
    (random() * 19 + 1)::int,
    (random() * 498 + 2)::int
FROM generate_series(1, 2000) AS i
    ON CONFLICT DO NOTHING;