package com.companion.config;

import com.companion.entities.Faq;
import com.companion.repositories.FaqRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Carga inicial das dúvidas frequentes (página FAQ). Só roda quando a tabela
// faqs está vazia, então não duplica nada ao reiniciar o backend nem mexe nas
// perguntas que a administração criar depois (em /api/admin/faqs).
// Os testes desligam esta carga com companion.seed.faqs=false.
@Component
@ConditionalOnProperty(name = "companion.seed.faqs", havingValue = "true", matchIfMissing = true)
public class FaqSeeder implements ApplicationRunner {

    private record SeedFaq(String question, String answer) { }

    // Na ordem de exibição.
    private static final List<SeedFaq> FAQS = List.of(
            new SeedFaq("O que é o Companion?",
                    "O Companion é uma rede social acadêmica para estudantes de Ciência da Computação da "
                            + "Unifor. Nele você publica dúvidas sobre as matérias do curso, responde colegas e "
                            + "acompanha quem estuda os mesmos assuntos que você."),
            new SeedFaq("Quem pode criar uma conta?",
                    "Qualquer estudante pode se cadastrar com e-mail e senha, sem aprovação prévia. Depois "
                            + "do cadastro, confirme seu e-mail pelo link que enviamos e defina seu nome e "
                            + "username para acessar o feed."),
            new SeedFaq("Esqueci minha senha. Como recupero o acesso?",
                    "Na tela de login, clique em \"Esqueceu a senha?\" e informe seu e-mail. Você receberá "
                            + "um link para criar uma nova senha. O link vale por 15 minutos e só pode ser usado "
                            + "uma vez."),
            new SeedFaq("Como publico uma dúvida?",
                    "Clique em \"Postar dúvida\" no topo da tela, escreva um título, descreva sua dúvida e "
                            + "escolha as matérias relacionadas. Quanto mais clara a descrição, mais fácil para "
                            + "os colegas ajudarem."),
            new SeedFaq("Posso editar uma dúvida ou resposta depois de publicar?",
                    "Não. Dúvidas e respostas não podem ser editadas nem excluídas depois de publicadas, "
                            + "então revise o texto com atenção antes de enviar."),
            new SeedFaq("Existe limite de tamanho para dúvidas e respostas?",
                    "Sim. O conteúdo de cada dúvida e de cada resposta pode ter até 256 caracteres. Seja "
                            + "direto e foque no ponto principal da sua pergunta."),
            new SeedFaq("Como encontro dúvidas ou colegas de uma matéria?",
                    "Use a busca no topo ou a página Explorar. Você pode pesquisar por título, conteúdo, "
                            + "matéria ou pelo nome de outros estudantes. No Explorar, digite # seguido do nome "
                            + "da matéria e dois espaços para filtrar por ela."),
            new SeedFaq("O que acontece quando sigo alguém?",
                    "Seguir um estudante é uma forma de acompanhar quem estuda os mesmos assuntos que você. "
                            + "O número de seguidores e de pessoas seguidas aparece no perfil, e você pode "
                            + "deixar de seguir quando quiser."),
            new SeedFaq("Como denuncio um conteúdo inadequado?",
                    "Use a opção de denúncia na dúvida ou na resposta e escolha o motivo, como spam, "
                            + "conteúdo fora do tema ou inadequado. A denúncia é analisada pela moderação; o "
                            + "conteúdo não é removido automaticamente."),
            new SeedFaq("Quais informações do meu perfil ficam públicas?",
                    "Outros estudantes veem seu nome, username, foto, biografia, matérias de interesse e "
                            + "suas publicações. Seu e-mail, sua matrícula e sua senha nunca são exibidos para "
                            + "outras pessoas.")
    );

    private final FaqRepository faqRepository;

    public FaqSeeder(FaqRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (faqRepository.count() > 0) return;
        for (int index = 0; index < FAQS.size(); index++) {
            SeedFaq faq = FAQS.get(index);
            faqRepository.save(new Faq(faq.question(), faq.answer(), index + 1, true));
        }
    }
}
