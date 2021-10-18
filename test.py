import rdflib

g = rdflib.graph.ConjunctiveGraph()
g.parse('ontologie/jenaV4.owl', format="xml")

qres = g.query("""
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix : <http://www.semanticweb.org/root/ontologies/2021/9/untitled-ontology-14#>
    SELECT *
	  WHERE { ?s rdfs:subClassOf :actividades .
    }
""")

for results in qres:
    print(results, end='\n\n')
