import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class KisaanCornerScreen extends StatelessWidget {
  const KisaanCornerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Kisaan Corner | کسان کارنر'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildGuideCard(
            'Machine Maintenance',
            'مشین کی دیکھ بھال',
            'Learn how to keep your Toka and Thresher in top condition for years.',
            Icons.build_rounded,
            const Color(0xFFCC0000),
          ),
          const SizedBox(height: 16),
          _buildGuideCard(
            'Seasonal Tips',
            'موسمی مشورے',
            'Get expert advice on which machinery to use for the upcoming harvest.',
            Icons.eco_rounded,
            Colors.green,
          ),
          const SizedBox(height: 16),
          _buildGuideCard(
            'Spare Parts',
            'اسپیئر پارٹس',
            'Find genuine spare parts for all Seth M. Tufail machines.',
            Icons.settings_suggest_rounded,
            const Color(0xFFD4AF37),
          ),
          const SizedBox(height: 32),
          const Text(
            'Daily Farming Tips (Urdu)',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          _buildUrduTip(
            'گندم کی کٹائی کے لیے تھریشر کی صفائی بہت ضروری ہے۔ استعمال سے پہلے تمام پرزوں کو چیک کریں۔',
          ),
          _buildUrduTip(
            'ٹوکہ مشین کے بلیڈ کو باقاعدگی سے تیز کریں تاکہ چارہ کاٹنے میں آسانی ہو۔',
          ),
          const SizedBox(height: 40),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFFCC0000),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                const Icon(Icons.support_agent_rounded, color: Colors.white, size: 48),
                const SizedBox(height: 16),
                const Text(
                  'Need Help? Call Expert',
                  style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const Text(
                  '041-8549185',
                  style: TextStyle(color: Color(0xFFD4AF37), fontSize: 24, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () async {
                    final url = Uri.parse('tel:0418549185');
                    if (await canLaunchUrl(url)) {
                      await launchUrl(url);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFFCC0000),
                    minimumSize: const Size(double.infinity, 50),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Call Now'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGuideCard(String title, String urdu, String desc, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 30),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                Text(urdu, style: TextStyle(color: color, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(desc, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Colors.grey),
        ],
      ),
    );
  }

  Widget _buildUrduTip(String tip) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Text(
        tip,
        textAlign: TextAlign.right,
        style: const TextStyle(fontSize: 16, height: 1.5),
        textDirection: TextDirection.rtl,
      ),
    );
  }
}
