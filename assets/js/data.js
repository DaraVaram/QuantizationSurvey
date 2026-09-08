/* =========================================================================
   data.js — All structured data transcribed faithfully from the paper.
   Tables, taxonomy, and platform data for interactive rendering.
   Citation keys map to window.CITEMAP (see refs.js) for [n] numbering.
   ========================================================================= */

window.DATA = {

/* ----------------------------------------------------------------------
   TABLE I — Scope comparison of surveys (tab:survey-scope)
   cells: "yes" | "partial" | ""  ;  hw: subset of ["arm","risc","npu"]
---------------------------------------------------------------------- */
surveyScope: {
  columns: ["Primary Quantization","Advanced Quantization","Numeric Representations",
            "Hardware Landscape","Software Frameworks","Applications"],
  rows: [
    {paper:"Gholami et al.",  key:"gholami2022survey",      year:2022, primary:"yes", advanced:"yes",     numeric:"",        hw:["arm","risc"],         software:"",    apps:""},
    {paper:"Orășan et al.",   key:"lucan2022brief",         year:2022, primary:"",    advanced:"",        numeric:"",        hw:["arm"],                software:"yes", apps:"yes"},
    {paper:"Giordano et al.", key:"giordano2022survey",     year:2022, primary:"",    advanced:"",        numeric:"",        hw:["arm","risc","npu"],software:"",    apps:""},
    {paper:"Saha et al.",     key:"saha2022",               year:2022, primary:"yes", advanced:"partial", numeric:"",        hw:[],                     software:"yes", apps:"yes"},
    {paper:"Ray",             key:"ray2022review",          year:2022, primary:"yes", advanced:"partial", numeric:"",        hw:["arm","risc"],         software:"yes", apps:"yes"},
    {paper:"Rokh et al.",     key:"rokh2023comprehensive",  year:2023, primary:"yes", advanced:"yes",     numeric:"",        hw:[],                     software:"",    apps:""},
    {paper:"Akkad et al.",    key:"akkad2023embedded",      year:2023, primary:"",    advanced:"",        numeric:"",        hw:["risc"],               software:"",    apps:"yes"},
    {paper:"Liu et al.",      key:"liu2024lightweight",     year:2024, primary:"yes", advanced:"yes",     numeric:"",        hw:[],                     software:"yes", apps:""},
    {paper:"Liu et al.",      key:"liu2024exploring",       year:2024, primary:"",    advanced:"",        numeric:"",        hw:["risc"],               software:"",    apps:""},
    {paper:"Capogrosso et al.",key:"capogrosso2024machine", year:2024, primary:"yes", advanced:"",        numeric:"",        hw:["arm","risc"],         software:"yes", apps:""},
    {paper:"Liu et al.",      key:"liu2025low",             year:2025, primary:"yes", advanced:"yes",     numeric:"yes",     hw:[],                     software:"",    apps:""},
    {paper:"Heydari and Mahmoud",key:"heydari2025tiny",     year:2025, primary:"",    advanced:"",        numeric:"",        hw:[],                     software:"",    apps:"yes"},
    {paper:"Wang and Jia",    key:"wang2025optimizing",     year:2025, primary:"yes", advanced:"partial", numeric:"",        hw:[],                     software:"yes", apps:"yes"},
    {paper:"Somvanshi et al.",key:"somvanshi2025tiny",      year:2025, primary:"yes", advanced:"partial", numeric:"partial", hw:["arm","risc","npu"],software:"yes", apps:"yes"},
    {paper:"Lê et al.",       key:"tri2026efficient",       year:2026, primary:"yes", advanced:"partial", numeric:"partial", hw:["arm","risc"],         software:"yes", apps:"partial"},
    {paper:"Ours",            key:null,                     year:2026, primary:"yes", advanced:"yes",     numeric:"yes",     hw:["arm","risc","npu"],software:"yes", apps:"yes", ours:true}
  ]
},

/* ----------------------------------------------------------------------
   TABLE — Representative MCU-class platforms (tab:deployment_hw_summary)
---------------------------------------------------------------------- */
hardware: [
  {family:"ARM-based",     platform:"Arduino Nano 33 BLE Sense", cpu:"Cortex-M4F", accel:"—", clock:"64 MHz",  flash:"1 MB",   ram:"256 KB RAM", formats:["INT8","INT16","FP32"]},
  {family:"ARM-based",     platform:"SparkFun Edge",             cpu:"Cortex-M4F", accel:"—", clock:"48 MHz",  flash:"1 MB",   ram:"384 KB RAM", formats:["INT8","INT16","FP32"]},
  {family:"ARM-based",     platform:"Sony Spresense",            cpu:"6× Cortex-M4F", accel:"—", clock:"156 MHz", flash:"8 MB",  ram:"1.5 MB RAM", formats:["INT8","INT16","FP32"]},
  {family:"ARM-based",     platform:"OpenMV Cam H7",             cpu:"Cortex-M7",  accel:"—", clock:"480 MHz", flash:"2 MB",   ram:"1 MB SRAM",  formats:["INT8","INT16","FP32"]},
  {family:"RISC-V-based",  platform:"ESP32-C3", cpu:"Single-core RISC-V", accel:"—", clock:"160 MHz", flash:"4 MB",  ram:"400 KB SRAM", formats:["INT8"]},
  {family:"RISC-V-based",  platform:"ESP32-C6", cpu:"Single-core RISC-V", accel:"—", clock:"160 MHz", flash:"8 MB",  ram:"512 KB SRAM", formats:["INT8"]},
  {family:"RISC-V-based",  platform:"ESP32-P4", cpu:"Dual-core RISC-V",   accel:"—", clock:"400 MHz", flash:"16 MB", ram:"768 KB SRAM, 32 MB PSRAM", formats:["INT8","FP32"]},
  {family:"NPU-integrated",platform:"MSPM0G5187", cpu:"Cortex-M0+", accel:"TinyEngine NPU", clock:"80 MHz",  flash:"128 KB", ram:"32 KB SRAM",  formats:["INT2","INT4","INT8"]},
  {family:"NPU-integrated",platform:"MAX78002",   cpu:"Cortex-M4F, RISC-V controller", accel:"CNN accelerator", clock:"120 MHz, 60 MHz", flash:"2.5 MB", ram:"1.3 MB CNN SRAM, 384 KB SRAM", formats:["INT1","INT2","INT4","INT8"]},
  {family:"NPU-integrated",platform:"GAP8", cpu:"8-core RISC-V", accel:"HWCE", clock:"250 MHz", flash:"20 MB", ram:"512 KB L2 SRAM, 8 MB L3 RAM", formats:["INT4","INT8","INT16"]},
  {family:"NPU-integrated",platform:"GAP9", cpu:"9-core RISC-V", accel:"NE16", clock:"270–370 MHz", flash:"2 MB", ram:"1.6 MB L2 SRAM", formats:["INT2–INT8"]},
  {family:"NPU-integrated",platform:"HX6538-WE2", cpu:"Cortex-M55", accel:"Ethos-U55", clock:"400 MHz", flash:"16 MB", ram:"2 MB SRAM", formats:["INT8","INT16"]},
  {family:"NPU-integrated",platform:"STM32N6", cpu:"Cortex-M55", accel:"Neural-ART", clock:"800 MHz", flash:"External", ram:"4.2 MB SRAM", formats:["INT8"]}
],

/* ----------------------------------------------------------------------
   TABLE — Synthesis of hardware–software deployment stacks
   (tab:deployment_stack_summary)
---------------------------------------------------------------------- */
deploymentStack: [
  {family:"ARM-Based",
   hwPath:"Inference on the Cortex-M cores themselves, without a dedicated accelerator, using integer and DSP-optimized kernels under tight on-chip SRAM and flash limits.",
   swPath:"TFLM and LiteRT for Microcontrollers with CMSIS-NN kernels, with STM32Cube.AI or Edge Impulse for vendor-integrated, end-to-end code generation.",
   quant:"Uniform full-integer INT8 via PTQ is the dominant reported path, with QAT where always-on accuracy must survive compression, and sub-8-bit or mixed precision only through custom kernels and ISA-level work such as CMIX-NN.",
   impl:"Most reproducible baseline for modest-depth sensing workloads: HAR, environmental monitoring, speech and keyword spotting, networking, spectrum sensing, and lightweight vision or healthcare (Section 7.1, Table 4). Choose when mature tooling, portability, and low-friction integration matter more than peak efficiency."},
  {family:"RISC-V-Based",
   hwPath:"Inference on commercial MCUs such as the ESP32-C and ESP32-P families, using packed integer arithmetic, SIMD, and ISA extensions on the programmable CPU path, without a dedicated neural accelerator.",
   swPath:"TFLM with ESP-NN kernels on commercial ESP32 devices, through vendor and community toolchains that remain less standardized than the Cortex-M ecosystem.",
   quant:"Uniform INT8 PTQ in every commercial deployment reported to date, while aggressive low-bit and mixed precision remain confined to research-class PULP systems.",
   impl:"Feasible healthcare, industrial-monitoring, and robotics deployments in the lower-to-middle tier of edge workloads, with a smaller and more recent application base than ARM (Section 7.2, Table 5). Choose when an open-ISA, low-cost part suffices for compact workloads and a younger toolchain is acceptable."},
  {family:"NPU-Integrated",
   hwPath:"Accelerator-backed convolution, matrix, or operator-specific kernels with CPU orchestration, spanning tightly coupled CNN engines (MAX78x) and clustered RISC-V with dedicated convolution acceleration (HWCE on GAP8, NE16 on GAP9), under device-specific on-chip memory partitioning.",
   swPath:"ai8x training and synthesis, GAPFlow with nntool and Autotiler, Ethos-U tooling, and Neural-ART runtimes, each mapping compatible graphs onto its own accelerator.",
   quant:"INT8 remains the default even where the accelerator advertises lower precision, with genuine sub-8-bit and layer-wise mixed precision where the toolchain exploits it (QAT down to INT1\u2013INT4 with ai8x on MAX78x, INT2\u2013INT8 on GAP9's NE16), always bounded by the accelerator's supported operators and formats.",
   impl:"State of the art for latency- and energy-critical workloads: object detection, drone navigation, audio and speech, healthcare, HAR, anomaly detection, environmental sensing, and compact vision or DSP pipelines (Section 7.3, Table 6). Choose when hard latency or energy budgets dominate and the model can be matched to the accelerator's operators, precision formats, and memory limits."}
],

/* ----------------------------------------------------------------------
   APPLICATION TABLES — ARM / RISC-V / NPU
   These strings are exactly what Tables 4-6 display and are the single source
   of truth. The deployment-landscape scatter parses its numbers straight out
   of them, so there are no separate numeric mirrors to drift out of step.
---------------------------------------------------------------------- */
apps: {
  arm: [
    {key:"ulkar2021ultra", cat:"Speech", quant:"INT8 QAT", devices:"ARM Cortex-M4F", fw:"PyTorch", perf:"96.30% Acc.", power:"11.2 mJ", lat:"905", mem:"419.8"},
    {key:"moosmann2023tinyissimoyolo", cat:"Object Detection", quant:"INT8 QAT", devices:"STM32H7A3, STM32L4R9, Apollo4b", fw:"TFLM", perf:"43.50–75.40% mAP", power:"41.8 mJ, 102 mJ, 6.08 mJ", lat:"359, 996, 540", mem:"350–422"},
    {key:"kang2024device", cat:"HAR", quant:"INT8 PTQ", devices:"STM32F756ZG", fw:"PyTorch", perf:"91.04–98.29% Acc.", power:"4.50–8.77 mJ, 0.035–0.063 mJ", lat:"20.70–39.76, 1.11–1.93", mem:"37.8–44.7"},
    {key:"chehade2025energy", cat:"Networking", quant:"INT8 PTQ", devices:"STM32F746G, Nucleo-F401RE", fw:"TFLM, STM32Cube.AI", perf:"96.59% Acc.", power:"7.86 mJ, 29.10 mJ", lat:"31.43, 115.40", mem:"353"},
    {key:"cerioli2025efficient", cat:"Environment", quant:"INT8 PTQ", devices:"STM32H747XI, nRF52840, ESP32-PICO-D4", fw:"ONNX Runtime, NeuralCasting, TensorFlow Lite", perf:"98.5–99.1% Acc.", power:"600 mW, 100 mW, 2500 mW", lat:"0.034–0.246, 0.034–0.252, 0.308–2.001, 0.040–0.262", mem:"140–580"},
    {key:"abushahla2025real", cat:"Education", quant:"INT8 QAT", devices:"Sony Spresense, OpenMV Cam H7, H7 Plus", fw:"TFLM", perf:"93.60–98.73% Acc.", power:"494–884 mW, 1238–1609 mW", lat:"0.63, 0.08, 2.88–12.84", mem:"2900, 340"},
    {key:"abushahla2025cognitive", cat:"Spectrum Sensing", quant:"INT8 QAT", devices:"Sony Spresense", fw:"TFLM", perf:"92.63–99.94% F1, 70.55–99.09% F1", power:"52–54 mW, 44–52 mW", lat:"5.54–37.37, 1.18–5.20", mem:"23.8–72.6, 12.8–19.6"},
    {key:"zhou2025efficient", cat:"HAR", quant:"UINT8 PTQ", devices:"Arduino Nano 33 BLE Sense Rev2", fw:"TFLM, EdgeImpulse", perf:"97.09% Acc.", power:"21 mW", lat:"21", mem:"189.6"},
    {key:"dabbous2024benchmarking", cat:"Environment", quant:"INT8 QAT", devices:"STM32H7, Arduino Nano 33 BLE Sense Rev2", fw:"TFLM, STM32Cube.AI", perf:"99.63% Acc.", power:"227.86 mW, 1.43 mW, 9 mW", lat:"30.25, 522.15, 1.45", mem:"—"},
    {key:"rostami2024real", cat:"Healthcare", quant:"INT8 QAT, PQAT, PTQ", devices:"STM32H743iit6, STM32H750vbt6", fw:"TFLM", perf:"84.78–87.76% Acc.", power:"840 mW, 945 mW", lat:"6230, 6300", mem:"860"}
  ],
  riscv: [
    {key:"rattanasak2025lightweight", cat:"Healthcare", quant:"INT8 PTQ", devices:"ESP32-C6", fw:"TFLM", perf:"88.64 ± 1.56% F1, 90.05 ± 1.60% Sens., 87.29 ± 1.54% Prec.", power:"179.8 mW", lat:"630", mem:"310"},
    {key:"banerjee2026device", cat:"Industrial", quant:"INT8 PTQ", devices:"ESP32-C3", fw:"TFLM", perf:"95.00% macro-F1", power:"6.77 mJ", lat:"82±7", mem:"80"},
    {key:"roy2026tinynav", cat:"Robotics", quant:"INT8 PTQ", devices:"ESP32-P4", fw:"TFLM, ESP-NN", perf:"40 laps collision-free, 99.84% Steer Acc., 99.79% Throttle Acc.", power:"—", lat:"30", mem:"~23"}
  ],
  npu: [
    {key:"balbi2024ultra", cat:"Networking", quant:"INT8 PTQ", devices:"MAX78000", fw:"PyTorch, ai8x-tools", perf:"94.87% Acc.", power:"0.005 mJ", lat:"0.104", mem:"<432"},
    {key:"jakuvs2025implementing", cat:"Keyword Spotting", quant:"INT8 QAT", devices:"NXP MCXN94", fw:"TFLite", perf:"97.06% Acc.", power:"—", lat:"3.847", mem:"30.6"},
    {key:"gong2024dex", cat:"Image Classification", quant:"INT8 QAT", devices:"MAX78000, MAX78002", fw:"PyTorch, ai8x-tools", perf:"19.80–62.00% Acc.", power:"0.14–0.4 mJ", lat:"2–13", mem:"171.2–1330.7"},
    {key:"zemlyanikin2019512kib", cat:"Face Recognition", quant:"INT16 PTQ", devices:"GAP8", fw:"PyTorch, GAP8 Autotiler", perf:"93.00–96.33% Acc.", power:"—", lat:"<1000", mem:"1500"},
    {key:"moosmann2023tinyissimoyolo", cat:"Object Detection", quant:"INT8 QAT", devices:"MAX78000", fw:"PyTorch, ai8x-tools", perf:"43.50–75.40% mAP", power:"0.19 mJ", lat:"5.5", mem:"350–422"},
    {key:"moosmann2024ultra", cat:"Object Detection", quant:"INT8 PTQ", devices:"GAP9", fw:"PyTorch", perf:"14.00–49.00% mAP", power:"54 mW", lat:"56.45", mem:"<1000"},
    {key:"kang2024device", cat:"HAR", quant:"INT8 PTQ", devices:"GAP9", fw:"PyTorch", perf:"91.04–98.29% Acc.", power:"0.035–0.063 mJ", lat:"1.11–1.93", mem:"37.8–44.7"},
    {key:"van2023real", cat:"Healthcare", quant:"INT8 QAT", devices:"MAX78002", fw:"PyTorch, ai8x-tools", perf:"94.60% AUC", power:"18 mW", lat:"0.248", mem:"25.156"},
    {key:"busia2025endoscopy", cat:"Healthcare", quant:"INT8 PTQ", devices:"GAP9", fw:"PyTorch", perf:"98.5% Acc.", power:"30.6 mW", lat:"61", mem:"750"},
    {key:"ibrahim2024end", cat:"Healthcare", quant:"INT8 QAT", devices:"Ethos-U55", fw:"PyTorch", perf:"94.25% Acc.", power:"2×10⁻⁸ mJ", lat:"5", mem:"<32"},
    {key:"lightbody2022host", cat:"Anomaly Detection", quant:"INT8 QAT", devices:"MAX78000", fw:"PyTorch", perf:"87.19–99.95% Acc.", power:"15 mW", lat:"2.556", mem:"55.9"},
    {key:"ingaleshwar2024wildlife", cat:"Environment", quant:"INT8 PTQ", devices:"MAX78000", fw:"PyTorch, ai8x-tools", perf:"79.67–86.53% F1", power:"0.885–4.275 mJ", lat:"4–27.5", mem:"100–460"},
    {key:"zhou2023solving", cat:"Drones", quant:"INT8 PTQ", devices:"GAP8", fw:"TFLite, GAP8 Autotiler", perf:"98.80% Acc., 57.20% Succ. Rate", power:"130 mW", lat:"35.71", mem:"292"},
    {key:"crupi2025efficient", cat:"Drones", quant:"INT8, FP16 PTQ", devices:"GAP9", fw:"nntool", perf:"79.00% mAP, 80.00% mAP", power:"34–41 mW", lat:"147–462", mem:"1800–3600"},
    {key:"rashid2025hac", cat:"Agriculture", quant:"INT8 PTQ", devices:"GAP8", fw:"TFLM", perf:"95.00% Acc.", power:"378 mW", lat:"37.6", mem:"49.6"}
  ]
},

/* ----------------------------------------------------------------------
   GUIDE — Figure 17. The deployment paths a practitioner can actually take,
   which one we recommend for each application, and the short notes the
   figure shows. This is authored guidance, our own advice informed by the
   surveyed literature, not a tally of it. Edit freely; figs.js only reads it.

   A path is one concrete route down the stack. `line` names one chip per
   step, in order, and is what the figure draws. `options` lists the
   legitimate swaps at a step, which the figure shows as branches the
   reader can click to re-trace through. `implies` are the settings the
   route fixes for you rather than choices you make.

   Chip keys: q: path, s: precision strategy, r: refinement, d: design
   choice, n: numerical representation, f: software tool, h: platform.
---------------------------------------------------------------------- */
guide: {
  families: {
    arm:   { name: "ARM-based" },
    riscv: { name: "RISC-V-based" },
    npu:   { name: "NPU-integrated" }
  },

  paths: {
    "arm-tflm": {
      rank: 1, name: "TFLM on Cortex-M", fam: "arm", color: "#D81B60",
      story: "The mainstream route. Quantize to INT8, export through TensorFlow Lite, and run under TFLM, which calls CMSIS-NN kernels on any Cortex-M part. Take it when mature tooling and portability matter more than peak efficiency.",
      line: ["q:PTQ", "s:uniform", "n:INT8", "f:tf", "f:tflite", "f:tflm", "h:stm32"],
      implies: ["d:uni", "d:sym", "d:asym", "d:pt", "d:pc", "d:static", "d:calib", "f:cmsis"],
      options: {
        "q:PTQ": ["q:QAT"],
        "n:INT8": ["n:INT16"],
        "f:tf": ["f:pytorch"],
        "f:tflite": ["f:onnx"],
        "f:tflm": ["f:onnxrt", "f:minimal"],
        "h:stm32": ["h:nano33", "h:spresense", "h:openmv", "h:sparkfun", "h:apollo"]
      }
    },
    "arm-cube": {
      rank: 3, name: "STM32Cube.AI", fam: "arm", color: "#AD1457",
      story: "The vendor route on STM32. Cube.AI converts the trained model straight into embedded C and brings its own runtime, so there is no separate inference engine to choose. That trades portability for a shorter path to working firmware.",
      line: ["q:PTQ", "s:uniform", "n:INT8", "f:tf", "f:cubeai", "h:stm32"],
      implies: ["d:uni", "d:sym", "d:asym", "d:pc", "d:static", "d:calib"],
      options: { "q:PTQ": ["q:QAT"], "f:tf": ["f:pytorch"] }
    },
    "arm-ei": {
      rank: 9, name: "Edge Impulse", fam: "arm", color: "#F06292",
      story: "The end-to-end route. Data collection, feature extraction, training, quantization, and firmware generation happen in one workflow, which is the fastest way to a working prototype and the least visibility into what it emits.",
      line: ["q:PTQ", "s:uniform", "n:INT8", "f:ei", "f:tflite", "f:tflm", "h:nano33"],
      implies: ["d:uni", "d:asym", "d:pt", "d:static", "d:calib", "f:cmsis"],
      options: { "q:PTQ": ["q:QAT"], "h:nano33": ["h:stm32", "h:spresense", "h:openmv", "h:sparkfun", "h:apollo"] }
    },

    "riscv-tflm": {
      rank: 4, name: "TFLM + ESP-NN on ESP32", fam: "riscv", color: "#EF6C00",
      story: "The commercial RISC-V route. The same TensorFlow Lite export as on Cortex-M, run by TFLM with ESP-NN kernels. Take it when a low-cost open-ISA part suffices and a younger toolchain is acceptable.",
      line: ["q:PTQ", "s:uniform", "n:INT8", "f:tf", "f:tflite", "f:tflm", "h:c6"],
      implies: ["d:uni", "d:asym", "d:pt", "d:static", "d:calib", "f:espnn"],
      options: { "q:PTQ": ["q:QAT"], "f:tf": ["f:pytorch"], "f:tflm": ["f:ariel"], "h:c6": ["h:c3", "h:p4"] }
    },
    "riscv-pulp": {
      rank: 11, name: "PULP kernels (research)", fam: "riscv", color: "#BF360C",
      story: "The research route, and the only RISC-V one that reaches below 8 bits. Co-designed kernels and ISA extensions carry mixed and low-bit precision on PULP-class cores, at the cost of leaving commercial silicon behind.",
      line: ["q:QAT", "s:mixed", "n:INT4", "f:pytorch", "f:pulpnn", "h:pulp"],
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "r:hwa"],
      options: { "s:mixed": ["s:extreme"], "n:INT4": ["n:INT2", "n:INT8", "n:mixed"], "f:pulpnn": ["f:xpulp"] }
    },

    "npu-gap": {
      rank: 10, name: "GAPflow on GAP8/GAP9", fam: "npu", color: "#0288D1",
      caveat: "only if you already have the hardware",
      story: "The clustered-accelerator route, and the one much of the surveyed literature runs on. GAPflow tiles the graph, orchestrates DMA, and generates code for the convolution engine. Treat it as a reference point rather than a starting point, since the GAP parts are no longer generally available: take it only if you already have the hardware and toolchain.",
      line: ["q:PTQ", "s:uniform", "n:INT8", "f:pytorch", "f:gapflow", "f:accel", "h:gap9"],
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "d:calib", "r:hwa"],
      options: {
        "q:PTQ": ["q:QAT"], "s:uniform": ["s:mixed", "s:extreme"], "n:INT8": ["n:mixed", "n:INT4", "n:INT2", "n:INT16", "n:FP16"],
        "f:pytorch": ["f:tf"], "h:gap9": ["h:gap8"]
      }
    },
    "npu-max78": {
      rank: 2, name: "ai8x on MAX78000/78002", fam: "npu", color: "#5E35B1",
      story: "The tightly coupled CNN-accelerator route, and the accelerator path we would start from today. ai8x trains with the accelerator's constraints in the loop and synthesises the network into it, which is how sub-8-bit and mixed widths actually reach a shipping device.",
      line: ["q:QAT", "s:uniform", "n:INT8", "f:ai8xt", "f:ai8xs", "f:accel", "h:max000"],
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "r:hwa", "f:pytorch"],
      options: { "q:QAT": ["q:PTQ"], "s:uniform": ["s:extreme", "s:mixed"], "n:INT8": ["n:INT4", "n:INT2", "n:INT1", "n:mixed"], "h:max000": ["h:max002"] }
    },
    "npu-ethos": {
      rank: 5, name: "Ethos-U toolchain", fam: "npu", color: "#00838F",
      story: "The microNPU route. The Ethos-U compiler maps whatever of the network it supports onto the accelerator and leaves the rest on the Cortex-M core, so operator coverage decides how much you actually gain.",
      line: ["q:PTQ", "s:uniform", "n:INT8", "f:tf", "f:ethos", "f:accel", "h:ethos"],
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "d:calib"],
      options: { "q:PTQ": ["q:QAT"], "n:INT8": ["n:INT16"] }
    },
    "npu-n6": {
      rank: 6, name: "Neural-ART on STM32N6", fam: "npu", color: "#455A64",
      story: "ST's accelerator route, deployed through the same Cube tooling as the Cortex-M parts, which makes it the shortest move from an existing STM32 product to an accelerated one.",
      line: ["q:PTQ", "s:uniform", "n:INT8", "f:tf", "f:neuralart", "f:accel", "h:n6"],
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "d:calib"],
      options: { "q:PTQ": ["q:QAT"], "f:tf": ["f:pytorch"] }
    },
    "npu-nxp": {
      rank: 7, name: "TFLite on NXP MCXN", fam: "npu", color: "#6D4C41",
      story: "A middle route: a standard TensorFlow Lite export, executed by the vendor runtime on an integrated NPU, so the accelerator arrives without a bespoke toolchain.",
      line: ["q:QAT", "s:uniform", "n:INT8", "f:tf", "f:tflite", "f:accel", "h:mcxn"],
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "d:calib"],
      options: { "q:QAT": ["q:PTQ"] }
    },
    "npu-ti": {
      rank: 8, name: "TinyEngine NPU on MSPM0", fam: "npu", color: "#827717",
      story: "The smallest accelerator route here, on a Cortex-M0+ part with only tens of kilobytes of SRAM. Its NPU carries widths down to INT2, so it suits a model small enough to be co-designed with the memory rather than fitted to it afterwards. Conversion and code generation happen inside the vendor flow rather than as a step you pick.",
      line: ["q:QAT", "s:uniform", "n:INT8", "f:pytorch", "f:accel", "h:mspm0"],
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "r:hwa"],
      options: { "q:QAT": ["q:PTQ"], "s:uniform": ["s:extreme", "s:mixed"], "n:INT8": ["n:INT4", "n:INT2", "n:mixed"] }
    }
  },

  // Supported widths for the platforms Table 3 does not itemise, so the figure can
  // check every width it offers against the silicon underneath it.
  platformWidths: {
    "h:stm32":     ["n:INT8", "n:INT16"],
    "h:apollo":    ["n:INT8", "n:INT16"],
        "h:max000":    ["n:INT1", "n:INT2", "n:INT4", "n:INT8"],
    "h:mcxn":      ["n:INT8"],
    "h:pulp":      ["n:INT2", "n:INT4", "n:INT8", "n:INT16"]
  },

  // Choices that come as a pair: taking one pulls the other along wherever the route offers it.
  couples: {
    "n:mixed": ["s:mixed"], "s:mixed": ["n:mixed"],
    "n:INT4": ["s:extreme"], "n:INT2": ["s:extreme"], "n:INT1": ["s:extreme"],
    "s:extreme": ["n:INT2"]
  },

  // Per application: the routes worth considering, best first, and why.
  applications: {
    "Speech":               { paths: ["arm-tflm", "npu-max78", "npu-gap"], via: ["q:QAT"], note: "Speech models are always-on, so energy per inference decides. Cortex-M is the low-friction default; move to an accelerator when the audio front end and the model together must fit a hard budget." },
    "Keyword Spotting":     { paths: ["arm-tflm", "npu-max78", "npu-nxp"], note: "Keyword spotting is small and permanently listening. Start on Cortex-M, and move to an accelerator when the duty cycle is high enough that inference energy dominates the power budget." },
    "Object Detection":     { paths: ["npu-max78", "npu-gap", "arm-tflm"], via: ["q:QAT", "h:max000"], note: "Detection is where accelerators pay off most, and the MAX78x is the one still generally available. On Cortex-M it is confined to tiny detectors at low frame rates." },
    "Image Classification": { paths: ["npu-max78", "npu-gap", "arm-tflm"], via: ["q:QAT", "h:max002"], note: "Compact classifiers fit Cortex-M at modest input resolution; an accelerator extends resolution and frame rate at lower energy." },
    "Face Recognition":     { paths: ["npu-max78", "npu-gap"], via: ["q:QAT", "h:max002"], note: "Input resolution and embedding networks put face recognition beyond real-time Cortex-M execution, so plan on an accelerator from the start. The surveyed result used INT16 on a GAP8, which the GAP branch still shows." },
    "Segmentation":         { paths: ["npu-max78", "npu-gap", "npu-ethos"], note: "Dense per-pixel output needs an accelerator, and needs its toolchain to cover the upsampling operators, which is where these flows most often stop." },
    "Surveillance":         { paths: ["npu-max78", "npu-gap", "npu-ethos"], note: "Always-on camera pipelines pair an accelerator with aggressive duty-cycling of the sensor and the radio, which usually dominate the energy budget." },
    "VQA":                  { paths: ["npu-ethos", "npu-gap", "npu-n6"], note: "Multimodal models need an accelerator and a toolchain that covers attention operators. Expect the operator gap of challenge 8.1 and the architecture gap of 8.2 before the arithmetic becomes the problem." },
    "HAR":                  { paths: ["arm-tflm", "npu-gap", "npu-max78"], via: ["q:PTQ", "h:stm32"], note: "Inertial activity recognition is the archetypal Cortex-M workload. An accelerator suits fast multi-sensor loops where reaction time matters." },
    "Healthcare":           { paths: ["arm-tflm", "npu-gap", "npu-max78", "riscv-tflm"], via: ["q:QAT", "h:stm32"], note: "Physiological-signal models run on all three families. Choose by the signal's dimensionality, by certification and tooling constraints, and only then by raw efficiency." },
    "Wearables":            { paths: ["npu-max78", "npu-gap", "arm-tflm"], via: ["q:QAT", "h:max002"], note: "Wearables trade the accelerator's energy per inference against the simpler Cortex-M stack. Hearing aids on the GAP9 showed how far the accelerator side of that trade reaches, and the MAX78x is where to reproduce it today." },
    "Networking":           { paths: ["arm-tflm", "npu-max78"], via: ["q:PTQ", "h:stm32"], note: "Packet- and flow-level classifiers are small and latency-tolerant, so Cortex-M is the default. An accelerator brings sub-millisecond inference when the whole model fits inside it." },
    "Environment":          { paths: ["arm-tflm", "arm-ei", "npu-max78"], via: ["q:PTQ", "h:stm32"], note: "Environmental sensing is long-duty-cycle and battery-bound, so the mature Cortex-M stack is the default; accelerators help once acoustic or image inputs are involved." },
    "Agriculture":          { paths: ["arm-tflm", "npu-gap", "npu-max78"], via: ["q:PTQ", "h:stm32"], note: "Low-rate environmental inputs sit comfortably on Cortex-M; camera-based crop and livestock monitoring wants an accelerator. The surveyed deployment used a GAP8, which is now a reference rather than a recommendation." },
    "Industrial":           { paths: ["riscv-tflm", "arm-tflm"], via: ["q:PTQ", "h:c3"], note: "Vibration and condition-monitoring classifiers are compact one-dimensional models. Both families suffice; RISC-V is attractive where unit cost and an open ISA matter." },
    "Anomaly Detection":    { paths: ["npu-max78", "arm-tflm"], via: ["q:QAT", "h:max000"], note: "Anomaly detectors are small but always-on, so energy per inference decides. Accelerators reach milliwatt operation; Cortex-M remains the low-friction alternative." },
    "Spectrum Sensing":     { paths: ["arm-tflm", "npu-max78"], via: ["q:QAT", "h:spresense"], note: "Spectrum sensing is a one-dimensional pipeline that Cortex-M handles at the reported sample rates. An accelerator becomes relevant for wideband inputs or tighter latency budgets." },
    "DSP":                  { paths: ["arm-tflm", "npu-max78"], note: "Classical DSP front ends run on Cortex-M with its DSP kernels; neural DSP pipelines move to the accelerator." },
    "Robotics":             { paths: ["riscv-tflm", "npu-gap", "npu-max78"], via: ["q:PTQ", "h:p4"], note: "The dual-core ESP32-P4 handles steering and throttle models directly. Reaction-critical perception loops want an accelerator, which historically meant the GAP family and now means the MAX78x." },
    "Drones":               { paths: ["npu-max78", "npu-gap", "arm-tflm"], via: ["q:QAT", "h:max000"], note: "Drone perception is parallelisable, latency-bound, and power-limited, so it wants an accelerator. The surveyed work runs on GAP8 and GAP9; the MAX78x is the equivalent you can still buy. Cortex-M remains a fallback for the lightest navigation models." },
    "Education":            { paths: ["arm-tflm", "arm-ei"], via: ["q:QAT", "h:spresense"], note: "Teaching platforms favour the most reproducible path, which is a Cortex-M board with a workflow that hides as little as possible behind vendor tooling." }
  },

  // Short explanations shown when a method, format, tool or platform is selected.
  notes: {
    "q:PTQ": "Post-training quantization is the right default on every route: the strongest balance between memory reduction, effort, and accuracy retention.",
    "q:QAT": "Quantization-aware training is where accuracy must survive compression, and the only way to reach sub-8-bit widths on the accelerators that accept them.",
    "s:uniform": "One bit-width for the whole network, INT8 in practice, is the best default on every route. Not to be confused with a uniform grid, which is about how the levels are spaced.",
    "s:mixed": "Mixed precision pays off when profiling reveals clear layer sensitivity and the runtime can exploit finer-grained control, which today means an accelerator whose toolchain accepts several widths. On Cortex-M it is reachable only through custom kernels.",
    "s:extreme": "Extreme low-bit networks are most justifiable when flash or bandwidth is the dominant bottleneck. They reach a device through an accelerator whose toolchain accepts the width, trained with QAT.",
    "q:qt": "Quantized training carries quantization into the training process itself, including the backward pass. Section 4.1 finds it markedly less mature than PTQ and QAT for MCU deployment, and no runtime in this stack supports it, so it remains a research direction rather than a route you can take today. It is what challenge 8.6 would have to unlock.",
    "r:hwa": "Hardware-aware quantization matters most on the accelerator routes, where operator and format support decide what the toolchain will accept.",
    "r:redis": "Redistribution reshapes weight or activation distributions before quantizing, and mostly pays off at low bit-widths.",
    "r:dagn": "Data-agnostic methods matter when calibration data cannot leave the device or does not exist. They apply on every route.",
    "d:uni": "An evenly spaced grid is what integer kernels execute, so every route below assumes one. This is a separate choice from using one bit-width throughout.",
    "d:nonuni": "Non-uniform grids need dedicated arithmetic, which is why no route in this stack uses them.",
    "d:sym": "Symmetric quantization drops the zero-point term, which is why weights are usually symmetric.",
    "d:asym": "Asymmetric quantization spends a zero-point to use the full range, which is why post-ReLU activations usually are.",
    "d:pt": "Per-tensor scales are the cheapest to execute and what activations normally use.",
    "d:pc": "Per-channel weight scales cost almost nothing at inference and are the converter default on the TensorFlow Lite routes.",
    "d:pg": "Per-group scales are rare on MCUs; none of the runtimes in this stack exposes them.",
    "d:static": "Static ranges are fixed at calibration time and are what every MCU runtime here supports.",
    "d:dyn": "Dynamic quantization recomputes ranges at run time and is not available in these runtimes.",
    "d:calib": "Calibration data selects the clipping range. PTQ quality depends on it more than on anything else.",
    "n:INT8": "INT8 is the common denominator of every runtime and every platform in this stack.",
    "n:INT16": "INT16 buys accuracy headroom at twice the memory, and is supported natively only on the platforms shown.",
    "n:fxp": "Fixed-point is the family every integer route below belongs to. In practice on an MCU it means INT8, an integer grid with the scale kept outside the kernel.",
    "n:mixed": "Several widths in one network, assigned per layer, per channel, per group, or separately to weights and activations. It needs a route whose toolchain and silicon accept more than one width.",
    "n:FP16": "No MCU here lists FP16 among its formats; the one reported use ran on the GAP9 cluster cores rather than its accelerator.",
    "n:posit": "Posit widens dynamic range at the same bit-width, but no mainstream runtime or MCU silicon executes it, so the route stops at this step. Research hardware such as PHEE is where it currently ends.",
    "n:takum": "Takum keeps Posit's tapered precision with a bounded regime and, like Posit, has no MCU runtime or silicon beneath it yet.",
    "n:BF16": "BF16 is a training-side format. No MCU runtime or platform in this stack executes it.",
    "n:FP8": "FP8 has no MCU runtime or platform beneath it in this stack.",
    "n:MSFP": "Block floating-point has no MCU runtime or platform beneath it in this stack.",
    "n:afx": "Adaptive fixed-point formats need dedicated hardware support that no platform here provides.",
    "f:cmsis": "CMSIS-NN sits underneath TFLM on the Cortex-M routes rather than being chosen separately.",
    "f:accel": "The vendor runtime that drives the accelerator: ai8x firmware on the MAX78x, the GAP SDK, the Ethos-U driver, or the Neural-ART runtime.",
    "f:ai8xt": "ai8x-training is a PyTorch fork that trains with the MAX78x accelerator's constraints in the loop, so choosing it is a PyTorch flow.",
    "f:pytorch": "PyTorch reaches every family. On the MAX78x it arrives as ai8x-training, the fork that trains with the accelerator's constraints in the loop.",
    "h:pulp": "A research platform, where low-bit and mixed-precision RISC-V kernels have been demonstrated, rather than a part you can buy."
  }
},

/* ----------------------------------------------------------------------
   TAXONOMY — Fig. quant-taxonomy (forest). Methods carry citation keys.
---------------------------------------------------------------------- */
taxonomy: [
  {name:"Advanced Quantization Techniques", sec:"III", children:[
    {name:"Integer & Quantized Training", sec:"III-A", methods:[
      {n:"AQT", k:["lewt2023aqt"]},{n:"Zhu et al.", k:["zhu2020"]},{n:"Octo", k:["zhou2021octo"]},{n:"DDQS & UDPS", k:["wang2023"]}
    ]},
    {name:"Extreme Low-Bit Quantization", sec:"III-B", children:[
      {name:"Binarization", methods:[
        {n:"BinaryConnect", k:["courbariaux2015binaryconnect"]},{n:"BNNs", k:["hubara2018"]},{n:"eBNNs", k:["mcdanel2017","Geiger2020"]},{n:"XNOR-Net", k:["rastegari2016xnor"]}
      ]},
      {name:"Ternarization", methods:[
        {n:"TWNs", k:["lin2015neural","li2016ternary"]},{n:"TBNs", k:["wan2018tbn"]}
      ]}
    ]},
    {name:"Mixed Precision Quantization", sec:"III-C", children:[
      {name:"Rough Allocation", methods:[
        {n:"HAWQ", k:["hawq"]},{n:"HAWQ-v2", k:["hawqv2"]},{n:"HTQ", k:["htq"]},{n:"MPQCO", k:["chen2021towards"]},{n:"LIMPQ", k:["tang2022mixed"]},{n:"InfoQ", k:["akbulut2026infoq"]},{n:"CherryQ", k:["cherryq"]},{n:"REx", k:["rex"]},{n:"OWQ", k:["owq"]},{n:"HAQ", k:["wang2019haq"]}
      ]},
      {name:"Adaptive Allocation", methods:[
        {n:"NIPQ", k:["NIPQ"]},{n:"MEBQAT", k:["meta-learning"]},{n:"MetaMix", k:["kim2024metamix"]},{n:"CADyQ", k:["cadyq"]},{n:"CABM", k:["cabm"]},{n:"AdaBM", k:["hong2024adabm"]},{n:"CoQuant", k:["coquant"]},{n:"ALPS", k:["langroudi2021alps"]}
      ]}
    ]},
    {name:"Hardware-Aware Quantization", sec:"III-D", methods:[
      {n:"HAQ", k:["wang2019haq"]},{n:"Rusci et al.", k:["rusci2020"]},{n:"HAWQ-v3", k:["yao2021hawq"]},{n:"OHQ", k:["huang2023chip"]}
    ]},
    {name:"Redistribution", sec:"III-E", children:[
      {name:"Distribution Uniformization", methods:[
        {n:"GDRQ", k:["yu2020low"]},{n:"KURE", k:["chmiel2020robust"]},{n:"SqWQ", k:["strom2022squashed"]},{n:"EQ-Net", k:["xu2023eq"]},{n:"KurTail", k:["akhondzadeh2025kurtail"]}
      ]},
      {name:"Distribution Reshaping", methods:[
        {n:"BR", k:["han2021improving"]},{n:"R² Loss", k:["kundu2023r2"]}
      ]},
      {name:"Outlier Redistribution", methods:[
        {n:"SmoothQuant", k:["xiao2023smoothquant"]},{n:"OmniQuant", k:["shao2024omniquant"]},{n:"FQ-ViT", k:["lin2021fq"]},{n:"OS+", k:["wei2023outlier"]},{n:"DuQuant", k:["lin2024duquant"]},{n:"AdderQuant", k:["nie2022redistribution"]},{n:"MagR", k:["zhang2024magr"]}
      ]},
      {name:"Bias Redistribution", methods:[
        {n:"QuantSR", k:["qin2023quantsr"]},{n:"NoisyQuant", k:["liu2023noisyquant"]},{n:"RAOQ", k:["zhang2024reshape"]}
      ]}
    ]},
    {name:"Data-Agnostic (Free) Quantization", sec:"III-F", methods:[
      {n:"DFQ", k:["nagel2019data"]},{n:"SQuant", k:["squant"]},{n:"REx", k:["rex"]},{n:"PNMQ", k:["data-free-non-uniform"]},{n:"UDFC", k:["udfc"]}
    ]}
  ]},
  {name:"Alternative Numerical Representations", sec:"IV", children:[
    {name:"Reduced Floating-Point Formats", sec:"IV-A", methods:[
      {n:"FP16", k:["kahan1996ieee"]},{n:"BF16", k:["guntoro2020next"]},{n:"TF32", k:["choquette2021nvidia"]},{n:"CFloat8 & CFloat16", k:["tesla_dojo_2025"]},{n:"MSFP", k:["darvish2020pushing"]},{n:"BSFP", k:["lo2023block"]},{n:"AdaptiveFloat", k:["tambe2020algorithm"]},{n:"DFloat", k:["zhang202570"]},{n:"ANT", k:["guo2022ant"]}
    ]},
    {name:"Adaptive Fixed-Point Formats", sec:"IV-B", methods:[
      {n:"Zero-Skew", k:["jacob2018quantization"]},{n:"F8Net", k:["jin2022f8net"]},{n:"VS-Quant", k:["dai2021vs"]}
    ]},
    {name:"Tapered-Accuracy Formats", sec:"IV-C", methods:[
      {n:"Posit", k:["gustafson2017beating","gustafson2"]}
    ]}
  ]}
]

};
