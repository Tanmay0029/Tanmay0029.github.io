/**
 * Creative & Interactive Effects - Tanmay Agrawal Portfolio
 * 1. Multi-Theme Hero Animation & Live Switcher
 * 2. 3D Card Tilt Effects
 * 3. Command Palette (Ctrl + K)
 * 4. Interactive In-Browser SQL Console
 * 5. Medallion Pipeline Explorer
 */

(function() {
  "use strict";

  // =========================================================================
  // 1. Multi-Theme Hero Animation Engine & Live Switcher
  // =========================================================================
  let currentHeroTheme = "minimal-titanium"; // Default: onyx-gold, minimal-titanium, emerald-matrix, gotham-crimson

  function initHeroAnimation() {
    const canvas = document.getElementById("data-network-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0;
    let animId;

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    function resize() {
      const parent = canvas.parentElement;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", function(e) {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY <= rect.bottom + 100 && e.clientY >= rect.top - 100) {
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
      } else {
        mouse.targetX = -1000;
        mouse.targetY = -1000;
      }
    });

    window.addEventListener("mouseleave", function() {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    });

    // -----------------------------------------------------------------------
    // State 1: Onyx Gold Horizon Grid
    // -----------------------------------------------------------------------
    let gridOffset = 0;
    const goldBeacons = [];
    for (let i = 0; i < 18; i++) {
      goldBeacons.push({
        x: Math.random(),
        yRatio: Math.random() * 0.45 + 0.55,
        size: Math.random() * 2 + 1,
        speed: (Math.random() - 0.5) * 0.0008,
        pulse: Math.random() * Math.PI * 2
      });
    }

    function renderOnyxGold(time) {
      gridOffset = (gridOffset + 0.002) % 0.1;
      const horizonY = height * 0.56;
      const mouseFactorX = mouse.x > -500 ? (mouse.x - width * 0.5) * 0.15 : 0;
      const mouseFactorY = mouse.y > -500 ? (mouse.y - height * 0.5) * 0.1 : 0;
      const vanishX = width * 0.5 + mouseFactorX;
      const vanishY = height * 0.46 + mouseFactorY;

      // Ambient horizon glow
      const glowGrad = ctx.createRadialGradient(vanishX, vanishY, 10, vanishX, vanishY, Math.max(width, height) * 0.5);
      glowGrad.addColorStop(0, "rgba(255, 189, 57, 0.13)");
      glowGrad.addColorStop(0.5, "rgba(255, 189, 57, 0.03)");
      glowGrad.addColorStop(1, "rgba(10, 11, 14, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Perspective grid lines radiating downwards
      const lineCount = 18;
      ctx.strokeStyle = "rgba(255, 189, 57, 0.18)";
      ctx.lineWidth = 1;

      for (let i = -lineCount / 2; i <= lineCount / 2; i++) {
        const bottomX = width * 0.5 + i * (width / (lineCount * 0.65)) + mouseFactorX * 1.5;
        ctx.beginPath();
        ctx.moveTo(vanishX, vanishY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizontal perspective grid steps
      const hSteps = 9;
      for (let j = 0; j < hSteps; j++) {
        const ratio = ((j / hSteps) + gridOffset) % 1.0;
        const y = horizonY + (height - horizonY) * Math.pow(ratio, 2.2);
        const alpha = Math.pow(ratio, 1.4) * 0.35;
        ctx.strokeStyle = `rgba(255, 189, 57, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Horizon separator beam
      ctx.strokeStyle = "rgba(255, 189, 57, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();

      // Floating gold telemetry beacons
      for (let b of goldBeacons) {
        b.x = (b.x + b.speed + 1) % 1;
        b.pulse += 0.03;
        const bx = b.x * width;
        const by = height * b.yRatio;
        const bAlpha = 0.4 + Math.sin(b.pulse) * 0.35;

        ctx.beginPath();
        ctx.arc(bx, by, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 189, 57, ${bAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 189, 57, 0.8)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // -----------------------------------------------------------------------
    // State 2: Minimalist Monochromatic Titanium (Spotlight & Topography)
    // -----------------------------------------------------------------------
    let topoPhase = 0;
    function renderMinimalTitanium(time) {
      topoPhase += 0.004;

      // Soft cursor spotlight
      if (mouse.x > -500) {
        const spot = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, 340);
        spot.addColorStop(0, "rgba(255, 255, 255, 0.07)");
        spot.addColorStop(0.5, "rgba(255, 255, 255, 0.02)");
        spot.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = spot;
        ctx.fillRect(0, 0, width, height);
      }

      // Elegant topographic isolines
      const curves = 6;
      for (let c = 0; c < curves; c++) {
        const baseY = height * (0.35 + (c / curves) * 0.55);
        ctx.beginPath();
        ctx.moveTo(0, baseY);

        for (let x = 0; x <= width; x += 15) {
          const wave = Math.sin(x * 0.0025 + topoPhase + c * 0.8) * 35 +
                       Math.cos(x * 0.0045 - topoPhase * 0.7) * 18;
          const py = baseY + wave;

          // Proximity highlight to cursor
          let alpha = 0.07;
          if (mouse.x > -500) {
            const dx = x - mouse.x;
            const dy = py - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 220) {
              alpha += (1 - d / 220) * 0.28;
            }
          }

          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.lineTo(x, py);
        }
        ctx.stroke();
      }
    }

    // -----------------------------------------------------------------------
    // State 3: Cyber Emerald & Mint (Neural AI Graph & Moving Packets)
    // -----------------------------------------------------------------------
    const emeraldNodes = [];
    const nodeCount = 38;
    for (let i = 0; i < nodeCount; i++) {
      emeraldNodes.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 800),
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 2 + 1.5,
        color: Math.random() > 0.4 ? "16, 185, 129" : "52, 211, 153"
      });
    }

    // Data packets travelling between nodes
    const packets = [
      { from: 0, to: 1, progress: 0, speed: 0.015 },
      { from: 4, to: 7, progress: 0.3, speed: 0.02 },
      { from: 10, to: 12, progress: 0.6, speed: 0.018 },
      { from: 15, to: 18, progress: 0.1, speed: 0.012 },
      { from: 22, to: 25, progress: 0.8, speed: 0.022 }
    ];

    function renderEmeraldNetwork(time) {
      // Update nodes
      for (let n of emeraldNodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse attraction
        if (mouse.x > -500) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 170) {
            const f = (170 - dist) / 170;
            n.x += (dx / dist) * f * 1.5;
            n.y += (dy / dist) * f * 1.5;
          }
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${n.color}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${n.color}, 0.7)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Connect nodes
      const maxD = 135;
      for (let i = 0; i < emeraldNodes.length; i++) {
        for (let j = i + 1; j < emeraldNodes.length; j++) {
          const dx = emeraldNodes[i].x - emeraldNodes[j].x;
          const dy = emeraldNodes[i].y - emeraldNodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxD) {
            const alpha = (1 - d / maxD) * 0.28;
            ctx.beginPath();
            ctx.moveTo(emeraldNodes[i].x, emeraldNodes[i].y);
            ctx.lineTo(emeraldNodes[j].x, emeraldNodes[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Render traveling packets
      for (let p of packets) {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.from = Math.floor(Math.random() * emeraldNodes.length);
          p.to = (p.from + Math.floor(Math.random() * 5) + 1) % emeraldNodes.length;
        }

        const n1 = emeraldNodes[p.from];
        const n2 = emeraldNodes[p.to];
        if (n1 && n2) {
          const px = n1.x + (n2.x - n1.x) * p.progress;
          const py = n1.y + (n2.y - n1.y) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#34d399";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    // -----------------------------------------------------------------------
    // State 4: Gotham Stealth & Crimson Web (Batman / Spider-Man Tribute)
    // -----------------------------------------------------------------------
    let webRotation = 0;
    const webRings = 7;
    const webSpokes = 12;

    function renderGothamCrimson(time) {
      webRotation += 0.0012;
      const originX = mouse.x > -500 ? width * 0.5 + (mouse.x - width * 0.5) * 0.25 : width * 0.5;
      const originY = mouse.y > -500 ? height * 0.5 + (mouse.y - height * 0.5) * 0.25 : height * 0.5;
      const maxR = Math.max(width, height) * 0.65;

      // Subtle ambient radar pulse
      const radar = ctx.createRadialGradient(originX, originY, 10, originX, originY, maxR * 0.8);
      radar.addColorStop(0, "rgba(244, 63, 94, 0.07)");
      radar.addColorStop(0.5, "rgba(244, 63, 94, 0.02)");
      radar.addColorStop(1, "rgba(5, 6, 8, 0)");
      ctx.fillStyle = radar;
      ctx.fillRect(0, 0, width, height);

      // Radial web struts
      ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
      ctx.lineWidth = 1;

      for (let s = 0; s < webSpokes; s++) {
        const angle = (s / webSpokes) * Math.PI * 2 + webRotation;
        const ex = originX + Math.cos(angle) * maxR;
        const ey = originY + Math.sin(angle) * maxR;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }

      // Concentric web rings
      for (let r = 1; r <= webRings; r++) {
        const ringRadius = (r / webRings) * maxR;
        ctx.beginPath();

        for (let s = 0; s <= webSpokes; s++) {
          const angle = (s / webSpokes) * Math.PI * 2 + webRotation;
          const px = originX + Math.cos(angle) * ringRadius;
          const py = originY + Math.sin(angle) * ringRadius;

          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);

          // Glowing crimson node at intersection
          if (r % 2 === 0 && s < webSpokes) {
            let nSize = 2.5;
            let nAlpha = 0.5;

            // Vibrate if mouse close
            if (mouse.x > -500) {
              const d = Math.hypot(px - mouse.x, py - mouse.y);
              if (d < 140) {
                nSize = 4.2;
                nAlpha = 0.95;
              }
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(px, py, nSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(244, 63, 94, ${nAlpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#f43f5e";
            ctx.fill();
            ctx.restore();
          }
        }
        ctx.strokeStyle = `rgba(244, 63, 94, ${0.08 + (r / webRings) * 0.08})`;
        ctx.stroke();
      }
    }

    // -----------------------------------------------------------------------
    // Main Animation Loop
    // -----------------------------------------------------------------------
    function render(time) {
      // Smooth mouse spring
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      if (currentHeroTheme === "onyx-gold") {
        renderOnyxGold(time);
      } else if (currentHeroTheme === "minimal-titanium") {
        renderMinimalTitanium(time);
      } else if (currentHeroTheme === "emerald-matrix") {
        renderEmeraldNetwork(time);
      } else if (currentHeroTheme === "gotham-crimson") {
        renderGothamCrimson(time);
      } else {
        renderOnyxGold(time);
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
  }

  // =========================================================================
  // Theme Switcher Controller
  // =========================================================================
  function initHeroThemeSwitcher() {
    const heroSection = document.getElementById("home-section");
    const pillBtns = document.querySelectorAll(".theme-pill-btn");
    if (!heroSection) return;

    const savedTheme = localStorage.getItem("tanmay_hero_theme") || "minimal-titanium";
    setTheme(savedTheme, false);

    pillBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        const theme = this.getAttribute("data-theme");
        setTheme(theme, true);
      });
    });

    function setTheme(themeName, save) {
      currentHeroTheme = themeName;
      if (save) {
        localStorage.setItem("tanmay_hero_theme", themeName);
      }

      // Update button active state
      pillBtns.forEach(btn => {
        if (btn.getAttribute("data-theme") === themeName) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      // Update CSS class on both heroSection and document.body for global button/accent adaptation
      const themeClasses = ["theme-onyx-gold", "theme-minimal-titanium", "theme-emerald-matrix", "theme-gotham-crimson"];
      document.body.classList.remove(...themeClasses);
      document.body.classList.add(`theme-${themeName}`);

      heroSection.classList.remove(...themeClasses);
      heroSection.classList.add(`theme-${themeName}`);
    }

    // Expose for Command Palette or console
    window.switchHeroTheme = setTheme;
  }

  // =========================================================================
  // 2. 3D Card Tilt Effects
  // =========================================================================
  function initCardTilt() {
    const tiltCards = document.querySelectorAll(".project-card, .timeline-card, .impact-counter-card");

    tiltCards.forEach(card => {
      card.addEventListener("mousemove", function(e) {
        if (window.innerWidth < 992) return; // Disable on mobile/tablet for performance
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener("mouseleave", function() {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
      });
    });
  }

  // =========================================================================
  // 3. Interactive In-Browser SQL Console
  // =========================================================================
  const careerDB = {
    projects: [
      { id: 1, project: "Enterprise Medallion Data Warehouse & Power BI", stack: "SQL Server, T-SQL, Power BI, DAX", records: "100K+ Sales", category: "Data Warehouse" },
      { id: 2, project: "Retail Analytics & Customer Intelligence", stack: "SQL Server, Power BI, RFM, Cohort", records: "1M+ Transactions", category: "Business Intelligence" },
      { id: 3, project: "Placement Mail Automation", stack: "Python, GPT-4o, Gmail API, Pandas", records: "80% Time Saved", category: "AI & Automation" },
      { id: 4, project: "Multi-Tenant Clinic Management System", stack: "PostgreSQL, FastAPI, Docker, React", records: "Full Clinic Ops", category: "Data Backend" },
      { id: 5, project: "Tomato Leaf Disease Prediction", stack: "Python, ResNet152V2, TensorFlow, Flask", records: "98.2% Accuracy", category: "Computer Vision" }
    ],
    experience: [
      { company: "Zenoti India Private Limited", role: "SDE Intern (Data & Backend)", period: "Jan 2026 – Jul 2026", impact: "Fixed export defect; eliminated 6 OWASP data vulnerabilities; 12 API specs; resolved 10+ incidents across 30+ pages." },
      { company: "Aligned Automation", role: "AI and Python Intern", period: "Dec 2024 – Jan 2025", impact: "DirectML GPU acceleration (90% faster inference); 35% system failure reduction via structured pipelines." }
    ],
    skills: [
      { skill: "SQL Server / T-SQL", category: "Data Analytics", level: "Advanced" },
      { skill: "Power BI (DAX / Power Query)", category: "Data Analytics", level: "Advanced" },
      { skill: "Medallion (Bronze/Silver/Gold)", category: "Data Architecture", level: "Expert" },
      { skill: "Star Schema & Dimensional Modeling", category: "Data Architecture", level: "Advanced" },
      { skill: "Python (Pandas, NumPy)", category: "Languages & Analytics", level: "Advanced" },
      { skill: "FastAPI / PostgreSQL", category: "Data Backend", level: "Intermediate" },
      { skill: "RFM & Cohort Analysis", category: "Business Intelligence", level: "Advanced" }
    ],
    metrics: [
      { metric: "Transactions Modeled", value: "1,000,000+", scope: "Retail Data Warehouse" },
      { metric: "VIT Academic CGPA", value: "9.09 / 10", scope: "B.Tech Computer Science" },
      { metric: "Industry Internships", value: "2", scope: "Zenoti & Aligned Automation" },
      { metric: "Strategic SQL Queries", value: "15+", scope: "Window Functions (LAG, RANK, NTILE)" },
      { metric: "LLM Inference Acceleration", value: "90%", scope: "DirectML GPU Optimization" }
    ]
  };

  function initSqlConsole() {
    const input = document.getElementById("sql-query-input");
    const runBtn = document.getElementById("sql-run-btn");
    const outputArea = document.getElementById("sql-output-area");
    const queryPills = document.querySelectorAll(".sql-preset-btn");

    if (!input || !runBtn || !outputArea) return;

    function executeQuery(queryText) {
      const startTime = performance.now();
      const clean = queryText.trim().replace(/;$/, "");
      const lower = clean.toLowerCase();

      let results = [];
      let tableName = "projects";

      if (lower.includes("from experience")) {
        tableName = "experience";
        results = careerDB.experience;
      } else if (lower.includes("from skills")) {
        tableName = "skills";
        if (lower.includes("where category")) {
          results = careerDB.skills.filter(s => s.category.toLowerCase().includes("analytics") || s.category.toLowerCase().includes("architecture"));
        } else {
          results = careerDB.skills;
        }
      } else if (lower.includes("from career_metrics") || lower.includes("from metrics")) {
        tableName = "metrics";
        results = careerDB.metrics;
      } else {
        tableName = "projects";
        results = careerDB.projects;
      }

      // Handle simple WHERE filters
      if (lower.includes("where") && tableName === "projects") {
        if (lower.includes("power bi")) {
          results = results.filter(p => p.stack.includes("Power BI"));
        } else if (lower.includes("python")) {
          results = results.filter(p => p.stack.includes("Python"));
        }
      }

      const elapsed = (performance.now() - startTime).toFixed(2);
      renderTable(results, clean, elapsed);
    }

    function renderTable(data, query, elapsed) {
      if (!data || data.length === 0) {
        outputArea.innerHTML = `<div class="p-3 text-warning">Query executed in ${elapsed}ms. (0 rows returned)</div>`;
        return;
      }

      const columns = Object.keys(data[0]);

      let html = `
        <div class="sql-results-header d-flex justify-content-between align-items-center mb-2 px-1">
          <small class="text-success"><span class="icon-check"></span> Query OK, ${data.length} rows returned</small>
          <small class="text-muted">Execution time: <strong class="text-white">${elapsed} ms</strong></small>
        </div>
        <div class="table-responsive">
          <table class="table table-sm table-dark sql-result-table mb-0">
            <thead>
              <tr>
                ${columns.map(c => `<th>${c.toUpperCase()}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${columns.map(c => `<td>${escapeHtml(String(row[c]))}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      `;
      outputArea.innerHTML = html;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    runBtn.addEventListener("click", () => executeQuery(input.value));

    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        executeQuery(input.value);
      }
    });

    queryPills.forEach(pill => {
      pill.addEventListener("click", function() {
        queryPills.forEach(p => p.classList.remove("active"));
        this.classList.add("active");
        const query = this.getAttribute("data-sql");
        input.value = query;
        executeQuery(query);
      });
    });

    // Run default query on load
    executeQuery(input.value);
  }

  // =========================================================================
  // 4. Medallion Pipeline Explorer
  // =========================================================================
  const medallionData = {
    bronze: {
      title: "Bronze Layer: Raw Data Ingestion",
      badge: "Ingestion & Raw Store",
      desc: "Direct, high-throughput extraction from operational systems into immutable append-only storage. Raw tables maintain original column structures with source lineage.",
      bullets: [
        "Ingests 100K+ ERP & CRM sales transactions and customer interaction streams.",
        "Preserves source schema, ingest timestamps, and batch run IDs for audit trails.",
        "Zero transformation applied to ensure full data lineage and reproducibility."
      ],
      tech: ["SQL Server Staged Tables", "Raw JSON Payloads", "Batch Ingestion"]
    },
    silver: {
      title: "Silver Layer: Cleaned, Conformed & Enriched",
      badge: "Data Quality & Cleansing",
      desc: "De-duplication, data type casting, business validation rules, and surrogate key generation. Stored procedures reconcile nulls and validate data consistency.",
      bullets: [
        "Data validation procedures eliminate orphan keys and duplicate customer orders.",
        "Transforms raw dates into a standardized Date dimension conforming to fiscal calendars.",
        "Enforces strict data integrity rules, solving edge-case defects before reporting."
      ],
      tech: ["T-SQL Stored Procedures", "Surrogate Key Generation", "Data Validation Rules"]
    },
    gold: {
      title: "Gold Layer: Star Schema & Business Marts",
      badge: "Decision-Ready Dimensional Models",
      desc: "Denormalized Star Schema optimized for high-performance analytical queries and executive Power BI dashboards with pre-computed aggregations.",
      bullets: [
        "Central FactSales table linked with DimCustomer, DimProduct, and DimDate.",
        "Window functions (LAG, RANK, NTILE) power Pareto 80/20 and customer cohort metrics.",
        "Direct connection to Power BI with optimized DAX measures for executive reporting."
      ],
      tech: ["Star Schema", "DAX Measures", "Power BI Executive Dashboards", "Window Functions"]
    }
  };

  function initMedallionExplorer() {
    const tabs = document.querySelectorAll(".medallion-tab");
    const contentBox = document.getElementById("medallion-content-box");
    if (!tabs || !contentBox) return;

    tabs.forEach(tab => {
      tab.addEventListener("click", function() {
        tabs.forEach(t => t.classList.remove("active"));
        this.classList.add("active");

        const stage = this.getAttribute("data-stage");
        const info = medallionData[stage];
        if (!info) return;

        contentBox.style.opacity = "0";
        contentBox.style.transform = "translateY(6px)";

        setTimeout(() => {
          contentBox.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="mb-0 text-white font-weight-bold">${info.title}</h4>
              <span class="badge ${stage === 'gold' ? 'badge-warning' : stage === 'silver' ? 'badge-info' : 'badge-secondary'} p-2">${info.badge}</span>
            </div>
            <p class="text-light" style="line-height: 1.7;">${info.desc}</p>
            <ul class="pl-3 mb-3" style="color: #cbd5e1; line-height: 1.6;">
              ${info.bullets.map(b => `<li class="mb-1">${b}</li>`).join("")}
            </ul>
            <div class="d-flex flex-wrap" style="gap: 8px;">
              ${info.tech.map(t => `<span class="tech-tag tag-cyan">${t}</span>`).join("")}
            </div>
          `;
          contentBox.style.transition = "all 0.3s ease";
          contentBox.style.opacity = "1";
          contentBox.style.transform = "translateY(0)";
        }, 150);
      });
    });
  }

  // =========================================================================
  // 5. Command Palette (Ctrl + K / Cmd + K)
  // =========================================================================
  function initCommandPalette() {
    const modal = document.getElementById("cmd-palette-modal");
    const input = document.getElementById("cmd-palette-input");
    const list = document.getElementById("cmd-palette-list");
    const toast = document.getElementById("cmd-toast");
    const triggers = document.querySelectorAll(".cmd-palette-trigger");

    if (!modal || !input || !list) return;

    const commands = [
      { title: "View Featured Projects", desc: "Jump to Projects section", icon: "icon-bar-chart", action: () => scrollToSection("#project-section") },
      { title: "Enterprise Medallion Data Warehouse", desc: "View SQL Server & Power BI project", icon: "icon-database", action: () => openUrl("https://github.com/Tanmay0029/SQL-Data-Warehouse-and-Analytics") },
      { title: "Retail Analytics & Customer Intelligence", desc: "View 1M+ transactions analytics repo", icon: "icon-pie-chart", action: () => openUrl("https://github.com/Tanmay0029/Retail-Analytics-Customer-Intelligence-Platform") },
      { title: "Placement Mail Automation", desc: "View GPT-4o & Python pipeline", icon: "icon-envelope", action: () => openUrl("https://github.com/nervewastaken/shortlist") },
      { title: "Open SQL Terminal Sandbox", desc: "Run interactive SQL queries", icon: "icon-terminal", action: () => scrollToSection("#sql-terminal-section") },
      { title: "View Work Experience", desc: "Zenoti & Aligned Automation roles", icon: "icon-briefcase", action: () => scrollToSection("#experience-section") },
      { title: "Download Resume PDF", desc: "Open latest Data Analyst resume", icon: "icon-file-pdf-o", action: () => openUrl("resume.pdf") },
      { title: "Copy Email Address", desc: "tanmayagrawal2907@gmail.com", icon: "icon-copy", action: () => copyEmail() },
      { title: "Switch Theme: Executive Onyx Gold", desc: "Champagne gold & 3D horizon grid", icon: "icon-sliders", action: () => window.switchHeroTheme("onyx-gold", true) },
      { title: "Switch Theme: Minimalist Titanium", desc: "Pure dark & ambient spotlight (Apple/Vercel look)", icon: "icon-sliders", action: () => window.switchHeroTheme("minimal-titanium", true) },
      { title: "Switch Theme: Cyber Emerald AI", desc: "Emerald green & pulsing neural network", icon: "icon-sliders", action: () => window.switchHeroTheme("emerald-matrix", true) },
      { title: "Switch Theme: Gotham Crimson", desc: "Carbon black & interactive web lattice", icon: "icon-sliders", action: () => window.switchHeroTheme("gotham-crimson", true) },
      { title: "Connect on LinkedIn", desc: "Open LinkedIn profile", icon: "icon-linkedin", action: () => openUrl("https://www.linkedin.com/in/tanmay-agrawal-b4319624a/") },
      { title: "View GitHub Profile", desc: "github.com/Tanmay0029", icon: "icon-github", action: () => openUrl("https://github.com/Tanmay0029") }
    ];

    function showModal() {
      modal.classList.add("active");
      input.value = "";
      renderList(commands);
      setTimeout(() => input.focus(), 50);
    }

    function hideModal() {
      modal.classList.remove("active");
    }

    function scrollToSection(id) {
      hideModal();
      const el = document.querySelector(id);
      if (el) {
        $('html, body').animate({ scrollTop: $(id).offset().top - 70 }, 500);
      }
    }

    function openUrl(url) {
      hideModal();
      window.open(url, "_blank");
    }

    function copyEmail() {
      hideModal();
      navigator.clipboard.writeText("tanmayagrawal2907@gmail.com").then(() => {
        showToast("Email copied to clipboard: tanmayagrawal2907@gmail.com");
      });
    }

    function showToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3000);
    }

    function renderList(items) {
      if (items.length === 0) {
        list.innerHTML = `<div class="p-4 text-center text-muted">No commands found matching your search.</div>`;
        return;
      }

      list.innerHTML = items.map((cmd, idx) => `
        <div class="cmd-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
          <span class="${cmd.icon} mr-3 text-warning" style="font-size: 1.1rem;"></span>
          <div class="cmd-text flex-grow-1">
            <strong class="d-block text-white">${cmd.title}</strong>
            <small class="text-muted">${cmd.desc}</small>
          </div>
          <span class="cmd-badge">↵ Select</span>
        </div>
      `).join("");

      // Bind click
      document.querySelectorAll(".cmd-item").forEach(el => {
        el.addEventListener("click", function() {
          const idx = parseInt(this.getAttribute("data-idx"), 10);
          items[idx].action();
        });
      });
    }

    input.addEventListener("input", function() {
      const q = input.value.toLowerCase().trim();
      const filtered = commands.filter(c => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
      renderList(filtered);
    });

    // Keyboard navigation
    window.addEventListener("keydown", function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        modal.classList.contains("active") ? hideModal() : showModal();
      }

      if (e.key === "Escape" && modal.classList.contains("active")) {
        hideModal();
      }

      if (modal.classList.contains("active")) {
        const items = Array.from(document.querySelectorAll(".cmd-item"));
        const selected = document.querySelector(".cmd-item.selected");
        let idx = items.indexOf(selected);

        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (idx < items.length - 1) {
            selected?.classList.remove("selected");
            items[idx + 1].classList.add("selected");
            items[idx + 1].scrollIntoView({ block: "nearest" });
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (idx > 0) {
            selected?.classList.remove("selected");
            items[idx - 1].classList.add("selected");
            items[idx - 1].scrollIntoView({ block: "nearest" });
          }
        } else if (e.key === "Enter") {
          e.preventDefault();
          selected?.click();
        }
      }
    });

    modal.addEventListener("click", function(e) {
      if (e.target === modal) hideModal();
    });

    triggers.forEach(btn => btn.addEventListener("click", showModal));
  }

  // =========================================================================
  // Initialize Everything on DOM Load
  // =========================================================================
  document.addEventListener("DOMContentLoaded", function() {
    initHeroAnimation();
    initHeroThemeSwitcher();
    initCardTilt();
    initSqlConsole();
    initMedallionExplorer();
    initCommandPalette();
  });

})();
