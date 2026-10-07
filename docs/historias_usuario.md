# HU001 - Tela inicial de acesso do sistema (Login)

Como: Usuário ou administrador

Quero: Ser capaz de fazer login no sistema

Para que: Eu consiga acessar a tela do feed e outras funções do Companion

## Regras de Negócio

- O campo de login deve aceitar username (@) ou e-mail.
- Caso o valor informado não possua caracteres antes do @, o sistema deve presumir que se trata de um username.
- Caso o valor informado possua caracteres antes do @, o sistema deve presumir que se trata de um e-mail.
- Caso o usuário já possua uma sessão válida, não deve ser necessário realizar o login novamente.
- Caso o acesso seja feito de forma externa e o usuário já possua uma sessão válida, o usuário deve ser direcionado diretamente para a tela do feed, sem a necessidade de pressionar o botão de confirmação "Entrar".
- Caso o usuário possua uma sessão válida, mas ainda não tenha definido o Nome e o username (HU004), ele deve ser direcionado para a tela de criação de perfil.
- Após o login realizado com sucesso, caso o usuário já possua perfil criado, o sistema deve direcioná-lo para o feed.
- Após o login realizado com sucesso, caso o usuário ainda não tenha definido o Nome e o username (HU004), o sistema deve direcioná-lo para a tela de criação de perfil.

## Campos interagíveis

- Campo de texto preenchível para login.
- Campo de texto preenchível para senha.
- Botão para confirmar acesso.
- Botão para visualizar/esconder a senha.
- Botão para autenticar com Google.
- Hipertexto levando para a tela de cadastro.
- Hipertexto para recuperação de senha.

## Critérios de aceite

### Seção de Login

#### a. Campo para preenchimento do e-mail/username

- O campo deve permitir o preenchimento de um username ou endereço de e-mail.
- Caso o valor informado não possua caracteres antes do @, o sistema deve presumir que se trata de um username.
- Caso o valor informado possua caracteres antes do @, o sistema deve presumir que se trata de um e-mail.
- O campo deve possuir um placeholder especificando o que pode ser colocado: usuario@email.com.
- Deve possuir um pequeno título acima do campo escrito "Usuário".

#### b. Campo para preenchimento da senha

- Deve haver um campo preenchível de texto.
- Por padrão, esse campo deve manter letras, símbolos e números ocultos na forma de pontos pretos.
- Deve possuir um placeholder especificando o que deve ser colocado: password.
- Deve possuir um pequeno título acima do campo escrito "Senha".

#### c. Botão para visualizar/esconder senha

- Deve haver, dentro do campo de preenchimento de senha, um botão com formato de olho.
- Esse botão, ao ser pressionado, deve permitir a visualização da senha em formato padrão, sem a ocultação por pontos pretos.
- Caso a senha esteja visível, ao pressionar novamente o botão, o texto deve ser ocultado novamente por pontos pretos.

#### d. Botão de confirmação "Entrar"

- Um botão deve estar presente abaixo dos campos de usuário e senha.
- Esse botão deve ter a função de confirmar e validar as informações recebidas nos campos acima.
- Caso um dos dois campos, ou ambos, não estejam preenchidos, o botão deve permanecer desabilitado.
- Quando o botão for pressionado e entrar em estado de processamento das informações, ele deve ficar desabilitado para impedir novos envios.
- Caso as informações estejam corretas, a tela de login deve ser encerrada e o usuário deve ser direcionado para o feed, caso já possua perfil criado.
- Caso as informações estejam corretas, mas o usuário ainda não tenha definido o Nome e o username, a tela de login deve ser encerrada e o usuário deve ser direcionado para a tela de criação de perfil (HU004).
- Caso as informações estejam incorretas, o usuário deve receber uma mensagem de erro informando "O usuário ou a senha estão incorretos".
- Após uma tentativa de login inválida, o botão deve ficar novamente disponível para clique.

### Hipertexto de "Esqueceu a senha?"

#### a. Campo de hipertexto para alteração da senha

- O campo deve ser textual.
- Ao passar o mouse sobre o campo (hover), sua cor deve ser alterada para uma cor mais chamativa.
- Ao clicar nesse campo, a tela de recuperação de senha deve ser aberta.

### Hipertexto de "Ainda não possui conta?"

#### a. Campo de hipertexto para criação de conta

- O campo deve ser textual.
- Ao passar o mouse sobre o campo (hover), sua cor deve ser alterada para uma cor mais chamativa.
- Ao clicar nesse campo, a tela de cadastro/criação de conta deve ser aberta.

### Acesso com conta Google

#### a. Campo textual de acesso "Acessar conta com..."

- Deve haver um campo de texto puramente explicativo indicando que existem outras formas de acessar o sistema.

#### b. Botão de login com Google

- Deve haver um botão para autenticação utilizando uma conta Google.
- Ao pressionar o botão, o usuário deve ser redirecionado para o serviço de autenticação do Google.
- Quando a autenticação for confirmada, o sistema deve verificar se a autenticação foi concluída com sucesso.
- Caso a autenticação seja concluída com sucesso e o usuário ainda não possua conta, o sistema deve criar a conta e direcionar o usuário para a tela de criação de perfil (HU004).
- Caso a autenticação seja concluída com sucesso e o usuário já possua conta com perfil criado, o sistema deve direcionar o usuário para o feed.
- Caso a autenticação seja concluída com sucesso e o usuário já possua conta, mas ainda não tenha definido o Nome e o username, o sistema deve direcionar o usuário para a tela de criação de perfil (HU004).
- Caso o usuário cancele a autenticação ou ela falhe, o sistema deve retornar à tela de login.
- Caso o acesso não seja concluído com sucesso, o sistema deve exibir uma mensagem/aviso informando "Acesso com Google malsucedido" ou mensagem equivalente.

## Mensagens de erro e validação

- Caso o campo de usuário esteja vazio, o botão "Entrar" deve permanecer desabilitado.
- Caso o campo de senha esteja vazio, o botão "Entrar" deve permanecer desabilitado.
- Caso os campos de usuário e senha estejam preenchidos, mas as informações estejam incorretas, deve ser apresentada uma mensagem informando "O usuário ou a senha estão incorretos".
- Caso ocorra um erro durante o processo de autenticação, o usuário deve receber uma mensagem informando que não foi possível concluir o login e poderá tentar novamente.
- Caso o acesso com Google seja cancelado ou apresente erro, deve ser apresentada uma mensagem informando "Acesso com Google mal sucedido" ou mensagem equivalente.

# HU002 - Tela de cadastro de acesso do sistema (Cadastro)

Como: Usuário ou administrador

Quero: Ser capaz de fazer cadastro no sistema

Para que: Eu consiga acessar a tela do feed e outras funções do Companion

## Regras de Negócio

- O campo de cadastro de e-mail deve aceitar endereço de e-mail (com o @).
- Caso o usuário já possua uma conta cadastrada com o e-mail informado, o sistema deve informar que já existe uma conta utilizando esse e-mail.
- A senha deve possuir no mínimo 8 caracteres.
- A senha deve possuir ao menos 1 número.
- A senha deve possuir ao menos 1 letra minúscula.
- A senha deve possuir ao menos 1 letra maiúscula.
- A senha e a confirmação de senha devem possuir o mesmo valor para que o cadastro possa ser concluído.
- Caso o cadastro seja concluído com sucesso, o usuário deve ser direcionado para a tela de criação de perfil (HU004).
- O Nome e o username (@) não são solicitados no cadastro e devem ser definidos na criação de perfil (HU004).

## Campos interagíveis

- Campo de texto preenchível para e-mail.
- Campo de texto preenchível para senha.
- Campo de texto preenchível para confirmar senha.
- Botão para confirmar cadastro.
- Botão para ver/esconder a senha.
- Botão para autenticar com Google.
- Hipertexto levando para a tela de login.

## Critérios de aceite

### Seção de Cadastro

#### a. Campo para preenchimento do e-mail

- O campo deve permitir o preenchimento de um endereço de e-mail.
- O e-mail informado deve possuir formato válido de e-mail.
- O campo deve possuir um placeholder especificando o que deve ser colocado: usuario@email.com.
- Deve possuir um pequeno título acima do campo escrito "E-mail".
- Caso o e-mail informado já esteja cadastrado, o sistema deve informar que o e-mail já está sendo utilizado.

#### b. Campo para preenchimento da senha

- Deve haver um campo preenchível de texto.
- Por padrão, esse campo deve manter letras, símbolos e números ocultos na forma de pontos pretos.
- Deve possuir um placeholder especificando o que deve ser colocado: senha.
- Deve possuir um pequeno título acima do campo escrito "Senha".

#### c. Exigências da senha

- A senha deve possuir no mínimo 8 caracteres.
- A senha deve possuir ao menos 1 número.
- A senha deve possuir ao menos 1 letra minúscula.
- A senha deve possuir ao menos 1 letra maiúscula.
- O sistema deve verificar as exigências da senha antes de permitir a conclusão do cadastro.
- Caso uma ou mais exigências não sejam atendidas, o sistema deve informar ao usuário quais exigências ainda não foram cumpridas.

#### d. Campo para segundo preenchimento da senha (confirmação)

- Deve haver um campo preenchível de texto.
- Por padrão, esse campo deve manter letras, símbolos e números ocultos na forma de pontos pretos.
- Deve possuir um placeholder especificando o que deve ser colocado: confirmar senha.
- Deve possuir um pequeno título acima do campo escrito "Confirmar senha".
- A senha informada deve ser igual à senha preenchida no campo anterior.
- Caso as senhas sejam diferentes, o sistema deve informar que as senhas não coincidem.

#### e. Botão para visualizar/esconder senha

- Deve haver, dentro dos campos de preenchimento de senha e confirmar senha, um botão com formato de olho.
- Esse botão, ao ser pressionado, deve permitir a visualização da senha em formato padrão, sem a ocultação por pontos pretos.
- Caso o texto esteja visível, ao pressionar novamente o botão, o texto deve ser ocultado novamente por pontos pretos.

#### f. Botão de confirmação "Cadastrar"

- Um botão deve estar presente abaixo dos campos de e-mail, senha e confirmação de senha.
- Esse botão deve ter a função de confirmar e validar as informações recebidas nos campos acima.
- Caso um dos campos obrigatórios não esteja preenchido, o botão deve permanecer desabilitado.
- Quando o botão for pressionado e entrar em estado de processamento das informações, ele deve ficar desabilitado para impedir novos envios.
- Caso as informações estejam corretas e todas as validações sejam atendidas, o cadastro deve ser concluído e o usuário deve ser direcionado para a tela de criação de perfil (HU004).
- Caso as informações não estejam no padrão especificado, o usuário deve receber um aviso informando o problema encontrado.
- Após uma tentativa de cadastro inválida, o botão deve ficar novamente disponível para clique.

### Hipertexto de "Já possui uma conta?"

#### a. Campo de hipertexto para acesso à conta

- O campo deve ser textual.
- Ao passar o mouse sobre o campo (hover), sua cor deve ser alterada para uma cor mais chamativa.
- Ao clicar nesse campo, a tela de login deve ser aberta.

### Acesso com conta Google

#### a. Campo textual de acesso "Acessar conta com..."

- Deve haver um campo de texto puramente explicativo indicando que existem outras formas de acessar o sistema.

#### b. Botão de cadastro/login com Google

- Deve haver um botão para autenticação utilizando uma conta Google.
- Ao pressionar o botão, o usuário deve ser redirecionado para o serviço de autenticação do Google.
- Quando a autenticação for confirmada, o sistema deve verificar se a autenticação foi concluída com sucesso.
- Caso a autenticação seja concluída com sucesso e o usuário ainda não possua conta, o sistema deve criar a conta e direcionar o usuário para a tela de criação de perfil (HU004).
- Caso a autenticação seja concluída com sucesso e o usuário já possua conta com perfil criado, o sistema deve direcionar o usuário para o feed.
- Caso a autenticação seja concluída com sucesso e o usuário já possua conta, mas ainda não tenha definido o Nome e o username, o sistema deve direcionar o usuário para a tela de criação de perfil (HU004).
- Caso o usuário cancele a autenticação ou ela falhe, o sistema deve retornar à tela de cadastro.
- Caso o acesso não seja concluído com sucesso, o sistema deve exibir uma mensagem/aviso informando "Acesso com Google malsucedido" ou mensagem equivalente.

## Mensagens de erro e validação

- Caso o campo de e-mail esteja vazio, o botão "Cadastrar" deve permanecer desabilitado.
- Caso o e-mail esteja em formato inválido, deve ser apresentada uma mensagem informando "O e-mail informado é inválido".
- Caso o e-mail informado já esteja cadastrado, deve ser apresentada uma mensagem informando "O e-mail já está sendo utilizado".
- Caso a senha possua menos de 8 caracteres, deve ser apresentada uma mensagem informando que a senha deve possuir no mínimo 8 caracteres.
- Caso a senha não possua ao menos 1 número, deve ser apresentada uma mensagem informando que a senha deve possuir ao menos 1 número.
- Caso a senha não possua ao menos 1 letra minúscula, deve ser apresentada uma mensagem informando que a senha deve possuir ao menos 1 letra minúscula.
- Caso a senha não possua ao menos 1 letra maiúscula, deve ser apresentada uma mensagem informando que a senha deve possuir ao menos 1 letra maiúscula.
- Caso as senhas não sejam iguais, deve ser apresentada uma mensagem informando "As senhas não coincidem".
- Caso ocorra um erro durante o processo de cadastro, o usuário deve receber uma mensagem informando que não foi possível concluir o cadastro e poderá tentar novamente.
- Caso o acesso com Google seja cancelado ou apresente erro, deve ser apresentada uma mensagem informando "Acesso com Google malsucedido" ou mensagem equivalente.

# HU003 - Tela de recuperação e redefinição de senha

Como: Usuário

Quero: Ser capaz de recuperar e redefinir minha senha

Para que: Eu consiga voltar a acessar minha conta caso tenha esquecido ou perdido minha senha

## Regras de Negócio

- O usuário deve informar o e-mail cadastrado na conta para iniciar o processo de recuperação.
- O e-mail informado deve possuir formato válido de e-mail.
- Após a solicitação de recuperação, o sistema deve verificar se o e-mail está cadastrado.
- Caso o e-mail esteja cadastrado, o sistema deve enviar um link de recuperação para o endereço informado.
- Caso o e-mail não esteja cadastrado, o sistema não deve informar diretamente que o endereço não possui uma conta associada.
- O sistema deve apresentar uma mensagem informando que, caso o e-mail esteja cadastrado, as instruções de recuperação serão enviadas para o endereço informado.
- O link de recuperação deve permitir que o usuário acesse a tela de criação de uma nova senha.
- O link de recuperação deve possuir um período de validade.
- Caso o link de recuperação esteja expirado, o sistema não deve permitir a redefinição da senha e deve informar que o link expirou.
- Caso o link de recuperação já tenha sido utilizado, o sistema não deve permitir uma nova redefinição através do mesmo link e deve informar que o link já foi utilizado.
- A nova senha deve possuir no mínimo 8 caracteres.
- A nova senha deve possuir ao menos 1 número.
- A nova senha deve possuir ao menos 1 letra minúscula.
- A nova senha deve possuir ao menos 1 letra maiúscula.
- A nova senha e a confirmação da nova senha devem possuir o mesmo valor para que a alteração seja concluída.
- Após a redefinição bem-sucedida, o usuário deve receber uma confirmação de que sua senha foi alterada.
- Após a alteração da senha, o usuário deve ser direcionado para a tela de login.

## Campos interagíveis

- Campo de texto preenchível para e-mail.
- Botão para solicitar recuperação de senha.
- Hipertexto para retornar à tela de login.
- Campo de texto preenchível para nova senha.
- Campo de texto preenchível para confirmação da nova senha.
- Botão para confirmar a alteração da senha.
- Botões para visualizar/esconder a senha.

## Critérios de aceite

### Seção de solicitação de recuperação

#### a. Campo para preenchimento do e-mail

- Deve haver um campo preenchível para que o usuário informe seu e-mail.
- O campo deve possuir um placeholder especificando o que deve ser colocado: usuario@email.com.
- Deve possuir um pequeno título acima do campo escrito "E-mail".
- O campo deve validar se o formato informado corresponde a um endereço de e-mail válido.
- Caso o campo esteja vazio, o sistema não deve permitir o envio da solicitação.

#### b. Botão de confirmação "Recuperar senha"

- Um botão deve estar presente abaixo do campo de e-mail.
- Esse botão deve ter a função de validar o e-mail informado e iniciar o processo de recuperação.
- Quando o botão for pressionado e entrar em estado de processamento, ele deve ficar desabilitado para evitar múltiplas solicitações.
- Caso o e-mail informado esteja cadastrado, o sistema deve enviar uma mensagem/link de recuperação para o e-mail informado.
- Caso o e-mail informado não esteja cadastrado, o sistema não deve informar diretamente que não existe uma conta associada ao endereço.
- Após a solicitação, o sistema deve apresentar uma mensagem informando que, caso o e-mail esteja cadastrado, as instruções de recuperação foram enviadas para o endereço informado.

### Hipertexto de "Voltar para o login"

#### a. Campo de hipertexto para retornar ao login

- O campo deve ser textual.
- Ao passar o mouse por cima (hover), deve alterar sua cor para uma mais chamativa.
- Ao clicar nesse campo, o usuário deve ser redirecionado para a tela de login.

### Seção de criação da nova senha

#### a. Acesso através do link de recuperação

- Ao acessar um link de recuperação válido, o usuário deve ser direcionado para a tela de criação da nova senha.
- Caso o link esteja expirado, o sistema não deve permitir a alteração da senha.
- Caso o link já tenha sido utilizado, o sistema não deve permitir uma nova alteração da senha através do mesmo link.
- Caso o link esteja expirado, o sistema deve apresentar uma mensagem informando "O link de recuperação expirou".
- Caso o link já tenha sido utilizado, o sistema deve apresentar uma mensagem informando "O link de recuperação já foi utilizado".
- Caso o link seja inválido ou não possa ser validado, o sistema deve informar que não foi possível validar o link de recuperação.

#### b. Campo para preenchimento da nova senha

- Deve haver um campo preenchível para que o usuário informe sua nova senha.
- Por padrão, as letras, símbolos e números devem permanecer ocultos na forma de pontos pretos.
- Deve possuir um placeholder especificando o que deve ser colocado: Nova senha.
- Deve possuir um pequeno título acima do campo escrito "Nova senha".
- A senha deve possuir no mínimo 8 caracteres.
- A senha deve possuir ao menos 1 número.
- A senha deve possuir ao menos 1 letra minúscula.
- A senha deve possuir ao menos 1 letra maiúscula.

#### c. Exigências da nova senha

- O sistema deve apresentar as exigências necessárias para a criação da nova senha.
- A senha deve possuir no mínimo 8 caracteres.
- A senha deve possuir ao menos 1 número.
- A senha deve possuir ao menos 1 letra minúscula.
- A senha deve possuir ao menos 1 letra maiúscula.
- O sistema deve verificar as exigências da senha antes de permitir a conclusão da redefinição.
- Caso uma ou mais exigências não sejam atendidas, o sistema deve informar ao usuário quais exigências ainda não foram cumpridas.

#### d. Campo para confirmação da nova senha

- Deve haver um segundo campo preenchível para confirmação da nova senha.
- Por padrão, as letras, símbolos e números devem permanecer ocultos na forma de pontos pretos.
- Deve possuir um placeholder especificando o que deve ser colocado: Confirmar nova senha.
- Deve possuir um pequeno título acima do campo escrito "Confirmar nova senha".
- O sistema deve comparar o conteúdo dos dois campos.
- Caso os campos possuam valores diferentes, o sistema deve informar que as senhas não coincidem.

#### e. Botão para visualizar/esconder senha

- Deve haver, dentro dos campos de senha, um botão com formato de olho.
- Esse botão, ao ser pressionado, deve permitir a visualização da senha em formato padrão.
- Caso o texto já esteja visível, ao pressionar o ícone, o texto deve voltar a ser ocultado por pontos pretos.
- O comportamento deve estar disponível tanto para o campo de nova senha quanto para o campo de confirmação da nova senha.

#### f. Botão de confirmação "Redefinir senha"

- Um botão deve estar presente abaixo dos campos de nova senha e confirmação.
- Esse botão deve ter a função de validar as informações recebidas e confirmar a alteração da senha.
- Caso um dos campos esteja vazio, o botão deve permanecer desabilitado.
- Caso as senhas sejam diferentes, o botão deve permanecer desabilitado.
- Caso a nova senha não atenda a todas as exigências, o botão deve permanecer desabilitado.
- Quando o botão for pressionado e entrar em estado de processamento, ele deve ficar desabilitado para impedir múltiplos envios.
- Caso todas as informações estejam corretas, a nova senha deve ser registrada no sistema.
- Após a alteração bem-sucedida, o usuário deve receber uma mensagem informando "Senha redefinida com sucesso".
- Após a conclusão da redefinição, o link utilizado deve deixar de ser válido.
- Após a conclusão da redefinição, o usuário deve ser direcionado para a tela de login.

## Mensagens de erro e validação

- Caso o e-mail esteja vazio, deve ser apresentada uma mensagem informando que o campo é obrigatório.
- Caso o e-mail esteja em formato inválido, deve ser apresentada uma mensagem informando que o e-mail informado é inválido.
- Caso o e-mail não esteja cadastrado, o sistema não deve informar diretamente que não existe uma conta associada ao endereço.
- Caso as senhas não sejam iguais, deve ser apresentada uma mensagem informando "As senhas não coincidem".
- Caso a nova senha não atenda aos requisitos mínimos, deve ser apresentada uma mensagem informando quais requisitos precisam ser corrigidos.
- Caso o link de recuperação esteja expirado, deve ser apresentada uma mensagem informando "O link de recuperação expirou".
- Caso o link de recuperação já tenha sido utilizado, deve ser apresentada uma mensagem informando "O link de recuperação já foi utilizado".
- Caso o link de recuperação seja inválido, deve ser apresentada uma mensagem informando que não foi possível validar o link de recuperação.
- Caso ocorra um erro durante o processo de recuperação ou alteração, o usuário deve receber uma mensagem informando que não foi possível concluir a operação e poderá tentar novamente.

# HU004 - Criação de Perfil

Como: Usuário

Quero: Ser capaz de criar meu perfil ao acessar a plataforma pela primeira vez

Para que: Eu consiga cadastrar minhas principais informações pessoais e acadêmicas e personalizar meu perfil antes de utilizar a plataforma.

## Dependências Técnicas:

- O usuário deve estar cadastrado no sistema.
- O usuário deve estar autenticado no sistema.
- O sistema deverá possuir conexão ativa com a Internet.
- O sistema deverá disponibilizar uma tela específica para criação do perfil.
- O sistema deverá permitir o cadastro de um nome.
- O sistema deverá permitir a definição do username, apresentado com o caractere @ no início.
- O sistema deverá verificar a disponibilidade do username informado.
- O sistema deverá possuir uma lista de cursos disponíveis para seleção.
- O sistema deverá possuir uma lista de faculdades disponíveis para seleção.
- O sistema deverá permitir a seleção de disciplinas nas quais o usuário possui dificuldade.
- O sistema deverá permitir a seleção de disciplinas nas quais o usuário possui domínio.
- O sistema deverá permitir o cadastro de uma biografia.
- O sistema deverá permitir o cadastro de uma foto de perfil.
- O sistema deverá permitir o cadastro de informações relacionadas ao trabalho.
- O sistema deverá permitir o cadastro da instituição na qual o usuário trabalha.
- O sistema deverá permitir o cadastro de links de redes sociais.
- O sistema deverá permitir que o usuário pule os campos opcionais sem impedir a criação do perfil.
- O sistema deverá validar os dados obrigatórios antes da criação do perfil.
- O sistema deverá permitir o salvamento das informações preenchidas.
- O sistema deverá impedir a conclusão da criação enquanto algum campo obrigatório estiver inválido ou não preenchido.
- O funcionamento da criação do perfil dependerá de uma conexão ativa com a Internet.

## Regras de Negócio:

- O usuário deverá criar seu perfil antes de utilizar integralmente a plataforma.
- A criação do perfil deverá ocorrer somente para o usuário autenticado.
- A definição do Nome e do username serão etapas obrigatórias e não poderão ser puladas.
- Caso o usuário autenticado ainda não possua Nome e username definidos, o sistema deverá direcioná-lo para a tela de criação de perfil a cada acesso, até que a criação seja concluída.
- O Nome poderá ser alterado posteriormente na edição do perfil (HU010.1).
- O username poderá ser alterado posteriormente nas informações de conta (HU012.1).
- O nome deverá ser obrigatório.
- O username deverá ser obrigatório.
- O username deverá ser apresentado com o caractere @ no início.
- O username deverá aceitar somente letras minúsculas e números, sem símbolos especiais, espaços ou letras maiúsculas.
- O username deverá ser único na plataforma.
- O username deverá seguir as regras de formato definidas pelo sistema.
- O curso que o usuário estuda é opcional.
- O curso deverá ser selecionado a partir da lista disponibilizada pelo sistema.
- A faculdade que o usuário estuda é opcional.
- A faculdade deverá ser selecionada a partir da lista disponibilizada pelo sistema.
- A foto de perfil será opcional.
- A biografia será opcional.
- As disciplinas nas quais o usuário possui dificuldade serão opcionais.
- As disciplinas nas quais o usuário possui domínio serão opcionais.
- O trabalho será opcional.
- A instituição de trabalho será opcional.
- Os links das redes sociais serão opcionais.
- O usuário poderá não preencher nenhum dos campos opcionais.
- O usuário deverá conseguir pular os campos opcionais durante a criação do perfil.
- Pular um campo opcional não deverá impedir a conclusão da criação do perfil.
- O usuário deverá conseguir retornar posteriormente à tela de edição para preencher ou alterar informações opcionais.
- As informações preenchidas durante a criação deverão ser armazenadas no perfil do usuário após a conclusão.
- Os campos obrigatórios deverão ser validados antes da conclusão da criação.
- Caso todos os campos obrigatórios estejam válidos, o sistema deverá permitir a criação do perfil mesmo que os campos opcionais estejam vazios.
- A criação do perfil não deverá permitir o preenchimento de informações inválidas.
- A criação do perfil deverá utilizar as mesmas regras de validação aplicáveis aos respectivos campos da edição do perfil, quando compatíveis.
- As informações cadastradas nesta etapa deverão estar disponíveis posteriormente na visualização do próprio perfil.

## Campos interagíveis

### Tela de Criação do Perfil:

- Nome: Permite definir o nome de exibição do perfil.
- @: Permite definir o username do usuário, apresentado com o caractere @ no início.
- Foto de perfil: Permite selecionar uma imagem para o perfil.
- Biografia: Permite informar uma descrição sobre o usuário.
- Curso: Permite selecionar o curso que o usuário estuda.
- Faculdade: Permite selecionar a faculdade que o usuário estuda.
- Disciplinas que tem dificuldade: Permite selecionar as disciplinas nas quais o usuário possui dificuldade.
- Disciplinas que tem domínio: Permite selecionar as disciplinas nas quais o usuário possui domínio.
- Trabalho: Permite informar o trabalho do usuário.
- Instituição de trabalho: Permite informar a instituição na qual o usuário trabalha.
- Links das redes sociais: Permite informar os links das redes sociais do usuário.
- Ação de pular: Permite continuar a criação sem preencher um campo opcional.
- Botão de concluir: Permite finalizar a criação do perfil após a validação dos campos obrigatórios.

## Critérios de aceite

### Abertura da Criação de Perfil

#### a. Acesso à tela

- Após o primeiro acesso à plataforma, caso o usuário ainda não possua um perfil criado, o sistema deverá direcioná-lo para a tela de criação de perfil.
- O sistema deverá direcionar para a tela de criação de perfil o usuário que concluiu o cadastro por e-mail e senha, o usuário que acessou pela primeira vez com a conta Google e o usuário que realizou login sem possuir Nome e username definidos.
- O usuário não deverá conseguir acessar o feed ou as demais funcionalidades da plataforma enquanto não definir o Nome e o username.
- O sistema deverá identificar que o usuário ainda não concluiu a criação do perfil.
- A tela deverá apresentar os campos necessários para a criação inicial do perfil.
- O usuário deverá conseguir preencher os campos obrigatórios e opcionais disponíveis.
- O usuário não deverá conseguir concluir a criação enquanto os campos obrigatórios não estiverem preenchidos corretamente.

### Nome

#### a. Definição do nome

- O sistema deverá permitir a criação de um Nome para o perfil do usuário.
- O Nome deverá ser obrigatório.
- Deverá ter um limite de 25 caracteres.
- Poderá conter qualquer texto, dentro do limite de caracteres.
- Não precisa ser único.
- Não poderá ser pulado durante a criação do perfil.

### Username

#### a. Definição do username

- O sistema deverá apresentar um campo para definição do username.
- O usuário deverá informar um username para criar o perfil.
- O username deverá ser obrigatório.
- O username deverá ser apresentado com o caractere @ no início, sem que o @ seja digitado como parte do valor.
- O username deverá aceitar somente letras minúsculas e números.
- O username não deverá aceitar símbolos especiais, espaços ou letras maiúsculas.
- O username não poderá ser pulado durante a criação do perfil.
- O username deverá seguir o formato definido para a plataforma.
- O username deverá possuir disponibilidade única na plataforma.
- O sistema deverá verificar se o username informado está disponível.
- O username deverá ser salvo como parte da identificação do perfil após a conclusão.

#### b. Disponibilidade do username

- Caso o username informado esteja disponível, o sistema deverá permitir sua utilização.
- Caso o username informado já esteja sendo utilizado por outro usuário, o sistema deverá informar que o username não está disponível.
- O sistema não deverá permitir a conclusão da criação enquanto o username obrigatório estiver indisponível.
- O usuário deverá conseguir alterar o username informado e realizar uma nova tentativa.

#### c. Username inválido

- Caso o username não atenda às regras de formato, o sistema deverá informar que o username informado é inválido.
- O sistema não deverá permitir a conclusão da criação enquanto o username for inválido.
- O usuário deverá conseguir corrigir o username informado.

### Foto de Perfil

#### a. Cadastro da foto

- O usuário deverá possuir uma opção para adicionar uma foto de perfil.
- A foto de perfil será opcional.
- O usuário poderá continuar a criação sem adicionar uma foto.
- Caso uma foto seja selecionada, o sistema deverá validar o arquivo conforme os requisitos definidos pela plataforma.
- A foto selecionada deverá ser associada ao perfil após a conclusão da criação.

#### b. Ausência de foto

- Caso o usuário não selecione uma foto, o sistema deverá permitir a conclusão da criação.
- O perfil deverá utilizar a representação padrão definida para usuários sem foto.

### Biografia

#### a. Cadastro da biografia

- O usuário deverá possuir um campo para informar sua biografia.
- A biografia será opcional.
- O usuário poderá continuar a criação sem informar uma biografia.
- Caso o usuário informe uma biografia, o conteúdo deverá respeitar o limite definido pela plataforma.
- A biografia preenchida deverá ser armazenada no perfil após a conclusão.

#### b. Ausência de biografia

- Caso o usuário não informe uma biografia, o sistema deverá permitir a conclusão da criação.
- A ausência de biografia não deverá impedir a criação do perfil.

### Curso

#### a. Seleção do curso

- O sistema deverá apresentar uma lista de cursos disponíveis.
- O usuário poderá selecionar o curso que estuda.
- O usuário deverá conseguir abrir a lista de cursos.
- O usuário deverá conseguir selecionar uma opção disponível.
- O sistema deverá armazenar o curso selecionado no perfil.
- O usuário poderá selecionar o curso

### Faculdade

#### a. Seleção da faculdade

- O sistema deverá apresentar uma lista de faculdades disponíveis.
- O usuário poderá selecionar a faculdade que estuda.
- O usuário deverá conseguir abrir a lista de faculdades.
- O usuário deverá conseguir selecionar uma opção disponível.
- O sistema deverá armazenar a faculdade selecionada no perfil.
- O usuário não deverá conseguir concluir a criação sem selecionar uma faculdade válida.

### Disciplinas

#### a. Disciplinas que tem dificuldade

- O sistema deverá disponibilizar uma forma de selecionar as disciplinas nas quais o usuário possui dificuldade.
- O preenchimento das disciplinas de dificuldade será opcional.
- O usuário poderá selecionar nenhuma, uma ou várias disciplinas.
- O usuário poderá pular o preenchimento das disciplinas de dificuldade.
- Caso o usuário selecione disciplinas, elas deverão ser armazenadas no perfil após a conclusão.
- As disciplinas selecionadas deverão ser apresentadas separadamente das disciplinas de domínio.

#### b. Disciplinas que tem domínio

- O sistema deverá disponibilizar uma forma de selecionar as disciplinas nas quais o usuário possui domínio.
- O preenchimento das disciplinas de domínio será opcional.
- O usuário poderá selecionar nenhuma, uma ou várias disciplinas.
- O usuário poderá pular o preenchimento das disciplinas de domínio.
- Caso o usuário selecione disciplinas, elas deverão ser armazenadas no perfil após a conclusão.
- As disciplinas selecionadas deverão ser apresentadas separadamente das disciplinas de dificuldade.

#### c. Ausência de disciplinas

- Caso o usuário não selecione nenhuma disciplina, o sistema deverá permitir a conclusão da criação.
- A ausência de disciplinas não deverá impedir o acesso à plataforma.
- O usuário deverá conseguir cadastrar as disciplinas posteriormente por meio da edição do perfil.

### Trabalho

#### a. Cadastro do trabalho

- O usuário deverá possuir um campo para informar seu trabalho.
- O preenchimento do trabalho será opcional.
- O usuário poderá informar seu trabalho caso possua.
- O usuário poderá deixar o campo vazio.
- O usuário deverá conseguir pular o campo.
- Caso preenchido, o trabalho deverá ser armazenado no perfil após a conclusão.

#### b. Ausência de trabalho

- Caso o usuário não possua trabalho ou não queira informar essa informação, o campo poderá permanecer vazio.
- A ausência de trabalho não deverá impedir a conclusão da criação do perfil.

### Instituição de Trabalho

#### a. Cadastro da instituição

- O usuário deverá possuir um campo para informar a instituição na qual trabalha.
- O preenchimento da instituição será opcional.
- O usuário poderá informar a instituição caso possua.
- O usuário poderá deixar o campo vazio.
- O usuário deverá conseguir pular o campo.
- Caso preenchida, a instituição deverá ser armazenada no perfil após a conclusão.

#### b. Ausência de instituição

- Caso o usuário não possua instituição de trabalho ou não queira informar essa informação, o campo poderá permanecer vazio.
- A ausência de instituição não deverá impedir a conclusão da criação do perfil.

### Links das Redes Sociais

#### a. Cadastro dos links

- O sistema deverá disponibilizar campos para cadastro de links de redes sociais.
- Os links das redes sociais serão opcionais.
- O usuário poderá cadastrar nenhuma, uma ou várias redes sociais.
- O sistema poderá disponibilizar campos para GitHub, LinkedIn, Instagram, X, Reddit ou outras redes sociais definidas pela plataforma.
- Cada link deverá ser associado à rede social correspondente.
- O usuário poderá pular o preenchimento dos links.
- Caso sejam preenchidos, os links deverão ser armazenados no perfil após a conclusão.

#### b. Validação dos links

- O sistema deverá validar os links informados conforme as regras definidas para a plataforma.
- Caso um link seja inválido, o sistema deverá informar que o endereço não é válido.
- O sistema não deverá permitir a conclusão enquanto existir um link inválido preenchido.
- O usuário deverá conseguir corrigir ou remover o link inválido.
- A ausência de links válidos não deverá impedir a conclusão da criação.

### Pular Campos Opcionais

#### a. Utilização da ação de pular

- O sistema deverá permitir que o usuário pule os campos opcionais.
- A ação de pular não deverá apagar informações obrigatórias já preenchidas.
- O usuário deverá conseguir avançar sem preencher um campo opcional.
- O usuário deverá conseguir concluir a criação mesmo sem preencher os campos opcionais.
- A utilização da ação de pular não deverá ser considerada um erro.

#### b. Preenchimento posterior

- Após concluir a criação do perfil, o usuário deverá conseguir acessar a edição do perfil.
- O usuário deverá conseguir preencher posteriormente os campos opcionais que foram deixados vazios.
- O preenchimento posterior deverá seguir as regras definidas para a HU010.1.

### Conclusão da Criação

#### a. Validação

- Ao selecionar o botão de concluir, o sistema deverá validar os campos obrigatórios.
- O sistema deverá validar o nome.
- O sistema deverá validar o username.
- O sistema deverá validar o curso.
- O sistema deverá validar a faculdade.
- O sistema deverá validar os campos opcionais que tenham sido preenchidos.
- Caso todos os dados preenchidos sejam válidos, o sistema deverá permitir a conclusão.
- Caso exista algum campo inválido, o sistema deverá impedir a conclusão e indicar o campo que necessita de correção.

#### b. Salvamento

- Após a validação bem-sucedida, o sistema deverá salvar as informações preenchidas.
- O sistema deverá criar o perfil associado ao usuário autenticado.
- Os campos opcionais que não tenham sido preenchidos deverão permanecer sem informação.
- Os dados obrigatórios preenchidos deverão ser armazenados corretamente.
- Os dados opcionais preenchidos deverão ser armazenados corretamente.
- Após a criação bem-sucedida, o sistema deverá considerar o perfil como criado.

#### c. Finalização

- Após a criação do perfil, o sistema deverá permitir que o usuário prossiga para a plataforma, sendo direcionado para o feed (HU005).
- O sistema não deverá solicitar novamente a criação inicial do perfil enquanto o perfil estiver criado.
- As informações cadastradas deverão estar disponíveis na visualização do próprio perfil conforme definido na HU010.

## Mensagens de Erro e Validação

- Caso não exista conexão com a Internet, o sistema deverá informar ao usuário que não foi possível criar o perfil.
- Caso ocorra um erro ao carregar a lista de cursos, o sistema deverá informar que não foi possível carregar os cursos e permitir uma nova tentativa.
- Caso ocorra um erro ao carregar a lista de faculdades, o sistema deverá informar que não foi possível carregar as faculdades e permitir uma nova tentativa.
- Caso o nome não seja informado, o sistema deverá informar que o nome é obrigatório.
- Caso o nome ultrapasse o limite de 25 caracteres, o sistema deverá informar o limite definido e impedir a conclusão enquanto o conteúdo não for corrigido.
- Caso o username informado já esteja sendo utilizado, o sistema deverá informar que o username não está disponível.
- Caso o username informado seja inválido, o sistema deverá informar que o username não atende aos requisitos definidos.
- Caso uma foto selecionada não atenda aos requisitos definidos, o sistema deverá informar que a foto não é válida.
- Caso a biografia ultrapasse o limite permitido, o sistema deverá informar o limite definido e impedir o salvamento enquanto o conteúdo não for corrigido.
- Caso uma disciplina selecionada não esteja disponível para cadastro, o sistema deverá informar que a disciplina não pode ser selecionada.
- Caso um link de rede social seja inválido, o sistema deverá informar que o endereço não é válido.
- Caso ocorra um erro durante o salvamento, o sistema deverá informar que não foi possível criar o perfil e permitir uma nova tentativa.
- A ocorrência de um erro durante a criação não deverá excluir os dados já preenchidos pelo usuário, quando tecnicamente possível.
- O sistema não deverá considerar como erro o fato de o usuário pular campos opcionais.
- O sistema não deverá permitir a conclusão enquanto algum campo obrigatório estiver ausente ou inválido.

# HU005 - Página Inicial - Feed/Visualização, curtida e compartilhamento dos posts

Como: Usuário

Quero: Ser capaz de visualizar os posts publicados por outros alunos, curtir, compartilhar e filtrar os posts por TAG

Para que: Eu consiga acompanhar as dúvidas e conteúdos publicados por outros alunos, interagir com as publicações, compartilhar posts com outras pessoas e visualizar conteúdos relacionados aos assuntos de meu interesse.

## Regras de Negócio

- As publicações deverão estar relacionadas aos estudos e conteúdos do curso de Ciência da Computação.
- O usuário poderá visualizar as dúvidas e conteúdos publicados por outros alunos.
- As publicações deverão permanecer armazenadas no banco de dados para que possam ser visualizadas enquanto estiverem disponíveis no sistema.
- O funcionamento da visualização e das interações dependerá de uma conexão ativa com a Internet.
- O usuário poderá curtir uma publicação.
- Caso o usuário já tenha curtido uma publicação, poderá remover a curtida.
- O sistema deverá registrar a interação de curtida associada ao usuário e à publicação.
- O compartilhamento deverá permitir que o usuário copie o link da publicação para enviá-lo em outro aplicativo, como o WhatsApp.
- O link compartilhado deverá direcionar para a publicação correspondente, desde que ela ainda esteja disponível.
- O Feed deverá possuir um botão para criação de uma nova publicação.
- O botão de criação de publicação deverá direcionar o usuário para o fluxo de criação de post.
- O fluxo de criação, preenchimento e publicação do post não faz parte desta história e será especificado em uma história própria.
- O usuário poderá filtrar as publicações do Feed utilizando as TAGs associadas aos posts.
- O sistema deverá disponibilizar as TAGs existentes como opções de filtro.
- O usuário poderá selecionar uma ou mais TAGs para aplicar ao filtro.
- O usuário deverá possuir uma opção para selecionar todas as TAGs disponíveis.
- O usuário deverá possuir uma opção para desselecionar todas as TAGs selecionadas.
- A aplicação do filtro deverá apresentar apenas as publicações que possuam ao menos uma das TAGs selecionadas.
- Caso nenhuma TAG esteja selecionada, o sistema deverá apresentar as publicações sem aplicar filtro por TAG.

## Campos interagíveis

- Área de visualização dos posts.
- Botão de curtir.
- Botão de compartilhar.
- Botão para criação de post.
- Campo/área de acesso à visualização completa do post.
- Campo/área de acesso ao perfil do autor.
- Botão/área para abrir as opções de filtro por TAG.
- Opções de seleção das TAGs.
- Botão para selecionar todas as TAGs.
- Botão para desselecionar todas as TAGs.
- Botão para aplicar o filtro.
- Botão para limpar/remover o filtro.

## Critérios de aceite

### Seção de Feed

#### a. Visualização das publicações

- O sistema deverá apresentar no feed os posts publicados pelos usuários.
- Cada publicação deverá apresentar o usuário responsável pela publicação.
- Cada publicação deverá apresentar o Nome, a foto e o Username (@) do usuário responsável pela publicação.
- Cada publicação deverá apresentar o conteúdo relacionado à dúvida ou informação publicada.
- Cada publicação deverá apresentar a TAG ou matéria relacionada, quando houver.
- O usuário deverá conseguir visualizar as informações da publicação.
- O usuário deverá conseguir acessar a visualização completa da publicação.
- Caso ocorra um erro durante o carregamento do feed, o sistema deverá informar que não foi possível carregar as publicações e permitir que o usuário tente novamente.

#### b. Acesso ao perfil do autor

- A publicação deverá apresentar uma forma de acessar o perfil do usuário responsável pelo post.
- Ao selecionar o usuário, o sistema deverá direcionar para o perfil correspondente.
- O funcionamento e o conteúdo da tela de perfil não fazem parte desta história.

#### c. Botão de criação de post

- Deve haver um botão para criação de uma nova publicação no Feed.
- Ao selecionar esse botão, o usuário deverá ser direcionado para o fluxo de criação de post.
- Os campos, validações e comportamentos relacionados à criação e publicação do post não fazem parte desta história e deverão ser especificados em uma história própria.

### Seção de filtro por TAG

#### a. Acesso ao filtro

- Deve haver uma opção para abrir as opções de filtro por TAG.
- Ao abrir o filtro, o sistema deverá apresentar as TAGs disponíveis para seleção.
- As TAGs apresentadas deverão corresponder às TAGs disponíveis no sistema.

#### b. Seleção das TAGs

- O usuário deverá conseguir selecionar uma ou mais TAGs.
- As TAGs selecionadas deverão apresentar visualmente que estão ativas para o filtro.
- O usuário deverá conseguir desselecionar uma TAG previamente selecionada.
- O usuário deverá possuir uma opção "Selecionar todos".
- Ao selecionar "Selecionar todos", todas as TAGs disponíveis deverão ser selecionadas.
- O usuário deverá possuir uma opção "Desselecionar todos".
- Ao selecionar "Desselecionar todos", todas as TAGs deverão ser desselecionadas.

#### c. Aplicação do filtro

- Deve haver uma opção para aplicar as TAGs selecionadas como filtro.
- Ao aplicar o filtro, o Feed deverá apresentar apenas os posts que possuam ao menos uma das TAGs selecionadas.
- Caso mais de uma TAG seja selecionada, deverão ser apresentados os posts que possuam qualquer uma das TAGs selecionadas.
- O filtro aplicado deverá permanecer identificado visualmente enquanto estiver ativo.
- Caso nenhuma TAG esteja selecionada, o Feed deverá apresentar as publicações sem aplicar filtro por TAG.

#### d. Remoção do filtro

- Deve haver uma opção para limpar ou remover o filtro aplicado.
- Ao remover o filtro, o Feed deverá voltar a apresentar as publicações sem a filtragem por TAG.
- As TAGs previamente selecionadas deverão deixar de estar ativas após a remoção do filtro.

### Seção de visualização do Post

#### a. Visualização completa da publicação

- Ao selecionar uma publicação no feed, o sistema deverá permitir que o usuário visualize seu conteúdo completo.
- A visualização deverá apresentar as informações do autor da publicação.
- A visualização deverá apresentar o conteúdo completo da publicação.
- A visualização deverá apresentar a TAG ou matéria relacionada, quando houver.
- O usuário deverá conseguir acessar o perfil do autor da publicação.
- O usuário deverá conseguir realizar as interações disponíveis na publicação.

#### b. Botão de curtir

- Deve haver uma opção para o usuário curtir a publicação.
- Ao selecionar a opção de curtir, o sistema deverá registrar a interação do usuário com o post.
- O usuário deverá conseguir visualizar que realizou a interação com a publicação.
- Caso o usuário já tenha curtido a publicação, a opção deverá permitir remover a curtida.
- Ao remover a curtida, o sistema deverá atualizar o estado da publicação para indicar que o usuário não realizou mais essa interação.
- Caso ocorra um erro ao realizar ou remover uma curtida, o sistema deverá informar que não foi possível realizar a interação e permitir que o usuário tente novamente.

#### c. Botão de compartilhar

- Deve haver uma opção de compartilhamento para os posts.
- Ao selecionar a opção de compartilhamento, o sistema deverá permitir que o usuário copie o link da publicação.
- O link copiado deverá corresponder ao post selecionado.
- O usuário poderá utilizar o link copiado para enviar a publicação em outro aplicativo, como o "WhatsApp".
- Ao acessar um link de uma publicação que ainda esteja disponível, o sistema deverá direcionar o usuário para a visualização correspondente do post.
- Caso ocorra um erro ao gerar ou copiar o link de compartilhamento, o sistema deverá informar que não foi possível compartilhar a publicação e permitir que o usuário tente novamente.

### Seção de acesso à publicação

#### a. Acesso à visualização do post

- O usuário deverá conseguir selecionar uma publicação apresentada no feed.
- Ao selecionar a publicação, o sistema deverá ser direcionado para a visualização completa do post.
- Caso o post não esteja mais disponível, o sistema deverá informar que a publicação não pode ser visualizada.
- Caso o usuário tente acessar uma publicação por um link de compartilhamento e ela não esteja mais disponível, o sistema deverá informar que a publicação não pode ser encontrada.

## Mensagens de erro e validação

- Caso não exista conexão com a Internet, o sistema deverá informar ao usuário que não foi possível carregar as publicações ou realizar a interação.
- Caso ocorra um erro durante o carregamento do feed, o sistema deverá informar que não foi possível carregar as publicações e permitir que o usuário tente novamente.
- Caso ocorra um erro ao realizar ou remover uma curtida, o sistema deverá informar que não foi possível realizar a interação e permitir que o usuário tente novamente.
- Caso ocorra um erro ao gerar ou copiar o link de compartilhamento, o sistema deverá informar que não foi possível compartilhar a publicação e permitir que o usuário tente novamente.
- Caso ocorra um erro ao carregar as TAGs disponíveis para filtro, o sistema deverá informar que não foi possível carregar as opções de filtro e permitir que o usuário tente novamente.
- Caso ocorra um erro ao aplicar o filtro por TAG, o sistema deverá informar que não foi possível aplicar o filtro e permitir que o usuário tente novamente.
- Caso nenhum post possua alguma das TAGs selecionadas, o sistema deverá informar que não foram encontradas publicações para os filtros selecionados.
- Caso um post não esteja mais disponível, o sistema deverá informar que a publicação não pode ser visualizada.
- Caso o usuário tente acessar uma publicação por um link de compartilhamento e ela não esteja mais disponível, o sistema deverá informar que a publicação não pode ser encontrada.

# HU005.1 - Criação e alterações de Post (Criador)

Como: Usuário

Quero: Ser capaz de criar e excluir meus próprios posts

Para que: Eu consiga publicar dúvidas e conteúdos relacionados à Ciência da Computação, utilizando texto, imagens e TAGs para identificar os assuntos abordados.

## Regras de Negócio

- O usuário deve estar cadastrado e autenticado no sistema para criar ou excluir uma publicação.
- O usuário poderá criar uma publicação contendo texto, imagens e TAGs relacionadas ao conteúdo do post.
- O texto de uma publicação deve possuir no máximo 280 caracteres.
- Uma publicação poderá possuir no máximo 4 imagens.
- As imagens adicionadas à publicação devem ser compatíveis com os formatos aceitos pelo sistema.
- O usuário poderá adicionar uma ou mais TAGs à publicação.
- Uma publicação poderá possuir no máximo 3 TAGs.
- As TAGs deverão estar relacionadas às disciplinas, conteúdos acadêmicos ou à categoria "Outros" disponíveis no sistema.
- As TAGs deverão identificar os principais assuntos abordados na publicação.
- As TAGs deverão aparecer no topo da publicação, após as informações do autor e antes do conteúdo textual e das imagens.
- Todo post deve ter ao menos uma TAG.
- O usuário não poderá alterar o conteúdo de uma publicação após sua publicação.
- O usuário poderá excluir uma publicação criada por ele.
- O usuário não poderá excluir uma publicação criada por outro usuário.
- A exclusão de uma publicação deverá alterar o estado da publicação no sistema, impedindo sua visualização como uma publicação disponível.
- Ao excluir uma publicação, o sistema deverá solicitar uma confirmação antes de concluir a ação.
- Caso a exclusão seja confirmada, a publicação deverá ser removida da visualização dos usuários.
- O sistema deverá identificar o autor, a data de criação e as TAGs associadas à publicação.

## Campos interagíveis

- Campo de texto para preenchimento do conteúdo do post.
- Campo para adicionar TAGs.
- Campo para seleção das TAGs disponíveis.
- Área de visualização das TAGs selecionadas.
- Campo para adicionar imagens.
- Área de visualização das imagens adicionadas.
- Botão para remover imagem antes da publicação.
- Botão para remover TAG antes da publicação.
- Botão para publicar o post.
- Botão para excluir o post.
- Botão para cancelar a criação do post.
- Botão para confirmar a exclusão do post.

## Critérios de aceite

### Seção de criação do Post

#### a. Campo para preenchimento do conteúdo

- Deve haver um campo de texto preenchível para que o usuário escreva o conteúdo da publicação.
- O campo deve permitir no máximo 280 caracteres.
- O sistema deve apresentar ao usuário a quantidade de caracteres utilizados e/ou restantes.
- Caso o usuário tente ultrapassar o limite de 280 caracteres, o sistema não deve permitir que caracteres adicionais sejam inseridos.
- O campo poderá ser preenchido com texto durante a criação da publicação.
- O conteúdo informado deverá ser utilizado como conteúdo textual da publicação.

#### b. Contagem de caracteres

- O sistema deverá informar a quantidade de caracteres utilizada durante o preenchimento do post.
- A contagem deverá ser atualizada conforme o usuário inserir ou remover caracteres.
- O limite máximo deverá ser de 280 caracteres.
- Caso o usuário atinja o limite máximo, o sistema deverá informar que o limite de caracteres foi atingido.

### Seção de TAGs

#### a. Adição de TAGs

- Deve haver uma opção para adicionar TAGs à publicação.
- O sistema deverá disponibilizar TAGs relacionadas às disciplinas e conteúdos acadêmicos da universidade.
- O usuário deverá conseguir selecionar uma ou mais TAGs para associar ao post.
- Uma publicação poderá possuir no máximo 3 TAGs.
- As TAGs deverão representar o assunto ou conteúdo abordado na publicação.
- Exemplos de TAGs disponíveis incluem "Construção e Análise de Algoritmos", "Outros" e "Álgebra Linear".
- As TAGs selecionadas deverão ser associadas à publicação no momento da criação.
- Caso o usuário tente adicionar uma quarta TAG, o sistema deverá impedir a adição.

#### b. Exibição das TAGs

- As TAGs associadas à publicação deverão aparecer no topo do post.
- As TAGs deverão aparecer após as informações do autor da publicação, como foto, nome, username e data de criação.
- As TAGs deverão aparecer antes do conteúdo textual e das imagens da publicação.
- Cada TAG deverá ser visualmente identificável como um marcador do assunto abordado no post.
- Caso mais de uma TAG seja adicionada, todas as TAGs selecionadas deverão ser apresentadas na publicação.

#### c. Remoção de TAGs antes da publicação

- O usuário deverá conseguir remover uma TAG antes de publicar o post.
- Ao remover uma TAG, ela não deverá mais ser associada à publicação.
- O usuário deverá conseguir adicionar novamente uma TAG removida, caso necessário.

### Seção de adição de imagens

#### a. Adição de imagens

- Deve haver uma opção para adicionar imagens à publicação.
- O usuário poderá adicionar imagens armazenadas em seu dispositivo.
- Uma publicação poderá possuir no máximo 4 imagens.
- O sistema deverá permitir a visualização das imagens adicionadas antes da publicação.
- Caso o usuário tente adicionar uma quinta imagem, o sistema deverá impedir a adição e informar que o limite máximo de 4 imagens foi atingido.

#### b. Visualização das imagens

- As imagens adicionadas deverão ser apresentadas em uma área de pré-visualização.
- O usuário deverá conseguir identificar quais imagens foram adicionadas à publicação.
- As imagens deverão ser apresentadas na publicação após o conteúdo textual.

#### c. Remoção de imagens antes da publicação

- O usuário deverá conseguir remover uma imagem adicionada antes de publicar o post.
- Ao remover uma imagem, ela deverá deixar de fazer parte da publicação.
- A remoção de uma imagem deverá liberar novamente uma das 4 posições disponíveis para outra imagem.

### Seção de publicação

#### a. Botão de publicação

- Deve haver um botão para confirmar a criação da publicação.
- O botão deverá validar as informações preenchidas antes de concluir a publicação.
- Caso o conteúdo textual esteja vazio e nenhuma imagem tenha sido adicionada, o sistema não deverá permitir a publicação.
- Caso nenhuma TAG tenha sido adicionada, o sistema não deverá permitir a publicação.
- Quando o botão for pressionado e entrar em estado de processamento, ele deverá ficar desabilitado para impedir múltiplos envios.
- Caso todas as informações estejam corretas, a publicação deverá ser registrada no sistema.
- Após a publicação ser concluída com sucesso, o usuário deverá receber uma confirmação de que o post foi publicado.
- A publicação criada deverá apresentar as informações do autor, as TAGs, o conteúdo e as imagens adicionadas.

### Seção de exclusão do Post

#### a. Botão de exclusão

- Deve haver uma opção para excluir uma publicação criada pelo próprio usuário.
- A opção de exclusão não deverá estar disponível para publicações criadas por outros usuários.
- Ao selecionar a opção de exclusão, o sistema deverá solicitar uma confirmação antes de concluir a ação.

#### b. Confirmação de exclusão

- Deve haver uma opção para confirmar a exclusão da publicação.
- Deve haver uma opção para cancelar a exclusão da publicação.
- Caso o usuário confirme a exclusão, o sistema deverá alterar o estado da publicação para excluída.
- A publicação excluída não deverá permanecer disponível para visualização no feed.
- A publicação excluída não deverá poder ser acessada através de seu link de compartilhamento.
- Após a exclusão, o usuário deverá receber uma mensagem informando "Post excluído com sucesso".
- Caso o usuário cancele a exclusão, nenhuma alteração deverá ser realizada na publicação.

#### c. Alteração de estado da publicação

- A exclusão deverá alterar o estado da publicação no sistema.
- O sistema deverá manter o registro da publicação como excluída, quando necessário para controle interno.
- Uma publicação excluída não deverá ser apresentada como publicação disponível aos usuários.
- O conteúdo de uma publicação publicada não poderá ser alterado pelo usuário.
- Após a publicação, o usuário não poderá alterar o texto, as TAGs ou as imagens associadas ao post.

### Seção de cancelamento da criação

#### a. Botão de cancelar

- Deve haver uma opção para cancelar a criação do post.
- Ao cancelar, o sistema não deverá publicar nem salvar a publicação que ainda não tenha sido confirmada.
- Caso existam informações preenchidas no post, o sistema poderá solicitar uma confirmação antes de sair da tela.

### Seção de Curtida

#### a. Botão de curtir

- Deve haver uma opção para o usuário curtir a publicação.
- Ao selecionar o botão de curtir, o sistema deverá registrar a interação do usuário com a publicação.
- O botão deverá apresentar visualmente que a publicação foi curtida pelo usuário.
- Caso o usuário já tenha curtido a publicação, o botão deverá permitir remover a curtida.
- Ao remover a curtida, o sistema deverá atualizar o estado da publicação para indicar que o usuário não realizou mais essa interação.
- Caso ocorra um erro ao realizar ou remover a curtida, o sistema deverá informar que não foi possível realizar a interação e permitir que o usuário tente novamente.

## Mensagens de erro e validação

- Caso o post não tenha nenhuma TAG colocada no momento da criação, esta deve ser impedida e uma mensagem de "Informe ao menos uma TAG antes de continuar" deve ser exibida.
- Caso o usuário tente adicionar uma quarta TAG, o sistema deverá impedir a adição e informar "O limite máximo de 3 TAGs por publicação foi atingido".
- Caso o conteúdo textual esteja vazio e nenhuma imagem tenha sido adicionada, o sistema deverá informar que a publicação não pode ser criada sem conteúdo.
- Caso o usuário tente ultrapassar o limite de 280 caracteres, o sistema deverá informar que o limite máximo de caracteres foi atingido.
- Caso o usuário tente adicionar mais de 4 imagens, o sistema deverá informar "O limite máximo de 4 imagens por publicação foi atingido".
- Caso uma imagem não seja compatível com os formatos aceitos pelo sistema, o sistema deverá informar que a imagem não pode ser adicionada.
- Caso ocorra um erro durante o envio de uma imagem, o sistema deverá informar que não foi possível adicionar a imagem e permitir que o usuário tente novamente.
- Caso ocorra um erro durante a publicação, o sistema deverá informar que não foi possível publicar o post e permitir que o usuário tente novamente.
- Caso ocorra um erro durante a exclusão, o sistema deverá informar que não foi possível excluir o post e permitir que o usuário tente novamente.
- Caso o usuário tente excluir uma publicação que não esteja mais disponível, o sistema deverá informar que a publicação não pode ser encontrada.
- Caso o usuário tente realizar uma ação de alteração de conteúdo em uma publicação já publicada, o sistema não deverá permitir a alteração.

# HU005.2 - Ações com o Post (Visualizador)

Como: Usuário

Quero: Ser capaz de visualizar, curtir, compartilhar e denunciar posts publicados por outros usuários

Para que: Eu consiga interagir com dúvidas e conteúdos publicados por outros alunos e informar ao sistema quando uma publicação estiver inadequada, incorreta ou em desacordo com as regras da plataforma.

## Regras de Negócio

- O usuário deve estar cadastrado e autenticado no sistema para realizar interações com uma publicação.
- O usuário poderá visualizar publicações criadas por outros usuários.
- O usuário poderá curtir ou remover a curtida de uma publicação.
- O usuário poderá compartilhar uma publicação através de seu link.
- O usuário poderá denunciar uma publicação criada por outro usuário.
- O usuário não poderá denunciar uma publicação criada por ele mesmo.
- Cada denúncia deverá estar associada à publicação, ao usuário que realizou a denúncia e ao motivo selecionado.
- O usuário deverá selecionar um motivo para realizar uma denúncia.
- O sistema deverá disponibilizar motivos de denúncia relacionados ao contexto acadêmico e ao funcionamento da plataforma.
- Uma mesma publicação poderá receber denúncias de diferentes usuários.
- O usuário não deverá conseguir enviar múltiplas denúncias com o mesmo motivo para a mesma publicação.
- A denúncia deverá ser registrada no sistema para posterior análise.
- O envio de uma denúncia não deverá excluir ou alterar automaticamente a publicação denunciada.
- Caso uma publicação seja removida posteriormente, ela não deverá permanecer disponível para visualização.
- O link de uma publicação somente deverá permitir sua visualização enquanto a publicação estiver disponível no sistema.

## Campos interagíveis

- Área de visualização da publicação.
- Campo/área de acesso ao perfil do autor.
- Botão de curtir.
- Botão de compartilhar.
- Botão de denunciar.
- Campo de seleção do motivo da denúncia.
- Campo de texto para informações adicionais da denúncia.
- Botão para confirmar denúncia.
- Botão para cancelar denúncia.

## Critérios de aceite

### Seção de visualização do Post

#### a. Informações da publicação

- Ao selecionar uma publicação, o sistema deverá permitir que o usuário visualize seu conteúdo completo.
- A publicação deverá apresentar as informações do autor, incluindo foto, nome, username e data de criação.
- As TAGs associadas à publicação deverão ser apresentadas após as informações do autor e antes do conteúdo da publicação.
- O conteúdo textual da publicação deverá ser apresentado integralmente, respeitando o limite definido para sua criação.
- As imagens associadas à publicação deverão ser apresentadas ao usuário.
- O usuário deverá conseguir identificar as TAGs relacionadas ao assunto da publicação.
- O usuário deverá conseguir acessar o perfil do autor da publicação.
- O funcionamento e o conteúdo da tela de perfil não fazem parte desta história.

#### b. Acesso ao perfil do autor

- Deve haver uma forma de acessar o perfil do usuário responsável pela publicação.
- Ao selecionar o nome, foto ou username do autor, o sistema deverá direcionar o usuário para o perfil correspondente.
- O usuário não deverá ser direcionado para a tela de criação ou alteração do post ao acessar o autor.

### Seção de Curtida

#### a. Botão de curtir

- Deve haver uma opção para o usuário curtir a publicação.
- Ao selecionar o botão de curtir, o sistema deverá registrar a interação do usuário com a publicação.
- O botão deverá apresentar visualmente que a publicação foi curtida pelo usuário.
- Caso o usuário já tenha curtido a publicação, o botão deverá permitir remover a curtida.
- Ao remover a curtida, o sistema deverá atualizar o estado da publicação para indicar que o usuário não realizou mais essa interação.
- Caso ocorra um erro ao realizar ou remover a curtida, o sistema deverá informar que não foi possível realizar a interação e permitir que o usuário tente novamente.

### Seção de Compartilhamento

#### a. Botão de compartilhar

- Deve haver uma opção de compartilhamento para a publicação.
- Ao selecionar o botão de compartilhar, o sistema deverá permitir que o usuário copie o link da publicação.
- O link copiado deverá corresponder à publicação selecionada.
- O usuário poderá utilizar o link copiado para enviar a publicação em outro aplicativo, como o "WhatsApp".
- Ao acessar um link de uma publicação que ainda esteja disponível, o sistema deverá direcionar o usuário para a visualização correspondente do post.
- Caso ocorra um erro ao gerar ou copiar o link, o sistema deverá informar que não foi possível compartilhar a publicação e permitir que o usuário tente novamente.

### Seção de Denúncia da Publicação

#### a. Botão de denúncia

- Deve haver um botão ou opção para denunciar a publicação.
- A opção de denúncia deverá estar disponível para publicações criadas por outros usuários.
- A opção de denúncia não deverá estar disponível para publicações criadas pelo próprio usuário.
- Ao selecionar a opção de denúncia, o sistema deverá abrir uma área para seleção do motivo da denúncia.

#### b. Motivos de denúncia

- O sistema deverá apresentar uma lista de motivos que o usuário poderá selecionar.
- Os motivos de denúncia deverão incluir:

"Conteúdo inadequado ou ofensivo"
"TAG não corresponde ao conteúdo da publicação"
"Informação incorreta ou enganosa"
"Conteúdo duplicado ou repetitivo"
"Spam ou publicidade indevida"
"Assédio ou ataque a outro usuário"
"Conteúdo que viola as regras da plataforma"
"Outro"

- O usuário deverá selecionar pelo menos um motivo antes de enviar a denúncia.
- O motivo selecionado deverá ser associado à denúncia registrada no sistema.

#### c. Informações adicionais da denúncia

- Deve haver um campo opcional para que o usuário possa fornecer informações adicionais sobre o motivo da denúncia.
- O usuário poderá utilizar esse campo para explicar o problema identificado na publicação.
- Caso o motivo selecionado seja "Outro", o sistema poderá exigir que o usuário forneça uma descrição do motivo da denúncia.
- O conteúdo informado pelo usuário deverá ser associado à denúncia.

#### d. Confirmação da denúncia

- Deve haver um botão para confirmar o envio da denúncia.
- O botão deverá permanecer desabilitado enquanto nenhum motivo de denúncia tiver sido selecionado.
- Quando o botão for pressionado e entrar em estado de processamento, ele deverá ficar desabilitado para impedir múltiplos envios.
- Caso a denúncia seja registrada com sucesso, o usuário deverá receber uma mensagem informando "Denúncia enviada com sucesso".
- Após o envio bem-sucedido, o sistema deverá impedir que o usuário envie novamente uma denúncia com o mesmo motivo para a mesma publicação.
- O envio da denúncia não deverá remover automaticamente a publicação.

#### e. Cancelamento da denúncia

- Deve haver uma opção para cancelar o envio da denúncia.
- Ao cancelar, nenhuma denúncia deverá ser registrada.
- O usuário deverá retornar à visualização da publicação.

## Mensagens de erro e validação

- Caso o usuário tente denunciar uma publicação sem selecionar um motivo, o sistema deverá informar que é necessário selecionar um motivo para realizar a denúncia.
- Caso o usuário tente enviar uma denúncia duplicada com o mesmo motivo para a mesma publicação, o sistema deverá informar que essa denúncia já foi registrada.
- Caso ocorra um erro durante o envio da denúncia, o sistema deverá informar "Não foi possível enviar a denúncia. Tente novamente".
- Caso a publicação não esteja mais disponível, o sistema deverá informar que a publicação não pode ser visualizada.
- Caso o usuário tente acessar uma publicação removida por meio de seu link, o sistema deverá informar que a publicação não foi encontrada.
- Caso não exista conexão com a Internet, o sistema deverá informar que não foi possível carregar a publicação ou realizar a interação e permitir que o usuário tente novamente.

# HU006 - Comentários e Respostas

Como: Usuário

Quero: Ser capaz de comentar em posts, responder comentários, curtir e denunciar comentários

Para que: Eu consiga interagir com as publicações de outros usuários, complementar informações, esclarecer dúvidas e participar das discussões do Companion.

## Regras de Negócio

- O usuário deve estar autenticado para realizar comentários, respostas, curtidas ou denúncias.
- Os comentários e respostas devem estar vinculados à publicação ou ao comentário correspondente.
- O usuário poderá comentar em publicações realizadas por outros usuários ou pelo próprio usuário.
- O usuário poderá responder a comentários e respostas existentes.
- As respostas deverão permanecer vinculadas ao comentário ou resposta ao qual foram direcionadas.
- Os comentários e respostas deverão estar relacionados ao conteúdo do post e à finalidade acadêmica do Companion.
- O usuário poderá curtir comentários e respostas.
- O usuário poderá remover uma curtida realizada anteriormente.
- O usuário poderá denunciar comentários ou respostas que considere inadequados ou que estejam em desacordo com a finalidade da plataforma.
- O usuário não poderá denunciar o próprio comentário ou resposta.
- Uma denúncia não deverá excluir automaticamente o conteúdo denunciado.
- As denúncias deverão ser registradas para posterior análise administrativa.
- O usuário não deverá conseguir realizar mais de uma denúncia para o mesmo comentário ou resposta.
- O usuário deverá poder acessar o perfil público do autor de um comentário ou resposta por meio de sua identificação, foto ou nome.
- A visualização e as funcionalidades da tela de perfil não fazem parte desta história de usuário.
- Comentários e respostas poderão ser excluídos pelo usuário que os criou.
- O usuário não poderá alterar o conteúdo de um comentário ou resposta após sua publicação.
- Quando um comentário ou resposta for excluído, seu conteúdo deverá ser substituído por uma indicação de que o comentário foi excluído, mantendo sua posição na estrutura de respostas.
- As respostas existentes a um comentário excluído deverão permanecer disponíveis e vinculadas à estrutura correspondente.
- As respostas deverão possuir uma estrutura hierárquica, na qual cada resposta deverá possuir um comentário ou resposta pai.
- Quando uma resposta não possuir um comentário ou resposta pai, ela deverá ser considerada um comentário diretamente vinculado ao post.
- A estrutura de respostas deverá permitir a visualização hierárquica das discussões.
- Caso existam respostas ocultadas por questões de organização da interface, o sistema deverá disponibilizar uma opção para visualizá-las.
- Quando o post principal estiver sendo visualizado diretamente, a sequência de comentários e respostas realizada pelo autor do post deverá possuir prioridade na ordenação da discussão, conforme as regras definidas para Threads.
- As funcionalidades específicas de criação, exclusão, respostas, Threads, curtidas e denúncias serão detalhadas nas respectivas sub-histórias.

## Campos interagíveis

- Campo de texto para preenchimento de comentário.
- Botão para publicar comentário.
- Botão para responder comentário ou resposta.
- Campo de texto para preenchimento de resposta.
- Botão para publicar resposta.
- Botão para curtir/descurtir comentário ou resposta.
- Indicador da quantidade de curtidas.
- Botão/opção para denunciar comentário ou resposta.
- Nome, foto ou identificação do autor do comentário ou resposta.
- Elemento interagível para acesso ao perfil do autor.
- Opção para visualizar respostas adicionais.
- Botão para excluir comentário ou resposta própria.

## Critérios de aceite

### Seção de Comentários

#### a. Exibição dos comentários

- O sistema deverá apresentar os comentários vinculados ao post correspondente.
- Cada comentário deverá apresentar o conteúdo publicado pelo usuário.
- Cada comentário deverá apresentar a identificação do usuário responsável pela publicação.
- Cada comentário deverá possuir as opções de interação disponíveis ao usuário conforme as regras do sistema.
- Os comentários deverão permanecer vinculados ao post correspondente.
- O usuário deverá conseguir acessar o perfil público do autor por meio da identificação apresentada.

### Seção de Respostas

#### a. Estrutura das respostas

- O sistema deverá permitir que um comentário ou resposta possua respostas vinculadas a ele.
- Cada resposta deverá possuir um comentário ou resposta pai.
- As respostas deverão ser apresentadas de forma visualmente hierárquica.
- As respostas deverão permanecer vinculadas ao elemento pai mesmo após sua exclusão.
- Caso existam respostas adicionais ocultadas pela interface, deverá existir uma opção "Ver mais respostas" ou equivalente para expandi-las.
- A estrutura deverá permitir respostas em diferentes níveis de profundidade.

### Seção de Curtidas

#### a. Interação com comentários e respostas

- O sistema deverá permitir que o usuário curta comentários e respostas.
- O sistema deverá permitir que o usuário remova uma curtida realizada anteriormente.
- Cada usuário deverá possuir no máximo uma curtida por comentário ou resposta.
- A quantidade de curtidas deverá ser atualizada conforme as interações realizadas.

### Seção de Denúncias

#### a. Denúncia de comentários e respostas

- O sistema deverá permitir que o usuário denuncie comentários ou respostas.
- O usuário não deverá conseguir denunciar seu próprio comentário ou resposta.
- O usuário não deverá conseguir registrar mais de uma denúncia para o mesmo conteúdo.
- A denúncia deverá ser registrada para posterior análise administrativa.
- A denúncia não deverá remover automaticamente o comentário ou resposta denunciado.
- Os motivos disponíveis para denúncia deverão ser apresentados ao usuário conforme as regras definidas para a plataforma.

### Seção de exclusão

#### a. Exclusão de comentários e respostas

- O usuário deverá conseguir excluir comentários e respostas criados por ele.
- O usuário não deverá conseguir excluir comentários ou respostas criados por outros usuários.
- O conteúdo publicado não poderá ser alterado após sua publicação.
- Ao excluir um comentário ou resposta, o sistema deverá manter sua posição na estrutura da discussão.
- O conteúdo excluído deverá ser substituído por uma indicação de que o comentário foi excluído.
- As respostas vinculadas ao conteúdo excluído deverão permanecer disponíveis.

### Seção de acesso ao perfil do usuário

#### a. Identificação do autor

- O nome, foto ou identificação do autor deverá ser um elemento interagível.
- Ao clicar na identificação do usuário, o sistema deverá direcionar para o perfil público correspondente.
- O usuário deverá conseguir retornar à tela anterior após acessar o perfil.
- A estrutura, os campos e as funcionalidades da tela de perfil não fazem parte desta história de usuário.

## Mensagens de erro e validação

- Caso ocorra um erro durante a publicação de um comentário ou resposta, o sistema deverá informar que não foi possível realizar a operação e permitir uma nova tentativa.
- Caso ocorra um erro durante o registro ou remoção de uma curtida, o sistema deverá informar que não foi possível concluir a operação e permitir uma nova tentativa.
- Caso o usuário tente denunciar o próprio comentário ou resposta, o sistema não deverá permitir a ação.
- Caso o usuário já tenha denunciado determinado comentário ou resposta, o sistema deverá informar que a denúncia já foi registrada.
- Caso ocorra um erro durante o envio de uma denúncia, o sistema deverá informar que não foi possível concluir a operação e permitir uma nova tentativa.
- Caso ocorra um erro durante a exclusão de um comentário ou resposta, o sistema deverá informar que não foi possível excluir o conteúdo e permitir uma nova tentativa.
- Caso o conteúdo solicitado não esteja mais disponível, o sistema deverá informar que o conteúdo não pode ser encontrado.

# HU006.1 - Criação e exclusão de Comentários

Como: Usuário

Quero: Ser capaz de criar e excluir meus próprios comentários em posts

Para que: Eu consiga complementar informações, esclarecer dúvidas e participar das discussões relacionadas às publicações do Companion.

## Regras de Negócio

- O usuário deve estar cadastrado e autenticado no sistema para criar ou excluir um comentário.
- O usuário poderá criar comentários em publicações realizadas por outros usuários ou pelo próprio usuário.
- O comentário deverá estar vinculado ao post correspondente.
- O comentário deverá estar relacionado ao conteúdo do post e à finalidade acadêmica do Companion.
- O conteúdo de um comentário deverá possuir no máximo 280 caracteres.
- O usuário não poderá alterar o conteúdo de um comentário após sua publicação.
- O usuário poderá excluir um comentário criado por ele.
- O usuário não poderá excluir um comentário criado por outro usuário.
- A exclusão de um comentário deverá alterar o estado do comentário no sistema, impedindo que seu conteúdo original permaneça disponível para visualização.
- Ao excluir um comentário, o sistema deverá solicitar uma confirmação antes de concluir a ação.
- Caso a exclusão seja confirmada, o conteúdo do comentário deverá ser substituído pela indicação "Este comentário foi excluído".
- O comentário excluído deverá permanecer na posição correspondente dentro da estrutura de comentários.
- As respostas existentes ao comentário excluído deverão permanecer disponíveis.
- O sistema deverá identificar o autor e a data de criação do comentário.

## Campos interagíveis

- Campo de texto para preenchimento do comentário.
- Indicador da quantidade de caracteres utilizados e/ou restantes.
- Botão para publicar o comentário.
- Botão para cancelar a criação do comentário.
- Botão para excluir o comentário.
- Botão para confirmar a exclusão do comentário.
- Botão para cancelar a exclusão do comentário.
- Nome, foto ou identificação do autor do comentário.
- Elemento interagível para acesso ao perfil do autor.

## Critérios de aceite

### Seção de criação do Comentário

#### a. Campo para preenchimento do comentário

- Deve haver um campo de texto preenchível para que o usuário escreva o conteúdo do comentário.
- O campo deve permitir no máximo 280 caracteres.
- O sistema deve apresentar ao usuário a quantidade de caracteres utilizados e/ou restantes.
- O campo poderá ser preenchido com texto durante a criação do comentário.
- Caso o usuário tente ultrapassar o limite de 280 caracteres, o sistema não deverá permitir que caracteres adicionais sejam inseridos.
- O comentário não poderá ser composto apenas por espaços em branco.

#### b. Contagem de caracteres

- O sistema deverá informar a quantidade de caracteres utilizada durante o preenchimento do comentário.
- A contagem deverá ser atualizada conforme o usuário inserir ou remover caracteres.
- O limite máximo deverá ser de 280 caracteres.
- Caso o usuário atinja o limite máximo, o sistema deverá informar que o limite de caracteres foi atingido.

#### c. Botão de confirmação "Comentar"

- Deve haver um botão para confirmar a criação do comentário.
- O botão deverá validar as informações preenchidas antes de concluir a publicação.
- Caso o campo esteja vazio ou contenha apenas espaços em branco, o sistema não deverá permitir a publicação.
- Quando o botão for pressionado e entrar em estado de processamento, ele deverá ficar desabilitado para impedir múltiplos envios.
- Caso todas as informações estejam corretas, o comentário deverá ser registrado no sistema.
- O comentário publicado deverá ser associado ao usuário responsável pela publicação e ao post correspondente.
- Após a publicação ser concluída com sucesso, o comentário deverá ser apresentado na área de comentários do post.

### Seção de cancelamento da criação

#### a. Botão de cancelar

- Deve haver uma opção para cancelar a criação do comentário.
- Ao cancelar, o sistema não deverá publicar nem salvar o comentário que ainda não tenha sido confirmado.
- Caso existam informações preenchidas no comentário, o sistema poderá solicitar uma confirmação antes de sair da criação.

### Seção de exibição do Comentário

#### a. Informações do comentário

- O comentário deverá apresentar o conteúdo publicado pelo usuário.
- O comentário deverá apresentar a identificação do autor, como foto, nome ou username.
- O comentário deverá apresentar a data de criação conforme o padrão definido pelo sistema.
- O comentário deverá permanecer vinculado ao post correspondente.
- A identificação do autor deverá permitir o acesso ao perfil público correspondente.
- A estrutura e as funcionalidades da tela de perfil não fazem parte desta história de usuário.

### Seção de exclusão do Comentário

#### a. Botão de exclusão

- Deve haver uma opção para excluir um comentário criado pelo próprio usuário.
- A opção de exclusão não deverá estar disponível para comentários criados por outros usuários.
- Ao selecionar a opção de exclusão, o sistema deverá solicitar uma confirmação antes de concluir a ação.

#### b. Confirmação de exclusão

- Deve haver uma opção para confirmar a exclusão do comentário.
- Deve haver uma opção para cancelar a exclusão do comentário.
- Caso o usuário confirme a exclusão, o sistema deverá alterar o estado do comentário para excluído.
- O comentário excluído deverá permanecer na posição correspondente dentro da estrutura de comentários.
- O conteúdo original do comentário deverá ser substituído pela indicação "Este comentário foi excluído".
- As respostas vinculadas ao comentário excluído deverão permanecer disponíveis.
- Após a exclusão, o usuário deverá receber uma mensagem informando "Comentário excluído com sucesso".
- Caso o usuário cancele a exclusão, nenhuma alteração deverá ser realizada no comentário.

#### c. Alteração de estado do comentário

- A exclusão deverá alterar o estado do comentário no sistema.
- O sistema deverá manter o registro do comentário como excluído, quando necessário para controle interno.
- Um comentário excluído não deverá apresentar seu conteúdo original aos usuários.
- O conteúdo de um comentário publicado não poderá ser alterado pelo usuário.
- Após a publicação, o usuário não poderá alterar o texto do comentário.

## Mensagens de erro e validação

- Caso o comentário esteja vazio, o sistema deverá informar que o comentário deve ser preenchido.
- Caso o comentário contenha apenas espaços em branco, o sistema deverá informar que o comentário deve possuir conteúdo válido.
- Caso o usuário tente ultrapassar o limite de 280 caracteres, o sistema deverá informar que o limite máximo de caracteres foi atingido.
- Caso ocorra um erro durante a publicação do comentário, o sistema deverá informar que não foi possível publicar o comentário e permitir que o usuário tente novamente.
- Caso ocorra um erro durante a exclusão do comentário, o sistema deverá informar que não foi possível excluir o comentário e permitir que o usuário tente novamente.
- Caso o usuário tente excluir um comentário que não esteja mais disponível, o sistema deverá informar que o comentário não pode ser encontrado.
- Caso o usuário tente realizar uma ação de alteração de conteúdo em um comentário já publicado, o sistema não deverá permitir a alteração.

# HU006.2 - Respostas e Threads

Como: Usuário

Quero: Ser capaz de responder comentários e respostas de outros usuários

Para que: Eu consiga participar das discussões dos posts, esclarecer dúvidas e acompanhar conversas organizadas em Threads.

## Regras de Negócio

- O usuário deve estar cadastrado e autenticado no sistema para criar ou visualizar respostas.
- O usuário poderá responder a um comentário existente.
- O usuário poderá responder a uma resposta existente.
- Cada resposta deverá possuir um comentário ou resposta pai.
- Uma resposta sem comentário ou resposta pai deverá ser considerada um comentário diretamente vinculado ao post.
- As respostas deverão permanecer vinculadas ao comentário ou resposta correspondente.
- As respostas deverão possuir uma estrutura hierárquica, formando uma árvore de respostas.
- O usuário poderá responder a comentários realizados por outros usuários ou pelo próprio usuário.
- O usuário poderá responder às próprias respostas.
- O conteúdo de uma resposta deverá possuir no máximo 280 caracteres.
- O usuário não poderá alterar o conteúdo de uma resposta após sua publicação.
- O usuário poderá excluir uma resposta criada por ele, conforme as regras definidas na HU006.1.
- Caso uma resposta seja excluída, ela deverá permanecer na estrutura da Thread e seu conteúdo deverá ser substituído pela indicação "Este comentário foi excluído".
- As respostas existentes abaixo de uma resposta excluída deverão permanecer disponíveis.
- Quando houver múltiplos níveis de respostas, o sistema poderá ocultar respostas mais profundas para manter a organização da interface.
- Caso existam respostas ocultadas, o sistema deverá disponibilizar uma opção "Ver mais respostas" ou equivalente para expandi-las.
- Quando o post principal estiver sendo visualizado diretamente, a sequência de comentários e respostas realizada pelo autor do post deverá possuir prioridade na ordenação da discussão.
- A prioridade da sequência do autor do post deverá ser aplicada somente à visualização direta do post principal.
- O usuário poderá selecionar um comentário ou resposta para visualizá-lo em uma tela focada.
- A visualização focada deverá apresentar o conteúdo selecionado em destaque e seu contexto dentro da Thread.
- Caso o conteúdo selecionado possua um comentário ou resposta pai, o sistema deverá apresentar sua relação com o elemento pai.
- As respostas vinculadas ao conteúdo selecionado deverão permanecer acessíveis a partir da visualização focada.
- O usuário deverá conseguir continuar navegando pela Thread a partir da visualização focada.
- O usuário deverá conseguir retornar à visualização anterior após acessar um comentário ou resposta em foco.
- Ao acessar uma resposta ou uma parte específica da Thread, o sistema deverá manter o contexto hierárquico da resposta selecionada.
- O sistema deverá identificar o autor e a data de criação de cada resposta.

## Campos interagíveis

- Botão para responder comentário ou resposta.
- Campo de texto para preenchimento da resposta.
- Indicador da quantidade de caracteres utilizados e/ou restantes.
- Botão para publicar a resposta.
- Botão para cancelar a criação da resposta.
- Botão para visualizar respostas adicionais.
- Elemento interagível para abrir comentário ou resposta em visualização focada.
- Nome, foto ou identificação do autor da resposta.
- Elemento interagível para acesso ao perfil do autor.
- Botão para excluir resposta própria.
- Botão para retornar à visualização anterior.

## Critérios de aceite

### Seção de criação de Resposta

#### a. Botão de "Responder"

- Deve haver uma opção para responder a cada comentário ou resposta disponível.
- Ao selecionar a opção de responder, o sistema deverá identificar o comentário ou resposta selecionado como elemento pai.
- O campo de preenchimento deverá ser apresentado de forma associada ao elemento selecionado.
- O usuário deverá conseguir identificar visualmente a qual comentário ou resposta sua resposta será direcionada.

#### b. Campo para preenchimento da resposta

- Deve haver um campo de texto preenchível para que o usuário escreva o conteúdo da resposta.
- O campo deve permitir no máximo 280 caracteres.
- O sistema deve apresentar ao usuário a quantidade de caracteres utilizados e/ou restantes.
- A resposta não poderá ser composta apenas por espaços em branco.
- Caso o usuário tente ultrapassar o limite de 280 caracteres, o sistema não deverá permitir que caracteres adicionais sejam inseridos.

#### c. Contagem de caracteres

- O sistema deverá informar a quantidade de caracteres utilizada durante o preenchimento da resposta.
- A contagem deverá ser atualizada conforme o usuário inserir ou remover caracteres.
- O limite máximo deverá ser de 280 caracteres.
- Caso o usuário atinja o limite máximo, o sistema deverá informar que o limite de caracteres foi atingido.

#### d. Botão de confirmação da resposta

- Deve haver um botão para confirmar a criação da resposta.
- O botão deverá validar as informações preenchidas antes de concluir a publicação.
- Caso o campo esteja vazio ou contenha apenas espaços em branco, o sistema não deverá permitir a publicação.
- Quando o botão for pressionado e entrar em estado de processamento, ele deverá ficar desabilitado para impedir múltiplos envios.
- Caso todas as informações estejam corretas, a resposta deverá ser registrada no sistema.
- A resposta deverá ser associada ao usuário responsável e ao comentário ou resposta pai.
- Após a publicação, a resposta deverá ser apresentada abaixo do elemento pai correspondente.

### Seção de cancelamento da criação

#### a. Botão de cancelar

- Deve haver uma opção para cancelar a criação da resposta.
- Ao cancelar, o sistema não deverá publicar nem salvar a resposta que ainda não tenha sido confirmada.
- Caso existam informações preenchidas na resposta, o sistema poderá solicitar uma confirmação antes de sair da criação.

### Seção de estrutura das Threads

#### a. Organização hierárquica

- Cada resposta deverá ser apresentada abaixo do comentário ou resposta ao qual está vinculada.
- O sistema deverá apresentar visualmente a relação entre uma resposta e seu elemento pai.
- Uma resposta poderá possuir outras respostas vinculadas a ela.
- A estrutura deverá permitir múltiplos níveis de respostas.
- A ordem hierárquica deverá ser preservada independentemente da quantidade de níveis existentes.
- O usuário deverá conseguir identificar a sequência da discussão a partir da estrutura apresentada.

#### b. Respostas ocultadas

- Caso uma Thread possua uma quantidade de respostas que prejudique a visualização da interface, o sistema poderá ocultar parte das respostas.
- Quando houver respostas ocultadas, o sistema deverá apresentar uma opção "Ver mais respostas" ou equivalente.
- Ao selecionar essa opção, as respostas ocultadas deverão ser apresentadas.
- A expansão deverá manter a estrutura hierárquica da Thread.
- O usuário deverá conseguir identificar quais respostas pertencem a cada comentário ou resposta pai.

#### c. Visualização de resposta específica

- Ao acessar uma resposta específica, o sistema deverá apresentar o contexto necessário para identificar sua posição na Thread.
- A resposta selecionada deverá permanecer vinculada visualmente ao seu elemento pai.
- O usuário deverá conseguir continuar a interação a partir da resposta selecionada.

### Seção de visualização focada

#### a. Acesso ao comentário ou resposta

- O usuário deverá conseguir selecionar um comentário ou resposta apresentado no post.
- Ao selecionar o conteúdo, o sistema deverá abrir uma visualização focada no comentário ou resposta selecionado.
- O conteúdo selecionado deverá ser apresentado em destaque.
- O sistema deverá apresentar o contexto necessário para identificar a posição do conteúdo dentro da Thread.
- Caso o conteúdo possua um comentário ou resposta pai, o sistema deverá permitir identificar sua relação com o elemento pai.
- As respostas vinculadas ao conteúdo selecionado deverão permanecer acessíveis a partir da visualização focada.
- O usuário deverá conseguir continuar a navegação pela Thread a partir do conteúdo selecionado.
- O usuário deverá conseguir retornar à visualização anterior após acessar o comentário ou resposta em foco.
- As opções de interação disponíveis para o comentário ou resposta deverão permanecer acessíveis na visualização focada.

### Seção de prioridade das Threads do autor

#### a. Priorização na visualização do post

- Quando o usuário estiver visualizando diretamente o post principal, o sistema deverá identificar os comentários e respostas realizados pelo autor do post.
- Caso o autor do post possua uma sequência de comentários e respostas, essa sequência deverá possuir prioridade na ordenação da discussão.
- A sequência deverá manter sua estrutura hierárquica mesmo quando possuir múltiplos níveis.
- A prioridade deverá ser aplicada somente à visualização direta do post principal.
- Comentários e respostas de outros usuários deverão permanecer disponíveis após a sequência priorizada do autor, conforme as regras de ordenação da interface.
- Ao acessar uma resposta específica ou outro ponto da Thread, o sistema não deverá remover o contexto das demais respostas relacionadas.

### Seção de exibição das respostas

#### a. Informações da resposta

- Cada resposta deverá apresentar o conteúdo publicado pelo usuário.
- Cada resposta deverá apresentar a identificação do autor, como foto, nome ou username.
- Cada resposta deverá apresentar a data de criação conforme o padrão definido pelo sistema.
- Cada resposta deverá permanecer vinculada ao comentário ou resposta pai.
- A identificação do autor deverá permitir o acesso ao perfil público correspondente.
- A estrutura e as funcionalidades da tela de perfil não fazem parte desta história de usuário.

## Mensagens de erro e validação

- Caso a resposta esteja vazia, o sistema deverá informar que a resposta deve ser preenchida.
- Caso a resposta contenha apenas espaços em branco, o sistema deverá informar que a resposta deve possuir conteúdo válido.
- Caso o usuário tente ultrapassar o limite de 280 caracteres, o sistema deverá informar que o limite máximo de caracteres foi atingido.
- Caso ocorra um erro durante a publicação da resposta, o sistema deverá informar que não foi possível publicar a resposta e permitir que o usuário tente novamente.
- Caso a resposta pai não esteja mais disponível, o sistema deverá informar que não foi possível localizar o conteúdo ao qual a resposta seria vinculada.
- Caso ocorra um erro ao carregar as respostas, o sistema deverá informar que não foi possível carregar as respostas e permitir uma nova tentativa.
- Caso ocorra um erro ao abrir a visualização focada, o sistema deverá informar que não foi possível carregar o conteúdo selecionado e permitir uma nova tentativa.
- Caso o usuário tente realizar uma ação de alteração de conteúdo em uma resposta já publicada, o sistema não deverá permitir a alteração.

# HU006.3 - Visualização e navegação de comentários e respostas

Como: Usuário

Quero: Ser capaz de visualizar, expandir, recolher e acessar comentários e respostas de forma focada

Para que: Eu consiga acompanhar discussões, visualizar sequências de respostas e navegar diretamente para um comentário ou resposta específica

## Regras de Negócio

- O usuário deve estar autenticado para acessar e interagir com comentários e respostas.
- Os comentários devem permanecer vinculados ao post correspondente.
- Cada resposta deverá possuir um comentário ou resposta pai.
- A estrutura de comentários e respostas deverá funcionar como uma árvore de respostas.
- Comentários sem um comentário ou resposta pai serão considerados comentários principais do post.
- As respostas deverão ser apresentadas hierarquicamente abaixo de seu respectivo comentário ou resposta pai.
- O usuário poderá selecionar um comentário ou resposta para visualizá-lo em foco.
- A visualização em foco deverá apresentar o comentário ou resposta selecionado e sua respectiva sequência de respostas.
- Ao acessar um comentário ou resposta em foco, o sistema deverá manter a identificação do post ao qual aquele conteúdo pertence.
- O usuário deverá conseguir retornar à visualização anterior após acessar um comentário ou resposta em foco.
- Quando o post principal estiver sendo visualizado, a sequência de comentários e respostas deverá respeitar as regras de ordenação definidas para a plataforma.
- Quando houver uma sequência de comentários realizada pelo próprio autor do post, essa sequência poderá receber prioridade na ordenação da visualização principal do post.
- Respostas posteriores a uma resposta não deverão ocupar indefinidamente o espaço da visualização principal.
- Caso existam respostas adicionais em uma sequência, o sistema deverá permitir sua expansão por meio de uma opção como "Ver mais respostas".
- O usuário deverá conseguir expandir uma sequência de respostas para visualizar seus conteúdos.
- O usuário deverá conseguir recolher uma sequência de respostas após expandi-la.
- Caso um comentário ou resposta tenha sido excluído, ele deverá permanecer na estrutura da árvore para preservar o contexto das respostas posteriores.
- Um comentário ou resposta excluído deverá ser apresentado como "Este comentário foi excluído".
- O conteúdo de um comentário ou resposta excluído não deverá permanecer visível.
- A exclusão de um comentário ou resposta não deverá remover ou ocultar automaticamente suas respostas existentes.

## Campos interagíveis

- Comentário ou resposta selecionável para visualização em foco.
- Botão/opção "Ver mais respostas".
- Botão/opção para recolher respostas.
- Botão/opção para retornar à visualização anterior.
- Identificação do autor do comentário ou resposta.
- Post principal associado à árvore de comentários.

## Critérios de aceite

### Seção de visualização dos comentários

#### a. Exibição dos comentários principais

- Os comentários principais deverão ser apresentados abaixo do post correspondente.
- Cada comentário deverá apresentar seu conteúdo, autor e informações de interação disponíveis.
- Os comentários principais deverão ser identificados como pertencentes diretamente ao post.
- As respostas deverão ser apresentadas abaixo do comentário ou resposta ao qual pertencem.
- A hierarquia deverá permitir identificar visualmente qual comentário ou resposta é o conteúdo pai de cada resposta.

### Seção de respostas em árvore

#### a. Exibição das respostas

- Cada resposta deverá ser apresentada abaixo de seu comentário ou resposta pai.
- O sistema deverá manter a relação entre cada resposta e seu respectivo conteúdo pai.
- Uma resposta a uma resposta deverá permanecer vinculada à resposta correspondente, formando uma sequência hierárquica.
- O sistema não deverá apresentar respostas fora da estrutura à qual pertencem.

#### b. Expansão de respostas

- Caso existam respostas adicionais ocultas, deverá ser apresentada uma opção como "Ver mais respostas".
- Ao selecionar "Ver mais respostas", o sistema deverá apresentar as respostas que estavam ocultas.
- As respostas deverão continuar sendo apresentadas respeitando sua hierarquia.
- O usuário deverá conseguir visualizar a sequência completa de respostas disponível para aquele comentário ou resposta.

#### c. Recolhimento de respostas

- Caso uma sequência de respostas esteja expandida, deverá existir uma opção para recolhê-la.
- Ao recolher a sequência, as respostas ocultadas deverão deixar de ser apresentadas na visualização atual.
- O comentário ou resposta pai deverá permanecer visível.

### Seção de visualização em foco

#### a. Acesso ao comentário ou resposta

- Um comentário ou resposta deverá ser um elemento selecionável.
- Ao selecionar o comentário ou resposta, o sistema deverá abrir uma visualização focada naquele conteúdo.
- A visualização em foco deverá apresentar o comentário ou resposta selecionado em posição de destaque.
- O sistema deverá apresentar as respostas relacionadas ao conteúdo selecionado, respeitando a estrutura hierárquica.
- O sistema deverá manter a identificação do post principal ao qual o conteúdo pertence.
- O usuário deverá conseguir identificar o autor do comentário ou resposta selecionado.

#### b. Navegação entre respostas

- Ao acessar uma resposta em foco, o sistema deverá apresentar sua sequência de respostas posteriores, quando existentes.
- A estrutura de respostas deverá permanecer organizada de acordo com a relação entre conteúdo pai e conteúdo filho.
- Caso existam respostas adicionais ocultas, o usuário deverá poder expandi-las por meio da opção "Ver mais respostas".
- O usuário deverá conseguir navegar entre diferentes níveis da árvore de respostas.

#### c. Retorno à visualização anterior

- Deve haver uma opção para retornar à visualização anterior.
- Ao retornar, o usuário deverá voltar para a posição anterior da árvore de comentários sempre que possível.
- A visualização do post e dos comentários deverá permanecer preservada.

### Seção de ordenação e prioridade

#### a. Comentários do autor do post

- Quando o post principal estiver sendo visualizado, o sistema deverá identificar os comentários realizados pelo próprio autor do post.
- Caso o autor possua uma sequência de comentários e respostas relacionadas entre si, essa sequência poderá receber prioridade na ordenação dos comentários principais.
- A prioridade deverá ser aplicada somente à visualização principal do post.
- Ao acessar um comentário ou resposta em foco, a estrutura deverá seguir a hierarquia da árvore de respostas.

### Seção de comentários excluídos

#### a. Exibição do comentário excluído

- Caso um comentário ou resposta tenha sido excluído, o sistema deverá manter sua posição na árvore de respostas.
- O conteúdo original deverá ser substituído pela mensagem "Este comentário foi excluído".
- As respostas vinculadas ao comentário excluído deverão permanecer disponíveis.
- O usuário deverá conseguir identificar que as respostas apresentadas posteriormente pertencem a um comentário que foi excluído.
- A exclusão do comentário pai não deverá remover suas respostas.

## Mensagens de erro e validação

- Caso um comentário ou resposta não esteja mais disponível, o sistema deverá informar que o conteúdo não pode ser encontrado.
- Caso ocorra um erro ao carregar os comentários ou respostas, o sistema deverá informar que não foi possível carregar os comentários e permitir uma nova tentativa.
- Caso ocorra um erro ao carregar uma visualização em foco, o sistema deverá informar que não foi possível carregar o conteúdo e permitir que o usuário retorne à visualização anterior.
- Caso ocorra um erro ao carregar respostas adicionais, o sistema deverá informar que não foi possível carregar mais respostas e permitir uma nova tentativa.
- Caso o conteúdo tenha sido excluído, o sistema deverá apresentar "Este comentário foi excluído", mantendo sua posição na estrutura de respostas.

# HU006.4 - Denúncia de comentários e respostas

Como: Usuário

Quero: Ser capaz de denunciar comentários e respostas publicados por outros usuários

Para que: Eu consiga informar conteúdos que estejam inadequados, incorretos ou em desacordo com a finalidade acadêmica do Companion

## Regras de Negócio

- O usuário deve estar autenticado para realizar uma denúncia.
- O usuário poderá denunciar comentários e respostas publicados por outros usuários.
- O usuário não poderá denunciar um comentário ou resposta publicado por ele mesmo.
- Uma denúncia deverá estar vinculada ao comentário ou resposta correspondente.
- O usuário não poderá realizar mais de uma denúncia para o mesmo comentário ou resposta.
- A denúncia não deverá excluir automaticamente o comentário ou resposta denunciado.
- A denúncia deverá ser registrada no sistema para posterior análise administrativa.
- O usuário deverá selecionar um motivo para realizar a denúncia.
- A denúncia deverá possuir um dos motivos disponibilizados pelo sistema.
- Os motivos de denúncia deverão contemplar situações relacionadas à finalidade acadêmica e ao funcionamento do Companion.
- A exclusão do conteúdo denunciado deverá ser realizada somente conforme as regras administrativas do sistema.
- Caso o conteúdo denunciado seja posteriormente excluído, a denúncia deverá permanecer registrada para controle interno.

## Campos interagíveis

- Botão/opção para denunciar comentário ou resposta.
- Campo para seleção do motivo da denúncia.
- Botão para confirmar a denúncia.
- Botão para cancelar a denúncia.
- Mensagem de confirmação da denúncia.

## Critérios de aceite

### Seção de denúncia

#### a. Botão de denúncia

- Deve haver uma opção para denunciar comentários e respostas.
- A opção de denúncia deverá estar disponível nas opções de interação do comentário ou resposta.
- Caso o conteúdo pertença ao próprio usuário, a opção de denúncia não deverá estar disponível.
- Caso o usuário já tenha denunciado o conteúdo, o sistema não deverá permitir uma nova denúncia.
- Ao selecionar a opção de denúncia, o sistema deverá abrir a área de seleção do motivo.

#### b. Seleção do motivo da denúncia

- Deve haver uma opção para que o usuário selecione o motivo da denúncia.
- O usuário deverá selecionar um motivo antes de confirmar a denúncia.
- O sistema deverá disponibilizar motivos relacionados ao contexto da plataforma.
- Entre os motivos disponíveis deverão estar:

"Conteúdo inadequado ou ofensivo"
"Comentário não relacionado ao conteúdo da publicação"
"Informação incorreta ou enganosa"
"Comentário duplicado ou repetitivo"
"Spam ou publicidade indevida"
"Assédio ou ataque a outro usuário"
"Conteúdo que viola as regras da plataforma"
"Outro"

### Seção de confirmação da denúncia

#### a. Botão de confirmação

- Deve haver um botão para confirmar o envio da denúncia.
- O botão deverá permanecer desabilitado enquanto nenhum motivo estiver selecionado.
- Ao confirmar a denúncia, o sistema deverá registrar o usuário responsável, o comentário ou resposta denunciado, o motivo selecionado e a data da denúncia.
- Quando o botão for pressionado e entrar em estado de processamento, ele deverá ficar desabilitado para impedir múltiplos envios.
- Após o registro bem-sucedido, o sistema deverá informar que a denúncia foi realizada com sucesso.
- A denúncia registrada não deverá excluir automaticamente o comentário ou resposta.

#### b. Botão de cancelamento

- Deve haver uma opção para cancelar a denúncia.
- Ao cancelar, nenhuma denúncia deverá ser registrada.
- O comentário ou resposta deverá permanecer disponível normalmente.

### Seção de denúncia já realizada

#### a. Controle de denúncias

- Caso o usuário já tenha denunciado determinado comentário ou resposta, o sistema não deverá permitir uma nova denúncia pelo mesmo usuário.
- O sistema deverá identificar que uma denúncia já foi realizada para aquele conteúdo.
- Caso aplicável, a opção de denúncia poderá ser substituída por uma indicação de que o conteúdo já foi denunciado.
- A existência de uma denúncia não deverá impedir outros usuários de realizarem suas próprias denúncias.

### Seção de conteúdo denunciado

#### a. Manutenção do conteúdo

- O comentário ou resposta denunciado deverá permanecer disponível enquanto não houver uma ação administrativa sobre ele.
- A denúncia não deverá alterar o conteúdo original do comentário ou resposta.
- A denúncia não deverá alterar a posição do comentário ou resposta na árvore de respostas.
- Caso o comentário ou resposta seja posteriormente excluído, deverá ser aplicado o comportamento definido para conteúdos excluídos.
- A denúncia deverá permanecer registrada mesmo após a exclusão do conteúdo.

## Mensagens de erro e validação

- Caso o usuário tente denunciar o próprio comentário ou resposta, o sistema não deverá permitir a ação.
- Caso o usuário tente denunciar novamente um conteúdo que já tenha denunciado, o sistema deverá informar que a denúncia já foi registrada.
- Caso nenhum motivo seja selecionado, o sistema deverá informar que é necessário selecionar um motivo para continuar.
- Caso ocorra um erro durante o registro da denúncia, o sistema deverá informar que não foi possível concluir a operação e permitir uma nova tentativa.
- Caso o conteúdo denunciado não esteja mais disponível, o sistema deverá informar que o comentário ou resposta não pode ser encontrado.
- Caso ocorra um erro durante o carregamento dos motivos de denúncia, o sistema deverá informar que não foi possível carregar as opções e permitir uma nova tentativa.

# HU007 - Pesquisa de Dúvidas e Perfis de Usuários

Como: Usuário

Quero: Ser capaz de pesquisar dúvidas/posts e perfis de outros usuários

Para que: Eu consiga encontrar conteúdos específicos e outros alunos da plataforma que possam contribuir para meus estudos e troca de conhecimentos.

## Dependências Técnicas:

- O usuário deve estar cadastrado e autenticado no sistema.
- O sistema deverá possuir conexão ativa com a Internet.
- Os posts e informações públicas dos usuários deverão estar armazenados no banco de dados.
- O sistema deverá possuir uma ferramenta de pesquisa.
- O sistema deverá permitir a pesquisa de dúvidas/posts e perfis de usuários.
- O sistema deverá possuir um mecanismo para armazenamento do histórico de buscas realizadas pelo usuário.

## Regras de Negócio:

- O usuário poderá pesquisar outros alunos através da ferramenta de pesquisa.
- O usuário poderá pesquisar dúvidas/posts publicados na plataforma.
- A pesquisa de usuários poderá considerar informações públicas do perfil, como nome e username.
- A pesquisa de posts poderá considerar o conteúdo textual e as TAGs associadas à publicação.
- Os resultados da pesquisa deverão corresponder aos termos informados pelo usuário.
- O sistema deverá apresentar os resultados de usuários e posts de forma identificável.
- O usuário poderá acessar o perfil de um usuário encontrado nos resultados.
- O usuário poderá acessar a visualização de um post encontrado nos resultados.
- Os posts excluídos ou que não estejam mais disponíveis não deverão ser apresentados como resultados disponíveis.
- O histórico deverá armazenar as últimas buscas realizadas pelo usuário.
- O histórico de buscas deverá ser individual para cada usuário.
- O usuário poderá utilizar novamente uma busca presente em seu histórico.
- O funcionamento da pesquisa dependerá de uma conexão ativa com a Internet.

## Campos interagíveis

### Pesquisa:

- Campo de pesquisa.
- Botão/ação para realizar pesquisa.
- Filtros ou opções para selecionar o tipo de resultado, quando disponíveis.
- Resultados da pesquisa.
- Pesquisa de usuários:
- Resultado de usuário.
- Elemento de acesso ao perfil do usuário.

### Pesquisa de dúvidas/posts:

- Resultado de post.
- Elemento de acesso à visualização do post.

### Histórico de buscas:

- Lista de buscas recentes.
- Busca armazenada no histórico.
- Botão/ação para utilizar uma busca anterior.
- Botão/ação para remover uma busca do histórico.

## Critérios de aceite

### Seção de Pesquisa

#### a. Campo de pesquisa

- Deve haver um campo de texto para que o usuário informe o termo que deseja pesquisar.
- O campo deverá possuir um placeholder especificando o que pode ser pesquisado, como "Pesquisar dúvidas, posts ou usuários".
- O usuário deverá conseguir informar texto no campo de pesquisa.
- O usuário deverá conseguir iniciar uma pesquisa após informar um termo válido.
- Caso o campo esteja vazio, o sistema não deverá realizar uma pesquisa.
- Caso o usuário realize uma nova pesquisa, o sistema deverá substituir os resultados da pesquisa anterior pelos novos resultados.

#### b. Realização da pesquisa

- Deve haver uma ação para iniciar a pesquisa.
- Ao realizar a pesquisa, o sistema deverá consultar os dados disponíveis para encontrar resultados correspondentes ao termo informado.
- O sistema deverá permitir a pesquisa de usuários e posts.
- Os resultados deverão ser apresentados de forma organizada e identificável.
- Caso existam resultados de diferentes tipos, o sistema deverá permitir identificar se cada resultado corresponde a um usuário ou a um post.

### Seção de Pesquisa de Usuários

#### a. Resultados de usuários

- O sistema deverá apresentar usuários que correspondam ao termo pesquisado.
- A pesquisa deverá considerar informações públicas do usuário, como nome e username.
- Cada resultado deverá apresentar informações suficientes para identificar o usuário, como foto, nome e username, quando disponíveis.
- O resultado deverá possuir uma opção para acessar o perfil do usuário.

#### b. Acesso ao perfil

- Ao selecionar um usuário encontrado, o sistema deverá direcionar para o perfil público correspondente.
- O usuário deverá conseguir retornar à tela de pesquisa após acessar o perfil.
- O funcionamento, os campos e as funcionalidades da tela de perfil não fazem parte desta história de usuário.

### Seção de Pesquisa de Dúvidas e Posts

#### a. Resultados de posts

- O sistema deverá apresentar posts que correspondam ao termo pesquisado.
- A pesquisa poderá considerar o conteúdo textual da publicação.
- A pesquisa poderá considerar as TAGs associadas à publicação.
- Cada resultado deverá apresentar informações suficientes para identificar a publicação, como autor, conteúdo e TAGs, quando disponíveis.
- Posts excluídos ou indisponíveis não deverão ser apresentados como resultados disponíveis.

#### b. Acesso ao post

- Ao selecionar um post encontrado, o sistema deverá direcionar o usuário para a visualização completa da publicação.
- O usuário deverá conseguir visualizar o conteúdo do post conforme as regras definidas para a visualização de publicações.
- O usuário deverá conseguir retornar à tela de pesquisa após acessar o post.
- Caso o post não esteja mais disponível no momento do acesso, o sistema deverá informar que a publicação não pode ser encontrada.

### Seção de Histórico de Buscas

#### a. Exibição do histórico

- O sistema deverá armazenar as últimas buscas realizadas pelo usuário.
- O histórico deverá apresentar os termos pesquisados anteriormente.
- As buscas deverão ser armazenadas individualmente para cada usuário.
- O histórico deverá apresentar as buscas mais recentes de forma identificável.
- O sistema deverá evitar o armazenamento de uma mesma busca repetidamente em sequência, caso o mesmo termo seja pesquisado várias vezes consecutivamente.

#### b. Utilização de busca anterior

- O usuário deverá conseguir selecionar uma busca presente no histórico.
- Ao selecionar uma busca anterior, o sistema deverá utilizar o termo selecionado para realizar uma nova pesquisa.
- Os resultados deverão ser atualizados de acordo com a busca selecionada.

#### c. Remoção de busca do histórico

- O usuário deverá possuir uma opção para remover uma busca específica do histórico.
- Ao remover uma busca, ela não deverá mais ser apresentada no histórico.
- A remoção de uma busca do histórico não deverá excluir ou alterar os posts ou usuários relacionados à pesquisa.

#### d. Limpeza do histórico

- O usuário poderá possuir uma opção para limpar todas as buscas armazenadas no histórico.
- Ao confirmar a limpeza, todas as buscas do histórico do usuário deverão ser removidas.
- A limpeza do histórico não deverá alterar os posts ou usuários da plataforma.

### Seção de resultados

#### a. Nenhum resultado encontrado

- Caso não sejam encontrados usuários ou posts correspondentes ao termo pesquisado, o sistema deverá informar que nenhum resultado foi encontrado.
- A ausência de resultados não deverá ser considerada um erro do sistema.
- O usuário deverá conseguir realizar uma nova pesquisa após nenhum resultado ser encontrado.

#### b. Resultados indisponíveis

- Caso um resultado deixe de estar disponível antes de ser acessado, o sistema deverá informar que o conteúdo não pode ser encontrado.
- O sistema não deverá apresentar como disponível um post que tenha sido excluído.

## Mensagens de erro e validação

- Caso o campo de pesquisa esteja vazio, o sistema deverá informar que é necessário inserir um termo para realizar a pesquisa.
- Caso não sejam encontrados usuários ou posts correspondentes à pesquisa, o sistema deverá informar que nenhum resultado foi encontrado.
- Caso não exista conexão com a Internet, o sistema deverá informar que não foi possível realizar a pesquisa e permitir que o usuário tente novamente.
- Caso ocorra um erro durante a realização da pesquisa, o sistema deverá informar que não foi possível realizar a pesquisa e permitir que o usuário tente novamente.
- Caso ocorra um erro ao carregar o histórico de buscas, o sistema deverá informar que não foi possível carregar o histórico e permitir que o usuário tente novamente.
- Caso ocorra um erro ao remover uma busca do histórico, o sistema deverá informar que não foi possível remover a busca e permitir que o usuário tente novamente.
- Caso ocorra um erro ao limpar o histórico, o sistema deverá informar que não foi possível limpar o histórico e permitir que o usuário tente novamente.
- Caso um resultado não esteja mais disponível no momento do acesso, o sistema deverá informar que o conteúdo não pode ser encontrado.

# HU008 - Tela de Notificações (melhoria futura; fora da versão 1.0)

Título: Tela de notificações

Como: Usuário

Quero: Ser capaz de visualizar as notificações relacionadas às interações realizadas no meu perfil e nas minhas publicações

Para que: Eu consiga acompanhar curtidas, comentários, respostas, novos seguidores e retornos de denúncias, além de acessar diretamente os perfis e as interações recebidas.

## Dependências Técnicas:

- O usuário deve estar cadastrado e autenticado no sistema.
- O sistema deverá possuir conexão ativa com a Internet.
- As informações relacionadas às interações dos usuários deverão estar armazenadas no banco de dados.
- O sistema deverá identificar as interações realizadas nas publicações, comentários, respostas e perfil do usuário.
- O sistema deverá identificar o tipo de interação que originou cada notificação.
- O sistema deverá possuir um mecanismo para agrupamento de notificações de curtidas relacionadas à mesma publicação ou resposta.
- O sistema deverá possuir um mecanismo para identificação de notificações lidas e não lidas.
- O sistema deverá permitir o acesso ao perfil de outros usuários a partir das notificações.
- O sistema deverá permitir o acesso à publicação, comentário ou resposta relacionado à notificação.
- O funcionamento das notificações dependerá de uma conexão ativa com a Internet.

## Regras de Negócio:

- O usuário poderá receber notificações relacionadas às interações realizadas em seu perfil, publicações, comentários e respostas.
- O usuário poderá receber notificações quando uma publicação ou resposta receber uma ou mais curtidas.
- As notificações de curtidas relacionadas ao mesmo conteúdo deverão ser agrupadas em uma única notificação.
- A notificação agrupada deverá informar a quantidade de curtidas recebidas pelo conteúdo.
- O usuário poderá receber notificações quando outro usuário realizar um comentário em uma de suas publicações.
- O usuário poderá receber notificações quando outro usuário responder a um comentário realizado pelo usuário.
- As respostas poderão ocorrer em diferentes níveis de profundidade, mantendo a estrutura de respostas encadeadas.
- O sistema deverá distinguir uma resposta realizada diretamente em uma publicação de uma resposta realizada em um comentário ou em outra resposta.
- O usuário poderá receber notificações quando outro usuário começar a segui-lo.
- O usuário poderá receber notificações relacionadas ao retorno de denúncias realizadas pelo usuário.
- As notificações deverão ser apresentadas da mais recente para a mais antiga.
- As notificações novas deverão possuir uma identificação visual diferente das notificações já lidas.
- As notificações antigas deverão utilizar a aparência padrão definida para a tela pelo sistema.
- Ao acessar a tela de notificações, todas as notificações novas deverão ser consideradas lidas.
- Após serem consideradas lidas, as notificações deverão permanecer disponíveis para visualização.
- As notificações não poderão ser excluídas pelo usuário.
- O usuário somente poderá visualizar informações e interações às quais possuir acesso dentro da plataforma.
- Caso o conteúdo ou perfil relacionado à notificação não esteja mais disponível, a notificação deverá permanecer disponível, mas o acesso ao conteúdo indisponível deverá ser informado ao usuário.

## Campos interagíveis

### Tela de Notificações:

- Lista de notificações: Exibe as notificações recebidas pelo usuário.
- Notificação de curtida em publicação: Informa que uma ou mais pessoas curtiram uma publicação do usuário.
- Notificação de curtida em comentário ou resposta: Informa que uma ou mais pessoas curtiram um comentário ou resposta do usuário.
- Notificação de comentário em publicação: Informa que outro usuário realizou um comentário diretamente em uma publicação do usuário.
- Notificação de resposta a comentário: Informa que outro usuário respondeu a um comentário ou resposta do usuário.
- Notificação de novo seguidor: Informa que outro usuário começou a seguir o perfil.
- Notificação de retorno de denúncia: Exibe informações sobre o retorno de uma denúncia realizada pelo usuário.
- Perfil do usuário da notificação: Permite acessar o perfil do usuário relacionado à interação.
- Publicação relacionada à notificação: Permite acessar a publicação relacionada à interação.
- Comentário ou resposta relacionada à notificação: Permite acessar diretamente o comentário ou resposta que originou a notificação.

## Critérios de aceite

### Seção de Visualização das Notificações

#### a. Exibição das notificações

- O sistema deverá disponibilizar uma tela específica para que o usuário visualize suas notificações.
- O sistema deverá apresentar as notificações relacionadas às interações recebidas pelo usuário.
- Cada notificação deverá apresentar informações suficientes para que o usuário identifique a interação que a originou.
- O usuário deverá conseguir identificar visualmente o tipo de interação correspondente a cada notificação.
- As notificações deverão ser apresentadas da mais recente para a mais antiga.
- As notificações deverão permanecer disponíveis na tela mesmo após serem lidas.
- O sistema não deverá disponibilizar uma opção para exclusão de notificações.

#### b. Identificação de notificações novas e lidas

- As notificações que ainda não tenham sido visualizadas deverão possuir uma identificação visual própria.
- A identificação visual das notificações novas deverá utilizar uma cor de fundo diferente da utilizada nas notificações já lidas.
- As notificações já lidas deverão utilizar a cor padrão definida para a tela pelo sistema.
- Ao acessar a tela de notificações, todas as notificações novas exibidas deverão ser consideradas lidas.
- Após o usuário acessar a tela, as notificações que anteriormente estavam como novas deverão passar a utilizar a aparência padrão de notificações lidas.
- O sistema não deverá excluir uma notificação após ela ser marcada como lida.

### Seção de Curtidas

#### a. Curtidas em publicações

- O sistema deverá informar ao usuário quando uma publicação de sua autoria receber uma ou mais curtidas.
- Curtidas realizadas na mesma publicação deverão ser agrupadas em uma única notificação.
- A notificação deverá apresentar a quantidade de curtidas recebidas pela publicação.
- A quantidade apresentada deverá corresponder ao número de curtidas consideradas no agrupamento da notificação.
- A notificação deverá permitir identificar a publicação que recebeu as curtidas.
- Ao selecionar a notificação, o sistema deverá permitir o acesso à publicação correspondente.

#### b. Curtidas em comentários e respostas

- O sistema deverá informar ao usuário quando um comentário ou resposta de sua autoria receber uma ou mais curtidas.
- Curtidas realizadas no mesmo comentário ou resposta deverão ser agrupadas em uma única notificação.
- A notificação deverá apresentar a quantidade de curtidas recebidas pelo comentário ou resposta.
- A notificação deverá permitir identificar o comentário ou resposta que recebeu as curtidas.
- Ao selecionar a notificação, o sistema deverá permitir o acesso ao comentário ou resposta correspondente.

### Seção de Comentários e Respostas

#### a. Comentário realizado diretamente em publicação

- O sistema deverá informar ao usuário quando outro usuário realizar um comentário diretamente em uma publicação de sua autoria.
- A notificação deverá permitir identificar a publicação que recebeu o comentário.
- A notificação deverá permitir identificar o usuário responsável pelo comentário.
- Ao selecionar a notificação, o sistema deverá direcionar o usuário para o comentário correspondente.
- O usuário deverá conseguir visualizar o conteúdo do comentário e o contexto da publicação relacionada.

#### b. Resposta realizada em comentário ou resposta

- O sistema deverá informar ao usuário quando outro usuário realizar uma resposta a um comentário ou resposta de sua autoria.
- A notificação deverá permitir identificar o comentário ou resposta que recebeu a nova resposta.
- A notificação deverá permitir identificar o usuário responsável pela resposta.
- Ao selecionar a notificação, o sistema deverá direcionar o usuário para a resposta correspondente.
- O usuário deverá conseguir visualizar o conteúdo da resposta e o contexto da publicação relacionada.
- O sistema deverá permitir o funcionamento das respostas em diferentes níveis de profundidade.
- Uma resposta poderá ser realizada sobre um comentário, sobre uma resposta ou sobre qualquer outro nível anterior da cadeia de respostas.
- O sistema deverá identificar corretamente o conteúdo ao qual a resposta está diretamente vinculada.

#### c. Distinção entre comentário e resposta

- O sistema deverá diferenciar uma interação realizada diretamente em uma publicação de uma interação realizada sobre um comentário ou resposta.
- Uma interação realizada diretamente em uma publicação deverá ser identificada como comentário na notificação.
- Uma interação realizada sobre um comentário ou resposta deverá ser identificada como resposta na notificação.
- A identificação da notificação deverá permitir ao usuário compreender se a interação ocorreu diretamente na publicação ou em um comentário/resposta.

### Seção de Novos Seguidores

#### a. Notificação de novo seguidor

- O sistema deverá informar ao usuário quando outro usuário começar a segui-lo.
- A notificação deverá apresentar informações suficientes para identificar o usuário que começou a segui-lo.
- Ao selecionar a notificação, o usuário deverá conseguir acessar o perfil da pessoa que realizou a ação.
- O perfil acessado deverá apresentar as informações públicas disponíveis daquele usuário.

### Seção de Retorno de Denúncias

#### a. Notificação de retorno de denúncia

- O sistema deverá permitir que o usuário visualize notificações relacionadas ao retorno de denúncias realizadas na plataforma.
- A notificação deverá permitir identificar que o retorno está relacionado a uma denúncia realizada anteriormente.
- A notificação deverá apresentar as informações referentes ao retorno da denúncia, quando disponíveis.
- O usuário deverá conseguir visualizar as informações disponibilizadas pelo sistema sobre o resultado ou andamento da denúncia.

### Seção de Acesso ao Perfil pela Notificação

#### a. Acesso ao perfil

- As notificações relacionadas a outros usuários deverão permitir o acesso ao perfil correspondente.
- Ao selecionar o usuário ou a notificação relacionada a ele, o sistema deverá direcionar para o perfil correspondente.
- O usuário deverá conseguir visualizar as informações públicas disponíveis no perfil.
- Caso o perfil não esteja mais disponível, o sistema deverá informar que o perfil não pode ser visualizado.

### Seção de Acesso à Publicação pela Notificação

#### a. Acesso à publicação

- As notificações relacionadas a publicações deverão permitir o acesso à publicação correspondente.
- Ao selecionar a notificação, o sistema deverá direcionar o usuário para a publicação relacionada.
- O usuário deverá conseguir visualizar o conteúdo da publicação e as informações disponíveis de acordo com as regras definidas para a visualização de publicações.
- Caso a publicação não esteja mais disponível, o sistema deverá informar que a publicação não pode ser visualizada.

### Seção de Acesso ao Comentário ou Resposta pela Notificação

#### a. Acesso à interação

- As notificações relacionadas a comentários ou respostas deverão permitir o acesso à interação correspondente.
- Ao selecionar a notificação, o sistema deverá direcionar o usuário para o comentário ou resposta relacionado.
- O usuário deverá conseguir visualizar o conteúdo da interação.
- O usuário deverá conseguir visualizar o contexto da publicação relacionada à interação.
- Caso a interação não esteja mais disponível, o sistema deverá informar que o conteúdo não pode ser visualizado.
- Caso a publicação relacionada à interação não esteja mais disponível, o sistema deverá informar que o conteúdo não pode ser visualizado.

### Seção de Notificações Indisponíveis

#### a. Conteúdo removido ou indisponível

- Caso uma publicação relacionada a uma notificação seja excluída ou fique indisponível, a notificação deverá permanecer disponível na tela.
- Caso um comentário ou resposta relacionado a uma notificação seja excluído ou fique indisponível, a notificação deverá permanecer disponível na tela.
- Caso o perfil de um usuário relacionado a uma notificação não esteja mais disponível, a notificação deverá permanecer disponível na tela.
- Ao tentar acessar um conteúdo indisponível, o sistema deverá informar ao usuário que o conteúdo não pode ser visualizado.
- A indisponibilidade de um conteúdo não deverá causar a exclusão da notificação correspondente.

### Seção de Ausência de Notificações

#### a. Nenhuma notificação disponível

- Caso o usuário não possua notificações, o sistema deverá informar que não há notificações disponíveis.
- A ausência de notificações não deverá ser considerada um erro do sistema.
- O usuário deverá conseguir permanecer na tela de notificações mesmo quando não houver notificações disponíveis.

## Mensagens de erro e validação

- Caso não exista conexão com a Internet, o sistema deverá informar ao usuário que não foi possível carregar as notificações.
- Caso ocorra um erro durante o carregamento das notificações, o sistema deverá informar que não foi possível carregar as notificações e permitir que o usuário tente novamente.
- Caso uma publicação relacionada à notificação não esteja mais disponível, o sistema deverá informar que a publicação não pode ser visualizada.
- Caso um comentário ou resposta relacionado à notificação não esteja mais disponível, o sistema deverá informar que o conteúdo não pode ser visualizado.
- Caso o perfil de um usuário relacionado à notificação não esteja mais disponível, o sistema deverá informar que o perfil não pode ser visualizado.
- Caso não existam notificações para o usuário, o sistema deverá informar que não há notificações disponíveis.
- A ocorrência de um erro ao acessar o conteúdo relacionado a uma notificação não deverá excluir a notificação da tela.

# HU010 - Visualização do Próprio Perfil

Como: Usuário

Quero: Ser capaz de visualizar meu próprio perfil

Para que: Eu consiga consultar minhas informações pessoais e acadêmicas, acompanhar meus dados e estatísticas na plataforma, visualizar minhas conexões e acessar as informações públicas associadas à minha conta.

## Dependências Técnicas:

- O usuário deve estar cadastrado no sistema.
- O usuário deve estar autenticado no sistema.
- O sistema deverá possuir conexão ativa com a Internet.
- O sistema deverá possuir acesso aos dados do perfil do usuário autenticado.
- O sistema deverá armazenar e disponibilizar o nome do perfil do usuário.
- O sistema deverá armazenar e disponibilizar o username do usuário.
- O sistema deverá armazenar e disponibilizar a foto de perfil do usuário, quando cadastrada.
- O sistema deverá armazenar e disponibilizar a biografia do usuário, quando cadastrada.
- O sistema deverá armazenar e disponibilizar o curso informado pelo usuário, quando cadastrado.
- O sistema deverá armazenar e disponibilizar a faculdade informada pelo usuário, quando cadastrada.
- O sistema deverá armazenar e disponibilizar as disciplinas nas quais o usuário informou possuir dificuldade.
- O sistema deverá armazenar e disponibilizar as disciplinas nas quais o usuário informou possuir domínio.
- O sistema deverá armazenar e disponibilizar a quantidade de dias consecutivos de login do usuário.
- O sistema deverá disponibilizar a pontuação atual do usuário, conforme o algoritmo definido pelo sistema.
- O sistema deverá armazenar e disponibilizar a quantidade de curtidas recebidas pelo usuário.
- O sistema deverá armazenar e disponibilizar a quantidade de posts e respostas realizadas pelo usuário.
- O sistema deverá armazenar e disponibilizar a quantidade de seguidores do usuário.
- O sistema deverá armazenar e disponibilizar a quantidade de usuários que o usuário segue.
- O sistema deverá permitir o acesso à lista de seguidores do usuário.
- O sistema deverá permitir o acesso à lista de usuários seguidos pelo usuário.
- O sistema deverá armazenar e disponibilizar as informações profissionais do usuário, quando cadastradas.
- O sistema deverá armazenar e disponibilizar as instituições de trabalho informadas pelo usuário, quando cadastradas.
- O sistema deverá armazenar e disponibilizar os links das redes sociais informadas pelo usuário, quando cadastrados.
- O sistema deverá permitir a geração de um endereço URL que identifique o perfil do usuário.
- O sistema deverá permitir a cópia do endereço URL do próprio perfil.
- O funcionamento da visualização do perfil dependerá de uma conexão ativa com a Internet.
- O sistema deverá identificar se o usuário possui um Histórico Acadêmico conectado e válido.
- O sistema deverá disponibilizar ao perfil o estado de verificação decorrente da conexão do Histórico Acadêmico.

## Regras de Negócio:

- O usuário deverá conseguir acessar seu próprio perfil por meio da plataforma.
- O perfil deverá apresentar as informações pertencentes ao usuário autenticado.
- O nome do perfil deverá ser apresentado no perfil, com prioridade visual em relação ao username.
- O username deverá ser apresentado no perfil.
- O username deverá ser apresentado com o caractere @ conforme o padrão visual definido para identificação de usuários.
- A foto de perfil deverá ser apresentada quando o usuário possuir uma foto cadastrada.
- Caso o usuário não possua uma foto de perfil cadastrada, o sistema deverá apresentar a representação padrão definida para perfis sem foto.
- A biografia deverá ser apresentada quando o usuário possuir uma descrição cadastrada.
- O curso deverá ser apresentado quando o usuário possuir um curso cadastrado.
- A faculdade deverá ser apresentada quando o usuário possuir uma faculdade cadastrada.
- As disciplinas nas quais o usuário possui dificuldade deverão ser apresentadas no perfil quando houver informações cadastradas.
- As disciplinas nas quais o usuário possui domínio deverão ser apresentadas no perfil quando houver informações cadastradas.
- O perfil deverá apresentar a quantidade atual de dias consecutivos de login do usuário.
- O perfil deverá apresentar a pontuação atual do usuário.
- A pontuação apresentada deverá corresponder ao valor atualmente armazenado ou calculado pelo sistema.
- O perfil deverá apresentar a quantidade de curtidas recebidas pelo usuário.
- O perfil deverá apresentar a quantidade de posts e respostas realizadas pelo usuário.
- O perfil deverá apresentar a quantidade de seguidores do usuário.
- O perfil deverá apresentar a quantidade de usuários que o usuário segue.
- A quantidade de seguidores deverá corresponder ao número atual de usuários que seguem o perfil.
- A quantidade de usuários seguidos deverá corresponder ao número atual de perfis seguidos pelo usuário.
- Ao selecionar a quantidade de seguidores, o sistema deverá abrir uma janela contendo a lista de seguidores.
- Ao selecionar a quantidade de usuários seguidos, o sistema deverá abrir uma janela contendo a lista de usuários seguidos.
- A lista de seguidores deverá apresentar os usuários que seguem o perfil.
- A lista de usuários seguidos deverá apresentar os usuários que o usuário segue.
- As funcionalidades internas das listas de seguidores e seguindo que não estejam relacionadas à visualização não fazem parte desta história de usuário.
- As informações de trabalho deverão ser apresentadas somente quando o usuário possuir trabalho cadastrado.
- A instituição de trabalho deverá ser apresentada quando houver uma instituição cadastrada.
- As redes sociais deverão ser apresentadas somente quando o usuário tiver informado uma conta correspondente.
- As redes sociais serão opcionais e o usuário poderá não possuir nenhuma conta vinculada.
- O perfil poderá apresentar contas de GitHub, LinkedIn, Instagram, X, Reddit ou outras redes sociais disponibilizadas pelo sistema.
- Cada conta de rede social deverá ser apresentada somente quando houver informação cadastrada.
- O perfil deverá disponibilizar uma ação para compartilhar a conta.
- A ação de compartilhar a conta deverá gerar ou disponibilizar um URL correspondente ao perfil do usuário.
- O URL compartilhado deverá direcionar para o perfil correspondente do usuário.
- A ação de compartilhar a conta deverá permitir a cópia do URL do perfil.
- A visualização do próprio perfil não deverá permitir a alteração dos dados apresentados.
- As funcionalidades de alteração das informações do perfil farão parte da HU010.1.
- As abas de posts, respostas, curtidas e salvos não fazem parte desta história de usuário e serão especificadas na HU010.2.
- A pontuação do usuário será determinada conforme algoritmo definido posteriormente.
- O cálculo ou definição do algoritmo de pontuação não faz parte desta história de usuário.

## Campos interagíveis

### Tela do Próprio Perfil:

- Nome do perfil: Identifica o usuário por meio do seu nome de exibição.
- Username: Identifica o usuário por meio do seu username (@).
- Foto de perfil: Exibe a imagem de perfil cadastrada pelo usuário.
- Biografia: Exibe a descrição informada pelo usuário.
- Curso: Exibe o curso informado pelo usuário.
- Faculdade: Exibe a instituição de ensino informada pelo usuário.
- Disciplinas que tem dificuldade: Exibe as disciplinas nas quais o usuário informou possuir dificuldade.
- Disciplinas que tem domínio: Exibe as disciplinas nas quais o usuário informou possuir domínio.
- Dias em sequência de login: Exibe a quantidade de dias consecutivos de login do usuário.
- Pontuação: Exibe a pontuação atual do usuário.
- Quantidade de curtidas: Exibe a quantidade de curtidas recebidas pelo usuário.
- Quantidade de posts/respostas: Exibe a quantidade de posts e respostas realizadas pelo usuário.
- Número de seguidores: Exibe a quantidade de usuários que seguem o perfil e permite acessar a lista de seguidores.
- Número de seguindo: Exibe a quantidade de usuários que o usuário segue e permite acessar a lista de usuários seguidos.
- Lista de seguidores: Janela que apresenta os usuários que seguem o perfil.
- Lista de seguindo: Janela que apresenta os usuários seguidos pelo usuário.
- Trabalho: Exibe o trabalho informado pelo usuário, quando cadastrado.
- Instituição de trabalho: Exibe a instituição na qual o usuário trabalha, quando cadastrada.
- Conta do GitHub: Exibe o perfil do usuário no GitHub, quando informado.
- Conta do LinkedIn: Exibe o perfil do usuário no LinkedIn, quando informado.
- Conta do Instagram: Exibe o perfil do usuário no Instagram, quando informado.
- Conta do X: Exibe o perfil do usuário no X, quando informado.
- Conta do Reddit: Exibe o perfil do usuário no Reddit, quando informado.
- Botão de compartilhar conta: Permite gerar e copiar o URL correspondente ao próprio perfil.
- Marcação de usuário verificado: Identifica que as informações acadêmicas do usuário foram validadas por meio de um Histórico Acadêmico conectado ao perfil.

## Critérios de aceite

### Usuário Verificado

#### a. Verificação por Histórico

- Caso o usuário tenha conectado um Histórico Acadêmico ao seu perfil, o sistema deverá atribuir a marcação de usuário verificado.
- A marcação de usuário verificado deverá indicar que as informações acadêmicas correspondentes foram validadas por meio do Histórico Acadêmico conectado.
- A marcação de usuário verificado deverá ser apresentada próxima ao username do usuário.
- O sistema deverá apresentar a marcação de usuário verificado somente enquanto existir um Histórico Acadêmico válido e conectado ao perfil.
- Caso o usuário não possua um Histórico Acadêmico conectado ao perfil, o sistema não deverá apresentar a marcação de usuário verificado.
- A marcação de usuário verificado não deverá ser concedida por outros critérios nesta história de usuário.
- O processo de conexão, validação e atualização do Histórico Acadêmico não faz parte desta história de usuário.

### Visualização do Perfil

#### a. Abertura do próprio perfil

- Ao acessar a área de perfil, o sistema deverá apresentar o perfil correspondente ao usuário autenticado.
- O sistema deverá identificar o perfil como pertencente ao usuário autenticado.
- O perfil deverá apresentar as informações atuais cadastradas para o usuário.
- As informações deverão ser apresentadas sem permitir alterações nesta tela.
- A tela deverá apresentar o nome do perfil do usuário.
- A tela deverá apresentar o username do usuário.
- A tela deverá apresentar a foto de perfil do usuário, quando cadastrada.
- A tela deverá apresentar a biografia do usuário, quando cadastrada.
- A tela deverá apresentar o curso do usuário, quando cadastrado.
- A tela deverá apresentar a faculdade do usuário, quando cadastrada.
- A tela deverá apresentar as demais informações disponíveis para o perfil conforme as regras desta história.

### Identificação do Usuário

#### a. Username

- O sistema deverá apresentar o username do usuário.
- O username deverá ser apresentado de acordo com o padrão visual definido para a plataforma.
- O username deverá possuir o caractere @ em sua apresentação.
- O username apresentado deverá corresponder ao username atualmente cadastrado para o usuário autenticado.
- O username não deverá ser editável nesta tela.

#### b. Foto de perfil

- O sistema deverá apresentar a foto de perfil cadastrada pelo usuário.
- Caso exista uma foto cadastrada, o sistema deverá apresentar a imagem correspondente.
- Caso não exista uma foto cadastrada, o sistema deverá apresentar a representação padrão definida para usuários sem foto.
- A foto apresentada deverá corresponder à foto atualmente cadastrada para o usuário.
- A alteração da foto de perfil não fará parte desta história de usuário.

#### c. Nome do perfil

- O sistema deverá apresentar o nome do perfil do usuário.
- O nome deverá ser apresentado de acordo com o padrão visual definido para a plataforma.
- O nome apresentado deverá corresponder ao nome atualmente cadastrado para o usuário autenticado.
- O nome não deverá ser editável nesta tela, sendo alterado na edição do perfil (HU010.1).

### Informações Pessoais e Acadêmicas

#### a. Biografia

- O sistema deverá apresentar a biografia cadastrada pelo usuário.
- A biografia deverá corresponder ao conteúdo atualmente armazenado para o perfil.
- Caso não exista uma biografia cadastrada, o sistema deverá omitir a informação ou apresentar a representação definida para ausência de biografia.
- A biografia não poderá ser alterada nesta tela.

#### b. Curso e faculdade

- O sistema deverá apresentar o curso informado pelo usuário.
- O sistema deverá apresentar a faculdade informada pelo usuário.
- As informações apresentadas deverão corresponder aos dados atualmente cadastrados.
- Caso o curso não esteja cadastrado, o sistema deverá omitir a informação ou apresentar a representação definida para ausência de dados.
- Caso a faculdade não esteja cadastrada, o sistema deverá omitir a informação ou apresentar a representação definida para ausência de dados.
- As informações não poderão ser alteradas nesta tela.

### Disciplinas

#### a. Disciplinas que tem dificuldade

- O sistema deverá apresentar as disciplinas que o usuário informou possuir dificuldade.
- Cada disciplina cadastrada deverá ser identificável individualmente.
- A lista deverá apresentar somente as disciplinas atualmente associadas ao perfil como disciplinas de dificuldade.
- Caso o usuário não possua disciplinas de dificuldade cadastradas, o sistema deverá omitir a seção ou apresentar a representação definida para ausência de dados.
- As disciplinas não poderão ser alteradas nesta tela.

#### b. Disciplinas que tem domínio

- O sistema deverá apresentar as disciplinas que o usuário informou possuir domínio.
- Cada disciplina cadastrada deverá ser identificável individualmente.
- A lista deverá apresentar somente as disciplinas atualmente associadas ao perfil como disciplinas de domínio.
- Caso o usuário não possua disciplinas de domínio cadastradas, o sistema deverá omitir a seção ou apresentar a representação definida para ausência de dados.
- As disciplinas não poderão ser alteradas nesta tela.

#### c. Separação entre dificuldade e domínio

- As disciplinas de dificuldade deverão ser apresentadas separadamente das disciplinas de domínio.
- Uma disciplina deverá ser apresentada na categoria correspondente aos dados cadastrados pelo usuário.
- O sistema não deverá misturar as informações de dificuldade e domínio em uma única seção.

### Estatísticas do Perfil

#### a. Dias em sequência de login

- O sistema deverá apresentar a quantidade atual de dias consecutivos de login do usuário.
- O valor apresentado deverá corresponder à sequência registrada pelo sistema.
- Caso o usuário realize um novo login que mantenha a sequência, o valor deverá ser atualizado conforme as regras de contabilização definidas pelo sistema.
- O cálculo da sequência de login não faz parte desta história de usuário.

#### b. Pontuação

- O sistema deverá apresentar a pontuação atual do usuário.
- A pontuação deverá corresponder ao valor definido pelo sistema.
- A pontuação deverá ser atualizada conforme as regras do algoritmo de pontuação.
- O algoritmo responsável pelo cálculo da pontuação não faz parte desta história de usuário.
- O sistema não deverá permitir que o usuário altere diretamente sua pontuação.

#### c. Curtidas

- O sistema deverá apresentar a quantidade de curtidas recebidas pelo usuário.
- O número apresentado deverá corresponder à quantidade atual de curtidas contabilizadas pelo sistema.
- A quantidade deverá ser atualizada conforme novas curtidas sejam contabilizadas ou removidas.
- A visualização detalhada das curtidas não faz parte desta história de usuário.

#### d. Posts e respostas

- O sistema deverá apresentar a quantidade de posts e respostas realizadas pelo usuário.
- O número apresentado deverá corresponder aos conteúdos contabilizados pelo sistema.
- A quantidade deverá ser atualizada conforme novos posts ou respostas sejam realizados ou removidos.
- A visualização dos posts e respostas do usuário não faz parte desta história de usuário.
- As abas destinadas à visualização desses conteúdos serão tratadas na HU010.2.

### Seguidores e Seguindo

#### a. Quantidade de seguidores

- O sistema deverá apresentar o número atual de seguidores do usuário.
- O número deverá corresponder à quantidade de usuários que seguem o perfil.
- A quantidade deverá ser atualizada conforme novos usuários passem a seguir ou deixem de seguir o perfil.
- O número de seguidores deverá possuir uma ação para acesso à lista correspondente.

#### b. Quantidade de seguindo

- O sistema deverá apresentar o número atual de usuários que o usuário segue.
- O número deverá corresponder à quantidade de perfis seguidos pelo usuário.
- A quantidade deverá ser atualizada conforme o usuário passe a seguir ou deixe de seguir outros perfis.
- O número de seguindo deverá possuir uma ação para acesso à lista correspondente.

#### c. Lista de seguidores

- Ao selecionar o número de seguidores, o sistema deverá abrir uma janela contendo a lista de seguidores.
- A lista deverá apresentar os usuários que atualmente seguem o perfil.
- Cada usuário apresentado deverá ser identificável.
- A lista deverá refletir os seguidores atuais no momento do carregamento.
- Caso o usuário não possua seguidores, o sistema deverá apresentar uma informação indicando que não existem seguidores.
- A janela deverá possuir uma ação para ser fechada e retornar ao perfil.

#### d. Lista de seguindo

- Ao selecionar o número de seguindo, o sistema deverá abrir uma janela contendo a lista de usuários seguidos pelo usuário.
- A lista deverá apresentar os usuários que atualmente são seguidos pelo usuário.
- Cada usuário apresentado deverá ser identificável.
- A lista deverá refletir os perfis atualmente seguidos pelo usuário no momento do carregamento.
- Caso o usuário não siga nenhum perfil, o sistema deverá apresentar uma informação indicando que não existem usuários seguidos.
- A janela deverá possuir uma ação para ser fechada e retornar ao perfil.

### Informações Profissionais

#### a. Trabalho

- O sistema deverá apresentar o trabalho informado pelo usuário quando houver informação cadastrada.
- A informação deverá corresponder ao trabalho atualmente associado ao perfil.
- Caso o usuário não tenha informado um trabalho, o sistema não deverá apresentar uma informação profissional inexistente.
- A informação de trabalho não poderá ser alterada nesta tela.

#### b. Instituição de trabalho

- O sistema deverá apresentar a instituição de trabalho quando houver informação cadastrada.
- A instituição apresentada deverá corresponder à informação atualmente cadastrada no perfil.
- Caso o usuário não possua uma instituição de trabalho cadastrada, o sistema deverá omitir a informação ou apresentar a representação definida para ausência de dados.
- A instituição de trabalho não poderá ser alterada nesta tela.

### Redes Sociais

#### a. Contas vinculadas

- O sistema deverá apresentar as contas de redes sociais informadas pelo usuário.
- As contas deverão ser opcionais.
- O usuário poderá possuir nenhuma, uma ou várias contas de redes sociais vinculadas.
- O sistema poderá apresentar contas do GitHub, LinkedIn, Instagram, X, Reddit ou outras redes sociais disponibilizadas pela plataforma.
- Cada rede social deverá ser apresentada somente quando possuir uma conta cadastrada.
- A ausência de uma conta em determinada rede social não deverá ser considerada um erro.
- As contas apresentadas deverão corresponder às informações atualmente cadastradas no perfil.

#### b. Acesso às redes sociais

- As contas de redes sociais apresentadas deverão permitir acesso à conta correspondente quando houver um endereço válido cadastrado.
- O acesso deverá utilizar o endereço associado à conta informada pelo usuário.
- O sistema não deverá apresentar uma conta de rede social que não possua informação cadastrada.

### Compartilhamento do Perfil

#### a. Geração do URL

- O sistema deverá disponibilizar um botão ou ação para compartilhar o próprio perfil.
- Ao selecionar a ação de compartilhar, o sistema deverá gerar ou disponibilizar o URL correspondente ao perfil.
- O URL deverá identificar exclusivamente o perfil do usuário.
- O URL deverá permanecer associado ao perfil correspondente enquanto o identificador utilizado permanecer válido.

#### b. Cópia do URL

- O usuário deverá conseguir copiar o URL do próprio perfil.
- Ao selecionar a ação de copiar, o sistema deverá copiar o endereço correspondente para a área de transferência.
- O conteúdo copiado deverá corresponder ao URL do perfil do usuário.
- A cópia do URL não deverá alterar nenhuma informação do perfil.

#### c. Acesso pelo URL

- O URL compartilhado deverá direcionar para o perfil correspondente ao usuário.
- O acesso ao URL deverá utilizar o identificador do perfil para localizar o usuário correspondente.
- Caso o perfil esteja disponível, o sistema deverá apresentar o perfil correspondente.
- O comportamento de visualização de perfis de outros usuários não faz parte desta história de usuário.

### Edição do Perfil

#### a. Botão de Editar Perfil

- Ao clicar nesse botão, o usuário é redirecionado para uma janela de Editar Perfil, conforme descrito na próxima história.

### Dados Opcionais

#### a. Ausência de informações

- O usuário poderá não possuir biografia cadastrada.
- O usuário poderá não possuir curso cadastrado.
- O usuário poderá não possuir faculdade cadastrada.
- O usuário poderá não possuir disciplinas de dificuldade cadastradas.
- O usuário poderá não possuir disciplinas de domínio cadastradas.
- O usuário poderá não possuir trabalho cadastrado.
- O usuário poderá não possuir instituição de trabalho cadastrada.
- O usuário poderá não possuir contas de redes sociais cadastradas.
- O usuário poderá não possuir seguidores.
- O usuário poderá não seguir nenhum usuário.
- A ausência dessas informações não deverá impedir a visualização do restante do perfil.
- O sistema deverá apresentar somente as informações disponíveis ou utilizar a representação definida para campos sem dados.

## Limites de Escopo

### a. Edição do perfil

- A tela de próprio perfil não deverá permitir a edição das informações apresentadas.
- Não deverá existir nesta história uma ação para alterar nome, username, foto, biografia, curso, faculdade, disciplinas, trabalho, instituição de trabalho ou redes sociais.
- A funcionalidade de edição do perfil será especificada na HU010.1.
- A HU010.1 será responsável pelas regras e comportamentos relacionados à alteração das informações do perfil.

#### b. Abas de conteúdo

- As abas de posts, respostas, curtidas e salvos não fazem parte desta história de usuário.
- A quantidade de posts e respostas poderá ser apresentada como estatística do perfil.
- A visualização dos conteúdos relacionados a essas estatísticas não deverá ser implementada nesta história.
- A funcionalidade das abas de posts, respostas, curtidas e salvos será especificada posteriormente na HU010.2.

## Mensagens de Erro e Validação

- Caso não exista conexão com a Internet, o sistema deverá informar ao usuário que não foi possível carregar o perfil.
- Caso ocorra um erro durante o carregamento das informações do perfil, o sistema deverá informar que não foi possível carregar os dados e permitir que o usuário tente novamente.
- Caso uma informação específica do perfil não possa ser carregada, o sistema deverá informar ou representar a indisponibilidade conforme o padrão definido para a plataforma.
- A indisponibilidade de uma informação específica não deverá impedir a apresentação das demais informações que tenham sido carregadas corretamente.
- Caso ocorra um erro ao carregar a lista de seguidores, o sistema deverá informar que não foi possível carregar os seguidores e permitir que o usuário tente novamente.
- Caso ocorra um erro ao carregar a lista de usuários seguidos, o sistema deverá informar que não foi possível carregar a lista de seguindo e permitir que o usuário tente novamente.
- Caso ocorra um erro ao gerar o URL do perfil, o sistema deverá informar que não foi possível compartilhar o perfil e permitir que o usuário tente novamente.
- Caso ocorra um erro ao copiar o URL do perfil, o sistema deverá informar que não foi possível copiar o endereço e permitir que o usuário tente novamente.
- Caso uma conta de rede social cadastrada não esteja disponível para acesso, o sistema deverá informar ou tratar a indisponibilidade conforme o padrão definido pela plataforma.
- A ocorrência de um erro durante o carregamento do perfil não deverá excluir ou alterar os dados cadastrados do usuário.
- A visualização do perfil não deverá permitir alterações nos dados em caso de erro.

# HU010.1 - Edição do Próprio Perfil

Como: Usuário

Quero: Ser capaz de editar as informações do meu perfil

Para que: Eu consiga manter meus dados pessoais, acadêmicos, profissionais e minhas redes sociais atualizados na plataforma.

## Dependências Técnicas:

- O usuário deve estar cadastrado e autenticado no sistema.
- O sistema deverá possuir conexão ativa com a Internet.
- O sistema deverá possuir acesso aos dados atuais do perfil do usuário autenticado.
- O sistema deverá permitir a alteração do nome do perfil do usuário.
- O sistema deverá permitir a alteração da foto de perfil do usuário.
- O sistema deverá permitir a alteração da biografia do usuário.
- O sistema deverá possuir uma lista de cursos disponíveis para seleção.
- O sistema deverá possuir uma lista de faculdades disponíveis para seleção.
- O sistema deverá permitir a seleção das disciplinas nas quais o usuário possui dificuldade.
- O sistema deverá permitir a seleção das disciplinas nas quais o usuário possui domínio.
- O sistema deverá permitir o cadastro de informações relacionadas ao trabalho do usuário.
- O sistema deverá permitir o cadastro da instituição na qual o usuário trabalha.
- O sistema deverá permitir o cadastro de links de redes sociais.
- O sistema deverá identificar se o usuário possui um Histórico Acadêmico conectado e válido.
- O sistema deverá possuir acesso às disciplinas e respectivas notas presentes no Histórico Acadêmico conectado.
- O sistema deverá identificar as disciplinas do perfil que não possuem nota mínima de 8 no Histórico Acadêmico.
- O sistema deverá impedir a seleção de disciplinas que não atendam aos critérios definidos para usuários com Histórico Acadêmico conectado.
- O sistema deverá permitir o salvamento das alterações realizadas no perfil.
- O sistema deverá validar os dados antes de salvá-los.
- O funcionamento da edição do perfil dependerá de uma conexão ativa com a Internet.

## Regras de Negócio:

- O usuário poderá editar as informações do próprio perfil.
- A edição deverá ocorrer somente sobre o perfil do usuário autenticado.
- O usuário poderá alterar seu nome.
- O nome deverá possuir no máximo 25 caracteres.
- O nome não precisa ser único na plataforma.
- O nome deverá ser obrigatório e não poderá ficar vazio.
- A alteração do username (@) não faz parte desta história e será tratada na HU012.1.
- O usuário poderá alterar sua foto de perfil.
- O usuário poderá remover sua foto de perfil, caso essa funcionalidade seja disponibilizada pelo sistema.
- O usuário poderá alterar sua biografia.
- O usuário poderá selecionar seu curso a partir de uma lista disponibilizada pelo sistema.
- O usuário poderá selecionar sua faculdade a partir de uma lista disponibilizada pelo sistema.
- O usuário poderá informar as disciplinas nas quais possui dificuldade.
- O usuário poderá informar as disciplinas nas quais possui domínio.
- O usuário poderá informar seu trabalho, quando possuir.
- O usuário poderá informar a instituição na qual trabalha, quando possuir.
- O usuário poderá cadastrar links de suas redes sociais.
- As contas de redes sociais serão opcionais.
- O usuário poderá cadastrar nenhuma, uma ou várias redes sociais disponibilizadas pela plataforma.
- A edição das informações deverá preservar os demais dados do perfil que não tenham sido alterados.
- Ao salvar as alterações, o sistema deverá atualizar os dados correspondentes no perfil do usuário.
- As alterações realizadas deverão ser refletidas na visualização do próprio perfil após o salvamento.
- Caso o usuário possua um Histórico Acadêmico conectado e válido, as regras específicas de seleção de disciplinas deverão ser aplicadas.
- Ao verificar o perfil por meio do Histórico Acadêmico, todas as disciplinas de dificuldade e domínio selecionadas anteriormente deverão ser desmarcadas.
- Após a verificação por Histórico Acadêmico, o sistema deverá utilizar as disciplinas presentes no Histórico Acadêmico para determinar quais disciplinas poderão ser selecionadas.
- O sistema deverá bloquear as disciplinas que o usuário não possuir com nota igual ou superior a 8 no Histórico Acadêmico.
- As disciplinas bloqueadas não poderão ser selecionadas pelo usuário.
- As disciplinas que possuírem nota igual ou superior a 8 no Histórico Acadêmico poderão ser disponibilizadas para seleção, conforme a categoria correspondente definida pelo sistema.
- A verificação por Histórico Acadêmico deverá impedir que o usuário declare domínio ou dificuldade em disciplinas que não atendam aos critérios definidos pelo sistema.
- A conexão do Histórico Acadêmico não poderá ser alterada por meio desta história de usuário, salvo se uma funcionalidade específica para isso estiver definida posteriormente.
- O processo de conexão, validação e atualização do Histórico Acadêmico não faz parte desta história de usuário.

## Campos interagíveis

### Tela de Editar Perfil:

- Nome: Permite alterar o nome de exibição do perfil.
- Foto de perfil: Permite alterar a imagem de perfil.
- Biografia: Permite alterar a descrição apresentada no perfil.
- Curso: Permite selecionar o curso do usuário a partir de uma lista.
- Faculdade: Permite selecionar a faculdade do usuário a partir de uma lista.
- Disciplinas que tem dificuldade: Permite selecionar as disciplinas nas quais o usuário possui dificuldade.
- Disciplinas que tem domínio: Permite selecionar as disciplinas nas quais o usuário possui domínio.
- Trabalho: Permite informar o trabalho do usuário.
- Instituição de trabalho: Permite informar a instituição na qual o usuário trabalha.
- Links das redes sociais: Permite cadastrar ou alterar os links das redes sociais do usuário.
- Botão de salvar: Permite salvar as alterações realizadas no perfil.
- Botão de cancelar/voltar: Permite sair da tela de edição sem salvar alterações, conforme comportamento definido pelo sistema.

## Critérios de aceite

### Acesso à Edição do Perfil

#### a. Abertura da tela

- Ao selecionar a função de editar o perfil, o sistema deverá abrir a tela de edição do próprio perfil.
- A tela deverá apresentar os dados atualmente cadastrados para o usuário.
- Os campos editáveis deverão ser apresentados com os valores atualmente cadastrados.
- O usuário deverá conseguir alterar os campos permitidos nesta história.
- O usuário não deverá conseguir editar informações que não façam parte desta história de usuário.
- A tela de edição deverá permitir que o usuário descarte as alterações realizadas antes do salvamento.
- Caso o usuário saia da tela após realizar alterações não salvas, o sistema deverá seguir o comportamento definido para confirmação de descarte de alterações.

### Nome

#### a. Alteração do nome

- O sistema deverá apresentar o nome atualmente cadastrado.
- O usuário deverá conseguir alterar o nome.
- O campo deverá permitir a inserção de um novo nome.
- O nome deverá possuir no máximo 25 caracteres.
- O nome não precisa ser único na plataforma.
- O nome deverá ser obrigatório e não poderá ser salvo vazio.
- Caso o nome informado seja válido, o sistema deverá permitir o salvamento.
- Após o salvamento, o novo nome deverá ser apresentado no perfil do usuário.
- A alteração do nome não deverá alterar os demais dados do perfil.

#### b. Nome inválido

- Caso o usuário deixe o nome vazio, o sistema deverá informar que o nome é obrigatório.
- Caso o nome ultrapasse 25 caracteres, o sistema deverá informar o limite definido.
- O sistema não deverá salvar o novo nome enquanto houver uma inconsistência no campo.
- O usuário deverá conseguir corrigir o nome e realizar uma nova tentativa.

#### c. Username (@)

- O username não poderá ser alterado nesta tela.
- A alteração do username será tratada na HU012.1.

### Foto de Perfil

#### a. Alteração da foto

- O sistema deverá apresentar a foto de perfil atualmente cadastrada.
- O usuário deverá possuir uma ação para selecionar uma nova foto.
- A nova imagem selecionada deverá substituir a imagem anterior após o salvamento.
- O sistema deverá validar o arquivo selecionado conforme os formatos e limites definidos pela plataforma.
- A foto alterada deverá ser apresentada no perfil após o salvamento.

#### b. Remoção da foto

- Caso a plataforma disponibilize a remoção da foto, o usuário deverá conseguir remover a foto atualmente cadastrada.
- Ao remover a foto, o sistema deverá apresentar a representação padrão definida para perfis sem foto.
- A remoção deverá ser aplicada após o salvamento das alterações.

### Biografia

#### a. Alteração da biografia

- O sistema deverá apresentar a biografia atualmente cadastrada.
- O usuário deverá conseguir editar o conteúdo da biografia.
- O campo deverá permitir a inserção de texto.
- O conteúdo deverá respeitar o limite máximo de caracteres definido pela plataforma.
- O sistema não deverá permitir o salvamento de uma biografia que ultrapasse o limite estabelecido.
- O usuário deverá conseguir apagar a biografia existente.
- Após o salvamento, a nova biografia deverá ser apresentada no perfil.

### Curso

#### a. Seleção do curso

- O sistema deverá apresentar o curso atualmente selecionado, quando houver.
- O campo de curso deverá utilizar uma lista de opções disponibilizadas pelo sistema.
- O usuário deverá conseguir abrir a lista de cursos disponíveis.
- O usuário deverá conseguir selecionar um curso da lista.
- O curso selecionado deverá substituir o curso anteriormente cadastrado após o salvamento.
- O usuário não deverá precisar inserir manualmente um curso que esteja disponível na lista.
- Caso nenhum curso seja selecionado, o sistema deverá seguir a regra definida para ausência de curso.

### Faculdade

#### a. Seleção da faculdade

- O sistema deverá apresentar a faculdade atualmente selecionada, quando houver.
- O campo de faculdade deverá utilizar uma lista de opções disponibilizadas pelo sistema.
- O usuário deverá conseguir abrir a lista de faculdades disponíveis.
- O usuário deverá conseguir selecionar uma faculdade da lista.
- A faculdade selecionada deverá substituir a faculdade anteriormente cadastrada após o salvamento.
- O usuário não deverá precisar inserir manualmente uma faculdade que esteja disponível na lista.
- Caso nenhuma faculdade seja selecionada, o sistema deverá seguir a regra definida para ausência de faculdade.

### Disciplinas

#### a. Seleção de disciplinas

- O sistema deverá apresentar as disciplinas atualmente selecionadas como disciplinas de dificuldade.
- O sistema deverá apresentar as disciplinas atualmente selecionadas como disciplinas de domínio.
- O usuário deverá conseguir selecionar ou desmarcar disciplinas de dificuldade.
- O usuário deverá conseguir selecionar ou desmarcar disciplinas de domínio.
- As disciplinas de dificuldade e domínio deverão ser apresentadas separadamente.
- O sistema deverá impedir que uma disciplina seja selecionada simultaneamente nas duas categorias, caso essa seja a regra definida para a plataforma.
- As alterações nas disciplinas deverão ser aplicadas somente após o salvamento do perfil.

#### b. Disciplinas com Histórico Acadêmico

- Caso o usuário possua um Histórico Acadêmico conectado e válido, o sistema deverá aplicar as regras de verificação das disciplinas.
- O sistema deverá utilizar as disciplinas e notas presentes no Histórico Acadêmico conectado.
- O sistema deverá identificar as disciplinas que possuem nota igual ou superior a 8.
- O sistema deverá identificar as disciplinas que possuem nota inferior a 8.
- O sistema deverá permitir a seleção somente das disciplinas que atendam ao critério mínimo definido.
- As disciplinas que não possuírem pelo menos 8 no Histórico Acadêmico deverão permanecer bloqueadas.
- O usuário não deverá conseguir selecionar uma disciplina bloqueada.
- As disciplinas bloqueadas deverão possuir uma identificação visual que permita diferenciá-las das disciplinas disponíveis.
- O sistema deverá apresentar, quando aplicável, a informação de que a disciplina está bloqueada por não possuir a nota mínima necessária no Histórico Acadêmico.

#### c. Limpeza das disciplinas após verificação

- Ao ocorrer a verificação do perfil por meio do Histórico Acadêmico, todas as disciplinas anteriormente marcadas como dificuldade deverão ser desmarcadas.
- Ao ocorrer a verificação do perfil por meio do Histórico Acadêmico, todas as disciplinas anteriormente marcadas como domínio deverão ser desmarcadas.
- A limpeza das disciplinas deverá ocorrer independentemente de as disciplinas anteriormente selecionadas possuírem nota igual ou superior a 8.
- Após a limpeza, o usuário deverá selecionar novamente as disciplinas permitidas pelo sistema.
- O sistema não deverá manter automaticamente as seleções anteriores após a verificação.
- Após a verificação, disciplinas que não atenderem ao critério de nota deverão permanecer indisponíveis para nova seleção.

#### d. Disciplinas não presentes no Histórico

- Caso uma disciplina selecionada anteriormente não esteja presente no Histórico Acadêmico, ela deverá ser tratada conforme as regras de validação definidas para disciplinas sem registro.
- A disciplina não deverá permanecer automaticamente selecionada após a verificação.
- Caso a disciplina não atenda aos critérios necessários para seleção, o sistema deverá mantê-la bloqueada.

### Trabalho

#### a. Alteração do trabalho

- O sistema deverá apresentar o trabalho atualmente cadastrado, quando houver.
- O usuário deverá conseguir informar ou alterar seu trabalho.
- O usuário deverá conseguir apagar a informação de trabalho.
- Caso o usuário não possua trabalho, o campo poderá permanecer vazio.
- Após o salvamento, a informação deverá ser atualizada no perfil.

### Instituição de Trabalho

#### a. Alteração da instituição

- O sistema deverá apresentar a instituição de trabalho atualmente cadastrada, quando houver.
- O usuário deverá conseguir informar ou alterar a instituição.
- O usuário deverá conseguir apagar a informação de instituição.
- Caso o usuário não possua uma instituição de trabalho, o campo poderá permanecer vazio.
- Após o salvamento, a instituição deverá ser atualizada no perfil.

### Links das Redes Sociais

#### a. Cadastro e alteração

- O sistema deverá apresentar os links de redes sociais atualmente cadastrados.
- O usuário deverá conseguir cadastrar um link para uma rede social.
- O usuário deverá conseguir alterar um link previamente cadastrado.
- O usuário deverá conseguir remover um link previamente cadastrado.
- As redes sociais deverão ser opcionais.
- O usuário poderá cadastrar nenhuma, uma ou várias redes sociais.
- O sistema poderá disponibilizar campos para GitHub, LinkedIn, Instagram, X, Reddit ou outras redes sociais definidas pela plataforma.
- Cada link deverá ser associado à rede social correspondente.
- O sistema deverá validar o formato do link conforme as regras definidas para cada rede social ou para a plataforma.
- Após o salvamento, os links cadastrados deverão ser apresentados no perfil.

#### b. Links inválidos

- Caso o usuário informe um link em formato inválido, o sistema deverá informar que o endereço não é válido.
- O sistema não deverá salvar o link inválido.
- O usuário deverá conseguir corrigir o endereço e realizar uma nova tentativa.
- A existência de um link inválido não deverá impedir a edição dos demais campos, desde que o usuário corrija ou remova o valor inválido antes do salvamento.

### Salvamento das Alterações

#### a. Salvar perfil

- O sistema deverá disponibilizar uma ação para salvar as alterações realizadas.
- Ao selecionar a ação de salvar, o sistema deverá validar todos os campos alterados.
- Caso todos os dados sejam válidos, o sistema deverá salvar as alterações.
- Após o salvamento bem-sucedido, o sistema deverá atualizar os dados do perfil.
- As informações não alteradas deverão permanecer iguais às informações anteriores.
- O usuário deverá receber uma indicação de que as alterações foram salvas com sucesso.
- Após o salvamento, o sistema deverá permitir que o usuário retorne à visualização do próprio perfil.

#### b. Alterações inválidas

- Caso exista algum campo inválido, o sistema não deverá concluir o salvamento.
- O sistema deverá identificar o campo que necessita de correção.
- O usuário deverá conseguir corrigir o campo inválido e realizar uma nova tentativa.
- Os dados anteriormente salvos deverão permanecer preservados caso o salvamento não seja concluído.

### Cancelamento das Alterações

#### a. Descartar alterações

- O usuário deverá conseguir sair da tela de edição sem salvar as alterações.
- Caso não existam alterações, o sistema deverá permitir a saída diretamente.
- Caso existam alterações não salvas, o sistema deverá seguir o comportamento definido para confirmação de descarte.
- Ao confirmar o descarte, as alterações não salvas deverão ser descartadas.
- Ao descartar as alterações, os dados anteriormente salvos deverão permanecer inalterados.

### Verificação do Perfil e Disciplinas

#### a. Perfil verificado

- Caso o usuário tenha conectado um Histórico Acadêmico válido, o sistema deverá reconhecer o perfil como verificado conforme as regras definidas na HU010.
- A condição de verificação deverá ser considerada durante a edição das disciplinas.
- O usuário verificado deverá possuir suas disciplinas limitadas às regras determinadas pelo Histórico Acadêmico.
- A marcação de usuário verificado não deverá ser editada manualmente pelo usuário nesta tela.

#### b. Limitação por nota

- Para usuários com Histórico Acadêmico conectado, somente disciplinas que possuam nota igual ou superior a 8 poderão ser selecionadas.
- Disciplinas com nota inferior a 8 deverão permanecer bloqueadas.
- O usuário não deverá conseguir contornar o bloqueio por meio de inserção manual.
- A validação deverá ser realizada pelo sistema antes do salvamento.
- Caso uma disciplina bloqueada seja enviada de alguma forma para o salvamento, o sistema deverá rejeitar a seleção.
- O sistema deverá utilizar os dados do Histórico Acadêmico como fonte para determinar a permissão da disciplina.

## Mensagens de Erro e Validação

- Caso não exista conexão com a Internet, o sistema deverá informar ao usuário que não foi possível carregar ou salvar as alterações.
- Caso ocorra um erro ao carregar os dados atuais do perfil, o sistema deverá informar que não foi possível carregar os dados e permitir que o usuário tente novamente.
- Caso ocorra um erro ao salvar as alterações, o sistema deverá informar que não foi possível salvar as alterações e permitir uma nova tentativa.
- Caso o nome esteja vazio, o sistema deverá informar que o nome é obrigatório e impedir o salvamento.
- Caso o nome ultrapasse o limite de 25 caracteres, o sistema deverá informar o limite e impedir o salvamento enquanto o conteúdo não for corrigido.
- Caso a foto selecionada não atenda aos requisitos definidos pela plataforma, o sistema deverá informar o problema e impedir o salvamento da nova foto.
- Caso a biografia ultrapasse o limite permitido, o sistema deverá informar o limite e impedir o salvamento enquanto o conteúdo não for corrigido.
- Caso um link de rede social seja inválido, o sistema deverá informar o problema e impedir o salvamento enquanto o link não for corrigido ou removido.
- Caso uma disciplina bloqueada seja selecionada, o sistema deverá impedir a seleção.
- Caso uma disciplina bloqueada seja enviada para salvamento, o sistema deverá rejeitar a alteração e informar que a disciplina não pode ser selecionada.
- Caso os dados do Histórico Acadêmico não estejam disponíveis durante a validação das disciplinas, o sistema deverá informar que não foi possível validar as disciplinas e permitir uma nova tentativa.
- Caso ocorra um erro durante a validação do Histórico Acadêmico, o sistema não deverá liberar disciplinas que deveriam permanecer bloqueadas.
- Caso o salvamento falhe, as informações anteriormente salvas do perfil deverão permanecer preservadas.
- A ocorrência de um erro durante a edição não deverá excluir dados previamente cadastrados.
- A ocorrência de um erro em um campo não deverá alterar os demais dados já salvos do perfil.

# HU010.2 - Abas de Posts, Respostas, Curtidas e Salvos

Como: Usuário

Quero: Ser capaz de visualizar minhas publicações, minhas respostas, as publicações que curti e as publicações que salvei

Para que: Eu consiga consultar e organizar rapidamente os conteúdos relacionados às minhas atividades e interações na plataforma.

## Dependências Técnicas:

- O usuário deve estar cadastrado e autenticado no sistema.
- O sistema deverá possuir conexão ativa com a Internet.
- O sistema deverá possuir acesso às publicações relacionadas ao usuário autenticado.
- O sistema deverá identificar quais publicações foram criadas diretamente pelo usuário.
- O sistema deverá identificar quais publicações possuem outra publicação como publicação-pai.
- O sistema deverá identificar quais publicações foram curtidas pelo usuário.
- O sistema deverá identificar quais publicações foram salvas pelo usuário.
- O sistema deverá armazenar a relação entre uma resposta e sua publicação-pai.
- O sistema deverá armazenar as curtidas realizadas pelo usuário.
- O sistema deverá armazenar os salvamentos realizados pelo usuário.
- O sistema deverá permitir a recuperação das publicações correspondentes a cada categoria.
- O sistema deverá permitir a ordenação das publicações conforme o critério definido para cada aba.
- O sistema deverá permitir o acesso à publicação selecionada.
- O funcionamento das abas dependerá de uma conexão ativa com a Internet.

## Regras de Negócio:

- O perfil do usuário deverá possuir quatro abas de conteúdo: Posts, Respostas, Curtidas e Salvos.
- As abas deverão apresentar somente publicações pertencentes à categoria correspondente.
- A aba Posts deverá apresentar as publicações primárias criadas pelo usuário.
- Uma publicação deverá ser considerada um Post quando não possuir uma publicação-pai.
- A aba Posts não deverá apresentar respostas realizadas pelo usuário.
- A aba Respostas deverá apresentar as publicações criadas pelo usuário que possuam uma publicação-pai.
- Uma publicação deverá ser considerada uma Resposta quando estiver vinculada a uma publicação-pai.
- A aba Respostas não deverá apresentar publicações primárias do usuário que não possuam publicação-pai.
- A aba Curtidas deverá apresentar as publicações que o usuário curtiu.
- A aba Curtidas poderá apresentar publicações criadas por outros usuários ou pelo próprio usuário, desde que tenham sido curtidas pelo usuário autenticado.
- A aba Salvos deverá apresentar as publicações que o usuário salvou por meio da função de salvar.
- A aba Salvos poderá apresentar publicações criadas por outros usuários ou pelo próprio usuário, desde que tenham sido salvas pelo usuário autenticado.
- Uma mesma publicação poderá aparecer em mais de uma aba quando atender aos critérios das respectivas categorias.
- As publicações deverão permanecer associadas à categoria correspondente enquanto atenderem aos critérios definidos.
- Caso o usuário remova uma curtida de uma publicação, a publicação deverá deixar de aparecer na aba Curtidas.
- Caso o usuário remova o salvamento de uma publicação, a publicação deverá deixar de aparecer na aba Salvos.
- A exclusão de uma publicação deverá seguir as regras definidas para publicações e poderá alterar sua disponibilidade nas abas correspondentes.
- As abas deverão refletir o estado atual das publicações e das interações do usuário.
- As abas não deverão permitir a criação de uma nova publicação diretamente por meio desta história de usuário.
- As funcionalidades de criação, edição, exclusão, curtida, salvamento e resposta de publicações não fazem parte desta história de usuário.
- Ao selecionar uma publicação, o sistema deverá direcionar o usuário para a visualização correspondente da publicação.
- O funcionamento interno da tela de publicação não faz parte desta história de usuário.

## Campos interagíveis

### Abas do Perfil:

- Aba Posts: Permite visualizar as publicações primárias criadas pelo usuário.
- Aba Respostas: Permite visualizar as respostas criadas pelo usuário.
- Aba Curtidas: Permite visualizar as publicações curtidas pelo usuário.
- Aba Salvos: Permite visualizar as publicações salvas pelo usuário.

### Lista de Publicações:

- Publicação: Exibe uma publicação pertencente à categoria selecionada.
- Área da publicação: Permite acessar a publicação correspondente.
- Conteúdo da publicação: Exibe o conteúdo da publicação conforme as regras da plataforma.
- Autor da publicação: Identifica o usuário responsável pela publicação.
- Data da publicação: Exibe a informação temporal correspondente à publicação.
- Publicação-pai: Identifica a publicação original quando o conteúdo apresentado for uma resposta.
- Indicador de curtida: Indica o estado de curtida da publicação quando aplicável.
- Indicador de salvamento: Indica o estado de salvamento da publicação quando aplicável.

## Critérios de aceite

### Navegação entre as Abas

#### a. Exibição das abas

- O sistema deverá apresentar as abas Posts, Respostas, Curtidas e Salvos no perfil do usuário.
- As quatro abas deverão estar disponíveis para seleção.
- A aba selecionada deverá possuir uma identificação visual que permita ao usuário reconhecer a aba atualmente aberta.
- Ao selecionar uma aba, o sistema deverá apresentar a lista correspondente à categoria selecionada.
- A seleção de uma aba não deverá alterar as informações das demais abas.
- O sistema deverá carregar somente as publicações correspondentes à aba selecionada.
- O usuário deverá conseguir alternar entre as quatro abas.

#### b. Estado da aba

- Ao acessar o perfil, o sistema deverá apresentar a aba definida como padrão pela plataforma.
- A aba padrão deverá ser definida conforme o comportamento estabelecido no protótipo.
- Ao selecionar outra aba, a identificação visual da aba anterior deverá ser removida.
- A aba atualmente selecionada deverá permanecer visualmente identificada.

### Aba Posts

#### a. Publicações primárias

- A aba Posts deverá apresentar as publicações primárias criadas pelo usuário.
- O sistema deverá considerar como Post uma publicação que não possua publicação-pai.
- As publicações deverão pertencer ao usuário autenticado.
- As publicações deverão ser apresentadas em uma lista.
- Uma resposta criada pelo usuário não deverá aparecer na aba Posts.
- Uma publicação que possua publicação-pai não deverá ser apresentada nesta aba.
- A lista deverá apresentar as publicações que atendam aos critérios definidos no momento do carregamento.

#### b. Ordenação dos Posts

- As publicações deverão ser apresentadas em uma ordem definida pelo sistema.
- A ordenação deverá utilizar a data e horário da publicação como referência, conforme padrão definido para a plataforma.
- As publicações deverão ser apresentadas de forma consistente com a ordenação definida.
- A publicação mais recente deverá ocupar a posição correspondente ao critério de ordenação estabelecido.

### Aba Respostas

#### a. Respostas realizadas pelo usuário

- A aba Respostas deverá apresentar as publicações criadas pelo usuário que possuam uma publicação-pai.
- O sistema deverá identificar a publicação-pai associada a cada resposta.
- As respostas deverão pertencer ao usuário autenticado.
- Uma publicação sem publicação-pai não deverá aparecer na aba Respostas.
- As respostas deverão ser apresentadas em uma lista.
- Cada resposta deverá permanecer associada à publicação-pai correspondente.

#### b. Identificação da publicação-pai

- Cada resposta deverá permitir identificar que se trata de uma resposta a outra publicação.
- A publicação-pai deverá ser apresentada ou identificada conforme o padrão visual definido para a plataforma.
- O acesso à resposta deverá preservar a referência à publicação-pai.
- Ao selecionar uma resposta, o sistema deverá permitir que o usuário visualize o contexto correspondente à publicação.

### Aba Curtidas

#### a. Publicações curtidas

- A aba Curtidas deverá apresentar as publicações que o usuário autenticado curtiu.
- O sistema deverá utilizar os registros de curtidas do usuário para determinar quais publicações serão apresentadas.
- Uma publicação deverá aparecer nesta aba enquanto existir uma curtida ativa do usuário.
- Caso o usuário remova a curtida de uma publicação, ela deverá deixar de aparecer na aba Curtidas após a atualização dos dados.
- A aba poderá apresentar publicações criadas pelo próprio usuário.
- A aba poderá apresentar publicações criadas por outros usuários.
- A origem da publicação não deverá alterar sua elegibilidade para a aba Curtidas.

#### b. Estado das curtidas

- As publicações apresentadas na aba Curtidas deverão refletir o estado atual da interação do usuário.
- O sistema deverá identificar a publicação como curtida pelo usuário enquanto a curtida estiver registrada.
- Caso a curtida tenha sido removida, a publicação não deverá continuar sendo apresentada como parte das curtidas do usuário.

### Aba Salvos

#### a. Publicações salvas

- A aba Salvos deverá apresentar as publicações que o usuário autenticado salvou.
- O sistema deverá utilizar os registros de salvamento do usuário para determinar quais publicações serão apresentadas.
- Uma publicação deverá aparecer nesta aba enquanto existir um salvamento ativo do usuário.
- Caso o usuário remova o salvamento de uma publicação, ela deverá deixar de aparecer na aba Salvos após a atualização dos dados.
- A aba poderá apresentar publicações criadas pelo próprio usuário.
- A aba poderá apresentar publicações criadas por outros usuários.
- A origem da publicação não deverá alterar sua elegibilidade para a aba Salvos.

#### b. Estado dos salvamentos

- As publicações apresentadas na aba Salvos deverão refletir o estado atual dos salvamentos do usuário.
- O sistema deverá identificar a publicação como salva pelo usuário enquanto o salvamento estiver registrado.
- Caso o salvamento tenha sido removido, a publicação não deverá continuar sendo apresentada como parte dos conteúdos salvos.

### Visualização das Publicações

#### a. Informações da publicação

- Cada publicação apresentada deverá possuir informações suficientes para identificar seu conteúdo.
- A publicação deverá apresentar o autor correspondente.
- A publicação deverá apresentar seu conteúdo conforme as regras de visualização da plataforma.
- A publicação deverá apresentar a informação temporal correspondente.
- As informações apresentadas deverão corresponder aos dados atuais da publicação.
- O conteúdo da publicação não deverá ser alterado pela visualização da aba.

#### b. Acesso à publicação

- Ao selecionar uma publicação, o sistema deverá direcionar o usuário para a visualização correspondente.
- A publicação acessada deverá ser a mesma selecionada na lista.
- O acesso deverá preservar o contexto necessário para identificar a publicação.
- Caso a publicação seja uma resposta, o acesso deverá preservar sua relação com a publicação-pai.
- O funcionamento interno da tela de publicação não faz parte desta história de usuário.

### Ausência de Publicações

#### a. Aba Posts vazia

- Caso o usuário não possua Posts, o sistema deverá informar que não existem publicações nesta categoria.
- A ausência de Posts não deverá ser considerada um erro.
- O usuário deverá permanecer na aba Posts.
- O sistema deverá permitir que o usuário navegue para as demais abas.

#### b. Aba Respostas vazia

- Caso o usuário não possua Respostas, o sistema deverá informar que não existem respostas nesta categoria.
- A ausência de Respostas não deverá ser considerada um erro.
- O usuário deverá permanecer na aba Respostas.
- O sistema deverá permitir que o usuário navegue para as demais abas.

#### c. Aba Curtidas vazia

- Caso o usuário não tenha curtido nenhuma publicação, o sistema deverá informar que não existem publicações curtidas.
- A ausência de publicações curtidas não deverá ser considerada um erro.
- O usuário deverá permanecer na aba Curtidas.
- O sistema deverá permitir que o usuário navegue para as demais abas.

#### d. Aba Salvos vazia

- Caso o usuário não possua nenhuma publicação salva, o sistema deverá informar que não existem publicações salvas.
- A ausência de publicações salvas não deverá ser considerada um erro.
- O usuário deverá permanecer na aba Salvos.
- O sistema deverá permitir que o usuário navegue para as demais abas.

### Atualização das Listas

#### a. Atualização dos Posts

- A lista de Posts deverá refletir as publicações atualmente existentes do usuário.
- Caso uma nova publicação primária seja criada, ela deverá passar a fazer parte da aba Posts conforme as regras de atualização da plataforma.
- Caso uma publicação primária deixe de estar disponível, ela não deverá continuar sendo apresentada como disponível.
- Respostas não deverão ser adicionadas à aba Posts.

#### b. Atualização das Respostas

- A lista de Respostas deverá refletir as respostas atualmente existentes do usuário.
- Caso o usuário publique uma nova resposta, ela deverá passar a fazer parte da aba Respostas conforme as regras de atualização da plataforma.
- Caso uma resposta deixe de estar disponível, ela não deverá continuar sendo apresentada como disponível.
- Publicações primárias não deverão ser adicionadas à aba Respostas.

#### c. Atualização das Curtidas

- A lista de Curtidas deverá refletir as curtidas atualmente realizadas pelo usuário.
- Ao curtir uma publicação, ela deverá passar a fazer parte da aba Curtidas conforme as regras de atualização da plataforma.
- Ao remover uma curtida, a publicação deverá deixar de fazer parte da aba Curtidas após a atualização.
- A alteração da curtida deverá ser refletida sem criar uma duplicação da publicação na lista.

#### d. Atualização dos Salvos

- A lista de Salvos deverá refletir os salvamentos atualmente realizados pelo usuário.
- Ao salvar uma publicação, ela deverá passar a fazer parte da aba Salvos conforme as regras de atualização da plataforma.
- Ao remover um salvamento, a publicação deverá deixar de fazer parte da aba Salvos após a atualização.
- A alteração do salvamento deverá ser refletida sem criar uma duplicação da publicação na lista.

### Carregamento de Publicações

#### a. Carregamento inicial

- Ao selecionar uma aba, o sistema deverá carregar as publicações correspondentes à categoria.
- O sistema não deverá apresentar publicações pertencentes a outra categoria.
- As publicações deverão ser apresentadas após o carregamento bem-sucedido dos dados.
- O sistema deverá apresentar um estado de carregamento enquanto os dados estiverem sendo obtidos, conforme padrão definido para a plataforma.

#### b. Carregamento adicional

- Caso a quantidade de publicações ultrapasse o limite apresentado inicialmente, o sistema deverá permitir o carregamento das demais publicações conforme o mecanismo definido pela plataforma.
- As publicações adicionais deverão permanecer dentro da categoria correspondente.
- O carregamento adicional não deverá duplicar publicações já apresentadas.
- A ordem definida para a lista deverá ser preservada durante o carregamento adicional.

### Publicações Indisponíveis

#### a. Publicação removida

- Caso uma publicação apresentada na lista deixe de estar disponível, o sistema deverá atualizar sua apresentação conforme as regras da plataforma.
- Uma publicação removida não deverá continuar sendo apresentada como disponível.
- Caso o usuário tente acessar uma publicação que deixou de estar disponível, o sistema deverá informar que a publicação não pode ser acessada.
- A indisponibilidade de uma publicação não deverá impedir o acesso às demais publicações da lista.

#### b. Autor indisponível

- Caso o autor de uma publicação deixe de estar disponível, a publicação deverá seguir as regras definidas para conteúdos associados a usuários indisponíveis.
- A indisponibilidade do autor não deverá causar erro no carregamento das demais publicações.

## Limites de Escopo

### a. Criação e edição

- As abas não deverão permitir a criação de publicações diretamente.
- A edição de publicações não faz parte desta história de usuário.
- A exclusão de publicações não faz parte desta história de usuário.
- As regras de criação, edição e exclusão serão tratadas nas histórias específicas de publicação.

#### b. Curtidas

- A ação de curtir ou remover curtida não faz parte desta história de usuário.
- Esta história deverá apenas utilizar o estado de curtida para determinar quais publicações serão apresentadas na aba Curtidas.

#### c. Salvos

- A ação de salvar ou remover salvamento não faz parte desta história de usuário.
- Esta história deverá apenas utilizar o estado de salvamento para determinar quais publicações serão apresentadas na aba Salvos.

#### d. Respostas

- A criação de respostas não faz parte desta história de usuário.
- A história deverá apenas apresentar as respostas existentes do usuário na aba correspondente.
- A navegação para a publicação-pai deverá utilizar as regras da tela de publicação.

## Mensagens de Erro e Validação

- Caso não exista conexão com a Internet, o sistema deverá informar ao usuário que não foi possível carregar as publicações.
- Caso ocorra um erro ao carregar uma aba, o sistema deverá informar que não foi possível carregar as publicações e permitir que o usuário tente novamente.
- Caso ocorra um erro ao carregar publicações adicionais, o sistema deverá informar que não foi possível carregar mais publicações e permitir uma nova tentativa.
- Caso nenhuma publicação exista na categoria selecionada, o sistema deverá apresentar a mensagem correspondente à ausência de conteúdo, sem considerar a situação como um erro.
- Caso uma publicação selecionada não esteja mais disponível, o sistema deverá informar que a publicação não pode ser acessada.
- Caso ocorra um erro ao acessar uma publicação, o sistema deverá informar que não foi possível acessar a publicação e permitir que o usuário retorne à lista.
- Caso ocorra um erro no carregamento de uma publicação específica, o sistema não deverá impedir o carregamento das demais publicações disponíveis.
- A ocorrência de um erro em uma aba não deverá excluir os dados das demais abas.

# HU011 - Visualização do Perfil de Outro Usuário

Como: Usuário

Quero: Ser capaz de visualizar o perfil de outros usuários

Para que: Eu consiga consultar as informações pessoais, acadêmicas e profissionais de outros usuários, visualizar suas atividades na plataforma e interagir com eles por meio das funcionalidades disponibilizadas pelo sistema.

## Dependências Técnicas:

- O usuário deve estar cadastrado no sistema.
- O usuário deve estar autenticado no sistema.
- O sistema deverá possuir conexão ativa com a Internet.
- O sistema deverá possuir acesso aos dados do perfil do usuário visualizado.
- O sistema deverá armazenar e disponibilizar o username do usuário visualizado.
- O sistema deverá armazenar e disponibilizar o nome do perfil do usuário visualizado.
- O sistema deverá armazenar e disponibilizar a foto de perfil do usuário visualizado, quando cadastrada.
- O sistema deverá armazenar e disponibilizar a biografia do usuário visualizado, quando cadastrada.
- O sistema deverá armazenar e disponibilizar o curso informado pelo usuário visualizado, quando cadastrado.
- O sistema deverá armazenar e disponibilizar a faculdade informada pelo usuário visualizado, quando cadastrada.
- O sistema deverá armazenar e disponibilizar as disciplinas nas quais o usuário visualizado informou possuir dificuldade.
- O sistema deverá armazenar e disponibilizar as disciplinas nas quais o usuário visualizado informou possuir domínio.
- O sistema deverá armazenar e disponibilizar a quantidade de dias consecutivos de login do usuário visualizado.
- O sistema deverá disponibilizar a pontuação atual do usuário visualizado, conforme o algoritmo definido pelo sistema.
- O sistema deverá armazenar e disponibilizar a quantidade de curtidas recebidas pelo usuário visualizado.
- O sistema deverá armazenar e disponibilizar a quantidade de posts e respostas realizadas pelo usuário visualizado.
- O sistema deverá armazenar e disponibilizar a quantidade de seguidores do usuário visualizado.
- O sistema deverá armazenar e disponibilizar a quantidade de usuários que o usuário visualizado segue.
- O sistema deverá permitir o acesso à lista de seguidores do usuário visualizado.
- O sistema deverá permitir o acesso à lista de usuários seguidos pelo usuário visualizado.
- O sistema deverá armazenar e disponibilizar as informações profissionais do usuário visualizado, quando cadastradas.
- O sistema deverá armazenar e disponibilizar as instituições de trabalho informadas pelo usuário visualizado, quando cadastradas.
- O sistema deverá armazenar e disponibilizar os links das redes sociais informadas pelo usuário visualizado, quando cadastrados.
- O sistema deverá permitir a geração de um endereço URL que identifique o perfil do usuário visualizado.
- O sistema deverá permitir a cópia do endereço URL do perfil visualizado.
- O sistema deverá identificar a relação de seguimento entre o usuário autenticado e o usuário visualizado.
- O sistema deverá permitir que o usuário autenticado siga o usuário visualizado.
- O sistema deverá permitir que o usuário autenticado deixe de seguir o usuário visualizado.
- O sistema deverá identificar se o usuário visualizado possui um Histórico Acadêmico conectado e válido.
- O sistema deverá disponibilizar ao perfil o estado de verificação decorrente da conexão do Histórico Acadêmico.
- O funcionamento da visualização do perfil dependerá de uma conexão ativa com a Internet.

## Regras de Negócio:

- O usuário deverá conseguir acessar o perfil de outros usuários por meio da plataforma.
- O perfil deverá apresentar as informações pertencentes ao usuário visualizado.
- O perfil deverá apresentar o username do usuário visualizado.
- O perfil deverá apresentar o nome do perfil do usuário visualizado.
- O username deverá ser apresentado com o caractere @ conforme o padrão visual definido para identificação de usuários.
- A foto de perfil deverá ser apresentada quando o usuário visualizado possuir uma foto cadastrada.
- Caso o usuário visualizado não possua uma foto de perfil cadastrada, o sistema deverá apresentar a representação padrão definida para perfis sem foto.
- A biografia deverá ser apresentada quando o usuário visualizado possuir uma descrição cadastrada.
- O curso deverá ser apresentado quando o usuário visualizado possuir um curso cadastrado.
- A faculdade deverá ser apresentada quando o usuário visualizado possuir uma faculdade cadastrada.
- As disciplinas nas quais o usuário visualizado possui dificuldade deverão ser apresentadas no perfil quando houver informações cadastradas.
- As disciplinas nas quais o usuário visualizado possui domínio deverão ser apresentadas no perfil quando houver informações cadastradas.
- O perfil deverá apresentar a quantidade atual de dias consecutivos de login do usuário visualizado.
- O perfil deverá apresentar a pontuação atual do usuário visualizado.
- A pontuação apresentada deverá corresponder ao valor atualmente armazenado ou calculado pelo sistema.
- O perfil deverá apresentar a quantidade de curtidas recebidas pelo usuário visualizado.
- O perfil deverá apresentar a quantidade de posts e respostas realizadas pelo usuário visualizado.
- O perfil deverá apresentar a quantidade de seguidores do usuário visualizado.
- O perfil deverá apresentar a quantidade de usuários que o usuário visualizado segue.
- A quantidade de seguidores deverá corresponder ao número atual de usuários que seguem o perfil.
- A quantidade de usuários seguidos deverá corresponder ao número atual de perfis seguidos pelo usuário visualizado.
- Ao selecionar a quantidade de seguidores, o sistema deverá abrir uma janela contendo a lista de seguidores do usuário visualizado.
- Ao selecionar a quantidade de usuários seguidos, o sistema deverá abrir uma janela contendo a lista de usuários seguidos pelo usuário visualizado.
- A lista de seguidores deverá apresentar os usuários que seguem o perfil visualizado.
- A lista de usuários seguidos deverá apresentar os usuários que o perfil visualizado segue.
- As funcionalidades internas das listas de seguidores e seguindo que não estejam relacionadas à visualização não fazem parte desta história de usuário.
- As informações de trabalho deverão ser apresentadas somente quando o usuário visualizado possuir trabalho cadastrado.
- A instituição de trabalho deverá ser apresentada quando houver uma instituição cadastrada.
- As redes sociais deverão ser apresentadas somente quando o usuário visualizado tiver informado uma conta correspondente.
- As redes sociais serão opcionais e o usuário visualizado poderá não possuir nenhuma conta vinculada.
- O perfil poderá apresentar contas de GitHub, LinkedIn, Instagram, X, Reddit ou outras redes sociais disponibilizadas pelo sistema.
- Cada conta de rede social deverá ser apresentada somente quando houver informação cadastrada.
- O perfil deverá disponibilizar uma ação para compartilhar a conta.
- A ação de compartilhar a conta deverá gerar ou disponibilizar um URL correspondente ao perfil do usuário visualizado.
- A ação de compartilhar a conta deverá permitir a cópia do URL do perfil.
- O URL compartilhado deverá direcionar para o perfil correspondente do usuário visualizado.
- O perfil deverá disponibilizar uma ação para seguir o usuário visualizado quando o usuário autenticado não o estiver seguindo.
- O perfil deverá disponibilizar uma ação para deixar de seguir o usuário visualizado quando o usuário autenticado já o estiver seguindo.
- A ação de seguir deverá representar visualmente que o usuário autenticado passou a seguir o perfil.
- A ação de deixar de seguir deverá representar visualmente que o usuário autenticado deixou de seguir o perfil.
- A visualização do perfil não deverá permitir a alteração dos dados cadastrais do usuário visualizado.
- As funcionalidades de alteração das informações do perfil fazem parte da HU010.1.
- As abas de Posts e Respostas fazem parte desta visualização e serão especificadas na HU011.1.
- A pontuação do usuário será determinada conforme algoritmo definido posteriormente.
- O cálculo ou definição do algoritmo de pontuação não faz parte desta história de usuário.

## Campos interagíveis

### Tela do Perfil de Outro Usuário:

- Nome do perfil: Identifica o usuário por meio do seu nome de perfil.
- Username: Identifica o usuário por meio do seu nome de usuário (@).
- Foto de perfil: Exibe a imagem de perfil cadastrada pelo usuário visualizado.
- Biografia: Exibe a descrição informada pelo usuário visualizado.
- Curso: Exibe o curso informado pelo usuário visualizado.
- Faculdade: Exibe a instituição de ensino informada pelo usuário visualizado.
- Disciplinas que tem dificuldade: Exibe as disciplinas nas quais o usuário visualizado informou possuir dificuldade.
- Disciplinas que tem domínio: Exibe as disciplinas nas quais o usuário visualizado informou possuir domínio.
- Dias em sequência de login: Exibe a quantidade de dias consecutivos de login do usuário visualizado.
- Pontuação: Exibe a pontuação atual do usuário visualizado.
- Quantidade de curtidas: Exibe a quantidade de curtidas recebidas pelo usuário visualizado.
- Quantidade de posts/respostas: Exibe a quantidade de posts e respostas realizadas pelo usuário visualizado.
- Número de seguidores: Exibe a quantidade de usuários que seguem o perfil e permite acessar a lista de seguidores.
- Número de seguindo: Exibe a quantidade de usuários que o usuário visualizado segue e permite acessar a lista de usuários seguidos.
- Lista de seguidores: Janela que apresenta os usuários que seguem o perfil visualizado.
- Lista de seguindo: Janela que apresenta os usuários seguidos pelo usuário visualizado.
- Trabalho: Exibe o trabalho informado pelo usuário visualizado, quando cadastrado.
- Instituição de trabalho: Exibe a instituição na qual o usuário visualizado trabalha, quando cadastrada.
- Conta do GitHub: Exibe o perfil do usuário visualizado no GitHub, quando informado.
- Conta do LinkedIn: Exibe o perfil do usuário visualizado no LinkedIn, quando informado.
- Conta do Instagram: Exibe o perfil do usuário visualizado no Instagram, quando informado.
- Conta do X: Exibe o perfil do usuário visualizado no X, quando informado.
- Conta do Reddit: Exibe o perfil do usuário visualizado no Reddit, quando informado.
- Botão de seguir: Permite seguir o usuário visualizado.
- Botão de deixar de seguir: Permite deixar de seguir o usuário visualizado.
- Botão de compartilhar perfil: Permite gerar e copiar o URL correspondente ao perfil visualizado.
- Marcação de usuário verificado: Identifica que as informações acadêmicas do usuário visualizado foram validadas por meio de um Histórico Acadêmico conectado ao perfil.
- Abas de Posts e Respostas: Permitem acessar os conteúdos correspondentes do usuário visualizado.

## Critérios de aceite

### Usuário Verificado

#### a. Verificação por Histórico

- Caso o usuário visualizado tenha conectado um Histórico Acadêmico ao seu perfil, o sistema deverá atribuir a marcação de usuário verificado.
- A marcação de usuário verificado deverá indicar que as informações acadêmicas correspondentes foram validadas por meio do Histórico Acadêmico conectado.
- A marcação de usuário verificado deverá ser apresentada próxima ao username do usuário visualizado.
- O sistema deverá apresentar a marcação de usuário verificado somente enquanto existir um Histórico Acadêmico válido e conectado ao perfil.
- Caso o usuário visualizado não possua um Histórico Acadêmico conectado ao perfil, o sistema não deverá apresentar a marcação de usuário verificado.
- A marcação de usuário verificado não deverá ser concedida por outros critérios nesta história de usuário.
- O processo de conexão, validação e atualização do Histórico Acadêmico não faz parte desta história de usuário.

### Visualização do Perfil

#### a. Abertura do perfil

- Ao acessar o perfil de outro usuário, o sistema deverá apresentar o perfil correspondente ao usuário selecionado.
- O sistema deverá identificar o perfil como pertencente a outro usuário.
- O perfil deverá apresentar as informações atuais cadastradas para o usuário visualizado.
- As informações deverão ser apresentadas sem permitir alterações nesta tela.
- A tela deverá apresentar o username do usuário visualizado.
- A tela deverá apresentar a foto de perfil do usuário visualizado, quando cadastrada.
- A tela deverá apresentar a biografia do usuário visualizado, quando cadastrada.
- A tela deverá apresentar o curso do usuário visualizado, quando cadastrado.
- A tela deverá apresentar a faculdade do usuário visualizado, quando cadastrada.
- A tela deverá apresentar as demais informações disponíveis para o perfil conforme as regras desta história.

### Identificação do Usuário

#### a. Username

- O sistema deverá apresentar o username do usuário visualizado.
- O username deverá ser apresentado de acordo com o padrão visual definido para a plataforma.
- O username deverá possuir o caractere @ em sua apresentação.
- O username apresentado deverá corresponder ao username atualmente cadastrado para o usuário visualizado.
- O username não deverá ser editável nesta tela.

#### b. Foto de perfil

- O sistema deverá apresentar a foto de perfil cadastrada pelo usuário visualizado.
- Caso exista uma foto cadastrada, o sistema deverá apresentar a imagem correspondente.
- Caso não exista uma foto cadastrada, o sistema deverá apresentar a representação padrão definida para usuários sem foto.
- A foto apresentada deverá corresponder à foto atualmente cadastrada para o usuário visualizado.
- A alteração da foto de perfil não fará parte desta história de usuário.

#### c. Nome do perfil

- O sistema deverá apresentar o nome do perfil do usuário visualizado.
- O nome deverá ser apresentado de acordo com o padrão visual definido para a plataforma.
- O nome apresentado deverá corresponder ao nome atualmente cadastrado para o usuário visualizado.
- O nome do perfil deverá ser editável pela aba de "Editar perfil"

### Informações Pessoais e Acadêmicas

#### a. Biografia

- O sistema deverá apresentar a biografia cadastrada pelo usuário visualizado.
- A biografia deverá corresponder ao conteúdo atualmente armazenado para o perfil.
- Caso não exista uma biografia cadastrada, o sistema deverá omitir a informação ou apresentar a representação definida para ausência de biografia.
- A biografia não poderá ser alterada nesta tela.

#### b. Curso e faculdade

- O sistema deverá apresentar o curso informado pelo usuário visualizado.
- O sistema deverá apresentar a faculdade informada pelo usuário visualizado.
- As informações apresentadas deverão corresponder aos dados atualmente cadastrados.
- Caso o curso não esteja cadastrado, o sistema deverá omitir a informação ou apresentar a representação definida para ausência de dados.
- Caso a faculdade não esteja cadastrada, o sistema deverá omitir a informação ou apresentar a representação definida para ausência de dados.
- As informações não poderão ser alteradas nesta tela.

### Disciplinas

#### a. Disciplinas que tem dificuldade

- O sistema deverá apresentar as disciplinas que o usuário visualizado informou possuir dificuldade.
- Cada disciplina cadastrada deverá ser identificável individualmente.
- A lista deverá apresentar somente as disciplinas atualmente associadas ao perfil como disciplinas de dificuldade.
- Caso o usuário visualizado não possua disciplinas de dificuldade cadastradas, o sistema deverá omitir a seção ou apresentar a representação definida para ausência de dados.
- As disciplinas não poderão ser alteradas nesta tela.

#### b. Disciplinas que tem domínio

- O sistema deverá apresentar as disciplinas que o usuário visualizado informou possuir domínio.
- Cada disciplina cadastrada deverá ser identificável individualmente.
- A lista deverá apresentar somente as disciplinas atualmente associadas ao perfil como disciplinas de domínio.
- Caso o usuário visualizado não possua disciplinas de domínio cadastradas, o sistema deverá omitir a seção ou apresentar a representação definida para ausência de dados.
- As disciplinas não poderão ser alteradas nesta tela.

#### c. Separação entre dificuldade e domínio

- As disciplinas de dificuldade deverão ser apresentadas separadamente das disciplinas de domínio.
- Uma disciplina deverá ser apresentada na categoria correspondente aos dados cadastrados pelo usuário.
- O sistema não deverá misturar as informações de dificuldade e domínio em uma única seção.

### Estatísticas do Perfil

#### a. Dias em sequência de login

- O sistema deverá apresentar a quantidade atual de dias consecutivos de login do usuário visualizado.
- O valor apresentado deverá corresponder à sequência registrada pelo sistema.
- O cálculo da sequência de login não faz parte desta história de usuário.

#### b. Pontuação

- O sistema deverá apresentar a pontuação atual do usuário visualizado.
- A pontuação deverá corresponder ao valor definido pelo sistema.
- O algoritmo responsável pelo cálculo da pontuação não faz parte desta história de usuário.

#### c. Curtidas

- O sistema deverá apresentar a quantidade de curtidas recebidas pelo usuário visualizado.
- O número apresentado deverá corresponder à quantidade atual de curtidas contabilizadas pelo sistema.
- A visualização detalhada das curtidas não faz parte desta história de usuário.

#### d. Posts e respostas

- O sistema deverá apresentar a quantidade de posts e respostas realizadas pelo usuário visualizado.
- O número apresentado deverá corresponder aos conteúdos contabilizados pelo sistema.
- A visualização dos posts e respostas será realizada por meio das abas especificadas na HU011.1.

### Seguidores e Seguindo

#### a. Quantidade de seguidores

- O sistema deverá apresentar o número atual de seguidores do usuário visualizado.
- O número deverá corresponder à quantidade de usuários que seguem o perfil.
- O número de seguidores deverá possuir uma ação para acesso à lista correspondente.

#### b. Quantidade de seguindo

- O sistema deverá apresentar o número atual de usuários que o usuário visualizado segue.
- O número deverá corresponder à quantidade de perfis seguidos pelo usuário visualizado.
- O número de seguindo deverá possuir uma ação para acesso à lista correspondente.

#### c. Lista de seguidores

- Ao selecionar o número de seguidores, o sistema deverá abrir uma janela contendo a lista de seguidores.
- A lista deverá apresentar os usuários que atualmente seguem o perfil visualizado.
- Cada usuário apresentado deverá ser identificável.
- A lista deverá refletir os seguidores atuais no momento do carregamento.
- Caso o usuário visualizado não possua seguidores, o sistema deverá apresentar uma informação indicando que não existem seguidores.
- A janela deverá possuir uma ação para ser fechada e retornar ao perfil.

#### d. Lista de seguindo

- Ao selecionar o número de seguindo, o sistema deverá abrir uma janela contendo a lista de usuários seguidos pelo usuário visualizado.
- A lista deverá apresentar os usuários que atualmente são seguidos pelo usuário visualizado.
- Cada usuário apresentado deverá ser identificável.
- A lista deverá refletir os perfis atualmente seguidos pelo usuário visualizado no momento do carregamento.
- Caso o usuário visualizado não siga nenhum perfil, o sistema deverá apresentar uma informação indicando que não existem usuários seguidos.
- A janela deverá possuir uma ação para ser fechada e retornar ao perfil.

### Informações Profissionais

#### a. Trabalho

- O sistema deverá apresentar o trabalho informado pelo usuário visualizado quando houver informação cadastrada.
- A informação deverá corresponder ao trabalho atualmente associado ao perfil.
- Caso o usuário visualizado não tenha informado um trabalho, o sistema não deverá apresentar uma informação profissional inexistente.
- A informação de trabalho não poderá ser alterada nesta tela.

#### b. Instituição de trabalho

- O sistema deverá apresentar a instituição de trabalho quando houver informação cadastrada.
- A instituição apresentada deverá corresponder à informação atualmente cadastrada no perfil.
- Caso o usuário visualizado não possua uma instituição de trabalho cadastrada, o sistema deverá omitir a informação ou apresentar a representação definida para ausência de dados.
- A instituição de trabalho não poderá ser alterada nesta tela.

### Redes Sociais

#### a. Contas vinculadas

- O sistema deverá apresentar as contas de redes sociais informadas pelo usuário visualizado.
- As contas deverão ser opcionais.
- O usuário visualizado poderá possuir nenhuma, uma ou várias contas de redes sociais vinculadas.
- O sistema poderá apresentar contas do GitHub, LinkedIn, Instagram, X, Reddit ou outras redes sociais disponibilizadas pela plataforma.
- Cada rede social deverá ser apresentada somente quando possuir uma conta cadastrada.
- A ausência de uma conta em determinada rede social não deverá ser considerada um erro.
- As contas apresentadas deverão corresponder às informações atualmente cadastradas no perfil.

#### b. Acesso às redes sociais

- As contas de redes sociais apresentadas deverão permitir acesso à conta correspondente quando houver um endereço válido cadastrado.
- O acesso deverá utilizar o endereço associado à conta informada pelo usuário visualizado.
- O sistema não deverá apresentar uma conta de rede social que não possua informação cadastrada.

### Seguir e Deixar de Seguir

#### a. Seguir usuário

- Caso o usuário autenticado não siga o usuário visualizado, o sistema deverá apresentar a ação de Seguir.
- Ao selecionar a ação de Seguir, o sistema deverá registrar a relação de seguimento conforme as regras da plataforma.
- Após a ação ser concluída, o botão deverá apresentar o estado correspondente a usuário seguido.
- O sistema deverá atualizar a relação entre os usuários conforme o novo estado.
- A ação não deverá alterar os demais dados do perfil visualizado.

#### b. Deixar de seguir usuário

- Caso o usuário autenticado siga o usuário visualizado, o sistema deverá apresentar a ação de Deixar de seguir.
- Ao selecionar a ação de Deixar de seguir, o sistema deverá alterar a relação de seguimento conforme as regras da plataforma.
- Após a ação ser concluída, o botão deverá voltar ao estado de Seguir.
- O sistema deverá atualizar a relação entre os usuários conforme o novo estado.
- A ação não deverá alterar os demais dados do perfil visualizado.

### Compartilhamento do Perfil

#### a. Geração do URL

- O sistema deverá disponibilizar um botão ou ação para compartilhar o perfil do usuário visualizado.
- Ao selecionar a ação de compartilhar, o sistema deverá gerar ou disponibilizar o URL correspondente ao perfil.
- O URL deverá identificar exclusivamente o perfil do usuário visualizado.
- O URL deverá permanecer associado ao perfil correspondente enquanto o identificador utilizado permanecer válido.

#### b. Cópia do URL

- O usuário deverá conseguir copiar o URL do perfil visualizado.
- Ao selecionar a ação de copiar, o sistema deverá copiar o endereço correspondente para a área de transferência.
- O conteúdo copiado deverá corresponder ao URL do perfil do usuário visualizado.
- A cópia do URL não deverá alterar nenhuma informação do perfil.

#### c. Acesso pelo URL

- O URL compartilhado deverá direcionar para o perfil correspondente ao usuário.
- O acesso ao URL deverá utilizar o identificador do perfil para localizar o usuário correspondente.
- Caso o perfil esteja disponível, o sistema deverá apresentar o perfil correspondente.

### Abas de Posts e Respostas

#### a. Acesso às abas

- O sistema deverá apresentar as abas Posts e Respostas no perfil do usuário visualizado.
- As duas abas deverão estar disponíveis para seleção conforme as regras de acesso da plataforma.
- A aba selecionada deverá possuir uma identificação visual que permita ao usuário reconhecer a aba atualmente aberta.
- Ao selecionar uma aba, o sistema deverá apresentar o conteúdo correspondente.
- O funcionamento detalhado das abas será especificado na HU011.1.

### Dados Opcionais

#### a. Ausência de informações

- O usuário visualizado poderá não possuir biografia cadastrada.
- O usuário visualizado poderá não possuir curso cadastrado.
- O usuário visualizado poderá não possuir faculdade cadastrada.
- O usuário visualizado poderá não possuir disciplinas de dificuldade cadastradas.
- O usuário visualizado poderá não possuir disciplinas de domínio cadastradas.
- O usuário visualizado poderá não possuir trabalho cadastrado.
- O usuário visualizado poderá não possuir instituição de trabalho cadastrada.
- O usuário visualizado poderá não possuir contas de redes sociais cadastradas.
- O usuário visualizado poderá não possuir seguidores.
- O usuário visualizado poderá não seguir nenhum usuário.
- A ausência dessas informações não deverá impedir a visualização do restante do perfil.
- O sistema deverá apresentar somente as informações disponíveis ou utilizar a representação definida para campos sem dados.

## Limites de Escopo

### a. Edição do perfil

- A visualização do perfil de outro usuário não deverá permitir a edição das informações apresentadas.
- Não deverá existir nesta história uma ação para alterar username, foto, biografia, curso, faculdade, disciplinas, trabalho, instituição de trabalho ou redes sociais do usuário visualizado.
- A funcionalidade de edição do próprio perfil será especificada na HU010.1.

#### b. Abas de conteúdo

- As abas de Posts e Respostas fazem parte desta funcionalidade.
- O funcionamento detalhado das abas será especificado na HU011.1.
- Não existirão abas de Curtidas ou Salvos no perfil de outro usuário nesta funcionalidade.

## Mensagens de Erro e Validação

- Caso não exista conexão com a Internet, o sistema deverá informar ao usuário que não foi possível carregar o perfil.
- Caso ocorra um erro durante o carregamento das informações do perfil, o sistema deverá informar que não foi possível carregar os dados e permitir que o usuário tente novamente.
- Caso uma informação específica do perfil não possa ser carregada, o sistema deverá informar ou representar a indisponibilidade conforme o padrão definido para a plataforma.
- A indisponibilidade de uma informação específica não deverá impedir a apresentação das demais informações que tenham sido carregadas corretamente.
- Caso ocorra um erro ao carregar a lista de seguidores, o sistema deverá informar que não foi possível carregar os seguidores e permitir que o usuário tente novamente.
- Caso ocorra um erro ao carregar a lista de usuários seguidos, o sistema deverá informar que não foi possível carregar a lista de seguindo e permitir que o usuário tente novamente.
- Caso ocorra um erro ao seguir o usuário, o sistema deverá informar que não foi possível seguir o usuário e permitir uma nova tentativa.
- Caso ocorra um erro ao deixar de seguir o usuário, o sistema deverá informar que não foi possível deixar de seguir o usuário e permitir uma nova tentativa.
- Caso ocorra um erro ao gerar o URL do perfil, o sistema deverá informar que não foi possível compartilhar o perfil e permitir que o usuário tente novamente.
- Caso ocorra um erro ao copiar o URL do perfil, o sistema deverá informar que não foi possível copiar o endereço e permitir que o usuário tente novamente.
- Caso uma conta de rede social cadastrada não esteja disponível para acesso, o sistema deverá informar ou tratar a indisponibilidade conforme o padrão definido pela plataforma.
- Caso ocorra um erro durante o carregamento do perfil, o sistema não deverá excluir ou alterar os dados cadastrados do usuário visualizado.
- A visualização do perfil não deverá permitir alterações nos dados cadastrais do usuário visualizado em caso de erro.

# HU011.1 - Abas de Posts e Respostas de Outro Usuário

Como: Usuário

Quero: Ser capaz de visualizar as publicações e respostas de outro usuário

Para que: Eu consiga consultar as atividades e os conteúdos publicados pelo usuário na plataforma.

## Dependências Técnicas:

- O usuário deve estar cadastrado e autenticado no sistema.
- O sistema deverá possuir conexão ativa com a Internet.
- O sistema deverá possuir acesso ao perfil do usuário que está sendo visualizado.
- O sistema deverá identificar o usuário correspondente ao perfil acessado.
- O sistema deverá identificar quais publicações foram criadas diretamente pelo usuário visualizado.
- O sistema deverá identificar quais publicações possuem outra publicação como publicação-pai.
- O sistema deverá armazenar a relação entre uma resposta e sua publicação-pai.
- O sistema deverá permitir a recuperação das publicações correspondentes a cada categoria.
- O sistema deverá permitir a ordenação das publicações conforme o critério definido para cada aba.
- O sistema deverá permitir o acesso à publicação selecionada.
- O sistema deverá identificar se o usuário visualizado está bloqueado pelo usuário autenticado.
- O sistema deverá identificar se o usuário autenticado está bloqueado pelo usuário visualizado.
- O sistema deverá aplicar as regras de visibilidade de conteúdo decorrentes de bloqueios.
- O funcionamento das abas dependerá de uma conexão ativa com a Internet.

## Regras de Negócio:

- O perfil de outro usuário deverá possuir duas abas de conteúdo: Posts e Respostas.
- As abas deverão apresentar somente publicações pertencentes à categoria correspondente.
- A aba Posts deverá apresentar as publicações primárias criadas pelo usuário visualizado.
- Uma publicação deverá ser considerada um Post quando não possuir uma publicação-pai.
- A aba Posts não deverá apresentar respostas realizadas pelo usuário visualizado.
- A aba Respostas deverá apresentar as publicações criadas pelo usuário visualizado que possuam uma publicação-pai.
- Uma publicação deverá ser considerada uma Resposta quando estiver vinculada a uma publicação-pai.
- A aba Respostas não deverá apresentar publicações primárias do usuário visualizado que não possuam publicação-pai.
- As publicações deverão permanecer associadas à categoria correspondente enquanto atenderem aos critérios definidos.
- A exclusão ou indisponibilidade de uma publicação deverá seguir as regras definidas para publicações e poderá alterar sua disponibilidade nas abas correspondentes.
- As abas deverão refletir o estado atual das publicações do usuário visualizado.
- As abas não deverão permitir a criação de uma nova publicação diretamente por meio desta história de usuário.
- As funcionalidades de criação, edição, exclusão, curtida, salvamento e resposta de publicações não fazem parte desta história de usuário.
- Ao selecionar uma publicação, o sistema deverá direcionar o usuário para a visualização correspondente da publicação.
- O funcionamento interno da tela de publicação não faz parte desta história de usuário.
- Caso o usuário autenticado esteja bloqueado pelo usuário visualizado, o sistema deverá aplicar as regras de acesso definidas para usuários bloqueados.
- Caso o usuário visualizado esteja bloqueado pelo usuário autenticado, o sistema deverá aplicar as regras de acesso definidas para usuários bloqueados.
- O sistema não deverá disponibilizar conteúdo que esteja impedido pelas regras de bloqueio da plataforma.

## Campos interagíveis:

### Abas do Perfil:

- Aba Posts: Permite visualizar as publicações primárias criadas pelo usuário visualizado.
- Aba Respostas: Permite visualizar as respostas criadas pelo usuário visualizado.

### Lista de Publicações:

- Publicação: Exibe uma publicação pertencente à categoria selecionada.
- Área da publicação: Permite acessar a publicação correspondente.
- Conteúdo da publicação: Exibe o conteúdo da publicação conforme as regras da plataforma.
- Autor da publicação: Identifica o usuário responsável pela publicação.
- Data da publicação: Exibe a informação temporal correspondente à publicação.
- Publicação-pai: Identifica a publicação original quando o conteúdo apresentado for uma resposta.

## Critérios de aceite

### Navegação entre as Abas

#### a. Exibição das abas

- O sistema deverá apresentar as abas Posts e Respostas no perfil do usuário visualizado.
- As duas abas deverão estar disponíveis para seleção quando o conteúdo estiver disponível para visualização.
- A aba selecionada deverá possuir uma identificação visual que permita ao usuário reconhecer a aba atualmente aberta.
- Ao selecionar uma aba, o sistema deverá apresentar a lista correspondente à categoria selecionada.
- A seleção de uma aba não deverá alterar as informações da outra aba.
- O sistema deverá carregar somente as publicações correspondentes à aba selecionada.
- O usuário deverá conseguir alternar entre as duas abas enquanto possuir permissão para visualizar o perfil.

#### b. Estado da aba

- Ao acessar o perfil de outro usuário, o sistema deverá apresentar a aba definida como padrão pela plataforma.
- A aba padrão deverá ser definida conforme o comportamento estabelecido no protótipo.
- Ao selecionar outra aba, a identificação visual da aba anterior deverá ser removida.
- A aba atualmente selecionada deverá permanecer visualmente identificada.

### Aba Posts

#### a. Publicações primárias

- A aba Posts deverá apresentar as publicações primárias criadas pelo usuário visualizado.
- O sistema deverá considerar como Post uma publicação que não possua publicação-pai.
- As publicações deverão pertencer ao usuário correspondente ao perfil acessado.
- As publicações deverão ser apresentadas em uma lista.
- Uma resposta criada pelo usuário visualizado não deverá aparecer na aba Posts.
- Uma publicação que possua publicação-pai não deverá ser apresentada nesta aba.
- A lista deverá apresentar as publicações que atendam aos critérios definidos no momento do carregamento.
- O sistema não deverá apresentar Posts que estejam indisponíveis para o usuário autenticado.

#### b. Ordenação dos Posts

- As publicações deverão ser apresentadas em uma ordem definida pelo sistema.
- A ordenação deverá utilizar a data e horário da publicação como referência, conforme padrão definido para a plataforma.
- As publicações deverão ser apresentadas de forma consistente com a ordenação definida.
- A publicação mais recente deverá ocupar a posição correspondente ao critério de ordenação estabelecido.

### Aba Respostas

#### a. Respostas realizadas pelo usuário

- A aba Respostas deverá apresentar as publicações criadas pelo usuário visualizado que possuam uma publicação-pai.
- O sistema deverá identificar a publicação-pai associada a cada resposta.
- As respostas deverão pertencer ao usuário correspondente ao perfil acessado.
- Uma publicação sem publicação-pai não deverá aparecer na aba Respostas.
- As respostas deverão ser apresentadas em uma lista.
- Cada resposta deverá permanecer associada à publicação-pai correspondente.
- O sistema não deverá apresentar respostas que estejam indisponíveis para o usuário autenticado.

#### b. Identificação da publicação-pai

- Cada resposta deverá permitir identificar que se trata de uma resposta a outra publicação.
- A publicação-pai deverá ser apresentada ou identificada conforme o padrão visual definido para a plataforma.
- O acesso à resposta deverá preservar a referência à publicação-pai.
- Ao selecionar uma resposta, o sistema deverá permitir que o usuário visualize o contexto correspondente à publicação, respeitando as regras de acesso da plataforma.
- Caso a publicação-pai não esteja disponível, o sistema deverá aplicar o comportamento definido para publicações indisponíveis.

### Visualização das Publicações

#### a. Informações da publicação

- Cada publicação apresentada deverá possuir informações suficientes para identificar seu conteúdo.
- A publicação deverá apresentar o autor correspondente.
- A publicação deverá apresentar seu conteúdo conforme as regras da plataforma.
- A publicação deverá apresentar a informação temporal correspondente.
- As informações apresentadas deverão corresponder aos dados atuais da publicação.
- O conteúdo da publicação não deverá ser alterado pela visualização da aba.
- Caso a publicação seja uma resposta, deverá ser possível identificar sua relação com a publicação-pai conforme o padrão visual da plataforma.

#### b. Acesso à publicação

- Ao selecionar uma publicação, o sistema deverá direcionar o usuário para a visualização correspondente.
- A publicação acessada deverá ser a mesma selecionada na lista.
- O acesso deverá preservar o contexto necessário para identificar a publicação.
- Caso a publicação seja uma resposta, o acesso deverá preservar sua relação com a publicação-pai.
- O funcionamento interno da tela de publicação não faz parte desta história de usuário.
- Caso a publicação não esteja mais disponível, o sistema deverá informar sua indisponibilidade conforme as regras da plataforma.

### Ausência de Publicações

#### a. Aba Posts vazia

- Caso o usuário visualizado não possua Posts disponíveis para visualização, o sistema deverá informar que não existem publicações nesta categoria.
- A ausência de Posts não deverá ser considerada um erro.
- O usuário deverá permanecer na aba Posts.
- O sistema deverá permitir que o usuário navegue para a aba Respostas.

#### b. Aba Respostas vazia

- Caso o usuário visualizado não possua Respostas disponíveis para visualização, o sistema deverá informar que não existem respostas nesta categoria.
- A ausência de Respostas não deverá ser considerada um erro.
- O usuário deverá permanecer na aba Respostas.
- O sistema deverá permitir que o usuário navegue para a aba Posts.

### Atualização das Listas

#### a. Atualização dos Posts

- A lista de Posts deverá refletir as publicações atualmente disponíveis do usuário visualizado.
- Caso uma nova publicação primária seja criada pelo usuário visualizado, ela deverá passar a fazer parte da aba Posts conforme as regras de atualização da plataforma.
- Caso uma publicação primária deixe de estar disponível, ela não deverá continuar sendo apresentada como disponível.
- Respostas não deverão ser adicionadas à aba Posts.

#### b. Atualização das Respostas

- A lista de Respostas deverá refletir as respostas atualmente disponíveis do usuário visualizado.
- Caso o usuário visualizado publique uma nova resposta, ela deverá passar a fazer parte da aba Respostas conforme as regras de atualização da plataforma.
- Caso uma resposta deixe de estar disponível, ela não deverá continuar sendo apresentada como disponível.
- Publicações primárias não deverão ser adicionadas à aba Respostas.

### Carregamento de Publicações

#### a. Carregamento inicial

- Ao selecionar uma aba, o sistema deverá carregar as publicações correspondentes à categoria.
- O sistema não deverá apresentar publicações pertencentes à outra categoria.
- As publicações deverão ser apresentadas após o carregamento bem-sucedido dos dados.
- O sistema deverá apresentar um estado de carregamento enquanto os dados estiverem sendo obtidos, conforme padrão definido para a plataforma.
- O sistema deverá aplicar as regras de visibilidade antes de apresentar as publicações ao usuário autenticado.

#### b. Carregamento adicional

- Caso a quantidade de publicações ultrapasse o limite apresentado inicialmente, o sistema deverá permitir o carregamento das demais publicações conforme o mecanismo definido pela plataforma.
- As publicações adicionais deverão permanecer dentro da categoria correspondente.
- O carregamento adicional não deverá duplicar publicações já apresentadas.
- A ordem definida para a lista deverá ser preservada durante o carregamento adicional.
- As regras de visibilidade deverão ser aplicadas também às publicações carregadas posteriormente.

### Publicações Indisponíveis

#### a. Publicação removida

- Caso uma publicação apresentada na lista deixe de estar disponível, o sistema deverá atualizar sua apresentação conforme as regras da plataforma.
- Uma publicação removida não deverá continuar sendo apresentada como disponível.
- Caso o usuário tente acessar uma publicação que deixou de estar disponível, o sistema deverá informar que a publicação não pode ser acessada.
- A indisponibilidade de uma publicação não deverá impedir o acesso às demais publicações da lista.

#### b. Autor indisponível

- Caso o autor de uma publicação deixe de estar disponível, a publicação deverá seguir as regras definidas para conteúdos associados a usuários indisponíveis.
- A indisponibilidade do autor não deverá causar erro no carregamento das demais publicações.
- Caso a indisponibilidade do autor impeça a apresentação da publicação, o sistema deverá removê-la da lista conforme as regras da plataforma.

### Bloqueio entre Usuários

#### a. Usuário visualizado bloqueado pelo usuário autenticado

- Caso o usuário autenticado tenha bloqueado o usuário visualizado, o sistema deverá aplicar as regras de bloqueio definidas para a plataforma.
- O sistema não deverá apresentar conteúdos que estejam indisponíveis em razão do bloqueio.
- Caso o bloqueio impeça a visualização das abas, o sistema deverá informar a indisponibilidade do conteúdo conforme o comportamento definido para usuários bloqueados.
- O bloqueio não deverá ser considerado um erro de carregamento.

#### b. Usuário autenticado bloqueado pelo usuário visualizado

- Caso o usuário visualizado tenha bloqueado o usuário autenticado, o sistema deverá impedir o acesso aos conteúdos que estejam restritos pelo bloqueio.
- O sistema deverá respeitar as regras de privacidade e bloqueio definidas pela plataforma.
- O sistema não deverá disponibilizar publicações ou respostas que estejam protegidas pelo bloqueio.
- Caso o perfil deixe de estar acessível em razão do bloqueio, o sistema deverá aplicar o comportamento definido para perfis indisponíveis.

#### c. Alteração do estado de bloqueio

- Caso o estado de bloqueio seja alterado enquanto o perfil estiver aberto, o sistema deverá aplicar as novas regras de acesso conforme a atualização dos dados.
- O desbloqueio não deverá conceder ao usuário autenticado qualquer permissão adicional além das definidas pelas regras da plataforma.

## Limites de Escopo

### a. Criação e edição

- As abas não deverão permitir a criação de publicações diretamente.
- A edição de publicações não faz parte desta história de usuário.
- A exclusão de publicações não faz parte desta história de usuário.
- As regras de criação, edição e exclusão serão tratadas nas histórias específicas de publicação.

#### b. Curtidas

- A ação de curtir ou remover curtida não faz parte desta história de usuário.
- A relação de curtida de qualquer usuário não será utilizada para determinar o conteúdo das abas desta história.

#### c. Salvos

- A ação de salvar ou remover salvamento não faz parte desta história de usuário.
- A relação de salvamento de qualquer usuário não será utilizada para determinar o conteúdo das abas desta história.

#### d. Respostas

- A criação de respostas não faz parte desta história de usuário.
- A história deverá apenas apresentar as respostas existentes do usuário visualizado na aba correspondente.
- A navegação para a publicação-pai deverá utilizar as regras da tela de publicação.

#### e. Perfil de outro usuário

- As informações gerais do perfil, como username, foto, biografia, curso, faculdade, disciplinas, estatísticas, seguidores, seguindo, informações profissionais e redes sociais, não fazem parte desta história de usuário.
- As ações de seguir, deixar de seguir, enviar mensagem, bloquear, desbloquear, denunciar e compartilhar o perfil não fazem parte desta história de usuário.
- Essas funcionalidades serão tratadas na HU011.

## Mensagens de Erro e Validação

- Caso não exista conexão com a Internet, o sistema deverá informar ao usuário que não foi possível carregar as publicações.
- Caso ocorra um erro ao carregar uma aba, o sistema deverá informar que não foi possível carregar as publicações e permitir que o usuário tente novamente.
- Caso ocorra um erro ao carregar publicações adicionais, o sistema deverá informar que não foi possível carregar mais publicações e permitir uma nova tentativa.
- Caso nenhuma publicação esteja disponível na categoria selecionada, o sistema deverá apresentar a mensagem correspondente à ausência de conteúdo, sem considerar a situação como um erro.
- Caso uma publicação selecionada não esteja mais disponível, o sistema deverá informar que a publicação não pode ser acessada.
- Caso ocorra um erro ao acessar uma publicação, o sistema deverá informar que não foi possível acessar a publicação e permitir que o usuário retorne à lista.
- Caso ocorra um erro no carregamento de uma publicação específica, o sistema não deverá impedir o carregamento das demais publicações disponíveis.
- Caso o acesso ao conteúdo esteja impedido por bloqueio, o sistema deverá apresentar o comportamento definido para usuários bloqueados.
- A ocorrência de um erro em uma aba não deverá excluir os dados da outra aba.
- A ocorrência de erro durante o carregamento das abas não deverá alterar as publicações armazenadas para o usuário visualizado.

# HU011.2 - Bloqueio de Outro Usuário (melhoria futura; fora da versão 1.0)

Como: Usuário

Quero: Ser capaz de bloquear e desbloquear outros usuários

Para que: Eu consiga controlar minhas interações com outros usuários, impedindo que um usuário bloqueado estabeleça relações de seguimento comigo na plataforma.

## Dependências Técnicas:

- O usuário deve estar cadastrado e autenticado no sistema.
- O sistema deverá possuir conexão ativa com a Internet.
- O sistema deverá possuir acesso aos dados do usuário autenticado.
- O sistema deverá possuir acesso aos dados do usuário que será bloqueado ou desbloqueado.
- O sistema deverá armazenar a relação de bloqueio entre usuários.
- O sistema deverá permitir identificar se o usuário autenticado bloqueou outro usuário.
- O sistema deverá permitir identificar se o usuário autenticado está bloqueado por outro usuário.
- O sistema deverá permitir a criação de uma relação de bloqueio entre dois usuários.
- O sistema deverá permitir a remoção de uma relação de bloqueio entre dois usuários.
- O sistema deverá permitir a atualização das relações de seguir e deixar de seguir em decorrência de um bloqueio.
- O sistema deverá permitir a atualização do estado dos botões de interação conforme a existência ou ausência de bloqueio.
- O funcionamento do bloqueio e desbloqueio dependerá de uma conexão ativa com a Internet.

## Regras de Negócio:

- O usuário poderá bloquear outro usuário por meio do perfil do usuário correspondente.
- O bloqueio deverá ser realizado somente entre usuários diferentes.
- O usuário não poderá bloquear o próprio perfil.
- O bloqueio deverá criar uma relação entre o usuário autenticado e o usuário bloqueado.
- A relação de bloqueio deverá permanecer ativa até que o usuário bloqueador realize o desbloqueio.
- Quando um usuário bloquear outro usuário, ambos deverão deixar de se seguir automaticamente.
- O bloqueio deverá remover a relação de seguindo do usuário bloqueador em relação ao usuário bloqueado.
- O bloqueio deverá remover a relação de seguindo do usuário bloqueado em relação ao usuário bloqueador.
- A quantidade de seguidores e seguindo dos usuários envolvidos deverá ser atualizada conforme a remoção das relações de seguimento.
- O usuário bloqueado não deverá continuar aparecendo como seguidor do usuário que realizou o bloqueio.
- O usuário bloqueado não deverá continuar sendo seguido pelo usuário que realizou o bloqueio.
- O bloqueio deverá impedir o estabelecimento ou manutenção de uma relação de seguimento entre os usuários enquanto estiver ativo.
- O usuário bloqueado deverá apresentar a ação "Desbloquear" no lugar das ações relacionadas a seguir ou deixar de seguir.
- O botão de bloqueio disponível no menu de três pontinhos deverá apresentar a ação correspondente ao estado atual do bloqueio.
- Caso o usuário esteja bloqueado, a ação deverá ser apresentada como "Desbloquear".
- Ao desbloquear um usuário, a relação de bloqueio deverá ser removida.
- O desbloqueio não deverá restaurar automaticamente a relação de seguimento existente antes do bloqueio.
- Após o desbloqueio, caso o usuário queira seguir novamente o outro usuário, deverá realizar uma nova ação de seguir.
- O usuário desbloqueado não deverá ser automaticamente seguido pelo usuário que realizou o desbloqueio.
- O usuário desbloqueado não deverá automaticamente voltar a seguir o usuário que realizou o desbloqueio.
- O desbloqueio deverá remover a restrição decorrente do bloqueio, sem restaurar automaticamente relações ou interações anteriores.
- O bloqueio deverá permanecer associado aos usuários mesmo que um deles saia e entre novamente na plataforma.
- O estado de bloqueio deverá ser refletido nas telas de perfil e nas demais funcionalidades que dependam da relação entre os usuários.
- O bloqueio deverá prevalecer sobre as ações de seguir e deixar de seguir enquanto estiver ativo.
- O usuário bloqueado não deverá conseguir restabelecer a relação de seguimento enquanto o bloqueio estiver ativo.

## Campos interagíveis

### Menu de Interações do Perfil:

- Botão de três pontinhos: Abre o menu de ações disponíveis para interação com outro usuário.
- Botão de bloquear: Permite bloquear o usuário correspondente.
- Botão de desbloquear: Permite remover o bloqueio existente sobre o usuário correspondente.
- Botão de seguir: Permite seguir o usuário quando não existir uma relação de bloqueio.
- Botão de deixar de seguir: Permite deixar de seguir o usuário quando não existir uma relação de bloqueio.

### Estado de Bloqueio:

- Indicador de bloqueio: Identifica que existe uma relação de bloqueio entre os usuários.
- Botão "Desbloquear": Permite remover o bloqueio existente.
- Estado bloqueado do botão de seguir: Impede que o usuário siga ou deixe de seguir o usuário bloqueado enquanto o bloqueio estiver ativo.

## Critérios de aceite

### Bloqueio de Usuário

#### a. Acesso à ação de bloqueio

- O usuário deverá conseguir acessar a ação de bloqueio por meio do botão de três pontinhos disponível no perfil de outro usuário.
- Ao selecionar o botão de três pontinhos, o sistema deverá apresentar a opção de bloquear quando não existir um bloqueio entre os usuários.
- A opção de bloqueio deverá identificar claramente a ação que será realizada.
- Ao selecionar a opção de bloquear, o sistema deverá iniciar o processo de bloqueio do usuário correspondente.
- O sistema deverá impedir que o usuário bloqueie o próprio perfil.

#### b. Confirmação do bloqueio

- Ao selecionar a ação de bloquear, o sistema deverá seguir o comportamento de confirmação definido pela plataforma.
- Caso a plataforma utilize uma confirmação antes do bloqueio, o sistema deverá apresentar uma mensagem informando a consequência da ação.
- A confirmação deverá permitir que o usuário confirme ou cancele o bloqueio.
- Caso o usuário cancele a ação, nenhuma relação de bloqueio deverá ser criada.
- Caso o usuário confirme a ação, o sistema deverá registrar o bloqueio.

#### c. Aplicação do bloqueio

- Após a confirmação, o usuário correspondente deverá ser considerado bloqueado.
- O estado de bloqueio deverá ser refletido imediatamente após o salvamento bem-sucedido.
- O botão de bloqueio deverá passar a apresentar a ação "Desbloquear".
- O estado das ações de seguir e deixar de seguir deverá ser atualizado conforme as regras de bloqueio.
- O sistema deverá atualizar as relações de seguimento afetadas pelo bloqueio.

### Relação de Seguimento

#### a. Remoção automática do seguimento

- Ao bloquear um usuário, o sistema deverá verificar a existência de uma relação de seguimento entre os usuários.
- Caso o usuário autenticado siga o usuário bloqueado, essa relação deverá ser removida.
- Caso o usuário bloqueado siga o usuário autenticado, essa relação deverá ser removida.
- Caso ambos os usuários se sigam, ambas as relações deverão ser removidas.
- As quantidades de seguidores e seguindo deverão ser atualizadas após a remoção das relações.
- O bloqueio não deverá permitir que uma nova relação de seguimento seja criada enquanto estiver ativo.

#### b. Estado das ações de seguir

- Enquanto o bloqueio estiver ativo, o usuário bloqueador não deverá possuir uma ação funcional para seguir o usuário bloqueado.
- O usuário bloqueado também não deverá conseguir estabelecer uma relação de seguimento com o usuário que realizou o bloqueio.
- O sistema deverá impedir que a relação de seguimento seja recriada por meio de outras áreas da plataforma enquanto o bloqueio estiver ativo.
- O estado visual das ações deverá indicar que a relação está impedida pelo bloqueio.

### Desbloqueio de Usuário

#### a. Acesso à ação de desbloqueio

- Ao acessar o menu de três pontinhos de um usuário bloqueado, o sistema deverá apresentar a opção "Desbloquear".
- A opção de desbloqueio deverá substituir a opção de bloqueio enquanto existir uma relação de bloqueio ativa.
- O usuário deverá conseguir selecionar a ação de desbloqueio.
- Ao selecionar a ação, o sistema deverá iniciar o processo de remoção do bloqueio.

#### b. Confirmação do desbloqueio

- Ao selecionar a ação de desbloquear, o sistema deverá seguir o comportamento de confirmação definido pela plataforma.
- Caso seja utilizada confirmação, o sistema deverá informar que o bloqueio será removido.
- Caso o usuário cancele a ação, o bloqueio deverá permanecer ativo.
- Caso o usuário confirme a ação, o sistema deverá remover a relação de bloqueio.

#### c. Aplicação do desbloqueio

- Após o desbloqueio, o usuário deverá deixar de ser considerado bloqueado.
- A opção "Desbloquear" deverá deixar de ser apresentada.
- O menu de três pontinhos deverá voltar a apresentar a opção "Bloquear".
- A remoção do bloqueio deverá permitir que novas relações entre os usuários sejam estabelecidas conforme as regras da plataforma.
- O desbloqueio não deverá restaurar automaticamente o seguimento existente antes do bloqueio.
- O desbloqueio não deverá restaurar automaticamente qualquer relação de seguimento removida pelo bloqueio.
- O usuário deverá precisar realizar novamente a ação de seguir caso queira seguir o usuário desbloqueado.

### Persistência do Bloqueio

#### a. Manutenção do estado

- O sistema deverá manter o bloqueio registrado enquanto ele não for removido pelo usuário bloqueador.
- O estado de bloqueio deverá permanecer após o usuário sair da plataforma.
- O estado de bloqueio deverá permanecer após o usuário realizar novo login.
- O sistema deverá consultar o estado atual do bloqueio ao carregar o perfil de outro usuário.
- O estado apresentado deverá corresponder à relação de bloqueio atualmente registrada.

### Atualização das Relações

#### a. Seguidores e seguindo

- Ao bloquear um usuário, as relações de seguimento afetadas deverão ser removidas.
- A quantidade de seguidores deverá ser atualizada conforme as relações removidas.
- A quantidade de usuários seguidos deverá ser atualizada conforme as relações removidas.
- O usuário bloqueado não deverá continuar aparecendo nas listas de seguidores ou seguindo quando a relação correspondente tiver sido removida pelo bloqueio.
- Após o desbloqueio, as relações removidas não deverão ser restauradas automaticamente.

#### b. Estado do perfil

- O perfil deverá apresentar o estado correspondente ao bloqueio atual.
- Caso o usuário esteja bloqueado, a ação disponível deverá ser "Desbloquear".
- Caso o usuário não esteja bloqueado, a ação deverá voltar a ser "Bloquear".
- O estado deverá permanecer consistente entre o perfil, o menu de três pontinhos e as funcionalidades de interação.

## Limites de Escopo

### a. Seguimento

- Esta história deverá tratar somente dos efeitos do bloqueio sobre as relações de seguir e deixar de seguir.
- A criação de uma relação de seguimento não faz parte desta história de usuário.
- A remoção manual de uma relação de seguimento não faz parte desta história de usuário.
- As funcionalidades específicas de seguir e deixar de seguir serão tratadas nas histórias correspondentes.

### b. Perfil

- A visualização das informações do perfil de outro usuário não faz parte desta história de usuário.
- A edição do perfil de outro usuário não faz parte desta história de usuário.
- As informações apresentadas no perfil serão tratadas pela HU011.

### c. Denúncia

- A funcionalidade de denunciar um usuário não faz parte desta história de usuário.
- A opção de denúncia poderá permanecer disponível no menu de três pontinhos, conforme as regras definidas pela plataforma.
- As regras de denúncia serão especificadas em história de usuário própria, caso aplicável.

## Mensagens de Erro e Validação

- Caso não exista conexão com a Internet, o sistema deverá informar ao usuário que não foi possível realizar o bloqueio ou desbloqueio.
- Caso ocorra um erro ao bloquear o usuário, o sistema deverá informar que não foi possível bloquear o usuário e permitir uma nova tentativa.
- Caso ocorra um erro ao desbloquear o usuário, o sistema deverá informar que não foi possível desbloquear o usuário e permitir uma nova tentativa.
- Caso ocorra um erro durante a remoção das relações de seguimento, o sistema deverá preservar a consistência do estado de bloqueio e das relações afetadas conforme as regras de integridade da plataforma.
- Caso o bloqueio não possa ser concluído corretamente, o sistema não deverá apresentar o usuário como desbloqueado.
- Caso o desbloqueio não possa ser concluído corretamente, o sistema não deverá apresentar o usuário como desbloqueado.
- Caso ocorra um erro ao atualizar o estado do botão de seguir, o sistema deverá utilizar o estado de bloqueio atualmente registrado como fonte de verdade.
- A ocorrência de um erro durante o bloqueio ou desbloqueio não deverá excluir ou alterar outros dados do perfil dos usuários.
- O sistema deverá impedir que uma falha de comunicação permita contornar as restrições de bloqueio.

# HU012 - Tela de "Mais"

Título: Tela de "Mais" com configurações, informações de usuários, dúvidas frequentes e informações da conta

Como: Usuário

Quero: Ser capaz de acessar uma tela com opções de configurações, informações da minha conta, informações sobre usuários, dúvidas frequentes e outras funcionalidades do sistema

Para que: Eu consiga gerenciar minha conta, consultar informações sobre usuários e a plataforma, esclarecer dúvidas sobre o funcionamento do sistema e encontrar outras opções disponíveis de forma organizada.

## Dependências Técnicas:

- O usuário deve estar cadastrado e autenticado no sistema para acessar as informações relacionadas à sua conta.
- O sistema deverá possuir conexão ativa com a Internet.
- As informações da conta dos usuários deverão estar armazenadas no banco de dados.
- O sistema deverá disponibilizar as configurações e funcionalidades correspondentes às opções apresentadas na tela.
- O sistema deverá possuir informações cadastradas para a seção de dúvidas frequentes (FAQ).
- O sistema deverá possuir informações públicas relacionadas aos usuários da plataforma.
- O sistema deverá permitir o acesso às informações públicas dos usuários.
- O sistema deverá permitir o acesso às informações relacionadas ao funcionamento da plataforma.
- O sistema deverá garantir que o usuário somente consiga alterar informações e configurações às quais possuir permissão.

## Regras de Negócio:

- O usuário poderá acessar a tela de "Mais" por meio da plataforma.
- A tela deverá apresentar as opções disponíveis de forma organizada.
- O usuário poderá acessar as configurações relacionadas à sua conta.
- O usuário poderá consultar informações relacionadas à sua própria conta.
- O usuário poderá consultar informações públicas relacionadas a outros usuários da plataforma, quando disponíveis.
- O usuário poderá consultar dúvidas frequentes sobre o funcionamento da plataforma.
- O usuário poderá acessar informações gerais sobre a plataforma.
- As opções apresentadas poderão variar de acordo com as funcionalidades disponíveis no sistema.
- O usuário somente poderá alterar configurações relacionadas à sua própria conta.
- Informações privadas dos usuários não deverão ser disponibilizadas para outros usuários.
- Somente informações públicas dos usuários poderão ser visualizadas por outros usuários.
- O funcionamento das funcionalidades que dependem de comunicação com o servidor dependerá de uma conexão ativa com a Internet.

## Campos interagíveis

### Tela de "Mais":

- Configurações: Permite acessar as opções de configuração da conta e da plataforma.
- Informações da conta: Permite visualizar informações relacionadas à conta do usuário.
- Informações de usuários: Permite acessar informações públicas relacionadas aos usuários da plataforma.
- Perfil do usuário: Permite acessar as informações públicas disponíveis no perfil de um usuário.
- Dúvidas frequentes (FAQ): Permite acessar perguntas frequentes e suas respectivas respostas.
- Informações sobre a plataforma: Permite visualizar informações gerais sobre o sistema.
- Termos e políticas: Permite acessar informações relacionadas aos termos de uso e políticas da plataforma.
- Ajuda/Suporte: Permite acessar informações ou opções relacionadas ao suporte do sistema.
- Sair da conta: Permite realizar o logout do usuário.
- Opções adicionais: Permite acessar outras funcionalidades disponibilizadas na plataforma.

## Critérios de aceite

### Acesso à tela de "Mais":

- O sistema deverá disponibilizar uma tela específica para que o usuário acesse as opções adicionais da plataforma.
- O usuário deverá conseguir acessar a tela de "Mais" por meio da navegação principal do sistema.
- A tela deverá apresentar as opções disponíveis de forma clara e organizada.
- O usuário deverá conseguir identificar a finalidade de cada opção apresentada.

### Configurações:

- O sistema deverá permitir que o usuário acesse as configurações da sua conta.
- O usuário deverá conseguir visualizar as opções de configuração disponíveis.
- O usuário deverá conseguir alterar as configurações que forem permitidas pelo sistema.
- As alterações realizadas deverão ser aplicadas à conta do usuário quando confirmadas.
- O sistema deverá informar ao usuário quando uma configuração for alterada com sucesso.
- Caso ocorra um erro durante a alteração, o sistema deverá informar que não foi possível realizar a operação.

### Informações da conta:

- O sistema deverá permitir que o usuário visualize informações relacionadas à sua própria conta.
- O usuário deverá conseguir identificar as informações básicas cadastradas no sistema.
- O sistema não deverá permitir que o usuário altere informações que não estejam disponíveis para edição.
- As informações privadas da conta deverão ser acessíveis somente pelo próprio usuário ou por funcionalidades autorizadas do sistema.

### Informações de usuários:

- O sistema deverá permitir que o usuário consulte informações públicas de outros usuários da plataforma.
- O usuário deverá conseguir visualizar as informações públicas disponibilizadas no perfil de outro usuário.
- O sistema não deverá disponibilizar informações privadas ou restritas de outros usuários.
- As informações apresentadas deverão estar de acordo com as configurações de privacidade definidas pelo usuário.
- O usuário deverá conseguir acessar o perfil de outro usuário quando essa opção estiver disponível.
- Caso o usuário consultado não esteja mais disponível na plataforma, o sistema deverá informar que o perfil não pode ser visualizado.

### Perfil do usuário:

- O sistema deverá permitir o acesso ao perfil de usuários por meio da opção de informações de usuários.
- O perfil deverá apresentar somente as informações públicas disponíveis.
- O usuário deverá conseguir visualizar informações como nome, foto, descrição e outras informações públicas cadastradas, quando disponíveis.
- O sistema deverá impedir o acesso a informações privadas ou restritas do usuário consultado.

### Dúvidas frequentes (FAQ):

- O sistema deverá disponibilizar uma seção específica para dúvidas frequentes.
- O usuário deverá conseguir visualizar as dúvidas cadastradas.
- O usuário deverá conseguir selecionar uma dúvida para visualizar sua resposta.
- As respostas apresentadas deverão estar relacionadas ao funcionamento e às funcionalidades da plataforma.
- As dúvidas deverão abordar questões relacionadas ao cadastro, login, publicações, comentários, perfil e demais funcionalidades disponíveis.
- O usuário deverá conseguir retornar à lista de dúvidas após visualizar uma resposta.
- Caso não existam dúvidas cadastradas, o sistema deverá informar que não há dúvidas frequentes disponíveis.

### Informações sobre a plataforma:

- O sistema deverá permitir que o usuário consulte informações gerais sobre a plataforma.
- As informações deverão apresentar dados relacionados à finalidade e ao funcionamento do sistema.
- O usuário deverá conseguir acessar essas informações por meio da tela de "Mais".

### Termos e políticas:

- O sistema deverá permitir que o usuário acesse os termos e políticas disponibilizados pela plataforma.
- O usuário deverá conseguir visualizar o conteúdo dos documentos disponíveis.
- Os documentos deverão ser apresentados de forma que o usuário consiga realizar sua leitura.

### Ajuda e suporte:

- O sistema deverá disponibilizar uma opção para acesso às informações de ajuda ou suporte, quando disponível.
- O usuário deverá conseguir identificar como obter auxílio em caso de dúvidas ou problemas relacionados à plataforma.
- Caso não exista um canal de suporte disponível, o sistema deverá informar ao usuário que a funcionalidade não está disponível.

### Sair da conta:

- O sistema deverá disponibilizar uma opção para que o usuário encerre sua sessão.
- Ao selecionar a opção de sair, o sistema deverá encerrar a sessão autenticada do usuário.
- Após sair da conta, o usuário deverá ser direcionado para a tela inicial de acesso ao sistema.
- O sistema não deverá permitir que o usuário continue acessando funcionalidades exclusivas de usuários autenticados após o logout.

### Opções adicionais:

- O sistema poderá disponibilizar outras funcionalidades relacionadas à conta ou à plataforma na tela de "Mais".
- Cada opção disponibilizada deverá direcionar o usuário para a funcionalidade correspondente.
- As opções deverão estar organizadas de maneira que o usuário consiga identificá-las e acessá-las.

## Validações e erros:

- Caso não exista conexão com a Internet, o sistema deverá informar ao usuário que não foi possível carregar as informações que dependem da conexão.
- Caso ocorra um erro ao carregar as configurações, informações da conta, informações de usuários ou dúvidas frequentes, o sistema deverá informar que não foi possível carregar os dados.
- Caso uma opção selecionada não esteja mais disponível, o sistema deverá informar que a funcionalidade não pode ser acessada.
- Caso o usuário tente acessar uma funcionalidade que exige autenticação sem estar autenticado, o sistema deverá direcioná-lo para a tela de login.
- Caso um perfil de usuário não esteja mais disponível, o sistema deverá informar que o perfil não pode ser visualizado.
- Caso não existam informações públicas disponíveis sobre determinado usuário, o sistema deverá informar que não há informações disponíveis.
- Caso ocorra um erro durante o logout, o sistema deverá informar ao usuário que não foi possível concluir a operação.

# Melhorias futuras

- HU008 — Central de notificações (história detalhada acima; fora da versão 1.0).
- HU009 e HU009.1 — Mensagens diretas e chat; fora da versão 1.0.
- HU011.2 — Bloqueio de outro usuário (história detalhada acima; fora da versão 1.0).
