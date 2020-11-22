import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";

import mapStyles from "../styles/mapStyles";
import logo from '../assets/logo.png';
import SearchBox from './SearchBox';

import "@reach/combobox/styles.css";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,

}

export default function InitMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = useState([]);

  const [ currentPosition, setCurrentPosition ] = useState({});
 
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const position = position => {
		const currentPosition = {
		lat: position.coords.latitude,
    lng: position.coords.longitude,
    }
    setCurrentPosition(currentPosition);
	};
	
	useEffect(() => {
    navigator.geolocation.getCurrentPosition(position);
  })
  
  const onPlaceSelected = ({ lat, lng }) => 
  setMarkers(current => 
    [...current, { lat, lng }]
    )

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(8);
    onPlaceSelected({ lat, lng });
  }, []);


  if (loadError) return "Error!";
  if (!isLoaded) return "Loading...";

  return(
    <div>
    <img src={logo} className="axpe-logo" alt="logo" />
      
      <SearchBox panTo={panTo} />
      
      <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={currentPosition}
      options={options}
      onLoad={onMapLoad}
      >
      {markers.map(marker => <Marker 
        key={`${marker.lat}-${marker.lng}`}
        position={{ lat: marker.lat, lng: marker.lng}}
        icon={{
          url: `http://maps.google.com/mapfiles/ms/icons/blue-dot.png`
        }}
         />
      )}
      
      </GoogleMap> 
    </div>
  )
}
