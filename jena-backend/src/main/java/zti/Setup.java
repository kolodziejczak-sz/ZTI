package zti;

import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.rdf.model.ModelFactory;


import java.io.File;
import java.io.InputStream;
import java.nio.file.Paths;

public class Setup {

    static OntModel setup() {
        String fileName = "phones.owl";
        InputStream in =  Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName);

        OntModel m = ModelFactory.createOntologyModel( OntModelSpec.OWL_MEM );
        m.read(in, null, "TURTLE"); //"RDF/XML" "TURTLE" "RDF/JSON"
        return m;
    }

}
