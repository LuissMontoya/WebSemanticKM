const formulario = document.querySelector('#formulario');
const boton = document.querySelector('#boton');
const limpiar = document.querySelector('#limpiar');
const resultado = document.querySelector('#resultado');
const cabecera = document.querySelector('#resultado');
let marker = []

//create the map
let map = L.map('map').setView([1.6184774183504775, -75.60791370550324], 15); //start map obj
let overlayMaps = {};
let osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { //create the layer
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
});
map.addLayer(osmLayer);


//display meteo on map click
let popup = L.popup();
async function onMapClick(e) {
    API_METEO = 'http://api.openweathermap.org/data/2.5/weather?lat=' + e.latlng.lat + '&lon=' + e.latlng.lng + '&appid=0c0c9aa8bb23a8054260d263e56fc1cc';
    const responseM = await fetch(API_METEO);
    const dataM = await responseM.json();

    API_AIR = "https://api.waqi.info/feed/geo:" + e.latlng.lat + ";" + e.latlng.lng + "/?token=3ea0f358523452559d46c9d0c715e7908e9d993c"
    const responseA = await fetch(API_AIR);
    const dataA = await responseA.json();

    const message = "<b>" + dataM.name + "</b><br>Temperatura : " + ((dataM.main.temp - 273).toFixed(1)) + "°C<br>Clima : " + dataM.weather[0].description + "<br>Índice de calidad del aire  : " + dataA.data.aqi
    popup
        .setLatLng(e.latlng)
        .setContent(message)
        .openOn(map);
}
map.on('click', onMapClick);


function markerDelAgain(marker) {
    try {
        for (i = 0; i < marker.length; i++) {
            map.removeLayer(marker[i]);
        }
    } catch (error) {
        return
    }
}

// Get Individuals
async function getIndividuals(layer) {

    const APIPython = "http://127.0.0.1:5000/" + layer;
    const response = await fetch(APIPython, { mode: 'cors' });
    const pythonJSON = await response.json();

    let listeCouche = []
    for (let i = 0; i < pythonJSON.length; i++) {
        let { Geo_Json, Name, Comments, Qualification, Address, Schedule } = pythonJSON[i]
        let [long, lat] = Geo_Json.coordinates

        let textPopup = `
        <b>${Name}</b>
        <br>
        Reseñas: ${Comments}
        <br>
        Calificacion: ${Qualification}
        <br>
        Dirección: ${Address}
        <br>
        Horario: ${Schedule}
        `
        let iconObj = getColorIcon(layer)
        listeCouche.push(L.marker([long, lat], { icon: iconObj })
            .bindPopup(textPopup)
            .on('dblclick', ondbClick));
    };
    let couche = L.layerGroup(listeCouche);
    overlayMaps[layer.replace("_", " ").toUpperCase()] = couche;
}


//searcher
async function searcher() {
    markerDelAgain(marker)
    const texto = formulario.value.toLowerCase();
    const response = await fetch(`http://127.0.0.1:5000/searcher?param=${texto}`, { mode: 'cors' });
    const data = await response.json();

    cabecera.innerHTML = '';
    resultado.innerHTML = '';

    if (data.length == 0) {
        resultado.innerHTML += ` <li class="list-group-item list-group-item-danger">Sitio de interés no encontrado ...</li>`
        return
    }

    resultado.innerHTML += `
    <tr>
        <th scope="col">#</th>
        <th scope="col">Sitio</th>
        <th scope="col">local</th>
        <th scope="col">Dirección</th>
        <th scope="col">Calificación</th>
        <th scope="col">Horario</th>
    </tr>
    `
    let i = 0
    for (let item of data) {
        let { Suject, Schedule, Address, Qualification, Object } = item

        resultado.innerHTML += `
        <tr>
            <th scope="row">${++i}</th> 
            <td>${Suject}</td>
            <td>${Object == null ? " " : Object}</td>
            <td>${Address}</td>
            <td>${Qualification}</td>
            <td>${Schedule}</td>
        </tr>
        `
        let [long, lat] = item.Geo_Json.coordinates
        let textPopup = `
        <b>${Object == null ? Suject : Object}</b>`
        marker.push(L.marker([long, lat], { icon: blueIcon }).addTo(map).bindPopup(textPopup))
    };
    formulario.value = "";
}

boton.addEventListener('click', searcher);

limpiar.addEventListener('click', () => {
    markerDelAgain(marker)
    cabecera.innerHTML = '';
    resultado.innerHTML = '';

});

formulario.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        searcher()
    }
});


function ondbClick(e) {
    alert("TEST");
}

function getColorIcon(nomCouche) {
    let iconObj = goldIcon;
    if (nomCouche == "parques") {
        iconObj = greenIcon;
    }
    if (nomCouche == "compras") {
        iconObj = goldIcon;
    }
    if (nomCouche == "actividades") {
        iconObj = blueIcon;
    }
    if (nomCouche == "comidas_bebidas") {
        iconObj = orangeIcon;
    }
    if (nomCouche == "cultura_religion") {
        iconObj = violeIcon;
    }
    if (nomCouche == "transporte") {
        iconObj = geyIcon;
    }
    if (nomCouche == "Hoteles_Hospedajes") {
        iconObj = redIcon;
    }
    if (nomCouche == "entidades_financieras") {
        iconObj = blackIcon;
    }
    return iconObj
}

//ICON
let greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let goldIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
let orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let violeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


let geyIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let blackIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});



async function getLayers() {
    const APIPython = "http://127.0.0.1:5000/layer";
    const response = await fetch(APIPython, { mode: 'cors' });
    return await response.json();
}

async function mainGet() {
    let layer = await getLayers()

    for (let index = 0; index < layer.length; index++) {
        await getIndividuals(layer[index].Name);
    }

}
mainGet().then(res => {
    L.control.layers({}, overlayMaps).addTo(map);

});
