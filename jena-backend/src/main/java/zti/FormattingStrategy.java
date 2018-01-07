package zti;

import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;

import java.util.Set;

public enum FormattingStrategy {


    FLAT {
        @Override
        String formatJson(String jsonString) {
            String nested = NESTED.formatJson(jsonString);
            JsonArray nestedJson = new JsonArray(nested);

            JsonArray updatedJson = new JsonArray();

            nestedJson.stream()
                    .map(element -> ((JsonObject) element))
                    .forEach(element -> updatedJson.add(element.getString(SINGLE_VARIABLE_QUERY_PLACEHOLDER)));

            return updatedJson.toString();
        }
    }, NESTED {
        @Override
        String formatJson(String jsonString) {
            JsonObject json = new JsonObject(jsonString);

            JsonArray bindings = json.getJsonObject("results").getJsonArray("bindings");

            JsonArray updatedBinding = new JsonArray();
            bindings.stream().map(element -> (JsonObject) element)
                    .map(element -> {
                        Set<String> keys = element.getMap().keySet();
                        for (String key : keys) {
                            JsonObject innerJson = element.getJsonObject(key);

                            String updatedString = innerJson
                                    .getString("value").replaceAll(ONTOLOGY_PREFIX, "");
                            element.put(key, updatedString);
                        }
                        return element;
                    }).forEach(updatedBinding::add);
            String clean = updatedBinding.toString();
            System.out.println(clean);
            return clean;
        }
    };
    private static final String ONTOLOGY_PREFIX = "http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#";
    private static final String SINGLE_VARIABLE_QUERY_PLACEHOLDER = "x";

    abstract String formatJson(String jsonString);
}

