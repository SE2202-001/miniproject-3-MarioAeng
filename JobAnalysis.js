// Define the Job class
class Job {
  constructor({
    "Job No": jobNo = "Unknown Job No",
    Title: title = "Unknown Title",
    "Job Page Link": jobPageLink = "No Link Provided",
    Posted: posted = "Unknown Time",
    Type: type = "Unknown Type",
    Level: level = "Unknown Level",
    "Estimated Time": estimatedTime = "Unknown Time",
    Skill: skill = "Unknown Skill",
    Detail: detail = "No Details Provided"
  }) {
    this.jobNo = jobNo;
    this.title = title;
    this.jobPageLink = jobPageLink;
    this.posted = posted;
    this.type = type;
    this.level = level;
    this.estimatedTime = estimatedTime;
    this.skill = skill;
    this.detail = detail;
  }

  getDetails() {
    return `
      <strong>Job No:</strong> ${this.jobNo}<br>
      <strong>Title:</strong> ${this.title}<br>
      <strong>Posted:</strong> ${this.posted}<br>
      <strong>Type:</strong> ${this.type}<br>
      <strong>Level:</strong> ${this.level}<br>
      <strong>Estimated Time:</strong> ${this.estimatedTime}<br>
      <strong>Skill:</strong> ${this.skill}<br>
      <strong>Detail:</strong> ${this.detail}<br>
      <strong>Job Page Link:</strong> <a href="${this.jobPageLink}" target="_blank">${this.jobPageLink}</a><br>
    `;
  }
}

// Variables to hold jobs and filtered jobs
let jobs = [];
let filteredJobs = [];

// DOM elements
const fileInput = document.getElementById("file-input");
const jobList = document.getElementById("job-list");
const filterType = document.getElementById("filter-type");
const filterLevel = document.getElementById("filter-level");
const filterSkill = document.getElementById("filter-skill");
const sortOptions = document.getElementById("sort-options");
const applyFiltersButton = document.getElementById("apply-filters");

// Load JSON file and parse data
fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    try {
      const data = JSON.parse(reader.result);
      console.log("Loaded JSON data:", data);  // Debugging line to check loaded data
      if (!Array.isArray(data)) {
        throw new Error("Invalid JSON structure: Root should be an array.");
      }
      jobs = data.map((jobData) => new Job(jobData));
      filteredJobs = [...jobs];
      console.log("Jobs after mapping:", jobs);  // Debugging line to check jobs array
      displayJobs(filteredJobs);
      populateFilters();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      jobList.innerHTML = "<p>Invalid JSON file. Please upload a valid jobs.json file.</p>";
    }
  };
  reader.readAsText(file);
});

// Display jobs in the job list
function displayJobs(jobs) {
  console.log("Displaying jobs:", jobs);  // Debugging line to see jobs passed to displayJobs
  if (jobs.length === 0) {
    jobList.innerHTML = "<p>No jobs match the current filters.</p>";
    return;
  }

  jobList.innerHTML = jobs
    .map(
      (job) => `
    <div class="job">
      <strong>${job.title}</strong> - ${job.posted}<br>
      <em>${job.type}, ${job.level}, ${job.skill}</em><br>
      ${job.detail}<br>
      <a href="${job.jobPageLink}" target="_blank">View Job Page</a><br>
    </div>
  `
    )
    .join("");
}

// Populate filter dropdowns
function populateFilters() {
  const types = Array.from(new Set(jobs.map((job) => job.type))).sort();
  const levels = Array.from(new Set(jobs.map((job) => job.level))).sort();
  const skills = Array.from(new Set(jobs.map((job) => job.skill))).sort();

  populateFilterOptions(filterType, types);
  populateFilterOptions(filterLevel, levels);
  populateFilterOptions(filterSkill, skills);
}

function populateFilterOptions(filterElement, options) {
  filterElement.innerHTML = `<option value="">All</option>`;
  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    filterElement.appendChild(opt);
  });
}

//This will apply the filters and sorting
applyFiltersButton.addEventListener("click", function () {
  let filtered = [...jobs];

  //This will apply filters
  const selectedType = filterType.value;
  const selectedLevel = filterLevel.value;
  const selectedSkill = filterSkill.value;

  if (selectedType) {
    filtered = filtered.filter((job) => job.type === selectedType);
  }
  if (selectedLevel) {
    filtered = filtered.filter((job) => job.level === selectedLevel);
  }
  if (selectedSkill) {
    filtered = filtered.filter((job) => job.skill === selectedSkill);
  }

  // This will apply sorting
  const sortOption = sortOptions.value;
  if (sortOption === "title-asc") {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "title-desc") {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortOption === "posted-new") {
    filtered.sort((a, b) => new Date(b.posted) - new Date(a.posted));
  } else if (sortOption === "posted-old") {
    filtered.sort((a, b) => new Date(a.posted) - new Date(b.posted));
  }

  displayJobs(filtered);
});

// Initial message
jobList.innerHTML = "<p>No jobs to display. Upload a JSON file to get started!</p>";
