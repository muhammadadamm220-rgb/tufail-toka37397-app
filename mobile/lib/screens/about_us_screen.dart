import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_animate/flutter_animate.dart';

class AboutUsScreen extends StatelessWidget {
  const AboutUsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const String logoUrl = 'https://sethtufail.com/cdn/shop/files/Logo_Sending.png';

    return Scaffold(
      appBar: AppBar(
        title: const Text('About Us | ہمارے بارے میں'),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(32),
              color: Colors.white,
              child: Column(
                children: [
                  Image.network(logoUrl, height: 120),
                  const SizedBox(height: 16),
                  const Text(
                    'SETH M. TUFAIL FOUNDRY (PVT) LTD.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFFCC0000)),
                  ),
                  const Text(
                    'GOVERNMENT REGISTRATION NO: 37397',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFD4AF37), letterSpacing: 1),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle('Our Legacy', 'ہماری پہچان'),
                  const Text(
                    'Since 1980, Seth M. Tufail Foundry has been the pioneer of agricultural machinery in Pakistan. Based in Faisalabad, we manufacture the nation\'s No. 1 Chaff Cutters (Toka), Wheat Threshers, and Rotavators.',
                    style: TextStyle(fontSize: 15, height: 1.6),
                  ).animate().fadeIn(duration: 600.ms),
                  const SizedBox(height: 32),
                  _buildSectionTitle('Quality Assurance', 'معیار کی ضمانت'),
                  const Text(
                    'Every machine with the 37397 registration mark is a symbol of trust, durability, and high performance. We use premium hardened steel and state-of-the-art manufacturing processes.',
                    style: TextStyle(fontSize: 15, height: 1.6),
                  ).animate().fadeIn(delay: 200.ms, duration: 600.ms),
                  const SizedBox(height: 40),
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.grey[300]!),
                    ),
                    child: Column(
                      children: [
                        _contactRow(Icons.location_on, 'Samanabad Road, Faisalabad, Pakistan'),
                        const Divider(height: 32),
                        _contactRow(Icons.phone, '(041) 8714167'),
                        const Divider(height: 32),
                        _contactRow(Icons.language, 'www.sethtufail.com'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String en, String ur) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(en, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
            Text(ur, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFFCC0000))),
          ],
        ),
        const SizedBox(height: 8),
        Container(width: 60, height: 4, color: const Color(0xFFD4AF37)),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _contactRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, color: const Color(0xFFCC0000), size: 24),
        const SizedBox(width: 16),
        Expanded(child: Text(text, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14))),
      ],
    );
  }
}
