package zti;

import lombok.AllArgsConstructor;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;

import java.io.ByteArrayOutputStream;


@AllArgsConstructor
class QueryExecutor {

    OntModel model;

    String execute(String query, FormattingStrategy formattingStrategy){
        System.out.println(query);
        query = query.replaceAll("\n","");

        QueryExecution qexec = QueryExecutionFactory.create( query, model );
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            ResultSet results = qexec.execSelect();
            //ResultSetFormatter.out( results, executor.model );
            ResultSetFormatter.outputAsJSON(outputStream, results);
        }
        finally {
            qexec.close();
        }

        String json = new String(outputStream.toByteArray());

        System.out.println(json);

        return formattingStrategy.formatJson(json);
    }

}
