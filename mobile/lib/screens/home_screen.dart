import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:lottie/lottie.dart';
import 'package:flutter_animate/flutter_animate.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AppDrawer(),
      body: CustomScrollView(
        slivers: [
          _buildAppBar(context),
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeroBanner().animate().fadeIn(duration: 800.ms).slideY(begin: 0.2),
                _buildQuickActions(context).animate().fadeIn(delay: 200.ms),
                _buildHadithBlock().animate().scale(delay: 400.ms),
                _buildSectionHeader('Product Categories', 'مصنوعات کی کیٹیگریز')
                    .animate().fadeIn(delay: 600.ms),
                _buildCategories(context).animate().fadeIn(delay: 800.ms).slideX(begin: 0.1),
                _buildSectionHeader('Featured Products', 'نمایاں مصنوعات')
                    .animate().fadeIn(delay: 1000.ms),
                _buildFeaturedProducts(context).animate().fadeIn(delay: 1200.ms),
                const SizedBox(height: 100),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return SliverAppBar(
      floating: true,
      pinned: true,
      expandedHeight: 80,
      backgroundColor: const Color(0xFFCC0000),
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'SETH M. TUFAIL',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
          ),
          Text(
            'FOUNDRY (PVT) LTD. | REG: 37397',
            style: TextStyle(fontSize: 10, color: Colors.white.withOpacity(0.8)),
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_none),
          onPressed: () {},
        ),
        IconButton(
          icon: const Icon(Icons.language),
          onPressed: () {},
        ),
      ],
    );
  }

  Widget _buildHeroBanner() {
    return Container(
      height: 200,
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFCC0000), Color(0xFF8B0000)],
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.red.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            right: -20,
            bottom: -20,
            child: Opacity(
              opacity: 0.1,
              child: const Icon(FontAwesomeIcons.gears, size: 200, color: Colors.white),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: Row(
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Pakistan Ka No.1 Toka',
                        style: TextStyle(
                          color: Color(0xFFD4AF37),
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'SETH MUHAMMAD\nTUFAIL TOKA',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                          fontSize: 22,
                          height: 1.1,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: 100,
                  height: 100,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const Center(
                    child: Text(
                      '37397',
                      style: TextStyle(
                        color: Color(0xFFCC0000),
                        fontWeight: FontWeight.bold,
                        fontSize: 24,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _quickActionItem(context, Icons.grid_view_rounded, 'Products', '/products'),
          _quickActionItem(context, Icons.location_on_rounded, 'Dealers', '/dealers'),
          _quickActionItem(context, Icons.track_changes_rounded, 'Track', '/track'),
          _quickActionItem(context, Icons.video_library_rounded, 'Videos', '/videos'),
        ],
      ),
    );
  }

  Widget _quickActionItem(BuildContext context, IconData icon, String label, String route) {
    return Column(
      children: [
        InkWell(
          onTap: () => context.go(route),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: const Color(0xFFCC0000)),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildHadithBlock() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFFD4AF37), width: 2),
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Center(
        child: Text(
          '"جو شخص حلال روزی کماتا ہے، اللہ تعالیٰ اس کے رزق میں برکت عطا فرماتا ہے۔"',
          textAlign: TextAlign.center,
          style: TextStyle(
            color: Color(0xFFCC0000),
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
          textDirection: TextDirection.rtl,
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, String urdu) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              Text(urdu, style: const TextStyle(color: Color(0xFFCC0000), fontWeight: FontWeight.bold)),
            ],
          ),
          TextButton(onPressed: () {}, child: const Text('View All')),
        ],
      ),
    );
  }

  Widget _buildCategories(BuildContext context) {
    final cats = [
      {'icon': FontAwesomeIcons.scissors, 'name': 'Toka'},
      {'icon': FontAwesomeIcons.wheatAwn, 'name': 'Thresher'},
      {'icon': FontAwesomeIcons.tractor, 'name': 'Rotavator'},
      {'icon': FontAwesomeIcons.pumpSoap, 'name': 'Pumps'},
    ];

    return SizedBox(
      height: 100,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: cats.length,
        itemBuilder: (context, i) {
          return Container(
            width: 90,
            margin: const EdgeInsets.only(right: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: Colors.grey[200]!),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(cats[i]['icon'] as IconData, color: Colors.grey[600], size: 24),
                const SizedBox(height: 8),
                Text(cats[i]['name'] as String, style: const TextStyle(fontSize: 12)),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildFeaturedProducts(BuildContext context) {
    final featuredProducts = [
      {
        'id': '1',
        'name': 'Tufail Toka 37397',
        'urduName': 'سیٹھ طفیل ٹوکہ',
        'price': 'Rs. 85,000',
        'image': 'https://img.freepik.com/free-vector/red-tractor-flat-style_1308-41006.jpg',
        'reg': '37397',
        'isHero': true,
      },
      {
        'id': '2',
        'name': 'Wheat Thresher',
        'urduName': 'گندم تھریشر',
        'price': 'Rs. 1,050,000',
        'image': 'https://cdn-icons-png.flaticon.com/512/3241/3241198.png',
        'reg': '68828',
      },
      {
        'id': '3',
        'name': 'Rotavator 54',
        'urduName': 'روٹا ویٹر',
        'price': 'Rs. 360,000',
        'image': 'https://cdn-icons-png.flaticon.com/512/2900/2900350.png',
        'reg': '313436',
      },
    ];

    return Container(
      height: 280,
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: featuredProducts.length,
        itemBuilder: (context, i) {
          final product = featuredProducts[i];
          return GestureDetector(
            onTap: () => context.push('/product-detail', extra: product),
            child: Container(
            width: 200,
            margin: const EdgeInsets.all(8),
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
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 140,
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  ),
                  child: Center(child: Image.network(product['image'] as String, height: 100)),
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        product['name'] as String,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        product['urduName'] as String,
                        style: const TextStyle(color: Color(0xFFCC0000), fontSize: 12),
                        textDirection: TextDirection.rtl,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            product['price'] as String,
                            style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFCC0000)),
                          ),
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: const BoxDecoration(
                              color: Color(0xFFCC0000),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.add, color: Colors.white, size: 16),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
      ),
    );
  }
}

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          const DrawerHeader(
            decoration: BoxDecoration(color: Color(0xFFCC0000)),
            child: Center(
              child: Text(
                'SETH M. TUFAIL\nFOUNDRY',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          _drawerItem(Icons.home, 'Home', () => context.go('/home')),
          _drawerItem(Icons.shopping_bag, 'Products', () => context.go('/products')),
          _drawerItem(Icons.location_on, 'Dealers', () => context.go('/dealers')),
          _drawerItem(Icons.info, 'About Us', () {}),
          _drawerItem(Icons.agriculture, 'Kisaan Corner', () => context.go('/kisaan-corner')),
          const Divider(),
          _drawerItem(Icons.track_changes_rounded, 'Track Order', () => context.go('/track')),
          _drawerItem(Icons.person, 'Dealer Login', () {}),
          _drawerItem(Icons.admin_panel_settings, 'Admin Panel', () {}),
        ],
      ),
    );
  }

  Widget _drawerItem(IconData icon, String label, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFFCC0000)),
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
      onTap: onTap,
    );
  }
}
