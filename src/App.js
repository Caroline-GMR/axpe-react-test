import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
} from "@react-google-maps/api";

import mapStyles from "./mapStyles";
import logo from './logo.png';

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";


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

export default function App() {
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
      
      <Search panTo={panTo} />
      
      <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      center={currentPosition}
      options={options}
      onLoad={onMapLoad}
      >
      {markers.map(marker => <Marker 
        key={marker.i}
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


function Search({ panTo }) {
  const{
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete()
  return (
    <div className="search">
      <Combobox
      onSelect={async (address) => {
        setValue(address, false);
        clearSuggestions();
        try {
          const results = await getGeocode({ address });
          const { lat, lng } = await getLatLng(results[0]);
          panTo({ lat, lng });
        } catch (error) {
          console.log("error!");
        } 
        console.log(address);
      }}>
        <ComboboxInput
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
        placeholder="Search places..."
        />
        <ComboboxPopover>
          <ComboboxList>
        {status === "OK" && data.map(({ id, description }) => (
          <ComboboxOption key={description} value={description} />
        ))}
        </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>

  )
}