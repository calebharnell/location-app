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
} from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  state = {
    location: {
      coords: {
        latitude: -27.4698,
        longitude: 153.0251
      },
    },
    errorMessage: null,
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
    console.log( location )
  };
  render() {
    return (
      <MapView
        style={{flex: 1}}
        initialRegion={{
          latitude: -27.4698,
          longitude: 153.0251,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
      >
        <MapView.Circle
          center={this.state.location.coords}
          radius={50}
        />
        <MapView.Marker
          coordinate={this.state.location.coords}
          title="My Marker"
          description="Some description"
        />
      </MapView>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
});
