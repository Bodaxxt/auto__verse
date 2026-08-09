/**
 * Main JavaScript File - Auro Verse Event Recruitment & Entry Portal
 * Handles application forms, theme switching (Dark/Light), and administrator dashboard.
 */

// Theme Manager (Light / Dark Mode)
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Refresh chart theme if on admin dashboard
  if (typeof dashboardRawData !== "undefined" && window.myRequestsChart && typeof updateDashboardUI === "function") {
    updateDashboardUI();
  }
}

// Run theme init immediately to prevent FOUC (Flash of Unstyled Content)
initTheme();

// Interactive Logo Social Menu Toggle with Click & Hover
const logoRing = document.querySelector('.logo-interactive-ring');
if (logoRing) {
  const heroLogo = logoRing.querySelector('.hero-logo');
  
  // Toggle on logo click
  heroLogo.addEventListener('click', function(e) {
    e.stopPropagation();
    logoRing.classList.toggle('active');
  });
  
  // Hover support on desktop
  logoRing.addEventListener('mouseenter', function () {
    if (window.innerWidth > 768) {
      this.classList.add('active');
    }
  });
  
  logoRing.addEventListener('mouseleave', function () {
    if (window.innerWidth > 768) {
      this.classList.remove('active');
    }
  });
}

// Close social menu when clicking outside
document.addEventListener('click', function (e) {
  const ring = document.querySelector('.logo-interactive-ring');
  if (ring && !ring.contains(e.target)) {
    ring.classList.remove('active');
  }
});

// Default deployed Apps Script Web App URL
const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzCgY3bbgW9dlwsmwI6GyMxMkwMIv0V-bQ4na3uBVlmk7TC4AFJnBCaRjbx6Mdse80Q/exec";

let appsScriptUrl = localStorage.getItem("appsScriptUrl");

// Check for old URL hashes and enforce default if found or empty
const OLD_URLS = [
  "AKfycbyTXIwoY0aHy6NaIvSKmlKOmGLx0wpx7JqGfw6UhVG8wX6YTME0S9LjHFq7rc4owLcv",
  "AKfycbzOPpVGWK09ueExj_UGJki6fJXWF_iQjU6JnNi2aBMgrnJjRU3tu-NxVec-xu2II-7g",
  "AKfycbwIlNC6CAuLWdhMqfLgZ9f9IeS0rVKPqpSh0U5Z-gE1lGpjblE94tUvhaVcbl3ya22g",
  "AKfycbx4oEpycPphJqxFMXkvc560gSaDFJqd5byknWwD3J-JlAGFkIBPa9XPcTgCltutyPNv",
  "AKfycbwP9bVhKAgeWe8ChXFNM1VcikU6--U9aUIvMVsNPFpuKVpyOxfI-spJ4k7botJpjpWw",
  "AKfycbzLF_qoD0HwnkaNi-52ntLBfaARzWsHoMbUa9vKSiFXYt3gNYuBPXfmRb-8IfdLADdN"
];
const isOldUrl = OLD_URLS.some(old => appsScriptUrl && appsScriptUrl.includes(old));

if (!appsScriptUrl || appsScriptUrl.trim() === "" || appsScriptUrl === "null" || appsScriptUrl === "undefined" || isOldUrl) {
  appsScriptUrl = DEFAULT_APPS_SCRIPT_URL;
  localStorage.setItem("appsScriptUrl", DEFAULT_APPS_SCRIPT_URL);
}

// Config dynamic form fields for each category
const DYNAMIC_FIELDS_CONFIG = {
  "media_team": `
    <div class="form-group animate-fade-in">
        <label for="instagram"><i class="fab fa-instagram"></i> Instagram / Social Media Handle <span class="required">*</span></label>
        <input type="text" id="instagram" name="instagram" required placeholder="@yourhandle or profile link">
    </div>
    <div class="form-group animate-fade-in">
        <label for="contentType"><i class="fas fa-photo-video"></i> What type of content do you create? <span class="required">*</span></label>
        <select id="contentType" name="contentType" required>
            <option value="" disabled selected>Select content type...</option>
            <option value="Photography">Photography</option>
            <option value="Videography">Videography</option>
            <option value="Both (Photography & Videography)">Both (Photography & Videography)</option>
        </select>
    </div>
    <div class="form-group animate-fade-in">
        <label for="equipment"><i class="fas fa-camera"></i> What equipment do you use? <span class="required">*</span></label>
        <select id="equipment" name="equipment" required>
            <option value="" disabled selected>Select primary equipment...</option>
            <option value="Camera">Camera (DSLR / Mirrorless)</option>
            <option value="Phone">Phone</option>
            <option value="Gimbal">Gimbal / Stabilizer</option>
            <option value="Drone">Drone</option>
            <option value="Other / Full Rig">Other / Full Rig</option>
        </select>
    </div>
    <div class="form-group animate-fade-in">
        <label for="yearsExperience"><i class="fas fa-history"></i> Years of Experience <span class="required">*</span></label>
        <input type="text" id="yearsExperience" name="yearsExperience" required placeholder="e.g. 3 Years">
    </div>
    <div class="form-group animate-fade-in full-width">
        <label for="portfolioLink"><i class="fas fa-link"></i> Portfolio / Work Samples Link <span class="required">*</span></label>
        <input type="url" id="portfolioLink" name="portfolioLink" required placeholder="https://instagram.com/... or Behance / YouTube link">
    </div>
    <div class="form-group animate-fade-in">
        <label for="mediaRole"><i class="fas fa-id-badge"></i> Role Applying For <span class="required">*</span></label>
        <input type="text" id="mediaRole" name="mediaRole" required placeholder="e.g. Lead Photographer, Reel Editor, Drone Operator">
    </div>
    <div class="form-group animate-fade-in">
        <label for="carEventsExp"><i class="fas fa-flag-checkered"></i> Covered car events before? <span class="required">*</span></label>
        <select id="carEventsExp" name="carEventsExp" required onchange="toggleExperienceDetails(this.value)">
            <option value="" disabled selected>Select option...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>
    </div>
    <div class="form-group animate-fade-in full-width hidden" id="exp-details-group">
        <label for="carEventsDetails"><i class="fas fa-align-left"></i> Tell us about your car event experience</label>
        <textarea id="carEventsDetails" name="carEventsDetails" placeholder="Describe the car shows, meets, or automotive events you have shot before..."></textarea>
    </div>
    <div class="form-group animate-fade-in full-width">
        <label for="joinReason"><i class="fas fa-heart"></i> Why do you want to join the Media Team? <span class="required">*</span></label>
        <textarea id="joinReason" name="joinReason" required placeholder="Share your motivation and what skills you bring to Auro Verse..."></textarea>
    </div>
    <div class="form-group animate-fade-in full-width">
        <label for="additionalNotes"><i class="fas fa-comment-dots"></i> Any additional notes?</label>
        <input type="text" id="additionalNotes" name="additionalNotes" placeholder="Any extra info or equipment specs...">
    </div>

    <!-- Upload Work Examples -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-cloud-upload-alt"></i> Upload 2–3 Examples of Your Work <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('photos-input').click()">
            <i class="fas fa-photo-video"></i>
            <span>Click to upload work examples (PNG, JPG, WebP - up to 3 photos)</span>
        </div>
        <input type="file" id="photos-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'photos', 3)" style="display:none;">
        <div id="preview-photos" class="multi-preview-grid"></div>
    </div>

    <!-- ID Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-id-card"></i> ID Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('id-input').click()">
            <i class="fas fa-id-badge"></i>
            <span>Click to upload National ID Photo</span>
        </div>
        <input type="file" id="id-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'idPhotos', 2)" style="display:none;">
        <div id="preview-idPhotos" class="multi-preview-grid"></div>
    </div>
  `,

  "motorcycles": `
    <div class="form-group animate-fade-in">
        <label for="vehicleMake"><i class="fas fa-motorcycle"></i> Motorcycle Make <span class="required">*</span></label>
        <input type="text" id="vehicleMake" name="vehicleMake" required placeholder="e.g. Yamaha / Honda / Ducati">
    </div>
    <div class="form-group animate-fade-in">
        <label for="vehicleModel"><i class="fas fa-tag"></i> Motorcycle Model <span class="required">*</span></label>
        <input type="text" id="vehicleModel" name="vehicleModel" required placeholder="e.g. YZF-R1M / Panigale V4">
    </div>
    <div class="form-group animate-fade-in">
        <label for="vehicleYear"><i class="fas fa-calendar-alt"></i> Year <span class="required">*</span></label>
        <input type="number" id="vehicleYear" name="vehicleYear" required min="1900" max="2027" placeholder="e.g. 2023">
    </div>
    <div class="form-group animate-fade-in">
        <label for="engineCC"><i class="fas fa-tachometer-alt"></i> Engine Size (CC) <span class="required">*</span></label>
        <input type="text" id="engineCC" name="engineCC" required placeholder="e.g. 998 cc">
    </div>
    <div class="form-group animate-fade-in">
        <label for="vehicleColor"><i class="fas fa-palette"></i> Color <span class="required">*</span></label>
        <input type="text" id="vehicleColor" name="vehicleColor" required placeholder="e.g. Matte Black / Race Blue">
    </div>
    <div class="form-group animate-fade-in">
        <label for="instagram"><i class="fab fa-instagram"></i> Instagram Handle <span class="required">*</span></label>
        <input type="text" id="instagram" name="instagram" required placeholder="@yourhandle">
    </div>
    <div class="form-group animate-fade-in">
        <label for="isModified"><i class="fas fa-tools"></i> Is it Modified? <span class="required">*</span></label>
        <select id="isModified" name="isModified" required onchange="toggleModificationsDetails(this.value)">
            <option value="" disabled selected>Select option...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>
    </div>
    <div class="form-group animate-fade-in full-width hidden" id="mods-details-group">
        <label for="vehicleMods"><i class="fas fa-cogs"></i> Modifications List</label>
        <textarea id="vehicleMods" name="vehicleMods" placeholder="Detail any aftermarket exhaust, custom ECU, carbon fairings, etc..."></textarea>
    </div>

    <!-- Upload 5 Motorcycle Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-camera"></i> Upload 5 Motorcycle Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('photos-input').click()">
            <i class="fas fa-images"></i>
            <span>Click to upload bike photos (Up to 5 images)</span>
        </div>
        <input type="file" id="photos-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'photos', 5)" style="display:none;">
        <div id="preview-photos" class="multi-preview-grid"></div>
    </div>

    <!-- ID Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-id-card"></i> ID Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('id-input').click()">
            <i class="fas fa-id-badge"></i>
            <span>Click to upload National ID Photo</span>
        </div>
        <input type="file" id="id-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'idPhotos', 2)" style="display:none;">
        <div id="preview-idPhotos" class="multi-preview-grid"></div>
    </div>

    <!-- License Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-address-card"></i> License Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('license-input').click()">
            <i class="fas fa-file-contract"></i>
            <span>Click to upload Driving / Bike License Photo</span>
        </div>
        <input type="file" id="license-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'licensePhotos', 2)" style="display:none;">
        <div id="preview-licensePhotos" class="multi-preview-grid"></div>
    </div>
  `,

  "exotic_cars": `
    <div class="form-group animate-fade-in">
        <label for="vehicleMake"><i class="fas fa-car"></i> Car Make <span class="required">*</span></label>
        <input type="text" id="vehicleMake" name="vehicleMake" required placeholder="e.g. Lamborghini / Ferrari / McLaren">
    </div>
    <div class="form-group animate-fade-in">
        <label for="vehicleModel"><i class="fas fa-tag"></i> Car Model <span class="required">*</span></label>
        <input type="text" id="vehicleModel" name="vehicleModel" required placeholder="e.g. Aventador SVJ / 488 Pista">
    </div>
    <div class="form-group animate-fade-in">
        <label for="vehicleYear"><i class="fas fa-calendar-alt"></i> Year <span class="required">*</span></label>
        <input type="number" id="vehicleYear" name="vehicleYear" required min="1990" max="2027" placeholder="e.g. 2022">
    </div>
    <div class="form-group animate-fade-in">
        <label for="engineSpecs"><i class="fas fa-bolt"></i> Engine / Performance Specs <span class="required">*</span></label>
        <input type="text" id="engineSpecs" name="engineSpecs" required placeholder="e.g. V12 6.5L 770HP">
    </div>
    <div class="form-group animate-fade-in">
        <label for="vehicleColor"><i class="fas fa-palette"></i> Color <span class="required">*</span></label>
        <input type="text" id="vehicleColor" name="vehicleColor" required placeholder="e.g. Verde Mantis / Rosso Corsa">
    </div>
    <div class="form-group animate-fade-in">
        <label for="instagram"><i class="fab fa-instagram"></i> Instagram Handle <span class="required">*</span></label>
        <input type="text" id="instagram" name="instagram" required placeholder="@yourhandle">
    </div>
    <div class="form-group animate-fade-in">
        <label for="isModified"><i class="fas fa-tools"></i> Is it Modified? <span class="required">*</span></label>
        <select id="isModified" name="isModified" required onchange="toggleModificationsDetails(this.value)">
            <option value="" disabled selected>Select option...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
        </select>
    </div>
    <div class="form-group animate-fade-in full-width hidden" id="mods-details-group">
        <label for="vehicleMods"><i class="fas fa-cogs"></i> List Modifications</label>
        <textarea id="vehicleMods" name="vehicleMods" placeholder="e.g. Titanium exhaust, Novitec kit, ECU reflash..."></textarea>
    </div>

    <!-- Upload 5 Car Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-camera"></i> Upload 5 Car Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('photos-input').click()">
            <i class="fas fa-images"></i>
            <span>Click to upload exotic car photos (Up to 5 images)</span>
        </div>
        <input type="file" id="photos-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'photos', 5)" style="display:none;">
        <div id="preview-photos" class="multi-preview-grid"></div>
    </div>

    <!-- ID Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-id-card"></i> ID Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('id-input').click()">
            <i class="fas fa-id-badge"></i>
            <span>Click to upload National ID Photo</span>
        </div>
        <input type="file" id="id-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'idPhotos', 2)" style="display:none;">
        <div id="preview-idPhotos" class="multi-preview-grid"></div>
    </div>

    <!-- License Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-address-card"></i> License Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('license-input').click()">
            <i class="fas fa-file-contract"></i>
            <span>Click to upload Driving / Vehicle License Photo</span>
        </div>
        <input type="file" id="license-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'licensePhotos', 2)" style="display:none;">
        <div id="preview-licensePhotos" class="multi-preview-grid"></div>
    </div>
  `,

  "stance_cars": `
    <div class="form-group animate-fade-in">
        <label for="vehicleMake"><i class="fas fa-car"></i> Car Make <span class="required">*</span></label>
        <input type="text" id="vehicleMake" name="vehicleMake" required placeholder="e.g. BMW / Audi / Nissan">
    </div>
    <div class="form-group animate-fade-in">
        <label for="vehicleModel"><i class="fas fa-tag"></i> Car Model <span class="required">*</span></label>
        <input type="text" id="vehicleModel" name="vehicleModel" required placeholder="e.g. E46 M3 / 370Z / Golf R">
    </div>
    <div class="form-group animate-fade-in">
        <label for="vehicleYear"><i class="fas fa-calendar-alt"></i> Year <span class="required">*</span></label>
        <input type="number" id="vehicleYear" name="vehicleYear" required min="1980" max="2027" placeholder="e.g. 2018">
    </div>
    <div class="form-group animate-fade-in">
        <label for="wheelDetails"><i class="fas fa-compact-disc"></i> Wheel Brand & Size <span class="required">*</span></label>
        <input type="text" id="wheelDetails" name="wheelDetails" required placeholder="e.g. BBS RS 3-piece 19x10.5 ET-15">
    </div>
    <div class="form-group animate-fade-in">
        <label for="suspensionSetup"><i class="fas fa-arrows-alt-v"></i> Suspension Setup <span class="required">*</span></label>
        <input type="text" id="suspensionSetup" name="suspensionSetup" required placeholder="e.g. Air Suspension / Static Coilovers">
    </div>
    <div class="form-group animate-fade-in">
        <label for="loweringSetup"><i class="fas fa-compress-arrows-alt"></i> Lowering Setup <span class="required">*</span></label>
        <input type="text" id="loweringSetup" name="loweringSetup" required placeholder="e.g. Air Lift Performance 3P / BC Racing">
    </div>
    <div class="form-group animate-fade-in">
        <label for="fitmentType"><i class="fas fa-ruler-combined"></i> Fitment Type <span class="required">*</span></label>
        <select id="fitmentType" name="fitmentType" required>
            <option value="" disabled selected>Select fitment type...</option>
            <option value="Flush">Flush</option>
            <option value="Tucked">Tucked</option>
            <option value="Poke">Poke</option>
            <option value="Cambered">Cambered (-8°+)</option>
        </select>
    </div>
    <div class="form-group animate-fade-in">
        <label for="instagram"><i class="fab fa-instagram"></i> Instagram Handle <span class="required">*</span></label>
        <input type="text" id="instagram" name="instagram" required placeholder="@yourhandle">
    </div>
    <div class="form-group animate-fade-in full-width">
        <label for="exteriorMods"><i class="fas fa-paint-brush"></i> Exterior Modifications <span class="required">*</span></label>
        <textarea id="exteriorMods" name="exteriorMods" required placeholder="e.g. Custom Pandem Widebody, Carbon splitter, custom paint/wrap..."></textarea>
    </div>

    <!-- Upload 5 Car Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-camera"></i> Upload 5 Car Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('photos-input').click()">
            <i class="fas fa-images"></i>
            <span>Click to upload stance car photos (Up to 5 images)</span>
        </div>
        <input type="file" id="photos-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'photos', 5)" style="display:none;">
        <div id="preview-photos" class="multi-preview-grid"></div>
    </div>

    <!-- ID Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-id-card"></i> ID Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('id-input').click()">
            <i class="fas fa-id-badge"></i>
            <span>Click to upload National ID Photo</span>
        </div>
        <input type="file" id="id-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'idPhotos', 2)" style="display:none;">
        <div id="preview-idPhotos" class="multi-preview-grid"></div>
    </div>

    <!-- License Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-address-card"></i> License Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('license-input').click()">
            <i class="fas fa-file-contract"></i>
            <span>Click to upload Driving / Vehicle License Photo</span>
        </div>
        <input type="file" id="license-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'licensePhotos', 2)" style="display:none;">
        <div id="preview-licensePhotos" class="multi-preview-grid"></div>
    </div>
  `,

  "classic_cars": `
    <div class="form-group animate-fade-in">
        <label for="vehicleMake"><i class="fas fa-car"></i> Car Make <span class="required">*</span></label>
        <input type="text" id="vehicleMake" name="vehicleMake" required placeholder="e.g. Ford / Chevrolet / Mercedes">
    </div>
    <div class="form-group animate-fade-in">
        <label for="vehicleModel"><i class="fas fa-tag"></i> Car Model <span class="required">*</span></label>
        <input type="text" id="vehicleModel" name="vehicleModel" required placeholder="e.g. Mustang Fastback / Corvette C2">
    </div>
    <div class="form-group animate-fade-in">
        <label for="vehicleYear"><i class="fas fa-calendar-alt"></i> Year <span class="required">*</span></label>
        <input type="number" id="vehicleYear" name="vehicleYear" required min="1900" max="1995" placeholder="e.g. 1967">
    </div>
    <div class="form-group animate-fade-in">
        <label for="restorationType"><i class="fas fa-tools"></i> Original or Restored? <span class="required">*</span></label>
        <select id="restorationType" name="restorationType" required>
            <option value="" disabled selected>Select option...</option>
            <option value="Original Factory Condition">Original Factory Condition</option>
            <option value="Fully Restored">Fully Restored</option>
            <option value="Restomod / Custom">Restomod / Custom</option>
        </select>
    </div>
    <div class="form-group animate-fade-in">
        <label for="engineDetails"><i class="fas fa-cogs"></i> Engine Details <span class="required">*</span></label>
        <input type="text" id="engineDetails" name="engineDetails" required placeholder="e.g. 289 V8 Small Block / Matching Numbers">
    </div>
    <div class="form-group animate-fade-in">
        <label for="instagram"><i class="fab fa-instagram"></i> Instagram Handle <span class="required">*</span></label>
        <input type="text" id="instagram" name="instagram" required placeholder="@yourhandle">
    </div>
    <div class="form-group animate-fade-in full-width">
        <label for="restorationDetails"><i class="fas fa-align-left"></i> Restoration Details</label>
        <textarea id="restorationDetails" name="restorationDetails" placeholder="Describe the restoration process, paint finish, interior trim..."></textarea>
    </div>
    <div class="form-group animate-fade-in full-width">
        <label for="originalPartsMods"><i class="fas fa-wrench"></i> Original Parts / Modifications</label>
        <textarea id="originalPartsMods" name="originalPartsMods" placeholder="List original rare parts or custom modern upgrades added..."></textarea>
    </div>

    <!-- Upload 5 Car Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-camera"></i> Upload 5 Car Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('photos-input').click()">
            <i class="fas fa-images"></i>
            <span>Click to upload classic car photos (Up to 5 images)</span>
        </div>
        <input type="file" id="photos-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'photos', 5)" style="display:none;">
        <div id="preview-photos" class="multi-preview-grid"></div>
    </div>

    <!-- ID Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-id-card"></i> ID Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('id-input').click()">
            <i class="fas fa-id-badge"></i>
            <span>Click to upload National ID Photo</span>
        </div>
        <input type="file" id="id-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'idPhotos', 2)" style="display:none;">
        <div id="preview-idPhotos" class="multi-preview-grid"></div>
    </div>

    <!-- License Photos -->
    <div class="form-group animate-fade-in full-width">
        <label><i class="fas fa-address-card"></i> License Photos <span class="required">*</span></label>
        <div class="file-custom-btn" onclick="document.getElementById('license-input').click()">
            <i class="fas fa-file-contract"></i>
            <span>Click to upload Driving / Vehicle License Photo</span>
        </div>
        <input type="file" id="license-input" accept="image/*" multiple onchange="handleGroupUpload(event, 'licensePhotos', 2)" style="display:none;">
        <div id="preview-licensePhotos" class="multi-preview-grid"></div>
    </div>
  `
};

// Friendly Category Names for UI and Table titles
const CATEGORY_NAMES = {
  "media_team": "Media Team",
  "motorcycles": "Motorcycles",
  "exotic_cars": "Exotic Cars",
  "stance_cars": "Stance Cars",
  "classic_cars": "Classic Cars"
};

// Global object holding file uploads for selected form
let selectedUploads = {
  photos: [],
  idPhotos: [],
  licensePhotos: []
};

// Initialize scripts
document.addEventListener("DOMContentLoaded", function () {

  // 1. Client form page
  if (document.getElementById("request-form")) {
    console.log("Auro Verse Entry Portal initialized.");
  }

  // 2. Admin dashboard page
  if (document.getElementById("login-form") || document.getElementById("dashboard-section")) {
    checkAdminAuth();

    const scriptInput = document.getElementById("apps-script-url-input");
    if (scriptInput && appsScriptUrl) {
      scriptInput.value = appsScriptUrl;
    }
  }
});

/* ==========================================================================
   Client Portal Logic (index.html)
   ========================================================================== */

/**
 * Toggle conditional text fields
 */
function toggleExperienceDetails(value) {
  const group = document.getElementById("exp-details-group");
  if (group) {
    if (value === "Yes") {
      group.classList.remove("hidden");
    } else {
      group.classList.add("hidden");
    }
  }
}

function toggleModificationsDetails(value) {
  const group = document.getElementById("mods-details-group");
  if (group) {
    if (value === "Yes") {
      group.classList.remove("hidden");
    } else {
      group.classList.add("hidden");
    }
  }
}

/**
 * Handle category card click and show form
 */
function selectCategory(categoryKey) {
  document.querySelectorAll(".wide-category-btn").forEach(card => {
    card.classList.remove("selected");
  });

  const selectedCard = document.querySelector(`.wide-category-btn[data-category="${categoryKey}"]`);
  if (selectedCard) {
    selectedCard.classList.add("selected");
  }

  document.getElementById("selected-category").value = categoryKey;

  const categoryTag = document.getElementById("category-tag");
  categoryTag.innerText = CATEGORY_NAMES[categoryKey] || categoryKey;

  categoryTag.className = "form-category-tag";
  categoryTag.classList.add(`tag-${categoryKey}`);

  document.getElementById("form-title").innerText = `Apply for ${CATEGORY_NAMES[categoryKey]}`;

  // Reset uploaded file state
  selectedUploads = {
    photos: [],
    idPhotos: [],
    licensePhotos: []
  };

  // Hide single old file input container if present
  const oldPhotoContainer = document.querySelector(".form-group.full-width:has(#photoInputLabel)");
  if (oldPhotoContainer) oldPhotoContainer.style.display = "none";

  const dynamicContainer = document.getElementById("dynamic-fields-container");
  dynamicContainer.innerHTML = DYNAMIC_FIELDS_CONFIG[categoryKey] || "";

  const formSection = document.getElementById("form-section");
  formSection.classList.remove("hidden");

  setTimeout(() => {
    formSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

/**
 * Compress and resize images client-side before sending to Google Apps Script.
 * Keeps max dimensions to 1200px and JPEG quality to 0.75 for fast uploading and low payload size.
 */
function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const base64 = dataUrl.split(",")[1];

        resolve({
          base64: base64,
          mimeType: "image/jpeg",
          fileName: file.name.replace(/\.[^/.]+$/, "") + ".jpg",
          dataUrl: dataUrl
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Multi-file upload handling per category
 */
async function handleGroupUpload(event, groupKey, maxFiles) {
  const files = Array.from(event.target.files);
  if (!files || files.length === 0) return;

  if (selectedUploads[groupKey].length + files.length > maxFiles) {
    alert(`You can upload a maximum of ${maxFiles} photos for this field.`);
    event.target.value = '';
    return;
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      alert(`File "${file.name}" is not a valid image.`);
      continue;
    }

    try {
      const compressedItem = await compressImage(file, 1200, 1200, 0.75);
      selectedUploads[groupKey].push(compressedItem);
    } catch (err) {
      console.error("Compression error for file:", file.name, err);
      alert(`Failed to process image "${file.name}". Please try another image.`);
    }
  }

  renderGroupUploadPreviews(groupKey);
  event.target.value = '';
}

function renderGroupUploadPreviews(groupKey) {
  const container = document.getElementById(`preview-${groupKey}`);
  if (!container) return;

  container.innerHTML = "";
  selectedUploads[groupKey].forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "preview-thumb-card";
    card.innerHTML = `
      <img src="${item.dataUrl}" alt="Thumbnail">
      <span title="${escapeHTML(item.fileName)}">${escapeHTML(item.fileName)}</span>
      <button type="button" class="thumb-remove-btn" onclick="removeGroupUploadItem('${groupKey}', ${index})">
        <i class="fas fa-times"></i>
      </button>
    `;
    container.appendChild(card);
  });
}

function removeGroupUploadItem(groupKey, index) {
  selectedUploads[groupKey].splice(index, 1);
  renderGroupUploadPreviews(groupKey);
}

// Fallback photo handlers for backward compatibility
let selectedPhotoData = null;
function handlePhotoSelect(event) { }
function removeSelectedPhoto() { }

/**
 * Handle form submission
 */
function submitForm(event) {
  event.preventDefault();

  if (!appsScriptUrl) {
    showStatusMessage("error", "Apps Script endpoint is not configured. Please save your Web App URL in the Admin Dashboard.");
    return;
  }

  const categoryValue = document.getElementById("selected-category").value;
  if (!categoryValue || !CATEGORY_NAMES[categoryValue]) {
    alert("Please select a registration category before submitting.");
    return;
  }

  // Validate required uploads
  if (!selectedUploads.photos || selectedUploads.photos.length === 0) {
    alert(categoryValue === 'media_team' ? "Please upload 2-3 examples of your work." : "Please upload at least 1 vehicle photo.");
    return;
  }

  if (!selectedUploads.idPhotos || selectedUploads.idPhotos.length === 0) {
    alert("Please upload your ID photo.");
    return;
  }

  if (categoryValue !== 'media_team' && (!selectedUploads.licensePhotos || selectedUploads.licensePhotos.length === 0)) {
    alert("Please upload your license photo.");
    return;
  }

  const form = document.getElementById("request-form");
  const submitBtn = document.getElementById("submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const spinner = submitBtn.querySelector(".spinner");

  const formData = new FormData(form);
  const payload = {};
  formData.forEach((value, key) => {
    if (value instanceof File) return;
    payload[key] = typeof value === "string" ? value.trim() : value;
  });

  // Exclude dataUrl to keep payload minimal (sends only base64, mimeType, fileName)
  const cleanUploads = (arr) => (arr || []).map(item => ({
    base64: item.base64,
    mimeType: item.mimeType,
    fileName: item.fileName
  }));

  payload.category = categoryValue.trim();
  payload.photos = cleanUploads(selectedUploads.photos);
  payload.idPhotos = cleanUploads(selectedUploads.idPhotos);
  payload.licensePhotos = cleanUploads(selectedUploads.licensePhotos);

  submitBtn.disabled = true;
  btnText.innerText = "Submitting application...";
  spinner.classList.remove("hidden");

  fetch(appsScriptUrl, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Server responded with error status");
      }
      return response.json();
    })
    .then(result => {
      if (result.status === "success") {
        showStatusMessage("success", result.message);
        form.reset();
        selectedUploads = { photos: [], idPhotos: [], licensePhotos: [] };
        ['photos', 'idPhotos', 'licensePhotos'].forEach(renderGroupUploadPreviews);

        setTimeout(() => {
          document.getElementById("form-section").classList.add("hidden");
          document.querySelectorAll(".wide-category-btn").forEach(c => c.classList.remove("selected"));
          document.getElementById("categories-section").scrollIntoView({ behavior: "smooth" });
        }, 2500);

      } else {
        showStatusMessage("error", result.message || "Failed to save submission data.");
      }
    })
    .catch(error => {
      console.error("Error submitting request:", error);
      showStatusMessage("error", "Failed to submit. Please verify internet connectivity and Apps Script connection settings.");
    })
    .finally(() => {
      submitBtn.disabled = false;
      btnText.innerText = "Submit Application";
      spinner.classList.add("hidden");
    });
}

function showStatusMessage(type, text) {
  const statusDiv = document.getElementById("status-message");
  const contentDiv = statusDiv.querySelector(".message-content");
  const icon = statusDiv.querySelector(".message-icon");
  const msgText = statusDiv.querySelector(".message-text");

  contentDiv.className = "message-content " + type;

  if (type === "success") {
    icon.className = "message-icon fas fa-user-check";
    msgText.style.color = "var(--text-main)";
  } else {
    icon.className = "message-icon fas fa-user-times";
    msgText.style.color = "#f87171";
  }

  msgText.innerText = text;
  statusDiv.classList.remove("hidden");
}

function closeStatusMessage() {
  document.getElementById("status-message").classList.add("hidden");
}


/* ==========================================================================
   Administrator Dashboard Logic (admin.html)
   ========================================================================== */

let dashboardRawData = {};
let activeTab = "media_team";

function checkAdminAuth() {
  const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";

  const loginSection = document.getElementById("login-section");
  const dashboardSection = document.getElementById("dashboard-section");
  const logoutBtn = document.getElementById("logout-btn-container");

  if (isLoggedIn) {
    if (loginSection) loginSection.classList.add("hidden");
    if (dashboardSection) dashboardSection.classList.remove("hidden");
    if (logoutBtn) logoutBtn.classList.remove("hidden");

    if (appsScriptUrl) {
      fetchDashboardData();
    } else {
      showDashboardAlert("Please save your Google Apps Script Web App URL in the settings card below to sync event files.");
    }
  } else {
    if (loginSection) loginSection.classList.remove("hidden");
    if (dashboardSection) dashboardSection.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
  }
}

function handleLogin(event) {
  event.preventDefault();

  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value;
  const errorDiv = document.getElementById("login-error");

  if (user === "eetsh" && pass === "admin123") {
    sessionStorage.setItem("isAdminLoggedIn", "true");
    errorDiv.classList.add("hidden");

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    checkAdminAuth();
  } else {
    errorDiv.classList.remove("hidden");
  }
}

function logout(event) {
  event.preventDefault();
  sessionStorage.removeItem("isAdminLoggedIn");
  checkAdminAuth();
}

function saveSettings() {
  const urlInput = document.getElementById("apps-script-url-input").value.trim();
  const successLabel = document.getElementById("settings-save-success");

  if (!urlInput) {
    alert("Please enter a valid URL!");
    return;
  }

  localStorage.setItem("appsScriptUrl", urlInput);
  appsScriptUrl = urlInput;

  successLabel.classList.remove("hidden");

  setTimeout(() => {
    successLabel.classList.add("hidden");
  }, 3000);

  fetchDashboardData();
}

function fetchDashboardData() {
  if (!appsScriptUrl) {
    showDashboardAlert("Web App URL is empty.");
    return;
  }

  const refreshIcon = document.getElementById("refresh-icon");
  if (refreshIcon) refreshIcon.classList.add("fa-spin");

  fetch(appsScriptUrl, {
    method: "GET",
    mode: "cors"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTP error retrieving rows");
      }
      return response.json();
    })
    .then(result => {
      if (result.status === "success") {
        dashboardRawData = result.data;
        updateDashboardUI();
      } else {
        alert("Error refreshing rows: " + result.message);
      }
    })
    .catch(error => {
      console.error("Dashboard Fetch Error:", error);
      showDashboardAlert("Connection to database sheets failed. Ensure the Web App is deployed as 'Anyone' and CORS is active.");
    })
    .finally(() => {
      if (refreshIcon) refreshIcon.classList.remove("fa-spin");
    });
}

function updateDashboardUI() {
  const mediaCount = (dashboardRawData.media_team || []).length;
  const motorcyclesCount = (dashboardRawData.motorcycles || []).length;
  const exoticCount = (dashboardRawData.exotic_cars || []).length;
  const stanceCount = (dashboardRawData.stance_cars || []).length;
  const classicCount = (dashboardRawData.classic_cars || []).length;
  const totalCount = mediaCount + motorcyclesCount + exoticCount + stanceCount + classicCount;

  if (document.getElementById("stat-total")) document.getElementById("stat-total").innerText = totalCount;
  if (document.getElementById("stat-media_team")) document.getElementById("stat-media_team").innerText = mediaCount;
  if (document.getElementById("stat-motorcycles")) document.getElementById("stat-motorcycles").innerText = motorcyclesCount;
  if (document.getElementById("stat-exotic_cars")) document.getElementById("stat-exotic_cars").innerText = exoticCount;
  if (document.getElementById("stat-stance_cars")) document.getElementById("stat-stance_cars").innerText = stanceCount;
  if (document.getElementById("stat-classic_cars")) document.getElementById("stat-classic_cars").innerText = classicCount;

  let allRequests = [];

  for (let key in CATEGORY_NAMES) {
    if (dashboardRawData[key]) {
      dashboardRawData[key].forEach(item => {
        allRequests.push({ ...item, _catKey: key, _catLabel: CATEGORY_NAMES[key] });
      });
    }
  }

  // Sort by entry Timestamp descending
  allRequests.sort((a, b) => {
    var dateA = a["Timestamp"] || a["التاريخ"] || "";
    var dateB = b["Timestamp"] || b["التاريخ"] || "";
    return new Date(dateB) - new Date(dateA);
  });

  const recentList = document.getElementById("recent-requests-list");
  if (recentList) {
    recentList.innerHTML = "";

    if (allRequests.length === 0) {
      recentList.innerHTML = `<li class="empty-state">No entries registered yet</li>`;
    } else {
      const latestFive = allRequests.slice(0, 5);
      latestFive.forEach(req => {
        const nameVal = req["Full Name"] || req["الاسم الكامل"] || "Unknown";
        const dateVal = req["Timestamp"] || req["التاريخ"] || "N/A";
        const li = document.createElement("li");
        li.className = "recent-item";
        li.innerHTML = `
          <div class="recent-item-info">
              <span class="recent-name">${escapeHTML(nameVal)}</span>
              <span class="recent-date">${dateVal}</span>
          </div>
          <span class="recent-badge tag-${req._catKey}">${req._catLabel}</span>
        `;
        recentList.appendChild(li);
      });
    }
  }

  renderChart(mediaCount, motorcyclesCount, exoticCount, stanceCount, classicCount);
  buildDetailTable();
}

function renderChart(media, motorcycles, exotic, stance, classic) {
  const chartCanvas = document.getElementById("requestsChart");
  if (!chartCanvas) return;
  const ctx = chartCanvas.getContext("2d");
  const isLight = document.documentElement.getAttribute("data-theme") === "light";

  if (window.myRequestsChart) {
    window.myRequestsChart.destroy();
  }

  window.myRequestsChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Media Team', 'Motorcycles', 'Exotic Cars', 'Stance Cars', 'Classic Cars'],
      datasets: [{
        data: [media, motorcycles, exotic, stance, classic],
        backgroundColor: [
          '#10b981', // Emerald
          '#ef4444', // Red
          '#d946ef', // Magenta
          '#06b6d4', // Cyan
          '#f59e0b'  // Amber
        ],
        borderColor: isLight ? '#ffffff' : '#0f1524',
        borderWidth: 2,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: isLight ? '#334155' : '#94a3b8',
            font: {
              family: 'Cairo',
              size: 11
            },
            padding: 15
          }
        }
      }
    }
  });
}

function switchTableTab(categoryKey) {
  activeTab = categoryKey;

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  const tabBtn = document.getElementById(`tab-btn-${categoryKey}`);
  if (tabBtn) tabBtn.classList.add("active");

  buildDetailTable();
}

function buildDetailTable() {
  const headersRow = document.getElementById("table-headers");
  const tableBody = document.getElementById("table-body");
  const emptyState = document.getElementById("table-empty-state");
  const table = document.getElementById("data-table");

  if (!headersRow || !tableBody || !table) return;

  headersRow.innerHTML = "";
  tableBody.innerHTML = "";

  const rows = dashboardRawData[activeTab] || [];

  if (rows.length === 0) {
    table.classList.add("hidden");
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  table.classList.remove("hidden");
  if (emptyState) emptyState.classList.add("hidden");

  // Filter internal JS properties starting with underscore
  const keys = Object.keys(rows[0]).filter(k => !k.startsWith("_"));

  keys.forEach(key => {
    const th = document.createElement("th");
    th.innerText = key;
    headersRow.appendChild(th);
  });

  rows.forEach(rowData => {
    const tr = document.createElement("tr");
    keys.forEach(key => {
      const td = document.createElement("td");
      const cellValue = rowData[key] !== undefined ? rowData[key] : "";

      // Render photo URLs as links
      if (typeof cellValue === "string" && cellValue.includes("http")) {
        const parts = cellValue.split(",").map(s => s.trim()).filter(Boolean);
        td.innerHTML = parts.map((url, i) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener" class="table-img-link"><i class="fas fa-image"></i> View ${parts.length > 1 ? '#' + (i + 1) : 'Image'}</a>`).join(" ");
      } else {
        td.innerText = cellValue;
      }
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });
}

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g,
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function showDashboardAlert(message) {
  const recentList = document.getElementById("recent-requests-list");
  if (recentList) {
    recentList.innerHTML = `<li class="empty-state"><i class="fas fa-exclamation-triangle"></i> ${message}</li>`;
  }

  const tableBody = document.getElementById("table-body");
  if (tableBody) tableBody.innerHTML = "";

  const emptyState = document.getElementById("table-empty-state");
  if (emptyState) {
    emptyState.classList.remove("hidden");
    emptyState.querySelector("p").innerText = message;
  }
}
