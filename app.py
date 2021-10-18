from flask import Flask, request
from flask_cors import CORS
import controller_rdf as controller
import rdflib

# load triplestore
def start():
    g = rdflib.graph.ConjunctiveGraph()
    g.parse('ontologie/jenaV5.owl', format="xml")
    return g

# start app
print("[INFO] Starting App: OK")
app = Flask(__name__)
CORS(app)
print("[INFO] App started: OK")

# load database
print("[INFO] Loading RDF database: OK")
g = start()
print("[INFO] Database loaded: OK")

#Routes 
@app.route('/searcher')
def searcher():
    param = request.args.get('param')
    return controller.returnJson("searcher", g, param)

@app.route('/parques', methods=['GET'])
def fontaines():
    return controller.returnJson("parks", g)


@app.route('/compras', methods=['GET'])
def warehouse():
    return controller.returnJson("warehouse", g)


@app.route('/actividades', methods=['GET'])
def activities():
    return controller.returnJson('activities', g)


@app.route('/comidas_bebidas', methods=['GET'])
def food_and_drink():
    return controller.returnJson("food_and_drink", g)


@app.route('/cultura_religion', methods=['GET'])
def culture_and_religion():
    return controller.returnJson("culture_and_religion", g)


@app.route('/transporte', methods=['GET'])
def transport():
    return controller.returnJson("transport", g)


@app.route('/Hoteles_Hospedajes', methods=['GET'])
def hotel_and_lodging():
    return controller.returnJson("hotel_and_lodging", g)


@app.route('/entidades_financieras', methods=['GET'])
def financial_entities():
    return controller.returnJson("financial_entities", g)


@app.route('/layer', methods=['GET'])
def layer():
    return controller.returnJson("layer", g)


if __name__ == '__main__':
    app.run()
