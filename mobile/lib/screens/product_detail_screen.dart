import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:animate_do/animate_do.dart';

class ProductDetailScreen extends StatelessWidget {
  final Map<String, dynamic> product;

  const ProductDetailScreen({super.key, required this.product});

  void _launchWhatsApp() async {
    final url = 'https://wa.me/923001234567?text=I am interested in ${product['name']}';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                color: Colors.grey[100],
                padding: const EdgeInsets.all(40),
                child: Image.network(
                  product['image'],
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              product['name'],
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.black,
                                letterSpacing: -0.5,
                              ),
                            ).animate().fadeIn().slideX(begin: -0.2),
                            const SizedBox(height: 4),
                            Text(
                              product['urduName'],
                              style: const TextStyle(
                                fontSize: 24,
                                color: Color(0xFFCC0000),
                                fontWeight: FontWeight.bold,
                              ),
                              textDirection: TextDirection.rtl,
                            ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.2),
                          ],
                        ),
                      ),
                      if (product['isHero'] == true)
                        FadeInRight(
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: const Color(0xFFD4AF37),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(color: const Color(0xFFD4AF37).withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))
                              ]
                            ),
                            child: const Text(
                              'NO.1 QUALITY',
                              style: TextStyle(fontWeight: FontWeight.black, fontSize: 10, color: Colors.white),
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'REGISTRATION NO: ${product['reg'] ?? "37397"}',
                    style: TextStyle(color: Colors.grey[400], fontWeight: FontWeight.black, fontSize: 10, letterSpacing: 1.5),
                  ).animate().fadeIn(delay: 400.ms),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFFCC0000),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(color: const Color(0xFFCC0000).withOpacity(0.2), blurRadius: 20, offset: const Offset(0, 10))
                      ]
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Price Tag',
                          style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          product['price'],
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.black,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ).animate().scale(delay: 600.ms, duration: 400.ms),
                  const SizedBox(height: 40),
                  const Text(
                    'Technical Specifications',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.black),
                  ).animate().fadeIn(delay: 800.ms),
                  const SizedBox(height: 16),
                  _buildSpecRow('Weight', '850 KG', 0),
                  _buildSpecRow('Capacity', '2500 KG/Hour', 1),
                  _buildSpecRow('Material', 'Premium Hardened Steel', 2),
                  _buildSpecRow('Warranty', '2 Years Official', 3),
                  const SizedBox(height: 120),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _launchWhatsApp,
                icon: const Icon(FontAwesomeIcons.whatsapp),
                label: const Text('WhatsApp Inquiry'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green[600],
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFCC0000),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Add to Cart', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSpecRow(String label, String value, int index) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 12)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.black, fontSize: 14)),
        ],
      ),
    ).animate().fadeIn(delay: (1000 + (index * 100)).ms).slideX(begin: 0.1);
  }
}
