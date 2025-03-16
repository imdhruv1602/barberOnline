const form = document.querySelector('.appoin-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();  // Prevent the default form submission

  // Collect the form data
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  try {
    // Make the POST request
    const response = await fetch('http://127.0.0.1:5000/submit-appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to book appointment');
    }

    const responseData = await response.json(); // Parse the response as JSON
    console.log('Appointment response:', responseData);
    alert('Appointment booked successfully!');
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to book appointment');
  }
});
