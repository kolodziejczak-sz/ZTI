package zti;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

    @Bean
    QueryExecutor queryExecutor(){
        return new QueryExecutor(Setup.setup());
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
