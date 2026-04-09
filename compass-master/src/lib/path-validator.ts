// Path Validator - Validates career paths for Indian context
// Agent 4: Compass Master Orchestrator - QA & CRITIC Role

import { createClient } from './supabase/server'
import { PathRecommendation, Path } from './types'

export interface PathValidationResult {
  status: 'APPROVED' | 'REJECTED' | 'FLAGGED'
  path1Valid: boolean
  path2Valid: boolean
  indianCompaniesCount: number
  hasINRSalary: boolean
  message: string
  issues: string[]
  details: {
    path1: PathDetailValidation
    path2: PathDetailValidation
  }
}

export interface PathDetailValidation {
  name: string
  hasIndianCompany: boolean
  hasINRSalary: boolean
  indianCompaniesFound: string[]
  salaryFormat: 'LPA' | 'per_month' | 'missing' | 'invalid'
  isGeneric: boolean
  issues: string[]
}

// Indian companies whitelist - Tier 1: Major IT/Services
const TIER1_INDIAN_COMPANIES = [
  'TCS', 'Tata Consultancy Services',
  'Infosys',
  'Wipro',
  'HCL', 'HCL Technologies',
  'Tech Mahindra',
  'LTIMindtree', 'Larsen & Toubro Infotech',
  'Cognizant', // Major presence in India
  'Accenture', // Major presence in India
  'IBM India',
  'Microsoft India',
  'Google India',
  'Amazon India', 'AWS India',
  'Flipkart',
  'Swiggy',
  'Zomato',
  'Ola',
  'Paytm',
  'PhonePe',
  'BYJU\'s',
  'Unacademy',
  'Zerodha',
  'Upstox',
  'Groww',
  'Razorpay',
  'CRED',
  'Meesho',
  'Nykaa',
  'PolicyBazaar',
  'MakeMyTrip',
  'BookMyShow',
  'Freshworks',
  'Zoho',
  'Postman',
  'InMobi',
  'ShareChat',
  'Dailyhunt',
  'Lenskart',
  'FirstCry',
  'Delhivery',
  'Rivigo',
  'Blue Dart',
  'FedEx India',
  'DHL India',
  'Reliance Jio',
  'Airtel',
  'Vodafone Idea',
  'Bharti Airtel',
  'ICICI Bank',
  'HDFC Bank',
  'Axis Bank',
  'Kotak Mahindra',
  'SBI', 'State Bank of India',
  'Bajaj Finserv',
  'Adani',
  'Mahindra',
  'Tata Motors',
  'Maruti Suzuki',
  'Hyundai India',
  'Infosys BPM',
  'WNS',
  'Genpact',
  'EXL',
  'Firstsource',
  'Serco',
  'Concentrix',
  'WebMD India',
  'ThoughtWorks',
  'Mindtree',
  'Mphasis',
  'Hexaware',
  'Persistent',
  'KPIT',
  'Bosch India',
  'Siemens India',
  'Samsung India',
  'LG India',
  'Sony India',
  'Dell India',
  'HP India',
  'Lenovo India',
  'Oracle India',
  'SAP India',
  'Adobe India',
  'Salesforce India',
  'VMware India',
  'Cisco India',
  'Juniper India',
  'Intel India',
  'AMD India',
  'NVIDIA India',
  'Qualcomm India',
  'Texas Instruments India'
]

// Tier 2: Product Startups and Scale-ups
const TIER2_INDIAN_STARTUPS = [
  'Zoho',
  'Freshworks',
  'Zerodha',
  'Zomato',
  'Swiggy',
  'BYJU\'s',
  'Unacademy',
  'Vedantu',
  'WhiteHat Jr',
  'UpGrad',
  'Scaler',
  'Masai School',
  'Pesto Tech',
  'InterviewBit',
  'CodeChef',
  'HackerRank',
  'Hackerearth',
  'GeeksforGeeks',
  'Razorpay',
  'CRED',
  'PhonePe',
  'Google Pay India',
  'Amazon Pay',
  'Paytm Payments Bank',
  'Mobikwik',
  'FreeCharge',
  'Ola Electric',
  'Ather Energy',
  'Royal Enfield',
  'Bajaj Auto',
  'Hero MotoCorp',
  'TVS Motor',
  'Ashok Leyland',
  'Eicher Motors',
  'Force Motors',
  'Myntra',
  'Nykaa',
  'Tata Cliq',
  'AJIO',
  'Snapdeal',
  'ShopClues',
  'Meesho',
  'GlowRoad',
  'DeHaat',
  'Udaan',
  'OfBusiness',
  'Infra.Market',
  'Zetwerk',
  'Rivigo',
  'BlackBuck',
  'Delhivery',
  'Shadowfax',
  'Dunzo',
  'Grofers', 'Blinkit',
  'BigBasket',
  'Licious',
  'FreshToHome',
  'ZappFresh',
  'Cure.fit',
  'Cult.fit',
  'Zerodha',
  'Upstox',
  'Groww',
  '5paisa',
  'Angel One',
  'Sharekhan',
  'ICICI Direct',
  'HDFC Securities',
  'Kotak Securities',
  'Zerodha Varsity',
  'Smallcase',
  'Scripbox',
  'FundsIndia',
  'ETMONEY',
  'Mobikwik',
  'Truecaller',
  'Inshorts',
  'Dailyhunt',
  'Josh',
  'Moj',
  'Glance',
  'Roposo',
  'Trell',
  'Ludo King',
  'Dream11',
  ' MPL',
  'WinZO',
  'Zupee',
  'Games24x7',
  'Moonfrog Labs',
  'Nazara Technologies',
  'Loco',
  'Rooter',
  'BetterPlace',
  'Apna',
  'Kaam.work',
  'WorkIndia',
  'HireCraft',
  'Naukri', 'InfoEdge',
  'Monster India',
  'TimesJobs',
  'Shine',
  'Foundit', 'Monster',
  'LinkedIn India',
  'Indeed India',
  'Glassdoor India',
  'AmbitionBox',
  'Clove Dental',
  'MyDentist',
  'Practo',
  '1mg',
  'NetMeds',
  'PharmEasy',
  'Medlife',
  'DocsApp',
  'mfine',
  'HealthifyMe',
  'BeatO',
  'MyDiagnostics',
  'Onco.com',
  'Virohan',
  'Skillmatics',
  'PlayShifu',
  'BYJU\'s Osmo',
  'OckyPocky',
  'Kiddopia',
  'Classplus',
  'Teachmint',
  'Lead School',
  'Vedantu',
  'Doubtnut',
  'Toppr',
  'Meritnation',
  'Extramarks',
  'Aakash BYJU\'s',
  'Allen Digital',
  'Physics Wallah',
  'Unacademy',
  'Testbook',
  'Gradeup',
  'Adda247',
  'Wifistudy',
  'Study IQ',
  'Drishti IAS',
  'Vision IAS',
  'Next IAS',
  'Rau\'s IAS',
  'Shankar IAS',
  'Chanakya Mandal',
  'Byju\'s IAS',
  'Unacademy UPSC',
  'NeoStencil',
  'CivilsDaily',
  'IAS Baba',
  'Forum IAS',
  'Insights IAS',
  'ClearIAS',
  'NeoStencil',
  'Made Easy',
  'ACE Engineering',
  'GateForum',
  'IES Master',
  'Vani Institute',
  'TIME',
  'IMS',
  'Career Launcher',
  'CL Educate',
  'T.I.M.E.',
  'Byju\'s CAT',
  'Cracku',
  'Hitbullseye',
  'Oliveboard',
  'BankersAdda',
  'SSC Adda',
  'Gradeup',
  'Testbook',
  'Current Affairs',
  'Affairs Cloud',
  'GK Today',
  'Bank Exams Today',
  'PendulumEdu',
  'StudyIQ',
  'WifiStudy',
  'Abhinay Maths',
  'Rakesh Yadav',
  'KD Campus',
  'Paramount',
  'Mother\'s Education Hub',
  'Samvargar',
  'Drishti',
  'Vision',
  'Khan Academy India',
  'NCERT',
  'CBSE',
  'ICSE',
  'NIIT',
  'Aptech',
  'Jetking',
  'Arena Animation',
  'MAAC',
  'Frameboxx',
  'Picasso Animation',
  'ZICA',
  'Aditya Birla Fashion',
  'Reliance Retail',
  'Future Group',
  'Trent',
  'Shoppers Stop',
  'Lifestyle',
  'Pantaloons',
  'Max Fashion',
  'Central',
  'Brand Factory',
  'Easyday',
  'More',
  'Big Bazaar',
  'FBB',
  'Ezone',
  ' reliance digital',
  'Croma',
  'Vijay Sales',
  'Sargam Electronics',
  'Poojara',
  'Poorvika',
  'Bajaj Electronics',
  'Sangeetha Mobiles',
  'Lot Mobiles',
  'Instakart',
  'Ekart',
  'Shadowfax',
  'Grab',
  'Rapido',
  'Uber India',
  'Ola',
  'Namma Yatri',
  'BluSmart',
  'Quick Ride',
  'Commut',
  'MoveInSync',
  'Shuttl',
  'Cityflo',
  'ZipGo',
  'RedBus',
  'AbhiBus',
  'Paytm Bus',
  'ixigo',
  'Goibibo',
  'EaseMyTrip',
  'Yatra',
  'ClearTrip',
  'Via',
  'Savaari',
  'CabBazar',
  'Woofer',
  'BharatBenz',
  'Ashok Leyland',
  'Tata Motors',
  'Mahindra & Mahindra',
  'Eicher Motors',
  'VE Commercial',
  'Force Motors',
  'SML Isuzu',
  'JCB India',
  'Komatsu India',
  'Volvo India',
  'Scania India',
  'MAN Trucks',
  'Bharat Forge',
  'Sundram Fasteners',
  'Motherson Sumi',
  'Bosch India',
  'Denso India',
  'Lear India',
  'Faurecia',
  'Magneti Marelli',
  'Valeo India',
  'Continental India',
  'Schaeffler India',
  'SKF India',
  'Timken India',
  'NTN Bearing',
  'RBC Bearings',
  'FAG Bearings',
  'NSK Bearings',
  'Cummins India',
  'Greaves Cotton',
  'Kirloskar',
  'Crompton Greaves',
  'BHEL',
  'NTPC',
  'Power Grid',
  'Tata Power',
  'Adani Power',
  'Reliance Power',
  'JSW Energy',
  'Torrent Power',
  'NHPC',
  'SJVN',
  'THDC',
  'NLC India',
  'Coal India',
  'SAIL',
  'NMDC',
  'MOIL',
  'Hindustan Zinc',
  'Vedanta',
  'Hindalco',
  'NALCO',
  'National Aluminium',
  'HCC',
  'Larsen & Toubro',
  'L&T Construction',
  'L&T Infotech',
  'L&T Technology Services',
  'DLF',
  'Oberoi Realty',
  'Prestige Estates',
  'Godrej Properties',
  'Sobha',
  'Brigade Group',
  'Puravankara',
  'Mahindra Lifespace',
  'Tata Realty',
  'Reliance Infrastructure',
  'GMR Infrastructure',
  'GVK Power',
  'IRB Infrastructure',
  'Ashoka Buildcon',
  'PNC Infratech',
  'KEC International',
  'Kalpataru Power',
  'Sterling & Wilson',
  'Voltas',
  'Blue Star',
  'Carrier India',
  'Daikin India',
  'Hitachi India',
  'Lloyd Electric',
  'Videocon',
  'Onida',
  'Whirlpool India',
  'LG Electronics',
  'Samsung Electronics',
  'Panasonic India',
  'Haier India',
  'TCL India',
  'Xiaomi India',
  'Realme',
  'OPPO India',
  'Vivo India',
  'OnePlus India',
  'Motorola India',
  'Nokia India',
  'iBall',
  'Intex',
  'Micromax',
  'Lava',
  'Karbonn',
  'Jio',
  'Airtel',
  'Vi',
  'BSNL',
  'MTNL'
]

// Combine all companies
const INDIAN_COMPANIES_WHITELIST = [
  ...TIER1_INDIAN_COMPANIES,
  ...TIER2_INDIAN_STARTUPS
].map(c => c.toLowerCase())

// Generic job titles that should be rejected
const GENERIC_TITLES = [
  'software developer',
  'software engineer',
  'web developer',
  'full stack developer',
  'frontend developer',
  'backend developer',
  'data scientist',
  'data analyst',
  'product manager',
  'project manager',
  'business analyst',
  'digital marketer',
  'content writer',
  'graphic designer',
  'ui/ux designer',
  'ux designer',
  'ui designer',
  'app developer',
  'mobile developer',
  'devops engineer',
  'cloud engineer',
  'network engineer',
  'system administrator',
  'database administrator',
  'tester',
  'qa engineer',
  'security analyst',
  'it support',
  'technical writer',
  'sales executive',
  'marketing executive',
  'hr executive',
  'accountant',
  'financial analyst',
  'operations manager',
  'customer support',
  'customer service',
  'teacher',
  'trainer',
  'consultant',
  'freelancer',
  'intern',
  'trainee'
]

/**
 * Validates path data for Indian context
 * Reads path_recommendations from last 10 sessions
 * Checks for specific Indian companies and INR salary ranges
 */
export function validatePathData(path_1: Path, path_2: Path): PathValidationResult {
  const path1Validation = validateSinglePath(path_1)
  const path2Validation = validateSinglePath(path_2)

  const issues: string[] = []

  // REJECT criteria
  let status: 'APPROVED' | 'REJECTED' | 'FLAGGED' = 'APPROVED'

  // Count total Indian companies across both paths
  const totalIndianCompanies = path1Validation.indianCompaniesFound.length +
                                path2Validation.indianCompaniesFound.length

  // Must mention at least 2 specific Indian companies across both paths
  if (totalIndianCompanies < 2) {
    status = 'REJECTED'
    issues.push(`Only ${totalIndianCompanies} Indian company mentioned. Minimum: 2`)
  }

  // Must have INR salary ranges
  if (!path1Validation.hasINRSalary && !path2Validation.hasINRSalary) {
    status = 'REJECTED'
    issues.push('No INR salary ranges found in either path')
  }

  // Check for generic paths without company names
  if (path1Validation.isGeneric || path2Validation.isGeneric) {
    status = 'REJECTED'
    if (path1Validation.isGeneric) issues.push(`Path 1 is generic: "${path_1.name}"`)
    if (path2Validation.isGeneric) issues.push(`Path 2 is generic: "${path_2.name}"`)
  }

  // If any issues but not rejected, flag it
  if (issues.length > 0 && status === 'APPROVED') {
    status = 'FLAGGED'
  }

  return {
    status,
    path1Valid: path1Validation.issues.length === 0,
    path2Valid: path2Validation.issues.length === 0,
    indianCompaniesCount: totalIndianCompanies,
    hasINRSalary: path1Validation.hasINRSalary || path2Validation.hasINRSalary,
    message: status === 'APPROVED' ? 'Paths validated successfully' : `Paths ${status.toLowerCase()}`,
    issues,
    details: {
      path1: path1Validation,
      path2: path2Validation
    }
  }
}

function validateSinglePath(path: Path): PathDetailValidation {
  const issues: string[] = []
  const indianCompaniesFound: string[] = []
  let hasIndianCompany = false
  let hasINRSalary = false
  let salaryFormat: PathDetailValidation['salaryFormat'] = 'missing'
  let isGeneric = false

  // Check path name for company mentions
  const pathNameLower = path.name.toLowerCase()

  // Check for Indian companies
  INDIAN_COMPANIES_WHITELIST.forEach(company => {
    if (pathNameLower.includes(company.toLowerCase())) {
      indianCompaniesFound.push(company)
      hasIndianCompany = true
    }
  })

  // Remove duplicates
  const uniqueCompanies = Array.from(new Set(indianCompaniesFound))

  // Check for generic titles
  GENERIC_TITLES.forEach(title => {
    if (pathNameLower === title || pathNameLower.startsWith(title + ' ')) {
      isGeneric = true
      issues.push(`Generic job title without company context: "${title}"`)
    }
  })

  // Check for company mention requirement (should have "at" or "@" or similar)
  if (!pathNameLower.includes(' at ') &&
      !pathNameLower.includes('@') &&
      !pathNameLower.includes('in ')) {
    // Check if it contains any company
    if (!hasIndianCompany) {
      isGeneric = true
      issues.push('No company context in path name')
    }
  }

  // Check honest_warning and why_it_fits for salary info
  const searchableText = `${path.honest_warning} ${path.why_it_fits} ${path.next_30_days.join(' ')}`.toLowerCase()

  // Check for INR salary patterns
  const inrPatterns = [
    /₹\s*\d+[\d,]*\s*(?:lpa|l\.p\.a|per month|pm|k\/month)/i,
    /\d+[\d,]*\s*(?:lpa|l\.p\.a)/i,
    /\d+[\d,]*\s*(?:k\/month|\/month|per month)/i,
    /\d+[\d,]*\s*(?:thousand|k)\s*(?:per|\\\/)\s*month/i,
    /rs\.?\s*\d+[\d,]*/i,
    /rupees\s*\d+[\d,]*/i,
    /salary.*?\d+[\d,]*\s*(?:lpa|per month)/i,
    /\d+[\d,]*\s*-\s*\d+[\d,]*\s*(?:lpa|per month)/i
  ]

  for (const pattern of inrPatterns) {
    if (pattern.test(searchableText)) {
      hasINRSalary = true

      // Determine format
      if (/lpa|l\.p\.a/i.test(searchableText)) {
        salaryFormat = 'LPA'
      } else if (/per month|pm|k\/month/i.test(searchableText)) {
        salaryFormat = 'per_month'
      } else {
        salaryFormat = 'invalid'
      }
      break
    }
  }

  if (!hasINRSalary) {
    issues.push('No INR salary range found (expected: "₹X-Y LPA" or "₹X per month")')
  }

  return {
    name: path.name,
    hasIndianCompany,
    hasINRSalary,
    indianCompaniesFound: uniqueCompanies,
    salaryFormat,
    isGeneric,
    issues
  }
}

/**
 * Reads path_recommendations from last 10 sessions for batch validation
 */
export async function validateRecentPaths() {
  const supabase = createClient()

  try {
    const { data: recentPaths, error } = await supabase
      .from('path_recommendations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('[PATH VALIDATOR] Database error:', error)
      return null
    }

    const results = recentPaths?.map(rec => {
      return {
        session_id: rec.session_id,
        validation: validatePathData(rec.path_1 as Path, rec.path_2 as Path)
      }
    })

    return results

  } catch (error) {
    console.error('[PATH VALIDATOR] Unexpected error:', error)
    return null
  }
}

/**
 * Gets list of valid Indian companies for prompts
 */
export function getIndianCompaniesForPrompt(): string {
  const companies = [
    'TCS', 'Infosys', 'Wipro', 'Zoho', 'Zerodha',
    'Flipkart', 'Swiggy', 'Zomato', 'BYJU\'s',
    'Ola', 'Paytm', 'PhonePe', 'CRED', 'Razorpay',
    'Freshworks', 'Meesho', 'Nykaa', 'PolicyBazaar',
    'Unacademy', 'Vedantu', 'HCL', 'Tech Mahindra',
    'LTIMindtree', 'Cognizant', 'Accenture', 'ThoughtWorks',
    'Practo', '1mg', 'PharmEasy', 'NetMeds',
    'Urban Company', 'Dunzo', 'Blinkit', 'Grofers',
    'BigBasket', 'Licious', 'Cure.fit', 'Cult.fit',
    'Groww', 'Upstox', 'Angel One', '5paisa',
    'ShareChat', 'Dailyhunt', 'Inshorts', 'Truecaller',
    'MakeMyTrip', 'Goibibo', 'Yatra', 'EaseMyTrip',
    'RedBus', 'ixigo', 'BookMyShow', 'Amazon India',
    'Microsoft India', 'Google India', 'Samsung India',
    'Reliance Jio', 'Airtel', 'Vi', 'BSNL',
    'ICICI Bank', 'HDFC Bank', 'Axis Bank', 'SBI',
    'Kotak Mahindra', 'Bajaj Finserv', 'Adani',
    'Tata Motors', 'Mahindra', 'Maruti Suzuki',
    'Royal Enfield', 'Bajaj Auto', 'Hero MotoCorp',
    'Havells', 'Crompton', 'Orient Electric',
    'Voltas', 'Blue Star', 'Lloyd', 'Whirlpool',
    'Godrej', 'Dabur', 'Patanjali', 'HUL',
    'Nestle India', 'Britannia', 'ITC', 'Marico',
    'Asian Paints', 'Berger Paints', 'Kansai Nerolac',
    'Pidilite', 'Dr. Fixit', 'CERA', 'Jaquar',
    'Hindware', 'Kohler India', 'Jaquar', 'Cera'
  ]

  return companies.join(', ')
}
