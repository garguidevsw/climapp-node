const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase()+p.substring(1));

            return palabras.join(' ');
        });
    }

    get paramsMapbox() {
        return {
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5
        }
    }

    async ciudad(lugar = ''){
        // Petición http --- https://reqres.in/api/users?page=2
        
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });
            const resp = await instance.get();
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return [];
        }

    }

    get paramsOpenWeatherMap() {
        return {
            'lang': 'es',
            'units': 'metric',
            'appid': process.env.OPENWEATHERMAP_KEY
        }
    }

    async clima(lat = '', lng = ''){
        // Petición http --- https://reqres.in/api/users?page=2
        // api.openweathermap.org/data/2.5/weather?lat=17.06694&lon=-96.72028&appid=b99d50e278d03b4478ba066ecdf354e3
        
        try {
            
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { 
                    ...this.paramsOpenWeatherMap, 
                    lat, 
                    lon: lng
                }
            });
            const { data } = await instance.get();

            // return resp.data.main;

            return {
                desc: data.weather[0].description,
                min: data.main.temp_min,
                max: data.main.temp_max,
                temp: data.main.temp
            }
            // return resp.data.features.map( lugar => ({
            //     id: lugar.id,
            //     nombre: lugar.place_name,
            //     lng: lugar.center[0],
            //     lat: lugar.center[1]
            // }));
        } catch (error) {
            return {};
        }

    }

    agregarHistorial( lugar = '') {
        //Validar duplicados
        if(this.historial.includes( lugar.toLowerCase())){
            return;
        }

        this.historial =  this.historial.splice(0, 5);
        this.historial.unshift(lugar.toLowerCase());

        //Grabar en json
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB(){
        if(!fs.existsSync(this.dbPath)){
            return null;
        }
        const resp = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});

        const data = JSON.parse(resp);
        this.historial = data.historial;
    }

    
}

module.exports = Busquedas;