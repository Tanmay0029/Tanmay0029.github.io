/**
 * Creative & Interactive Effects - Tanmay Agrawal Portfolio
 * 1. Data Network Particle Canvas (Hero)
 * 2. 3D Card Tilt Effects
 * 3. Command Palette (Ctrl + K)
 * 4. Interactive In-Browser SQL Console
 * 5. Medallion Pipeline Explorer
 */

(function() {
  "use strict";

  // =========================================================================
  // 1. Data Network Particle Canvas (Hero Background)
  // =========================================================================
  function initDataNetwork() {
    const canvas = document.getElementById("data-network-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    const particleCount = 45;
    const maxDistance = 140;

    let mouse = { x: -1000, y: -1000, radius: 160 };

    function resize() {
      const parent = canvas.parentElement;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", function(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener("mouseleave", function() {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1.5;
        this.color = Math.random() > 0.4 ? "rgba(255, 189, 57, " : "rgba(0, 210, 255, ";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse proximity reaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + "0.75)";
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color + "0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes with edges
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 189, 57, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
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
    ],
    heroes: [
      { hero: "The Dark Knight", alias: "Bruce Wayne", protocol: "Wayne Enterprises Analytics", favorite_query: "SELECT justice FROM gotham WHERE corruption = 0;" },
      { hero: "Spider-Man", alias: "Peter Parker", protocol: "Web Data Crawling & Lineage", favorite_query: "WITH GreatPower AS (SELECT responsibility FROM moral_duty) SELECT * FROM GreatPower;" },
      { hero: "Tanmay Agrawal", alias: "Data & Analytics Engineer", protocol: "Medallion Star Schema & High-Impact Insights", favorite_query: "SELECT revenue, retention FROM trusted_gold_marts WHERE data_integrity = 1;" }
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
      } else if (lower.includes("batman") || lower.includes("spiderman") || lower.includes("hero") || lower.includes("wayne")) {
        tableName = "heroes";
        results = careerDB.heroes;
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
      { title: "View GitHub Profile", desc: "github.com/Tanmay0029", icon: "icon-github", action: () => openUrl("https://github.com/Tanmay0029") },
      { title: "🦇 Wayne Enterprises Protocol (Easter Egg)", desc: "It's not who I am underneath, but what I query that defines me.", icon: "icon-shield", action: () => showToast("🦇 'It's not who I am underneath, but what I query that defines me.' — Dark Knight Protocol") },
      { title: "🕷️ Spider-Verse Lineage (Easter Egg)", desc: "With great data comes great responsibility.", icon: "icon-globe", action: () => showToast("🕷️ 'With great data comes great responsibility.' — Peter Parker") }
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
    initDataNetwork();
    initCardTilt();
    initSqlConsole();
    initMedallionExplorer();
    initCommandPalette();
  });

})();
