package zti;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.MatrixVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import javax.ws.rs.QueryParam;

@RestController
public class Backend {

    private QueryExecutor executor;

    @Autowired
    public Backend(QueryExecutor queryExecutor) {
        this.executor = queryExecutor;
    }

    @RequestMapping("/api/os")
    public String getOperatingSystems() {

        String osQuery = "PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>\n"+
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n"+
        "SELECT ?x WHERE { ?x rdfs:subClassOf phones:OS . }\n";

        return executor.execute(osQuery);
    }

    @RequestMapping("/api/brands")
    public String getBrands() {

        String brandsQuery = "PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>\n" +
                "  SELECT DISTINCT ?x {?p phones:made_by ?x}\n";

        return executor.execute(brandsQuery);
    }

    //http://localhost:7777/api/detail/?model=A21
    @RequestMapping("/api/detail/")
    public String getDetails(@QueryParam("model") String model) {

        String modelQuery =
        "PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>\n"+
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"+
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n"+
        "SELECT * {\n"+
                "?model rdf:type phones:model .\n"+
                "?model rdfs:label ?label .\n"+
                "?model phones:image ?img .\n"+
                "?model phones:made_by ?brand .\n"+
                "?model ?p ?s .\n"+
        "FILTER regex(?label,\""+model+"\")\n"+
    "} LIMIT 1" ;
        return executor.execute(modelQuery);
    }

    //http://localhost:7777/api/search/;price_to=200;os=android;display_inch_from=1
    @RequestMapping("/api/search{data}")
    //public String search(@MatrixVariable(name = "price_to", required = false) String price) {
    public String search(@MatrixVariable Map<String, String> matrixVars) {


        String searchQuery = "" +
                "PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>\n" +
                "    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
                "    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
                "    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
                "    " +
                "    SELECT ?model ?img ?label ?os ?brand ?price ?ram ?dsize {\n" +
                "      ?model rdf:type phones:model .\n" +
                "      ?model phones:image ?img .\n" +
                "      ?model rdfs:label ?label .\n" +
                "      ?model phones:has_os ?os .\n" +
                "      ?model phones:made_by ?brand .\n" +
                "      ?model phones:price_eur ?price .\n" +
                "      ?model phones:display_size ?dsize .\n" +
                "      ?model phones:has_ram ?ram .\n" +
                getFilters(matrixVars)+
                "    } LIMIT 20";

        return executor.execute(searchQuery);
    }


    private String getFilters(Map<String,String> map){
        String filters = "";

        filters += map.containsKey("query") ? "FILTER (CONTAINS(?model,\" "+map.get("query")+"\"))\n" : "";
        filters += map.containsKey("os") ? "FILTER (CONTAINS(?os, \""+map.get("os")+"\"))\n" : "";
        filters += map.containsKey("brand") ? "FILTER (CONTAINS(?brand, \""+map.get("brand")+"\"))\n" : "";
        filters += map.containsKey("price_from") ? "FILTER (xsd:float(?price) > "+map.get("price_from")+")\n" : "";
        filters += map.containsKey("price_to") ? "FILTER (xsd:float(?price) < "+map.get("price_to")+")\n" : "";
        filters += map.containsKey("ram_from") ? "FILTER (xsd:float(?ram) > "+map.get("ram_from")+")\n" : "";
        filters += map.containsKey("ram_to") ? "FILTER (xsd:float(?ram) < "+map.get("ram_to")+")\n" : "";
        filters += map.containsKey("display_inch_from") ? "FILTER (xsd:float(?dsize) > "+map.get("display_inch_from")+")\n" : "";
        filters += map.containsKey("display_inch_to") ? "FILTER (xsd:float(?dsize) < "+map.get("display_inch_to")+")\n" : "";

        return filters;
    }



}