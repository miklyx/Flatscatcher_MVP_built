import apiKey from './settings.json'

const URL = "https://flat-service-w52m.onrender.com"//process.env.BE_URL;

export async function getFlats () {
  try {
    const responce = await fetch(URL+'/flats')
    const data = await responce.json();
    const flats = await Promise.all(
      data.map(async flat => {
        const coordinates = await getCoordinates(flat.address);
        flat.longitude = coordinates[0]
        flat.latitude = coordinates[1]
        return flat
      })
    )
    return flats;
  } catch (e) {
    console.log('this is an catched error',e);
  }
}

export async function refreshFlats () {
  try {
    const response = await fetch(URL + '/refresh_flats');
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.text();
    if (data === "Refreshed") {
      return true
    }
  } catch (error) {
    console.error("Error refreshing flats:", error);
    return { success: false, message: "Error refreshing flats" }; // Informative error message for handling
  }
}

export async function getCoordinates (adr) {
  try {
    const geoURL = 'https://api.geoapify.com/v1/geocode/search?text='
    const apiAdr = 'apiKey=eee1cb95010b46c495452f1642cc866d'
    const responce = await fetch(`${geoURL}${adr}&${apiAdr}`, {
      method: "GET",
      headers: {"Content-Type" : 'application/json'},
    });
    const data = await responce.json();
    //console.log(data.features[0].geometry.coordinates)
    return data.features[0].geometry.coordinates;
  } catch (e) {
    console.log(e);
  }
}
