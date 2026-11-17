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
  {"family": "ARM-based", "platform": "Arduino Nano 33 BLE Sense", "cpu": "Cortex-M4F", "accel": "–", "clock": "64 MHz", "flash": "1 MB", "ram": "256 KB RAM", "formats": ["INT8", "INT16", "FP32"]},
  {"family": "ARM-based", "platform": "nRF5340", "cpu": "2× Cortex-M33", "accel": "–", "clock": "128 MHz, 64 MHz", "flash": "1 MB", "ram": "512 KB RAM", "formats": ["INT8", "INT16", "FP32"]},
  {"family": "ARM-based", "platform": "Raspberry Pi Pico", "cpu": "2× Cortex-M0+", "accel": "–", "clock": "133 MHz", "flash": "2 MB", "ram": "264 KB SRAM", "formats": ["INT8", "INT16"]},
  {"family": "ARM-based", "platform": "Sony Spresense", "cpu": "6× Cortex-M4F", "accel": "–", "clock": "156 MHz", "flash": "8 MB", "ram": "1.5 MB RAM", "formats": ["INT8", "INT16", "FP32"]},
  {"family": "ARM-based", "platform": "STM32H747", "cpu": "Cortex-M7, Cortex-M4F", "accel": "–", "clock": "480 MHz, 240 MHz", "flash": "2 MB", "ram": "1 MB SRAM", "formats": ["INT8", "INT16", "FP32"]},
  {"family": "RISC-V-based", "platform": "ESP32-C3", "cpu": "Single-core RISC-V", "accel": "–", "clock": "160 MHz", "flash": "4 MB", "ram": "400 KB SRAM", "formats": ["INT8", "INT16"]},
  {"family": "RISC-V-based", "platform": "ESP32-P4", "cpu": "Dual-core RISC-V", "accel": "–", "clock": "400 MHz", "flash": "16 MB", "ram": "768 KB SRAM, 32 MB PSRAM", "formats": ["INT8", "INT16", "FP32"]},
  {"family": "RISC-V-based", "platform": "Mr. Wolf (research)", "cpu": "8-core RISC-V", "accel": "–", "clock": "450 MHz", "flash": "External", "ram": "512 KB L2 SRAM", "formats": ["INT8", "INT16", "FP32"]},
  {"family": "NPU-Integrated", "platform": "MAX78000", "cpu": "Cortex-M4F, RISC-V controller", "accel": "CNN accelerator", "clock": "100 MHz, 60 MHz", "flash": "512 KB", "ram": "512 KB CNN SRAM, 128 KB SRAM", "formats": ["INT1", "INT2", "INT4", "INT8", "FP32"]},
  {"family": "NPU-Integrated", "platform": "nRF54LM20B", "cpu": "Cortex-M33", "accel": "Axon NPU", "clock": "128 MHz", "flash": "2 MB", "ram": "512 KB RAM", "formats": ["INT8", "FP32"]},
  {"family": "NPU-Integrated", "platform": "MCX N947", "cpu": "2× Cortex-M33", "accel": "eIQ Neutron NPU", "clock": "150 MHz", "flash": "2 MB", "ram": "512 KB RAM", "formats": ["INT8", "FP32"]},
  {"family": "NPU-Integrated", "platform": "GAP8", "cpu": "8-core RISC-V", "accel": "HWCE", "clock": "250 MHz, 170 MHz", "flash": "External", "ram": "512 KB L2 SRAM, 8 MB L3 RAM", "formats": ["INT4", "INT8", "INT16"]},
  {"family": "NPU-Integrated", "platform": "GAP9", "cpu": "9-core RISC-V", "accel": "NE16", "clock": "370 MHz", "flash": "2 MB", "ram": "1.6 MB L2 SRAM", "formats": ["INT2–INT8", "FP16", "BF16", "FP32"]},
  {"family": "NPU-Integrated", "platform": "HX6538-WE2", "cpu": "Cortex-M55", "accel": "Ethos-U55", "clock": "400 MHz", "flash": "16 MB", "ram": "2 MB SRAM", "formats": ["INT8", "INT16", "FP16", "FP32"]},
  {"family": "NPU-Integrated", "platform": "STM32N6", "cpu": "Cortex-M55", "accel": "Neural-ART", "clock": "800 MHz", "flash": "External", "ram": "4.2 MB SRAM", "formats": ["INT4", "INT8", "INT16", "FP16", "FP32"]}
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
   impl:"Most reproducible baseline for modest-depth sensing workloads: HAR, environmental monitoring, speech and keyword spotting, networking, spectrum sensing, and lightweight vision or healthcare (Section 8.1, Table 16). Choose when mature tooling, portability, and low-friction integration matter more than peak efficiency."},
  {family:"RISC-V-Based",
   hwPath:"Inference on commercial MCUs such as the ESP32-C and ESP32-P families, using packed integer arithmetic, SIMD, and ISA extensions on the programmable CPU path, without a dedicated neural accelerator.",
   swPath:"TFLM with ESP-NN kernels on commercial ESP32 devices, through vendor and community toolchains that remain less standardized than the Cortex-M ecosystem.",
   quant:"Uniform INT8 PTQ in every commercial deployment reported to date, while aggressive low-bit and mixed precision remain confined to research-class PULP systems.",
   impl:"Feasible healthcare, industrial-monitoring, and robotics deployments in the lower-to-middle tier of edge workloads, with a smaller and more recent application base than ARM (Section 8.2, Table 17). Choose when an open-ISA, low-cost part suffices for compact workloads and a younger toolchain is acceptable."},
  {family:"NPU-Integrated",
   hwPath:"Accelerator-backed convolution, matrix, or operator-specific kernels with CPU orchestration, spanning tightly coupled CNN engines (MAX7800x) and clustered RISC-V with dedicated convolution acceleration (HWCE on GAP8, NE16 on GAP9), under device-specific on-chip memory partitioning.",
   swPath:"ai8x training and synthesis, GAPFlow with nntool and Autotiler, Ethos-U tooling, and Neural-ART runtimes, each mapping compatible graphs onto its own accelerator.",
   quant:"INT8 remains the default even where the accelerator advertises lower precision, with genuine sub-8-bit and layer-wise mixed precision where the toolchain exploits it (QAT down to INT1\u2013INT4 with ai8x on MAX7800x, INT2\u2013INT8 on GAP9's NE16), always bounded by the accelerator's supported operators and formats.",
   impl:"State of the art for latency- and energy-critical workloads: object detection, drone navigation, audio and speech, healthcare, HAR, anomaly detection, environmental sensing, and compact vision or DSP pipelines (Section 8.3, Table 18). Choose when hard latency or energy budgets dominate and the model can be matched to the accelerator's operators, precision formats, and memory limits."}
],

/* ----------------------------------------------------------------------
   APPLICATION TABLES — ARM / RISC-V / NPU
   These strings are exactly what Tables 16-18 display and are the single source
   of truth. The deployment-landscape scatter parses its numbers straight out
   of them, so there are no separate numeric mirrors to drift out of step.
---------------------------------------------------------------------- */
apps: {
  arm: [
    {"key": "munirathinam2026optimizing", "cat": "Audio Classification", "quant": "INT8 PTQ", "devices": "STM32H743", "fw": "TFLM", "perf": "93.41–96.83% Acc.", "mem": "17.6–36.3", "lat": "0.9–8.2", "power": "–", "energy": "0.14–4.1", "measured": "Chip"},
    {"key": "moosmann2023tinyissimoyolo", "cat": "Object Detection", "quant": "INT8 QAT", "devices": "STM32H7A3, STM32L4R9, Apollo4b", "fw": "TFLM", "perf": "43.50–75.40% mAP", "mem": "398–422", "lat": "359, 996, 540", "power": "–", "energy": "41.8, 102, 6.08", "measured": "Chip"},
    {"key": "mohammady2026binarized", "cat": "Visual Wake Words", "quant": "INT1 QAT", "devices": "STM32H7B3I-DK", "fw": "CBin-NN", "perf": "73.35% Acc.", "mem": "7.03", "lat": "30.5", "power": "80", "energy": "2.4", "measured": "Board"},
    {"key": "yahyati2026novel", "cat": "Image Classification", "quant": "INT8 QAT", "devices": "STM32F4, STM32F7", "fw": "TFLM, CMSIS-NN", "perf": "98.00% Acc.", "mem": "118", "lat": "96–122, 37–54", "power": "–", "energy": "11.1–14.1, 7.9–11.6", "measured": "Chip"},
    {"key": "zhou2025efficient", "cat": "HAR", "quant": "INT8 PTQ", "devices": "Arduino Nano 33, BLE Sense Rev2", "fw": "TFLM, Edge Impulse", "perf": "97.09% Acc.", "mem": "136.5", "lat": "21", "power": "21", "energy": "–", "measured": "Board"},
    {"key": "chehade2025energy", "cat": "Network Security", "quant": "INT8 PTQ", "devices": "STM32F746G-DISCO, Nucleo-F401RE", "fw": "TFLite, STM32Cube.AI", "perf": "94.73% Acc.", "mem": "353", "lat": "31.43, 115.40", "power": "250, 250", "energy": "7.86, 29.10", "measured": "Board"},
    {"key": "abushahla2025cognitive", "cat": "Spectrum Sensing", "quant": "INT8 QAT", "devices": "Sony Spresense", "fw": "TFLM", "perf": "92.63–99.94% F1, 70.55–99.09% F1", "mem": "23.8–72.6, 12.8–19.6", "lat": "5.54–37.37, 1.18–5.20", "power": "53–54, 44–52", "energy": "–", "measured": "Board"},
    {"key": "zainab2023lighteq", "cat": "Environment", "quant": "INT8 PTQ", "devices": "nRF52840", "fw": "TFLM, CMSIS-NN", "perf": "98.00% F1", "mem": "39", "lat": "932", "power": "–", "energy": "5.86", "measured": "Chip"},
    {"key": "cerioli2025efficient", "cat": "Environment", "quant": "INT8 PTQ", "devices": "STM32H747XI, nRF52840", "fw": "NeuralCasting, TFLM", "perf": "98.50–99.10% Acc.", "mem": "70–410, 80–350", "lat": "0.034–0.212, 0.308–1.965", "power": "600, 100", "energy": "–", "measured": "Board"},
    {"key": "abushahla2025real", "cat": "Education", "quant": "INT8 QAT", "devices": "Sony Spresense, OpenMV Cam H7, OpenMV Cam H7 Plus", "fw": "TFLM, CMSIS-NN, OpenMV IDE", "perf": "93.60–98.73% Acc.", "mem": "339, 339, 339–2900", "lat": "631, 80, 78–688", "power": "495, 884, 1239–1616", "energy": "–", "measured": "Board"},
    {"key": "burrello2021q", "cat": "Healthcare", "quant": "INT4 QAT, INT8 QAT, Mixed QAT, (INT2/4/8)", "devices": "STM32WB55", "fw": "CMix-NN", "perf": "4.41–7.73 BPM MAE", "mem": "1.87–412", "lat": "55.7–1900", "power": "25", "energy": "1.39–47.65", "measured": "Chip"},
    {"key": "rostami2024real", "cat": "Healthcare", "quant": "INT8 PTQ, INT8 QAT", "devices": "STM32H743, STM32H750", "fw": "TFLM", "perf": "84.78–87.76% Acc.", "mem": "860", "lat": "6230–6290, 6300", "power": "840, 945", "energy": "–", "measured": "Board"},
    {"key": "langer2025tinyml", "cat": "Industrial", "quant": "INT8 PTQ", "devices": "STM32L4R5", "fw": "TFLite, STM32Cube.AI", "perf": "100.00% Acc.", "mem": "12.59", "lat": "15.4", "power": "94.9", "energy": "1.462", "measured": "Chip"},
    {"key": "pleterski2023miniature", "cat": "Robotics", "quant": "INT8 PTQ", "devices": "RP2040", "fw": "Edge Impulse", "perf": "91.80% Acc.", "mem": "7", "lat": "34", "power": "–", "energy": "3.685", "measured": "Chip"}
  ],
  riscv: [
    {"key": "yardimci2025evaluation", "cat": "Image Classification", "quant": "INT8 PTQ", "devices": "ESP32-P4", "fw": "TFLM", "perf": "80.00–97.00% Acc.", "mem": "7–8", "lat": "18.96–18.98", "power": "–", "energy": "–", "measured": "–"},
    {"key": "boumedine2026streaming", "cat": "Speech Recognition", "quant": "Mixed PTQ, (INT2/4)", "devices": "ESP32-P4", "fw": "ESP-IDF", "perf": "4.34–19.56% WER", "mem": "26650", "lat": "753.5", "power": "–", "energy": "–", "measured": "–"},
    {"key": "wang2022mi", "cat": "Healthcare", "quant": "INT8 QAT", "devices": "Mr. Wolf", "fw": "PULP-DSP", "perf": "65.31–97.76% Acc.", "mem": "15.62–46.58", "lat": "5.53–11.37", "power": "9.06–10.24", "energy": "0.050–0.116", "measured": "Chip"},
    {"key": "rattanasak2025lightweight", "cat": "Healthcare", "quant": "INT8 PTQ", "devices": "ESP32-C6", "fw": "TFLM", "perf": "88.64% F1", "mem": "310", "lat": "630", "power": "179.8", "energy": "–", "measured": "Board"},
    {"key": "banerjee2026device", "cat": "Industrial", "quant": "INT8 PTQ", "devices": "ESP32-C3", "fw": "TFLM", "perf": "95.00% F1", "mem": "80", "lat": "82", "power": "–", "energy": "–", "measured": "–"}
  ],
  npu: [
    {"key": "lightbody2022host", "cat": "Network Security", "quant": "INT8 QAT", "devices": "MAX78000", "fw": "ai8x-tools", "perf": "87.10–99.92% Acc.", "mem": "55.9", "lat": "2.556", "power": "15", "energy": "–", "measured": "Chip"},
    {"key": "cerutti2020sound", "cat": "Audio Event Detection", "quant": "Mixed QAT, (INT1/16)", "devices": "GAP8", "fw": "OpenMP", "perf": "77.90% Acc.", "mem": "58", "lat": "511", "power": "–", "energy": "25.54", "measured": "Chip"},
    {"key": "ulkar2021ultra", "cat": "Keyword Spotting", "quant": "INT8 QAT", "devices": "MAX78000", "fw": "ai8x-tools", "perf": "96.30% Acc.", "mem": "419.8", "lat": "3.5", "power": "–", "energy": "0.251", "measured": "Chip"},
    {"key": "gong2024dex", "cat": "Image Classification", "quant": "Mixed QAT, (INT2/4/8)", "devices": "MAX78000", "fw": "ai8x-tools", "perf": "18.40–65.60% Acc.", "mem": "171.2–319.3", "lat": "2.59–3.82", "power": "68.9–77.1", "energy": "–", "measured": "Board"},
    {"key": "moosmann2023tinyissimoyolo", "cat": "Object Detection", "quant": "INT8 QAT", "devices": "MAX78000", "fw": "ai8x-tools", "perf": "43.50–75.40% mAP", "mem": "398–422", "lat": "5.5", "power": "–", "energy": "0.196", "measured": "Chip"},
    {"key": "chen2025low", "cat": "Object Detection", "quant": "INT8 QAT", "devices": "MAX78000", "fw": "ai8x-tools", "perf": "76.20% mAP", "mem": "300", "lat": "13.76", "power": "25.77", "energy": "0.354", "measured": "Chip"},
    {"key": "kang2024device", "cat": "HAR", "quant": "BF16 PTQ", "devices": "GAP9", "fw": "GAPflow", "perf": "84.00–95.69% Acc.", "mem": "75.6–89.4", "lat": "1.11–1.96", "power": "–", "energy": "0.035–0.063", "measured": "Chip"},
    {"key": "van2023real", "cat": "Healthcare", "quant": "INT8 QAT", "devices": "MAX78002", "fw": "ai8x-tools", "perf": "94.60% AUC", "mem": "25.2", "lat": "0.248", "power": "75", "energy": "–", "measured": "Chip"},
    {"key": "busia2025endoscopy", "cat": "Healthcare", "quant": "INT8 PTQ", "devices": "GAP9", "fw": "TFLite, GAP SDK", "perf": "98.50% Acc.", "mem": "750", "lat": "61", "power": "30.6", "energy": "1.9", "measured": "Chip"},
    {"key": "tegon2026femba", "cat": "Healthcare", "quant": "INT8 QAT", "devices": "GAP9", "fw": "Brevitas, GAP SDK", "perf": "81.02% Acc.", "mem": "7800", "lat": "1700", "power": "44.1", "energy": "75", "measured": "Chip"},
    {"key": "ingaleshwar2024wildlife", "cat": "Environment", "quant": "INT8 QAT", "devices": "MAX78000", "fw": "ai8x-tools", "perf": "85.93% F1", "mem": "240", "lat": "9", "power": "–", "energy": "0.855", "measured": "Board"},
    {"key": "duboisset2026polychirp", "cat": "Environment", "quant": "INT8 PTQ", "devices": "nRF54LM20B", "fw": "Edge AI Add-on", "perf": "92.00–94.00% F1", "mem": "157.3–245.5", "lat": "2–39", "power": "–", "energy": "0.022–0.343", "measured": "Board"},
    {"key": "abushahla2026submillisecond", "cat": "Environment", "quant": "Mixed QAT, (INT2/4/8)", "devices": "MAX78002", "fw": "ai8x-tools", "perf": "99.22% Acc.", "mem": "46.56", "lat": "0.128", "power": "–", "energy": "0.027", "measured": "Chip"},
    {"key": "rashid2025hac", "cat": "Agriculture", "quant": "INT8 PTQ", "devices": "GAP8", "fw": "TFLite, GAPflow", "perf": "70.00% Acc.", "mem": "306.1", "lat": "37.6", "power": "378", "energy": "14.2", "measured": "Board"},
    {"key": "zhou2023solving", "cat": "Drones", "quant": "INT8 PTQ", "devices": "GAP8", "fw": "TFLite, GAPflow", "perf": "98.80% Acc.", "mem": "292", "lat": "35.71", "power": "130", "energy": "4.7", "measured": "Board"},
    {"key": "crupi2025efficient", "cat": "Drones", "quant": "INT8 PTQ", "devices": "GAP9", "fw": "GAPflow", "perf": "79.00% mAP", "mem": "3400", "lat": "147–249", "power": "31–34", "energy": "–", "measured": "Chip"}
  ]
},

/* ----------------------------------------------------------------------
   GUIDE — the interactive deployment map. A compatibility model, not a list of recipes.

   Each toolchain declares what it CAN do at every step of the stack and
   which platforms it targets. The figure works out what is still reachable
   from whatever the reader has selected, so any combination the tools and
   the silicon actually support can be traced, whether or not a surveyed
   paper happens to have published it. An application only ranks the
   toolchains; it never restricts them.

   `steps` are the defaults the figure draws. `can` lists everything the
   toolchain supports at that step. `implies` are settings it fixes for you.
   `targets` are the platforms it deploys to, further narrowed by the widths
   each platform carries (Table 15 and platformWidths below).

   Chip keys: q: path, s: precision strategy, r: refinement, d: design
   choice, n: numerical representation, f: software tool, h: platform.
---------------------------------------------------------------------- */
guide: {
  families: { arm: { name: "ARM-based" }, riscv: { name: "RISC-V-based" }, npu: { name: "NPU-integrated" } },

  toolchains: {
    "tflm": {
      rank: 1, name: "TFLM on Cortex-M", fam: "arm", color: "#D81B60",
      story: "The mainstream route. Quantize to INT8, export through TensorFlow Lite, and run under TFLM, which calls CMSIS-NN kernels on any Cortex-M part. Take it when mature tooling and portability matter more than peak efficiency.",
      steps: { path: "q:PTQ", strat: "s:uniform", repr: "n:INT8", dev: "f:tf", conv: "f:tflite", run: "f:tflm" },
      can: { path: ["q:PTQ", "q:QAT"], strat: ["s:uniform"], repr: ["n:INT8", "n:INT16"],
             dev: ["f:tf", "f:pytorch"], conv: ["f:tflite", "f:onnx"], run: ["f:tflm", "f:onnxrt", "f:minimal"] },
      implies: ["d:uni", "d:sym", "d:asym", "d:pt", "d:pc", "d:static", "d:calib", "f:cmsis"],
      targets: ["h:stm32", "h:nano33", "h:nrf53", "h:pico", "h:spresense", "h:openmv", "h:apollo"]
    },
    "ai8x": {
      rank: 2, name: "ai8x on MAX78000/78002", fam: "npu", color: "#5E35B1",
      vendorFor: ["h:max000", "h:max002"],
      story: "The tightly coupled CNN-accelerator route, and the accelerator path we would start from today. ai8x-training is a PyTorch fork that trains with the accelerator's constraints in the loop; ai8x-synthesis maps the network into it. This is how sub-8-bit and mixed widths actually reach a shipping device.",
      steps: { path: "q:QAT", strat: "s:uniform", repr: "n:INT8", dev: "f:ai8xt", conv: "f:ai8xs", run: "f:accel" },
      can: { path: ["q:QAT", "q:PTQ"], strat: ["s:uniform", "s:mixed", "s:extreme"],
             repr: ["n:INT8", "n:INT4", "n:INT2", "n:INT1", "n:mixed"],
             dev: ["f:ai8xt"], conv: ["f:ai8xs"], run: ["f:accel"] },
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "r:hwa", "f:pytorch"],
      targets: ["h:max000", "h:max002"]
    },
    "cube": {
      rank: 3, name: "STM32Cube.AI", fam: "arm", color: "#AD1457",
      vendorFor: ["h:stm32"],
      story: "The vendor route on STM32. Cube.AI converts the trained model into embedded C and emits the runtime library that executes it, or hands the network to TFLite Micro instead if you would rather keep a portable runtime. Either way it calls CMSIS-NN underneath on the Cortex-M core, and the conversion and the engine arrive together, which trades some portability for a shorter path to working firmware.",
      steps: { path: "q:PTQ", strat: "s:uniform", repr: "n:INT8", dev: "f:tf", conv: "f:cubeai", run: "f:cubert" },
      can: { path: ["q:PTQ", "q:QAT"], strat: ["s:uniform"], repr: ["n:INT8", "n:INT16"],
             dev: ["f:tf", "f:pytorch"], conv: ["f:cubeai"], run: ["f:cubert", "f:tflm"] },
      implies: ["d:uni", "d:sym", "d:asym", "d:pc", "d:static", "d:calib", "f:cmsis"],
      targets: ["h:stm32"]
    },
    "esp": {
      rank: 4, name: "TFLM + ESP-NN on ESP32", fam: "riscv", color: "#EF6C00",
      vendorFor: ["h:c3", "h:c6", "h:p4"],
      story: "The commercial RISC-V route. The same TensorFlow Lite export as on Cortex-M, run by TFLM with ESP-NN kernels. Take it when a low-cost open-ISA part suffices and a younger toolchain is acceptable.",
      steps: { path: "q:PTQ", strat: "s:uniform", repr: "n:INT8", dev: "f:tf", conv: "f:tflite", run: "f:tflm" },
      can: { path: ["q:PTQ", "q:QAT"], strat: ["s:uniform"], repr: ["n:INT8"],
             dev: ["f:tf", "f:pytorch"], conv: ["f:tflite", "f:onnx"], run: ["f:tflm", "f:ariel"] },
      implies: ["d:uni", "d:asym", "d:pt", "d:static", "d:calib", "f:espnn"],
      targets: ["h:c3", "h:c6", "h:p4"]
    },
    "ethos": {
      rank: 5, name: "Ethos-U toolchain", fam: "npu", color: "#00838F",
      vendorFor: ["h:ethos"],
      story: "The microNPU route. The Ethos-U compiler maps whatever of the network it supports onto the accelerator and leaves the rest on the Cortex-M core, so operator coverage decides how much you actually gain.",
      steps: { path: "q:PTQ", strat: "s:uniform", repr: "n:INT8", dev: "f:tf", conv: "f:ethos", run: "f:accel" },
      can: { path: ["q:PTQ", "q:QAT"], strat: ["s:uniform"], repr: ["n:INT8", "n:INT16"],
             dev: ["f:tf", "f:pytorch"], conv: ["f:ethos"], run: ["f:accel"] },
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "d:calib"],
      targets: ["h:ethos"]
    },
    "neuralart": {
      rank: 6, name: "Neural-ART on STM32N6", fam: "npu", color: "#455A64",
      vendorFor: ["h:n6"],
      story: "ST's accelerator route, and the shortest move from an existing STM32 product to an accelerated one. There is no separate tool to adopt, since STM32Cube.AI compiles for the Neural-ART NPU through the same flow it uses for the Cortex-M parts. Two runtimes arrive with it, because the compiler maps onto the NPU what it can and leaves the rest on the CPU: the Neural-ART runtime drives the accelerator, and the network runtime library Cube.AI emits runs the operators the NPU does not take.",
      steps: { path: "q:PTQ", strat: "s:uniform", repr: "n:INT8", dev: "f:tf", conv: "f:cubeai", run: "f:accel" },
      can: { path: ["q:PTQ", "q:QAT"], strat: ["s:uniform"], repr: ["n:INT8"],
             dev: ["f:tf", "f:pytorch"], conv: ["f:cubeai"], run: ["f:accel"] },
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "d:calib", "f:cubert"],
      targets: ["h:n6"]
    },
    "nxp": {
      rank: 7, name: "TFLite on NXP MCXN", fam: "npu", color: "#6D4C41",
      vendorFor: ["h:mcxn"],
      story: "A middle route: a standard TensorFlow Lite export, executed by the vendor runtime on an integrated NPU, so the accelerator arrives without a bespoke toolchain.",
      steps: { path: "q:QAT", strat: "s:uniform", repr: "n:INT8", dev: "f:tf", conv: "f:tflite", run: "f:accel" },
      can: { path: ["q:QAT", "q:PTQ"], strat: ["s:uniform"], repr: ["n:INT8"],
             dev: ["f:tf", "f:pytorch"], conv: ["f:tflite"], run: ["f:accel"] },
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "d:calib"],
      targets: ["h:mcxn"]
    },
    "tinyengine": {
      rank: 8, name: "TinyEngine NPU on MSPM0", fam: "npu", color: "#827717",
      vendorFor: ["h:mspm0"],
      story: "The smallest accelerator route here, on a Cortex-M0+ part with only tens of kilobytes of SRAM. Its NPU carries widths down to INT2, so it suits a model small enough to be co-designed with the memory rather than fitted to it afterwards. TinyEngine comes out of the MCUNet line of work, so this is a PyTorch flow, and conversion happens inside the vendor tooling rather than as a step you pick.",
      steps: { path: "q:QAT", strat: "s:uniform", repr: "n:INT8", dev: "f:pytorch", conv: null, run: "f:accel" },
      can: { path: ["q:QAT", "q:PTQ"], strat: ["s:uniform", "s:mixed", "s:extreme"],
             repr: ["n:INT8", "n:INT4", "n:INT2", "n:mixed"],
             dev: ["f:pytorch"], conv: [], run: ["f:accel"] },
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "r:hwa"],
      targets: ["h:mspm0"]
    },
    "ei": {
      rank: 9, name: "Edge Impulse", fam: "arm", color: "#F06292",
      story: "The end-to-end route. Data collection, feature extraction, training, quantization, and firmware generation happen in one workflow, which is the fastest way to a working prototype and the least visibility into what it emits.",
      steps: { path: "q:PTQ", strat: "s:uniform", repr: "n:INT8", dev: "f:ei", conv: "f:tflite", run: "f:tflm" },
      can: { path: ["q:PTQ", "q:QAT"], strat: ["s:uniform"], repr: ["n:INT8"],
             dev: ["f:ei"], conv: ["f:tflite"], run: ["f:tflm"] },
      implies: ["d:uni", "d:asym", "d:pt", "d:static", "d:calib", "f:cmsis"],
      targets: ["h:nano33", "h:stm32", "h:nrf53", "h:pico", "h:spresense", "h:openmv"]
    },
    "gapflow": {
      rank: 10, name: "GAPflow on GAP8/GAP9", fam: "npu", color: "#0288D1",
      vendorFor: ["h:gap8", "h:gap9"],
      story: "The clustered-accelerator route, and the one much of the surveyed literature runs on. GAPflow tiles the graph, orchestrates DMA, and generates code for the convolution engine, which is what suits the GAP parts to reaction-critical, parallelizable perception loops such as drones, robotics, and fast activity recognition.",
      steps: { path: "q:PTQ", strat: "s:uniform", repr: "n:INT8", dev: "f:pytorch", conv: "f:gapflow", run: "f:accel" },
      can: { path: ["q:PTQ", "q:QAT"], strat: ["s:uniform", "s:mixed", "s:extreme"],
             repr: ["n:INT8", "n:INT16", "n:INT4", "n:INT2", "n:mixed", "n:FP16"],
             dev: ["f:pytorch", "f:tf"], conv: ["f:gapflow"], run: ["f:accel"] },
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "d:calib", "r:hwa"],
      targets: ["h:gap9", "h:gap8"]
    },
    "pulp": {
      rank: 11, name: "PULP kernels (research)", fam: "riscv", color: "#BF360C",
      caveat: "research platform, not a part you can buy",
      story: "The research route, and the only RISC-V one that reaches below 8 bits. Co-designed kernels and ISA extensions carry mixed and low-bit precision on PULP-class cores, at the cost of leaving commercial silicon behind.",
      steps: { path: "q:QAT", strat: "s:mixed", repr: "n:mixed", dev: "f:pytorch", conv: null, run: "f:pulpnn" },
      can: { path: ["q:QAT", "q:PTQ"], strat: ["s:mixed", "s:extreme", "s:uniform"],
             repr: ["n:INT8", "n:INT4", "n:INT2", "n:mixed"],
             dev: ["f:pytorch"], conv: [], run: ["f:pulpnn", "f:xpulp"] },
      implies: ["d:uni", "d:sym", "d:pc", "d:static", "r:hwa"],
      targets: ["h:pulp"]
    }
  },

  // Widths for the platforms Table 15 does not itemise, so every width the figure
  // offers can be checked against the silicon underneath it.
  platformWidths: {
    "h:stm32":  ["n:INT8", "n:INT16"],
    "h:apollo": ["n:INT8", "n:INT16"],
    "h:max000": ["n:INT1", "n:INT2", "n:INT4", "n:INT8"],
    "h:mcxn":   ["n:INT8"],
    "h:pulp":   ["n:INT2", "n:INT4", "n:INT8", "n:INT16"],
    // listed in the paper's Sections 7-8 but not in Table 15
    "h:openmv": ["n:INT8", "n:INT16"],
    "h:c6":     ["n:INT8"],
    "h:max002": ["n:INT1", "n:INT2", "n:INT4", "n:INT8"],
    "h:mspm0":  ["n:INT2", "n:INT4", "n:INT8"]
  },

  /* Parts a route reaches interchangeably: the same toolchain and the same
     conversion flow, so naming one is a choice of route rather than a choice
     between them. The figure lights both and offers them as a choice instead of
     presenting one as the answer. Widths are checked separately against each
     part, so where the pair differs, GAP8 carrying INT16 and GAP9 INT2, only the
     part that carries the selected width is offered. */
  equivalent: [["h:max000", "h:max002"], ["h:gap8", "h:gap9"]],

  // Choices that come as a pair: taking one pulls the other along wherever a route allows it.
  couples: {
    "n:mixed": ["s:mixed"], "s:mixed": ["n:mixed"],
    "n:INT4": ["s:extreme"], "n:INT2": ["s:extreme"], "n:INT1": ["s:extreme"],
    "s:extreme": ["n:INT2"]
  },

  // An application ranks the toolchains and names the steps the surveyed deployment used.
  // It never restricts what is selectable.
  applications: {
    "Speech":               { prefer: ["tflm", "ai8x"], via: ["q:QAT"], note: "Speech models are always-on, so energy per inference decides. Cortex-M is the low-friction default; move to an accelerator when the audio front end and the model together must fit a hard budget." },
    "Keyword Spotting":     { prefer: ["tflm", "ai8x", "nxp"], via: ["q:QAT"], note: "Keyword spotting is small and permanently listening. Start on Cortex-M, and move to an accelerator when the duty cycle is high enough that inference energy dominates the power budget." },
    "Object Detection":     { prefer: ["ai8x", "gapflow", "tflm"], via: ["q:QAT", "h:max000"], note: "Detection is where accelerators pay off most, and the surveyed work runs on the MAX78000 and the GAP9. On Cortex-M it is confined to tiny detectors at low frame rates." },
    "Image Classification": { prefer: ["ai8x", "gapflow", "tflm"], via: ["q:QAT", "h:max002"], note: "Compact classifiers fit Cortex-M at modest input resolution; an accelerator extends resolution and frame rate at lower energy." },
    "Face Recognition":     { prefer: ["ai8x", "gapflow"], via: ["q:QAT", "h:max002"], note: "Input resolution and embedding networks put face recognition beyond real-time Cortex-M execution, so plan on an accelerator from the start. The surveyed result used INT16 on a GAP8, which the GAP route still reaches." },
    "Segmentation":         { prefer: ["ai8x", "gapflow", "ethos"], note: "Dense per-pixel output needs an accelerator, and needs its toolchain to cover the upsampling operators, which is where these flows most often stop." },
    "Surveillance":         { prefer: ["ai8x", "gapflow", "ethos"], note: "Always-on camera pipelines pair an accelerator with aggressive duty-cycling of the sensor and the radio, which usually dominate the energy budget." },
    "VQA":                  { prefer: ["ethos", "gapflow", "neuralart"], note: "Multimodal models need an accelerator and a toolchain that covers attention operators. Expect the operator gap of challenge 10.1 and the architecture gap of 10.3 before the arithmetic becomes the problem." },
    "HAR":                  { prefer: ["tflm", "gapflow", "ai8x"], via: ["q:PTQ", "h:stm32"], note: "Inertial activity recognition is the archetypal Cortex-M workload. An accelerator suits fast multi-sensor loops where reaction time matters." },
    "Healthcare":           { prefer: ["tflm", "gapflow", "ai8x", "esp"], via: ["q:QAT", "h:stm32"], note: "Physiological-signal models run on all three families. Choose by the signal's dimensionality, by certification and tooling constraints, and only then by raw efficiency." },
    "Wearables":            { prefer: ["ai8x", "gapflow", "tflm"], via: ["q:QAT", "h:max002"], note: "Wearables trade the accelerator's energy per inference against the simpler Cortex-M stack. Hearing aids on the GAP9 showed how far the accelerator side of that trade reaches, and the MAX7800x is where to reproduce it today." },
    "Networking":           { prefer: ["tflm", "ai8x"], via: ["q:PTQ", "h:stm32"], note: "Packet- and flow-level classifiers are small and latency-tolerant, so Cortex-M is the default. An accelerator brings sub-millisecond inference when the whole model fits inside it." },
    "Environment":          { prefer: ["tflm", "ei", "ai8x"], via: ["q:PTQ", "h:stm32"], note: "Environmental sensing is long-duty-cycle and battery-bound, so the mature Cortex-M stack is the default; accelerators help once acoustic or image inputs are involved." },
    "Agriculture":          { prefer: ["tflm", "gapflow", "ai8x"], via: ["q:PTQ", "h:stm32"], note: "Low-rate environmental inputs sit comfortably on Cortex-M; camera-based crop and livestock monitoring wants an accelerator. The surveyed deployment used a GAP8, which is now a reference rather than a recommendation." },
    "Industrial":           { prefer: ["esp", "tflm"], via: ["q:PTQ", "h:c3"], note: "Vibration and condition-monitoring classifiers are compact one-dimensional models. Both families suffice; RISC-V is attractive where unit cost and an open ISA matter." },
    "Anomaly Detection":    { prefer: ["ai8x", "tflm"], via: ["q:QAT", "h:max000"], note: "Anomaly detectors are small but always-on, so energy per inference decides. Accelerators reach milliwatt operation; Cortex-M remains the low-friction alternative." },
    "Spectrum Sensing":     { prefer: ["tflm", "ai8x"], via: ["q:QAT", "h:spresense"], note: "Spectrum sensing is a one-dimensional pipeline that Cortex-M handles at the reported sample rates. An accelerator becomes relevant for wideband inputs or tighter latency budgets." },
    "DSP":                  { prefer: ["tflm", "ai8x"], note: "Classical DSP front ends run on Cortex-M with its DSP kernels; neural DSP pipelines move to the accelerator." },
    "Robotics":             { prefer: ["esp", "gapflow", "ai8x"], via: ["q:PTQ", "h:p4"], note: "The dual-core ESP32-P4 handles steering and throttle models directly. Reaction-critical perception loops want an accelerator, which historically meant the GAP family and now means the MAX7800x." },
    "Drones":               { prefer: ["gapflow", "ai8x", "tflm"], via: ["q:PTQ", "h:gap9"], note: "Drone perception is parallelizable, latency-bound, and power-limited, so it wants an accelerator. The surveyed work runs on GAP8 and GAP9, whose clustered cores, DMA, and tiling suit exactly this kind of loop. Cortex-M remains a fallback for the lightest navigation models." },
    "Education":            { prefer: ["tflm", "ei"], via: ["q:QAT", "h:spresense"], note: "Teaching platforms favour the most reproducible path, which is a Cortex-M board with a workflow that hides as little as possible behind vendor tooling." }
  },

  // Techniques that apply on any route rather than selecting between them.
  free: ["r:redis", "r:dagn", "r:hwa"],

  // Short explanations shown when a method, format, tool or platform is selected.
  notes: {
    "q:PTQ": "Post-training quantization is the right default on every route: the strongest balance between memory reduction, effort, and accuracy retention.",
    "q:QAT": "Quantization-aware training is where accuracy must survive compression, and the only way to reach sub-8-bit widths on the accelerators that accept them.",
    "q:qt": "Quantized training carries quantization into the training process itself, including the backward pass. Section 5.7 finds it markedly less mature than PTQ and QAT for MCU deployment, and no runtime in this stack supports it, so it remains a research direction rather than a route you can take today. It is what challenge 10.6 would have to unlock.",
    "s:uniform": "One bit-width for the whole network, INT8 in practice, is the best default on every route. Not to be confused with a uniform grid, which is about how the levels are spaced.",
    "s:mixed": "Mixed precision pays off when profiling reveals clear layer sensitivity and the runtime can exploit finer-grained control, which means a toolchain and a part that both accept more than one width.",
    "s:extreme": "Extreme low-bit networks are most justifiable when flash or bandwidth is the dominant bottleneck. They reach a device through a toolchain that accepts the width, trained with QAT.",
    "r:hwa": "Hardware-aware quantization matters most on the accelerator routes, where operator and format support decide what the toolchain will accept. It applies alongside any route rather than instead of one.",
    "r:redis": "Redistribution reshapes weight or activation distributions before quantizing, and mostly pays off at low bit-widths. It applies alongside any route.",
    "r:dagn": "Data-agnostic methods matter when calibration data cannot leave the device or does not exist. They apply alongside any route.",
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
    "n:INT16": "INT16 buys accuracy headroom at twice the memory, and only the platforms that list it can carry it.",
    "n:mixed": "Several widths in one network, assigned per layer, per channel, per group, or separately to weights and activations. It needs a toolchain that can express more than one width and a part that carries them.",
    "n:FP16": "No MCU here lists FP16 among its formats; the one reported use ran on the GAP9 cluster cores rather than its accelerator.",
    "n:posit": "Posit widens dynamic range at the same bit-width, but no mainstream runtime or MCU silicon executes it, so the route stops at this step. Research hardware such as PHEE is where it currently ends.",
    "n:takum": "Takum keeps Posit's tapered precision with a bounded regime and, like Posit, has no MCU runtime or silicon beneath it yet.",
    "n:BF16": "BF16 is a training-side format. No MCU runtime or platform in this stack executes it.",
    "n:FP8": "FP8 has no MCU runtime or platform beneath it in this stack.",
    "n:MSFP": "Block floating-point has no MCU runtime or platform beneath it in this stack.",
    "n:afx": "Adaptive fixed-point formats need dedicated hardware support that no platform here provides.",
    "f:cmsis": "CMSIS-NN sits underneath TFLM on the Cortex-M routes rather than being chosen separately.",
    "f:espnn": "ESP-NN sits underneath TFLM on the ESP32 parts, the way CMSIS-NN does on Cortex-M.",
    "f:accel": "The vendor runtime that drives the accelerator: ai8x firmware on the MAX7800x, the GAP SDK, the Ethos-U driver, or the Neural-ART runtime.",
    "f:cubert": "The network runtime library STM32Cube.AI emits alongside the converted C. Cube.AI only converts, so this is what executes the model on the part; the same flow can target TFLite Micro instead when portability matters more. On the STM32N6 it runs the operators the Neural-ART NPU does not take.",
    "f:ai8xt": "ai8x-training is a PyTorch fork that trains with the MAX7800x accelerator's constraints in the loop, so choosing it is a PyTorch flow.",
    "f:pytorch": "PyTorch reaches every family. On the MAX7800x it arrives as ai8x-training, the fork that trains with the accelerator's constraints in the loop.",
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
