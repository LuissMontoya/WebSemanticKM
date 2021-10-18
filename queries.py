# Sparql queries
def layerList(g):
    qres = g.query("""
        prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        prefix : <http://www.semanticweb.org/root/ontologies/2021/9/untitled-ontology-14#>

        SELECT DISTINCT ?subject
	    WHERE { 
            ?subject rdfs:subClassOf :puntos_interes.
        }""")
    return(qres)

def layerIndividualsList(g, class_name=None):
    qres = g.query("""
        prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        prefix : <http://www.semanticweb.org/root/ontologies/2021/9/untitled-ontology-14#>
        select ?nombre ?Geo_Json ?direccion ?horario ?comentarios ?calificacion
        where {
            ?s rdf:type :% .
            ?s :nombre ?nombre .
            ?s :Geo_Json ?Geo_Json .
            ?s :direccion ?direccion .
            ?s :horario ?horario .
            ?s :comentarios ?comentarios .
            ?s :calificacion ?calificacion .
        }
            """.replace("%", class_name))
    return(qres)

def searcher(g, params=None):
    qres = g.query("""
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix : <http://www.semanticweb.org/root/ontologies/2021/9/untitled-ontology-14#>
    SELECT DISTINCT ?nombre ?direccion ?horario ?Geo_Json ?calificacion ?comentarios ?o
     WHERE {
        ?s rdf:type ?object.
  	    ?s :nombre ?nombre .
        ?s :direccion ?direccion .
  	    ?s :horario ?horario .
        ?s :Geo_Json ?Geo_Json .
        ?s :calificacion ?calificacion .
        ?s :comentarios ?comentarios .
        optional { ?s :brindan ?o } .
        optional { ?s :esta ?o } .
        optional { ?s :posee ?o } .
        optional { ?s :Ttiene ?o } .
        FILTER (REGEX(str(?object),"%","i")).
    }
    """.replace("%", params))
    return(qres)
