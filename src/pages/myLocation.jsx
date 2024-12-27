import React, { useState, useEffect, useRef, useCallback } from 'react';
import WakeLockComponent from '../component/wakeLock.jsx';
import destination_ico from '../assets/destination_ico.png';
import rider_ico from '../assets/rider_ico.png';

const LocationTracker = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const isInitializedRef = useRef(false);
  const polylinesRef = useRef([]); // Array to store multiple route polylines

  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    heading: null,
    speed: null
  });
  const [destination, setDestination] = useState({
    latitude: null,
    longitude: null,
    address: ''
  });
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState(null);
  const [requestCounter, setRequestCounter] = useState(0);
  const [distance, setDistance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeMap = useCallback(async () => {
    
    if (!mapRef.current || isInitializedRef.current) {
        console.log('Early return triggered:', {
          mapRef: mapRef.current,
          isInitialized: isInitializedRef.current,
        });
        return;
      }
    
    try {
      await loadGoogleMapsScript(import.meta.env.VITE_APP_GCP_API_KEY);
      
      const { Map, Marker, Polyline, SymbolPath } = window.google.maps;
      
    // Create the map with 3D perspective (tilt)
    const map = new Map(mapRef.current, {
        zoom: 15,
        center: { lat: location.latitude, lng: location.longitude },
        mapTypeId: 'roadmap',  // Or 'satellite' for satellite view
        streetViewControl: false,
        mapTypeControl: false,
        tilt: 45,  // 3D perspective tilt
        heading: location.heading,  // Set the heading for proper orientation
        compass: true,  // Enable the compass control
        rotateControl: true,
        gestureHandling: 'cooperative',
        zoomControl: true,
        styles: [
          {
            featureType: "administrative",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ],
      });

      // Set bicycle icon as a marker
      const bicycleIcon = {
        url: rider_ico, 
        scaledSize: new window.google.maps.Size(50, 50),
      };
      // Add the marker to the map
      const marker = new Marker({
        map,
        icon: bicycleIcon,
      });

      /*const marker = new Marker({
        map,
        icon: {
          path: SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        }
      });*/

      const polyline = new Polyline({
        map,
        path: [],
        strokeColor: '#f44242',
        strokeOpacity: 1.0,
        strokeWeight: 6
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      polylineRef.current = polyline;
      isInitializedRef.current = true;
      setIsLoading(false);

    } catch (err) {
      setError('Error loading Google Maps');
      setIsLoading(false);
    }
  }, [location.latitude, location.longitude]);

const updateMap = useCallback(async (newLat, newLng) => {
  if (!mapInstanceRef.current || !markerRef.current) return;

  const newPosition = { lat: newLat, lng: newLng };
  markerRef.current.setPosition(newPosition);
  mapInstanceRef.current.panTo(newPosition);

  if (destination.latitude && destination.longitude) {
    try {
      const directionsService = new window.google.maps.DirectionsService();

      // Clear existing polylines
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
      polylinesRef.current = [];

      const request = {
        origin: newPosition,
        destination: {
          lat: destination.latitude,
          lng: destination.longitude
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true // Request alternative routes
      };

      const result = await new Promise((resolve, reject) => {
        directionsService.route(request, (response, status) => {
          if (status === 'OK') resolve(response);
          else reject(new Error('Failed to retrieve route'));
        });
      });

      // Create polylines for each route with different colors
      const colors = ['#4285F4', '#0F9D58', '#DB4437']; // Google colors
      
      result.routes.forEach((route, index) => {
        const polyline = new window.google.maps.Polyline({
          map: mapInstanceRef.current,
          path: route.overview_path,
          strokeColor: colors[index % colors.length],
          strokeOpacity: 0.8,
          strokeWeight: 5
        });

        // Add click listener to make route selectable
        polyline.addListener('click', () => {
          // Highlight selected route
          polylinesRef.current.forEach((pl, i) => {
            pl.setOptions({
              strokeOpacity: i === index ? 1.0 : 0.4,
              strokeWeight: i === index ? 6 : 4,
              zIndex: i === index ? 2 : 1
            });
          });

          // Display route info (distance and duration)
          const leg = route.legs[0];
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <strong>Route ${index + 1}</strong><br>
                Distance: ${leg.distance.text}<br>
                Duration: ${leg.duration.text}
              </div>
            `
          });
          infoWindow.open(mapInstanceRef.current, markerRef.current);
        });

        polylinesRef.current.push(polyline);
      });

    } catch (err) {
      console.error('Directions error:', err);
      setError('Error fetching routes');
    }
  }
}, [location, destination, setError]);

  const handleDestinationSearch = useCallback(async () => {
    if (!window.google || !searchInput) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      
      const results = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: searchInput }, (results, status) => {
          if (status === 'OK') resolve(results);
          else reject(new Error('Location not found'));
        });
      });

      if (results[0]) {
        const location = results[0].geometry.location;
        const newDestination = {
          latitude: location.lat(),
          longitude: location.lng(),
          address: results[0].formatted_address
        };
        
        setDestination(newDestination);

        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.setPosition(location);
        } else {
          destinationMarkerRef.current = new window.google.maps.Marker({
            map: mapInstanceRef.current,
            position: location,
            icon: {
              url: destination_ico,
              scaledSize: new google.maps.Size(45, 45),
            }
          });
        }

        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(markerRef.current.getPosition());
        bounds.extend(location);
        mapInstanceRef.current.fitBounds(bounds);
      }
    } catch (err) {
      setError('Error searching for location');
    }
  }, [searchInput]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);
  
  // Throttle position updates
  const THROTTLE_MS = 20000; // 1 second
  const MIN_DISTANCE = 5; // 5 meters
  const MIN_HEADING_CHANGE = 5; // 5 degrees
  const [lastUpdate, setLastUpdate] = useState(0);
  const [lastLocation, setLastLocation] = useState(null);
  const [lastHeading, setLastHeading] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    const successCallback = (position) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        heading: position.coords.heading,
        speed: position.coords.speed
      };
      
      setLocation(newLocation);
      setRequestCounter(prev => prev + 1);
      if (isInitializedRef.current) {
            //updateMap(newLocation.latitude, newLocation.longitude);
            // Only update if enough time passed and significant movement
            console.log('lastUpdate', lastUpdate);
            console.log('Date.now() - lastUpdate', Date.now() - lastUpdate);
            console.log('THROTTLE_MS', THROTTLE_MS);
            console.log('Date.now() - lastUpdate > THROTTLE_MS', Date.now() - lastUpdate > THROTTLE_MS);
            console.log('calculateDistance(lastLocation, newLocation)', calculateDistance(lastLocation, newLocation));
            console.log('MIN_DISTANCE', MIN_DISTANCE);
            console.log('calculateDistance(lastLocation, newLocation) > MIN_DISTANCE', calculateDistance(lastLocation, newLocation) > MIN_DISTANCE);
            console.log('Math.abs(lastHeading - location.heading)', Math.abs(lastHeading - location.heading));
            console.log('MIN_HEADING_CHANGE', MIN_HEADING_CHANGE);
            console.log('Math.abs(lastHeading - location.heading) > MIN_HEADING_CHANGE', Math.abs(lastHeading - location.heading) > MIN_HEADING_CHANGE);
            if (Date.now() - lastUpdate > THROTTLE_MS && 
                lastLocation === null ||
                calculateDistance(lastLocation, newLocation) > MIN_DISTANCE ||
                Math.abs(lastHeading - location.heading) > MIN_HEADING_CHANGE) {

                console.log('updating map!!');
                // Update map
                updateMap(newLocation.latitude, newLocation.longitude);
                setLastUpdate(Date.now());
                setLastLocation(newLocation);
                setLastHeading(location.heading);
            }
      }
    };
    
    const calculateDistance = (lastPosition, newPosition) => {
        // Return 0 if either position is null/undefined
        if (!lastPosition || !newPosition) return 0;
      
        // Convert latitude and longitude from degrees to radians
        const lat1 = lastPosition.latitude * (Math.PI / 180);
        const lon1 = lastPosition.longitude * (Math.PI / 180);
        const lat2 = newPosition.latitude * (Math.PI / 180);
        const lon2 = newPosition.longitude * (Math.PI / 180);
      
        // Radius of Earth in meters
        const R = 6371000;
      
        // Haversine formula
        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1) * Math.cos(lat2) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
      
        return distance; // Returns distance in meters
    };

    const errorCallback = (error) => {
      setError(error.message);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const watchId = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [updateMap]);

  // Utility function to load Google Maps script
  const loadGoogleMapsScript = (apiKey) => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
        return;
      }
  
      // Check if script is already being loaded
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.google.maps));
        existingScript.addEventListener('error', reject);
        return;
      }
  
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  
      script.addEventListener('load', () => resolve(window.google.maps));
      script.addEventListener('error', reject);
      
      document.head.appendChild(script);
    });
  };

//   if (isLoading) {
//     return (
//       <div className="container py-4">
//         <div className="card">
//           <div className="card-body text-center">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

  // Rest of the JSX remains the same as before
  return (
    <>
      <WakeLockComponent />
      <div className="container py-4">
        <div className="card">
            <div className="card-header">
            <h5 className="card-title mb-0">Real-time Navigation Tracker</h5>
            </div>
            { isLoading && (
            <div className="card-body text-center">
                <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            )}
            <div className="card-body">
            <div className="mb-4">
                <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter destination address"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button 
                    className="btn btn-primary" 
                    onClick={handleDestinationSearch}
                >
                    Set Destination
                </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger mb-4">
                {error}
                </div>
            )}

            {destination.address && (
                <div className="alert alert-info mb-4">
                <strong>Destination:</strong> {destination.address}
                {distance && (
                    <div><strong>Distance remaining:</strong> {distance.toFixed(2)} km</div>
                )}
                </div>
            )}

            <div 
                ref={mapRef} 
                style={{ height: '400px', width: '100%' }} 
                className="mb-4"
            />
            
            <div className="row g-4">
                <div className="col-12 col-md-4">
                <div className="p-3 bg-light rounded">
                    <div className="fw-bold">Current Location</div>
                    <div>Lat: {location.latitude.toFixed(6)}°</div>
                    <div>Lng: {location.longitude.toFixed(6)}°</div>
                </div>
                </div>
                
                <div className="col-12 col-md-4">
                <div className="p-3 bg-light rounded">
                    <div className="fw-bold">Speed</div>
                    <div>{location.speed ? `${location.speed.toFixed(2)} m/s` : 'N/A'}</div>
                </div>
                </div>
                
                <div className="col-12 col-md-4">
                <div className="p-3 bg-light rounded">
                    <div className="fw-bold">Heading</div>
                    <div>{location.heading ? `${location.heading.toFixed(2)}°` : 'N/A'}</div>
                </div>
                </div>
            </div>
            
            <div className="mt-4 text-end text-muted small">
                Updates received: {requestCounter}
            </div>
            </div>
        </div>
        </div>
    </>
  );
};

export default LocationTracker;