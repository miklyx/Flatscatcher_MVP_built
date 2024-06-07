import React, {useEffect, useState} from "react";
import { View,Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
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
    fetchData()
  },[])

  const loadMore = () => {
    setVisibleFlats(prevVisibleFlats => prevVisibleFlats + 10);
  };

  const handleRefreshFlats = async () => {
    setIsLoading(true)
    try {
      res = await refreshFlats(); 
      if (res) {
        console.log('refreshed')
        const fetchedFlats = await getFlats(); 
        setFlats(fetchedFlats);
        setIsLoading(false)}
    } catch (error) {
      console.error("Error refreshing flats:", error);
    }
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
      
      {visibleFlats < flats.length && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
          <Text style={styles.loadMoreText}>Load more flats ...</Text>
        </TouchableOpacity>
        )}
      
      <TouchableOpacity style={styles.button} onPress={handleRefreshFlats}>
        <Text style={{ color: '#fbf8ea', fontWeight: 'bold', fontSize: 16 }}>Refresh flats from sources</Text>
      </TouchableOpacity>

      {selectedFlat && (
        <View style={styles.preferredFlat}>
          <Text style={{color:"#401F3E", fontStyle: 'italic', marginBottom:10}}>{selectedFlat.title}</Text>
          <Text>{selectedFlat.price} €</Text>
          <Text>{selectedFlat.size} m2</Text>
          <Text>{selectedFlat.address}</Text>
      
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
    flex: 1,
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
    padding: 10, 
    marginVertical: 10,
    marginHorizontal: 15,
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
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#401F3E',
    width: 300,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 40,
  },
  flatsLoading: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#d9e9e5',
    marginBottom: 5
  },
});