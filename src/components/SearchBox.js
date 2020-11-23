import React from "react";

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

function SearchBox({ panTo }) {
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
        {status === "OK" && data.map(({ description }) => (
          <ComboboxOption key={description} value={description} />
        ))}
        </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>

  )
}

export default SearchBox