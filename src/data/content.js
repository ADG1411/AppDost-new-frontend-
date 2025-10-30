/**
 * Static data for the TechNova Digital website
 */
import { 
  FaBrain, 
  FaCloud, 
  FaCode, 
  FaPalette, 
  FaShieldAlt, 
  FaCogs,
  FaHeart,
  FaUsers,
  FaChartLine,
  FaAward,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaInstagram
} from 'react-icons/fa'

export const company = {
  name: 'AppDost',
  tagline: 'Complete IT Solution',
  description: 'Transforming businesses with cutting-edge technology solutions, innovative development, and comprehensive IT services.',
  founded: '2018',
  employees: '75+',
  email: 'info@appdost.com',
  phone: '+91 98765 43210',
  address: 'Tech Hub, Sector 62, Noida, UP 201309, India'
}

export const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/projects' },
  { name: 'Industries', href: '/industries' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
]

export const metrics = [
  {
    id: 1,
    label: 'Projects Completed',
    value: 250,
    suffix: '+',
    icon: FaChartLine
  },
  {
    id: 2,
    label: 'Industries Served',
    value: 15,
    suffix: '+',
    icon: FaUsers
  },
  {
    id: 3,
    label: 'Client Satisfaction',
    value: 99,
    suffix: '%',
    icon: FaHeart
  },
  {
    id: 4,
    label: 'Team Size',
    value: 50,
    suffix: '+',
    icon: FaAward
  }
]

export const services = [
  {
    id: 1,
    title: 'AI & Machine Learning',
    description: 'Transform your business with intelligent automation and predictive analytics.',
    bullets: [
      'Custom ML model development and deployment',
      'Increase operational efficiency by 40%',
      'ROI improvement of 300% on average'
    ],
    techStack: ['Python', 'TensorFlow', 'PyTorch', 'AWS SageMaker', 'Docker'],
    icon: FaBrain,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 2,
    title: 'Cloud & DevOps',
    description: 'Scalable, secure, and cost-effective cloud infrastructure solutions.',
    bullets: [
      'Multi-cloud architecture design and implementation',
      'Reduce infrastructure costs by 50%',
      '99.9% uptime SLA guarantee'
    ],
    techStack: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform'],
    icon: FaCloud,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 3,
    title: 'Web & Mobile Apps',
    description: 'Modern, responsive applications that deliver exceptional user experiences.',
    bullets: [
      'Full-stack web and mobile application development',
      'Improve user engagement by 60%',
      'Cross-platform compatibility guaranteed'
    ],
    techStack: ['React', 'React Native', 'Node.js', 'MongoDB', 'GraphQL'],
    icon: FaCode,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    title: 'UI/UX Design',
    description: 'Data-driven design solutions that convert visitors into customers.',
    bullets: [
      'User-centered design and research methodology',
      'Increase conversion rates by 80%',
      'WCAG AA accessibility compliance'
    ],
    techStack: ['Figma', 'Adobe XD', 'Sketch', 'Principle', 'InVision'],
    icon: FaPalette,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 5,
    title: 'Cybersecurity',
    description: 'Comprehensive security solutions to protect your digital assets.',
    bullets: [
      'End-to-end security assessment and implementation',
      'Reduce security incidents by 95%',
      'ISO 27001 compliant security frameworks'
    ],
    techStack: ['SIEM', 'Penetration Testing', 'Zero Trust', 'Encryption'],
    icon: FaShieldAlt,
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 6,
    title: 'MLOps',
    description: 'Streamlined machine learning operations for production-ready AI solutions.',
    bullets: [
      'Automated ML pipeline deployment and monitoring',
      'Reduce model deployment time by 70%',
      'Continuous integration for ML workflows'
    ],
    techStack: ['MLflow', 'Kubeflow', 'DVC', 'Apache Airflow', 'Prometheus'],
    icon: FaCogs,
    color: 'from-indigo-500 to-purple-500'
  }
]

export const projects = [
  {
    id: 1,
    title: 'FinTech AI Platform',
    category: 'AI/ML',
    image: '/api/placeholder/600/400',
    description: 'Revolutionary fraud detection system processing 1M+ transactions daily.',
    problem: 'Traditional rule-based fraud detection had 40% false positive rate, causing customer friction and revenue loss.',
    approach: 'Implemented ensemble ML models with real-time feature engineering and adaptive learning.',
    outcome: 'Reduced false positives by 80%, saved $2M annually, improved customer satisfaction by 45%.',
    metrics: {
      'Fraud Detection Accuracy': '99.2%',
      'False Positive Reduction': '80%',
      'Annual Savings': '$2M+',
      'Processing Speed': '< 100ms'
    },
    techStack: ['Python', 'TensorFlow', 'Apache Kafka', 'Redis', 'AWS'],
    liveUrl: 'https://demo.fintech-ai.com',
    caseStudyUrl: '#'
  },
  {
    id: 2,
    title: 'Healthcare IoT Dashboard',
    category: 'Web Development',
    image: '/api/placeholder/600/400',
    description: 'Real-time patient monitoring system for 500+ hospital beds.',
    problem: 'Manual patient monitoring led to delayed responses and increased risk of complications.',
    approach: 'Built IoT-enabled dashboard with real-time alerts and predictive analytics.',
    outcome: 'Reduced response time by 60%, prevented 200+ critical incidents, improved patient outcomes.',
    metrics: {
      'Response Time Reduction': '60%',
      'Incidents Prevented': '200+',
      'Hospitals Using': '25+',
      'Patient Satisfaction': '95%'
    },
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Docker'],
    liveUrl: 'https://demo.healthcare-iot.com',
    caseStudyUrl: '#'
  },
  {
    id: 3,
    title: 'E-commerce Optimization',
    category: 'UI/UX',
    image: '/api/placeholder/600/400',
    description: 'Complete redesign increasing conversion rates by 120%.',
    problem: 'Low conversion rates and high cart abandonment were impacting revenue growth.',
    approach: 'Conducted user research, A/B tested design elements, optimized checkout flow.',
    outcome: 'Increased conversions by 120%, reduced cart abandonment by 45%, boosted revenue by $5M.',
    metrics: {
      'Conversion Increase': '120%',
      'Cart Abandonment Reduction': '45%',
      'Revenue Impact': '$5M+',
      'Page Load Speed': '2.1s'
    },
    techStack: ['Figma', 'React', 'Next.js', 'Stripe', 'Google Analytics'],
    liveUrl: 'https://demo.ecommerce-opt.com',
    caseStudyUrl: '#'
  }
]

export const industries = [
  {
    id: 1,
    name: 'Healthcare',
    description: 'HIPAA-compliant solutions for patient care and medical research.',
    icon: FaHeart,
    specialties: ['Telemedicine', 'EHR Systems', 'Medical IoT', 'Clinical Analytics']
  },
  {
    id: 2,
    name: 'Finance',
    description: 'Secure, scalable fintech solutions for banking and payments.',
    icon: FaChartLine,
    specialties: ['Trading Platforms', 'Risk Management', 'Blockchain', 'RegTech']
  },
  {
    id: 3,
    name: 'Education',
    description: 'Interactive learning platforms and educational technology.',
    icon: FaUsers,
    specialties: ['E-Learning', 'LMS', 'Virtual Classrooms', 'Student Analytics']
  },
  {
    id: 4,
    name: 'Retail',
    description: 'Omnichannel retail solutions and customer experience optimization.',
    icon: FaCode,
    specialties: ['E-commerce', 'Inventory Management', 'POS Systems', 'CRM']
  },
  {
    id: 5,
    name: 'Energy',
    description: 'Smart grid solutions and renewable energy management systems.',
    icon: FaAward,
    specialties: ['Smart Grid', 'IoT Monitoring', 'Energy Analytics', 'Sustainability']
  },
  {
    id: 6,
    name: 'Manufacturing',
    description: 'Industry 4.0 solutions for production optimization and automation.',
    icon: FaCogs,
    specialties: ['IoT Sensors', 'Predictive Maintenance', 'Quality Control', 'Supply Chain']
  }
]

export const team = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO & Co-Founder',
    bio: 'Former Google AI researcher with 15 years of experience in machine learning and product strategy.',
    image: '/api/placeholder/300/300',
    linkedin: 'https://linkedin.com/in/sarahjohnson'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Tesla software architect specializing in scalable systems and cloud infrastructure.',
    image: '/api/placeholder/300/300',
    linkedin: 'https://linkedin.com/in/michaelchen'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Head of Design',
    bio: 'Award-winning UX designer from Apple, passionate about accessible and inclusive design.',
    image: '/api/placeholder/300/300',
    linkedin: 'https://linkedin.com/in/emilyrodriguez'
  },
  {
    id: 4,
    name: 'David Park',
    role: 'VP of Engineering',
    bio: 'Former Microsoft principal engineer with expertise in distributed systems and DevOps.',
    image: '/api/placeholder/300/300',
    linkedin: 'https://linkedin.com/in/davidpark'
  }
]

export const socialLinks = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/appdost',
    icon: FaLinkedin
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/appdost_tech',
    icon: FaTwitter
  },
  {
    name: 'GitHub',
    url: 'https://github.com/appdost',
    icon: FaGithub
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/appdost.tech',
    icon: FaInstagram
  }
]

export const companyValues = [
  {
    id: 1,
    title: 'Innovation First',
    description: 'We push the boundaries of technology to create groundbreaking solutions.',
    icon: FaBrain
  },
  {
    id: 2,
    title: 'Client Success',
    description: 'Your success is our success. We are committed to delivering exceptional results.',
    icon: FaAward
  },
  {
    id: 3,
    title: 'Team Collaboration',
    description: 'We believe in the power of diverse perspectives and collaborative innovation.',
    icon: FaUsers
  },
  {
    id: 4,
    title: 'Quality Excellence',
    description: 'We maintain the highest standards in code quality, security, and performance.',
    icon: FaShieldAlt
  }
]