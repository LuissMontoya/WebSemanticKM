# import libs
import json
import rdflib
import services
import queries

# load triplestore
def start():
    g = rdflib.graph.ConjunctiveGraph()
    g.parse('ontologie/jenaV5.owl', format="xml")
    return g

# main controller
def returnJson(type, g, params=None):
    if type == "parks":
        return json.dumps(services.arrayIndividual(queries.layerIndividualsList(g, "parques")))

    if type == "warehouse":
        return json.dumps(services.arrayIndividual(queries.layerIndividualsList(g, "almacen"))
                          + services.arrayIndividual(queries.layerIndividualsList(g, "galeria")))

    if type == "activities":
        return json.dumps(services.arrayIndividual(queries.layerIndividualsList(g, "balneario"))
                          + services.arrayIndividual(queries.layerIndividualsList(g, "deporte")))

    if type == "food_and_drink":
        return json.dumps(services.arrayIndividual(queries.layerIndividualsList(g, "bar"))
                          + services.arrayIndividual(queries.layerIndividualsList(g, "restaurante")))

    if type == "culture_and_religion":
        return json.dumps(services.arrayIndividual(queries.layerIndividualsList(g, "iglesia"))
                          + services.arrayIndividual(queries.layerIndividualsList(g, "museo")))

    if type == "transport":
        return json.dumps(services.arrayIndividual(queries.layerIndividualsList(g, "aeropuerto"))
                          + services.arrayIndividual(queries.layerIndividualsList(g, "terminal")))

    if type == "hotel_and_lodging":
        return json.dumps(services.arrayIndividual(queries.layerIndividualsList(g, "hospedaje"))
                          + services.arrayIndividual(queries.layerIndividualsList(g, "hotel")))

    if type == "financial_entities":
        return json.dumps(services.arrayIndividual(queries.layerIndividualsList(g, "banco"))
                          + services.arrayIndividual(queries.layerIndividualsList(g, "cajero")))

    if type == "searcher":
        return json.dumps(services.arraySearcher(queries.searcher(g, params)))

    if type == "layer":
        return json.dumps(services.arrayLayerList(queries.layerList(g)))


if __name__ == "__main__":
    g = start()
    print(returnJson("layer", g))
