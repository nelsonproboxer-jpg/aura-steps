/* ============================================================
   AURA STEPS — catalog & store configuration
   ------------------------------------------------------------
   TO EDIT PRODUCTS: change the PRODUCTS array below.
   - image: a transparent (frameless) PNG in the images/ folder.
   - Prices are plain numbers in USD (the base). Shoppers switch the
     displayed currency (USD/GBP) from the header toggle.
   - featured: true puts the piece in the home "Featured" row.
   - isNew: true puts the piece in the home "New Arrivals" row.
   ============================================================ */

/* ---- Worldwide currency & shipping ----
   Prices are authored in USD. Shoppers pick their country (header or checkout);
   every price is then converted and shown in that country's currency using live
   FX rates. Card payments are charged by Flutterwave in the shopper's currency
   when Flutterwave supports it, otherwise in USD (their bank converts). */
const FX_FALLBACK = { USD: 1, GBP: 0.74, EUR: 0.92, NGN: 1600, CAD: 1.36, AUD: 1.5 };

/* Currencies Flutterwave can charge in directly for this merchant. Any other
   currency is displayed locally but charged in USD. */
const FLW_CURRENCIES = ["USD", "NGN", "GBP", "EUR", "GHS", "KES", "ZAR", "TZS", "UGX", "RWF", "ZMW", "MWK", "XAF", "XOF", "EGP", "MAD"];

/* Every country + its primary currency (ISO 4217). We ship worldwide. */
const COUNTRY_DATA = [
  ["US","United States","USD"],["GB","United Kingdom","GBP"],["CA","Canada","CAD"],["AU","Australia","AUD"],["NZ","New Zealand","NZD"],
  ["IE","Ireland","EUR"],["FR","France","EUR"],["DE","Germany","EUR"],["IT","Italy","EUR"],["ES","Spain","EUR"],["PT","Portugal","EUR"],
  ["NL","Netherlands","EUR"],["BE","Belgium","EUR"],["AT","Austria","EUR"],["LU","Luxembourg","EUR"],["FI","Finland","EUR"],["GR","Greece","EUR"],
  ["CY","Cyprus","EUR"],["MT","Malta","EUR"],["EE","Estonia","EUR"],["LV","Latvia","EUR"],["LT","Lithuania","EUR"],["SK","Slovakia","EUR"],
  ["SI","Slovenia","EUR"],["HR","Croatia","EUR"],["AD","Andorra","EUR"],["MC","Monaco","EUR"],["SM","San Marino","EUR"],["VA","Vatican City","EUR"],
  ["XK","Kosovo","EUR"],["ME","Montenegro","EUR"],["CH","Switzerland","CHF"],["LI","Liechtenstein","CHF"],["NO","Norway","NOK"],["SE","Sweden","SEK"],
  ["DK","Denmark","DKK"],["IS","Iceland","ISK"],["PL","Poland","PLN"],["CZ","Czechia","CZK"],["HU","Hungary","HUF"],["RO","Romania","RON"],
  ["BG","Bulgaria","BGN"],["RS","Serbia","RSD"],["BA","Bosnia and Herzegovina","BAM"],["MK","North Macedonia","MKD"],["AL","Albania","ALL"],
  ["MD","Moldova","MDL"],["UA","Ukraine","UAH"],["BY","Belarus","BYN"],["RU","Russia","RUB"],["TR","Turkey","TRY"],
  ["NG","Nigeria","NGN"],["GH","Ghana","GHS"],["KE","Kenya","KES"],["ZA","South Africa","ZAR"],["TZ","Tanzania","TZS"],["UG","Uganda","UGX"],
  ["RW","Rwanda","RWF"],["ZM","Zambia","ZMW"],["MW","Malawi","MWK"],["EG","Egypt","EGP"],["MA","Morocco","MAD"],["DZ","Algeria","DZD"],
  ["TN","Tunisia","TND"],["LY","Libya","LYD"],["SN","Senegal","XOF"],["CI","Cote d'Ivoire","XOF"],["BJ","Benin","XOF"],["BF","Burkina Faso","XOF"],
  ["ML","Mali","XOF"],["NE","Niger","XOF"],["TG","Togo","XOF"],["GW","Guinea-Bissau","XOF"],["CM","Cameroon","XAF"],["GA","Gabon","XAF"],
  ["CG","Congo","XAF"],["TD","Chad","XAF"],["CF","Central African Republic","XAF"],["GQ","Equatorial Guinea","XAF"],["CD","DR Congo","CDF"],
  ["AO","Angola","AOA"],["MZ","Mozambique","MZN"],["BW","Botswana","BWP"],["NA","Namibia","NAD"],["ZW","Zimbabwe","USD"],["LS","Lesotho","LSL"],
  ["SZ","Eswatini","SZL"],["MG","Madagascar","MGA"],["MU","Mauritius","MUR"],["SC","Seychelles","SCR"],["CV","Cape Verde","CVE"],
  ["GM","Gambia","GMD"],["GN","Guinea","GNF"],["LR","Liberia","LRD"],["SL","Sierra Leone","SLE"],["ET","Ethiopia","ETB"],["SO","Somalia","SOS"],
  ["DJ","Djibouti","DJF"],["ER","Eritrea","ERN"],["SD","Sudan","SDG"],["SS","South Sudan","SSP"],["BI","Burundi","BIF"],["KM","Comoros","KMF"],
  ["MR","Mauritania","MRU"],["ST","Sao Tome and Principe","STN"],
  ["AE","United Arab Emirates","AED"],["SA","Saudi Arabia","SAR"],["QA","Qatar","QAR"],["KW","Kuwait","KWD"],["BH","Bahrain","BHD"],
  ["OM","Oman","OMR"],["JO","Jordan","JOD"],["LB","Lebanon","LBP"],["IL","Israel","ILS"],["IQ","Iraq","IQD"],["YE","Yemen","YER"],
  ["IR","Iran","IRR"],["SY","Syria","SYP"],["AF","Afghanistan","AFN"],["PK","Pakistan","PKR"],["IN","India","INR"],["BD","Bangladesh","BDT"],
  ["LK","Sri Lanka","LKR"],["NP","Nepal","NPR"],["BT","Bhutan","INR"],["MV","Maldives","MVR"],["CN","China","CNY"],["HK","Hong Kong","HKD"],
  ["MO","Macau","MOP"],["TW","Taiwan","TWD"],["JP","Japan","JPY"],["KR","South Korea","KRW"],["MN","Mongolia","MNT"],["KZ","Kazakhstan","KZT"],
  ["UZ","Uzbekistan","UZS"],["KG","Kyrgyzstan","KGS"],["TJ","Tajikistan","TJS"],["TM","Turkmenistan","TMT"],["AZ","Azerbaijan","AZN"],
  ["AM","Armenia","AMD"],["GE","Georgia","GEL"],["TH","Thailand","THB"],["VN","Vietnam","VND"],["ID","Indonesia","IDR"],["MY","Malaysia","MYR"],
  ["SG","Singapore","SGD"],["PH","Philippines","PHP"],["MM","Myanmar","MMK"],["KH","Cambodia","KHR"],["LA","Laos","LAK"],["BN","Brunei","BND"],
  ["TL","Timor-Leste","USD"],
  ["MX","Mexico","MXN"],["BR","Brazil","BRL"],["AR","Argentina","ARS"],["CL","Chile","CLP"],["CO","Colombia","COP"],["PE","Peru","PEN"],
  ["EC","Ecuador","USD"],["BO","Bolivia","BOB"],["PY","Paraguay","PYG"],["UY","Uruguay","UYU"],["VE","Venezuela","VES"],["GY","Guyana","GYD"],
  ["SR","Suriname","SRD"],["PA","Panama","USD"],["CR","Costa Rica","CRC"],["GT","Guatemala","GTQ"],["HN","Honduras","HNL"],["SV","El Salvador","USD"],
  ["NI","Nicaragua","NIO"],["DO","Dominican Republic","DOP"],["CU","Cuba","CUP"],["HT","Haiti","HTG"],["JM","Jamaica","JMD"],["TT","Trinidad and Tobago","TTD"],
  ["BS","Bahamas","BSD"],["BB","Barbados","BBD"],["BZ","Belize","BZD"],["AG","Antigua and Barbuda","XCD"],["DM","Dominica","XCD"],["GD","Grenada","XCD"],
  ["KN","Saint Kitts and Nevis","XCD"],["LC","Saint Lucia","XCD"],["VC","Saint Vincent and the Grenadines","XCD"],["PR","Puerto Rico","USD"],
  ["FJ","Fiji","FJD"],["PG","Papua New Guinea","PGK"],["SB","Solomon Islands","SBD"],["VU","Vanuatu","VUV"],["WS","Samoa","WST"],["TO","Tonga","TOP"],
  ["KI","Kiribati","AUD"],["TV","Tuvalu","AUD"],["NR","Nauru","AUD"],["FM","Micronesia","USD"],["MH","Marshall Islands","USD"],["PW","Palau","USD"],
];
const COUNTRIES = COUNTRY_DATA.map(([c, n, cur]) => ({ c, n, cur })).sort((a, b) => a.n.localeCompare(b.n));
const COUNTRY_BY_CODE = Object.fromEntries(COUNTRIES.map((x) => [x.c, x]));
const CURRENCY_CODES = new Set(["USD", ...COUNTRIES.map((x) => x.cur)]);

/* ---- Card payments (Flutterwave) — LIVE ----
   This is the LIVE key: real cards are charged real money and settle to the
   Flutterwave account. Charges in the currency the shopper is viewing
   (USD/GBP). (Previous test key was FLWPUBK_TEST-2eeff863…) */
const FLUTTERWAVE_PUBLIC_KEY = "FLWPUBK-e6e8aaa775a339db52e1bd3678e9e9a9-X";
const FREE_SHIPPING_OVER = 500;
const SHIPPING_FLAT = 40;

/* Orders are emailed here via FormSubmit — no signup, no API key. On the
   first order it sends a one-time activation email to this address; click
   the link once and every future order lands in this inbox. */
const ORDER_EMAIL = "ugwunelson0@gmail.com";

/* Cloudflare Worker that sends the branded order-confirmation email from
   support@aurastepsusa.com via Resend. This URL is public and safe to expose —
   the secret Resend key lives inside the Worker, never in this file. If this is
   left blank, checkout falls back to the plain FormSubmit confirmation. */
const ORDER_EMAIL_WORKER = "https://aura-email.nelsonproboxer.workers.dev/";

/* Public contact details shown on the site. SUPPORT_EMAIL is what customers
   see; it starts receiving mail once the aurastepsusa.com domain + free
   mailbox are set up. Until then, the contact form and orders still deliver
   to ORDER_EMAIL above. */
const SUPPORT_EMAIL = "support@aurastepsusa.com";
const SUPPORT_PHONE = "+1 (213) 357-0150";
const SUPPORT_ADDRESS = "85 Washington St, Delaware City, DE 19706";

/* Geoapify API key powers the street-address autocomplete at checkout (free
   tier). This is a client-side key — safe to expose — but restrict it to your
   domain in the Geoapify dashboard (Allowed origins → aurastepsusa.com). */
const GEOAPIFY_KEY = "f15f99b87dc24e14b916620b18d972b0";

/* ---- Advertising & analytics pixels ----
   These IDs are PUBLIC (they live in the browser by design) — safe to expose.
   Each pixel only loads when its ID is filled in; leave blank to disable.
   Events fired automatically: ViewContent, AddToCart, InitiateCheckout, Purchase. */
const TIKTOK_PIXEL_ID = "DACSLNJC77UES974GLF0";
const META_PIXEL_ID = "";      // paste your Meta Pixel ID here once your account is approved
const GOOGLE_TAG_ID = "";      // paste your GA4 / Google Ads tag (e.g. "G-XXXXXXX" or "AW-XXXXXXX")

/* US states for the checkout address dropdown (shipping is US-only for now). */
const US_STATES = [
  { c: "AL", n: "Alabama" }, { c: "AK", n: "Alaska" }, { c: "AZ", n: "Arizona" }, { c: "AR", n: "Arkansas" },
  { c: "CA", n: "California" }, { c: "CO", n: "Colorado" }, { c: "CT", n: "Connecticut" }, { c: "DE", n: "Delaware" },
  { c: "DC", n: "District of Columbia" }, { c: "FL", n: "Florida" }, { c: "GA", n: "Georgia" }, { c: "HI", n: "Hawaii" },
  { c: "ID", n: "Idaho" }, { c: "IL", n: "Illinois" }, { c: "IN", n: "Indiana" }, { c: "IA", n: "Iowa" },
  { c: "KS", n: "Kansas" }, { c: "KY", n: "Kentucky" }, { c: "LA", n: "Louisiana" }, { c: "ME", n: "Maine" },
  { c: "MD", n: "Maryland" }, { c: "MA", n: "Massachusetts" }, { c: "MI", n: "Michigan" }, { c: "MN", n: "Minnesota" },
  { c: "MS", n: "Mississippi" }, { c: "MO", n: "Missouri" }, { c: "MT", n: "Montana" }, { c: "NE", n: "Nebraska" },
  { c: "NV", n: "Nevada" }, { c: "NH", n: "New Hampshire" }, { c: "NJ", n: "New Jersey" }, { c: "NM", n: "New Mexico" },
  { c: "NY", n: "New York" }, { c: "NC", n: "North Carolina" }, { c: "ND", n: "North Dakota" }, { c: "OH", n: "Ohio" },
  { c: "OK", n: "Oklahoma" }, { c: "OR", n: "Oregon" }, { c: "PA", n: "Pennsylvania" }, { c: "RI", n: "Rhode Island" },
  { c: "SC", n: "South Carolina" }, { c: "SD", n: "South Dakota" }, { c: "TN", n: "Tennessee" }, { c: "TX", n: "Texas" },
  { c: "UT", n: "Utah" }, { c: "VT", n: "Vermont" }, { c: "VA", n: "Virginia" }, { c: "WA", n: "Washington" },
  { c: "WV", n: "West Virginia" }, { c: "WI", n: "Wisconsin" }, { c: "WY", n: "Wyoming" },
];

/* UK counties/areas for the checkout dropdown when United Kingdom is chosen
   (county is optional for UK addresses; unlisted ones auto-add on selection). */
const UK_COUNTIES = [
  "Aberdeenshire", "Angus", "Antrim", "Argyll and Bute", "Armagh", "Bedfordshire",
  "Berkshire", "Bristol", "Buckinghamshire", "Cambridgeshire", "Cardiff", "Carmarthenshire",
  "Ceredigion", "Cheshire", "Conwy", "Cornwall", "County Durham", "Cumbria", "Denbighshire",
  "Derbyshire", "Devon", "Dorset", "Down", "Dumfries and Galloway", "Dundee", "East Sussex",
  "Edinburgh", "Essex", "Fermanagh", "Fife", "Flintshire", "Glasgow", "Gloucestershire",
  "Greater London", "Greater Manchester", "Gwynedd", "Hampshire", "Herefordshire",
  "Hertfordshire", "Highland", "Isle of Wight", "Kent", "Lancashire", "Leicestershire",
  "Lincolnshire", "Londonderry", "Merseyside", "Monmouthshire", "Norfolk", "North Yorkshire",
  "Northamptonshire", "Northumberland", "Nottinghamshire", "Oxfordshire", "Pembrokeshire",
  "Perth and Kinross", "Powys", "Rutland", "Scottish Borders", "Shropshire", "Somerset",
  "South Yorkshire", "Staffordshire", "Stirling", "Suffolk", "Surrey", "Swansea", "Tyne and Wear",
  "Tyrone", "Warwickshire", "West Midlands", "West Sussex", "West Yorkshire", "Wiltshire",
  "Worcestershire", "Wrexham",
].map((n) => ({ c: n, n }));

/* Crypto wallet addresses shown at checkout — these are Aura Steps'
   real PUBLIC receiving addresses. Each entry carries the network the
   customer must send on (sending on the wrong network can lose funds). */
const WALLETS = {
  BTC:  { address: "156VPJLXzDBB4UcncJFFFXpUtiR8hEqukh",        network: "Bitcoin" },
  ETH:  { address: "0xd911e4fed6fb4d32f31e100c55a212bb05a1b383", network: "Ethereum (ERC-20)" },
  USDT: { address: "TTTB4ZUEtcLNz8RdbVD7QKdFzJ7QKHRNuZ",        network: "Tron (TRC-20)" },
};

const PRODUCTS = [
  // ---------- HEELS (14) ----------
  { id: "h01", name: "Celeste", style: "Ivory Leather Pump", category: "heels", price: 545, badge: null, featured: true, isNew: false, image: "images/heels-01.webp",
    description: "A timeless ivory pump with a sculpted almond toe and a graceful 90mm stiletto. The quiet centrepiece of any wardrobe." },
  { id: "h02", name: "Fiorella", style: "Azure Floral Stiletto", category: "heels", price: 950, badge: "New", featured: false, isNew: true, image: "images/heels-02.webp",
    description: "Hand-finished floral satin over a razor-fine stiletto. A wearable work of art for evenings that matter." },
  { id: "h04", name: "Bianca", style: "Porcelain Patent Stiletto", category: "heels", price: 620, badge: null, featured: false, isNew: false, image: "images/heels-04.webp",
    description: "A single-seam porcelain stiletto polished to a soft glow. Bridal-worthy, boardroom-ready." },
  { id: "h07", name: "Marlowe", style: "Classic Noir Pump", category: "heels", price: 495, badge: null, featured: false, isNew: false, image: "images/heels-07.webp",
    description: "Our signature black pump on a 100mm stiletto — the piece stylists call the little black dress of footwear." },
  { id: "h13", name: "Giselle", style: "Blush Ankle-Strap Sandal", category: "heels", price: 580, badge: null, featured: false, isNew: false, image: "images/heels-13.webp",
    description: "A ballet-blush heeled sandal with a delicate bow and slender ankle strap. Romance, engineered." },
  { id: "h16", name: "Delphine", style: "Scarlet Lace-Up Sandal", category: "heels", price: 675, badge: null, featured: false, isNew: false, image: "images/heels-16.webp",
    description: "Scarlet suede with ribbon lacing that wraps the ankle. Bold by design, comfortable by obsession." },
  { id: "h20", name: "Mirabel", style: "Rouge Patent Platform", category: "heels", price: 820, badge: "Bestseller", featured: true, isNew: false, image: "images/heels-20.webp",
    description: "High-gloss rouge patent on a dramatic lace-front platform. Not for the faint of heart." },
  { id: "h24", name: "Thea", style: "Raspberry Velvet Pump", category: "heels", price: 595, badge: null, featured: false, isNew: false, image: "images/heels-24.webp",
    description: "Crushed raspberry velvet that deepens by candlelight. Winter's most romantic shoe." },
  { id: "h25", name: "Seraphina", style: "Caramel Slingback Kitten", category: "heels", price: 560, badge: null, featured: false, isNew: false, image: "images/heels-25.webp",
    description: "Toffee-toned leather with a crossed slingback strap on a poised kitten heel. Everyday elegance, elevated." },
  { id: "h26", name: "Ophelia", style: "Noir Mesh Sandal", category: "heels", price: 780, badge: null, featured: false, isNew: false, image: "images/heels-26.webp",
    description: "Sheer mesh panels and velvet straps on a soaring stiletto. After-dark architecture for the ankle upward." },
  { id: "h27", name: "Odette", style: "Peach Crystal Platform", category: "heels", price: 1040, badge: "Bestseller", featured: true, isNew: false, image: "images/heels-27.webp",
    description: "A peep-toe platform scattered with crystals over peach patent. Red-carpet stamina, all-night grace." },
  { id: "h28", name: "Vesper", style: "Navy Croc Platform Mule", category: "heels", price: 690, badge: "Limited", featured: false, isNew: true, image: "images/heels-28.webp",
    description: "Croc-embossed navy leather on a stacked wooden platform. The statement mule of the season." },
  { id: "h29", name: "Juliette", style: "Pearl Strap Mule", category: "heels", price: 715, badge: null, featured: false, isNew: true, image: "images/heels-29.webp",
    description: "A pointed white mule crowned with a strand of pearls. Bridal by birth, cocktail by nature." },
  { id: "h30", name: "Priya", style: "Rouge Block Pump", category: "heels", price: 660, badge: null, featured: false, isNew: false, image: "images/heels-30.webp",
    description: "Liquid-red patent on a confident block heel. Power dressing, distilled to one shoe." },

  // ---------- FLATS (9) ----------
  { id: "f01", name: "Aria", style: "Marigold Pointed Flat", category: "flats", price: 320, badge: null, featured: false, isNew: false, image: "images/flats-01.webp",
    description: "A sun-drenched marigold flat with a sharp pointed toe. Instant polish, zero compromise." },
  { id: "f04", name: "Dahlia", style: "Saffron Kiltie Moccasin", category: "flats", price: 360, badge: null, featured: false, isNew: false, image: "images/flats-04.webp",
    description: "Saffron suede with a fringed kiltie and hand-tied bow. Driving-shoe comfort, runway warmth." },
  { id: "f05", name: "Esme", style: "Cognac Horsebit Loafer", category: "flats", price: 475, badge: null, featured: false, isNew: false, image: "images/flats-05.webp",
    description: "Burnished cognac calfskin with polished hardware. The loafer that outlives trends." },
  { id: "f07", name: "Hazel", style: "Camel Suede Loafer", category: "flats", price: 410, badge: null, featured: false, isNew: false, image: "images/flats-07.webp",
    description: "Camel suede with a slim gilt bit. Quiet luxury for loud calendars." },
  { id: "f12", name: "Nova", style: "Blush Perforated Brogue", category: "flats", price: 340, badge: null, featured: false, isNew: false, image: "images/flats-12.webp",
    description: "Blush perforated leather with a gilded sole line. The sneaker-flat hybrid your mornings deserve." },
  { id: "f13", name: "Lena", style: "Peach Bow Ballerina", category: "flats", price: 360, badge: null, featured: false, isNew: true, image: "images/flats-13.webp",
    description: "Petal-pink satin with a double bow at the pointed toe. The ballerina flat, en pointe." },
  { id: "f14", name: "Camille", style: "Plum Pointed Flat", category: "flats", price: 440, badge: "New", featured: false, isNew: true, image: "images/flats-14.webp",
    description: "Deep plum microsuede with a clean pointed profile. The unexpected neutral that goes with everything." },
  { id: "f16", name: "Gaia", style: "Silver Lace Flat", category: "flats", price: 498, badge: null, featured: false, isNew: false, image: "images/flats-16.webp",
    description: "Metallic lace over a satin-lined flat. Occasionwear that keeps up with the dance floor." },
  { id: "f17", name: "Iris", style: "Noir Brogue Oxford", category: "flats", price: 295, badge: null, featured: false, isNew: false, image: "images/flats-17.webp",
    description: "A classic black brogue oxford, broken-in soft. Heritage tailoring for her." },

  // ---------- BOOTS (9) ----------
  { id: "b01", name: "Isolde", style: "Noir Stiletto Ankle Boot", category: "boots", price: 950, badge: "Bestseller", featured: true, isNew: false, image: "images/boots-01.webp",
    description: "A razor-sharp stiletto ankle boot in smooth black calfskin. The definition of after-dark authority." },
  { id: "b04", name: "Cordelia", style: "Blush Patent Ankle Boot", category: "boots", price: 860, badge: "New", featured: false, isNew: true, image: "images/boots-04.webp",
    description: "Blush patent with a needle-fine heel and back zip. The softest colour, the sharpest silhouette." },
  { id: "b05", name: "Eleanor", style: "Olive Suede Bootie", category: "boots", price: 720, badge: null, featured: false, isNew: false, image: "images/boots-05.webp",
    description: "Moss-olive suede with antiqued side studs. Earthy tones, elevated intentions." },
  { id: "b06", name: "Fenna", style: "Double-Zip Leather Boot", category: "boots", price: 780, badge: null, featured: false, isNew: false, image: "images/boots-06.webp",
    description: "Twin exposed zips on polished black calf — architectural, minimal, quietly rebellious." },
  { id: "b12", name: "Margaux", style: "Brandy Brogue Boot", category: "boots", price: 810, badge: null, featured: false, isNew: false, image: "images/boots-12.webp",
    description: "Hand-burnished brandy leather with full brogue detailing. Heritage craftsmanship, heirloom future." },
  { id: "b13", name: "Nadia", style: "Noir Western Mid-Boot", category: "boots", price: 1080, badge: "Limited", featured: false, isNew: false, image: "images/boots-13.webp",
    description: "A slouched mid-calf western in jet-black calfskin on an angled heel. The season's cult object." },
  { id: "b15", name: "Klara", style: "Noir Buckle Lug Boot", category: "boots", price: 640, badge: null, featured: false, isNew: false, image: "images/boots-15.webp",
    description: "Black leather cinched with a matte buckle over a commanding lug sole. Armor for beautiful days." },
  { id: "b16", name: "Greta", style: "Ivory Heeled Bootie", category: "boots", price: 920, badge: null, featured: false, isNew: false, image: "images/boots-16.webp",
    description: "A sculpted ivory ankle boot on a slender 90mm heel. Winter white, worn fearlessly." },
  { id: "b19", name: "Ingrid", style: "Patent Combat Boot", category: "boots", price: 660, badge: "New", featured: false, isNew: true, image: "images/boots-19.webp",
    description: "High-shine patent lace-ups on a lugged platform. Combat spirit, couture finish." },
];

const SIZE_CHART = [
  { eu: 35, uk: "2.5", us: "5", cm: "22.1" },
  { eu: 36, uk: "3.5", us: "6", cm: "22.8" },
  { eu: 37, uk: "4", us: "6.5", cm: "23.5" },
  { eu: 38, uk: "5", us: "7.5", cm: "24.1" },
  { eu: 39, uk: "6", us: "8.5", cm: "24.8" },
  { eu: 40, uk: "6.5", us: "9", cm: "25.4" },
  { eu: 41, uk: "7.5", us: "10", cm: "26.1" },
  { eu: 42, uk: "8", us: "10.5", cm: "26.7" },
];
