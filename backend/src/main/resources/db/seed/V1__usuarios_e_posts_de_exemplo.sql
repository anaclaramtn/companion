-- Dados de exemplo para desenvolvimento: 6 usuários, 12 dúvidas, respostas, curtidas e seguidores.
-- Senha de todos os usuários de exemplo: Senha123
-- Login por e-mail ou username (ex.: ana.exemplo@edu.unifor.br ou anabeatriz).
--
-- Roda uma única vez: o Flyway registra a versão na tabela flyway_schema_history.
-- Pressupõe que as tabelas, o curso e as matérias já existam; o backend cria tudo isso ao subir.

INSERT INTO users (email, password_hash, email_verified_at, name, username, bio, course_id, semester, role, status, onboarding_completed_at, created_at, updated_at) VALUES
('ana.exemplo@edu.unifor.br', '$2a$10$FUZcc6s5rFpm6vpbKIZy8.n3ZnX0BdSYcfd4/4X6ObYu712svByv.', NOW(), 'Ana Beatriz', 'anabeatriz', 'Estudante de CC, gosto de estrutura de dados e de café.', (SELECT MIN(id) FROM courses), 5, 'USER', 'ACTIVE', NOW(), TIMESTAMPADD(DAY, -10, NOW()), TIMESTAMPADD(DAY, -10, NOW())),
('bruno.exemplo@edu.unifor.br', '$2a$10$FUZcc6s5rFpm6vpbKIZy8.n3ZnX0BdSYcfd4/4X6ObYu712svByv.', NOW(), 'Bruno Lima', 'brunolima', 'Foco em POO e desenvolvimento mobile.', (SELECT MIN(id) FROM courses), 4, 'USER', 'ACTIVE', NOW(), TIMESTAMPADD(DAY, -10, NOW()), TIMESTAMPADD(DAY, -10, NOW())),
('carla.exemplo@edu.unifor.br', '$2a$10$FUZcc6s5rFpm6vpbKIZy8.n3ZnX0BdSYcfd4/4X6ObYu712svByv.', NOW(), 'Carla Menezes', 'carlamenezes', 'Banco de dados e ciência de dados.', (SELECT MIN(id) FROM courses), 7, 'USER', 'ACTIVE', NOW(), TIMESTAMPADD(DAY, -10, NOW()), TIMESTAMPADD(DAY, -10, NOW())),
('diego.exemplo@edu.unifor.br', '$2a$10$FUZcc6s5rFpm6vpbKIZy8.n3ZnX0BdSYcfd4/4X6ObYu712svByv.', NOW(), 'Diego Alves', 'diegoalves', 'Back-end, APIs e programação funcional.', (SELECT MIN(id) FROM courses), 6, 'USER', 'ACTIVE', NOW(), TIMESTAMPADD(DAY, -10, NOW()), TIMESTAMPADD(DAY, -10, NOW())),
('elisa.exemplo@edu.unifor.br', '$2a$10$FUZcc6s5rFpm6vpbKIZy8.n3ZnX0BdSYcfd4/4X6ObYu712svByv.', NOW(), 'Elisa Rocha', 'elisarocha', 'Algoritmos, grafos e maratona de programação.', (SELECT MIN(id) FROM courses), 3, 'USER', 'ACTIVE', NOW(), TIMESTAMPADD(DAY, -10, NOW()), TIMESTAMPADD(DAY, -10, NOW())),
('felipe.exemplo@edu.unifor.br', '$2a$10$FUZcc6s5rFpm6vpbKIZy8.n3ZnX0BdSYcfd4/4X6ObYu712svByv.', NOW(), 'Felipe Costa', 'felipecosta', 'Inteligência artificial e arquitetura de computadores.', (SELECT MIN(id) FROM courses), 8, 'USER', 'ACTIVE', NOW(), TIMESTAMPADD(DAY, -10, NOW()), TIMESTAMPADD(DAY, -10, NOW()));

INSERT INTO posts (author_id, title, content, created_at) VALUES
((SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), 'Diferença entre pilha e fila na prática?', 'Entendi a teoria de pilha (LIFO) e fila (FIFO), mas em que situações reais eu escolheria uma em vez da outra? Alguém tem um exemplo simples?', TIMESTAMPADD(HOUR, -70, NOW())),
((SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), 'Quando usar herança e quando usar composição?', 'No trabalho de POO fiquei em dúvida se Carro deve herdar de Veículo ou ter um Motor. Existe uma regra prática para decidir?', TIMESTAMPADD(HOUR, -60, NOW())),
((SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), 'Como saber se preciso de um índice na tabela?', 'Minha consulta no MySQL está lenta com poucas mil linhas. Criar índice em toda coluna é uma boa ideia ou piora as inserções?', TIMESTAMPADD(HOUR, -50, NOW())),
((SELECT id FROM users WHERE email = 'diego.exemplo@edu.unifor.br'), 'CORS bloqueando minha API local', 'Meu front em localhost:5173 não consegue chamar a API em localhost:8080 e aparece erro de CORS no console. Onde eu configuro isso no Spring?', TIMESTAMPADD(HOUR, -40, NOW())),
((SELECT id FROM users WHERE email = 'elisa.exemplo@edu.unifor.br'), 'Como começar a pensar em recursão?', 'Sempre travo quando o enunciado pede recursão. Existe um passo a passo para achar o caso base e o passo recursivo sem decorar exemplos?', TIMESTAMPADD(HOUR, -36, NOW())),
((SELECT id FROM users WHERE email = 'felipe.exemplo@edu.unifor.br'), 'Overfitting: como perceber que aconteceu?', 'Meu modelo acerta quase tudo no treino e vai mal no teste. É overfitting? Quais técnicas simples eu posso testar primeiro?', TIMESTAMPADD(HOUR, -30, NOW())),
((SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), 'Dicas para testar protótipo com usuários', 'Vamos validar um protótipo de app com colegas de outros cursos. Quantas pessoas vale testar e que perguntas fazer sem induzir a resposta?', TIMESTAMPADD(HOUR, -26, NOW())),
((SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), 'Kotlin ou Flutter para o projeto da disciplina?', 'Nosso grupo precisa entregar um app móvel em oito semanas e ninguém tem experiência. Vale mais a pena Flutter ou Android nativo com Kotlin?', TIMESTAMPADD(HOUR, -20, NOW())),
((SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), 'Como citar código de terceiros no trabalho?', 'Usei um trecho de código de um fórum no projeto. Preciso citar? Como referenciar isso nas normas sem parecer plágio?', TIMESTAMPADD(HOUR, -14, NOW())),
((SELECT id FROM users WHERE email = 'diego.exemplo@edu.unifor.br'), 'Função pura: o que realmente significa?', 'Ouvi que função pura não pode ter efeitos colaterais. Ler uma variável global já conta como efeito? Exemplos ajudam.', TIMESTAMPADD(HOUR, -9, NOW())),
((SELECT id FROM users WHERE email = 'elisa.exemplo@edu.unifor.br'), 'BFS ou DFS para achar menor caminho?', 'Em um grafo sem pesos, qual busca devo usar para o menor número de arestas? Entendi o funcionamento, mas confundo quando cada uma é indicada.', TIMESTAMPADD(HOUR, -5, NOW())),
((SELECT id FROM users WHERE email = 'felipe.exemplo@edu.unifor.br'), 'Por que o cache melhora tanto o desempenho?', 'Li sobre localidade espacial e temporal, mas não consegui ligar com um exemplo de código. Um loop em matriz mostra isso?', TIMESTAMPADD(HOUR, -2, NOW()));

INSERT INTO post_subjects (post_id, subject_id) VALUES
((SELECT MAX(id) FROM posts WHERE title = 'Diferença entre pilha e fila na prática?'), (SELECT id FROM subjects WHERE code = 'T390')),
((SELECT MAX(id) FROM posts WHERE title = 'Quando usar herança e quando usar composição?'), (SELECT id FROM subjects WHERE code = 'T164')),
((SELECT MAX(id) FROM posts WHERE title = 'Como saber se preciso de um índice na tabela?'), (SELECT id FROM subjects WHERE code = 'T203')),
((SELECT MAX(id) FROM posts WHERE title = 'Como saber se preciso de um índice na tabela?'), (SELECT id FROM subjects WHERE code = 'T333')),
((SELECT MAX(id) FROM posts WHERE title = 'CORS bloqueando minha API local'), (SELECT id FROM subjects WHERE code = 'T242')),
((SELECT MAX(id) FROM posts WHERE title = 'Como começar a pensar em recursão?'), (SELECT id FROM subjects WHERE code = 'T160')),
((SELECT MAX(id) FROM posts WHERE title = 'Overfitting: como perceber que aconteceu?'), (SELECT id FROM subjects WHERE code = 'T296')),
((SELECT MAX(id) FROM posts WHERE title = 'Dicas para testar protótipo com usuários'), (SELECT id FROM subjects WHERE code = 'T163')),
((SELECT MAX(id) FROM posts WHERE title = 'Kotlin ou Flutter para o projeto da disciplina?'), (SELECT id FROM subjects WHERE code = 'T197')),
((SELECT MAX(id) FROM posts WHERE title = 'Como citar código de terceiros no trabalho?'), (SELECT id FROM subjects WHERE code = 'T116')),
((SELECT MAX(id) FROM posts WHERE title = 'Função pura: o que realmente significa?'), (SELECT id FROM subjects WHERE code = 'T300')),
((SELECT MAX(id) FROM posts WHERE title = 'BFS ou DFS para achar menor caminho?'), (SELECT id FROM subjects WHERE code = 'T390')),
((SELECT MAX(id) FROM posts WHERE title = 'BFS ou DFS para achar menor caminho?'), (SELECT id FROM subjects WHERE code = 'T290')),
((SELECT MAX(id) FROM posts WHERE title = 'Por que o cache melhora tanto o desempenho?'), (SELECT id FROM subjects WHERE code = 'T196'));

INSERT INTO post_comments (post_id, author_id, content, created_at) VALUES
((SELECT MAX(id) FROM posts WHERE title = 'Diferença entre pilha e fila na prática?'), (SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), 'Pilha é boa para desfazer ações (Ctrl+Z) e para a chamada de funções. Fila é boa para ordem de chegada, como impressão ou atendimento.', TIMESTAMPADD(HOUR, -66, NOW())),
((SELECT MAX(id) FROM posts WHERE title = 'Diferença entre pilha e fila na prática?'), (SELECT id FROM users WHERE email = 'elisa.exemplo@edu.unifor.br'), 'Acrescentando: o botão voltar do navegador funciona como uma pilha de páginas.', TIMESTAMPADD(HOUR, -64, NOW())),
((SELECT MAX(id) FROM posts WHERE title = 'Quando usar herança e quando usar composição?'), (SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), 'Regra que ajuda: herança para ''é um'', composição para ''tem um''. Carro é um Veículo, mas tem um Motor.', TIMESTAMPADD(HOUR, -56, NOW())),
((SELECT MAX(id) FROM posts WHERE title = 'Como saber se preciso de um índice na tabela?'), (SELECT id FROM users WHERE email = 'diego.exemplo@edu.unifor.br'), 'Índice ajuda em colunas usadas em WHERE e JOIN. Use EXPLAIN para ver se a consulta realmente o usa. Em toda coluna, as inserções ficam mais lentas.', TIMESTAMPADD(HOUR, -46, NOW())),
((SELECT MAX(id) FROM posts WHERE title = 'CORS bloqueando minha API local'), (SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), 'No Spring Security libere a origem do front na configuração de CORS e inclua os métodos e cabeçalhos que você usa, como Authorization.', TIMESTAMPADD(HOUR, -38, NOW())),
((SELECT MAX(id) FROM posts WHERE title = 'Como começar a pensar em recursão?'), (SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), 'Escreva primeiro o caso mais simples que não precisa de recursão (lista vazia, n = 0) e depois pense em como reduzir o problema em um passo.', TIMESTAMPADD(HOUR, -33, NOW())),
((SELECT MAX(id) FROM posts WHERE title = 'Como começar a pensar em recursão?'), (SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), 'Teste de mesa com n pequeno ajuda muito a enxergar a pilha de chamadas.', TIMESTAMPADD(HOUR, -31, NOW())),
((SELECT MAX(id) FROM posts WHERE title = 'Overfitting: como perceber que aconteceu?'), (SELECT id FROM users WHERE email = 'diego.exemplo@edu.unifor.br'), 'Parece overfitting, sim. Teste validação cruzada, reduza a complexidade do modelo e tente mais dados ou regularização.', TIMESTAMPADD(HOUR, -27, NOW())),
((SELECT MAX(id) FROM posts WHERE title = 'Kotlin ou Flutter para o projeto da disciplina?'), (SELECT id FROM users WHERE email = 'felipe.exemplo@edu.unifor.br'), 'Com prazo curto e sem experiência, Flutter costuma render mais: uma base de código para Android e iOS e hot reload.', TIMESTAMPADD(HOUR, -17, NOW())),
((SELECT MAX(id) FROM posts WHERE title = 'Função pura: o que realmente significa?'), (SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), 'Ler variável global deixa a função dependente de estado externo, então já não é pura. Pura é: mesma entrada, mesma saída, sem mudar nada fora.', TIMESTAMPADD(HOUR, -7, NOW())),
((SELECT MAX(id) FROM posts WHERE title = 'BFS ou DFS para achar menor caminho?'), (SELECT id FROM users WHERE email = 'felipe.exemplo@edu.unifor.br'), 'Para o menor número de arestas em grafo sem pesos, use BFS: ela visita por níveis, então o primeiro caminho encontrado é o menor.', TIMESTAMPADD(HOUR, -3, NOW())),
((SELECT MAX(id) FROM posts WHERE title = 'Por que o cache melhora tanto o desempenho?'), (SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), 'Percorrer a matriz por linhas aproveita a localidade espacial, porque os elementos da linha ficam contíguos na memória. Por colunas costuma ser mais lento.', TIMESTAMPADD(HOUR, -1, NOW()));

INSERT INTO post_likes (user_id, post_id, created_at) VALUES
((SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Diferença entre pilha e fila na prática?'), NOW()),
((SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Diferença entre pilha e fila na prática?'), NOW()),
((SELECT id FROM users WHERE email = 'diego.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Diferença entre pilha e fila na prática?'), NOW()),
((SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Quando usar herança e quando usar composição?'), NOW()),
((SELECT id FROM users WHERE email = 'elisa.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Quando usar herança e quando usar composição?'), NOW()),
((SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Como saber se preciso de um índice na tabela?'), NOW()),
((SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Como saber se preciso de um índice na tabela?'), NOW()),
((SELECT id FROM users WHERE email = 'felipe.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Como saber se preciso de um índice na tabela?'), NOW()),
((SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'CORS bloqueando minha API local'), NOW()),
((SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'CORS bloqueando minha API local'), NOW()),
((SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Como começar a pensar em recursão?'), NOW()),
((SELECT id FROM users WHERE email = 'felipe.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Como começar a pensar em recursão?'), NOW()),
((SELECT id FROM users WHERE email = 'diego.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Overfitting: como perceber que aconteceu?'), NOW()),
((SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Overfitting: como perceber que aconteceu?'), NOW()),
((SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Dicas para testar protótipo com usuários'), NOW()),
((SELECT id FROM users WHERE email = 'elisa.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Kotlin ou Flutter para o projeto da disciplina?'), NOW()),
((SELECT id FROM users WHERE email = 'felipe.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Kotlin ou Flutter para o projeto da disciplina?'), NOW()),
((SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Como citar código de terceiros no trabalho?'), NOW()),
((SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Função pura: o que realmente significa?'), NOW()),
((SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'BFS ou DFS para achar menor caminho?'), NOW()),
((SELECT id FROM users WHERE email = 'diego.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'BFS ou DFS para achar menor caminho?'), NOW()),
((SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Por que o cache melhora tanto o desempenho?'), NOW()),
((SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), (SELECT MAX(id) FROM posts WHERE title = 'Por que o cache melhora tanto o desempenho?'), NOW());

INSERT INTO follows (follower_id, followed_id, created_at) VALUES
((SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), NOW()),
((SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), NOW()),
((SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), NOW()),
((SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'diego.exemplo@edu.unifor.br'), NOW()),
((SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), NOW()),
((SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'felipe.exemplo@edu.unifor.br'), NOW()),
((SELECT id FROM users WHERE email = 'diego.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'bruno.exemplo@edu.unifor.br'), NOW()),
((SELECT id FROM users WHERE email = 'diego.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'elisa.exemplo@edu.unifor.br'), NOW()),
((SELECT id FROM users WHERE email = 'elisa.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'), NOW()),
((SELECT id FROM users WHERE email = 'elisa.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'felipe.exemplo@edu.unifor.br'), NOW()),
((SELECT id FROM users WHERE email = 'felipe.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'carla.exemplo@edu.unifor.br'), NOW()),
((SELECT id FROM users WHERE email = 'felipe.exemplo@edu.unifor.br'), (SELECT id FROM users WHERE email = 'diego.exemplo@edu.unifor.br'), NOW());
