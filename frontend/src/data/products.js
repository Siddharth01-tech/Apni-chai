import masalaChaiImg from '../assets/masala-chai.jpg';
import adrakChaiImg from '../assets/adrak-chai.jpg';
import elaichiChaiImg from '../assets/elaichi-chai.jpg';

export const signatureChaiProducts = [
  {
    id: 'masala-chai',
    name: 'Masala Chai',
    description: 'Classic and flavorful.',
    price: 40,
    formattedPrice: '₹40',
    image: masalaChaiImg,
    category: 'Chai',
    isAvailable: true,
    tag: 'Signature'
  },
  {
    id: 'adrak-chai',
    name: 'Adrak Chai',
    description: 'Bold and refreshing.',
    price: 45,
    formattedPrice: '₹45',
    image: adrakChaiImg,
    category: 'Chai',
    isAvailable: true,
    tag: 'Popular'
  },
  {
    id: 'elaichi-chai',
    name: 'Elaichi Chai',
    description: 'Smooth and aromatic.',
    price: 45,
    formattedPrice: '₹45',
    image: elaichiChaiImg,
    category: 'Chai',
    isAvailable: true,
    tag: 'Aromatic'
  }
];
