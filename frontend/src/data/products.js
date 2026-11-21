import masalaChaiImg from '../assets/masala-chai.jpg';
import adrakChaiImg from '../assets/adrak-chai.jpg';
import elaichiChaiImg from '../assets/elaichi-chai.jpg';
import kesarChaiImg from '../assets/kesar-chai.jpg';
import kulhadChaiImg from '../assets/kulhad-chai.jpg';
import cuttingChaiImg from '../assets/cutting-chai.jpg';

export const allChaiProducts = [
  {
    id: 'classic-masala-chai',
    slug: 'classic-masala-chai',
    name: 'Classic Masala Chai',
    tagline: 'SIGNATURE CHAI',
    badge: 'Slow Simmered Chai',
    description: 'A rich blend of tea and aromatic Indian spices.',
    longDescription:
      'A rich blend of Indian tea and aromatic spices, freshly brewed for a comforting everyday cup. Hand-ground cinnamon, cloves, ginger, and cardamom simmered gently in rich milk.',
    price: 40,
    startingPrice: 40,
    formattedPrice: '₹40',
    image: masalaChaiImg,
    category: 'Chai',
    chaiType: 'masala',
    isAvailable: true,
    decoctionName: 'Signature Kadak Assam Leaf Base',
    decoctionStrength: 3,
    badges: ['✦ FRESH WHOLE SPICES', '⏱ SLOW SIMMERED'],
    pairingTag: 'Spiced Decoction',
    sizes: [
      { name: 'small', label: 'Small', volume: '150ml', price: 40 },
      { name: 'medium', label: 'Medium', volume: '250ml', price: 55 },
      { name: 'large', label: 'Large', volume: '350ml', price: 70 },
    ],
    customizationOptions: {
      sugar: ['No Sugar', 'Less Sugar', 'Regular Sugar'],
      milk: ['Dairy Milk', 'Oat Milk', 'Almond Milk'],
      spiceLevel: ['Mild', 'Medium', 'Strong'],
    },
  },
  {
    id: 'adrak-chai',
    slug: 'adrak-chai',
    name: 'Adrak Chai',
    tagline: 'SIGNATURE CHAI',
    badge: 'Fresh Crushed Ginger',
    description: 'Fresh ginger flavour with a comforting warmth.',
    longDescription:
      'Slow-steeped crushed fresh ginger root with full-bodied Assam tea leaves, delivering natural immunity, throat-soothing warmth, and an invigorating kick in every sip.',
    price: 45,
    startingPrice: 45,
    formattedPrice: '₹45',
    image: adrakChaiImg,
    category: 'Chai',
    chaiType: 'ginger',
    isAvailable: true,
    decoctionName: 'Fresh Ginger Root Infusion',
    decoctionStrength: 3,
    badges: ['✦ CRUSHED FRESH GINGER', '⏱ WINTER COMFORT'],
    pairingTag: 'Spiced Decoction',
    sizes: [
      { name: 'small', label: 'Small', volume: '150ml', price: 45 },
      { name: 'medium', label: 'Medium', volume: '250ml', price: 60 },
      { name: 'large', label: 'Large', volume: '350ml', price: 75 },
    ],
    customizationOptions: {
      sugar: ['No Sugar', 'Less Sugar', 'Regular Sugar'],
      milk: ['Dairy Milk', 'Oat Milk', 'Almond Milk'],
      spiceLevel: ['Mild', 'Medium', 'Strong'],
    },
  },
  {
    id: 'elaichi-chai',
    slug: 'elaichi-chai',
    name: 'Elaichi Chai',
    tagline: 'SIGNATURE CHAI',
    badge: 'Green Cardamom',
    description: 'Fragrant cardamom in every comforting sip.',
    longDescription:
      'Fragrant green cardamom pods gently crushed and infused into creamy whole milk and fine CTC brew. Delightfully aromatic, subtly sweet, and wonderfully soothing.',
    price: 45,
    startingPrice: 45,
    formattedPrice: '₹45',
    image: elaichiChaiImg,
    category: 'Chai',
    chaiType: 'elaichi',
    isAvailable: true,
    decoctionName: 'Aromatic Cardamom Pods',
    decoctionStrength: 2,
    badges: ['✦ GREEN CARDAMOM SEEDS', '⏱ AROMATIC STEEP'],
    pairingTag: 'Aromatic Cardamom',
    sizes: [
      { name: 'small', label: 'Small', volume: '150ml', price: 45 },
      { name: 'medium', label: 'Medium', volume: '250ml', price: 60 },
      { name: 'large', label: 'Large', volume: '350ml', price: 75 },
    ],
    customizationOptions: {
      sugar: ['No Sugar', 'Less Sugar', 'Regular Sugar'],
      milk: ['Dairy Milk', 'Oat Milk', 'Almond Milk'],
      spiceLevel: ['Mild', 'Medium', 'Strong'],
    },
  },
  {
    id: 'kesar-chai',
    slug: 'kesar-chai',
    name: 'Kesar Chai',
    tagline: 'ROYAL BREW',
    badge: 'Pure Saffron Threads',
    description: 'Royal Kashmiri saffron infused with rich whole milk.',
    longDescription:
      'Prized Kashmiri saffron strands slowly steeped into velvety whole milk and spiced tea leaves. Rich golden hue, royal fragrance, and opulent floral finish.',
    price: 60,
    startingPrice: 60,
    formattedPrice: '₹60',
    image: kesarChaiImg,
    category: 'Chai',
    chaiType: 'kesar',
    isAvailable: true,
    decoctionName: 'Kashmiri Mongra Saffron Base',
    decoctionStrength: 3,
    badges: ['✦ ROYAL SAFFRON', '⏱ OPULENT BREW'],
    pairingTag: 'Royal Saffron Infusion',
    sizes: [
      { name: 'small', label: 'Small', volume: '150ml', price: 60 },
      { name: 'medium', label: 'Medium', volume: '250ml', price: 80 },
      { name: 'large', label: 'Large', volume: '350ml', price: 100 },
    ],
    customizationOptions: {
      sugar: ['No Sugar', 'Less Sugar', 'Regular Sugar'],
      milk: ['Dairy Milk', 'Oat Milk', 'Almond Milk'],
      spiceLevel: ['Mild', 'Medium', 'Strong'],
    },
  },
  {
    id: 'kulhad-chai',
    slug: 'kulhad-chai',
    name: 'Kulhad Chai',
    tagline: 'HERITAGE SPECIAL',
    badge: 'Terracotta Clay Cup',
    description: 'Slow-brewed and served in traditional earthen clay.',
    longDescription:
      'Simmered over slow flame and served piping hot in unglazed natural earthen terracotta cups (kulhad). The clay imparts a delicate earthy aroma unmatched by modern ceramics.',
    price: 50,
    startingPrice: 50,
    formattedPrice: '₹50',
    image: kulhadChaiImg,
    category: 'Chai',
    chaiType: 'kulhad',
    isAvailable: true,
    decoctionName: 'Earthen Terracotta Matka Steep',
    decoctionStrength: 3,
    badges: ['✦ NATURAL CLAY KULHAD', '⏱ EARTHY HERITAGE'],
    pairingTag: 'Clay Pot Brew',
    sizes: [
      { name: 'small', label: 'Small', volume: '150ml', price: 50 },
      { name: 'medium', label: 'Medium', volume: '250ml', price: 65 },
      { name: 'large', label: 'Large', volume: '350ml', price: 80 },
    ],
    customizationOptions: {
      sugar: ['No Sugar', 'Less Sugar', 'Regular Sugar'],
      milk: ['Dairy Milk', 'Oat Milk', 'Almond Milk'],
      spiceLevel: ['Mild', 'Medium', 'Strong'],
    },
  },
  {
    id: 'cutting-chai',
    slug: 'cutting-chai',
    name: 'Cutting Chai',
    tagline: 'STREET LEGEND',
    badge: 'Kadak Mumbai Pour',
    description: 'Authentic Mumbai-style strong cutting pour.',
    longDescription:
      'Inspired by the bustling tea stalls of Mumbai. A half-cup of extra strong, double-boiled kadak chai packed with warming ginger and cardamom, served in classic roadside tea glasses.',
    price: 30,
    startingPrice: 30,
    formattedPrice: '₹30',
    image: cuttingChaiImg,
    category: 'Chai',
    chaiType: 'cutting',
    isAvailable: true,
    decoctionName: 'Mumbai Kadak Double Boil',
    decoctionStrength: 3,
    badges: ['✦ EXTRA KADAK BOIL', '⏱ MUMBAI CUTTING'],
    pairingTag: 'Kadak Street Boil',
    sizes: [
      { name: 'small', label: 'Small', volume: '150ml', price: 30 },
      { name: 'medium', label: 'Medium', volume: '250ml', price: 45 },
      { name: 'large', label: 'Large', volume: '350ml', price: 60 },
    ],
    customizationOptions: {
      sugar: ['No Sugar', 'Less Sugar', 'Regular Sugar'],
      milk: ['Dairy Milk', 'Oat Milk', 'Almond Milk'],
      spiceLevel: ['Mild', 'Medium', 'Strong'],
    },
  },
];

// Re-export signatureChaiProducts for backwards compatibility with Home.jsx
export const signatureChaiProducts = allChaiProducts.slice(0, 3);

// Helper to look up product by slug or id
export const getProductBySlugOrId = (slugOrId) => {
  if (!slugOrId) return allChaiProducts[0];
  const cleaned = slugOrId.toLowerCase().trim();
  return (
    allChaiProducts.find(
      (p) => p.slug === cleaned || p.id === cleaned || p.chaiType === cleaned
    ) || allChaiProducts[0]
  );
};
