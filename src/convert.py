import gpxpy
import simplekml

def convert_gpx_to_kml(gpx_file_path, kml_file_path):
    # Load GPX file
    with open(gpx_file_path, 'r') as gpx_file:
        gpx = gpxpy.parse(gpx_file)
    
    # Create a KML object
    kml = simplekml.Kml()

    # Add waypoints to KML
    for waypoint in gpx.waypoints:
        kml.newpoint(name=waypoint.name, coords=[(waypoint.longitude, waypoint.latitude)])
    
    # Add tracks to KML
    for track in gpx.tracks:
        for segment in track.segments:
            coords = [(point.longitude, point.latitude) for point in segment.points]
            kml.newlinestring(name=track.name, coords=coords)
    
    # Add routes to KML
    for route in gpx.routes:
        coords = [(point.longitude, point.latitude) for point in route.points]
        kml.newlinestring(name=route.name, coords=coords)
    
    # Save KML file
    kml.save(kml_file_path)

if __name__ == "__main__":
    gpx_file_path = "input.gpx"  # replace with your GPX file path
    kml_file_path = "output.kml"  # replace with your desired KML file path
    convert_gpx_to_kml(gpx_file_path, kml_file_path)
    print(f"Converted {gpx_file_path} to {kml_file_path}")
