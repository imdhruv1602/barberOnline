// Function to validate form inputs before submitting
function validateForm() {
    const name = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const service = document.getElementById('service').value;
  
    if (!name || !phone || !date || !time || !service) {
      alert("Please fill out all fields.");
      return false;
    }
  
    // If all required fields are filled, show confirmation message and hide form
    document.getElementById('appointmentForm').reset();
    document.getElementById('confirmationMessage').classList.remove('hidden');
    return false;  // Prevent form submission (you would handle actual form submission to a server here)
  }
  