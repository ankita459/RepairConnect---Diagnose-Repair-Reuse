import { ItemCategory, ProactiveMaintenanceTip } from '../types';

export const PROACTIVE_MAINTENANCE_TIPS: ProactiveMaintenanceTip[] = [
  // HOME APPLIANCES
  {
    id: 'pm-ha-1',
    category: 'home_appliances',
    title: 'Washing Machine Drum Seal & Drain Pump Lint Trap Debris Clearout',
    frequency: 'Monthly',
    impact: 'High Impact',
    lifeExtensionEstimate: '+4-6 Years',
    description:
      'Coins, hairpins, and lint collect in the bottom drain pump filter, causing water stagnation, bearing wear, and pump motor burnout. Door rubber gaskets also accumulate mildew and detergent scum.',
    actionChecklist: [
      'Unscrew lower front access panel and place a shallow tray underneath.',
      'Unscrew the drain filter cap slowly, drain excess water, and remove trapped debris (coins, threads, buttons).',
      'Wipe down the rubber door boot gasket with a 1:1 mixture of warm water and white vinegar.',
      'Run a hot 60°C/90°C tub-clean wash cycle once a month with oxygen bleach or descaler powder.',
      'Leave door and detergent drawer slightly ajar between washes to prevent mold spores.',
    ],
    commonFailuresPrevented: [
      'Drain pump motor seizure (Error E18/OE)',
      'Drum bearing rust and violent spin noise',
      'Mildew odors and fabric staining',
      'Door bellows gasket tearing and floor flooding',
    ],
    toolsNeeded: ['Shallow tray or towel', 'Microfiber cloth', 'Soft nylon brush'],
    proWarning: 'Ensure the washing machine is disconnected from main power and water is drained before opening the filter.',
  },
  {
    id: 'pm-ha-2',
    category: 'home_appliances',
    title: 'Refrigerator Condenser Coil Vacuuming & Magnetic Door Gasket Inspection',
    frequency: 'Bi-annually',
    impact: 'Critical',
    lifeExtensionEstimate: '+5-8 Years',
    description:
      'Dust and pet hair coating the rear or bottom condenser coils force the compressor to run 30-50% longer, causing premature compressor burnout, excessive electricity bills, and poor cooling.',
    actionChecklist: [
      'Pull refrigerator forward and unplug from wall socket.',
      'Locate coils behind rear grille or underneath bottom toe-kick panel.',
      'Use a narrow vacuum brush attachment and flexible coil brush to gently remove all dust mats.',
      'Test the magnetic door gasket using the dollar bill test: insert bill in door; if it slips out freely, gasket seal is degraded.',
      'Clean gasket seals with warm soapy water and wipe dry (avoid petroleum-based cleaners).',
    ],
    commonFailuresPrevented: [
      'Compressor overheating and sudden lock-up',
      'Thermostat short-cycling and defrost heater strain',
      '30%+ higher energy consumption',
      'Internal frost buildup and spoiled perishable foods',
    ],
    toolsNeeded: ['Vacuum cleaner with hose attachment', 'Coil cleaning brush', 'Clean cotton towel'],
    proWarning: 'Do not bend copper coolant tubes or puncture aluminum fins while brushing.',
  },
  {
    id: 'pm-ha-3',
    category: 'home_appliances',
    title: 'Air Conditioner Filter Wash, Evaporator Fin Straightening & Condensate Drain Flush',
    frequency: 'Monthly',
    impact: 'High Impact',
    lifeExtensionEstimate: '+3-5 Years',
    description:
      'Clogged AC mesh filters reduce airflow, forcing the blower motor to strain and causing the evaporator coils to freeze up into a block of solid ice.',
    actionChecklist: [
      'Pop open front fascia panel and slide out reusable nylon mesh filters.',
      'Rinse with mild tap water from the clean side outwards, and air-dry in shade completely.',
      'Pour 1 cup of 50/50 vinegar and warm water into condensate drain tray to dissolve algae slime.',
      'Inspect outdoor unit (ODU) clearances — ensure at least 2 feet of clear space around fins.',
      'Inspect evaporator fins for bent sections and realign with a fin comb if necessary.',
    ],
    commonFailuresPrevented: [
      'Evaporator coil freezing and water leaking on indoor walls',
      'Blower fan motor capacitor burnout',
      'Bacterial growth and musty room air',
      'Compressor high-pressure trip',
    ],
    toolsNeeded: ['Fin comb', 'Dilute vinegar solution', 'Soft spray bottle'],
  },

  // ELECTRONICS
  {
    id: 'pm-el-1',
    category: 'electronics',
    title: 'Thermal Ventilation Clearance, Dust Deposition Purge & Port Strain Relief',
    frequency: 'Quarterly',
    impact: 'High Impact',
    lifeExtensionEstimate: '+3-5 Years',
    description:
      'Smart TVs, AV amplifiers, receivers, and gaming consoles pull airborne dust across heat sinks and electrolytic capacitors, triggering dry solder joints and thermal shutdown.',
    actionChecklist: [
      'Ensure at least 3 to 4 inches of open breathing room around all top, side, and rear vents.',
      'Use compressed air in short bursts to blow out dust from ventilation slots without spinning internal fans aggressively.',
      'Support heavy HDMI/DisplayPort and optical cables with velcro ties to prevent physical PCB port shearing.',
      'Wipe display panels only with a dry or lightly dampened optical microfiber cloth (never spray glass cleaner or alcohol directly on screens).',
    ],
    commonFailuresPrevented: [
      'Power supply board capacitor bulging and electrolytic drying',
      'Mainboard BGA solder micro-cracks from heat expansion',
      'HDMI port connector fracture and loose video sync',
      'Anti-glare screen coating delamination',
    ],
    toolsNeeded: ['Can of compressed air', 'Optical microfiber cloth', 'Velcro cable management straps'],
    proWarning: 'Always unplug audio equipment and TV monitors from mains power before air-purging dust.',
  },
  {
    id: 'pm-el-2',
    category: 'electronics',
    title: 'Surge Protection, Neutral-Earth Voltage Verification & Master Shutdown',
    frequency: 'As Needed',
    impact: 'Critical',
    lifeExtensionEstimate: '+4-7 Years',
    description:
      'Subtle voltage spikes, grid fluctuations, and lightning transients degrade sensitive microcontrollers and switch-mode power supplies over time.',
    actionChecklist: [
      'Connect all delicate electronics to an MOV-based surge protector with a minimum rating of 1000 Joules.',
      'Verify that the surge protector "Grounded / Protected" green indicator light is illuminated.',
      'Avoid running high-draw heating appliances (microwaves, geysers, irons) on the same circuit branch as home entertainment gear.',
      'Use a master power strip switch during prolonged monsoon or thunderstorm seasons.',
    ],
    commonFailuresPrevented: [
      'Power supply board MOSFET and bridge rectifier blowout',
      'Microcontroller memory corruption',
      'Ghost turning on/off and HDMI handshake failures',
    ],
    toolsNeeded: ['MOV Surge Protector Spike Guard', 'Socket polarity/grounding tester'],
  },

  // COMPUTERS & LAPTOPS
  {
    id: 'pm-comp-1',
    category: 'computers_laptops',
    title: 'Heatsink Thermal Paste Refresh, Fan Bearing De-linting & Airway Purge',
    frequency: 'Annual',
    impact: 'Critical',
    lifeExtensionEstimate: '+3-5 Years',
    description:
      'Factory thermal paste dries out into chalk within 2-3 years. Coupled with lint blankets across radiator exhaust fins, CPU/GPU temperatures reach 95°C+ causing severe throttling and motherboard delamination.',
    actionChecklist: [
      'Remove laptop bottom chassis screws with correct precision bit (Pentalobe/Torx/Phillips) and disconnect battery first.',
      'Hold fan rotor steady with a toothpick while blowing compressed air to prevent bearing overdrive.',
      'If temps exceed 85°C at idle, remove copper heatsink assembly, clean off dried paste using 99% isopropyl alcohol, and apply fresh non-conductive thermal compound.',
      'Reseat heatsink screws in diagonal numbered cross-pattern to ensure even core pressure.',
      'Inspect laptop hinge anchor screws and tighten brass standoff nuts gently to prevent chassis cracking.',
    ],
    commonFailuresPrevented: [
      'CPU/GPU thermal throttling and sudden shutdown under load',
      'GPU BGA solder fracture (blank screen on boot)',
      'Hinge blowout and display bezel snapping',
      'High-pitched fan bearing grinding noise',
    ],
    toolsNeeded: ['Precision screwdriver kit', '99% Isopropyl Alcohol', 'High-performance thermal compound', 'Compressed air'],
    proWarning: 'Disconnect internal battery immediately upon opening chassis before touching heatsink or RAM.',
  },
  {
    id: 'pm-comp-2',
    category: 'computers_laptops',
    title: 'Battery Health Charge Limiting (80% Cap), Cycle Calibration & Port Hygiene',
    frequency: 'Monthly',
    impact: 'High Impact',
    lifeExtensionEstimate: '+2-4 Years',
    description:
      'Keeping laptop batteries plugged in at 100% state-of-charge in high ambient temperatures accelerates lithium electrolyte oxidation, leading to internal gas expansion (swollen battery pillows).',
    actionChecklist: [
      'Enable OEM Battery Health Management (e.g. Dell Command, Lenovo Vantage, ASUS Battery Care, Mac Optimized Charging) to cap charge at 80% if mostly used plugged in.',
      'Once every 2-3 months, run battery down to 15% and charge back to 100% to calibrate state-of-charge sensor.',
      'Inspect USB-C charging port under bright flashlight and remove compacted lint with a wooden/plastic toothpick.',
      'Never use laptop directly on soft blankets, mattresses, or plush pillows that block intake vents.',
    ],
    commonFailuresPrevented: [
      'Lithium-ion battery pouch swelling (bending trackpad/chassis)',
      'Premature battery capacity loss (dropping below 70% in under a year)',
      'Intermittent USB-C power delivery disconnection',
    ],
    toolsNeeded: ['Plastic/wooden anti-static pick', 'OEM battery management software'],
  },

  // MOBILE PHONES
  {
    id: 'pm-mob-1',
    category: 'mobile_phones',
    title: 'Charging Port Lint Extraction, Speaker Grille Cleaning & Battery Thermal Hygiene',
    frequency: 'Monthly',
    impact: 'High Impact',
    lifeExtensionEstimate: '+2-3 Years',
    description:
      'Pocket lint compacts deep into USB-C/Lightning charging ports with every cable insertion, preventing full plug seating and triggering false "Moisture Detected" or charging refusal.',
    actionChecklist: [
      'Inspect port with LED flashlight — check if metal cable housing doesn’t seat flush with phone frame.',
      'Use a fine wooden toothpick or plastic interdental brush to gently sweep compacted pocket lint from the port corners (NEVER use metal needles or safety pins).',
      'Dab a tiny bit of poster putty (Blu-Tack) across speaker and earpiece mesh grilles to lift micro-debris without puncturing acoustic membrane.',
      'Avoid fast-charging phone inside heavy rubber cases in direct sunlight or under bed pillows.',
      'Maintain battery level between 20% and 85% to double chemical cycle longevity.',
    ],
    commonFailuresPrevented: [
      'Intermittent charging and loose cable wobble',
      'Port replacement requirement ($50-$100 cost)',
      'Muffled ear speaker calls and mic distortion',
      'Battery dendrite formation and rapid discharge',
    ],
    toolsNeeded: ['Wooden toothpick / plastic pick', 'Adhesive poster putty (Blu-Tack)', 'Microfiber cloth'],
    proWarning: 'Never insert metal needles, paperclips, or conductive pins into charging ports to avoid shorting VBUS pins.',
  },

  // KITCHEN APPLIANCES
  {
    id: 'pm-kit-1',
    category: 'kitchen_appliances',
    title: 'Espresso Machine, Kettle & Steam Iron Citric Acid Descaling Routine',
    frequency: 'Monthly',
    impact: 'Critical',
    lifeExtensionEstimate: '+3-5 Years',
    description:
      'Hard water calcium and magnesium deposits calcify inside heating thermoblocks, solenoids, and fine steam wands, causing pump pressure loss and heating element burnout.',
    actionChecklist: [
      'Dissolve 2 tablespoons of food-grade citric acid powder in 1 liter of warm water (or use specialized descaling fluid).',
      'Fill appliance water reservoir and run half the reservoir through brew head and steam wand.',
      'Turn off machine and allow solution to soak internal boiler passages for 20-30 minutes to dissolve calcification.',
      'Flush remaining solution and run 2 full tanks of fresh filtered water to rinse completely.',
      'Remove and soak portafilter basket, shower screen, and steam tip in hot water with espresso backflush detergent.',
    ],
    commonFailuresPrevented: [
      'Vibration pump seizure from backpressure',
      'Thermoblock element scale overheating and open-circuit burnout',
      'Weak steam wand pressure and fluctuating brew temperature',
      'Internal solenoid valve sticking',
    ],
    toolsNeeded: ['Food-grade citric acid powder', 'Measuring jug', 'Soft brass or nylon brush'],
  },
  {
    id: 'pm-kit-2',
    category: 'kitchen_appliances',
    title: 'Microwave Mica Waveguide Cover Degreasing & Turntable Track Maintenance',
    frequency: 'Monthly',
    impact: 'High Impact',
    lifeExtensionEstimate: '+4-6 Years',
    description:
      'Food grease splatters on the small rectangular mica waveguide cover on the right interior wall. When heated, trapped carbon and grease absorb microwave energy and cause violent electrical arcing/sparks.',
    actionChecklist: [
      'Unplug microwave and inspect the mica waveguide card on the right-hand wall inside the cooking cavity.',
      'Wipe food splatters immediately with a damp soapy cloth — ensure no oily or burnt residue remains.',
      'If mica sheet is charred, burnt, or cracked, replace it immediately (available for ₹100-200) to protect the magnetron.',
      'Wash glass turntable plate and roller ring assembly to prevent motor gear grinding.',
      'Clean door latch hooks and inner perimeter to maintain RF radiation shielding integrity.',
    ],
    commonFailuresPrevented: [
      'Violent electrical sparks and arcing inside cooking cavity',
      'Magnetron tube burnout (expensive repair)',
      'Turntable drive motor gear stripping',
      'Microwave radiation leakage around door seals',
    ],
    toolsNeeded: ['Dishwashing soap', 'Non-abrasive sponge', 'Replacement mica sheet (if charred)'],
    proWarning: 'Never operate microwave empty or with a charred/missing waveguide cover.',
  },
  {
    id: 'pm-kit-3',
    category: 'kitchen_appliances',
    title: 'Mixer-Grinder & Blender Coupling Rubber Bushing & Shaft Lubrication',
    frequency: 'Quarterly',
    impact: 'Medium Impact',
    lifeExtensionEstimate: '+3-5 Years',
    description:
      'Blender jar blades have internal brass/bronze bushings that seize when exposed to wet ground pastes without lubrication, overloading the motor and stripping the rubber drive coupling teeth.',
    actionChecklist: [
      'Apply 2-3 drops of food-grade mineral oil to the blade shaft underside pin every month.',
      'Check rubber/nylon drive coupling teeth on top of the motor base — replace if teeth are rounded or cracked.',
      'Never run mixer/grinder dry or overload beyond 75% jar capacity with heavy viscous mixes.',
      'Check overload protector (OLP) red button on base if unit stops during heavy grinding.',
    ],
    commonFailuresPrevented: [
      'Blade shaft seizure and motor coil burnout',
      'Teeth stripping on motor coupling and jar base',
      'Jar base water leakage through worn seals',
    ],
    toolsNeeded: ['Food-grade mineral oil', 'Replacement rubber coupler (if worn)'],
  },

  // BICYCLES
  {
    id: 'pm-bike-1',
    category: 'bicycles',
    title: 'Drivetrain Degrease, Chain Lubrication & Chain Wear/Stretch Audit',
    frequency: 'Monthly',
    impact: 'High Impact',
    lifeExtensionEstimate: '+5-8 Years',
    description:
      'A dirty, dry, or stretched chain acts as a file, rapidly grinding away cassette sprockets and chainring teeth ($150+ repair). A 0.5% stretched chain must be replaced before it ruins the entire drivetrain.',
    actionChecklist: [
      'Apply citrus-based bike degreaser across chain, cassette, and derailleur jockey wheels; scrub with a stiff brush.',
      'Rinse with low-pressure water and dry completely with a clean rag.',
      'Use a chain wear checker tool: if chain stretch is between 0.5% and 0.75%, replace chain immediately to save cassette.',
      'Apply one drop of quality bicycle lube (wet/dry lube according to weather) per chain link pin.',
      'Spin pedals backwards for 30 seconds to allow lube penetration, then wipe excess lube off exterior plates thoroughly.',
    ],
    commonFailuresPrevented: [
      'Cassette sprocket and chainring teeth shark-finning',
      'Gear slipping under uphill pedaling load',
      'Snapped chain while riding',
      'Rusty stiff links and crunchy pedaling feel',
    ],
    toolsNeeded: ['Chain wear indicator tool', 'Citrus bike degreaser', 'Bicycle chain lubricant', 'Drivetrain brush'],
  },
  {
    id: 'pm-bike-2',
    category: 'bicycles',
    title: 'Tire Pressure Maintenance, Rim Bead Inspection & Spoke Tension Check',
    frequency: 'Weekly',
    impact: 'Medium Impact',
    lifeExtensionEstimate: '+3-5 Years',
    description:
      'Riding on under-inflated tires causes pinch flats, bends aluminum rim sidewalls over potholes, and accelerates rubber sidewall cracking.',
    actionChecklist: [
      'Inflate tires to the recommended PSI stamped on tire sidewall (typically 35-50 PSI for MTB, 80-100 PSI for Road, 50-70 PSI for Hybrid).',
      'Pluck each wheel spoke with a finger — listen for a uniform resonant pitch; tighten loose spokes with a spoke wrench.',
      'Inspect brake pads for embedded aluminum metal shards or wear indicators before they score the wheel rim.',
      'Wipe down disc brake rotors with 99% isopropyl alcohol (never touch rotor braking surface with oily hands).',
    ],
    commonFailuresPrevented: [
      'Pinch flats (snakebite punctures)',
      'Bent wheel rims out of true',
      'Disc brake squeal and contamination',
      'Premature tire casing blowouts',
    ],
    toolsNeeded: ['Floor pump with pressure gauge', 'Spoke wrench', 'Isopropyl alcohol for rotors'],
  },

  // FURNITURE
  {
    id: 'pm-fur-1',
    category: 'furniture',
    title: 'Fastener Torque Audit, Mortise Joint Gluing & Felt Glider Protection',
    frequency: 'Bi-annually',
    impact: 'High Impact',
    lifeExtensionEstimate: '+8-12 Years',
    description:
      'Dining chairs and wooden tables loosen at joint brackets from daily rocking leverage. Once a joint wobbles by 2mm, the dowel/tenon acts as a wedge, splitting expensive solid hardwood.',
    actionChecklist: [
      'Flip chairs and tables upside down to inspect corner brace bolts and Allen screws.',
      'Tighten loose structural bolts with appropriate hex key or screwdriver (do not over-torque into soft particleboard).',
      'If a wooden dowel joint is loose, inject PVA wood glue deep into the joint, clamp tight for 24 hours, and clean squeeze-out.',
      'Replace worn felt pads on chair/table legs to eliminate floor scratching and lateral shear stress on joints.',
      'Rotate sofa seat cushions weekly to ensure even foam compression and spring support.',
    ],
    commonFailuresPrevented: [
      'Splitting chair legs and broken corner tenons',
      'Wobbly dining tables and loose armrests',
      'Hardwood floor gouging and scratching',
      'Sagging sofa spring bottoms',
    ],
    toolsNeeded: ['Hex key / Allen wrench set', 'PVA wood glue', 'Adhesive felt floor protector pads'],
  },
  {
    id: 'pm-fur-2',
    category: 'furniture',
    title: 'Solid Wood Waxing/Oiling & Climate Humidity Moisture Protection',
    frequency: 'Quarterly',
    impact: 'Medium Impact',
    lifeExtensionEstimate: '+6-10 Years',
    description:
      'Natural wood expands and contracts with humidity swings. Dry indoor AC environments strip essential oils, causing checking, surface warping, and finish cracking.',
    actionChecklist: [
      'Apply beeswax polish or natural mineral/linseed oil along the grain with a clean microfiber cloth.',
      'Let sit for 20 minutes, then buff vigorously with a dry cloth to a deep satin sheen.',
      'Keep solid wood furniture away from direct heating ducts, air conditioner blasts, and unshaded window sunlight.',
      'Use coasters and silicone placemats to prevent heat rings and water stain penetration.',
    ],
    commonFailuresPrevented: [
      'Wood checking, splitting, and veneer peeling',
      'White heat moisture rings on lacquer/varnish finishes',
      'UV fading and patchy discoloration',
    ],
    toolsNeeded: ['Natural beeswax / furniture oil', 'Microfiber buffing cloth'],
  },

  // ELECTRICIAN & POWER
  {
    id: 'pm-elec-1',
    category: 'electrician',
    title: 'RCCB/ELCB Earth Leakage Trip Test & Switchboard Terminal Thermal Audit',
    frequency: 'Quarterly',
    impact: 'Critical',
    lifeExtensionEstimate: '+10-15 Years',
    description:
      'Residual Current Circuit Breakers (RCCBs) can freeze mechanically if not tripped periodically. A frozen RCCB fails to disconnect during an electrical shock hazard or earth fault.',
    actionChecklist: [
      'Locate your home distribution board (MCB box) and identify the RCCB/ELCB breaker with the "T" (Test) button.',
      'Press the "Test" button firmly — the breaker lever MUST instantly trip down to the OFF position.',
      'If it trips instantly, flip it back up to ON. If it DOES NOT trip, call a licensed electrician immediately for RCCB replacement.',
      'Visually inspect switchboard cover plates for black scorch marks, buzzing hums, or warm spots.',
      'Ensure heavy loads (geyser, AC) use designated 16A/20A sockets with adequate wire gauge.',
    ],
    commonFailuresPrevented: [
      'Fatal electric shock hazard from appliance chassis leakage',
      'Electrical switchboard arcing fires',
      'Melted socket terminals and plug welding',
      'Unbalanced neutral line voltage surges',
    ],
    toolsNeeded: ['Flashlight', 'Non-contact voltage detector'],
    proWarning: 'Never touch open busbars or stripped live wires inside electrical distribution boards.',
  },

  // PLUMBER & WATER SYSTEMS
  {
    id: 'pm-plumb-1',
    category: 'plumber',
    title: 'Faucet Aerator Descaling, RO Sediment Pre-filter Replacement & Valve Cycling',
    frequency: 'Quarterly',
    impact: 'High Impact',
    lifeExtensionEstimate: '+4-7 Years',
    description:
      'Sediment, sand, and scale clog faucet aerator screens, causing uneven spraying and backpressure on ceramic disc cartridges. Uncycled shutoff valves freeze open from mineral corrosion.',
    actionChecklist: [
      'Unscrew faucet tip aerator by hand or using tape-wrapped pliers.',
      'Disassemble mesh screens and soak in warm white vinegar for 1 hour to dissolve mineral crusts.',
      'Replace water purifier external 5-micron spun polypropylene sediment pre-filter cartridge every 3-4 months.',
      'Fully turn all under-sink and toilet angle stop valves clockwise and counter-clockwise twice a year to prevent calcification lock.',
      'Pour 1/2 cup baking soda followed by 1/2 cup vinegar and boiling water down sink drains to dissolve organic slime without harsh acid.',
    ],
    commonFailuresPrevented: [
      'Ceramic disc faucet cartridge dripping and stiffness',
      'Frozen angle valves that cannot shut off during a pipe burst emergency',
      'RO membrane premature clogging ($40+ saving)',
      'Slow draining sinks and P-trap drain odors',
    ],
    toolsNeeded: ['Adjustable wrench with cloth padding', 'White vinegar', 'Replacement 5-micron spun filter'],
  },

  // OTHER
  {
    id: 'pm-oth-1',
    category: 'other',
    title: 'Universal Fastener Audit, Anti-Corrosion Lubrication & Climate Storage',
    frequency: 'Bi-annually',
    impact: 'High Impact',
    lifeExtensionEstimate: '+3-5 Years',
    description:
      'Mechanical friction, loose fasteners, and atmospheric humidity account for over 70% of premature equipment failures across diverse categories.',
    actionChecklist: [
      'Audit all exterior fasteners, pivot bolts, and hinge pins — tighten to snug fit.',
      'Apply light silicone spray or dry PTFE lubricant to sliding tracks and moving joints.',
      'Store tools and equipment in a dry, ventilated area with silica gel packs to stop rust.',
      'Clean exterior housing with mild soap and inspect power cords for fraying or kinks.',
    ],
    commonFailuresPrevented: [
      'Oxidation, rust binding, and joint seizure',
      'Structural fastener loss from vibration',
      'Cord fraying and internal conductor fatigue',
    ],
    toolsNeeded: ['Multi-bit screwdriver', 'Silicone / PTFE lubricant', 'Microfiber cloth'],
  },
];

/**
 * Get proactive maintenance tips filtered by category
 */
export function getMaintenanceTipsByCategory(category: ItemCategory | 'all'): ProactiveMaintenanceTip[] {
  if (category === 'all') {
    return PROACTIVE_MAINTENANCE_TIPS;
  }
  const filtered = PROACTIVE_MAINTENANCE_TIPS.filter((t) => t.category === category);
  if (filtered.length > 0) return filtered;
  // If specific subcategory has no direct tip, return general/other
  return PROACTIVE_MAINTENANCE_TIPS.filter((t) => t.category === 'other' || t.category === 'home_appliances');
}

/**
 * Search maintenance tips across title, checklist, and common failures
 */
export function searchMaintenanceTips(query: string, category?: ItemCategory | 'all'): ProactiveMaintenanceTip[] {
  let pool = category && category !== 'all' ? getMaintenanceTipsByCategory(category) : PROACTIVE_MAINTENANCE_TIPS;
  if (!query.trim()) return pool;

  const q = query.toLowerCase().trim();
  return pool.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.actionChecklist.some((item) => item.toLowerCase().includes(q)) ||
      t.commonFailuresPrevented.some((f) => f.toLowerCase().includes(q))
  );
}
