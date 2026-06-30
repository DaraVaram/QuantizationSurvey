/* =========================================================================
   data.js — All structured data transcribed faithfully from the paper.
   Tables, taxonomy, and platform data for interactive rendering.
   Citation keys map to window.CITEMAP (see refs.js) for [n] numbering.
   ========================================================================= */

window.DATA = {

/* ----------------------------------------------------------------------
   TABLE I — Scope comparison of surveys (tab:survey-scope)
   cells: "yes" | "partial" | ""  ;  hw: subset of ["arm","risc","hybrid"]
---------------------------------------------------------------------- */
surveyScope: {
  columns: ["Primary Quantization","Advanced Quantization","Numeric Representations",
            "Hardware Landscape","Software Frameworks","Applications"],
  rows: [
    {paper:"Gholami et al.",  key:"gholami2022survey",      year:2022, primary:"yes", advanced:"yes",     numeric:"",        hw:["arm","risc"],         software:"",    apps:""},
    {paper:"Orășan et al.",   key:"lucan2022brief",         year:2022, primary:"",    advanced:"",        numeric:"",        hw:["arm"],                software:"yes", apps:"yes"},
    {paper:"Giordano et al.", key:"giordano2022survey",     year:2022, primary:"",    advanced:"",        numeric:"",        hw:["arm","risc","hybrid"],software:"",    apps:""},
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
    {paper:"Somvanshi et al.",key:"somvanshi2025tiny",      year:2025, primary:"yes", advanced:"partial", numeric:"partial", hw:["arm","risc","hybrid"],software:"yes", apps:"yes"},
    {paper:"Lê et al.",       key:"tri2026efficient",       year:2026, primary:"yes", advanced:"partial", numeric:"partial", hw:["arm","risc"],         software:"yes", apps:"partial"},
    {paper:"Ours",            key:null,                     year:2026, primary:"yes", advanced:"yes",     numeric:"yes",     hw:["arm","risc","hybrid"],software:"yes", apps:"yes", ours:true}
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
   hwPath:"Inference on the Cortex-M cores, without a dedicated accelerator, using integer and DSP-optimized kernels under tight on-chip SRAM and flash limits.",
   swPath:"TFLM and LiteRT for Microcontrollers with CMSIS-NN kernels, together with STM32Cube.AI or Edge Impulse for vendor-integrated and end-to-end code generation.",
   impl:"Most reproducible baseline for modest-depth sensing workloads, including HAR, environmental monitoring, speech and keyword spotting, networking, spectrum sensing, and lightweight vision or healthcare tasks, where mature tooling and portability matter more than aggressive precision flexibility."},
  {family:"RISC-V-Based",
   hwPath:"Inference on commercial MCUs such as the ESP32-C and ESP32-P families, using packed integer arithmetic, SIMD, and ISA extensions on the programmable CPU path, without a dedicated neural accelerator.",
   swPath:"TFLM and ESP-NN on commercial ESP32 devices, with vendor and community toolchains that remain less standardized than the Cortex-M ecosystem.",
   impl:"Demonstrates feasible healthcare, industrial monitoring, and robotics deployment, but with a smaller and more recent application base and less mature tooling than ARM."},
  {family:"NPU-integrated",
   hwPath:"Accelerator-backed convolution, matrix, or operator-specific kernels with CPU orchestration, spanning tightly coupled CNN engines and clustered RISC-V with dedicated convolution acceleration (the GAP family, using the HWCE on GAP8 and the NE16 on GAP9), under device-specific on-chip memory partitioning.",
   swPath:"ai8x training and synthesis, GAPFlow with nntool and Autotiler, Ethos-U tooling, and Neural-ART runtimes that map compatible graphs to the accelerator.",
   impl:"State-of-the-art family for latency- and energy-critical workloads, including object detection, drone navigation, audio and speech, healthcare, human activity recognition, anomaly detection, environmental sensing, and compact vision or DSP pipelines, provided the model fits the accelerator's supported operators, tensor layouts, precision formats, and memory limits."}
],

/* ----------------------------------------------------------------------
   APPLICATION TABLES — ARM / RISC-V / NPU
   numeric fields (lat_n, mem_n, perf_n) are representative values for the
   interactive scatter only; the displayed strings are the source of truth.
---------------------------------------------------------------------- */
apps: {
  arm: [
    {key:"ulkar2021ultra", cat:"Speech", quant:"INT8 QAT", devices:"ARM Cortex-M4F", fw:"PyTorch", perf:"96.30% Acc.", power:"11.2 mJ", lat:"905", mem:"419.8", perf_n:96.30, lat_n:905, mem_n:419.8},
    {key:"moosmann2023tinyissimoyolo", cat:"Object Detection", quant:"INT8 QAT", devices:"STM32H7A3, STM32L4R9, Apollo4b", fw:"TFLM", perf:"43.50–75.40% mAP", power:"41.8 mJ, 102 mJ, 6.08 mJ", lat:"359, 996, 540", mem:"350–422", perf_n:75.40, lat_n:359, mem_n:386},
    {key:"kang2024device", cat:"HAR", quant:"INT8 PTQ", devices:"STM32F756ZG", fw:"PyTorch", perf:"91.04–98.29% Acc.", power:"4.50–8.77 mJ, 0.035–0.063 mJ", lat:"20.70–39.76, 1.11–1.93", mem:"37.8–44.7", perf_n:98.29, lat_n:30, mem_n:41.2},
    {key:"chehade2025energy", cat:"Networking", quant:"INT8 PTQ", devices:"STM32F746G, Nucleo-F401RE", fw:"TFLM, STM32Cube.AI", perf:"96.59% Acc.", power:"7.86 mJ, 29.10 mJ", lat:"31.43, 115.40", mem:"353", perf_n:96.59, lat_n:31.43, mem_n:353},
    {key:"cerioli2025efficient", cat:"Environment", quant:"INT8 PTQ", devices:"STM32H747XI, nRF52840, ESP32-PICO-D4", fw:"ONNX Runtime, NeuralCasting, TensorFlow Lite", perf:"98.5–99.1% Acc.", power:"600 mW, 100 mW, 2500 mW", lat:"0.034–0.246, 0.034–0.252, 0.308–2.001, 0.040–0.262", mem:"140–580", perf_n:99.1, lat_n:0.25, mem_n:360},
    {key:"abushahla2025real", cat:"Education", quant:"INT8 QAT", devices:"Sony Spresense, OpenMV Cam H7, H7 Plus", fw:"TFLM", perf:"93.60–98.73% Acc.", power:"494–884 mW, 1238–1609 mW", lat:"0.63, 0.08, 2.88–12.84", mem:"2900, 340", perf_n:98.73, lat_n:2.88, mem_n:340},
    {key:"abushahla2025cognitive", cat:"Spectrum Sensing", quant:"INT8 QAT", devices:"Sony Spresense", fw:"TFLM", perf:"92.63–99.94% F1, 70.55–99.09% F1", power:"52–54 mW, 44–52 mW", lat:"5.54–37.37, 1.18–5.20", mem:"23.8–72.6, 12.8–19.6", perf_n:99.94, lat_n:5.54, mem_n:30},
    {key:"zhou2025efficient", cat:"HAR", quant:"UINT8 PTQ", devices:"Arduino Nano 33 BLE Sense Rev2", fw:"TFLM, EdgeImpulse", perf:"97.09% Acc.", power:"21 mW", lat:"21", mem:"189.6", perf_n:97.09, lat_n:21, mem_n:189.6},
    {key:"dabbous2024benchmarking", cat:"Environment", quant:"INT8 QAT", devices:"STM32H7, Arduino Nano 33 BLE Sense Rev2", fw:"TFLM, STM32Cube.AI", perf:"99.63% Acc.", power:"227.86 mW, 1.43 mW, 9 mW", lat:"30.25, 522.15, 1.45", mem:"—", perf_n:99.63, lat_n:30.25, mem_n:null},
    {key:"rostami2024real", cat:"Healthcare", quant:"INT8 QAT, PQAT, PTQ", devices:"STM32H743iit6, STM32H750vbt6", fw:"TFLM", perf:"84.78–87.76% Acc.", power:"840 mW, 945 mW", lat:"6230, 6300", mem:"860", perf_n:87.76, lat_n:6230, mem_n:860}
  ],
  riscv: [
    {key:"rattanasak2025lightweight", cat:"Healthcare", quant:"INT8 PTQ", devices:"ESP32-C6", fw:"TFLM", perf:"88.64 ± 1.56% F1, 90.05 ± 1.60% Sens., 87.29 ± 1.54% Prec.", power:"179.8 mW", lat:"630", mem:"310", perf_n:88.64, lat_n:630, mem_n:310},
    {key:"banerjee2026device", cat:"Industrial", quant:"INT8 PTQ", devices:"ESP32-C3", fw:"TFLM", perf:"95.00% macro-F1", power:"6.77 mJ", lat:"82±7", mem:"80", perf_n:95.00, lat_n:82, mem_n:80},
    {key:"roy2026tinynav", cat:"Robotics", quant:"INT8 PTQ", devices:"ESP32-P4", fw:"TFLM, ESP-NN", perf:"40 laps collision-free, 99.84% Steer Acc., 99.79% Throttle Acc.", power:"—", lat:"30", mem:"~23", perf_n:99.84, lat_n:30, mem_n:23}
  ],
  npu: [
    {key:"balbi2024ultra", cat:"Networking", quant:"INT8 PTQ", devices:"MAX78000", fw:"PyTorch, ai8x-tools", perf:"94.87% Acc.", power:"0.005 mJ", lat:"0.104", mem:"<432", perf_n:94.87, lat_n:0.104, mem_n:432},
    {key:"jakuvs2025implementing", cat:"Keyword Spotting", quant:"INT8 QAT", devices:"NXP MCXN94", fw:"TFLite", perf:"97.06% Acc.", power:"—", lat:"3.847", mem:"30.6", perf_n:97.06, lat_n:3.847, mem_n:30.6},
    {key:"gong2024dex", cat:"Image Classification", quant:"INT8 QAT", devices:"MAX78000, MAX78002", fw:"PyTorch, ai8x-tools", perf:"19.80–62.00% Acc.", power:"0.14–0.4 mJ", lat:"2–13", mem:"171.2–1330.7", perf_n:62.00, lat_n:7, mem_n:750},
    {key:"zemlyanikin2019512kib", cat:"Face Recognition", quant:"INT16 PTQ", devices:"GAP8", fw:"PyTorch, GAP8 Autotiler", perf:"93.00–96.33% Acc.", power:"—", lat:"<1000", mem:"1500", perf_n:96.33, lat_n:1000, mem_n:1500},
    {key:"moosmann2023tinyissimoyolo", cat:"Object Detection", quant:"INT8 QAT", devices:"MAX78000", fw:"PyTorch, ai8x-tools", perf:"43.50–75.40% mAP", power:"0.19 mJ", lat:"5.5", mem:"350–422", perf_n:75.40, lat_n:5.5, mem_n:386},
    {key:"moosmann2024ultra", cat:"Object Detection", quant:"INT8 PTQ", devices:"GAP9", fw:"PyTorch", perf:"14.00–49.00% mAP", power:"54 mW", lat:"56.45", mem:"<1000", perf_n:49.00, lat_n:56.45, mem_n:1000},
    {key:"kang2024device", cat:"HAR", quant:"INT8 PTQ", devices:"GAP9", fw:"PyTorch", perf:"91.04–98.29% Acc.", power:"0.035–0.063 mJ", lat:"1.11–1.93", mem:"37.8–44.7", perf_n:98.29, lat_n:1.5, mem_n:41.2},
    {key:"van2023real", cat:"Healthcare", quant:"INT8 QAT", devices:"MAX78002", fw:"PyTorch, ai8x-synthesis", perf:"94.60% AUC", power:"18 mW", lat:"0.248", mem:"25.156", perf_n:94.60, lat_n:0.248, mem_n:25.156},
    {key:"busia2025endoscopy", cat:"Healthcare", quant:"INT8 PTQ", devices:"GAP9", fw:"PyTorch", perf:"98.5% Acc.", power:"30.6 mW", lat:"61", mem:"750", perf_n:98.5, lat_n:61, mem_n:750},
    {key:"ibrahim2024end", cat:"Healthcare", quant:"INT8 QAT", devices:"Ethos-U55", fw:"PyTorch", perf:"94.25% Acc.", power:"2×10⁻⁸ mJ", lat:"5", mem:"<32", perf_n:94.25, lat_n:5, mem_n:32},
    {key:"lightbody2022host", cat:"Anomaly Detection", quant:"INT8 QAT", devices:"MAX78000", fw:"PyTorch", perf:"87.19–99.95% Acc.", power:"15 mW", lat:"2.556", mem:"55.9", perf_n:99.95, lat_n:2.556, mem_n:55.9},
    {key:"ingaleshwar2024wildlife", cat:"Environment", quant:"INT8 PTQ", devices:"MAX78000", fw:"PyTorch, ai8x-tools", perf:"79.67–86.53% F1", power:"0.885–4.275 mJ", lat:"4–27.5", mem:"100–460", perf_n:86.53, lat_n:15, mem_n:280},
    {key:"zhou2023solving", cat:"Drones", quant:"INT8 PTQ", devices:"GAP8", fw:"TFLite, GAP8 Autotiler", perf:"98.80% Acc., 57.20% Succ. Rate", power:"130 mW", lat:"35.71", mem:"292", perf_n:98.80, lat_n:35.71, mem_n:292},
    {key:"crupi2025efficient", cat:"Drones", quant:"INT8, FP16 PTQ", devices:"GAP9", fw:"nntool", perf:"79.00% mAP, 80.00% mAP", power:"34–41 mW", lat:"147–462", mem:"1800–3600", perf_n:80.00, lat_n:300, mem_n:2700},
    {key:"rashid2025hac", cat:"Agriculture", quant:"INT8 PTQ", devices:"GAP8", fw:"TFLM", perf:"95.00% Acc.", power:"378 mW", lat:"37.6", mem:"49.6", perf_n:95.00, lat_n:37.6, mem_n:49.6}
  ]
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
