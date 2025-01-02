import { useEffect, useLayoutEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

export default function App() {
  const URL =
    "https://geo.ipify.org/api/v2/country,city?apiKey=at_yBhfIyqhrF2VfXvyXmuSvLzDaCUPZ";
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const customIcon = L.icon({
    iconUrl: "/icon-location.svg", //
    iconSize: [40, 40], //
    iconAnchor: [20, 40], //
    popupAnchor: [0, -40], //
  });

  useEffect(() => {
    if (mapRef.current) {
      console.log("Map is already initialized");
      return;
    }
    console.log("Initializing map...");

    mapRef.current = L.map("map").setView([51.505, -0.09], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    // Remove any existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current.removeLayer(layer);
      }
    });

    L.marker([51.5, -0.09])
      .addTo(mapRef.current)
      .bindPopup("Getting your location")
      .openPopup();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Geolocation success:", latitude, longitude);
          setUserLocation({ latitude, longitude });
          mapRef.current.setView([latitude, longitude], 13);
          L.marker([latitude, longitude], { icon: customIcon })
            .addTo(mapRef.current)
            .bindPopup("Your Loaction")
            .openPopup();
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation({ latitude: 51.505, longitude: -0.09 });
        }
      );
    } else {
      console.log("Geolocation is not supported by your browser");
    }

    axios({
      method: "get",
      url: URL,
    })
      .then((response) => {
        setData(response.data);
        console.log(response.data);

        const lat = response.data.location.lat;
        const lng = response.data.location.lng;
        mapRef.current.setView([lat, lng], 13);
        L.marker([lat, lng])
          .addTo(mapRef.current)
          .bindPopup(`Your Location`)
          .openPopup();
      })
      .catch((error) => {
        console.error("Error in fetching data", error);
      });

    return () => {
      console.log("cleaning up");
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  function handleSearch() {
    if (!query) {
      alert("Please enter an IP address or domain name");
      return;
    }

    const searchURL = `${URL}&ipAddress=${query}`;

    axios({
      method: "get",
      url: searchURL,
    })
      .then((response) => {
        setData(response.data);
        console.log(response.data);

        const lat = response.data.location.lat;
        const lng = response.data.location.lng;
        mapRef.current.setView([lat, lng], 13);
        L.marker([lat, lng])
          .addTo(mapRef.current)
          .bindPopup(`Location for ${query}`)
          .openPopup();

        setData(response.data);
      })
      .catch((error) => {
        console.error("Error in fetching data", error);
        alert("Could not find your search");
      });

    return () => {
      console.log("cleaning up");
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }

  return (
    <>
      <div className="relative h-64 w-full top gap-5 bg-map-mobile lg:bg-map-desktop bg-cover bg-no-repeat flex flex-col items-center p-7">
        <h1 className="text-white text-2xl">Jay IP Address Tracker</h1>
        <div className="search-box flex flex-row items-center relative lg:top-5">
          <input
            type="search"
            value={query}
            className="w-80 md:w-96 h-10 lg:w-[30rem] lg:placeholder:text-[16px] outline-none p-1 pl-4 rounded-lg placeholder:text-[14px]"
            placeholder="Search for any IP address or domain name"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Search on Enter
          />
          <button
            onClick={handleSearch}
            type="submit"
            className="h-10 transition-all ease-in-out p-4 flex items-center absolute right-0 rounded-r-lg text-white bg-black hover:bg-darkGray"
          >{`>`}</button>
        </div>
        <div className="results lg:justify-between lg:pr-52 lg:flex-row lg:top-16 relative lg:w-[60rem] z-[999] shadow-lg gap-5 rounded-xl bg-white w-80 md:w-96 flex flex-col items-center p-7">
          <div className="flex flex-col items-center lg:items-start">
            <p className="text-[11px] tracking-widest font-medium text-veryDarkGray">
              IP ADDRESS
            </p>
            <p className="font-semibold tracking-widest">
              {data?.ip || "Fetching.."}
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start">
            <p className="text-[11px] tracking-widest font-medium text-veryDarkGray">
              LOCATION
            </p>
            <p className="font-semibold tracking-wide">
              {data?.location.city || "Fetching.."}
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start">
            <p className="text-[11px] tracking-widest font-medium text-veryDarkGray">
              TIMEZONE
            </p>
            <p className="font-semibold tracking-wide">
              {data?.location.timezone || "Fetching.."}
            </p>
          </div>
          <div className="flex flex-col items-center lg:items-start">
            <p className="text-[11px] tracking-widest font-medium text-veryDarkGray">
              ISP
            </p>
            <p className="font-semibold tracking-wide">
              {data?.isp || "Fetching.."}
            </p>
          </div>
        </div>
      </div>

      {/* map */}
      <div id="map" className={` relative `}></div>
    </>
  );
}
