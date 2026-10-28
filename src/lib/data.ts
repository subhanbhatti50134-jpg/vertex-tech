export type CollectionId = 'services' | 'projects'

export interface Review {
  publication: string
  quote: string
  stars: number
}

export interface DiscItem {
  id: string
  title: string
  year: string
  credits: string[]
  starring: string[]
  reviews: Review[]
  art: [string, string]
  detail?: string
  url?: string
  /** Optional face artwork served from /public; falls back to gradient art when missing. */
  image?: string
}

export interface Collection {
  id: CollectionId
  label: string
  srHeading: string
  labels: [string, string, string]
  items: DiscItem[]
}

export const COLLECTIONS: Record<CollectionId, Collection> = {
  services: {
    id: 'services',
    label: 'Services',
    srHeading: 'Discover the Vertex Tech library of Services',
    labels: ['LED BY', 'YEAR', 'INCLUDES'],
    items: [
      {
        id: 'web',
        title: 'Website Development',
        year: '2024',
        credits: ['Vertex Tech'],
        starring: ['High-performance builds', 'Responsive layouts', 'SEO-ready structure'],
        reviews: [
          { publication: 'Launch', quote: 'Live In Days, Not Months', stars: 5 },
          { publication: 'Visitors', quote: 'Designed To Convert', stars: 5 },
        ],
        art: ['#1558C9', '#071426'],
        detail: 'Fast, responsive, professional websites that establish an online presence and convert visitors.',
      },
      {
        id: 'shop',
        title: 'Shopify Development',
        year: '2024',
        credits: ['Vertex Tech'],
        starring: ['Custom storefronts', 'Theme development', 'Checkout tuning'],
        reviews: [
          { publication: 'Commerce', quote: 'Storefronts That Sell', stars: 5 },
          { publication: 'Merchants', quote: 'Built To Grow With You', stars: 4.5 },
        ],
        art: ['#00A8FF', '#0A1628'],
        detail: 'Custom storefronts that help businesses launch and grow their online stores.',
      },
      {
        id: 'mgmt',
        title: 'Shopify Management',
        year: '2024',
        credits: ['Vertex Tech'],
        starring: ['Product listings', 'Store updates', 'Content changes'],
        reviews: [
          { publication: 'Operations', quote: 'Always Up To Date', stars: 5 },
          { publication: 'Merchants', quote: 'Effortless Ongoing Care', stars: 4.5 },
        ],
        art: ['#3D6FB8', '#101C30'],
        detail: 'Product listings, store updates, content changes, and ongoing improvements.',
      },
      {
        id: 'app',
        title: 'Web Applications',
        year: '2025',
        credits: ['Vertex Tech'],
        starring: ['Interactive apps', 'Dashboards', 'Workflow automation'],
        reviews: [
          { publication: 'Product', quote: 'Workflows Made Simple', stars: 5 },
          { publication: 'Teams', quote: 'Dashboards That Decide', stars: 4.5 },
        ],
        art: ['#7FB2FF', '#0C2240'],
        detail: 'Interactive applications and dashboards that simplify workflows and solve business problems.',
      },
      {
        id: 'soft',
        title: 'Custom Software',
        year: '2025',
        credits: ['Vertex Tech'],
        starring: ['Process fit', 'Integrations', 'Long-term support'],
        reviews: [
          { publication: 'Engineering', quote: 'Tailored To The Process', stars: 5 },
          { publication: 'Operations', quote: 'Fits Like A Glove', stars: 5 },
        ],
        art: ['#0050CC', '#132B4D'],
        detail: 'Purpose-built software tailored to operational requirements and business processes.',
      },
      {
        id: 'mobile',
        title: 'Application Development',
        year: '2025',
        credits: ['Vertex Tech'],
        starring: ['Native performance', 'Cross-platform reach', 'Store delivery'],
        reviews: [
          { publication: 'Product', quote: 'Smooth On Every Device', stars: 4.5 },
          { publication: 'Users', quote: 'Efficiency You Can Feel', stars: 5 },
        ],
        art: ['#2BB3FF', '#081A2E'],
        detail: 'Custom digital applications that improve efficiency and customer experiences.',
      },
    ],
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    srHeading: 'Explore the Vertex Tech library of Projects',
    labels: ['BUILT BY', 'YEAR', 'STACK'],
    items: [
      {
        id: 'nyvexa',
        title: 'Nyvexa AI Assistant',
        year: '2025',
        credits: ['Vertex Tech'],
        starring: ['FastAPI', 'Python', 'SSE', 'PWA'],
        reviews: [
          { publication: 'Capability', quote: 'Research, Tools, One Assistant', stars: 5 },
          { publication: 'Interface', quote: 'Streaming Chat That Keeps Up', stars: 5 },
        ],
        art: ['#1558C9', '#071426'],
        detail: 'A full-stack AI assistant with streaming chat, autonomous web research, tool-using agents, model comparison, and per-user knowledge bases.',
        url: 'https://github.com/subhanbhatti50134-jpg/nyvexa',
        image: '/discs/nyvexa.jpg',
      },
      {
        id: 'rupee-pulse',
        title: 'Rupee Pulse',
        year: '2025',
        credits: ['Vertex Tech'],
        starring: ['React', 'FastAPI', 'WebSockets', 'Binance'],
        reviews: [
          { publication: 'Markets', quote: 'PKR Prices At Low Latency', stars: 5 },
          { publication: 'Traders', quote: 'Alerts, Portfolio, Binance', stars: 4.5 },
        ],
        art: ['#00A8FF', '#0A1628'],
        detail: 'A low-latency cryptocurrency trading and analytics dashboard for the Pakistani market, with Binance prices, PKR valuations, alerts, and portfolio views.',
        url: 'https://github.com/subhanbhatti50134-jpg/Ruppee-Pulse',
        image: '/discs/rupee-pulse.png',
      },
      {
        id: 'snj-gold-lab',
        title: 'SNJ Gold Lab',
        year: '2025',
        credits: ['Vertex Tech'],
        starring: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL'],
        reviews: [
          { publication: 'Inventory', quote: 'Gold, Silver, Lab Materials', stars: 5 },
          { publication: 'Business', quote: 'Transactions Made Traceable', stars: 4.5 },
        ],
        art: ['#3D6FB8', '#101C30'],
        detail: 'An inventory and transaction management system for gold, silver, jewellery, biscuits, and laboratory materials.',
        url: 'https://github.com/subhanbhatti50134-jpg/snj-gold-lab-web-app',
        image: '/discs/snj-gold-lab.png',
      },
      {
        id: 'app-sweeper',
        title: 'App Sweeper',
        year: '2024',
        credits: ['Vertex Tech'],
        starring: ['Python', 'Linux', 'CLI', 'GUI'],
        reviews: [
          { publication: 'Linux', quote: 'Packages Gone, Leftovers Too', stars: 5 },
          { publication: 'Utility', quote: 'Zero Dependencies, Full Clean', stars: 4.5 },
        ],
        art: ['#7FB2FF', '#0C2240'],
        detail: 'A zero-dependency Linux app uninstaller that removes packages together with leftover cache, configuration, and data files.',
        url: 'https://github.com/subhanbhatti50134-jpg/app-sweeper',
        image: '/discs/app-sweeper.png',
      },
      {
        id: 'gold-silver-pos',
        title: 'Gold & Silver POS',
        year: '2024',
        credits: ['Vertex Tech'],
        starring: ['Kotlin', 'Jetpack Compose', 'Room', 'MVVM'],
        reviews: [
          { publication: 'Android', quote: "A Jeweller's Shop In Hand", stars: 5 },
          { publication: 'Retail', quote: 'Sales To Inventory, Natively', stars: 4.5 },
        ],
        art: ['#0050CC', '#132B4D'],
        detail: 'A native Android jewellery shop POS and management system for sales, inventory, purchases, customers, and gold and silver transactions.',
        url: 'https://github.com/subhanbhatti50134-jpg/GoldSilverPOS',
        image: '/discs/gold-silver-pos.png',
      },
      {
        id: 'streamcam',
        title: 'StreamCam',
        year: '2024',
        credits: ['Vertex Tech'],
        starring: ['Ionic', 'Capacitor', 'Python', 'Android'],
        reviews: [
          { publication: 'Cross-Platform', quote: 'Desktop Meets Mobile Viewing', stars: 4.5 },
          { publication: 'Capture', quote: 'Live Streams, Local Media', stars: 5 },
        ],
        art: ['#2BB3FF', '#081A2E'],
        detail: 'A cross-platform camera streaming system pairing a desktop tray app with a Capacitor mobile app for live viewing and media capture.',
        url: 'https://github.com/subhanbhatti50134-jpg/StreamCam',
        image: '/discs/streamcam.png',
      },
      {
        id: 'rate-portal',
        title: 'Jewellers Rate Portal',
        year: '2024',
        credits: ['Vertex Tech'],
        starring: ['TypeScript', 'Web development', 'Live rates'],
        reviews: [
          { publication: 'Jewellers', quote: 'Current Rates, Instantly', stars: 5 },
          { publication: 'Focus', quote: 'One Portal, Zero Noise', stars: 4.5 },
        ],
        art: ['#1A3FFF', '#050E1C'],
        detail: 'A focused portal for viewing current gold and silver rates for Saleem Nadeem Jewellers.',
        url: 'https://github.com/subhanbhatti50134-jpg/Saleem-Nadeem-Jewellers-Rate-portal',
        image: '/discs/rate-portal.png',
      },
      {
        id: 'student-management',
        title: 'Student Management',
        year: '2023',
        credits: ['Vertex Tech'],
        starring: ['C++', 'OOP', 'File handling'],
        reviews: [
          { publication: 'Education', quote: 'Records Without A Database', stars: 4 },
          { publication: 'C++', quote: 'OOP Meets File Handling', stars: 4 },
        ],
        art: ['#5C8FE8', '#0E1F38'],
        detail: 'A file-based student management application for storing student details such as name, age, student ID, and GPA.',
        url: 'https://github.com/subhanbhatti50134-jpg/Student-Management-System-using-OOP-C-',
        image: '/discs/student-management.png',
      },
      {
        id: 'my-portfolio',
        title: 'Developer Portfolio',
        year: '2023',
        credits: ['Vertex Tech'],
        starring: ['HTML', 'CSS', 'JavaScript'],
        reviews: [
          { publication: 'Craft', quote: 'Dark System, Custom Motion', stars: 5 },
          { publication: 'Portfolio', quote: 'Projects On A Sticky Rail', stars: 4.5 },
        ],
        art: ['#2447C8', '#0A1830'],
        detail: 'A personal portfolio website with a dark visual system, custom animations, a sticky project carousel, and responsive layouts.',
        url: 'https://github.com/subhanbhatti50134-jpg/MyPortfolio',
        image: '/discs/developer-portfolio.png',
      },
    ],
  },
}

export const COLLECTION_IDS: CollectionId[] = ['services', 'projects']
