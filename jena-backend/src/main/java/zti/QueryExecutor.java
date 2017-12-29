package zti;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.ResultSet;
import org.apache.jena.query.ResultSetFormatter;

import java.io.ByteArrayOutputStream;
import java.util.Set;


@AllArgsConstructor
public class QueryExecutor {
    private final String ONTOLOGY_PREFIX = "http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#";

    OntModel model;

    String execute(String query){
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

        return cleanJson(json);
    }

    @SneakyThrows
    private String cleanJson(String jsonString) {


        JsonObject json = new JsonObject(jsonString);

        JsonArray bindings = json.getJsonObject("results").getJsonArray("bindings");

        JsonArray updatedBinding = new JsonArray();
        bindings.stream().map(element -> (JsonObject) element)
                .map(element -> {
                    Set<String> keys = element.getMap().keySet();
                    for (String key: keys) {
                        JsonObject innerJson = element.getJsonObject(key);
                        String updatedString = innerJson
                                .getString("value").replaceAll(ONTOLOGY_PREFIX, "");
                        innerJson.put("value", updatedString);
                    }
                    return element;
                }).forEach(updatedBinding::add);
        String clean = updatedBinding.toString();
        System.out.println(clean);
        return clean;
    }

}
