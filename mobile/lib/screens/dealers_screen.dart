import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class DealerNetworkScreen extends StatefulWidget {
  const DealerNetworkScreen({super.key});

  @override
  State<DealerNetworkScreen> createState() => _DealerNetworkScreenState();
}

class _DealerNetworkScreenState extends State<DealerNetworkScreen> {
  late GoogleMapController mapController;

  final LatLng _center = const LatLng(31.4504, 73.1350); // Faisalabad Center

  final List<Map<String, dynamic>> _dealers = [
    {
      'name': 'Faisalabad Main Showroom',
      'location': const LatLng(31.4187, 73.0791),
      'address': 'Samundri Road, Faisalabad',
      'phone': '041-8549185',
    },
    {
      'name': 'Lahore Regional Dealer',
      'location': const LatLng(31.5204, 74.3587),
      'address': 'Badami Bagh, Lahore',
      'phone': '0300-1234567',
    },
    {
      'name': 'Multan Agriculture Center',
      'location': const LatLng(30.1575, 71.5249),
      'address': 'Vehari Road, Multan',
      'phone': '0301-7654321',
    },
  ];

  final Set<Marker> _markers = {};

  @override
  void initState() {
    super.initState();
    for (var dealer in _dealers) {
      _markers.add(
        Marker(
          markerId: MarkerId(dealer['name']),
          position: dealer['location'],
          infoWindow: InfoWindow(
            title: dealer['name'],
            snippet: dealer['address'],
          ),
        ),
      );
    }
  }

  void _onMapCreated(GoogleMapController controller) {
    mapController = controller;
  }

  void _callDealer(String phone) async {
    final url = 'tel:$phone';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dealer Network | ڈیلر نیٹ ورک'),
      ),
      body: Column(
        children: [
          Expanded(
            flex: 2,
            child: GoogleMap(
              onMapCreated: _onMapCreated,
              initialCameraPosition: CameraPosition(
                target: _center,
                zoom: 7.0,
              ),
              markers: _markers,
            ),
          ),
          Expanded(
            flex: 3,
            child: ListView.builder(
              itemCount: _dealers.length,
              itemBuilder: (context, index) {
                final dealer = _dealers[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    leading: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFCC0000).withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.location_on, color: Color(0xFFCC0000)),
                    ),
                    title: Text(dealer['name'], style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(dealer['address']),
                        const SizedBox(height: 4),
                        Text(dealer['phone'], style: const TextStyle(color: Color(0xFFD4AF37), fontWeight: FontWeight.bold)),
                      ],
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.call, color: Colors.green),
                      onPressed: () => _callDealer(dealer['phone']),
                    ),
                    onTap: () {
                      mapController.animateCamera(
                        CameraUpdate.newLatLngZoom(dealer['location'], 12),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
