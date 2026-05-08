import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:flutter_animate/flutter_animate.dart';

class AboutUsScreen extends StatelessWidget {
  const AboutUsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const String logoUrl = 'https://tufailtoka37397-v3.web.app/logo.png';

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
                    'PAKISTAN\'S NO. 1 BRAND | REG: 37397',
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
                    'Starting from a small workshop in Faisalabad, Seth M. Tufail Foundry (Pvt.) Ltd. has grown into a cornerstone of Pakistani agriculture. Our commitment to the farmer\'s success has driven us to perfect the Chaff Cutter (Toka) and Wheat Thresher over four decades.',
                    style: TextStyle(fontSize: 15, height: 1.6),
                  ).animate().fadeIn(duration: 600.ms),
                  const SizedBox(height: 24),
                  _buildMilestone('1980', 'Founded by Seth Muhammad Tufail in Faisalabad.'),
                  _buildMilestone('1990', 'Launch of the first high-capacity Wheat Thresher.'),
                  _buildMilestone('2005', 'Nationwide expansion of dealer network.'),
                  _buildMilestone('Today', 'Pakistan\'s leading agricultural machinery brand.'),
                  const SizedBox(height: 32),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFFCC0000).withOpacity(0.05),
                      borderRadius: BorderRadius.circular(15),
                      border: Border.all(color: const Color(0xFFCC0000).withOpacity(0.2)),
                    ),
                    child: const Column(
                      children: [
                        Text(
                          'جو شخص حلال روزی کماتا ہے، اللہ تعالیٰ اس کے رزق میں برکت عطا فرماتا ہے۔',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFFCC0000), fontStyle: FontStyle.italic),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'The one who earns a lawful livelihood, Allah grants blessings in his sustenance.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    ),
                  ).animate().scale(delay: 400.ms),
                  const SizedBox(height: 40),
                  _buildSectionTitle('Contact Us', 'رابطہ کریں'),
                  _contactRow(Icons.location_on, 'Faisalabad, Punjab, Pakistan'),
                  _contactRow(Icons.language, 'tufailtoka37397-v3.web.app'),
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

  Widget _buildMilestone(String year, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(year, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFCC0000), fontSize: 16)),
          const SizedBox(width: 16),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 14))),
        ],
      ),
    );
  }

  Widget _contactRow(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFFCC0000), size: 24),
          const SizedBox(width: 16),
          Expanded(child: Text(text, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14))),
        ],
      ),
    );
  }
}
