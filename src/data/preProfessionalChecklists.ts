import { ItemCategory } from '../types';

export interface PreProChecklistStep {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  safetyWarning: {
    level: 'critical' | 'high' | 'caution';
    hazardType:
      | 'Electrical Shock'
      | 'Water Damage / Flooding'
      | 'Chemical / Burn Hazard'
      | 'Mechanical / Pinch Hazard'
      | 'Lithium Fire / Battery Hazard'
      | 'Data Loss'
      | 'Physical Strain / Tip-Over'
      | 'Glass / Sharp Edge';
    warningText: string;
  };
  toolsNeeded?: string[];
  estimatedMinutes: number;
  proTip?: string;
  verificationQuestion?: string;
}

export interface PreProfessionalChecklist {
  id: string;
  category: ItemCategory;
  taskTitle: string;
  targetItems: string;
  objective: string;
  estimatedPrepTime: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Expert Attention Required';
  requiredPrepTools: string[];
  steps: PreProChecklistStep[];
  technicianHandoffTips: string[];
}

export const PRE_PROFESSIONAL_CHECKLISTS: PreProfessionalChecklist[] = [
  {
    id: 'prep-home-appliances-washing-machine',
    category: 'home_appliances',
    taskTitle: 'Washing Machine / Dryer Pre-Service Preparation',
    targetItems: 'Front Load & Top Load Washing Machines, Tumble Dryers',
    objective:
      'Safely de-energize, drain residual water, isolate water supply lines, and clear a 360-degree perimeter before the technician arrives.',
    estimatedPrepTime: '15-20 mins',
    riskLevel: 'Moderate',
    requiredPrepTools: ['Bucket (5-10L)', 'Towels / Absorbent Rags', 'Flashlight / Phone Light', 'Pen & Paper / Notepad'],
    steps: [
      {
        id: 'wm-step-1',
        stepNumber: 1,
        title: 'Mains Electrical Isolation',
        instruction:
          'Turn off the appliance power switch and completely disconnect the 3-pin heavy-duty plug from the 16A wall outlet. Fasten the power cable away from wet floor areas.',
        safetyWarning: {
          level: 'critical',
          hazardType: 'Electrical Shock',
          warningText:
            'Never touch plugs or power cables with damp hands. Ensure the wall switch is OFF before pulling the plug to prevent arcing.',
        },
        toolsNeeded: ['Dry Hand Towel'],
        estimatedMinutes: 2,
        proTip: 'If the wall outlet is behind the machine and hard to reach, turn off the sub-circuit MCB at the main breaker board.',
        verificationQuestion: 'Is the plug physically disconnected from the wall receptacle?',
      },
      {
        id: 'wm-step-2',
        stepNumber: 2,
        title: 'Water Supply Isolation & Pressure Release',
        instruction:
          'Locate the cold (and hot, if applicable) inlet shutoff taps connected to the braided hoses. Turn the valve handles 90° clockwise until completely closed.',
        safetyWarning: {
          level: 'high',
          hazardType: 'Water Damage / Flooding',
          warningText:
            'Pressurized water can spray forcefully if hoses are unscrewed before shutting the main isolation valve. Keep a towel ready.',
        },
        toolsNeeded: ['Hand Towel'],
        estimatedMinutes: 3,
        proTip: 'Run a brief spin/drain cycle for 5 seconds right after turning off taps to relieve residual line pressure in the inlet valves.',
        verificationQuestion: 'Are both inlet taps completely closed tightly?',
      },
      {
        id: 'wm-step-3',
        stepNumber: 3,
        title: 'Emergency Drain Hose & Coin Trap Evacuation',
        instruction:
          'Open the lower-front service flap. Place a shallow tray or towel beneath. Uncap the small black emergency drain tube to release standing drum water into a bowl, then unscrew the coin trap filter to check for trapped coins or hairpins.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Water Damage / Flooding',
          warningText:
            'If the machine ran a hot cycle recently, the trapped water may be scalding hot (>60°C). Allow at least 30 minutes of cooldown time.',
        },
        toolsNeeded: ['Shallow Pan / Bowl', 'Absorbent Towel'],
        estimatedMinutes: 6,
        proTip: 'Photograph any debris or broken plastic fins retrieved from the coin trap to show the technician.',
        verificationQuestion: 'Has all stagnant water been drained and the filter debris logged?',
      },
      {
        id: 'wm-step-4',
        stepNumber: 4,
        title: 'Clear 3-Foot Clearance Perimeter & Leveling Area',
        instruction:
          'Remove laundry baskets, detergents, or overhead shelving clutter. Ensure at least 3 feet of open clearance in front and 2 feet on both sides so the technician can remove the top lid and rear service panel comfortably.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Physical Strain / Tip-Over',
          warningText:
            'Do not attempt to tilt or slide a heavy 70kg+ washing machine alone without a helper to prevent lumbar spinal strain.',
        },
        toolsNeeded: ['Flashlight'],
        estimatedMinutes: 4,
        proTip: 'Wipe down the rear floor with a dry rag to eliminate slip hazards around the work perimeter.',
        verificationQuestion: 'Is the workspace well-lit and unobstructed around all access sides?',
      },
      {
        id: 'wm-step-5',
        stepNumber: 5,
        title: 'Document Error Code, Noise Audio & Serial Tag',
        instruction:
          'Photograph the rating plate barcode (located inside the door rim or on the rear panel). Write down the exact error code letters (e.g., E03, UE, dE) and note down the exact second the abnormal vibration occurs.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Mechanical / Pinch Hazard',
          warningText:
            'Do not reach inside the drum while testing spin manually if power is reconnected. Keep loose jewelry and hair tied back.',
        },
        toolsNeeded: ['Smartphone Camera', 'Note Pad'],
        estimatedMinutes: 3,
        proTip: 'If the machine produces an intermittent grinding noise, record a 10-second video audio clip before the technician arrives.',
        verificationQuestion: 'Do you have the model number, serial number, and symptom notes ready?',
      },
    ],
    technicianHandoffTips: [
      'Provide the recorded error code log and symptom occurrence timeline.',
      'Show the technician the retrieved debris from the coin filter if applicable.',
      'Inform the technician if you have existing active manufacturer warranty or extended protection.',
    ],
  },
  {
    id: 'prep-mobile-phones-smartphones',
    category: 'mobile_phones',
    taskTitle: 'Smartphone & Tablet Pre-Repair Data & Hardware Prep',
    targetItems: 'Smartphones (iPhone, Android), iPads & Tablets',
    objective:
      'Safely backup sensitive data, disconnect cloud tracking (Find My), remove physical SIM/MicroSD cards, and preserve battery safety prior to disassembly.',
    estimatedPrepTime: '10-15 mins',
    riskLevel: 'Moderate',
    requiredPrepTools: ['SIM Ejector Pin / Paperclip', 'Clean Microfiber Cloth', 'PC / USB Cable or Cloud Backup Wi-Fi'],
    steps: [
      {
        id: 'sp-step-1',
        stepNumber: 1,
        title: 'Comprehensive Cloud / Local Data Backup',
        instruction:
          'Perform a complete device backup via Google One / iCloud or create an encrypted local backup using your PC/Mac. Verify that recent photos, 2FA authenticator tokens, and chats are confirmed backed up.',
        safetyWarning: {
          level: 'high',
          hazardType: 'Data Loss',
          warningText:
            'Hardware repair carries an inherent risk of motherboard resetting, firmware re-flashing, or accidental NAND corruption. Unbacked data cannot be recovered.',
        },
        toolsNeeded: ['Wi-Fi / Backup Drive'],
        estimatedMinutes: 5,
        proTip: 'Export WhatsApp / Signal chats and screenshot your 2FA account setup codes onto a secure second device.',
        verificationQuestion: 'Is the backup timestamp verified as updated within the last 1 hour?',
      },
      {
        id: 'sp-step-2',
        stepNumber: 2,
        title: 'Discharge Battery Below 25% (Lithium Fire Safety)',
        instruction:
          'If the device screen still powers on, allow the battery to drain naturally to under 25% capacity before turning it over to the technician. Do not charge prior to screen or battery replacement.',
        safetyWarning: {
          level: 'critical',
          hazardType: 'Lithium Fire / Battery Hazard',
          warningText:
            'A fully charged lithium-ion battery (80-100%) stores substantial energy and risks thermal runaway or explosive flame if accidentally punctured by prying tools.',
        },
        toolsNeeded: ['None'],
        estimatedMinutes: 2,
        proTip: 'If the battery is already visibly swollen (lifting the back cover), DO NOT press down on it. Handle gently by the outer edges.',
        verificationQuestion: 'Is the device charge level below 25% or powered off?',
      },
      {
        id: 'sp-step-3',
        stepNumber: 3,
        title: 'Disable "Find My" & Device Security Locks',
        instruction:
          'Turn off Apple "Find My" / Google "Find My Device" and remove device passcodes (or activate Samsung "Maintenance Mode" / Xiaomi "Repair Mode") to enable technician hardware diagnostic testing post-repair.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Data Loss',
          warningText:
            'Authorized repair centers cannot perform screen or motherboard calibration if anti-theft cloud activation locks remain engaged.',
        },
        toolsNeeded: ['Device Settings'],
        estimatedMinutes: 3,
        proTip: 'Use built-in "Maintenance Mode" if supported on Android to hide personal photos and banking apps without resetting.',
        verificationQuestion: 'Are activation locks and stolen device protection temporarily suspended?',
      },
      {
        id: 'sp-step-4',
        stepNumber: 4,
        title: 'Eject Physical SIM Card & MicroSD Expansion',
        instruction:
          'Use a standard SIM ejector pin to pop open the SIM tray. Remove your nano-SIM card and any inserted micro-SD memory cards. Place them in a secure card pouch.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Data Loss',
          warningText:
            'Never leave your active SIM card inside a phone handed over for repair to prevent unauthorized cellular authentication or identity hijacking.',
        },
        toolsNeeded: ['SIM Ejector Pin'],
        estimatedMinutes: 2,
        proTip: 'Tape the empty SIM tray back into the phone so it does not get misplaced during workshop transfer.',
        verificationQuestion: 'Have all SIM cards and memory storage chips been removed?',
      },
    ],
    technicianHandoffTips: [
      'Inform the technician if the phone suffered liquid submersion (even if it dried out).',
      'Provide your temporary test unlock PIN or ensure Maintenance Mode is active.',
      'Specify if you require OEM genuine parts or certified Tier-1 aftermarket components.',
    ],
  },
  {
    id: 'prep-electronics-television',
    category: 'electronics',
    taskTitle: 'Smart TV & Audio Equipment Pre-Service Protocol',
    targetItems: 'OLED / QLED / LED 4K TVs, AV Receivers, Amplifiers',
    objective:
      'Safely unmount large display panels, isolate capacitors, label input connections, and protect ultra-thin glass matrices from structural stress.',
    estimatedPrepTime: '15-25 mins',
    riskLevel: 'High',
    requiredPrepTools: ['Soft Blanket / Foam Mat', 'Masking Tape & Marker', 'Phillips #2 Screwdriver', 'Flashlight'],
    steps: [
      {
        id: 'tv-step-1',
        stepNumber: 1,
        title: 'Power Off & 15-Minute Capacitor Dissipation',
        instruction:
          'Power off the TV via the physical button on the panel, then pull the 240V plug from the wall. Wait at least 15 minutes before touching interior chassis ports or wall brackets.',
        safetyWarning: {
          level: 'critical',
          hazardType: 'Electrical Shock',
          warningText:
            'Power supply boards (SMPS) in modern TVs hold massive 400V electrolytic capacitors that retain hazardous residual charges long after being unplugged.',
        },
        toolsNeeded: ['Dry Hands'],
        estimatedMinutes: 15,
        proTip: 'Press and hold the TV’s physical power button for 10 seconds while unplugged to help bleed down residual charge.',
        verificationQuestion: 'Has the TV been unplugged for at least 15 minutes?',
      },
      {
        id: 'tv-step-2',
        stepNumber: 2,
        title: 'Label & Disconnect HDMI, Optical & Aerial Cables',
        instruction:
          'Before disconnecting cables, wrap small strips of masking tape around each cable end and write the port name (e.g., HDMI 1 - eARC, Optical Soundbar, Set-Top Box).',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Electrical Shock',
          warningText:
            'Ensure external antennas or coaxial cables are unscrewed cleanly to prevent static electricity discharge across HDMI transceivers.',
        },
        toolsNeeded: ['Masking Tape', 'Permanent Marker'],
        estimatedMinutes: 4,
        proTip: 'Take a quick high-res photo of the rear I/O panel before unplugging any cable.',
        verificationQuestion: 'Are all external cables labeled and unplugged?',
      },
      {
        id: 'tv-step-3',
        stepNumber: 3,
        title: 'Prepare Flat Padded Staging Surface & Two-Person Lift',
        instruction:
          'Clear a large table or floor area and lay down a clean, thick blanket or original styrofoam. If unmounting from a wall bracket, have two adults lift by the bottom metal bezel—never pinch the thin top OLED panel glass.',
        safetyWarning: {
          level: 'high',
          hazardType: 'Glass / Sharp Edge',
          warningText:
            'OLED and frameless QLED displays are only 4-6mm thin. Uneven twisting or point-pressure on the glass edge causes catastrophic panel cracking.',
        },
        toolsNeeded: ['Thick Soft Blanket', 'Second Adult Helper'],
        estimatedMinutes: 8,
        proTip: 'Lay the TV screen face-down gently onto the blanket, ensuring no remotes, pens, or coins are underneath the panel.',
        verificationQuestion: 'Is the panel resting flat and supported uniformly across its full frame?',
      },
      {
        id: 'tv-step-4',
        stepNumber: 4,
        title: 'Document Screen Artifacts & Backlight Symptoms',
        instruction:
          'Record whether the standby LED blinks in a specific pulse sequence (e.g., Sony 6-blink backlight error code, LG 2-blink power fault). Note if audio is still audible when video is dark.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Electrical Shock',
          warningText:
            'Do not attempt to open the metal back panel with screwdrivers unless you are a certified high-voltage technician.',
        },
        toolsNeeded: ['Smartphone Camera'],
        estimatedMinutes: 3,
        proTip: 'Shine a phone flashlight closely against the dark screen while the TV is powered on. If you see faint images, the problem is backlight LEDs rather than the LCD matrix.',
        verificationQuestion: 'Are the standby LED blink counts and audio test results written down?',
      },
    ],
    technicianHandoffTips: [
      'Provide the TV remote control and original power adapter/cord.',
      'Tell the technician whether the issue began following a thunderstorm or power surge.',
      'Have the original wall-mount screws or desktop pedestal stand available.',
    ],
  },
  {
    id: 'prep-computers-laptops',
    category: 'computers_laptops',
    taskTitle: 'Laptop & Desktop Pre-Service Diagnostic Handoff',
    targetItems: 'MacBooks, Windows Laptops, Custom PC Towers',
    objective:
      'Protect encrypted credentials, preserve solid-state drive health, isolate electrostatic discharge (ESD), and document hardware error codes.',
    estimatedPrepTime: '10-20 mins',
    riskLevel: 'Moderate',
    requiredPrepTools: ['External Backup SSD / Flash Drive', 'Microfiber Cloth', 'Original Charger / Adapter'],
    steps: [
      {
        id: 'pc-step-1',
        stepNumber: 1,
        title: 'Create Guest / Local Admin Account & Backup BitLocker Key',
        instruction:
          'If on Windows, save your 48-digit BitLocker recovery key to your Microsoft account or USB drive. If on macOS, ensure FileVault recovery key is noted. Set up a temporary guest account for repair testing.',
        safetyWarning: {
          level: 'high',
          hazardType: 'Data Loss',
          warningText:
            'Technicians changing motherboards or TPM chips trigger automatic BitLocker lockouts. Without the recovery key, all internal NVMe drive data is permanently inaccessible.',
        },
        toolsNeeded: ['USB Drive'],
        estimatedMinutes: 5,
        proTip: 'Sign out of browser password managers and personal banking profiles before handing over the machine.',
        verificationQuestion: 'Is the BitLocker or FileVault recovery key securely backed up on a separate device?',
      },
      {
        id: 'pc-step-2',
        stepNumber: 2,
        title: 'Discharge Residual Static Electricity & Unplug Charger',
        instruction:
          'Shut down the PC completely (not Sleep mode). Unplug the charging barrel or USB-C PD cable. Touch a grounded metal pipe or appliance case to discharge body static before touching external chassis ports.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Electrical Shock',
          warningText:
            'Static electricity (ESD) as low as 100V can silently destroy motherboard chipset ICs without any visible spark.',
        },
        toolsNeeded: ['None'],
        estimatedMinutes: 2,
        proTip: 'Hold the laptop power button down for 20 seconds while completely unplugged to drain motherboard capacitors.',
        verificationQuestion: 'Is the system fully shut down and static neutralized?',
      },
      {
        id: 'pc-step-3',
        stepNumber: 3,
        title: 'Document Beep Codes, BSOD Stop Codes & Fan Noise',
        instruction:
          'If the PC crashes, note the exact Blue Screen Stop Code (e.g., WHEA_UNCORRECTABLE_ERROR, CRITICAL_PROCESS_DIED). If it fails to boot, count motherboard beep codes or LED diagnostic blinks.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Data Loss',
          warningText:
            'Do not perform continuous forced hard-reboots if you hear metallic clicking from a mechanical HDD.',
        },
        toolsNeeded: ['Smartphone Camera / Notepad'],
        estimatedMinutes: 3,
        proTip: 'Photograph the BSOD screen with your phone camera showing the QR code at the bottom left.',
        verificationQuestion: 'Are the specific diagnostic crash codes logged?',
      },
    ],
    technicianHandoffTips: [
      'Always bring the original OEM AC power supply adapter (many USB-C hubs do not output sufficient diagnostic wattage).',
      'Inform the technician if you have upgraded RAM or storage aftermarket.',
      'Specify if you want the technician to perform thermal paste re-pasting and fan dust blowout.',
    ],
  },
  {
    id: 'prep-kitchen-microwave',
    category: 'kitchen_appliances',
    taskTitle: 'Microwave & Induction Cooktop Pre-Service Safeguards',
    targetItems: 'Countertop & Built-in Microwave Ovens, Induction Cooktops',
    objective:
      'Safely quarantine extreme high-voltage microwave magnetron capacitors, clean food grease residues, and inspect door interlock latches.',
    estimatedPrepTime: '10-15 mins',
    riskLevel: 'Expert Attention Required',
    requiredPrepTools: ['Damp Cloth with Mild Detergent', 'Flashlight', 'Dry Paper Towels'],
    steps: [
      {
        id: 'mw-step-1',
        stepNumber: 1,
        title: 'Unplug Mains Cord 24 Hours in Advance (High Voltage Safety)',
        instruction:
          'Disconnect the microwave plug from the 16A wall outlet. Leave it disconnected for a minimum of 24 hours prior to professional service to allow internal bleed resistors to discharge.',
        safetyWarning: {
          level: 'critical',
          hazardType: 'Electrical Shock',
          warningText:
            'DANGER: High-voltage microwave capacitors hold 2,000V to 4,000V DC at fatal amperages—enough to cause instantaneous cardiac arrest even days after being unplugged. NEVER attempt internal DIY cover removal.',
        },
        toolsNeeded: ['Wall Socket Access'],
        estimatedMinutes: 2,
        proTip: 'Mark the appliance with a piece of tape reading "UNPLUGGED FOR REPAIR - DO NOT RECONNECT".',
        verificationQuestion: 'Has the microwave been isolated and tagged safely?',
      },
      {
        id: 'mw-step-2',
        stepNumber: 2,
        title: 'Remove & Pack Glass Turntable & Roller Ring',
        instruction:
          'Open the door and take out the internal rotating glass turntable tray and plastic roller ring underneath. Wash them gently, dry them, and place them on a soft cloth.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Glass / Sharp Edge',
          warningText:
            'Tempered microwave glass trays are heavy and can chip or shatter if knocked during appliance tilting or transport.',
        },
        toolsNeeded: ['Soft Cloth'],
        estimatedMinutes: 3,
        proTip: 'Pack the turntable separately in bubble wrap if the unit is being transported to an off-site workshop.',
        verificationQuestion: 'Are the glass tray and roller ring safely removed from inside the cavity?',
      },
      {
        id: 'mw-step-3',
        stepNumber: 3,
        title: 'Inspect Waveguide Mica Cover & Door Latch Switches',
        instruction:
          'Look at the small rectangular cardboard/mica sheet on the right inside wall (the waveguide cover). Check if it has dark burn marks, holes, or grease buildup.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Chemical / Burn Hazard',
          warningText:
            'Burnt food spatter on the waveguide mica sheet causes electrical arcing and sparking during microwave operation.',
        },
        toolsNeeded: ['Flashlight'],
        estimatedMinutes: 2,
        proTip: 'Photograph the mica waveguide cover and the dual plastic door latch hooks to show the technician.',
        verificationQuestion: 'Is the condition of the waveguide cover and door latches documented?',
      },
    ],
    technicianHandoffTips: [
      'Describe whether sparking / arcing was observed inside the cavity.',
      'Confirm whether the turntable spins and display counts down even if food stays cold (indicates magnetron/diode failure).',
      'Keep the microwave glass turntable safely stored until repair completion.',
    ],
  },
  {
    id: 'prep-bicycles-drivetrain',
    category: 'bicycles',
    taskTitle: 'Bicycle Drivetrain & Hydraulic Brake Pre-Service Prep',
    targetItems: 'Road, Hybrid, Mountain (MTB), and E-Bikes',
    objective:
      'De-grease chain grime, isolate hydraulic disc rotors from oil contamination, remove sensitive accessories, and lock the bike safely for mechanical service.',
    estimatedPrepTime: '15-20 mins',
    riskLevel: 'Moderate',
    requiredPrepTools: ['Degreaser Spray / Soapy Water', 'Clean Lint-Free Rags', 'Allen / Hex Keys (4/5mm)', 'Latex / Nitrile Gloves'],
    steps: [
      {
        id: 'bike-step-1',
        stepNumber: 1,
        title: 'Remove GPS, Lights, Water Bottles & Battery (E-Bikes)',
        instruction:
          'Unmount headlights, tail lights, bike computers, phone mounts, and saddle bags. If servicing an e-bike, unlock and remove the main lithium battery pack and turn off the handlebar controller.',
        safetyWarning: {
          level: 'high',
          hazardType: 'Lithium Fire / Battery Hazard',
          warningText:
            'E-bike battery keys and terminals should be protected. Never allow metal wrenches to bridge exposed battery charge pins.',
        },
        toolsNeeded: ['Battery Key', 'Clean Pouch'],
        estimatedMinutes: 4,
        proTip: 'Keep accessories in a labeled zip-lock bag so they do not get scratched or lost in the bike workshop.',
        verificationQuestion: 'Are all electronic accessories and lithium batteries removed or secured?',
      },
      {
        id: 'bike-step-2',
        stepNumber: 2,
        title: 'Isolate & Cover Disc Brake Rotors from Oil Contamination',
        instruction:
          'Before wiping or degreasing the chain and cassette, cover both front and rear brake disc rotors with clean paper towels or dedicated rotor covers.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Chemical / Burn Hazard',
          warningText:
            'A single drop of oil, chain lubricant, or degreaser overspray on disc brake pads permanently destroys braking friction and causes catastrophic brake squeal.',
        },
        toolsNeeded: ['Clean Paper Towels / Rubber Bands'],
        estimatedMinutes: 3,
        proTip: 'Use 99% Isopropyl Alcohol (IPA) if you ever need to clean a brake rotor surface directly.',
        verificationQuestion: 'Are brake discs completely shielded from oils and solvents?',
      },
      {
        id: 'bike-step-3',
        stepNumber: 3,
        title: 'Shift Chain to Smallest Cog (Relieve Derailleur Spring Tension)',
        instruction:
          'While lifting the rear wheel and rotating pedals forward, click the gear shifters so the chain rests on the smallest front chainring and smallest rear cog (highest gear).',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Mechanical / Pinch Hazard',
          warningText:
            'Keep fingers and loose clothing far away from moving chain teeth and spinning spokes to avoid severe pinch lacerations.',
        },
        toolsNeeded: ['Bike Stand or Helper'],
        estimatedMinutes: 2,
        proTip: 'Shifting to the smallest cog slackens the derailleur spring, making rear wheel removal and chain measurement effortless.',
        verificationQuestion: 'Is the rear derailleur cage relaxed and chain on the smallest cog?',
      },
    ],
    technicianHandoffTips: [
      'Specify the exact gear combinations where chain skipping or ghost-shifting occurs (e.g. 5th gear under load).',
      'Inform the mechanic when the brake fluid was last bled or pads inspected.',
      'Mention your rider weight and preferred tire pressure PSI preferences.',
    ],
  },
  {
    id: 'prep-plumbing-fixtures',
    category: 'plumber',
    taskTitle: 'Plumbing Fixture & Tap/Pump Pre-Service Isolation',
    targetItems: 'Water Heaters (Geysers), Taps, RO Purifiers, Drain Traps',
    objective:
      'Locate and close shutoff valves, drain residual pressure, catch wastewater safely, and clear access beneath sink enclosures.',
    estimatedPrepTime: '10-15 mins',
    riskLevel: 'Moderate',
    requiredPrepTools: ['Bucket', 'Absorbent Towels / Mop', 'Flashlight', 'Adjustable Wrench'],
    steps: [
      {
        id: 'plumb-step-1',
        stepNumber: 1,
        title: 'Main / Angle Valve Water Isolation',
        instruction:
          'Locate the dedicated quarter-turn angle valve beneath the sink or the main branch valve on the inlet line. Turn it clockwise until firm resistance is reached.',
        safetyWarning: {
          level: 'critical',
          hazardType: 'Water Damage / Flooding',
          warningText:
            'Never exert brute force on old corroded brass angle valves without holding the pipe behind it; twisting corroded pipes can shear the concealed wall joint.',
        },
        toolsNeeded: ['Flashlight'],
        estimatedMinutes: 3,
        proTip: 'If the localized angle valve is seized or stuck, shut off the master overhead tank valve on the roof or terrace.',
        verificationQuestion: 'Is the water supply to the damaged fixture completely halted?',
      },
      {
        id: 'plumb-step-2',
        stepNumber: 2,
        title: 'Open Lowest Tap to Bleed Residual Line Pressure',
        instruction:
          'Open the faucet lever fully over the sink to drain any remaining pressurized water trapped in the copper/CPVC pipe run.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Water Damage / Flooding',
          warningText:
            'In multi-story buildings, residual head pressure can hold several liters of water inside pipe columns.',
        },
        toolsNeeded: ['Bucket under tap'],
        estimatedMinutes: 2,
        proTip: 'Wait until the water flow completely tapers off to zero drips before opening any joint unions.',
        verificationQuestion: 'Has all pressurized water ceased flowing from the fixture?',
      },
      {
        id: 'plumb-step-3',
        stepNumber: 3,
        title: 'De-Energize Electric Water Heater / Geyser Breakers',
        instruction:
          'If servicing an electric water heater or booster pump, switch off the dedicated 20A DP (Double Pole) switch and turn off the miniature circuit breaker (MCB) at the electrical panel.',
        safetyWarning: {
          level: 'critical',
          hazardType: 'Electrical Shock',
          warningText:
            'Water heaters combine 240V electricity directly with grounded water pipes. An active heating element in an emptied tank will dry-burn and explode.',
        },
        toolsNeeded: ['Electrical Sub-Panel Access'],
        estimatedMinutes: 2,
        proTip: 'Allow the tank to cool down for at least 1 hour before the plumber begins draining sediment.',
        verificationQuestion: 'Is the heater breaker confirmed in the OFF position?',
      },
    ],
    technicianHandoffTips: [
      'Point out the location of your main building stopcock and electrical breaker box.',
      'Show where the leakage or water discoloration was first spotted.',
      'Keep old replacement washers or cartridge samples if you have previously attempted repairs.',
    ],
  },
  {
    id: 'prep-furniture-wood',
    category: 'furniture',
    taskTitle: 'Furniture Joint & Recliner Pre-Service Site Prep',
    targetItems: 'Solid Wood Dining Chairs, Tables, Recliners, Sofa Frames',
    objective:
      'Protect hardwood floorings, stabilize loose joinery, catalog hardware screws, and clear a level workshop assembly space.',
    estimatedPrepTime: '10-15 mins',
    riskLevel: 'Low',
    requiredPrepTools: ['Drop Cloth / Cardboard Sheets', 'Zip-lock Bags for Screws', 'Masking Tape', 'Soft Brush'],
    steps: [
      {
        id: 'furn-step-1',
        stepNumber: 1,
        title: 'Lay Floor Protective Matting / Drop Cloth',
        instruction:
          'Spread thick corrugated cardboard sheets or a canvas drop cloth over a 6x6 foot flat floor area to prevent clamps, wood glue drips, and tools from marring your flooring.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Physical Strain / Tip-Over',
          warningText:
            'Avoid slippery plastic tarps on polished tile or hardwood floors which create severe slipping hazards.',
        },
        toolsNeeded: ['Canvas Drop Cloth or Cardboard'],
        estimatedMinutes: 4,
        proTip: 'Tape the perimeter of the drop cloth down with blue painter’s masking tape so it stays taut.',
        verificationQuestion: 'Is the repair work surface fully protected and slip-resistant?',
      },
      {
        id: 'furn-step-2',
        stepNumber: 2,
        title: 'Collect & Bag Loose Dowels, Screws & Broken Splinters',
        instruction:
          'Gather all separated wood fragments, loose tenons, bolt washers, or springs. Place them into a sealed zip-lock bag and tape it securely to the underside of the furniture item.',
        safetyWarning: {
          level: 'caution',
          hazardType: 'Glass / Sharp Edge',
          warningText:
            'Watch out for exposed rusty upholstery staples, protruding nails, or splintered hardwood edges.',
        },
        toolsNeeded: ['Zip-lock Bag', 'Work Gloves'],
        estimatedMinutes: 5,
        proTip: 'Even small wood splinters are vital for a carpenter to seamlessly match grain lines during epoxy clamping.',
        verificationQuestion: 'Are all hardware screws and loose splinters collected together?',
      },
    ],
    technicianHandoffTips: [
      'Inform the carpenter whether the wood is solid timber (Teak, Oak, Sheesham) or engineered MDF/Plywood.',
      'Specify your preferred stain or polyurethane finish sheen (Matte, Satin, Gloss).',
    ],
  },
];

export function getPreProChecklistsByCategory(category: ItemCategory, itemName?: string): PreProfessionalChecklist[] {
  const matches = PRE_PROFESSIONAL_CHECKLISTS.filter((c) => c.category === category);
  if (matches.length > 0) return matches;

  // Fallback generic checklist for other categories
  return [
    {
      id: `prep-generic-${category}`,
      category,
      taskTitle: `General Pre-Service Preparation for ${category.replace('_', ' ')}`,
      targetItems: itemName || 'General Equipment & Appliances',
      objective:
        'Safely de-energize electrical connections, isolate mechanical components, clear the workspace perimeter, and prepare essential symptom documentation for the professional technician.',
      estimatedPrepTime: '10-15 mins',
      riskLevel: 'Moderate',
      requiredPrepTools: ['Flashlight', 'Note Pad & Pen', 'Dry Towel', 'Zip-lock Bag for Screws'],
      steps: [
        {
          id: 'gen-step-1',
          stepNumber: 1,
          title: 'Power & Energy Isolation',
          instruction:
            'Turn off the device power switch and completely disconnect all power cords from the mains electrical socket. If battery operated, remove or isolate the battery.',
          safetyWarning: {
            level: 'critical',
            hazardType: 'Electrical Shock',
            warningText:
              'Always inspect power cables for frayed insulation and ensure power is verified dead before touching internal components.',
          },
          toolsNeeded: ['None'],
          estimatedMinutes: 2,
          proTip: 'Label the power plug with tape so nobody accidentally plugs it in while the unit is open.',
          verificationQuestion: 'Is all electrical power completely disconnected?',
        },
        {
          id: 'gen-step-2',
          stepNumber: 2,
          title: 'Clear Unobstructed 3-Foot Work Perimeter',
          instruction:
            'Clear the surrounding floor or bench area so the visiting technician has immediate, well-lit 360-degree access to all screws and service ports.',
          safetyWarning: {
            level: 'caution',
            hazardType: 'Physical Strain / Tip-Over',
            warningText:
              'Remove trip hazards, loose rugs, and items that could be knocked over during inspection.',
          },
          toolsNeeded: ['Flashlight'],
          estimatedMinutes: 5,
          proTip: 'Ensure good ambient lighting or have an adjustable work lamp ready for the technician.',
          verificationQuestion: 'Is the work zone clean, clear, and well-illuminated?',
        },
        {
          id: 'gen-step-3',
          stepNumber: 3,
          title: 'Document Serial Number, Model Tag & Symptom Timeline',
          instruction:
            'Photograph the rating plate barcode and write down a brief bulleted timeline of when the failure occurred and any strange noises, smells, or error codes observed.',
          safetyWarning: {
            level: 'caution',
            hazardType: 'Data Loss',
            warningText:
              'Clear symptom records prevent misdiagnosis and save valuable billable technician diagnostic time.',
          },
          toolsNeeded: ['Smartphone Camera', 'Note Pad'],
          estimatedMinutes: 3,
          proTip: 'Note whether the issue happens immediately upon power-on or only after 10-15 minutes of use.',
          verificationQuestion: 'Are the model number and symptom notes written down?',
        },
      ],
      technicianHandoffTips: [
        'Have your warranty card or original purchase invoice ready if still under warranty.',
        'Inform the technician if anyone previously attempted DIY repairs.',
        'Ask the technician to provide a written breakdown of parts vs labor costs before proceeding with repairs.',
      ],
    },
  ];
}
