let cases = [];

fetch("cases.json")
  .then(response => response.json())
  .then(data => {
    cases = data;
    populateFilters();
    displayCases(cases);
  });

function populateFilters() {
  const courtFilter = document.getElementById("courtFilter");
  const yearFilter = document.getElementById("yearFilter");

  [...new Set(cases.map(c => c.court))].forEach(court => {
    courtFilter.innerHTML += `<option value="${court}">${court}</option>`;
  });

  [...new Set(cases.map(c => c.year))].forEach(year => {
    yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
  });
}

function displayCases(caseArray) {
  const caseList = document.getElementById("caseList");
  caseList.innerHTML = "";

  caseArray.forEach((c, index) => {
    const hasSummary = c.summary !== undefined;

    caseList.innerHTML += `
      <div class="case-card">
        <h3>${c.case_name}</h3>
        <p><strong>${c.citation}</strong></p>
        <p>${c.court} • ${c.year}</p>

        ${hasSummary ? `
          <button class="summary-toggle" onclick="toggleSummary(${index})">
            View summary
          </button>

          <div class="summary" id="summary-${index}" style="display: none;">
            <p><strong>Issue:</strong> ${c.summary.issue}</p>
            <p><strong>Decision:</strong> ${c.summary.decision}</p>
            <p><strong>Principle:</strong> ${c.summary.principle}</p>
          </div>
        ` : ""}

        <a href="${c.saflii_url}" target="_blank">
          Read full judgment on SAFLII →
        </a>
      </div>
    `;
  });
}

function toggleSummary(index) {
  const summary = document.getElementById(`summary-${index}`);
  summary.style.display =
    summary.style.display === "none" ? "block" : "none";
}


document.getElementById("searchInput").addEventListener("input", filterCases);
document.getElementById("courtFilter").addEventListener("change", filterCases);
document.getElementById("yearFilter").addEventListener("change", filterCases);

function filterCases() {
  const search = searchInput.value.toLowerCase();
  const court = courtFilter.value;
  const year = yearFilter.value;

  const filtered = cases.filter(c =>
    (c.case_name.toLowerCase().includes(search) ||
     c.citation.toLowerCase().includes(search)) &&
    (court === "" || c.court === court) &&
    (year === "" || c.year.toString() === year)
  );

  displayCases(filtered);
}
