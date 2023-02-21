import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Button, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const API_KEY = 'gIV82gbnvvRt4h6vncRnbthPSPNwDYOG';
export default function App() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  const handleShowAddress = async () => {
    if (address) {
      const response = await fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=${API_KEY}&location=${address}`);
      const data = await response.json();
      if (data.results.length > 0) {
        const coords = data.results[0].locations[0].latLng;
        setCoordinates({ latitude: coords.lat, longitude: coords.lng });
      }
    }
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(location);
      setCoordinates({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    };

    getCurrentLocation();
  }, []);

  const initial = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initial}
      >
        {coordinates && (
          <Marker
            coordinate={coordinates}
            title={address || 'Current location'}
          />
        )}
      </MapView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          onChangeText={text => setAddress(text)}
          value={address}
        />
        <Button
          title="Show"
          onPress={handleShowAddress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10
  }
});
