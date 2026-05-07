import 'package:flutter/material.dart';

class OrderTrackingScreen extends StatelessWidget {
  const OrderTrackingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Track Your Order | آرڈر ٹریک کریں'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFFCC0000),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Order ID: #37397-2024', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      Text('Tufail Toka Model X', style: TextStyle(color: Colors.white70)),
                    ],
                  ),
                  Icon(Icons.qr_code_2_rounded, color: Colors.white, size: 40),
                ],
              ),
            ),
            const SizedBox(height: 32),
            const Text('Live Progress', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            _buildTimelineItem('Order Confirmed', 'Your order has been verified.', true, true),
            _buildTimelineItem('Manufacturing', 'The machine is being assembled in our Faisalabad foundry.', true, true),
            _buildTimelineItem('Quality Check', 'Undergoing rigorous 10-point inspection.', true, false),
            _buildTimelineItem('Shipping', 'Ready for dispatch to your location.', false, false),
            _buildTimelineItem('Delivered', 'Enjoy your No.1 Toka machine!', false, false),
            const SizedBox(height: 32),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey[300]!),
              ),
              child: const Column(
                children: [
                  Row(
                    children: [
                      Icon(Icons.info_outline, color: Color(0xFFCC0000)),
                      SizedBox(width: 12),
                      Text('Expected Delivery:', style: TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                  SizedBox(height: 8),
                  Text('May 15, 2024', style: TextStyle(fontSize: 24, fontWeight: FontWeight.black, color: Color(0xFFCC0000))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTimelineItem(String title, String subtitle, bool isCompleted, bool isLast) {
    return IntrinsicHeight(
      child: Row(
        children: [
          Column(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: isCompleted ? const Color(0xFFCC0000) : Colors.grey[300],
                  shape: BoxShape.circle,
                ),
                child: isCompleted ? const Icon(Icons.check, color: Colors.white, size: 16) : null,
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: isCompleted ? const Color(0xFFCC0000) : Colors.grey[300],
                  ),
                ),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: isCompleted ? Colors.black : Colors.grey)),
                  Text(subtitle, style: TextStyle(color: Colors.grey[600], fontSize: 14)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
