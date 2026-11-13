package com.companion.config;

import com.companion.entities.Course;
import com.companion.entities.CourseSubject;
import com.companion.entities.Subject;
import com.companion.entities.University;
import com.companion.repositories.CourseRepository;
import com.companion.repositories.CourseSubjectRepository;
import com.companion.repositories.SubjectRepository;
import com.companion.repositories.UniversityRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Carga inicial do catálogo acadêmico: Unifor, o curso de Ciência da Computação
// e a grade com as disciplinas (código, nome e semestre; 0 = optativa).
// Só roda quando ainda não há nenhuma universidade cadastrada, então não
// duplica dados ao reiniciar o backend.
@Component
@Order(10)
public class AcademicCatalogSeeder implements ApplicationRunner {

    private record SeedSubject(String code, String name, int semester) { }

    private static final List<SeedSubject> COMPUTER_SCIENCE_GRADE = List.of(
            new SeedSubject("T105", "Desafios do ciberespaço", 1),
            new SeedSubject("T161", "Experimentação orientada", 1),
            new SeedSubject("T099", "Fund sist computacionais", 1),
            new SeedSubject("T100", "Modelagem prob matemática", 1),
            new SeedSubject("T096", "Postura prof com interpessoal", 1),
            new SeedSubject("T160", "Raciocínio lógico algoritmico", 1),
            new SeedSubject("T196", "Arquitetura de computadores", 2),
            new SeedSubject("T166", "Experimentação de protótipos", 2),
            new SeedSubject("T163", "Interação humano-computador", 2),
            new SeedSubject("T164", "Programação orient objetos", 2),
            new SeedSubject("T168", "Álgebra e geom computacional", 2),
            new SeedSubject("T197", "Desenv plataformas móveis", 3),
            new SeedSubject("T390", "Estrutura de dados", 3),
            new SeedSubject("T193", "Requisitos e mod de sistemas", 3),
            new SeedSubject("T162", "Res problemas nat discreta", 3),
            new SeedSubject("T169", "Sist ciberfísic colaborativos", 3),
            new SeedSubject("T116", "Ética em computação", 3),
            new SeedSubject("T203", "Ambiente de dados", 4),
            new SeedSubject("T198", "Construção a. de algoritmos", 4),
            new SeedSubject("T242", "Desenv plataformas web", 4),
            new SeedSubject("T199", "Mét quant em computação", 4),
            new SeedSubject("T200", "Proj arquitetura de sistemas", 4),
            new SeedSubject("T113", "Experiência empreendedora", 5),
            new SeedSubject("T289", "Gerenciamentos de projetos", 5),
            new SeedSubject("T293", "Modelagem em prog matemática", 5),
            new SeedSubject("T300", "Programação funcional", 5),
            new SeedSubject("T303", "Proj de sistema operacional", 5),
            new SeedSubject("T290", "Resolução prob com grafos", 5),
            new SeedSubject("T291", "Aspectos teóricos computação", 6),
            new SeedSubject("N394", "Comput gráf realidade virtual", 6),
            new SeedSubject("T292", "Computação paralela concorrent", 6),
            new SeedSubject("T296", "Intel artificial computacional", 6),
            new SeedSubject("T295", "Investigação científica", 6),
            new SeedSubject("T310", "Projeto de redes convergentes", 6),
            new SeedSubject("T326", "Ciência dos dados", 7),
            new SeedSubject("T335", "Computação distribuída", 7),
            new SeedSubject("T339", "Inovação soluções computacion", 7),
            new SeedSubject("T334", "Model avaliação de desempenho", 7),
            new SeedSubject("T333", "Projeto banco de dados", 7),
            new SeedSubject("T319", "Projeto final integrador I", 7),
            new SeedSubject("T338", "Ger da implantação de sistemas", 8),
            new SeedSubject("T337", "Ger de serviços no ciberespaço", 8),
            new SeedSubject("T138", "Projeto de tecn intercursos", 8),
            new SeedSubject("T336", "Projeto final integrador II", 8),
            new SeedSubject("A900", "Atividades avaliativas", 0),
            new SeedSubject("G368", "Responsabil social e ambiental", 0),
            new SeedSubject("G770", "Empreendedorismo social", 0),
            new SeedSubject("H726", "Arte e cultura brasileira", 0),
            new SeedSubject("H799", "Libras", 0),
            new SeedSubject("J005", "Direitos humanos", 0),
            new SeedSubject("J080", "Missão inter: soc arte cultura", 0),
            new SeedSubject("N589", "Processamento de imagens", 0),
            new SeedSubject("N622", "Tópicos de gestão ambiental", 0),
            new SeedSubject("S801", "Oratória contemporânea", 0),
            new SeedSubject("T114", "Técnicas de programação Linux", 0),
            new SeedSubject("T117", "Soluções Linux II", 0),
            new SeedSubject("T118", "Soluções Windows", 0),
            new SeedSubject("T133", "Proj apl internet das coisas", 0),
            new SeedSubject("T134", "Perícia forense", 0),
            new SeedSubject("T135", "Atividades extensionistas", 0),
            new SeedSubject("T139", "Téc de programação para nuvem", 0),
            new SeedSubject("T143", "Arquitetura da comput em nuvem", 0),
            new SeedSubject("T149", "Tópicos de tecn da informação", 0),
            new SeedSubject("T192", "Governança em sistemas de T.I.", 0),
            new SeedSubject("T195", "Desenvolvimento de jogos", 0),
            new SeedSubject("T294", "Imagem e interação", 0),
            new SeedSubject("T304", "Teste validação de sistemas", 0),
            new SeedSubject("T320", "Segurança no ciberespaço", 0),
            new SeedSubject("T342", "Téc de integração de sistemas", 0),
            new SeedSubject("T371", "Tópicos em banco de dados", 0),
            new SeedSubject("T380", "Tópicos em programação", 0),
            new SeedSubject("T400", "Tópicos em eng. software", 0),
            new SeedSubject("T569", "Sistemas de tempo real", 0),
            new SeedSubject("T951", "Sistemas inteligentes", 0),
            new SeedSubject("T954", "Sistemas embarcados", 0)
    );

    private final UniversityRepository universityRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final CourseSubjectRepository courseSubjectRepository;

    public AcademicCatalogSeeder(UniversityRepository universityRepository, CourseRepository courseRepository,
                                 SubjectRepository subjectRepository,
                                 CourseSubjectRepository courseSubjectRepository) {
        this.universityRepository = universityRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.courseSubjectRepository = courseSubjectRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (universityRepository.count() > 0) return;

        University unifor = universityRepository.save(
                new University("Universidade de Fortaleza", "UNIFOR", "edu.unifor.br"));
        Course computerScience = courseRepository.save(new Course(unifor, "Ciência da Computação", 8));

        for (SeedSubject item : COMPUTER_SCIENCE_GRADE) {
            Subject subject = subjectRepository.save(new Subject(unifor, item.code(), item.name()));
            courseSubjectRepository.save(new CourseSubject(computerScience, subject, item.semester()));
        }
    }
}
