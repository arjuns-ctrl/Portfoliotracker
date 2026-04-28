let funds = [];

// Fetch NAV data
async function loadFunds() {
    const response = await fetch("https://api.allorigins.win/raw?url=https://portal.amfiindia.com/spages/NAVAll.txt");
    const data = await response.text();

    const lines = data.split("\n");

    lines.forEach(line => {
        const parts = line.split(";");
        if (parts.length > 4 && !isNaN(parts[4])) {
            funds.push({
                schemeName: parts[3],
                nav: parseFloat(parts[4])
            });
        }
    });

    populateDropdown();
}

// Populate dropdown
function populateDropdown() {
    const select = document.getElementById("fundSelect");
    select.innerHTML = "";

    funds.forEach((fund, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = fund.schemeName;
        select.appendChild(option);
    });
}

// Calculate value
function calculateValue() {
    const selectedIndex = document.getElementById("fundSelect").value;
    const units = parseFloat(document.getElementById("units").value);

    if (!units || units <= 0) {
        alert("Enter valid units");
        return;
    }

    const fund = funds[selectedIndex];
    const nav = fund.nav;
    const value = nav * units;

    document.getElementById("navValue").innerText = `NAV: ₹${nav.toFixed(2)}`;
    document.getElementById("portfolioValue").innerText = `Portfolio Value: ₹${value.toFixed(2)}`;
}

// Load on start
loadFunds();
