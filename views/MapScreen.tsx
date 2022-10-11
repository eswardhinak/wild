import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import compass from '../assets/compass.png';
import * as Location from 'expo-location';

const getBearing = (lat1, lng1, lat2, lng2) => {
  const y = Math.sin(lng2-lng1) * Math.cos(lat2);
  const x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lng2-lng1);
  const theta = Math.atan2(y, x);
  const brng = (theta*180/Math.PI + 360) % 360; // in degrees
  return brng
}

const getHaversineDistance = (lat1, lng1, lat2, lng2) => {    
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lng2-lng1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c; // in metres

  return d
}


const MapScreen = (props) => {
  const destinationLatitude = 42.3727765
  const destinationLongitude = -71.1034176
  const location = props.location
  const rerender = props.rerender

  try {

    let{ latitude, longitude, heading, speed }  = location['coords']

    speed = (speed / 1609.34) * 3600

    let distance = getHaversineDistance(latitude, longitude, destinationLatitude, destinationLongitude)
    distance = distance / 1609.34
    const bearing = getBearing(latitude, longitude, destinationLatitude, destinationLongitude)

    const bearingDifference = parseInt(bearing - heading).toString() + 'deg'
    const transformArray = [{rotate: bearingDifference}]

    const mapScreenStyles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#123',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '20%'
        },
        compass: {
            flex: 1,
            aspectRatio: 0.5,
            resizeMode: 'contain',
            transform: transformArray,
            transitionProperty: 'transform'
        }
    })

    return (
      <View style={mapScreenStyles.container}>
        <Image
            source={compass}
            style={mapScreenStyles.compass} 
        />
        <Text style={{color: 'white'}}>{speed} MPH</Text>
        <Text style={{color: 'white'}}>{latitude}, {longitude}</Text>
        <Text style={{color: 'white'}}>Heading: {heading.toFixed(2)}°</Text>
        <Text style={{color: 'white'}}>Bearing: {bearing.toFixed(2)}°</Text>
        <Text style={{color: 'white'}}>Distance Remaining: {distance.toFixed(2)} miles</Text>
        <Text style={{color: 'white'}}>Rerender: {String(rerender)}</Text>
      </View>
    );
  }
  catch (err) {
    console.log(err)
    return (
      <View/>
    )
  }
};

export default MapScreen