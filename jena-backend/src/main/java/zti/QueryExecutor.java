package zti;

import lombok.AllArgsConstructor;
import org.apache.jena.ontology.OntModel;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.concurrent.atomic.AtomicLong;

@AllArgsConstructor
public class QueryExecutor {

    OntModel model;

}
