let allPlaces = [];

fetch("travel_recommendation_api.json")
  .then((response) => response.json())
  .then((data) => {
    const countries = data.countries.flatMap((country) =>
      country.cities.map((city) => ({ ...city, type: "country" }))
    );
    const temples = data.temples.map((temple) => ({
      ...temple,
      type: "temple",
    }));
    const beaches = data.beaches.map((beach) => ({ ...beach, type: "beach" }));

    allPlaces = [...countries, ...temples, ...beaches];
  });

function toggleNav() {
  document.querySelector(".nav-center").classList.toggle("active");
}

function search(device) {
  const inputId =
    device === "mobile" ? "search-input-mobile" : "search-input-desktop";
  const resultsId =
    device === "mobile" ? "search-results-mobile" : "search-results";

  const keyword = document.getElementById(inputId).value.toLowerCase().trim();
  const dropdown = document.getElementById(resultsId);
  dropdown.innerHTML = "";

  if (!keyword) {
    dropdown.style.display = "none";
    return;
  }

  const results = allPlaces.filter(
    (place) =>
      place.name.toLowerCase().includes(keyword) ||
      place.type.toLowerCase().includes(keyword)
  );

  if (results.length === 0) {
    dropdown.innerHTML = "<p style='color: gray;'>No results found.</p>";
    dropdown.style.display = "block";
    return;
  }

  results.forEach((place) => {
    const div = document.createElement("div");
    div.style.marginBottom = "1rem";
    div.style.paddingBlock = "0.5rem";

    const isMobile = device === "mobile";
    const imageStyle = isMobile
      ? "width:100%; max-width:100%; height:150px; object-fit:cover; border-radius:6px;"
      : "width:100%; height:180px; object-fit:cover; border-radius:6px;";

    div.innerHTML = `
      <h3>${place.name}</h3>
      <img src="${place.imageUrl}" alt="${place.name}" style="${imageStyle}" />
      <p style="margin-bottom: 12px;">${place.description}</p>
      <button onclick="selectPlace('${place.name}')">Visit</button>
    `;
    dropdown.appendChild(div);
  });

  dropdown.style.display = "block";
}

function reset() {
  document.getElementById("search-input-mobile").value = "";
  document.getElementById("search-input-desktop").value = "";

  const dropdownDesktop = document.getElementById("search-results");
  const dropdownMobile = document.getElementById("search-results-mobile");

  dropdownDesktop.innerHTML = "";
  dropdownDesktop.style.display = "none";

  dropdownMobile.innerHTML = "";
  dropdownMobile.style.display = "none";
}

function renderTeam(members) {
  const section = document.getElementById("team-section");

  const title = document.createElement("h3");
  title.textContent = "Our Team";
  title.style.color = "var(--dark-purple)";
  title.style.marginBottom = "6px";
  section.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "team-grid";

  members.forEach((member) => {
    const card = document.createElement("div");
    card.className = "team-member";

    card.innerHTML = `
      <img src="${member.photo}" alt="${member.name}">
      <div>
        <strong>${member.name}</strong><br>
        <span>${member.role}</span>
      </div>
    `;

    grid.appendChild(card);
  });

  section.appendChild(grid);
}

fetch("public/team.json")
  .then((response) => response.json())
  .then((data) => renderTeam(data));
