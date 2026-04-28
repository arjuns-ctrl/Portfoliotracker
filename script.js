const funds = [];

const fundSelect = document.getElementById('fundSelect');
const statusMessage = document.getElementById('statusMessage');

const CLIENT_DATA_SOURCES = [
  '/api/funds',
  'https://api.allorigins.win/raw?url=https://portal.amfiindia.com/spages/NAVAll.txt',
  'https://www.amfiindia.com/spages/NAVAll.txt'
];

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle('error', isError);
}

function parseFunds(rawData) {
  const parsed = [];
  const lines = rawData.split('\n');

  lines.forEach((line) => {
    const parts = line.split(';');
    const schemeName = parts[3];
    const nav = parseFloat(parts[4]);

    if (parts.length > 4 && schemeName && Number.isFinite(nav)) {
      parsed.push({ schemeName, nav });
    }
  });

  return parsed;
}

async function fetchFundsData() {
  let lastError = null;

  for (const source of CLIENT_DATA_SOURCES) {
    try {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Source returned ${response.status}: ${source}`);
      }

      const text = await response.text();
      const parsed = parseFunds(text);

      if (!parsed.length) {
        throw new Error(`No funds parsed from ${source}`);
      }

      return parsed;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Unable to load funds from all sources.');
}

async function loadFunds() {
  setStatus('Loading funds...');
  fundSelect.disabled = true;

  try {
    const parsedFunds = await fetchFundsData();

const fundSelect = document.getElementById('fundSelect');
const statusMessage = document.getElementById('statusMessage');

function setStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle('error', isError);
}

function parseFunds(rawData) {
  const parsed = [];
  const lines = rawData.split('\n');

  lines.forEach((line) => {
    const parts = line.split(';');
    const schemeName = parts[3];
    const nav = parseFloat(parts[4]);

    if (parts.length > 4 && schemeName && Number.isFinite(nav)) {
      parsed.push({ schemeName, nav });
    }
  });

  return parsed;
}

async function loadFunds() {
  setStatus('Loading funds...');
  fundSelect.disabled = true;

  try {
    const response = await fetch('/api/funds');
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.text();
    const parsedFunds = parseFunds(data);

    if (!parsedFunds.length) {
      throw new Error('No funds were parsed from the response.');
    }

    funds.splice(0, funds.length, ...parsedFunds);
    populateDropdown();
    fundSelect.disabled = false;
    setStatus(`Loaded ${funds.length} funds.`);
  } catch (error) {
    setStatus(`Unable to load funds: ${error.message}`, true);
    fundSelect.innerHTML = '<option>Unable to load funds</option>';
  }
}

function populateDropdown() {
  fundSelect.innerHTML = '';

  funds.forEach((fund, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = fund.schemeName;
    fundSelect.appendChild(option);
  });
}

function calculateValue() {
  const selectedIndex = Number(fundSelect.value);
  const units = Number.parseFloat(document.getElementById('units').value);

  if (!Number.isFinite(units) || units <= 0) {
    alert('Enter valid units greater than zero.');
    return;
  }

  const fund = funds[selectedIndex];
  if (!fund) {
    alert('Please select a valid fund.');
    return;
  }

  const { nav } = fund;
  const value = nav * units;

  document.getElementById('navValue').innerText = `NAV: ₹${nav.toFixed(2)}`;
  document.getElementById('portfolioValue').innerText = `Portfolio Value: ₹${value.toFixed(2)}`;
}

loadFunds();
