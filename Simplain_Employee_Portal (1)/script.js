document.addEventListener("DOMContentLoaded", function () {
  const todayDate = document.getElementById("todayDate");

  if (todayDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    todayDate.value = `${yyyy}-${mm}-${dd}`;
  }

  const form = document.getElementById("exitForm");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      alert("Exit Interview Form submitted successfully!");

      form.reset();

      if (todayDate) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        todayDate.value = `${yyyy}-${mm}-${dd}`;
      }
    });
  }

  // --- Employee Information Form ---
  const empForm = document.getElementById("empInfoForm");

  if (empForm) {
    // Show/require Spouse Name only when Married is selected
    const maritalStatus = document.getElementById("maritalStatus");
    const spouseName = document.getElementById("spouseName");

    function syncSpouseField() {
      if (maritalStatus && spouseName) {
        const isMarried = maritalStatus.value === "Married";
        spouseName.required = isMarried;
      }
    }

    if (maritalStatus) {
      maritalStatus.addEventListener("change", syncSpouseField);
      syncSpouseField();
    }

    // Copy Permanent Address into Communication Address
    const sameAsPermanent = document.getElementById("sameAsPermanent");
    const addressFieldMap = {
      permDoorNo: "commDoorNo",
      permStreet1: "commStreet1",
      permStreet2: "commStreet2",
      permCity: "commCity",
      permState: "commState",
      permPincode: "commPincode",
      permCountry: "commCountry"
    };

    function applySameAsPermanent() {
      const checked = sameAsPermanent && sameAsPermanent.checked;
      Object.entries(addressFieldMap).forEach(([permName, commName]) => {
        const permField = empForm.elements[permName];
        const commField = empForm.elements[commName];
        if (!permField || !commField) return;

        if (checked) {
          commField.value = permField.value;
          commField.readOnly = true;
        } else {
          commField.readOnly = false;
        }
      });
    }

    if (sameAsPermanent) {
      sameAsPermanent.addEventListener("change", applySameAsPermanent);

      Object.keys(addressFieldMap).forEach((permName) => {
        const permField = empForm.elements[permName];
        if (permField) {
          permField.addEventListener("input", () => {
            if (sameAsPermanent.checked) applySameAsPermanent();
          });
        }
      });
    }

    empForm.addEventListener("submit", function (event) {
      event.preventDefault();
      alert("Employee Information Form submitted successfully!");
      empForm.reset();
      syncSpouseField();
      if (sameAsPermanent) sameAsPermanent.checked = false;
    });
  }

  // --- Employee Leave Request Form ---
  const leaveForm = document.getElementById("leaveRequestForm");

  if (leaveForm) {
    const fromDate = document.getElementById("leaveFromDate");
    const toDate = document.getElementById("leaveToDate");
    const daysField = document.getElementById("leaveDays");

    function calcLeaveDays() {
      if (!fromDate.value || !toDate.value) return;
      const start = new Date(fromDate.value);
      const end = new Date(toDate.value);
      const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (diff > 0) daysField.value = diff;
    }

    fromDate.addEventListener("change", calcLeaveDays);
    toDate.addEventListener("change", calcLeaveDays);
  }

  // --- Employee Permission Request Form: auto-calc Total Hours ---
  const fromTime = document.getElementById("permissionFromTime");
  const toTime = document.getElementById("permissionToTime");
  const totalHours = document.getElementById("permissionTotalHours");

  if (fromTime && toTime && totalHours) {
    function calcTotalHours() {
      if (!fromTime.value || !toTime.value) return;
      const [fh, fm] = fromTime.value.split(":").map(Number);
      const [th, tm] = toTime.value.split(":").map(Number);
      let diffMinutes = (th * 60 + tm) - (fh * 60 + fm);
      if (diffMinutes <= 0) return;
      totalHours.value = Math.round((diffMinutes / 60) * 100) / 100;
    }

    fromTime.addEventListener("change", calcTotalHours);
    toTime.addEventListener("change", calcTotalHours);
  }

  // --- EPF ESI Request Form: auto-calc Age from DOB for family members ---
  document.querySelectorAll(".dob-age-input").forEach((dobField) => {
    const ageField = document.getElementById(dobField.dataset.ageTarget);
    if (!ageField) return;

    dobField.addEventListener("change", function () {
      if (!dobField.value) {
        ageField.value = "";
        return;
      }
      const dob = new Date(dobField.value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      ageField.value = age >= 0 ? age : "";
    });
  });

  // --- Auto-uppercase PAN / IFSC style fields ---
  document.querySelectorAll(".uppercase-input").forEach((field) => {
    field.addEventListener("input", function () {
      const cursor = field.selectionStart;
      field.value = field.value.toUpperCase();
      field.setSelectionRange(cursor, cursor);
    });
  });

  // --- Simple submit-and-reset forms (Leave, Permission, Laptop Service, General, EPF/ESI) ---
  const simpleForms = {
    leaveRequestForm: "Leave Request",
    permissionRequestForm: "Permission Request",
    laptopServiceForm: "Laptop Service Request",
    generalRequestForm: "General Request",
    epfEsiForm: "EPF ESI Request"
  };

  Object.entries(simpleForms).forEach(([formId, label]) => {
    const formEl = document.getElementById(formId);
    if (!formEl) return;

    formEl.addEventListener("submit", function (event) {
      event.preventDefault();
      alert(label + " Form submitted successfully!");
      formEl.reset();
    });
  });
});
