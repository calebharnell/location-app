import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  state = {
    region: {
      latitude: -27.4698,
      longitude: 153.0251,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    },
    markers: [],
    errorMessage: null,
    searchedLocation: null,
    listViewDisplayed: false,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }
  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };
  onRegionChange = (region) => {
    this.setState({ region });
  }
  render() {
    const { searchedLocation, listViewDisplayed } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MapView
          style={{flex: 1}}
          initialRegion={{
            latitude: -27.4698,
            longitude: 153.0251,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          showsUserLocation
        > 
          <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
            listViewDisplayed={listViewDisplayed}    // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              let region = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
                }
              let searchedLocation = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                name: details.name,
              }
              this.setState({ region, searchedLocation, listViewDisplayed: false })
            }}

            getDefaultValue={() => ''}

            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyD4KyoihuMYxzFXDrgSojmRUim6qoWVkX8',
              language: 'en', // language of the results
              types: '(cities)' // default: 'geocode'
            }}

            styles={{
              flex: 1,
              textInputContainer: {
                width: '100%'
              },
              description: {
                fontWeight: 'bold'
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              }
            }}

            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance',
              type: 'cafe'
            }}
            
            GooglePlacesDetailsQuery={{
              // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
              fields: 'formatted_address',
            }}

            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            // predefinedPlaces={[homePlace, workPlace]}

            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
          {
            searchedLocation && (
              <Marker
                coordinate={{ latitude: searchedLocation.latitude, longitude: searchedLocation.longitude }}
                title={searchedLocation.name}
              />
            )
          }
          {
            this.state.markers.map(marker => (
              <Marker
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title={marker.title}
                description={marker.description}
              />
            ))
          }
        </MapView>
      </SafeAreaView>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
});
