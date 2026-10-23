/**
 * Creative & Interactive Effects - Tanmay Agrawal Portfolio
 * 1. Fluid Data Waves / Stream Flow (Hero)
 * 2. 3D Card Tilt Effects
 * 3. Command Palette (Ctrl + K)
 * 4. Interactive In-Browser SQL Console
 * 5. Medallion Pipeline Explorer
 */

(function() {
  "use strict";

  // =========================================================================
  // 1. Fluid Data Waves / Stream Flow (Hero Background)
  // =========================================================================
  function initFluidDataWaves() {
    const canvas = document.getElementById("data-network-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = 0, height = 0;
    let animationFrameId;

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 240, force: 48 };

    function resize() {
      const parent = canvas.parentElement;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Track mouse over hero section or viewport
    window.addEventListener("mousemove", function(e) {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY <= rect.bottom + 80 && e.clientY >= rect.top - 80) {
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

    // Waves definition: Layered multi-frequency curves inspired by time-series analytical distributions
    const waves = [
      {
        yRatio: 0.60,
        amplitude: 44,
        wavelength: 0.0032,
        speed: 0.012,
        phase: 0,
        colorStart: "rgba(0, 242, 254, 0.75)",
        colorEnd: "rgba(139, 92, 246, 0.85)",
        fillGradient: true,
        fillColorStart: "rgba(0, 242, 254, 0.07)",
        fillColorEnd: "rgba(139, 92, 246, 0.01)",
        lineWidth: 2.4,
        samplePoints: true
      },
      {
        yRatio: 0.67,
        amplitude: 54,
        wavelength: 0.0025,
        speed: -0.009,
        phase: 1.8,
        colorStart: "rgba(139, 92, 246, 0.7)",
        colorEnd: "rgba(56, 189, 248, 0.7)",
        fillGradient: true,
        fillColorStart: "rgba(139, 92, 246, 0.06)",
        fillColorEnd: "rgba(6, 8, 14, 0.0)",
        lineWidth: 1.9,
        samplePoints: false
      },
      {
        yRatio: 0.52,
        amplitude: 28,
        wavelength: 0.0052,
        speed: 0.015,
        phase: 3.5,
        colorStart: "rgba(168, 85, 247, 0.55)",
        colorEnd: "rgba(0, 242, 254, 0.55)",
        fillGradient: false,
        lineWidth: 1.5,
        samplePoints: true
      },
      {
        yRatio: 0.75,
        amplitude: 62,
        wavelength: 0.0019,
        speed: 0.007,
        phase: 0.8,
        colorStart: "rgba(59, 130, 246, 0.4)",
        colorEnd: "rgba(147, 51, 234, 0.3)",
        fillGradient: true,
        fillColorStart: "rgba(59, 130, 246, 0.04)",
        fillColorEnd: "rgba(6, 8, 14, 0.0)",
        lineWidth: 1.3,
        samplePoints: false
      }
    ];

    // Floating ambient data particles drifting along stream current
    const particles = [];
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 800),
        size: Math.random() * 2 + 1,
        vx: Math.random() * 0.45 + 0.2,
        vy: (Math.random() - 0.5) * 0.22,
        alpha: Math.random() * 0.5 + 0.25,
        color: Math.random() > 0.5 ? "0, 242, 254" : "139, 92, 246"
      });
    }

    function render() {
      // Smooth mouse spring interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw floating ambient data nodes drifting horizontally
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > width + 20) p.x = -20;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 2. Render each wave
      for (let w of waves) {
        w.phase += w.speed;
        const baseY = height * w.yRatio;

        // Create linear gradient across width
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, w.colorStart);
        grad.addColorStop(0.5, w.colorEnd);
        grad.addColorStop(1, w.colorStart);

        ctx.beginPath();
        ctx.moveTo(0, baseY);

        const pointInterval = 6;
        const wavePoints = [];

        for (let x = 0; x <= width + pointInterval; x += pointInterval) {
          // Compound harmonics
          let waveOffset = Math.sin(x * w.wavelength + w.phase) * w.amplitude;
          waveOffset += Math.cos(x * w.wavelength * 0.55 + w.phase * 0.75) * (w.amplitude * 0.32);

          // Mouse fluid wave reaction
          if (mouse.x > -500) {
            const dx = x - mouse.x;
            const dy = (baseY + waveOffset) - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
              const ripple = Math.cos((dist / mouse.radius) * (Math.PI / 2));
              waveOffset += ripple * mouse.force * (dy > 0 ? 1 : -0.7);
            }
          }

          const currentY = baseY + waveOffset;
          wavePoints.push({ x, y: currentY });

          if (x === 0) {
            ctx.moveTo(x, currentY);
          } else {
            ctx.lineTo(x, currentY);
          }
        }

        // Stroke line
        ctx.strokeStyle = grad;
        ctx.lineWidth = w.lineWidth;
        ctx.stroke();

        // Optional fill gradient to bottom
        if (w.fillGradient) {
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          const fillGrad = ctx.createLinearGradient(0, baseY - w.amplitude, 0, height);
          fillGrad.addColorStop(0, w.fillColorStart);
          fillGrad.addColorStop(1, w.fillColorEnd);
          ctx.fillStyle = fillGrad;
          ctx.fill();
        }

        // Discrete sample points along wave crest (analytical time-series indicators)
        if (w.samplePoints) {
          const sampleStep = 80;
          for (let pt of wavePoints) {
            if (Math.round(pt.x) % sampleStep < pointInterval) {
              // Glowing data node
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
              ctx.fillStyle = "#ffffff";
              ctx.shadowBlur = 10;
              ctx.shadowColor = w.colorStart;
              ctx.fill();
              ctx.shadowBlur = 0;

              // Subtle coordinate stem dropped down 14px
              ctx.beginPath();
              ctx.moveTo(pt.x, pt.y);
              ctx.lineTo(pt.x, pt.y + 14);
              ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();
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
    initFluidDataWaves();
    initCardTilt();
    initSqlConsole();
    initMedallionExplorer();
    initCommandPalette();
  });

})();
