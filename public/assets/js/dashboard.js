// Simple in-memory data to make the dashboard feel alive.
// Later, you can replace these with real API calls.

const state = {
  jobs: [
    {
      id: "J-001",
      clientId: "C-001",
      clientName: "Sarah Miller",
      address: "123 Oak St",
      service: "Full yard cleanup",
      scheduled: "Today 9:00 AM",
      staffId: "S-001",
      staffName: "John",
      status: "In progress",
      paymentStatus: "Unpaid",
      today: true,
    },
    {
      id: "J-002",
      clientId: "C-002",
      clientName: "Mike Thompson",
      address: "45 Pine Ave",
      service: "Mow & edge",
      scheduled: "Today 1:00 PM",
      staffId: "S-002",
      staffName: "Alex",
      status: "Scheduled",
      paymentStatus: "Paid",
      today: true,
    },
    {
      id: "J-003",
      clientId: "C-003",
      clientName: "Elderly Neighbor",
      address: "9 Maple Ct",
      service: "Front yard mow",
      scheduled: "Tomorrow 10:00 AM",
      staffId: "S-001",
      staffName: "John",
      status: "Approved",
      paymentStatus: "Donation",
      today: false,
    },
  ],
  clients: [
    {
      id: "C-001",
      name: "Sarah Miller",
      address: "123 Oak St",
      phone: "555-123-4567",
      email: "sarah@example.com",
      totalJobs: 3,
      totalPaid: 260,
      lastJob: "2026-03-20",
    },
    {
      id: "C-002",
      name: "Mike Thompson",
      address: "45 Pine Ave",
      phone: "555-987-6543",
      email: "mike@example.com",
      totalJobs: 1,
      totalPaid: 80,
      lastJob: "2026-03-25",
    },
    {
      id: "C-003",
      name: "Elderly Neighbor",
      address: "9 Maple Ct",
      phone: "555-555-0000",
      email: "neighbor@example.com",
      totalJobs: 2,
      totalPaid: 0,
      lastJob: "2026-03-18",
    },
  ],
  staff: [
    { id: "S-001", name: "John", role: "Crew", status: "Active", jobsThisWeek: 8 },
    { id: "S-002", name: "Alex", role: "Crew", status: "Active", jobsThisWeek: 6 },
    { id: "S-003", name: "Maria", role: "Supervisor", status: "Active", jobsThisWeek: 3 },
  ],
  media: [
    {
      id: "M-001",
      jobId: "J-001",
      label: "Before - 123 Oak St",
      thumb: "linear-gradient(135deg,#4ade80,#16a34a)",
    },
    {
      id: "M-002",
      jobId: "J-001",
      label: "After - 123 Oak St",
      thumb: "linear-gradient(135deg,#22c55e,#16a34a)",
    },
    {
      id: "M-003",
      jobId: "J-002",
      label: "After - 45 Pine Ave",
      thumb: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
    },
  ],
  payments: [
    {
      id: "P-001",
      date: "2026-03-25",
      type: "Payment",
      from: "Mike Thompson",
      amount: 80,
      jobId: "J-002",
      method: "Card",
    },
    {
      id: "P-002",
      date: "2026-03-24",
      type: "Donation",
      from: "Local Sponsor",
      amount: 150,
      jobId: "J-003",
      method: "Card",
    },
  ],
  messages: [
    {
      id: "T-001",
      title: "Sarah - 123 Oak St",
      last: "Can you come a bit earlier?",
      jobId: "J-001",
      messages: [
        { from: "client", text: "Can you come a bit earlier?", ts: "08:10" },
        { from: "staff", text: "We can be there at 8:45 AM.", ts: "08:12" },
      ],
    },
    {
      id: "T-002",
      title: "Mike - 45 Pine Ave",
      last: "Thanks, yard looks great!",
      jobId: "J-002",
      messages: [
        { from: "client", text: "Thanks, yard looks great!", ts: "15:30" },
        { from: "staff", text: "Glad you like it!", ts: "15:32" },
      ],
    },
  ],
  activity: [
    "John uploaded after photos for 123 Oak St.",
    "Payment received: $80 from Mike Thompson.",
    "New request from Elderly Neighbor.",
  ],
};

// Utility

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

// Navigation

function initNav() {
  const navItems = $all(".nav-item");
  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      navItems.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      switchView(view);
    });
  });
}

function switchView(viewName) {
  $all(".view").forEach((v) => v.classList.remove("view-active"));
  const target = $(`#view-${viewName}`);
  if (target) target.classList.add("view-active");
}

// Overview rendering

function renderOverview() {
  const activeJobs = state.jobs.filter(
    (j) => j.status === "In progress" || j.status === "Scheduled"
  );
  const newRequests = state.jobs.filter((j) => j.status === "New");
  const todayJobs = state.jobs.filter((j) => j.today);

  $("#kpiActiveJobs").textContent = activeJobs.length;
  $("#kpiNewRequests").textContent = newRequests.length;
  $("#kpiTodayJobs").textContent = todayJobs.length;

  const paymentsThisWeek = state.payments.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  $("#kpiPaymentsWeek").textContent = `$${paymentsThisWeek}`;

  const overviewJobsList = $("#overviewJobsList");
  overviewJobsList.innerHTML = "";
  todayJobs.forEach((job) => {
    const div = document.createElement("div");
    div.className = "schedule-item";
    div.textContent = `${job.scheduled} • ${job.clientName} • ${job.service} • ${job.status}`;
    overviewJobsList.appendChild(div);
  });

  const alerts = $("#overviewAlerts");
  alerts.innerHTML = "";
  const overdue = state.jobs.filter(
    (j) => j.status !== "Completed" && !j.today
  );
  if (overdue.length === 0) {
    alerts.innerHTML = `<div class="activity-meta">No critical alerts.</div>`;
  } else {
    overdue.forEach((job) => {
      const div = document.createElement("div");
      div.className = "alert-item";
      div.textContent = `Job ${job.id} for ${job.clientName} is overdue (${job.status}).`;
      alerts.appendChild(div);
    });
  }

  const feed = $("#activityFeed");
  feed.innerHTML = "";
  state.activity.forEach((text) => {
    const row = document.createElement("div");
    row.className = "activity-item";
    row.innerHTML = `
      <div class="activity-dot"></div>
      <div class="activity-text">
        ${text}
        <div class="activity-meta">Just now</div>
      </div>
    `;
    feed.appendChild(row);
  });
}

// Jobs rendering

function renderJobs() {
  const tbody = $("#jobsTable tbody");
  const statusFilter = $("#jobsStatusFilter").value;
  const staffFilter = $("#jobsStaffFilter").value;

  let jobs = [...state.jobs];
  if (statusFilter) {
    jobs = jobs.filter((j) => j.status === statusFilter);
  }
  if (staffFilter) {
    jobs = jobs.filter((j) => j.staffId === staffFilter);
  }

  tbody.innerHTML = "";
  jobs.forEach((job) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${job.id}</td>
      <td>${job.clientName}</td>
      <td>${job.address}</td>
      <td>${job.service}</td>
      <td>${job.scheduled}</td>
      <td>${job.staffName}</td>
      <td>${job.status}</td>
      <td>${job.paymentStatus}</td>
    `;
    tbody.appendChild(tr);
  });
}

function initJobsFilters() {
  const staffSelect = $("#jobsStaffFilter");
  state.staff.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    staffSelect.appendChild(opt);
  });

  $("#jobsStatusFilter").addEventListener("change", renderJobs);
  $("#jobsStaffFilter").addEventListener("change", renderJobs);
}

// Clients rendering

function renderClients() {
  const tbody = $("#clientsTable tbody");
  tbody.innerHTML = "";
  state.clients.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>${c.address}</td>
      <td>${c.phone}</td>
      <td>${c.email}</td>
      <td>${c.totalJobs}</td>
      <td>$${c.totalPaid}</td>
      <td>${c.lastJob}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Schedule rendering (simple list for now)

function renderSchedule() {
  const container = $("#scheduleList");
  container.innerHTML = "";
  state.jobs
    .slice()
    .sort((a, b) => a.scheduled.localeCompare(b.scheduled))
    .forEach((job) => {
      const div = document.createElement("div");
      div.className = "schedule-item";
      div.textContent = `${job.scheduled} • ${job.clientName} • ${job.service} • ${job.staffName}`;
      container.appendChild(div);
    });
}

// Staff rendering

function renderStaff() {
  const tbody = $("#staffTable tbody");
  tbody.innerHTML = "";
  state.staff.forEach((s) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.name}</td>
      <td>${s.role}</td>
      <td>${s.status}</td>
      <td>${s.jobsThisWeek}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Media rendering

function renderMedia() {
  const grid = $("#mediaGrid");
  grid.innerHTML = "";
  state.media.forEach((m) => {
    const div = document.createElement("div");
    div.className = "media-card";
    div.innerHTML = `
      <div class="media-thumb" style="background:${m.thumb};"></div>
      <div class="media-meta">
        <div>${m.label}</div>
        <div class="activity-meta">Job ${m.jobId}</div>
      </div>
    `;
    grid.appendChild(div);
  });
}

// Payments rendering

function renderPayments() {
  const tbody = $("#paymentsTable tbody");
  tbody.innerHTML = "";
  let totalDonations = 0;
  let totalPayments = 0;
  let jobsCovered = 0;
  let jobsPartial = 0;

  state.payments.forEach((p) => {
    if (p.type === "Donation") totalDonations += p.amount;
    if (p.type === "Payment") totalPayments += p.amount;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.date}</td>
      <td>${p.type}</td>
      <td>${p.from}</td>
      <td>$${p.amount}</td>
      <td>${p.jobId || "-"}</td>
      <td>${p.method}</td>
    `;
    tbody.appendChild(tr);
  });

  // Simple fake logic for covered/partial
  jobsCovered = 1;
  jobsPartial = 1;

  $("#kpiTotalDonations").textContent = `$${totalDonations}`;
  $("#kpiTotalPayments").textContent = `$${totalPayments}`;
  $("#kpiJobsCovered").textContent = jobsCovered;
  $("#kpiJobsPartial").textContent = jobsPartial;
}

// Messages rendering

let currentThreadId = null;

function renderThreads() {
  const list = $("#threadsList");
  list.innerHTML = "";
  state.messages.forEach((t) => {
    const div = document.createElement("div");
    div.className = "thread-item" + (t.id === currentThreadId ? " active" : "");
    div.dataset.threadId = t.id;
    div.innerHTML = `
      <div class="thread-title">${t.title}</div>
      <div class="thread-meta">${t.last}</div>
    `;
    list.appendChild(div);
  });

  $all(".thread-item").forEach((el) => {
    el.addEventListener("click", () => {
      currentThreadId = el.dataset.threadId;
      renderThreads();
      renderConversation();
    });
  });
}

function renderConversation() {
  const container = $("#conversationView");
  container.innerHTML = "";
  const thread = state.messages.find((t) => t.id === currentThreadId);
  if (!thread) {
    container.innerHTML =
      '<div class="conversation-empty">Select a thread to view messages.</div>';
    return;
  }

  thread.messages.forEach((m) => {
    const div = document.createElement("div");
    div.className = "message-bubble " + (m.from === "client" ? "client" : "staff");
    div.textContent = m.text;
    container.appendChild(div);
  });
}

// Global search (simple highlight/filter demo)

function initSearch() {
  const input = $("#globalSearch");
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    // For now, just filter jobs table when on Jobs view
    if ($("#view-jobs").classList.contains("view-active")) {
      const rows = $("#jobsTable tbody").rows;
      Array.from(rows).forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? "" : "none";
      });
    }
  });
}

// Init

function init() {
  initNav();
  initJobsFilters();
  initSearch();

  renderOverview();
  renderJobs();
  renderClients();
  renderSchedule();
  renderStaff();
  renderMedia();
  renderPayments();
  renderThreads();
  renderConversation();
}

document.addEventListener("DOMContentLoaded", init);
