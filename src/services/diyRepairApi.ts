import { DiyRepairGuide, ItemCategory } from '../types';

export const DIY_REPAIR_GUIDES: DiyRepairGuide[] = [
  {
    id: 'diy-washing-machine-drain-pump',
    title: 'How to Clear a Blocked Washing Machine Drain Pump (OE / E20 Error)',
    slug: 'washing-machine-drain-pump-clearing',
    category: 'home_appliances',
    difficulty: 'Beginner',
    estimatedTimeMinutes: 20,
    estimatedSavingsInr: 1200,
    successRate: 96,
    summary:
      'Learn how to safely drain standing water, inspect the coin trap filter, and remove debris or coins jamming the impeller without calling a technician.',
    toolsRequired: [
      'Shallow tray or baking sheet',
      'Old towels',
      'Pliers or needle-nose',
      'Flashlight',
    ],
    materialsOrParts: [
      'Warm soapy water',
      'Old toothbrush for cleaning threads',
    ],
    safetyChecklist: [
      'Unplug the washing machine from the 240V wall socket',
      'Turn off the hot and cold water supply faucets',
      'Allow hot wash water to cool before draining to prevent scalds',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Locate the Lower Access Door',
        instruction:
          'Find the small rectangular flap or kick plate at the front bottom corner of your front-load or top-load washing machine. Use a flathead screwdriver or coin to gently pry it open.',
        proTip: 'Place a folded dry towel directly beneath the flap before opening.',
        durationMinutes: 3,
        toolsUsed: ['Flathead screwdriver'],
        imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
      },
      {
        stepNumber: 2,
        title: 'Drain Residual Water via Emergency Hose',
        instruction:
          'Pull out the small flexible black/grey emergency drain hose. Unplug the plastic stopper and drain all remaining water into your shallow baking tray. Empty the tray as needed until water stops flowing.',
        warning: 'Water may release under moderate pressure if the drum was completely full.',
        durationMinutes: 5,
        toolsUsed: ['Shallow tray', 'Old towels'],
      },
      {
        stepNumber: 3,
        title: 'Unscrew the Large Lint & Coin Trap Filter',
        instruction:
          'Turn the large circular filter handle counter-clockwise. Pull it straight out. Clear out trapped coins, hairpins, bra wires, or lint clumps accumulated inside the housing.',
        proTip: 'Wash the filter cylinder under warm running water with an old toothbrush.',
        durationMinutes: 4,
        toolsUsed: ['Flashlight', 'Old toothbrush'],
      },
      {
        stepNumber: 4,
        title: 'Inspect the Pump Impeller Chamber',
        instruction:
          'Shine your flashlight into the empty pump cavity. Check if the plastic impeller blades rotate smoothly by nudging them with your finger. Remove any tangled thread or wire.',
        warning: 'Ensure the machine is disconnected from power before reaching inside the chamber.',
        durationMinutes: 4,
        toolsUsed: ['Flashlight', 'Needle-nose pliers'],
      },
      {
        stepNumber: 5,
        title: 'Reinstall, Tighten Filter, and Run Test Spin',
        instruction:
          'Align the filter threads and screw it firmly clockwise until tightly locked. Reseat the emergency drain plug and snap the door shut. Plug the machine back in and run a short 3-minute Rinse/Spin cycle to confirm drainage.',
        proTip: 'If water drains with a strong hum and no error code appears, your fix is complete!',
        durationMinutes: 4,
      },
    ],
    videoTutorial: {
      title: 'Fix Washing Machine Won\'t Drain in 5 Minutes (Coin Trap Cleanout)',
      duration: '5:42',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
      channelName: 'Appliance Repair Academy',
      viewsCount: '342K views',
      chapters: [
        { time: '0:00', title: 'Symptoms & Diagnostic Error Codes' },
        { time: '1:15', title: 'Safe Water Drainage Procedure' },
        { time: '2:40', title: 'Removing Coin Trap & Impeller Inspection' },
        { time: '4:20', title: 'Reassembly & Leak-Free Test Cycle' },
      ],
    },
    troubleshootingTips: [
      'If the impeller doesn\'t spin freely after removing all debris, the pump motor winding may be burned and requires pump replacement.',
      'Always ensure the rubber O-ring gasket on the filter cap is seated cleanly to prevent front leaks.',
    ],
    tags: ['Washing Machine', 'Drain Pump', 'OE Error', 'E20 Error', 'Appliances'],
    featured: true,
    communityRating: 4.9,
    reviewsCount: 184,
  },
  {
    id: 'diy-laptop-fan-thermal-paste',
    title: 'How to Clean Laptop Cooling Fans & Reapply Thermal Paste',
    slug: 'laptop-thermal-paste-fan-cleaning',
    category: 'computers_laptops',
    difficulty: 'Intermediate',
    estimatedTimeMinutes: 35,
    estimatedSavingsInr: 1800,
    successRate: 93,
    summary:
      'Eliminate laptop overheating, thermal throttling, and loud fan noise by safely de-dusting the heat-sink fins and applying fresh non-conductive thermal compound.',
    toolsRequired: [
      'Precision Phillips/Torx screwdriver set (PH0, PH00)',
      'Plastic spudger or guitar pick',
      'Anti-static wrist strap or grounding touch',
      'Can of compressed air or soft ESD brush',
    ],
    materialsOrParts: [
      'High-performance Thermal Paste (Arctic MX-4 / Noctua NT-H1)',
      '99% Isopropyl Alcohol (IPA)',
      'Lint-free microfiber cloth or coffee filters',
    ],
    safetyChecklist: [
      'Shut down OS completely (do NOT use sleep or hibernate)',
      'Unplug AC power adapter and disconnect internal battery harness immediately after opening',
      'Discharge personal static electricity by touching a grounded metal surface',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Remove Bottom Chassis Screws & Back Cover',
        instruction:
          'Place the laptop face down on a soft mat. Unscrew all perimeter screws, noting varying lengths. Use a thin plastic pry tool along the chassis seam to pop the clips and lift the panel.',
        proTip: 'Keep screws mapped on a magnetic mat according to their physical positions.',
        durationMinutes: 8,
        toolsUsed: ['Precision screwdriver set', 'Plastic spudger'],
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      },
      {
        stepNumber: 2,
        title: 'Disconnect the Battery Connector',
        instruction:
          'Locate the primary lithium battery pack. Gently slide or lift the multi-pin power connector off the motherboard. Press and hold the power button for 5 seconds to drain remaining capacitors.',
        warning: 'Never use metal tweezers near the battery terminals to prevent short circuits.',
        durationMinutes: 3,
        toolsUsed: ['Plastic spudger'],
      },
      {
        stepNumber: 3,
        title: 'Unscrew Heatsink & Clean Fan Exhaust Grille',
        instruction:
          'Follow the numbered sequence stamped on the copper heat-pipes (e.g. 1 to 4) to loosen screws evenly. Lift the heat-pipe assembly. Blow compressed air through the radiator fins to dislodge dust mats.',
        proTip: 'Hold the fan blades steady with a finger while blowing air to avoid over-spinning the bearings.',
        durationMinutes: 8,
        toolsUsed: ['Compressed air can', 'ESD brush'],
      },
      {
        stepNumber: 4,
        title: 'Remove Old Crusty Paste with 99% Isopropyl Alcohol',
        instruction:
          'Dampen a lint-free wipe with 99% IPA. Gently wipe away dried gray paste from the CPU/GPU silicon dies and copper heatsink contact pads until mirror-shiny.',
        warning: 'Avoid scratching the delicate silicon surface or damaging tiny surface-mount resistors nearby.',
        durationMinutes: 7,
        toolsUsed: ['99% Isopropyl Alcohol', 'Microfiber cloth'],
      },
      {
        stepNumber: 5,
        title: 'Apply Pea-Sized Thermal Paste Dot & Reassemble',
        instruction:
          'Place a small pea or rice-grain sized drop of thermal compound onto the center of the CPU and GPU dies. Lower the heatsink squarely and torque screws in reverse numerical order. Reconnect battery and snap back cover.',
        proTip: 'Tightening in diagonal pairs ensures uniform pressure and zero air pockets.',
        durationMinutes: 9,
        toolsUsed: ['Precision screwdriver set', 'Thermal paste'],
      },
    ],
    videoTutorial: {
      title: 'Laptop Overheating Fix: Deep Clean Fans & Thermal Paste Replacement',
      duration: '9:15',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      channelName: 'TechRepair Mastery',
      viewsCount: '512K views',
      chapters: [
        { time: '0:00', title: 'Thermal Throttling & CPU Temp Monitoring' },
        { time: '2:10', title: 'Safe Back Cover & Battery Disconnect' },
        { time: '4:45', title: 'Cleaning Dust Clogs in Heat Fins' },
        { time: '6:30', title: 'Removing Old Paste & Proper Application' },
        { time: '8:10', title: 'Temperature Benchmark After Repair' },
      ],
    },
    troubleshootingTips: [
      'Use software like HWMonitor or Core Temp to verify that idle temps dropped by 10-25°C under heavy loads.',
      'Never apply conductive liquid metal unless you have extensive delidding experience and conformal coating.',
    ],
    tags: ['Laptop', 'CPU Temp', 'Thermal Paste', 'Fan Noise', 'Computers'],
    featured: true,
    communityRating: 4.85,
    reviewsCount: 220,
  },
  {
    id: 'diy-plumbing-leaky-faucet-cartridge',
    title: 'How to Fix a Dripping Single-Handle Mixer Faucet (Cartridge Replacement)',
    slug: 'leaky-faucet-cartridge-replacement',
    category: 'plumber',
    difficulty: 'Beginner',
    estimatedTimeMinutes: 25,
    estimatedSavingsInr: 800,
    successRate: 98,
    summary:
      'Stop wasted water and annoying sink drip-drip sounds by swapping out the worn ceramic disc cartridge inside your kitchen or bathroom mixer tap.',
    toolsRequired: [
      'Hex / Allen key set (2.5mm or 3mm)',
      'Adjustable crescent wrench',
      'Flathead screwdriver or utility pick',
      'Channel lock pliers',
    ],
    materialsOrParts: [
      'Replacement 35mm or 40mm Ceramic Disc Cartridge',
      'Food-grade silicone plumbers grease',
      'Plumbers PTFE Teflon tape',
    ],
    safetyChecklist: [
      'Turn off the hot and cold angle stop valves under the sink basin',
      'Open the faucet lever fully to relieve line pressure and confirm zero water flow',
      'Plug the sink drain with a stopper to prevent screws from falling down the pipe',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Shut Off Water & Remove Decorative Indicator Cap',
        instruction:
          'Close both shut-off valves under the sink. Use a small knife or flathead pick to pop out the tiny blue/red plastic hot-cold indicator button located on the faucet handle.',
        durationMinutes: 3,
        toolsUsed: ['Flathead pick'],
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      },
      {
        stepNumber: 2,
        title: 'Loosen Handle Set Screw & Remove Lever',
        instruction:
          'Insert the matching Allen wrench into the exposed hole. Turn counter-clockwise 3 to 4 turns to loosen the set screw, then pull the metal handle straight upward.',
        proTip: 'If stuck from mineral deposits, wiggle handle gently while spraying a dash of vinegar.',
        durationMinutes: 5,
        toolsUsed: ['Allen key set'],
      },
      {
        stepNumber: 3,
        title: 'Unscrew Dome Cover & Retaining Brass Bonnet Nut',
        instruction:
          'Unscrew the decorative dome cap by hand. Use an adjustable crescent wrench to grip the large brass bonnet nut and turn counter-clockwise until freed.',
        warning: 'Grip firmly and do not bend the faucet neck while torqueing the nut.',
        durationMinutes: 6,
        toolsUsed: ['Adjustable wrench'],
      },
      {
        stepNumber: 4,
        title: 'Pull Old Cartridge & Clean Valve Housing',
        instruction:
          'Pull the plastic cartridge straight out. Wipe away lime-scale and sediment from the brass valve base using a rag soaked in white vinegar.',
        durationMinutes: 5,
        toolsUsed: ['Microfiber rag', 'White vinegar'],
      },
      {
        stepNumber: 5,
        title: 'Insert New Ceramic Cartridge & Reassemble',
        instruction:
          'Align the two index locator pins on the new cartridge base with the corresponding holes in the brass body. Hand-thread the brass bonnet nut, tighten with wrench, screw dome cap, and secure handle.',
        proTip: 'Turn on water supply slowly and check for dry perimeter seals.',
        durationMinutes: 6,
        toolsUsed: ['Adjustable wrench', 'Allen key'],
      },
    ],
    videoTutorial: {
      title: 'Fix Leaky Sink Faucet in Under 10 Minutes (Step-by-Step)',
      duration: '6:18',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      channelName: 'Home Plumbing Essentials',
      viewsCount: '890K views',
      chapters: [
        { time: '0:00', title: 'Shutting Off Angle Valves' },
        { time: '1:20', title: 'Disassembling Handle & Bonnet Nut' },
        { time: '3:10', title: 'Measuring 35mm vs 40mm Cartridges' },
        { time: '4:50', title: 'Seating Alignment Pins & Testing' },
      ],
    },
    troubleshootingTips: [
      'Take the old cartridge to the hardware store to match the exact diameter (35mm or 40mm) and base prong layout.',
      'Do not overtighten the brass bonnet nut, which can crack the plastic cartridge casing.',
    ],
    tags: ['Plumbing', 'Faucet Leak', 'Cartridge', 'Water Saver', 'Sink'],
    featured: true,
    communityRating: 4.95,
    reviewsCount: 310,
  },
  {
    id: 'diy-smartphone-cracked-screen-replacement',
    title: 'How to Replace a Cracked Smartphone Display & Digitizer Screen',
    slug: 'smartphone-display-replacement',
    category: 'mobile_phones',
    difficulty: 'Advanced',
    estimatedTimeMinutes: 45,
    estimatedSavingsInr: 3500,
    successRate: 88,
    summary:
      'Step-by-step guide to separating adhesive, transferring front-facing camera/sensors, and installing a new OLED/LCD assembly with touch responsiveness.',
    toolsRequired: [
      'Pentalobe / Tri-point / Phillips micro-screwdrivers',
      'Heat gun or high-wattage hairdryer',
      'Heavy-duty suction cup handle',
      'Plastic guitar pick pry tools & ESD tweezers',
    ],
    materialsOrParts: [
      'Replacement Display Screen Assembly (OEM or High-Tier Incell)',
      'Pre-cut waterproof perimeter display adhesive gasket',
      'B-7000 or T-7000 adhesive (if frame bonding required)',
    ],
    safetyChecklist: [
      'Discharge phone battery below 25% before starting to reduce fire risk if punctured',
      'Wear safety glasses to protect eyes against splintering glass fragments',
      'Place clear packing tape over shattered screen to prevent loose glass shards',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Tape Glass & Remove Bottom Pentalobe Screws',
        instruction:
          'Apply clear packing tape over cracked screen. Remove the two micro-screws flanking the charging port using the appropriate pentalobe screwdriver.',
        durationMinutes: 5,
        toolsUsed: ['Pentalobe screwdriver', 'Packing tape'],
        imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      },
      {
        stepNumber: 2,
        title: 'Soften Perimeter Adhesive with Controlled Heat',
        instruction:
          'Heat the perimeter edge of the display with a hairdryer or heat gun on low for 60-90 seconds until warm to the touch (around 70°C).',
        warning: 'Do not overheat the battery center area.',
        durationMinutes: 5,
        toolsUsed: ['Hairdryer / Heat gun'],
      },
      {
        stepNumber: 3,
        title: 'Create Seam Opening with Suction Cup & Slicing Picks',
        instruction:
          'Attach suction cup near bottom edge. Pull firmly while inserting a thin plastic pick into the created gap. Slice carefully through adhesive around edges without inserting more than 3mm deep.',
        proTip: 'Avoid deep pick insertion on the right side where flex cables route.',
        durationMinutes: 10,
        toolsUsed: ['Suction cup', 'Plastic pry picks'],
      },
      {
        stepNumber: 4,
        title: 'Disconnect Battery First, Then Display Ribbon Cables',
        instruction:
          'Open screen like a book (or sideways). Unscrew metal EMI shielding brackets. Disconnect battery connector first with a plastic spudger, then disconnect display and digitizer ribbons.',
        warning: 'Always disconnect the battery connector first to prevent motherboard backlight IC blown fuses.',
        durationMinutes: 8,
        toolsUsed: ['Tri-point screwdriver', 'Plastic spudger'],
      },
      {
        stepNumber: 5,
        title: 'Transfer Sensor Assembly, Connect New Screen & Test',
        instruction:
          'Transfer ear-speaker / proximity sensor assembly to new screen. Connect new display cables, reconnect battery, and power on device to test touch grid, colors, and brightness BEFORE applying final glue gasket.',
        proTip: 'Type across the entire virtual keyboard to verify edge touch response.',
        durationMinutes: 17,
        toolsUsed: ['Tweezers', 'Adhesive gasket'],
      },
    ],
    videoTutorial: {
      title: 'Complete Screen Replacement Guide: Teardown, Sensor Transfer & Re-Sealing',
      duration: '14:20',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      channelName: 'Mobile Fix Lab',
      viewsCount: '720K views',
      chapters: [
        { time: '0:00', title: 'Safety Precautions & Tool Setup' },
        { time: '2:15', title: 'Heating & Frame Separation' },
        { time: '6:30', title: 'Bracket Screws & Battery Isolation' },
        { time: '9:40', title: 'Earpiece & Face Sensor Transfer' },
        { time: '12:10', title: 'Pre-Seal Diagnostic Touch Test' },
      ],
    },
    troubleshootingTips: [
      'If the screen is black after reassembly, perform a hard restart (Volume Up, Volume Down, hold Power).',
      'Keep every single screw in its exact original bracket location—screwing a long screw into a short hole can cause irreversible motherboard trace damage ("long screw damage").',
    ],
    tags: ['Smartphone', 'OLED Display', 'Touch Screen', 'iPhone', 'Android'],
    communityRating: 4.78,
    reviewsCount: 156,
  },
  {
    id: 'diy-bicycle-rear-derailleur-tuning',
    title: 'How to Tune and Index Bicycle Rear Derailleur Shifting',
    slug: 'bicycle-derailleur-tuning-indexing',
    category: 'bicycles',
    difficulty: 'Beginner',
    estimatedTimeMinutes: 20,
    estimatedSavingsInr: 600,
    successRate: 97,
    summary:
      'Eliminate skipped gears, chain clicking, and sluggish shifts by setting high/low limit screws and dialing in cable tension with the barrel adjuster.',
    toolsRequired: [
      'Phillips screwdriver (PH2)',
      '5mm Allen / Hex wrench',
      'Chain lubricant & dry cloth',
    ],
    materialsOrParts: [
      'Dry or wet bicycle chain lube',
      'Replacement derailleur inner cable (optional if frayed)',
    ],
    safetyChecklist: [
      'Elevate bicycle on a work stand or turn bike upside down on protective cardboard',
      'Keep fingers clear of moving chain and cog teeth while pedaling',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect Derailleur Hanger Alignment & Clean Drivetrain',
        instruction:
          'Stand behind the bike and look down the chain line. Ensure the rear derailleur cage is perfectly vertical and not bent inward toward the wheel spokes. Wipe excess grime from cassette cogs.',
        durationMinutes: 4,
        toolsUsed: ['Dry cloth'],
        imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      },
      {
        stepNumber: 2,
        title: 'Set High Limit Screw (H-Screw)',
        instruction:
          'Shift into the highest gear (smallest cog on cassette). Look from behind: the upper derailleur guide pulley should align directly beneath the outer edge of the smallest cog. Turn the "H" screw clockwise to move inward or counter-clockwise to move outward.',
        durationMinutes: 4,
        toolsUsed: ['Phillips screwdriver'],
      },
      {
        stepNumber: 3,
        title: 'Set Low Limit Screw (L-Screw)',
        instruction:
          'Carefully shift into the lowest gear (largest cog). Adjust the "L" screw so the guide pulley aligns directly with the center of the largest cog. This critical limit prevents the chain from throwing into your rear wheel spokes.',
        warning: 'Incorrect L-screw setting can cause chain to jam into spokes and destroy your wheel.',
        durationMinutes: 4,
        toolsUsed: ['Phillips screwdriver'],
      },
      {
        stepNumber: 4,
        title: 'Dial In Shifting Indexing with Barrel Adjuster',
        instruction:
          'Shift one click up. If the chain hesitates to climb to the next larger cog, turn the barrel adjuster counter-clockwise (adding cable tension) in half-turn increments. If it rubs on a higher cog, turn clockwise to release tension.',
        proTip: 'Listen for silent chain rotation on every cog as you pedal.',
        durationMinutes: 5,
        toolsUsed: ['Hand barrel adjuster'],
      },
      {
        stepNumber: 5,
        title: 'Lube Chain and Test Full Gear Range',
        instruction:
          'Apply a single drop of quality bicycle lube to each chain roller. Shift smoothly up and down through the entire cassette range while turning cranks.',
        durationMinutes: 3,
        toolsUsed: ['Chain lube', 'Dry cloth'],
      },
    ],
    videoTutorial: {
      title: 'Bicycle Shifting Made Simple: How to Index Your Gears Perfectly',
      duration: '7:45',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      channelName: 'Park Tool Master Mechanics',
      viewsCount: '1.4M views',
      chapters: [
        { time: '0:00', title: 'Why Gears Skip & Anatomy of Derailleur' },
        { time: '1:45', title: 'Setting H & L Limit Screws' },
        { time: '4:10', title: 'Cable Tension & Barrel Adjuster Tricks' },
        { time: '6:30', title: 'B-Tension Screw & Road Test' },
      ],
    },
    troubleshootingTips: [
      'If tuning works for small cogs but skips on big cogs, your rear derailleur hanger is likely bent and needs straightening with a hanger gauge tool.',
      'Replace rusty or frayed shift cables for effortless light-action clicks.',
    ],
    tags: ['Bicycles', 'Derailleur', 'Gears', 'Chain', 'Cycling'],
    communityRating: 4.92,
    reviewsCount: 280,
  },
  {
    id: 'diy-microwave-thermal-fuse-replacement',
    title: 'How to Replace a Blown Microwave Thermal Fuse or Door Microswitch',
    slug: 'microwave-thermal-fuse-door-switch',
    category: 'kitchen_appliances',
    difficulty: 'Intermediate',
    estimatedTimeMinutes: 30,
    estimatedSavingsInr: 1500,
    successRate: 91,
    summary:
      'Restore power to a completely dead countertop or built-in microwave by testing and replacing the inexpensive ceramic thermal cutoff fuse or door safety interlock switch.',
    toolsRequired: [
      'Security Torx (T20 Security) or Phillips screwdriver',
      'Digital Multimeter (Continuity / Ohms test)',
      'Insulated needle-nose pliers',
      'High-voltage discharge resistor / insulated screwdriver',
    ],
    materialsOrParts: [
      '20A 250V Ceramic Microwave Fuse (6x30mm or 5x20mm)',
      'Primary/Secondary Door Microswitch (KW3A 16A 125/250V)',
    ],
    safetyChecklist: [
      'DANGER: Unplug microwave from wall outlet before removing external sheet metal cover',
      'CRITICAL HIGH VOLTAGE: Always safely discharge the high-voltage capacitor using an insulated discharge tool before touching internal wiring',
      'Never run a microwave with the exterior cabinet cover removed',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Unplug and Remove Outer Cabinet Metal Housing',
        instruction:
          'Unplug the AC power cord. Remove screws along the back and side edges. Slide the sheet metal cover backward and lift it off.',
        warning: 'High voltage capacitor can hold lethal 2000V charge even when unplugged.',
        durationMinutes: 6,
        toolsUsed: ['Security Torx screwdriver'],
        imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
      },
      {
        stepNumber: 2,
        title: 'Safely Discharge the High-Voltage Capacitor',
        instruction:
          'Locate the large cylindrical metal capacitor. Using a 20k ohm 10W resistor with insulated alligator clips (or heavily insulated screwdriver), bridge the terminals to ground chassis to safely bleed charge.',
        durationMinutes: 4,
        toolsUsed: ['Insulated pliers / discharge resistor'],
      },
      {
        stepNumber: 3,
        title: 'Test Main Ceramic Fuse with Multimeter',
        instruction:
          'Locate the main ceramic fuse near the power cord entry terminal board. Set multimeter to Continuity mode (beep). Touch probes to both metal ends of the fuse. A continuous beep indicates a good fuse; silence means it is blown.',
        proTip: 'If the fuse is blown, inspect door switches before replacing—a sticky door switch often trips the fuse on door open.',
        durationMinutes: 6,
        toolsUsed: ['Digital multimeter'],
      },
      {
        stepNumber: 4,
        title: 'Test and Swap Door Interlock Microswitches',
        instruction:
          'Press the door latch mechanism and test continuity on the Normally Open (NO) and Normally Closed (NC) microswitches. If a switch doesn\'t change state on button click, unclip it and replace with a matching rated switch.',
        durationMinutes: 8,
        toolsUsed: ['Insulated pliers', 'Multimeter'],
      },
      {
        stepNumber: 5,
        title: 'Install New Fuse, Secure Cover & Conduct Cup of Water Test',
        instruction:
          'Snap the new ceramic fuse into the clips. Slide the metal cover back into the alignment tracks and re-tighten all screws. Plug in, place a mug of cold water inside, and heat for 30 seconds to verify heating.',
        durationMinutes: 6,
        toolsUsed: ['Screwdriver', 'Mug of water'],
      },
    ],
    videoTutorial: {
      title: 'Microwave Completely Dead? How to Test & Fix Fuse & Door Switches Safely',
      duration: '10:35',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=800&q=80',
      channelName: 'Appliance Electrical Lab',
      viewsCount: '460K views',
      chapters: [
        { time: '0:00', title: 'High Voltage Safety Rules & Capacitor Discharge' },
        { time: '2:40', title: 'Multimeter Continuity Testing for Fuses' },
        { time: '5:15', title: 'Door Switch Mechanism & Short Circuit Prevention' },
        { time: '8:30', title: 'Reassembly & Safety Cup Test' },
      ],
    },
    troubleshootingTips: [
      'Always use a fast-acting ceramic fuse of the EXACT same amperage (usually 20A); never use a standard glass automotive fuse.',
      'If the new fuse blows immediately when closing or opening the door, replace the door interlock switch assembly.',
    ],
    tags: ['Microwave', 'Thermal Fuse', 'Kitchen', 'Door Switch', 'Appliances'],
    communityRating: 4.88,
    reviewsCount: 195,
  },
  {
    id: 'diy-electrician-rewire-grounded-plug',
    title: 'How to Rewire a 3-Pin Grounded Power Plug (Safe Electrical Practice)',
    slug: 'rewire-3-pin-grounded-plug',
    category: 'electrician',
    difficulty: 'Beginner',
    estimatedTimeMinutes: 15,
    estimatedSavingsInr: 450,
    successRate: 99,
    summary:
      'Repair damaged cords on heaters, power tools, or irons by cutting frayed cable ends and wiring a heavy-duty grounded 3-pin plug correctly.',
    toolsRequired: [
      'Wire stripper / utility cutter',
      'Small flathead screwdriver',
      'Small Phillips screwdriver',
    ],
    materialsOrParts: [
      'Heavy-duty 16A or 6A 3-Pin Grounded Replacement Plug',
      'Heat-shrink tubing or electrical tape (optional)',
    ],
    safetyChecklist: [
      'CRITICAL: Ensure the appliance cord is completely unplugged from any wall outlet',
      'Verify the correct wire color standards (Phase/Live = Brown/Red, Neutral = Blue/Black, Earth/Ground = Green/Yellow)',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Disassemble New Plug & Slide Strain Relief Sleeve',
        instruction:
          'Unscrew the center screw on the replacement plug to remove the plastic shell. Loosen the cable clamp (strain relief bracket).',
        durationMinutes: 3,
        toolsUsed: ['Phillips screwdriver'],
        imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
      },
      {
        stepNumber: 2,
        title: 'Strip Outer Insulation & Core Wires',
        instruction:
          'Strip about 35mm of outer PVC jacket from the cord. Strip 8mm of insulation from each of the 3 internal wires (Live, Neutral, Earth). Twist stranded copper strands tightly.',
        proTip: 'Leave the Green/Yellow Earth wire slightly longer than the others so it disconnects last under accidental pull stress.',
        durationMinutes: 4,
        toolsUsed: ['Wire strippers'],
      },
      {
        stepNumber: 3,
        title: 'Connect Wires to Proper Brass Terminals',
        instruction:
          'Connect Earth (Green/Yellow) to the top thick pin terminal (E). Connect Live (Brown or Red) to the right pin terminal (L). Connect Neutral (Blue or Black) to the left pin terminal (N). Tighten terminal screws firmly.',
        warning: 'Ensure no loose stray copper strands touch neighboring terminals.',
        durationMinutes: 4,
        toolsUsed: ['Flathead screwdriver'],
      },
      {
        stepNumber: 4,
        title: 'Secure Strain Relief Clamp & Fasten Outer Shell',
        instruction:
          'Position the cable so the clamp firmly grips the outer PVC jacket (not the individual colored wires). Tighten clamp screws, replace plug cover, and screw tightly.',
        durationMinutes: 4,
        toolsUsed: ['Phillips screwdriver'],
      },
    ],
    videoTutorial: {
      title: 'How to Wire a 3-Pin Plug Safely & Correctly (Live, Neutral, Earth)',
      duration: '4:50',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
      channelName: 'Practical Electrician Guides',
      viewsCount: '1.2M views',
      chapters: [
        { time: '0:00', title: 'Color Code Standards & Plug Anatomy' },
        { time: '1:10', title: 'Stripping & Wire Length Math' },
        { time: '2:45', title: 'Terminal Screwing & Safety Earthing' },
        { time: '4:00', title: 'Strain Relief Clamp Inspection' },
      ],
    },
    troubleshootingTips: [
      'Always test with a plug socket tester before running heavy current appliances like room heaters or water geysers.',
    ],
    tags: ['Electrician', '3-Pin Plug', 'Wiring', 'Safety', 'Power Cord'],
    communityRating: 4.96,
    reviewsCount: 340,
  },
  {
    id: 'diy-furniture-loose-chair-joint-repair',
    title: 'How to Fix Wobbling Wooden Chair Joints (Mortise & Tenon / Dowel Regluing)',
    slug: 'wooden-chair-joint-regluing',
    category: 'furniture',
    difficulty: 'Beginner',
    estimatedTimeMinutes: 30,
    estimatedSavingsInr: 1100,
    successRate: 98,
    summary:
      'Permanently stabilize squeaky or wobbly wooden dining chairs and tables by cleaning out brittle old animal glue and clamping with PVA wood glue.',
    toolsRequired: [
      'Wood chisel or utility scraper',
      'Rubber mallet',
      'Bar clamps or ratchet tie-down strap',
      'Sandpaper (80 and 120 grit)',
    ],
    materialsOrParts: [
      'PVA Wood Glue (Titebond II or Fevicol Marine)',
      'Wet rag for squeeze-out clean-up',
      'Small wooden shims or toothpicks (if tenon loose)',
    ],
    safetyChecklist: [
      'Use a rubber mallet rather than a metal hammer to prevent denting finished wood surfaces',
      'Wipe wet glue squeeze-out immediately before it hardens on the wood varnish',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Disassemble Loose Joint with Rubber Mallet',
        instruction:
          'Tap gently near the loose mortise and tenon joint with a rubber mallet to separate the chair leg or rung from the frame.',
        durationMinutes: 5,
        toolsUsed: ['Rubber mallet'],
        imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
      },
      {
        stepNumber: 2,
        title: 'Scrape Away Brittle Old Dried Glue',
        instruction:
          'Use a scraper or 80-grit sandpaper to remove crystallized old glue from both the tenon tongue and the mortise socket hole until bare wood is exposed.',
        proTip: 'Glue only adheres strongly to fresh, bare wood pores.',
        durationMinutes: 7,
        toolsUsed: ['Chisel / Scraper', 'Sandpaper'],
      },
      {
        stepNumber: 3,
        title: 'Apply Generous PVA Wood Glue & Re-seat',
        instruction:
          'Coat the inside of the hole and the tenon with quality wood glue. If the socket has worn loose over time, insert 1-2 glue-coated wooden toothpicks to take up slack. Press together.',
        durationMinutes: 6,
        toolsUsed: ['PVA wood glue'],
      },
      {
        stepNumber: 4,
        title: 'Apply Bar Clamp / Ratchet Strap & Wipe Squeeze-out',
        instruction:
          'Wrap a ratchet strap around all four chair legs or apply bar clamps. Tighten until the joint pulls fully home. Wipe away excess glue with a damp warm rag. Leave clamped for 6-12 hours.',
        durationMinutes: 8,
        toolsUsed: ['Ratchet strap / Bar clamps', 'Damp rag'],
      },
    ],
    videoTutorial: {
      title: 'How to Fix a Wobbly Wooden Chair Stronger than New',
      duration: '8:12',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
      channelName: 'Woodworking Restoration Tips',
      viewsCount: '630K views',
      chapters: [
        { time: '0:00', title: 'Why Chairs Wiggle & Old Glue Breakdown' },
        { time: '2:10', title: 'Cleaning Tenon & Mortise Pockets' },
        { time: '4:30', title: 'Filling Gaps & Applying PVA Glue' },
        { time: '6:15', title: 'Ratchet Strap Clamping Technique' },
      ],
    },
    troubleshootingTips: [
      'Ensure the chair rests on a completely flat surface while clamping so all four legs touch the ground evenly.',
    ],
    tags: ['Furniture', 'Wood Repair', 'Chair', 'Joinery', 'Clamping'],
    communityRating: 4.9,
    reviewsCount: 165,
  },
  {
    id: 'diy-electronics-headphone-jack-resoldering',
    title: 'How to Repair a Broken 3.5mm Headphone Jack Cable (Re-soldering Audio Plug)',
    slug: 'headphone-jack-audio-cable-repair',
    category: 'electronics',
    difficulty: 'Intermediate',
    estimatedTimeMinutes: 25,
    estimatedSavingsInr: 900,
    successRate: 92,
    summary:
      'Fix cutting audio, mono-only sound, or crackling in premium studio headphones by stripping fine enamel wires and soldering a replacement 3.5mm gold-plated jack.',
    toolsRequired: [
      'Soldering iron (25W-40W) & solder wire with rosin core',
      'Wire cutters & lighter/flame (for burning enamel coating)',
      'Helping hands tool or small vise',
      'Multimeter (for pin continuity test)',
    ],
    materialsOrParts: [
      'Replacement 3.5mm 3-Pole (TRS) or 4-Pole (TRRS) Metal Audio Jack',
      'Small piece of heat-shrink tubing',
    ],
    safetyChecklist: [
      'Work in a well-ventilated area to avoid inhaling soldering flux fumes',
      'Rest soldering iron on a secure metal stand when not actively heating',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Cut Damaged Wire & Slide On Jack Shell & Heat-Shrink',
        instruction:
          'Cut the cable 2cm above the broken molded plug. Slide the replacement jack\'s screw-on metal barrel and heat-shrink tubing onto the wire FIRST before doing any soldering.',
        warning: 'Forgetting to slide the sleeve first is the most common DIY mistake!',
        durationMinutes: 3,
        toolsUsed: ['Wire cutters', 'Heat-shrink tubing'],
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      },
      {
        stepNumber: 2,
        title: 'Strip Wire & Burn Enamel Insulation Coating',
        instruction:
          'Strip 15mm of outer jacket. Separate the colored enamel copper threads (Green = Left Audio, Red = Right Audio, Copper/Bare = Ground, Striped = Mic if 4-pole). Quickly touch the wire tips with a lighter flame for 1 second to burn off the enamel coating.',
        durationMinutes: 5,
        toolsUsed: ['Lighter / Flame', 'Sandpaper'],
      },
      {
        stepNumber: 3,
        title: 'Tin Wires & Solder to Jack Lugs',
        instruction:
          'Apply solder flux and tin the bare wire tips with a dab of solder. Solder Left (Green) to the short tip lug, Right (Red) to the medium ring lug, and Ground (Bare) to the long sleeve bracket.',
        durationMinutes: 8,
        toolsUsed: ['Soldering iron', 'Helping hands tool'],
      },
      {
        stepNumber: 4,
        title: 'Test Audio Channels & Shrink Wrap Shell',
        instruction:
          'Plug into an audio device and play a Left/Right stereo audio test. Once verified, crimp the strain relief bracket, shrink the tubing with gentle heat, and screw the metal barrel shut.',
        durationMinutes: 5,
        toolsUsed: ['Heat gun / Lighter'],
      },
    ],
    videoTutorial: {
      title: 'Fix Any Headphone Jack in 5 Minutes (Soldering 3.5mm TRS Audio Plug)',
      duration: '6:50',
      youtubeEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      channelName: 'Audio Geek Repair DIY',
      viewsCount: '980K views',
      chapters: [
        { time: '0:00', title: 'TRS vs TRRS Pinouts & Color Schemes' },
        { time: '1:50', title: 'Burning Enamel Coating Correctly' },
        { time: '3:30', title: 'Tinning & Soldering to Small Solder Tabs' },
        { time: '5:20', title: 'Strain Relief Crimping & Final Test' },
      ],
    },
    troubleshootingTips: [
      'If sound plays in mono, check that the Left and Right solder terminals aren\'t accidentally bridged with extra solder.',
    ],
    tags: ['Electronics', 'Headphones', 'Soldering', 'Audio Jack', '3.5mm'],
    communityRating: 4.84,
    reviewsCount: 204,
  },
];

/**
 * Simulated API layer with latency simulation to fetch DIY guides
 */
export async function fetchDiyRepairGuides(
  category?: ItemCategory | 'all',
  searchQuery?: string,
  difficulty?: string
): Promise<DiyRepairGuide[]> {
  // Simulate network latency (250-450ms)
  await new Promise((resolve) => setTimeout(resolve, 320));

  let results = [...DIY_REPAIR_GUIDES];

  if (category && category !== 'all') {
    results = results.filter((g) => g.category === category);
  }

  if (difficulty && difficulty !== 'all') {
    results = results.filter((g) => g.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    results = results.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q)) ||
        g.toolsRequired.some((t) => t.toLowerCase().includes(q))
    );
  }

  return results;
}

/**
 * Fetch a single DIY guide by ID with simulated latency
 */
export async function fetchDiyGuideById(id: string): Promise<DiyRepairGuide | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const guide = DIY_REPAIR_GUIDES.find((g) => g.id === id);
  return guide || null;
}

/**
 * Fetch related DIY guides for the same category
 */
export async function fetchRelatedDiyGuides(
  category: ItemCategory,
  currentGuideId: string
): Promise<DiyRepairGuide[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return DIY_REPAIR_GUIDES.filter((g) => g.id !== currentGuideId && g.category === category).slice(0, 3);
}

/**
 * Simulated API to submit feedback on a DIY guide
 */
export async function submitDiyGuideFeedback(
  guideId: string,
  helpful: boolean,
  rating: number,
  comment?: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    success: true,
    message: 'Thank you for sharing your repair experience with the DIY community!',
  };
}
