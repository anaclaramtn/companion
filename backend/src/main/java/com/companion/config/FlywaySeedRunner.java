package com.companion.config;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

/**
 * Aplica as migrações de dados de exemplo (src/main/resources/db/seed) com o
 * Flyway. Só roda com o perfil "seed":
 *
 *   .\gradlew.bat bootRun --args="--spring.profiles.active=dev,seed"
 *
 * Roda depois que o Hibernate criou as tabelas e que o catálogo acadêmico foi
 * carregado (por isso o @Order alto), porque os scripts usam o curso e as
 * matérias. O Flyway guarda o que já aplicou em flyway_schema_history, então
 * subir de novo com o perfil não duplica nada.
 */
@Component
@Profile("seed")
@Order(100)
public class FlywaySeedRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(FlywaySeedRunner.class);

    private final DataSource dataSource;

    public FlywaySeedRunner(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/seed")
                // O banco já tem tabelas criadas pelo Hibernate e nenhum histórico do
                // Flyway: marca o estado atual como versão 0 e aplica a partir da V1.
                .baselineOnMigrate(true)
                .baselineVersion("0")
                .load();

        var result = flyway.migrate();
        if (result.migrationsExecuted == 0) {
            log.info("Flyway: nada a aplicar, os dados de exemplo já estão no banco.");
        } else {
            log.info("Flyway: {} migração(ões) aplicada(s). Senha dos usuários de exemplo: Senha123",
                    result.migrationsExecuted);
        }
    }
}
