import { UserLocation } from '../types/firebase';
import { ProfileService } from './ProfileService';

export class LocationService {
  private static instance: LocationService;
  private locationCache: UserLocation | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Get user's current GPS location with reverse geocoding
  async getCurrentLocation(): Promise<UserLocation | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log('Got GPS coordinates:', { latitude, longitude });
            
            // Use Nominatim (OpenStreetMap) reverse geocoding service
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=en`,
              {
                headers: {
                  'User-Agent': 'HireLocal-Location-Service/1.0'
                }
              }
            );
            
            if (!response.ok) {
              throw new Error(`Geocoding failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Reverse geocoding response:', data);
            
            const address = data.address;
            
            if (!address) {
              throw new Error('No address found in response');
            }
            
            // Extract detailed location information with comprehensive fallbacks
            const area = address.suburb || 
                        address.neighbourhood || 
                        address.residential || 
                        address.quarter || 
                        address.district || 
                        address.hamlet || 
                        address.village || 
                        address.locality ||
                        '';
                        
            const city = address.city || 
                        address.town || 
                        address.municipality || 
                        address.county ||
                        '';
                        
            const state = address.state || 
                         address.province || 
                         address.region ||
                         '';
                         
            const country = address.country ||
                           '';
            
            let finalArea = area;
            let finalCity = city;
            
            // If we don't have area/city, parse from display_name
            if (!finalArea && !finalCity && data.display_name) {
              const parts = data.display_name.split(',').map((part: string) => part.trim());
              finalArea = parts[0] || 'your area';
              finalCity = parts[1] || parts[0] || 'your location';
            }
            
            // Ensure we have at least basic location info
            if (!finalArea) finalArea = 'your area';
            if (!finalCity) finalCity = 'your location';
            
            // Build full address parts
            const addressParts = [];
            if (finalArea && finalArea !== 'your area') addressParts.push(finalArea);
            if (finalCity && finalCity !== finalArea && finalCity !== 'your location') addressParts.push(finalCity);
            if (state) addressParts.push(state);
            if (country) addressParts.push(country);
            
            const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'your area';
            
            const userLocation: UserLocation = {
              area: finalArea,
              city: finalCity,
              state: state || undefined,
              country: country || 'unknown',
              fullAddress,
              coordinates: {
                latitude,
                longitude
              },
              lastUpdated: new Date(),
              source: 'gps'
            };
            
            console.log('Parsed user location:', userLocation);
            this.locationCache = userLocation;
            resolve(userLocation);
            
          } catch (error) {
            console.error('Error processing GPS location:', error);
            
            // Fallback: try simpler geocoding
            try {
              const { latitude, longitude } = position.coords;
              const simpleResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=12`,
                {
                  headers: {
                    'User-Agent': 'HireLocal-Location-Service/1.0'
                  }
                }
              );
              
              if (simpleResponse.ok) {
                const simpleData = await simpleResponse.json();
                const displayName = simpleData.display_name;
                
                if (displayName) {
                  const parts = displayName.split(',').map((part: string) => part.trim());
                  const area = parts[0] || 'your area';
                  const city = parts[1] || parts[0] || 'your location';
                  
                  const fallbackLocation: UserLocation = {
                    area,
                    city: city !== area ? city : 'your location',
                    country: 'unknown',
                    fullAddress: parts.slice(0, 2).join(', ') || area,
                    coordinates: {
                      latitude,
                      longitude
                    },
                    lastUpdated: new Date(),
                    source: 'gps'
                  };
                  
                  this.locationCache = fallbackLocation;
                  resolve(fallbackLocation);
                  return;
                }
              }
            } catch (fallbackError) {
              console.error('Fallback geocoding failed:', fallbackError);
            }
            
            // Final coordinate-based fallback
            console.warn('Using coordinate-based location');
            const coordinateLocation: UserLocation = {
              area: 'your area',
              city: 'your location',
              country: 'unknown',
              fullAddress: 'your current location',
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              lastUpdated: new Date(),
              source: 'gps'
            };
            
            this.locationCache = coordinateLocation;
            resolve(coordinateLocation);
          }
        },
        (error) => {
          console.error('Geolocation permission error:', error);
          resolve(null);
        },
        {
          timeout: 15000,
          enableHighAccuracy: true,
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
    });
  }

  // Create location from manual input
  createManualLocation(locationText: string): UserLocation {
    const parts = locationText.split(',').map(part => part.trim());
    const area = parts[0] || locationText;
    const city = parts[1] || parts[0];
    const state = parts[2];
    const country = parts[3] || 'unknown';

    return {
      area,
      city,
      state,
      country,
      fullAddress: locationText,
      lastUpdated: new Date(),
      source: 'manual'
    };
  }

  // Save location to user profile
  async saveUserLocation(userId: string, location: UserLocation): Promise<void> {
    try {
      await ProfileService.updateProfile(userId, { location });
      this.locationCache = location;
      console.log('Location saved to user profile:', location);
    } catch (error) {
      console.error('Error saving location to profile:', error);
      throw error;
    }
  }

  // Get location from cache or profile
  getCachedLocation(): UserLocation | null {
    return this.locationCache;
  }

  // Set cached location
  setCachedLocation(location: UserLocation): void {
    this.locationCache = location;
  }

  // Check if location is recent (within 24 hours)
  isLocationRecent(location: UserLocation): boolean {
    const now = new Date();
    const locationTime = new Date(location.lastUpdated);
    const hoursDiff = (now.getTime() - locationTime.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24;
  }

  // Format location for display
  formatLocationForDisplay(location: UserLocation): string {
    const parts = [];
    if (location.area && location.area !== 'your area') parts.push(location.area);
    if (location.city && location.city !== location.area && location.city !== 'your location') parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country && location.country !== 'unknown') parts.push(location.country);
    
    return parts.length > 0 ? parts.join(', ') : location.fullAddress;
  }

  // Format location for API calls
  formatLocationForAPI(location: UserLocation): string {
    // For "near me" queries, provide detailed location
    const parts = [];
    if (location.area && location.area !== 'your area') parts.push(location.area);
    if (location.city && location.city !== location.area && location.city !== 'your location') parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country && location.country !== 'unknown') parts.push(location.country);
    
    return parts.length > 0 ? parts.join(', ') : location.fullAddress;
  }

  // Clear location cache
  clearCache(): void {
    this.locationCache = null;
  }
}

export const locationService = LocationService.getInstance();
