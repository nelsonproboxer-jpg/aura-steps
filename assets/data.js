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

/* Displayed-currency options. Product prices above are authored in USD; the
   live USD→GBP rate is fetched daily, with this fallback if it's unreachable. */
const CURRENCIES = {
  USD: { symbol: "$", locale: "en-US" },
  GBP: { symbol: "£", locale: "en-GB" },
};
const FX_FALLBACK = { USD: 1, GBP: 0.74 };

/* ---- Card payments (Flutterwave) — LIVE ----
   This is the LIVE key: real cards are charged real money and settle to the
   Flutterwave account. Charges in the currency the shopper is viewing
   (USD/GBP). (Previous test key was FLWPUBK_TEST-2eeff863…) */
const FLUTTERWAVE_PUBLIC_KEY = "FLWPUBK-517210b9026b079da04ef24fc3c3ba29-X";
const FREE_SHIPPING_OVER = 500;
const SHIPPING_FLAT = 40;

/* Orders are emailed here via FormSubmit — no signup, no API key. On the
   first order it sends a one-time activation email to this address; click
   the link once and every future order lands in this inbox. */
const ORDER_EMAIL = "ugwunelson0@gmail.com";

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
  { id: "h01", name: "Celeste", style: "Ivory Leather Pump", category: "heels", price: 745, badge: null, featured: true, isNew: false, image: "images/heels-01.webp",
    description: "A timeless ivory pump with a sculpted almond toe and a graceful 90mm stiletto. The quiet centrepiece of any wardrobe." },
  { id: "h02", name: "Fiorella", style: "Azure Floral Stiletto", category: "heels", price: 1150, badge: "New", featured: false, isNew: true, image: "images/heels-02.webp",
    description: "Hand-finished floral satin over a razor-fine stiletto. A wearable work of art for evenings that matter." },
  { id: "h04", name: "Bianca", style: "Porcelain Patent Stiletto", category: "heels", price: 820, badge: null, featured: false, isNew: false, image: "images/heels-04.webp",
    description: "A single-seam porcelain stiletto polished to a soft glow. Bridal-worthy, boardroom-ready." },
  { id: "h07", name: "Marlowe", style: "Classic Noir Pump", category: "heels", price: 695, badge: null, featured: false, isNew: false, image: "images/heels-07.webp",
    description: "Our signature black pump on a 100mm stiletto — the piece stylists call the little black dress of footwear." },
  { id: "h13", name: "Giselle", style: "Blush Ankle-Strap Sandal", category: "heels", price: 780, badge: null, featured: false, isNew: false, image: "images/heels-13.webp",
    description: "A ballet-blush heeled sandal with a delicate bow and slender ankle strap. Romance, engineered." },
  { id: "h16", name: "Delphine", style: "Scarlet Lace-Up Sandal", category: "heels", price: 875, badge: null, featured: false, isNew: false, image: "images/heels-16.webp",
    description: "Scarlet suede with ribbon lacing that wraps the ankle. Bold by design, comfortable by obsession." },
  { id: "h20", name: "Mirabel", style: "Rouge Patent Platform", category: "heels", price: 1020, badge: "Bestseller", featured: true, isNew: false, image: "images/heels-20.webp",
    description: "High-gloss rouge patent on a dramatic lace-front platform. Not for the faint of heart." },
  { id: "h24", name: "Thea", style: "Raspberry Velvet Pump", category: "heels", price: 795, badge: null, featured: false, isNew: false, image: "images/heels-24.webp",
    description: "Crushed raspberry velvet that deepens by candlelight. Winter's most romantic shoe." },
  { id: "h25", name: "Seraphina", style: "Caramel Slingback Kitten", category: "heels", price: 760, badge: null, featured: false, isNew: false, image: "images/heels-25.webp",
    description: "Toffee-toned leather with a crossed slingback strap on a poised kitten heel. Everyday elegance, elevated." },
  { id: "h26", name: "Ophelia", style: "Noir Mesh Sandal", category: "heels", price: 980, badge: null, featured: false, isNew: false, image: "images/heels-26.webp",
    description: "Sheer mesh panels and velvet straps on a soaring stiletto. After-dark architecture for the ankle upward." },
  { id: "h27", name: "Odette", style: "Peach Crystal Platform", category: "heels", price: 1240, badge: "Bestseller", featured: true, isNew: false, image: "images/heels-27.webp",
    description: "A peep-toe platform scattered with crystals over peach patent. Red-carpet stamina, all-night grace." },
  { id: "h28", name: "Vesper", style: "Navy Croc Platform Mule", category: "heels", price: 890, badge: "Limited", featured: false, isNew: true, image: "images/heels-28.webp",
    description: "Croc-embossed navy leather on a stacked wooden platform. The statement mule of the season." },
  { id: "h29", name: "Juliette", style: "Pearl Strap Mule", category: "heels", price: 915, badge: null, featured: false, isNew: true, image: "images/heels-29.webp",
    description: "A pointed white mule crowned with a strand of pearls. Bridal by birth, cocktail by nature." },
  { id: "h30", name: "Priya", style: "Rouge Block Pump", category: "heels", price: 860, badge: null, featured: false, isNew: false, image: "images/heels-30.webp",
    description: "Liquid-red patent on a confident block heel. Power dressing, distilled to one shoe." },

  // ---------- FLATS (9) ----------
  { id: "f01", name: "Aria", style: "Marigold Pointed Flat", category: "flats", price: 520, badge: null, featured: false, isNew: false, image: "images/flats-01.webp",
    description: "A sun-drenched marigold flat with a sharp pointed toe. Instant polish, zero compromise." },
  { id: "f04", name: "Dahlia", style: "Saffron Kiltie Moccasin", category: "flats", price: 560, badge: null, featured: false, isNew: false, image: "images/flats-04.webp",
    description: "Saffron suede with a fringed kiltie and hand-tied bow. Driving-shoe comfort, runway warmth." },
  { id: "f05", name: "Esme", style: "Cognac Horsebit Loafer", category: "flats", price: 675, badge: null, featured: false, isNew: false, image: "images/flats-05.webp",
    description: "Burnished cognac calfskin with polished hardware. The loafer that outlives trends." },
  { id: "f07", name: "Hazel", style: "Camel Suede Loafer", category: "flats", price: 610, badge: null, featured: false, isNew: false, image: "images/flats-07.webp",
    description: "Camel suede with a slim gilt bit. Quiet luxury for loud calendars." },
  { id: "f12", name: "Nova", style: "Blush Perforated Brogue", category: "flats", price: 540, badge: null, featured: false, isNew: false, image: "images/flats-12.webp",
    description: "Blush perforated leather with a gilded sole line. The sneaker-flat hybrid your mornings deserve." },
  { id: "f13", name: "Lena", style: "Peach Bow Ballerina", category: "flats", price: 560, badge: null, featured: false, isNew: true, image: "images/flats-13.webp",
    description: "Petal-pink satin with a double bow at the pointed toe. The ballerina flat, en pointe." },
  { id: "f14", name: "Camille", style: "Plum Pointed Flat", category: "flats", price: 640, badge: "New", featured: false, isNew: true, image: "images/flats-14.webp",
    description: "Deep plum microsuede with a clean pointed profile. The unexpected neutral that goes with everything." },
  { id: "f16", name: "Gaia", style: "Silver Lace Flat", category: "flats", price: 698, badge: null, featured: false, isNew: false, image: "images/flats-16.webp",
    description: "Metallic lace over a satin-lined flat. Occasionwear that keeps up with the dance floor." },
  { id: "f17", name: "Iris", style: "Noir Brogue Oxford", category: "flats", price: 495, badge: null, featured: false, isNew: false, image: "images/flats-17.webp",
    description: "A classic black brogue oxford, broken-in soft. Heritage tailoring for her." },

  // ---------- BOOTS (9) ----------
  { id: "b01", name: "Isolde", style: "Noir Stiletto Ankle Boot", category: "boots", price: 1150, badge: "Bestseller", featured: true, isNew: false, image: "images/boots-01.webp",
    description: "A razor-sharp stiletto ankle boot in smooth black calfskin. The definition of after-dark authority." },
  { id: "b04", name: "Cordelia", style: "Blush Patent Ankle Boot", category: "boots", price: 1060, badge: "New", featured: false, isNew: true, image: "images/boots-04.webp",
    description: "Blush patent with a needle-fine heel and back zip. The softest colour, the sharpest silhouette." },
  { id: "b05", name: "Eleanor", style: "Olive Suede Bootie", category: "boots", price: 920, badge: null, featured: false, isNew: false, image: "images/boots-05.webp",
    description: "Moss-olive suede with antiqued side studs. Earthy tones, elevated intentions." },
  { id: "b06", name: "Fenna", style: "Double-Zip Leather Boot", category: "boots", price: 980, badge: null, featured: false, isNew: false, image: "images/boots-06.webp",
    description: "Twin exposed zips on polished black calf — architectural, minimal, quietly rebellious." },
  { id: "b12", name: "Margaux", style: "Brandy Brogue Boot", category: "boots", price: 1010, badge: null, featured: false, isNew: false, image: "images/boots-12.webp",
    description: "Hand-burnished brandy leather with full brogue detailing. Heritage craftsmanship, heirloom future." },
  { id: "b13", name: "Nadia", style: "Noir Western Mid-Boot", category: "boots", price: 1280, badge: "Limited", featured: false, isNew: false, image: "images/boots-13.webp",
    description: "A slouched mid-calf western in jet-black calfskin on an angled heel. The season's cult object." },
  { id: "b15", name: "Klara", style: "Noir Buckle Lug Boot", category: "boots", price: 840, badge: null, featured: false, isNew: false, image: "images/boots-15.webp",
    description: "Black leather cinched with a matte buckle over a commanding lug sole. Armor for beautiful days." },
  { id: "b16", name: "Greta", style: "Ivory Heeled Bootie", category: "boots", price: 1120, badge: null, featured: false, isNew: false, image: "images/boots-16.webp",
    description: "A sculpted ivory ankle boot on a slender 90mm heel. Winter white, worn fearlessly." },
  { id: "b19", name: "Ingrid", style: "Patent Combat Boot", category: "boots", price: 860, badge: "New", featured: false, isNew: true, image: "images/boots-19.webp",
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
