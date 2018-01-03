package zti;

import static zti.FormattingStrategy.FLAT;
import static zti.FormattingStrategy.NESTED;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.MatrixVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import javax.ws.rs.QueryParam;

@RestController
@CrossOrigin
public class Backend {

    private QueryExecutor executor;

    @Autowired
    public Backend(QueryExecutor queryExecutor) {
        this.executor = queryExecutor;
    }

  @CrossOrigin
    @RequestMapping("/api/os")
    public String getOperatingSystems() {

        String osQuery = "PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>\n"+
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n"+
        "SELECT ?x WHERE { ?x rdfs:subClassOf phones:OS . }\n";

        return executor.execute(osQuery, FLAT);
    }
    @CrossOrigin
    @RequestMapping("/api/brands")
    public String getBrands() {

        String brandsQuery = "PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>\n" +
                "  SELECT DISTINCT ?x {?p phones:made_by ?x}\n";

        return executor.execute(brandsQuery, FLAT);
    }

    //http://localhost:7777/api/detail/?model=HuaweiG8
    @CrossOrigin
    @RequestMapping("/api/detail")
    public String getDetails(@QueryParam("model") String model) {

        String modelFilter = "FILTER regex(?model,\""+model+"\")\n";

        String modelQuery =
        "PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>\n"+
        "PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"+
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n"+
        "SELECT * {\n"+
                "?model rdf:type phones:model .\n"+
                "?model rdfs:label ?label .\n"+
                "?model phones:image ?img .\n"+
                "?model phones:made_by ?brand .\n"+
                "?model phones:has_os ?os .\n" +
                "?model phones:price_eur ?price .\n" +
                "?model phones:display_size ?dsize .\n" +
                "?model phones:has_ram ?ram .\n" +
        "FILTER regex(str(?model),\""+model+"\")\n"+
    "} ";
        return executor.execute(modelQuery, NESTED);
    }

    //http://localhost:7777/api/search;price_from=22;ram_from=2;display_inch_from=2;os=iOs
    @CrossOrigin
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

        return executor.execute(searchQuery, NESTED);
    }


    private String getFilters(Map<String,String> map){
        String filters = "";

        filters += map.containsKey("query") ? "FILTER regex(str(?model),\" "+map.get("query")+"\", \"i\")\n" : "";
        filters += map.containsKey("os") ? "FILTER regex(str(?os), \""+map.get("os")+"\", \"i\")\n" : "";
        filters += map.containsKey("brand") ? "FILTER regex(str(?brand), \""+map.get("brand")+"\", \"i\")\n" : "";
        filters += map.containsKey("price_from") ? "FILTER (xsd:float(?price) >= "+map.get("price_from")+")\n" : "";
        filters += map.containsKey("price_to") ? "FILTER (xsd:float(?price) <= "+map.get("price_to")+")\n" : "";
        filters += map.containsKey("ram_from") ? "FILTER (xsd:float(?ram) >= "+map.get("ram_from")+")\n" : "";
        filters += map.containsKey("ram_to") ? "FILTER (xsd:float(?ram) <= "+map.get("ram_to")+")\n" : "";
        filters += map.containsKey("display_inch_from") ? "FILTER (xsd:float(?dsize) >= "+map.get("display_inch_from")+")\n" : "";
        filters += map.containsKey("display_inch_to") ? "FILTER (xsd:float(?dsize) <= "+map.get("display_inch_to")+")\n" : "";

        return filters;
    }



}
