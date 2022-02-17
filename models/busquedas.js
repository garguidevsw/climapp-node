const axios = require('axios');

class Busquedas {

    historial = ['Oaxaca', 'Madrid', 'Medellin'];

    constructor() {
        // TODO: leer DB si existe
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
            console.log(resp.data);
            return [];
        } catch (error) {
            return [];
        }

    }
}

module.exports = Busquedas;