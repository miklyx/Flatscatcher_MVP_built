import React, {useEffect, useState} from "react";
import { View,Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { getFlats, refreshFlats } from '../apiService';
import { Marker } from "react-native-maps";

export default function Map () {
  const [flats, setFlats] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  const [visibleFlats, setVisibleFlats] = useState(15);
  const [selectedFlat, setSelectedFlat] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFlats();
        setFlats(data);
      } catch (error) {
        console.error("Error fetching flats:", error);
      } finally {
        setIsLoading(false); 
      }
    }

    const refreshData = async() => {
      console.log('Refreshing flats...');
      setIsLoading(true)
      try {
        const refreshedFlats = await refreshFlats();
        if (refreshedFlats) {
          const newData = await getFlats();
          setFlats(newData);
        }
      } catch (error) {
        console.error("Error refreshing flats:", error);
      } finally {
        setIsLoading(false)
      }
    }
    //refreshData()
    fetchData()

    //const intervalId = setInterval(async () => {
    //  await refreshData()
    //}, 5 * 60 * 1000); 

    //return () => clearInterval(intervalId)

  },[])

  const loadMore = () => {
    setVisibleFlats(prevVisibleFlats => prevVisibleFlats + 10);
  };


  const handleMarkerPress = (flat) => {
    if (!selectedFlat) setSelectedFlat(flat)
    else setSelectedFlat(null);
  };

  const handleApply = (flat) => {
    Linking.openURL(flat.url)
        .catch((error) => {
        console.error('Error opening the link:', error);
          alert('Applied, but there was an error opening the link.');
        });
    flat.applied = true;
  };

  const filteredFlats = flats.filter(flat =>  flat.longitude && flat.latitude)
  filteredFlats.slice(0, 5)


  return (
    <View style={styles.container}>
      {isLoading && (
      <View >
        <Text style={styles.flatsLoading}>Loading flats...</Text>
      </View>
      )}
      <MapView 
        style={styles.map}
        provider={PROVIDER_GOOGLE} 
        initialRegion={{
          latitude: 52.498570832573186, 
          longitude: 13.406639494389717,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}>
        {filteredFlats.slice(0, visibleFlats).map((flat, index) => (
          <Marker
          key={index}
          coordinate={{latitude: flat.latitude, longitude: flat.longitude}}
          title={flat.about}
          description={'Price: '+flat.price+', Address: '+flat.address}
          onPress={() => handleMarkerPress(flat)}
          />
          ))}
      </MapView>
      
        <TouchableOpacity style={styles.buttonLoadMore} onPress={loadMore}>
          <Text style={{ color: '#fbf8ea', fontWeight: 'bold', fontSize: 16 }}>Load more flats on map...</Text>
        </TouchableOpacity>
      

      {selectedFlat && (
        <View style={styles.preferredFlat}>
          <Text style={styles.flatText}>{selectedFlat.about}</Text>
          <Text style={styles.flatText}>{selectedFlat.price}</Text>
          <Text style={styles.flatText}>{selectedFlat.size}</Text>
          <Text style={styles.flatText}>{selectedFlat.address}</Text>
      
          {!selectedFlat.applied ? (
            <TouchableOpacity style={styles.loadMoreButton} onPress={() => handleApply(selectedFlat)}>
            <Text style={{fontWeight:'bold', color: '#401F3E', textAlign: 'right'}}>Apply to flat</Text>
            </TouchableOpacity>
            ) : (
            <Text style={{fontWeight:'light', color: '#401F3E', textAlign: 'right'}}>Applied</Text>
            )
          } 
      </View>
      )}
    </View>
  )}
      



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5C4B51',
    flex: 7,
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 0,
  },
  flatBlock: {
    backgroundColor: '#FAF2A1', 
    color: '#401F3E',
    borderWidth: 1, 
    borderColor: 'gray', 
    borderRadius: 5, 
    padding: 10, 
    marginVertical: 10,
    marginHorizontal: 15,
  },
  preferredFlat: {
    backgroundColor: '#d9e9e5', 
    color: '#401F3E',
    borderWidth: 5, 
    borderColor: '#401F3E', 
    borderRadius: 5, 
    padding: 5, 
    marginVertical: 10,
    marginHorizontal: 15,
  },
  flatText: {
    color: "#401F3E", 
    fontStyle: 'italic',
    lineHeight: 13, 
  },
  loadMore: {
    fontWeight: 'bold',
  },
  map: {
    width: 400,
    height: 500,
    alignSelf: 'center'
  },
  banner: {
    width: '100%',
    height: 100, 
    resizeMode: 'cover',
  },
  loadMoreButton: {
    fontWeight: 'bold',

  },
  loadMoreText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#d9e9e5',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonLoadMore: {
    backgroundColor: '#401F3E',
    width: 300,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#401F3E',
    width: 300,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
  },
  flatsLoading: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#d9e9e5',
    marginBottom: 5
  },
});