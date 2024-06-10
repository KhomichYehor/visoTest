import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

import './App.css'

const mapContainerStyle = {
  width: '99vw',
  height: '80vh'
};

const center = {
  lat: 12.9716,
  lng: 77.5946
};

const firebaseConfig = {
  apiKey: "AIzaSyBRJMm1DfRvjvQgVzD_1wsJCeY_zL88u9g",
  authDomain: "visotest-99d06.firebaseapp.com",
  databaseURL: "https://visotest-99d06-default-rtdb.firebaseio.com",
  projectId: "visotest-99d06",
  storageBucket: "visotest-99d06.appspot.com",
  messagingSenderId: "1085843180944",
  appId: "1:1085843180944:web:225f7e044fe667b641b715",
  measurementId: "G-4JSPT3HZWD"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

const App = () => {
  const [markers, setMarkers] = useState([]);
  const [markerId, setMarkerId] = useState(1);

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const timestamp = new Date().toISOString();

    const newMarker = {
      id: markerId,
      position: {
        lat: lat,
        lng: lng
      },
      timestamp: timestamp
    };

    const questName = `Quest${markerId}`;
    const location = `${lat}, ${lng}`;

    database.ref(questName).update({
      Location: location,
      Timestamp: timestamp
    });

    setMarkers([...markers, newMarker]);
    setMarkerId(markerId + 1);
  };

  const deleteMarker = (id) => {

    database.ref(`markers/${id}`).remove();
    setMarkers(markers.filter(marker => marker.id !== id));
  };

  const deleteAllMarkers = () => {
    database.ref('markers').remove();
    setMarkers([]);
    setMarkerId(1);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBc6gTq5yMBTW9fqh-DM4gWelpAIDW6IyQ">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        onClick={onMapClick}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            label={marker.id.toString()}
            draggable={true}
            onClick={() => deleteMarker(marker.id)}
          />
        ))}
      </GoogleMap>
      <div className='deleteAll-wrapper'>
        <button className='deleteAll' onClick={deleteAllMarkers}>Delete All Markers</button>
      </div>
    </LoadScript>
  );
};

export default App;


