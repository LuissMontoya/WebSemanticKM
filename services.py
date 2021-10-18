import json

def arrayIndividual(qres):
    array = []
    for results in qres:
        array.append({
            "Name": results[0],
            "Geo_Json": json.loads(results[1]),
            "Address":  results[2],
            "Schedule": results[3],
            "Comments": results[4],
            "Qualification": results[5],
        })
    return array


def arrayLayerList(qres):
    array = []
    for results in qres:
        array.append({
            "Name": results[0].split('#')[1]
        })
    return array


def arraySearcher(qres):
    array = []
    for results in qres:
        array.append({
            "Suject": results[0],
            "Address":  results[1],
            "Schedule": results[2],
            "Geo_Json": json.loads(results[3]),
            "Qualification": results[4],
            "Comments": results[5],
            "Object": None if results[6] == None else results[6].split('#')[1].replace('_', ' ')
        })
    return array
