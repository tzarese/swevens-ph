// SWEVENS Platform Data Configuration - Coquette Edition 🎀
// Comprehensive dataset for games, denominations, payment channels, vouchers, and reviews

const SWEVENS_DATA = {
  categories: [
    {
      id: 'mlbb',
      name: 'Mobile Legends 🎀',
      gameName: 'MOBILE LEGENDS',
      characterName: 'Kagura 🌸',
      subtitle: 'Weekly Pass & Diamonds',
      icon: 'swords',
      image: '/images/characters/mlbb-kagura.jpg',
      badge: 'Fastest ⚡',
      color: 'from-pink-600/40 to-rose-500/30'
    },
    {
      id: 'valorant',
      name: 'Valorant 🎀',
      gameName: 'VALORANT',
      characterName: 'Agent Jett 🌪️',
      subtitle: 'Riot Points & Battle Pass',
      icon: 'crosshair',
      image: '/images/characters/valorant-jett.jpg',
      badge: 'Instant VP ✨',
      color: 'from-rose-500/40 to-pink-400/30'
    },
    {
      id: 'genshin',
      name: 'Genshin Impact 🌸',
      gameName: 'GENSHIN IMPACT',
      characterName: 'Yae Miko 🌸',
      subtitle: 'Welkin Moon & Crystals',
      icon: 'sparkles',
      image: '/images/characters/genshin-yaemiko.jpg',
      badge: 'Welkin Pass ♡',
      color: 'from-pink-500/40 to-purple-400/30'
    },
    {
      id: 'roblox',
      name: 'Roblox 🎀',
      gameName: 'ROBLOX',
      characterName: 'Coquette Avatar 🎀',
      subtitle: 'Instant Robux & Codes',
      icon: 'box',
      image: '/images/characters/roblox-avatar.jpg',
      badge: 'Instant Robux 👛',
      color: 'from-rose-400/40 to-pink-300/30'
    },
    {
      id: 'freefire',
      name: 'Free Fire 💎',
      gameName: 'FREE FIRE',
      characterName: 'Kelly ⚡',
      subtitle: 'Diamonds & Membership',
      icon: 'flame',
      image: '/images/characters/freefire-kelly.jpg',
      badge: 'Hot Deal 🎀',
      color: 'from-purple-500/40 to-pink-500/30'
    },
    {
      id: 'codm',
      name: 'COD: Mobile 🎖️',
      gameName: 'CALL OF DUTY',
      characterName: 'Urban Tracker 🎖️',
      subtitle: 'CP Points & Battle Pass',
      icon: 'crosshair',
      image: '/images/characters/codm-urbantracker.jpg',
      badge: 'Garena CP ⚡',
      color: 'from-rose-500/40 to-pink-400/30'
    }
  ],

  paymentMethods: [
    {
      id: 'wallet',
      name: 'SWEVENS Wallet Saldo (Member)',
      category: 'Member Balance',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
      badge: 'Instant 0s 🎀 0% Fee',
      fee: 0,
      feeType: 'fixed',
      processingTime: 'Instant (0s)',
      popular: true,
      memberOnly: true
    },
    {
      id: 'qrph',
      name: 'QR Ph (All PH Banks & Wallets)',
      category: 'Instant QR',
      logo: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80',
      badge: 'Fastest 🎀 0% Fee',
      fee: 0,
      feeType: 'fixed',
      processingTime: 'Instant (10-30s)',
      popular: true
    },
    {
      id: 'gcash',
      name: 'GCash',
      category: 'E-Wallet',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/GCash_logo.svg/320px-GCash_logo.svg.png',
      badge: 'Most Popular ♡',
      fee: 0,
      feeType: 'fixed',
      processingTime: 'Instant (1-2 mins)',
      popular: true
    },
    {
      id: 'maya',
      name: 'Maya (PayMaya)',
      category: 'E-Wallet',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Maya_logo_2022.svg/320px-Maya_logo_2022.svg.png',
      badge: 'Zero Fee',
      fee: 0,
      feeType: 'fixed',
      processingTime: 'Instant (1-2 mins)',
      popular: true
    },
    {
      id: 'shopeepay',
      name: 'ShopeePay',
      category: 'E-Wallet',
      logo: 'https://seeklogo.com/images/S/shopeepay-logo-262CB22A1E-seeklogo.com.png',
      badge: 'Cashback Ready',
      fee: 1,
      feeType: 'percentage',
      processingTime: 'Instant'
    },
    {
      id: 'grabpay',
      name: 'GrabPay',
      category: 'E-Wallet',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/GrabPay_logo.svg/320px-GrabPay_logo.svg.png',
      badge: 'GrabRewards',
      fee: 1.5,
      feeType: 'percentage',
      processingTime: 'Instant'
    },
    {
      id: 'bpi',
      name: 'BPI Online Direct',
      category: 'Bank Transfer',
      logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Bank_of_the_Philippine_Islands_logo.svg/320px-Bank_of_the_Philippine_Islands_logo.svg.png',
      badge: 'Online Banking',
      fee: 5,
      feeType: 'fixed',
      processingTime: '1-5 mins'
    },
    {
      id: 'unionbank',
      name: 'UnionBank PH',
      category: 'Bank Transfer',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/UnionBank_Philippines_logo.svg/320px-UnionBank_Philippines_logo.svg.png',
      badge: 'Instant Transfer',
      fee: 5,
      feeType: 'fixed',
      processingTime: '1-5 mins'
    },
    {
      id: '7eleven',
      name: '7-Eleven CLIQQ',
      category: 'Over-the-Counter',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/7-eleven_logo.svg/320px-7-eleven_logo.svg.png',
      badge: 'Barcode Pay',
      fee: 10,
      feeType: 'fixed',
      processingTime: '5-15 mins'
    }
  ],

  vouchers: [
    { code: 'COQUETTE5', discount: 5, type: 'percent', minSpend: 50, desc: '🎀 5% OFF on all game top-ups with love ♡' },
    { code: 'SWEVENS5', discount: 5, type: 'percent', minSpend: 50, desc: '🎀 5% OFF on all game top-ups' },
    { code: 'SWEET20', discount: 20, type: 'fixed', minSpend: 250, desc: '✨ ₱20 OFF on Mobile Legends Diamonds' },
    { code: 'WELCOME10', discount: 10, type: 'percent', minSpend: 100, desc: '🌸 10% OFF for new sweet Filipino gamers' }
  ],

  games: [
    {
      id: 'mobile-legends-ph',
      title: 'Mobile Legends First Top Up',
      subtitle: 'Moonton • PH Fast Top-Up 🇵🇭',
      publisher: 'Moonton',
      category: 'mlbb',
      tags: ['Best Seller 🎀', 'Philippines 🇵🇭', 'Instant'],
      region: 'Philippines (PH) 🇵🇭',
      regionCode: 'PH',
      serverFlag: '🇵🇭',
      serverName: 'Philippines',
      rating: 5.0,
      reviewsCount: '7.9k+',
      banner: '/images/characters/mlbb-kagura.jpg',
      image: '/images/characters/mlbb-kagura.jpg',
      characterName: 'Obsidia & Selena ⚡',
      description: 'Recharge Mobile Legends Diamonds for the brand new The Aspirants 5.0 skins: Obsidia (Imperatrix Arashi) & Selena (Silverbolt Raiko), Weekly Diamond Pass, and Twilight Pass with instant automated delivery ♡.',
      idFields: [
        { id: 'userId', label: 'User ID', placeholder: 'e.g. 12345678', type: 'number', required: true },
        { id: 'zoneId', label: 'Zone ID', placeholder: 'e.g. 1234', type: 'number', required: true }
      ],
      idGuide: {
        title: 'How to find your MLBB User ID & Zone ID 🎀:',
        steps: [
          'Open Mobile Legends: Bang Bang on your device.',
          'Tap your avatar profile in the top-left corner of the main screen.',
          'Under your player nickname, find your User ID and Zone ID in brackets: e.g., 12345678 (1234).',
          'Enter the numbers accurately in the fields above ♡.'
        ]
      },
      itemSections: [
        {
          name: 'Special Passes & Aspirants Tasks 🎀',
          items: [
            { id: 'ml-wdp', name: 'Weekly Diamond Pass', amount: '210 Total Diamonds + Aspirants Task', price: 102.00, originalPrice: 130.00, badge: 'Aspirants Task 🎀' },
            { id: 'ml-tp', name: 'Twilight Pass', amount: 'Immediate 500 Tickets + Exclusive Skins', price: 515.00, originalPrice: 599.00, badge: 'Popular ♡' }
          ]
        },
        {
          name: 'Diamonds (PH Instant Reload) ✨',
          items: [
            { id: 'ml-11', name: '11 Diamonds', amount: '10 + 1 Bonus', price: 9.80, originalPrice: 12.00 },
            { id: 'ml-56', name: '56 Diamonds', amount: '50 + 6 Bonus', price: 47.50, originalPrice: 55.00 },
            { id: 'ml-112', name: '112 Diamonds', amount: '102 + 10 Bonus', price: 94.00, originalPrice: 110.00, badge: 'Best Value 🎀' },
            { id: 'ml-223', name: '223 Diamonds', amount: '203 + 20 Bonus', price: 188.00, originalPrice: 215.00 },
            { id: 'ml-336', name: '336 Diamonds', amount: '306 + 30 Bonus', price: 283.00, originalPrice: 325.00 },
            { id: 'ml-570', name: '570 Diamonds', amount: '519 + 51 Bonus (Aspirants 10x Draw)', price: 474.00, originalPrice: 540.00, badge: 'Aspirants 10x Draw ⚡' },
            { id: 'ml-1163', name: '1163 Diamonds', amount: '1057 + 106 Bonus', price: 945.00, originalPrice: 1080.00 },
            { id: 'ml-2398', name: '2398 Diamonds', amount: '2179 + 219 Bonus', price: 1890.00, originalPrice: 2160.00 },
            { id: 'ml-6042', name: '6042 Diamonds', amount: '5489 + 553 Bonus', price: 4720.00, originalPrice: 5400.00 }
          ]
        }
      ]
    },
    {
      id: 'mlbb-squad-rental',
      title: 'MLBB Verified Squad Slot Rental',
      subtitle: 'Moonton Verified Squad Slot 🛡️',
      publisher: 'Moonton Verified Squad',
      category: 'mlbb',
      tags: ['Verified Squad 👑', 'Rent'],
      region: 'All Servers 🛡️',
      regionCode: 'ANY',
      serverFlag: '🛡️',
      serverName: 'Verified Squad',
      rating: 5.0,
      reviewsCount: '1.1k+',
      banner: '/images/characters/all-heroes.jpg',
      image: '/images/characters/all-heroes.jpg',
      characterName: 'Squad Master 👑',
      description: 'Rent an official verified squad badge slot in Mobile Legends. Get the prestigious verified checkmark on your squad profile and in-game loading frame 👑.',
      idFields: [
        { id: 'userId', label: 'User ID (Leader/Member)', placeholder: 'e.g. 1114917746', type: 'number', required: true },
        { id: 'zoneId', label: 'Zone ID', placeholder: 'e.g. 13486', type: 'number', required: true },
        { id: 'squadName', label: 'Squad Name / Tag', placeholder: 'e.g. SWEVENS SQUAD', type: 'text', required: true }
      ],
      idGuide: {
        title: 'How to find your MLBB Squad Details:',
        steps: [
          'Open Mobile Legends and go to Squad tab in main screen.',
          'Copy your Squad Name, Tag, and Leader User ID & Zone ID.',
          'Input your details accurately so slot authorization activates instantly.'
        ]
      },
      itemSections: [
        {
          name: 'Verified Squad Rental Packages 👑',
          items: [
            { id: 'sq-1m', name: '1 Month Verified Squad Slot', amount: '30 Days Verified Badge', price: 350.00, originalPrice: 400.00, badge: 'Popular 👑' },
            { id: 'sq-3m', name: '3 Months Verified Squad Slot', amount: '90 Days Verified Badge + Priority Support', price: 950.00, originalPrice: 1100.00, badge: 'Best Value 🎀' },
            { id: 'sq-perm', name: '6 Months VIP Squad Slot', amount: '180 Days Verified Badge + Exclusive Squad Tag', price: 1800.00, originalPrice: 2200.00 }
          ]
        }
      ]
    },
    {
      id: 'mlbb-us',
      title: 'Mobile Legends (US Server)',
      subtitle: 'Moonton • North America Server 🇺🇸',
      publisher: 'Moonton',
      category: 'mlbb',
      tags: ['US Server 🇺🇸', 'Instant'],
      region: 'United States (US / NA) 🇺🇸',
      regionCode: 'US',
      serverFlag: '🇺🇸',
      serverName: 'US Server',
      rating: 5.0,
      reviewsCount: '282',
      banner: '/images/characters/mlbb-miya.jpg',
      image: '/images/characters/mlbb-miya.jpg',
      characterName: 'Miya 🏹',
      description: 'Recharge Mobile Legends Diamonds and Passes for accounts created in North America (United States server). 100% Moonton authorized instant reload.',
      idFields: [
        { id: 'userId', label: 'User ID', placeholder: 'e.g. 12345678', type: 'number', required: true },
        { id: 'zoneId', label: 'Zone ID', placeholder: 'e.g. 5001', type: 'number', required: true }
      ],
      idGuide: {
        title: 'MLBB US Server Account:',
        steps: [
          'Check your MLBB User ID and Zone ID.',
          'Ensure your account was created under the North American server cluster (e.g. 5xxx servers).'
        ]
      },
      itemSections: [
        {
          name: 'Special Passes 🎀',
          items: [
            { id: 'us-wdp', name: 'Weekly Diamond Pass (US)', amount: '210 Total Diamonds', price: 115.00, originalPrice: 135.00, badge: 'Hot Deal 🎀' },
            { id: 'us-tp', name: 'Twilight Pass (US)', amount: 'Full Twilight Pass', price: 540.00, originalPrice: 620.00 }
          ]
        },
        {
          name: 'US Diamonds (PHP Rate) ✨',
          items: [
            { id: 'us-50', name: '50 Diamonds', amount: 'Instant US Credit', price: 55.00, originalPrice: 65.00 },
            { id: 'us-150', name: '150 Diamonds', amount: 'Instant US Credit', price: 160.00, originalPrice: 185.00 },
            { id: 'us-250', name: '250 Diamonds', amount: 'Instant US Credit', price: 265.00, originalPrice: 300.00, badge: 'Popular ♡' },
            { id: 'us-500', name: '500 Diamonds', amount: 'Instant US Credit', price: 520.00, originalPrice: 590.00 },
            { id: 'us-1000', name: '1000 Diamonds', amount: 'Instant US Credit', price: 1020.00, originalPrice: 1150.00 }
          ]
        }
      ]
    },
    {
      id: 'mlbb-global',
      title: 'Mobile Legends Global (Smile One)',
      subtitle: 'Smile One • Global Any Server 🌐',
      publisher: 'Moonton • Smile One',
      category: 'mlbb',
      tags: ['Global 🌐', 'All Servers'],
      region: 'Global (All Servers) 🌐',
      regionCode: 'GLOBAL',
      serverFlag: '🌐',
      serverName: 'Smile One',
      rating: 5.0,
      reviewsCount: '16.4k+',
      banner: '/images/characters/all-heroes.jpg',
      image: '/images/characters/all-heroes.jpg',
      characterName: 'Guinevere 🎀',
      description: 'Universal Mobile Legends recharge powered by Smile One. Works seamlessly across ALL server clusters globally with zero server mismatch issues ♡.',
      idFields: [
        { id: 'userId', label: 'User ID', placeholder: 'e.g. 1114917746', type: 'number', required: true },
        { id: 'zoneId', label: 'Zone ID', placeholder: 'e.g. 13486', type: 'number', required: true }
      ],
      idGuide: {
        title: 'Universal Server Support:',
        steps: [
          'Smile One supports any server worldwide (PH, ID, MY, SG, BR, US, RU, TR).',
          'Enter your MLBB User ID and Zone ID without server restrictions.'
        ]
      },
      itemSections: [
        {
          name: 'Global Passes 🎀',
          items: [
            { id: 'glo-wdp', name: 'Weekly Diamond Pass', amount: 'Global Server Activated', price: 105.00, originalPrice: 130.00, badge: 'Global Pass 🎀' },
            { id: 'glo-tp', name: 'Twilight Pass', amount: 'Global Server Activated', price: 520.00, originalPrice: 600.00 }
          ]
        },
        {
          name: 'Global Diamonds (Smile One) ✨',
          items: [
            { id: 'glo-86', name: '86 Diamonds', amount: '78 + 8 Bonus', price: 74.00, originalPrice: 85.00 },
            { id: 'glo-172', name: '172 Diamonds', amount: '156 + 16 Bonus', price: 147.00, originalPrice: 165.00, badge: 'Best Value 🎀' },
            { id: 'glo-257', name: '257 Diamonds', amount: '234 + 23 Bonus', price: 219.00, originalPrice: 245.00 },
            { id: 'glo-706', name: '706 Diamonds', amount: '625 + 81 Bonus', price: 585.00, originalPrice: 650.00, badge: 'Popular ♡' },
            { id: 'glo-2195', name: '2,195 Diamonds', amount: '1860 + 335 Bonus', price: 1750.00, originalPrice: 1950.00 },
            { id: 'glo-3688', name: '3,688 Diamonds', amount: '3099 + 589 Bonus', price: 2950.00, originalPrice: 3300.00 }
          ]
        }
      ]
    },
    {
      id: 'mlbb-sg-my',
      title: 'MLBB Singapore & Malaysia',
      subtitle: 'Moonton • SG & MY Server 🇸🇬🇲🇾',
      publisher: 'Moonton',
      category: 'mlbb',
      tags: ['SG & MY 🇸🇬🇲🇾', 'Direct'],
      region: 'Singapore & Malaysia (SG/MY)',
      regionCode: 'MY',
      serverFlag: '🇸🇬 🇲🇾',
      serverName: 'SG & MY',
      rating: 5.0,
      reviewsCount: '1.9k+',
      banner: '/images/characters/mlbb-nana.jpg',
      image: '/images/characters/mlbb-nana.jpg',
      characterName: 'Nana 🎀',
      description: 'Direct Mobile Legends top-up for Singapore and Malaysia players. Instant delivery to your player UID within seconds with love ♡.',
      idFields: [
        { id: 'userId', label: 'User ID', placeholder: 'e.g. 12345678', type: 'number', required: true },
        { id: 'zoneId', label: 'Zone ID', placeholder: 'e.g. 2001', type: 'number', required: true }
      ],
      idGuide: {
        title: 'SG & MY Server Verification:',
        steps: [
          'Verify that your account belongs to Malaysia (MY) or Singapore (SG) server clusters.',
          'Zone IDs typically range between 2xxx and 9xxx.'
        ]
      },
      itemSections: [
        {
          name: 'Special Passes 🎀',
          items: [
            { id: 'sgmy-wdp', name: 'Weekly Diamond Pass', amount: '210 Total Diamonds', price: 104.00, originalPrice: 125.00, badge: 'Hot 🎀' },
            { id: 'sgmy-tp', name: 'Twilight Pass', amount: 'Full Pass Instant', price: 518.00, originalPrice: 590.00 }
          ]
        },
        {
          name: 'SG/MY Diamonds ✨',
          items: [
            { id: 'sgmy-50', name: '50 Diamonds', amount: 'Instant Reload', price: 49.00, originalPrice: 55.00 },
            { id: 'sgmy-100', name: '100 Diamonds', amount: 'Instant Reload', price: 98.00, originalPrice: 110.00 },
            { id: 'sgmy-250', name: '250 Diamonds', amount: 'Instant Reload', price: 235.00, originalPrice: 260.00, badge: 'Popular ♡' },
            { id: 'sgmy-500', name: '500 Diamonds', amount: 'Instant Reload', price: 465.00, originalPrice: 515.00 },
            { id: 'sgmy-1000', name: '1000 Diamonds', amount: 'Instant Reload', price: 925.00, originalPrice: 1020.00 }
          ]
        }
      ]
    },
    {
      id: 'mlbb-id',
      title: 'MLBB Indonesia',
      subtitle: 'Moonton • Indonesia Server 🇮🇩',
      publisher: 'Moonton',
      category: 'mlbb',
      tags: ['Indonesia 🇮🇩', 'Instant'],
      region: 'Indonesia (ID) 🇮🇩',
      regionCode: 'ID',
      serverFlag: '🇮🇩',
      serverName: 'Indonesia',
      rating: 5.0,
      reviewsCount: '3.2k+',
      banner: '/images/characters/mlbb-lunox.jpg',
      image: '/images/characters/mlbb-lunox.jpg',
      characterName: 'Lunox 🌸',
      description: 'Direct Moonton reload for Mobile Legends Indonesia accounts. Supports all Indonesian server clusters with automated instant delivery 🇮🇩.',
      idFields: [
        { id: 'userId', label: 'User ID', placeholder: 'e.g. 1114917746', type: 'number', required: true },
        { id: 'zoneId', label: 'Zone ID', placeholder: 'e.g. 13486', type: 'number', required: true }
      ],
      idGuide: {
        title: 'Indonesia Server Account:',
        steps: [
          'Enter your MLBB User ID and Zone ID.',
          'Our live checker automatically verifies your Indonesian nickname and cluster.'
        ]
      },
      itemSections: [
        {
          name: 'Special Passes 🇮🇩 🎀',
          items: [
            { id: 'id-wdp', name: 'Weekly Diamond Pass (ID)', amount: '210 Total Diamonds', price: 99.00, originalPrice: 125.00, badge: 'Cheapest ⚡' },
            { id: 'id-tp', name: 'Twilight Pass (ID)', amount: 'Full Indonesian Twilight Pass', price: 499.00, originalPrice: 580.00, badge: 'Popular ♡' }
          ]
        },
        {
          name: 'Indonesian Diamonds ✨',
          items: [
            { id: 'id-86', name: '86 Diamonds (ID)', amount: '78 + 8 Bonus', price: 69.00, originalPrice: 80.00 },
            { id: 'id-172', name: '172 Diamonds (ID)', amount: '156 + 16 Bonus', price: 138.00, originalPrice: 160.00, badge: 'Best Deal 🎀' },
            { id: 'id-257', name: '257 Diamonds (ID)', amount: '234 + 23 Bonus', price: 205.00, originalPrice: 235.00 },
            { id: 'id-706', name: '706 Diamonds (ID)', amount: '625 + 81 Bonus', price: 545.00, originalPrice: 620.00, badge: 'Popular ♡' },
            { id: 'id-2195', name: '2,195 Diamonds (ID)', amount: '1860 + 335 Bonus', price: 1680.00, originalPrice: 1900.00 }
          ]
        }
      ]
    },
    {
      id: 'mlbb-tr',
      title: 'MLBB Turkey',
      subtitle: 'Moonton • Turkey Server 🇹🇷',
      publisher: 'Moonton',
      category: 'mlbb',
      tags: ['Turkey 🇹🇷', 'Cheapest'],
      region: 'Turkey (TR) 🇹🇷',
      regionCode: 'TR',
      serverFlag: '🇹🇷',
      serverName: 'Turkey',
      rating: 5.0,
      reviewsCount: '242',
      banner: '/images/characters/mlbb-nana.jpg',
      image: '/images/characters/mlbb-nana.jpg',
      characterName: 'Nana Mecha 🎀',
      description: 'Recharge Mobile Legends accounts registered under Turkey server. Lowest regional diamond rates with automated delivery.',
      idFields: [
        { id: 'userId', label: 'User ID', placeholder: 'e.g. 12345678', type: 'number', required: true },
        { id: 'zoneId', label: 'Zone ID', placeholder: 'e.g. 4001', type: 'number', required: true }
      ],
      idGuide: {
        title: 'Turkey Server Verification:',
        steps: [
          'Ensure your MLBB account was created in Turkey or regional TR servers.',
          'Enter User ID and Zone ID.'
        ]
      },
      itemSections: [
        {
          name: 'Turkey Passes & Diamonds 🎀',
          items: [
            { id: 'tr-wdp', name: 'Weekly Diamond Pass (TR)', amount: '210 Total Diamonds', price: 95.00, originalPrice: 120.00, badge: 'Lowest Rate 🎀' },
            { id: 'tr-50', name: '50 Diamonds', amount: 'Instant TR Credit', price: 44.00, originalPrice: 50.00 },
            { id: 'tr-100', name: '100 Diamonds', amount: 'Instant TR Credit', price: 88.00, originalPrice: 100.00 },
            { id: 'tr-250', name: '250 Diamonds', amount: 'Instant TR Credit', price: 215.00, originalPrice: 245.00, badge: 'Popular ♡' },
            { id: 'tr-500', name: '500 Diamonds', amount: 'Instant TR Credit', price: 425.00, originalPrice: 480.00 }
          ]
        }
      ]
    },
    {
      id: 'mlbb-ru',
      title: 'MLBB Russia',
      subtitle: 'Moonton • Russia Server 🇷🇺',
      publisher: 'Moonton',
      category: 'mlbb',
      tags: ['Russia 🇷🇺', 'Direct'],
      region: 'Russia (RU) 🇷🇺',
      regionCode: 'RU',
      serverFlag: '🇷🇺',
      serverName: 'Russia',
      rating: 5.0,
      reviewsCount: '138',
      banner: '/images/characters/mlbb-angela.jpg',
      image: '/images/characters/mlbb-angela.jpg',
      characterName: 'Angela 🌸',
      description: 'Instant Mobile Legends recharge for Russia & CIS regional accounts. Fast verification and credit reload.',
      idFields: [
        { id: 'userId', label: 'User ID', placeholder: 'e.g. 12345678', type: 'number', required: true },
        { id: 'zoneId', label: 'Zone ID', placeholder: 'e.g. 6001', type: 'number', required: true }
      ],
      idGuide: {
        title: 'Russia Server Verification:',
        steps: [
          'For accounts registered in Russia and CIS server clusters.',
          'Enter User ID and Zone ID.'
        ]
      },
      itemSections: [
        {
          name: 'Russia Passes & Diamonds 🎀',
          items: [
            { id: 'ru-wdp', name: 'Weekly Diamond Pass (RU)', amount: '210 Total Diamonds', price: 98.00, originalPrice: 125.00, badge: 'Hot 🎀' },
            { id: 'ru-50', name: '50 Diamonds', amount: 'Direct RU Reload', price: 46.00, originalPrice: 52.00 },
            { id: 'ru-150', name: '150 Diamonds', amount: 'Direct RU Reload', price: 135.00, originalPrice: 155.00 },
            { id: 'ru-250', name: '250 Diamonds', amount: 'Direct RU Reload', price: 220.00, originalPrice: 250.00, badge: 'Popular ♡' },
            { id: 'ru-500', name: '500 Diamonds', amount: 'Direct RU Reload', price: 435.00, originalPrice: 490.00 }
          ]
        }
      ]
    },
    {
      id: 'mlbb-adventure',
      title: 'Mobile Legends Adventure',
      subtitle: 'Moonton • MLA Diamonds & Pass 🌸',
      publisher: 'Moonton',
      category: 'mlbb',
      tags: ['MLA 🌸', 'Instant'],
      region: 'Global / Asia 🌸',
      regionCode: 'MLA',
      serverFlag: '🌸',
      serverName: 'MLA',
      rating: 5.0,
      reviewsCount: '9.2k+',
      banner: '/images/characters/mlbb-layla.jpg',
      image: '/images/characters/mlbb-layla.jpg',
      characterName: 'Layla MLA 🌸',
      description: 'Recharge Diamonds, Monthly Pass, and Battle Pass for Mobile Legends: Adventure (MLA). Fast and official delivery directly to your in-game mailbox ♡.',
      idFields: [
        { id: 'userId', label: 'Account ID', placeholder: 'e.g. 19284719', type: 'number', required: true },
        { id: 'zoneId', label: 'Server ID (5 digits)', placeholder: 'e.g. 70012', type: 'number', required: true }
      ],
      idGuide: {
        title: 'Where to find your MLA ID & Server:',
        steps: [
          'Open Mobile Legends: Adventure.',
          'Tap your avatar on the top-left corner.',
          'Find your Account ID and 5-digit Server ID (e.g. 70012).'
        ]
      },
      itemSections: [
        {
          name: 'MLA Passes & Subscriptions 🌸',
          items: [
            { id: 'mla-mp', name: 'Monthly Pass', amount: '30 Days MLA Pass', price: 265.00, originalPrice: 299.00, badge: 'Best Value 🎀' },
            { id: 'mla-mpp', name: 'Monthly Pass Plus', amount: 'Deluxe Rewards & VIP', price: 540.00, originalPrice: 620.00, badge: 'Popular ♡' }
          ]
        },
        {
          name: 'MLA Diamonds ✨',
          items: [
            { id: 'mla-300', name: '300 MLA Diamonds', amount: 'Instant Mailbox Delivery', price: 145.00, originalPrice: 165.00 },
            { id: 'mla-500', name: '500 MLA Diamonds', amount: 'Instant Mailbox Delivery', price: 235.00, originalPrice: 270.00 },
            { id: 'mla-1000', name: '1000 MLA Diamonds', amount: 'Instant Mailbox Delivery', price: 465.00, originalPrice: 530.00, badge: 'Popular ♡' },
            { id: 'mla-2500', name: '2500 MLA Diamonds', amount: 'Instant Mailbox Delivery', price: 1120.00, originalPrice: 1280.00 }
          ]
        }
      ]
    },
    {
      id: 'valorant',
      title: 'Valorant',
      subtitle: 'Riot Games • Riot Points Top-Up 🎀',
      publisher: 'Riot Games',
      category: 'valorant',
      tags: ['Popular ♡', 'Instant'],
      region: 'Riot PH / SEA',
      rating: 5.0,
      reviewsCount: '98.5k+',
      banner: '/images/characters/valorant-jett.jpg',
      image: '/images/characters/valorant-jett.jpg',
      characterName: 'Agent Jett 🌪️',
      description: 'Purchase Valorant Points (VP) for Riot SEA/PH accounts instantly to unlock agent tiers, cute gun skins, and battle passes 🎀.',
      idFields: [
        { id: 'riotId', label: 'Riot ID', placeholder: 'e.g. TenZ#PH1', type: 'text', required: true }
      ],
      idGuide: {
        title: 'How to find your Riot ID:',
        steps: [
          'Launch the Riot Client or log in at account.riotgames.com.',
          'Look at your username format: Username#TAG (e.g., Jett#SEA).',
          'Enter both your username and the tag with the # symbol.'
        ]
      },
      itemSections: [
        {
          name: 'Valorant Points (VP) 🎀',
          items: [
            { id: 'val-125', name: '125 VP', amount: 'Instant Code', price: 50.00, originalPrice: 55.00 },
            { id: 'val-420', name: '420 VP', amount: 'Instant Code', price: 165.00, originalPrice: 180.00 },
            { id: 'val-700', name: '700 VP', amount: 'Instant Code', price: 275.00, originalPrice: 300.00, badge: 'Popular ♡' },
            { id: 'val-1375', name: '1,375 VP', amount: 'Instant Code', price: 535.00, originalPrice: 580.00, badge: 'Best Seller 🎀' },
            { id: 'val-2400', name: '2,400 VP', amount: 'Instant Code', price: 920.00, originalPrice: 1000.00 },
            { id: 'val-4000', name: '4,000 VP', amount: 'Instant Code', price: 1520.00, originalPrice: 1650.00 },
            { id: 'val-8150', name: '8,150 VP', amount: 'Instant Code', price: 2999.00, originalPrice: 3300.00 }
          ]
        }
      ]
    },
    {
      id: 'call-of-duty-mobile',
      title: 'Call of Duty: Mobile (CODM)',
      subtitle: 'Garena • CP Points Direct 🎀',
      publisher: 'Garena',
      category: 'codm',
      tags: ['Hot', 'Instant'],
      region: 'Garena PH',
      rating: 5.0,
      reviewsCount: '96.2k+',
      banner: '/images/characters/codm-urbantracker.jpg',
      image: '/images/characters/codm-urbantracker.jpg',
      characterName: 'Urban Tracker 🎖️',
      description: 'Recharge CP Points for Call of Duty: Mobile Garena Philippines quickly. Unlock Battle Pass and Legendary camos.',
      idFields: [
        { id: 'openId', label: 'Garena Open ID / Player ID', placeholder: 'Enter Player ID', type: 'text', required: true }
      ],
      idGuide: {
        title: 'How to find your CODM Player ID:',
        steps: [
          'Open CODM and tap your profile in the top-left corner.',
          'Go to the SECOND tab: "Basic".',
          'Find your Player ID (UID) below your avatar.'
        ]
      },
      itemSections: [
        {
          name: 'CODM CP Points',
          items: [
            { id: 'codm-pass', name: 'Battle Pass Activation', amount: 'Standard Battle Pass', price: 175.00, originalPrice: 200.00, badge: 'Hot 🎀' },
            { id: 'codm-80', name: '80 CP', amount: 'Instant Credit', price: 47.00, originalPrice: 50.00 },
            { id: 'codm-420', name: '420 CP', amount: 'Instant Credit', price: 235.00, originalPrice: 250.00 },
            { id: 'codm-880', name: '880 CP', amount: 'Instant Credit', price: 470.00, originalPrice: 500.00, badge: 'Popular ♡' },
            { id: 'codm-1800', name: '1,800 CP', amount: 'Instant Credit', price: 940.00, originalPrice: 1000.00 }
          ]
        }
      ]
    },
    {
      id: 'roblox',
      title: 'Roblox Robux & Gift Cards',
      subtitle: 'Roblox Corporation • Fast Pin 🎀',
      publisher: 'Roblox',
      category: 'roblox',
      tags: ['Best Seller 🎀', 'Digital Code'],
      region: 'Global / PH',
      rating: 5.0,
      reviewsCount: '109.1k+',
      banner: '/images/characters/roblox-avatar.jpg',
      image: '/images/characters/roblox-avatar.jpg',
      characterName: 'Coquette Avatar 🎀',
      description: 'Get Roblox Robux digital gift cards instantly delivered to your email or screen with automated redemption pin codes.',
      idFields: [
        { id: 'robloxUser', label: 'Roblox Username', placeholder: 'e.g. GamerPro_PH', type: 'text', required: true }
      ],
      idGuide: {
        title: 'How to get your Roblox Username:',
        steps: [
          'Go to roblox.com and view your profile.',
          'Your username is displayed with the @ symbol (do not include the @).'
        ]
      },
      itemSections: [
        {
          name: 'Robux Digital Codes 🎀',
          items: [
            { id: 'rbx-80', name: '80 Robux', amount: 'Digital Voucher', price: 58.00, originalPrice: 65.00 },
            { id: 'rbx-400', name: '400 Robux', amount: 'Digital Voucher', price: 285.00, originalPrice: 320.00, badge: 'Best Seller 🎀' },
            { id: 'rbx-800', name: '800 Robux', amount: 'Digital Voucher', price: 565.00, originalPrice: 620.00 },
            { id: 'rbx-1700', name: '1,700 Robux', amount: 'Digital Voucher', price: 1120.00, originalPrice: 1250.00 },
            { id: 'rbx-4500', name: '4,500 Robux', amount: 'Digital Voucher', price: 2790.00, originalPrice: 3000.00 }
          ]
        }
      ]
    },
    {
      id: 'genshin-impact',
      title: 'Genshin Impact',
      subtitle: 'HoYoverse • Genesis Crystals 🌸',
      publisher: 'HoYoverse',
      category: 'genshin',
      tags: ['Popular ♡', 'Direct UID'],
      region: 'Asia / Global',
      rating: 5.0,
      reviewsCount: '84.3k+',
      banner: '/images/characters/genshin-yaemiko.jpg',
      image: '/images/characters/genshin-yaemiko.jpg',
      characterName: 'Yae Miko 🌸',
      description: 'Blessing of the Welkin Moon and Genesis Crystals direct UID recharge. 100% safe authorized channel with love ♡.',
      idFields: [
        { id: 'uid', label: 'Genshin UID', placeholder: 'e.g. 810294821', type: 'number', required: true },
        { id: 'server', label: 'Server', placeholder: 'Select Server', type: 'select', options: ['Asia', 'America', 'Europe', 'TW, HK, MO'], required: true }
      ],
      idGuide: {
        title: 'Where to find your Genshin UID:',
        steps: [
          'In-game, look at the bottom right corner of your screen at all times.',
          'Your 9-digit UID is always displayed there.'
        ]
      },
      itemSections: [
        {
          name: 'Welkin & Crystals 🎀',
          items: [
            { id: 'gi-welkin', name: 'Blessing of the Welkin Moon', amount: '30 Days Pass (3000 Primogems)', price: 275.00, originalPrice: 299.00, badge: 'Must Buy 🎀' },
            { id: 'gi-60', name: '60 Genesis Crystals', amount: 'First Top-Up Double Bonus', price: 54.00, originalPrice: 60.00 },
            { id: 'gi-300', name: '300 + 30 Genesis Crystals', amount: '330 Total Crystals', price: 275.00, originalPrice: 299.00 },
            { id: 'gi-980', name: '980 + 110 Genesis Crystals', amount: '1090 Total Crystals', price: 820.00, originalPrice: 899.00, badge: 'Popular ♡' },
            { id: 'gi-1980', name: '1980 + 260 Genesis Crystals', amount: '2240 Total Crystals', price: 1650.00, originalPrice: 1799.00 },
            { id: 'gi-3280', name: '3280 + 600 Genesis Crystals', amount: '3880 Total Crystals', price: 2690.00, originalPrice: 2999.00 }
          ]
        }
      ]
    },
    {
      id: 'free-fire',
      title: 'Free Fire Diamonds',
      subtitle: 'Garena • Instant Reload 🎀',
      publisher: 'Garena',
      category: 'freefire',
      tags: ['Flash Sale 🎀', 'Instant'],
      region: 'PH / International',
      rating: 5.0,
      reviewsCount: '62.4k+',
      banner: '/images/characters/freefire-kelly.jpg',
      image: '/images/characters/freefire-kelly.jpg',
      characterName: 'Kelly ⚡',
      description: 'Quick top-up for Garena Free Fire Diamonds. Instant delivery to player ID.',
      idFields: [
        { id: 'playerId', label: 'Player ID', placeholder: 'e.g. 592817291', type: 'number', required: true }
      ],
      idGuide: {
        title: 'How to find your Free Fire Player ID:',
        steps: [
          'Tap your avatar profile in the top left corner.',
          'Under your nickname, click the copy icon next to your ID.'
        ]
      },
      itemSections: [
        {
          name: 'Diamonds & Membership 🎀',
          items: [
            { id: 'ff-weekly', name: 'Weekly Membership', amount: '450 Diamonds Value', price: 95.00, originalPrice: 110.00, badge: 'Best Value 🎀' },
            { id: 'ff-100', name: '100 + 10 Diamonds', amount: '110 Total', price: 48.00, originalPrice: 55.00 },
            { id: 'ff-310', name: '310 + 31 Diamonds', amount: '341 Total', price: 145.00, originalPrice: 160.00 },
            { id: 'ff-520', name: '520 + 52 Diamonds', amount: '572 Total', price: 240.00, originalPrice: 265.00, badge: 'Popular ♡' },
            { id: 'ff-1060', name: '1060 + 106 Diamonds', amount: '1166 Total', price: 475.00, originalPrice: 530.00 }
          ]
        }
      ]
    },
    {
      id: 'steam-wallet',
      title: 'Steam Wallet Code (PHP)',
      subtitle: 'Valve • Instant Digital Pin 🎀',
      publisher: 'Valve',
      category: 'voucher',
      tags: ['Voucher', 'Instant Pin'],
      region: 'Philippines (PHP Currency)',
      rating: 5.0,
      reviewsCount: '95.9k+',
      banner: '/images/characters/all-heroes.jpg',
      image: '/images/characters/all-heroes.jpg',
      characterName: 'Gaming Heroes 🎀',
      description: 'Add funds to your Steam PH account directly. Automated pin delivery for purchasing games on Steam.',
      idFields: [
        { id: 'email', label: 'Delivery Email Address', placeholder: 'your-email@example.com', type: 'email', required: true }
      ],
      idGuide: {
        title: 'How to redeem Steam Wallet Code:',
        steps: [
          'Log in to your Steam Client or store.steampowered.com.',
          'Click your username in the top right and select "View my wallet".',
          'Click "Redeem a Steam Gift Card or Wallet Code" and enter your code.'
        ]
      },
      itemSections: [
        {
          name: 'Steam PH Wallet Codes 🎀',
          items: [
            { id: 'stm-50', name: '₱50 Steam Wallet', amount: '50 PHP Added', price: 56.00, originalPrice: 60.00 },
            { id: 'stm-100', name: '₱100 Steam Wallet', amount: '100 PHP Added', price: 112.00, originalPrice: 120.00 },
            { id: 'stm-250', name: '₱250 Steam Wallet', amount: '250 PHP Added', price: 279.00, originalPrice: 295.00, badge: 'Popular ♡' },
            { id: 'stm-500', name: '₱500 Steam Wallet', amount: '500 PHP Added', price: 558.00, originalPrice: 590.00, badge: 'Best Seller 🎀' },
            { id: 'stm-1000', name: '₱1,000 Steam Wallet', amount: '1000 PHP Added', price: 1115.00, originalPrice: 1180.00 }
          ]
        }
      ]
    },
    {
      id: 'crossfire-ph',
      title: 'Crossfire Philippines',
      subtitle: 'Smilegate • Ecoin Philippines 🎀',
      publisher: 'Smilegate',
      category: 'games',
      tags: ['Classic 🎀', 'Instant'],
      region: 'Philippines (PH)',
      rating: 5.0,
      reviewsCount: '29.2k+',
      banner: '/images/characters/crossfire-fox.jpg',
      image: '/images/characters/crossfire-fox.jpg',
      characterName: 'Fox Operator 🦊',
      description: 'Reload eCoin for Crossfire PH. Buy VIP weapons, character skins, and lotto crates instantly.',
      idFields: [
        { id: 'cfAccount', label: 'Crossfire Game Account ID', placeholder: 'Enter Crossfire Username', type: 'text', required: true }
      ],
      idGuide: {
        title: 'Where to find your CF Account ID:',
        steps: [
          'Your Crossfire account ID is the login username you use to log into Crossfire client.'
        ]
      },
      itemSections: [
        {
          name: 'eCoin Denominations',
          items: [
            { id: 'cf-50', name: '50 eCoin', amount: 'Direct Reload', price: 49.00, originalPrice: 55.00 },
            { id: 'cf-100', name: '100 eCoin', amount: 'Direct Reload', price: 98.00, originalPrice: 105.00 },
            { id: 'cf-300', name: '300 eCoin', amount: 'Direct Reload', price: 290.00, originalPrice: 310.00, badge: 'Popular ♡' },
            { id: 'cf-500', name: '500 eCoin', amount: 'Direct Reload', price: 480.00, originalPrice: 520.00 }
          ]
        }
      ]
    },
    {
      id: 'honkai-star-rail',
      title: 'Honkai: Star Rail',
      subtitle: 'HoYoverse • Oneiric Shards 🌸',
      publisher: 'HoYoverse',
      category: 'genshin',
      tags: ['Popular ♡', 'Instant'],
      region: 'Global / Asia',
      rating: 5.0,
      reviewsCount: '89.4k+',
      banner: '/images/characters/hsr-march7th.jpg',
      image: '/images/characters/hsr-march7th.jpg',
      characterName: 'March 7th 🌸',
      description: 'Recharge Express Supply Pass and Oneiric Shards for Honkai: Star Rail with instant UID delivery and love ♡.',
      idFields: [
        { id: 'hsrUid', label: 'Star Rail UID', placeholder: 'e.g. 800192847', type: 'number', required: true },
        { id: 'hsrServer', label: 'Server', placeholder: 'Select Server', type: 'select', options: ['Asia', 'America', 'Europe', 'TW, HK, MO'], required: true }
      ],
      idGuide: {
        title: 'Where to find your Honkai: Star Rail UID:',
        steps: [
          'In-game, look at the bottom-left corner of the phone pause menu.',
          'Your 9-digit UID is clearly displayed under your Trailblazer avatar.'
        ]
      },
      itemSections: [
        {
          name: 'Express Pass & Shards 🎀',
          items: [
            { id: 'hsr-pass', name: 'Express Supply Pass', amount: '30 Days Pass (3000 Stellar Jade)', price: 275.00, originalPrice: 299.00, badge: 'Best Seller 🎀' },
            { id: 'hsr-60', name: '60 Oneiric Shards', amount: 'First Recharge Double Bonus', price: 54.00, originalPrice: 60.00 },
            { id: 'hsr-300', name: '300 + 30 Shards', amount: '330 Total', price: 275.00, originalPrice: 299.00 },
            { id: 'hsr-980', name: '980 + 110 Shards', amount: '1090 Total', price: 820.00, originalPrice: 899.00, badge: 'Popular ♡' },
            { id: 'hsr-1980', name: '1980 + 260 Shards', amount: '2240 Total', price: 1650.00, originalPrice: 1799.00 },
            { id: 'hsr-3280', name: '3280 + 600 Shards', amount: '3880 Total', price: 2690.00, originalPrice: 2999.00 }
          ]
        }
      ]
    },
    {
      id: 'blood-strike',
      title: 'Blood Strike',
      subtitle: 'NetEase • Gold Top-Up 🎀',
      publisher: 'NetEase Games',
      category: 'games',
      tags: ['Fast-Paced', 'Instant'],
      region: 'PH / SEA',
      rating: 5.0,
      reviewsCount: '47.6k+',
      banner: '/images/characters/bloodstrike-striker.jpg',
      image: '/images/characters/bloodstrike-striker.jpg',
      characterName: 'Striker Operative ⚡',
      description: 'Top up Blood Strike Gold instantly for characters, camos, and Strike Passes at the lowest PH rates.',
      idFields: [
        { id: 'bsUserId', label: 'Blood Strike User ID', placeholder: 'e.g. 78201948', type: 'number', required: true }
      ],
      idGuide: {
        title: 'Where to find your Blood Strike ID:',
        steps: [
          'Tap your avatar on the main screen.',
          'Tap the copy icon right next to your User ID.'
        ]
      },
      itemSections: [
        {
          name: 'Gold Denominations 🎀',
          items: [
            { id: 'bs-pass', name: 'Strike Pass Elite', amount: 'Season Pass', price: 199.00, originalPrice: 230.00, badge: 'Hot 🎀' },
            { id: 'bs-100', name: '100 Gold', amount: 'Instant Reload', price: 52.00, originalPrice: 60.00 },
            { id: 'bs-300', name: '300 + 30 Gold', amount: '330 Total', price: 155.00, originalPrice: 175.00 },
            { id: 'bs-500', name: '500 + 60 Gold', amount: '560 Total', price: 255.00, originalPrice: 290.00, badge: 'Popular ♡' },
            { id: 'bs-1000', name: '1,000 + 150 Gold', amount: '1150 Total', price: 505.00, originalPrice: 575.00 }
          ]
        }
      ]
    }
  ],

  recentReviews: [
    { user: 'Clara M. (0917***)', game: 'Mobile Legends: Bang Bang', item: 'Weekly Diamond Pass', time: '1 min ago', rating: 5, comment: 'Ang ganda ng coquette theme and super bilis ng pasok ng diamonds! 🎀🤍 15 seconds lang!' },
    { user: 'Bea P. (0928***)', game: 'Valorant', item: '1,375 VP', time: '3 mins ago', rating: 5, comment: 'Cheapest VP in the Philippines! Cutest gaming top-up site ever ✨ QR Ph checkout was seamless!' },
    { user: 'Chloe R. (0908***)', game: 'Mobile Legends: Bang Bang', item: '112 Diamonds', time: '5 mins ago', rating: 5, comment: 'SWEVENS server checker verified my in-game nickname accurately bago nagbayad ♡ 10/10!' },
    { user: 'Jerome K. (0966***)', game: 'Genshin Impact', item: 'Blessing of the Welkin Moon', time: '8 mins ago', rating: 5, comment: 'Instant delivery direct to UID. Will always top up here at SWEVENS! 🌸' },
    { user: 'Alyssa T. (0995***)', game: 'Roblox', item: '800 Robux', time: '11 mins ago', rating: 5, comment: 'Code generated instantly on screen and emailed. Thank you so much SWEVENS! 🎀' },
    { user: 'Kenneth M. (0915***)', game: 'Call of Duty: Mobile', item: '880 CP', time: '14 mins ago', rating: 5, comment: 'Fast transaction via Maya. Recommended sa buong clan namin!' }
  ],

  mockServers: {
    '1001': 'PH Server - Luzon Central 🌸',
    '1002': 'PH Server - Visayas Core 🎀',
    '1003': 'PH Server - Mindanao Relay ✨',
    '1004': 'PH Server - Metro Manila High-Speed ♡',
    '2001': 'ID Server - Jakarta West',
    '3001': 'SG Server - Singapore Global',
    '4001': 'US Server - North America'
  },

  leaderboard: {
    monthly: [
      { rank: 1, name: 'ClaraPrincess_PH 🎀', sales: 1420, commission: 58240.00, tier: 'Platinum VIP 👑', badge: '🥇 1st' },
      { rank: 2, name: 'MarkyTopUp_Cebu ♡', sales: 1080, commission: 41250.00, tier: 'Gold Reseller ✨', badge: '🥈 2nd' },
      { rank: 3, name: 'QueenMLBB_MNL 🌸', sales: 890, commission: 32400.00, tier: 'Gold Reseller ✨', badge: '🥉 3rd' },
      { rank: 4, name: 'GamerX_Davao', sales: 690, commission: 23100.00, tier: 'Silver Reseller', badge: '#4' },
      { rank: 5, name: 'ValkyrieStore_PH 🎀', sales: 580, commission: 19500.00, tier: 'Silver Reseller', badge: '#5' },
      { rank: 6, name: 'TenZ_VP_Pampanga', sales: 490, commission: 15800.00, tier: 'Silver Reseller', badge: '#6' },
      { rank: 7, name: 'AstraReloads_Iloilo ♡', sales: 420, commission: 13200.00, tier: 'Silver Reseller', badge: '#7' }
    ],
    weekly: [
      { rank: 1, name: 'ClaraPrincess_PH 🎀', sales: 340, commission: 14200.00, tier: 'Platinum VIP 👑', badge: '🥇 1st' },
      { rank: 2, name: 'QueenMLBB_MNL 🌸', sales: 290, commission: 10800.00, tier: 'Gold Reseller ✨', badge: '🥈 2nd' },
      { rank: 3, name: 'MarkyTopUp_Cebu ♡', sales: 260, commission: 9400.00, tier: 'Gold Reseller ✨', badge: '🥉 3rd' },
      { rank: 4, name: 'GamerX_Davao', sales: 195, commission: 6800.00, tier: 'Silver Reseller', badge: '#4' }
    ],
    daily: [
      { rank: 1, name: 'ClaraPrincess_PH 🎀', sales: 72, commission: 3150.00, tier: 'Platinum VIP 👑', badge: '🥇 1st' },
      { rank: 2, name: 'QueenMLBB_MNL 🌸', sales: 54, commission: 2180.00, tier: 'Gold Reseller ✨', badge: '🥈 2nd' },
      { rank: 3, name: 'ValkyrieStore_PH 🎀', sales: 46, commission: 1790.00, tier: 'Silver Reseller', badge: '🥉 3rd' }
    ]
  },

  resellerTiers: [
    { name: 'Silver Reseller', balanceReq: '< ₱50,000 active saldo', discount: 'Standard VIP Discount', perk: 'Auto QR Ph instant checkout ♡' },
    { name: 'Gold Reseller', balanceReq: '₱50,000 – ₱199,999.99 saldo', discount: 'Extra 3-5% off wholesale', perk: 'Priority automated fulfillment & VIP support 🎀' },
    { name: 'Platinum VIP', balanceReq: '₱200,000+ active saldo', discount: 'Best wholesale pricing in PH', perk: 'Dedicated API access & custom affiliate codes 👑' }
  ],

  defaultMemberAccount: {
    id: 'USR-71082',
    name: 'Cha 🎀',
    username: 'itsme_cha',
    password: 'fries1510',
    email: 'itsme_cha@swevens.ph',
    phone: '0917-510-1510',
    tier: 'Silver Reseller',
    walletBalance: 1450.00,
    points: 1450, // 100 points = 1 PHP (₱14.50)
    affiliateCode: 'SWEVENS-CHA',
    affiliateEarnings: 520.00,
    totalSalesReferred: 24,
    monthlyMilestoneTarget: 500000,
    monthlyMilestoneProgress: 84250,
    savedAccounts: [
      { id: 'sa-1', gameId: 'mobile-legends-ph', name: 'Cha MLBB Main ♡', fields: { userId: '15101015', zoneId: '1004' } },
      { id: 'sa-2', gameId: 'mobile-legends-ph', name: 'Cha Smurf 🎀', fields: { userId: '98765432', zoneId: '1002' } },
      { id: 'sa-3', gameId: 'valorant', name: 'Cha#PH1 Valorant', fields: { riotId: 'itsmecha#PH1' } },
      { id: 'sa-4', gameId: 'roblox', name: 'itsme_cha Roblox', fields: { robloxUser: 'itsme_cha' } },
      { id: 'sa-5', gameId: 'genshin-impact', name: 'Cha Genshin Asia', fields: { uid: '812498124', server: 'Asia' } }
    ],
    deposits: [
      { id: 'DEP-98124', method: 'QR Ph 🎀', amount: 1000.00, status: 'Completed', timestamp: '2026-10-20T14:10:00Z' },
      { id: 'DEP-87123', method: 'GCash', amount: 500.00, status: 'Completed', timestamp: '2026-10-18T10:25:00Z' }
    ],
    pointsHistory: [
      { id: 'PT-101', description: 'MLBB Weekly Pass Reload', points: '+102 pts', php: '+₱1.02', date: '2026-10-20 18:30' },
      { id: 'PT-102', description: 'Valorant VP Top-Up', points: '+535 pts', php: '+₱5.35', date: '2026-10-19 14:15' },
      { id: 'PT-103', description: 'Redeemed to Wallet Saldo', points: '-500 pts', php: '-₱5.00', date: '2026-10-17 11:00' }
    ],
    withdrawals: [
      { id: 'WD-501', method: 'GCash (0917***1510)', amount: 350.00, status: 'Processed 🎀', date: '2026-10-16 16:40' }
    ]
  }
};

const NEXONE_DATA = SWEVENS_DATA;

if (typeof window !== 'undefined') {
  window.SWEVENS_DATA = SWEVENS_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SWEVENS_DATA;
}
