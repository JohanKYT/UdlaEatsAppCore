-- 1. Inserción de Roles Base
INSERT INTO roles (id, role_name) VALUES (1, 'ADMIN'), (2, 'USER'), (3, 'RESTAURANT') ON CONFLICT DO NOTHING;

-- 2. Administrador Global (AQUÍ SE AGREGÓ EL CAMPUS)
INSERT INTO users (id, name, email, password, role_id, account_status, penalty_points, phone, campus)
VALUES (1, 'Administrador Global', 'admin.core@udla.edu.ec', 'AdminUdla2026.', 1, 'APPROVED', 0, '0999999999', 'UDLA Park')
    ON CONFLICT DO NOTHING;

-- 3. Generación masiva de Estudiantes (AQUÍ SE AGREGÓ EL CAMPUS)
INSERT INTO users (id, name, email, password, role_id, account_status, penalty_points, phone, campus)
SELECT
    i,
    'Estudiante Udla ' || i,
    'estudiante' || i || '@udla.edu.ec',
    'password123',
    2,
    'APPROVED',
    0,
    '098123456' || (i % 9),
    CASE WHEN i % 2 = 0 THEN 'UDLA Park' ELSE 'Granados' END
FROM generate_series(2, 500) AS i
    ON CONFLICT DO NOTHING;

-- 4. Generación masiva de Usuarios Restaurante
INSERT INTO users (id, name, email, password, role_id, account_status, penalty_points, campus, opening_time, closing_time, phone)
SELECT
    i,
    'Local Udla ' || (i - 500),
    'restaurante' || (i - 500) || '@udla.edu.ec',
    'password123',
    3,
    'APPROVED',
    0,
    CASE WHEN i % 2 = 0 THEN 'UDLA Park' ELSE 'Granados' END,
    '07:00',
    '19:30',
    '097111222' || (i % 9)
FROM generate_series(501, 520) AS i
    ON CONFLICT DO NOTHING;

-- 5. Perfiles de Restaurante y sincronización de Teléfonos
INSERT INTO restaurant_info (id, user_id, campus_location, open_time, close_time, phone_number, is_verified_by_admin)
SELECT
    i - 500,
    i,
    CASE WHEN i % 2 = 0 THEN 'UDLA Park' ELSE 'Granados' END,
    '07:00:00',
    '19:30:00',
    '097111222' || (i % 9),
    true
FROM generate_series(501, 520) AS i
    ON CONFLICT DO NOTHING;

-- 6. Generación de Menús (4 Platillos por restaurante)
INSERT INTO menu_items (id, restaurant_id, name, description, price, category, is_available, stock_quantity, image_url)
SELECT (i * 4) - 3, i, 'Hamburguesa Clásica', 'Deliciosa hamburguesa con queso, lechuga y tomate.', 5.50, 'Comida Rápida', true, 50, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' FROM generate_series(1, 20) AS i ON CONFLICT DO NOTHING;

INSERT INTO menu_items (id, restaurant_id, name, description, price, category, is_available, stock_quantity, image_url)
SELECT (i * 4) - 2, i, 'Pizza Pepperoni', 'Pizza personal de pepperoni con extra queso.', 4.50, 'Comida Rápida', true, 40, 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ce' FROM generate_series(1, 20) AS i ON CONFLICT DO NOTHING;

INSERT INTO menu_items (id, restaurant_id, name, description, price, category, is_available, stock_quantity, image_url)
SELECT (i * 4) - 1, i, 'Ensalada César', 'Fresca ensalada con pollo a la plancha.', 4.00, 'Saludable', true, 30, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd' FROM generate_series(1, 20) AS i ON CONFLICT DO NOTHING;

INSERT INTO menu_items (id, restaurant_id, name, description, price, category, is_available, stock_quantity, image_url)
SELECT (i * 4), i, 'Almuerzo Ejecutivo', 'Sopa, plato fuerte y jugo del día.', 3.50, 'Almuerzos', true, 60, 'https://images.unsplash.com/photo-1547592180-85f173990554' FROM generate_series(1, 20) AS i ON CONFLICT DO NOTHING;

-- 7. Historial de 2000 Órdenes
INSERT INTO order_logs (id, item_name, order_day_of_week, order_date, order_time, status, restaurant_id, user_id)
SELECT
    i,
    CASE (i % 4) WHEN 0 THEN 'Hamburguesa Clásica' WHEN 1 THEN 'Pizza Pepperoni' WHEN 2 THEN 'Ensalada César' ELSE 'Almuerzo Ejecutivo' END,
    CASE (i % 5) WHEN 0 THEN 'MONDAY' WHEN 1 THEN 'TUESDAY' WHEN 2 THEN 'WEDNESDAY' WHEN 3 THEN 'THURSDAY' ELSE 'FRIDAY' END,
    CURRENT_DATE - (i % 30) * INTERVAL '1 day',
    time '12:00:00' + random() * (time '14:30:00' - time '12:00:00'),
    'COMPLETED',
    (i % 20) + 1,
    (i % 499) + 2
FROM generate_series(1, 2000) AS i
ON CONFLICT DO NOTHING;

-- 8. Órdenes Frescas de HOY
INSERT INTO order_logs (id, item_name, order_day_of_week, order_date, order_time, status, restaurant_id, user_id)
SELECT
    i,
    CASE (i % 4) WHEN 0 THEN 'Hamburguesa Clásica' WHEN 1 THEN 'Pizza Pepperoni' WHEN 2 THEN 'Ensalada César' ELSE 'Almuerzo Ejecutivo' END,
    CASE EXTRACT(ISODOW FROM CURRENT_DATE) WHEN 1 THEN 'MONDAY' WHEN 2 THEN 'TUESDAY' WHEN 3 THEN 'WEDNESDAY' WHEN 4 THEN 'THURSDAY' WHEN 5 THEN 'FRIDAY' WHEN 6 THEN 'SATURDAY' WHEN 7 THEN 'SUNDAY' END,
    CURRENT_DATE,
    LOCALTIME,
    'PENDING',
    (i % 20) + 1,
    (i % 499) + 2
FROM generate_series(2001, 2050) AS i
    ON CONFLICT DO NOTHING;

-- 9. Historial de Tráfico (Para el Motor Predictivo)
INSERT INTO traffic_logs (id, restaurant_id, traffic_level, recorded_date, recorded_day_of_week, recorded_time)
SELECT
    i,
    (i % 20) + 1,
    'HIGH',
    CURRENT_DATE - ((i % 2) * 7) * INTERVAL '1 day',
    CASE EXTRACT(ISODOW FROM CURRENT_DATE) WHEN 1 THEN 'MONDAY' WHEN 2 THEN 'TUESDAY' WHEN 3 THEN 'WEDNESDAY' WHEN 4 THEN 'THURSDAY' WHEN 5 THEN 'FRIDAY' WHEN 6 THEN 'SATURDAY' WHEN 7 THEN 'SUNDAY' END,
    LOCALTIME
FROM generate_series(1, 100) AS i
ON CONFLICT DO NOTHING;