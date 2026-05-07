import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  final List<Map<String, dynamic>> _allProducts = [
    {
      'id': '1',
      'name': 'Seth Muhammad Tufail Toka',
      'urduName': 'سیٹھ محمد طفیل ٹوکہ',
      'price': 'Rs. 85,000',
      'category': 'Toka',
      'image': 'https://img.freepik.com/free-vector/red-tractor-flat-style_1308-41006.jpg',
      'reg': '37397',
      'isHero': true,
    },
    {
      'id': '2',
      'name': 'Wheat Thresher 5 FT',
      'urduName': 'گندم تھریشر 5 فٹ',
      'price': 'Rs. 1,050,000',
      'category': 'Thresher',
      'image': 'https://cdn-icons-png.flaticon.com/512/3241/3241198.png',
      'reg': '68828',
    },
    {
      'id': '3',
      'name': 'Premium Rotavator',
      'urduName': 'پریمیم روٹا ویٹر',
      'price': 'Rs. 360,000',
      'category': 'Rotavator',
      'image': 'https://cdn-icons-png.flaticon.com/512/2900/2900350.png',
      'reg': '313436',
    },
  ];

  String _searchQuery = '';
  String _selectedCategory = 'All';

  List<Map<String, dynamic>> get _filteredProducts {
    return _allProducts.where((p) {
      final matchesSearch = p['name'].toLowerCase().contains(_searchQuery.toLowerCase()) ||
          p['urduName'].contains(_searchQuery);
      final matchesCategory = _selectedCategory == 'All' || p['category'] == _selectedCategory;
      return matchesSearch && matchesCategory;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Our Products | ہماری مصنوعات'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search products... | تلاش کریں',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onChanged: (val) => setState(() => _searchQuery = val),
            ),
          ),
          SizedBox(
            height: 50,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: ['All', 'Toka', 'Thresher', 'Rotavator', 'Pumps'].map((cat) {
                final isSelected = _selectedCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: FilterChip(
                    label: Text(cat),
                    selected: isSelected,
                    onSelected: (val) => setState(() => _selectedCategory = cat),
                    selectedColor: const Color(0xFFCC0000).withOpacity(0.2),
                    checkmarkColor: const Color(0xFFCC0000),
                  ),
                );
              }).toList(),
            ),
          ),
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.75,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: _filteredProducts.length,
              itemBuilder: (context, index) {
                final product = _filteredProducts[index];
                return GestureDetector(
                  onTap: () => context.push('/product-detail', extra: product),
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.grey[100],
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                            ),
                            child: Center(child: Image.network(product['image'], height: 100)),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(product['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12), maxLines: 1),
                              Text(product['urduName'], style: const TextStyle(color: Color(0xFFCC0000), fontSize: 10)),
                              const SizedBox(height: 4),
                              Text(product['price'], style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFCC0000))),
                            ],
                          ),
                        ),
                      ],
                    ),
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
