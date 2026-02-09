-- Add test users from American countries to leaderboard
-- This script inserts sample data with common names from various American countries

INSERT INTO public.leaderboard (player_name, score, words_count, longest_chain, game_duration_seconds, language, country_code, country_name, country_flag) VALUES
-- United States
('John Smith', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'en', 'US', 'United States', '🇺🇸'),
('Michael Johnson', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'en', 'US', 'United States', '🇺🇸'),
('Emily Davis', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'en', 'US', 'United States', '🇺🇸'),

-- Mexico
('Juan García', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'MX', 'Mexico', '🇲🇽'),
('María Hernández', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'MX', 'Mexico', '🇲🇽'),
('Carlos López', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'MX', 'Mexico', '🇲🇽'),

-- Canada
('David Wilson', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'en', 'CA', 'Canada', '🇨🇦'),
('Sarah Brown', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'en', 'CA', 'Canada', '🇨🇦'),

-- Brazil
('João Silva', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'pt', 'BR', 'Brazil', '🇧🇷'),
('Maria Santos', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'pt', 'BR', 'Brazil', '🇧🇷'),
('Pedro Oliveira', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'pt', 'BR', 'Brazil', '🇧🇷'),

-- Argentina
('Diego Rodríguez', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'AR', 'Argentina', '🇦🇷'),
('Lucía González', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'AR', 'Argentina', '🇦🇷'),

-- Colombia
('José Martínez', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'CO', 'Colombia', '🇨🇴'),
('Ana Rodríguez', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'CO', 'Colombia', '🇨🇴'),

-- Chile
('Francisco Jara', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'CL', 'Chile', '🇨🇱'),
('Catalina Rojas', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'CL', 'Chile', '🇨🇱'),

-- Peru
('Luis Ramos', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'PE', 'Peru', '🇵🇪'),
('Sofía Vargas', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'PE', 'Peru', '🇵🇪'),

-- Venezuela
('Carlos Díaz', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'VE', 'Venezuela', '🇻🇪'),
('Isabella Pérez', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'VE', 'Venezuela', '🇻🇪'),

-- Guatemala
('Luis Morales', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'GT', 'Guatemala', '🇬🇹'),
('María López', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'GT', 'Guatemala', '🇬🇹'),

-- Cuba
('Roberto García', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'CU', 'Cuba', '🇨🇺'),
('Carmen Rodríguez', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'CU', 'Cuba', '🇨🇺'),

-- Ecuador
('Andrés Mora', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'EC', 'Ecuador', '🇪🇨'),
('Gabriela Torres', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'EC', 'Ecuador', '🇪🇨'),

-- Bolivia
('Diego Vargas', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'BO', 'Bolivia', '🇧🇴'),
('Fernanda Ramos', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'BO', 'Bolivia', '🇧🇴'),

-- Uruguay
('Martín Fernández', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'UY', 'Uruguay', '🇺🇾'),
('Sofía Martínez', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'UY', 'Uruguay', '🇺🇾'),

-- Panama
('Carlos González', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'PA', 'Panama', '🇵🇦'),
('Ana María Díaz', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'PA', 'Panama', '🇵🇦'),

-- Costa Rica
('José Castro', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'CR', 'Costa Rica', '🇨🇷'),
('María Elena Rojas', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'CR', 'Costa Rica', '🇨🇷'),

-- Honduras
('Juan Carlos Reyes', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'HN', 'Honduras', '🇭🇳'),
('Patricia Morales', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'HN', 'Honduras', '🇭🇳'),

-- Nicaragua
('Luis Ortega', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'NI', 'Nicaragua', '🇳🇮'),
('Rosa Elena Martínez', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'NI', 'Nicaragua', '🇳🇮'),

-- El Salvador
('Roberto Herrera', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'SV', 'El Salvador', '🇸🇻'),
('Cecilia García', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'SV', 'El Salvador', '🇸🇻'),

-- Paraguay
('Jorge Benítez', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'PY', 'Paraguay', '🇵🇾'),
('Lucía Giménez', FLOOR(RANDOM() * 500) + 100, FLOOR(RANDOM() * 20) + 5, FLOOR(RANDOM() * 8) + 2, 60, 'es', 'PY', 'Paraguay', '🇵🇾');