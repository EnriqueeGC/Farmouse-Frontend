import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet'; // Importar Leaflet para crear los iconos personalizados

// Ruta de los iconos personalizados
import userLocationIcon from '../../src/assets/images/user-location-icon.png'; // Icono de ubicación
import pharmacyIcon from '../../src/assets/images/pharmacy-icon.png'; // Icono de farmacia
import pharmacyLocationIcon from '../../src/assets/images/pharmacy-icon-locate.png'; // Icono de farmacia seleccionada
import gokuImage from '../../src/assets/images/goku.png'; // Imagen de Goku

const SeleccionarUbicacion = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null); // Almacenar la farmacia más cercana
    const [message, setMessage] = useState(""); // Mensaje de estado
    const navigate = useNavigate();

    // Obtener la ubicación del usuario
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setLoading(false);
                    fetchNearbyPharmacies(latitude, longitude); // Obtener farmacias cercanas
                },
                (error) => {
                    alert('No se pudo obtener tu ubicación');
                    setLoading(false);
                }
            );
        } else {
            alert('La geolocalización no está disponible en tu navegador');
            setLoading(false);
        }
    };

    // Función para obtener farmacias cercanas usando Overpass API
    const fetchNearbyPharmacies = (latitude, longitude) => {
        const radius = 5000; // Radio de búsqueda (en metros)
        const query = `[out:json];(node["amenity"="pharmacy"](around:${radius},${latitude},${longitude}););out;`;

        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.elements) {
                    setNearbyPharmacies(data.elements); // Guardar las farmacias cercanas
                }
            })
            .catch(error => {
                console.error("Error al obtener farmacias cercanas:", error);
            });
    };

    useEffect(() => {
        getUserLocation();
    }, []);

    const handleBackToHomeClick = () => navigate('/'); // Botón para regresar al home

    // Crear los iconos personalizados para los marcadores
    const userLocationMarker = new L.Icon({
        iconUrl: userLocationIcon,  // Usar el icono de ubicación del usuario
        iconSize: [40, 40],  // Tamaño del icono
        iconAnchor: [20, 40],  // Anclar el icono en la base
        popupAnchor: [0, -40],  // Ajustar el popup
    });

    const pharmacyMarker = new L.Icon({
        iconUrl: pharmacyIcon,  // Usar el icono de farmacia
        iconSize: [30, 30],  // Tamaño del icono
        iconAnchor: [15, 30],  // Anclar el icono en la base
        popupAnchor: [0, -30],  // Ajustar el popup
    });

    const pharmacyLocationMarker = new L.Icon({
        iconUrl: pharmacyLocationIcon,  // Icono de farmacia con localización
        iconSize: [40, 40],  // Tamaño del icono
        iconAnchor: [20, 40],  // Anclar el icono en la base
        popupAnchor: [0, -40],  // Ajustar el popup
    });

    // Función para seleccionar la ubicación de entrega
    const handleSelectDelivery = () => {
        localStorage.setItem("selectedLocation", JSON.stringify(userLocation)); // Guardar ubicación
        setMessage("Ubicación correctamente seleccionada");
    };

    // Función para seleccionar la farmacia más cercana
    const handleSelectPickup = () => {
        if (nearbyPharmacies.length === 0 || !userLocation) {
            setMessage("No se pudo determinar la farmacia más cercana");
            return;
        }

        // Calcular la farmacia más cercana
        const closestPharmacy = nearbyPharmacies.reduce((closest, pharmacy) => {
            const pharmacyLocation = [pharmacy.lat, pharmacy.lon];
            const distance = getDistance(userLocation, pharmacyLocation);

            if (!closest || distance < closest.distance) {
                return { pharmacy, distance };
            }

            return closest;
        }, null);

        if (closestPharmacy) {
            const { pharmacy } = closestPharmacy;
            setMessage(`Farmacia más cercana: ${pharmacy.tags.name}`);
            setSelectedPharmacy([pharmacy.lat, pharmacy.lon]); // Establecer la ubicación de la farmacia
        }
    };

    // Función para calcular la distancia entre dos ubicaciones (en metros)
    const getDistance = (location1, location2) => {
        const R = 6371; // Radio de la Tierra en km
        const dLat = (location2[0] - location1[0]) * (Math.PI / 180);
        const dLon = (location2[1] - location1[1]) * (Math.PI / 180);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(location1[0] * (Math.PI / 180)) *
                Math.cos(location2[0] * (Math.PI / 180)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c * 1000; // Distancia en metros
    };

    return (
        <div className="location-page">
            <div className="header">
                <Button onClick={handleBackToHomeClick} style={{ marginTop: '20px' }}>Volver a inicio</Button>
            </div>

            <div className="map-section" style={{ position: 'relative' }}>
                {loading ? (
                    <div>Cargando ubicación...</div>
                ) : userLocation ? (
                    <MapContainer center={userLocation} zoom={15} style={{ width: '100%', height: '400px' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {/* Marcador para la ubicación del usuario */}
                        <Marker position={userLocation} icon={userLocationMarker}>
                            <Popup>Tu ubicación actual.</Popup>
                        </Marker>

                        {/* Agregar los marcadores de las farmacias cercanas */}
                        {nearbyPharmacies.map((pharmacy, index) => (
                            <Marker
                                key={index}
                                position={[pharmacy.lat, pharmacy.lon]}
                                icon={selectedPharmacy && selectedPharmacy[0] === pharmacy.lat && selectedPharmacy[1] === pharmacy.lon ? pharmacyLocationMarker : pharmacyMarker}  // Cambiar icono si es la farmacia seleccionada
                            >
                                <Popup>
                                    <strong>{pharmacy.tags.name}</strong><br />
                                    {pharmacy.tags.address || "Dirección no disponible"}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                ) : (
                    <div>No se pudo determinar tu ubicación.</div>
                )}

                <img
                    src={gokuImage}
                    alt="Goku"
                    style={{
                        position: 'absolute',
                        right: '10px', // Ubicación en la orilla derecha
                        bottom: '10px', // Ubicación en la parte inferior
                        width: '100px', // Ajusta el tamaño de la imagen
                        zIndex: 9999, // Asegura que esté encima del mapa
                    }}
                />
            </div>

            <div className="delivery-options">
                <Button color="warning" style={{ width: '100%' }} onClick={handleSelectDelivery}>
                    Entrega a domicilio
                </Button>
                <Button color="secondary" style={{ width: '100%', marginTop: '10px' }} onClick={handleSelectPickup}>
                    Recoge en tienda
                </Button>
            </div>

            {message && <div className="message">{message}</div>} {/* Mostrar mensaje */}
        </div>
    );
};

export default SeleccionarUbicacion;
