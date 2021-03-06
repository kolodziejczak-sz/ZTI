package zti;

import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.rdf.model.ModelFactory;

import java.io.InputStream;

class OntologyModelFactory {

    static OntModel setup() {
        String fileName = "phones.owl";
        InputStream in =  Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName);

        OntModel m = ModelFactory.createOntologyModel( OntModelSpec.OWL_MEM );
        m.read(in, null, "TURTLE"); //"RDF/XML" "TURTLE" "RDF/JSON"
        return m;
    }

}
