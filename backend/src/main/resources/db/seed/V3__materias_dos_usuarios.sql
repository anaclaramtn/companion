-- Matérias que cada usuário de exemplo domina (DOMINA) ou quer aprender
-- (QUER_APRENDER), alinhadas com a biografia de cada um. A busca "Social" usa
-- só as que a pessoa domina. Os usuários reais (criados à mão) não são alterados.
-- Pressupõe a V1 e a V2 (usuários) e o catálogo de matérias já carregados.

-- ana: Estrutura de dados e algoritmos
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T390', 'T160', 'T198', 'T290')
WHERE u.email = 'ana.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T242')
WHERE u.email = 'ana.exemplo@edu.unifor.br';

-- bruno: POO e desenvolvimento mobile
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T164', 'T197', 'T163')
WHERE u.email = 'bruno.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T296')
WHERE u.email = 'bruno.exemplo@edu.unifor.br';

-- carla: banco de dados e ciência de dados
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T203', 'T333', 'T326', 'T371')
WHERE u.email = 'carla.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T296')
WHERE u.email = 'carla.exemplo@edu.unifor.br';

-- diego: back-end, APIs e programação funcional
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T242', 'T300', 'T200', 'T164')
WHERE u.email = 'diego.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T335')
WHERE u.email = 'diego.exemplo@edu.unifor.br';

-- elisa: algoritmos, grafos e maratona
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T198', 'T290', 'T160', 'T390', 'T162')
WHERE u.email = 'elisa.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T296')
WHERE u.email = 'elisa.exemplo@edu.unifor.br';

-- felipe: inteligência artificial e arquitetura
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T296', 'T196', 'T951', 'T303')
WHERE u.email = 'felipe.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T326')
WHERE u.email = 'felipe.exemplo@edu.unifor.br';

-- gustavo: redes, Linux e segurança
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T310', 'T114', 'T320', 'T117')
WHERE u.email = 'gustavo.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T139')
WHERE u.email = 'gustavo.exemplo@edu.unifor.br';

-- helena: design de interfaces e UX
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T163', 'T166', 'T294')
WHERE u.email = 'helena.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T242')
WHERE u.email = 'helena.exemplo@edu.unifor.br';

-- igor: computação paralela e distribuída
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T292', 'T335', 'T303', 'T143')
WHERE u.email = 'igor.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T296')
WHERE u.email = 'igor.exemplo@edu.unifor.br';

-- julia: ciência de dados e visualização
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T326', 'T199', 'T371', 'N589')
WHERE u.email = 'julia.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T296')
WHERE u.email = 'julia.exemplo@edu.unifor.br';

-- kaue: jogos, grafos e algoritmos
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T195', 'T290', 'T198', 'N394', 'T168')
WHERE u.email = 'kaue.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T292')
WHERE u.email = 'kaue.exemplo@edu.unifor.br';

-- larissa: requisitos e gestão de projetos
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T193', 'T289', 'T400', 'T304')
WHERE u.email = 'larissa.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T113')
WHERE u.email = 'larissa.exemplo@edu.unifor.br';

-- mateus: Java e bancos de dados
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T164', 'T203', 'T333')
WHERE u.email = 'mateus.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T200')
WHERE u.email = 'mateus.exemplo@edu.unifor.br';

-- natalia: ética, pesquisa e inovação
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'DOMINA' FROM users u JOIN subjects s ON s.code IN ('T116', 'T295', 'T339', 'T113')
WHERE u.email = 'natalia.exemplo@edu.unifor.br';
INSERT INTO user_subjects (user_id, subject_id, interest_type)
SELECT u.id, s.id, 'QUER_APRENDER' FROM users u JOIN subjects s ON s.code IN ('T296')
WHERE u.email = 'natalia.exemplo@edu.unifor.br';
