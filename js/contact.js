document.addEventListener('DOMContentLoaded', function () {
  // Select the form and message display elements
  const form = document.getElementById('contact-form');
  const formMessages = document.getElementById('form-messages');

  // Select the submit button and loading indicator
  const submitButton = document.getElementById('submit-button');
  const loadingIndicator = document.getElementById('loading');

  // Select individual form fields
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const subjectField = document.getElementById('subject');
  const messageField = document.getElementById('message');

  // Attach input event listeners for real-time validation
  nameField.addEventListener('input', () => validateField('name'));
  emailField.addEventListener('input', () => validateField('email'));
  subjectField.addEventListener('input', () => validateField('subject'));
  messageField.addEventListener('input', () => validateField('message'));

  // Attach a submit event listener to the form
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Clear previous messages and remove success/error classes
    formMessages.innerHTML = '';
    formMessages.classList.remove('error', 'success');

    // Retrieve and trim form field values
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const subject = subjectField.value.trim();
    const message = messageField.value.trim();

    // Initialize an array to hold validation error messages
    let errors = [];

    // ------------------------
    // Validation Logic
    // ------------------------

    // Validate Name
    if (name === '') {
      errors.push('Name is required.');
      setError('name', 'Name is required.');
    } else {
      clearError('name');
    }

    // Validate Email using a regular expression pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      errors.push('Email is required.');
      setError('email', 'Email is required.');
    } else if (!emailPattern.test(email)) {
      errors.push('Please enter a valid email address.');
      setError('email', 'Please enter a valid email address.');
    } else {
      clearError('email');
    }

    // Validate Subject
    if (subject === '') {
      errors.push('Subject is required.');
      setError('subject', 'Subject is required.');
    } else {
      clearError('subject');
    }

    // Validate Message
    if (message === '') {
      errors.push('Message is required.');
      setError('message', 'Message is required.');
    } else {
      clearError('message');
    }

    // ------------------------
    // Error Handling
    // ------------------------

    if (errors.length > 0) {
      // If there are validation errors, display them
      let errorHtml = '<ul>';
      errors.forEach(function (error) {
        errorHtml += `<li>${error}</li>`;
      });
      errorHtml += '</ul>';
      formMessages.innerHTML = errorHtml;
      formMessages.classList.add('error');
    } else {
      // If the form is valid, proceed with AJAX submission

      // Disable the submit button and show the loading indicator
      submitButton.disabled = true;
      loadingIndicator.style.display = 'block';

      // Prepare the form data as an object
      const formData = {
        name: name,
        email: email,
        subject: subject,
        message: message
      };

      // Send the form data to the server using Fetch API
      fetch('https://yourdomain.com/api/contact', { // 📌 **IMPORTANT:** Replace with your actual server endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Sending JSON data
        },
        body: JSON.stringify(formData) // Convert the form data to JSON
      })
        .then(response => {
          if (!response.ok) {
            // If the response is not OK (status code outside 200-299), throw an error
            return response.json().then(errData => {
              throw new Error(errData.message || 'Something went wrong!');
            });
          }
          return response.json(); // Parse the JSON response
        })
        .then(data => {
          // Handle successful response from the server
          formMessages.innerHTML = '<p>Your message has been sent successfully!</p>';
          formMessages.classList.add('success');

          // Reset the form fields
          form.reset();

          // Optionally, remove success message after a delay
          setTimeout(() => {
            formMessages.innerHTML = '';
            formMessages.classList.remove('success');
          }, 5000);
        })
        .catch(error => {
          // Handle errors during the fetch operation
          formMessages.innerHTML = `<p>Error: ${error.message}</p>`;
          formMessages.classList.add('error');
          console.error('Error:', error);
        })
        .finally(() => {
          // Re-enable the submit button and hide the loading indicator
          submitButton.disabled = false;
          loadingIndicator.style.display = 'none';
        });
    }
  });

  // ------------------------
  // Helper Functions
  // ------------------------

  /**
   * Adds error styling and displays an error message for a specific field.
   * @param {string} fieldId - The ID of the form field.
   * @param {string} message - The error message to display.
   */
  function setError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('input-error');

    // Display the error message in the corresponding error div
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  /**
   * Removes error styling and clears the error message for a specific field.
   * @param {string} fieldId - The ID of the form field.
   */
  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove('input-error');

    // Clear the error message in the corresponding error div
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  /**
   * Validates a specific form field in real-time.
   * @param {string} fieldId - The ID of the form field.
   */
  function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();

    switch (fieldId) {
      case 'name':
        if (value === '') {
          setError(fieldId, 'Name is required.');
        } else {
          clearError(fieldId);
        }
        break;

      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value === '') {
          setError(fieldId, 'Email is required.');
        } else if (!emailPattern.test(value)) {
          setError(fieldId, 'Please enter a valid email address.');
        } else {
          clearError(fieldId);
        }
        break;

      case 'subject':
        if (value === '') {
          setError(fieldId, 'Subject is required.');
        } else {
          clearError(fieldId);
        }
        break;

      case 'message':
        if (value === '') {
          setError(fieldId, 'Message is required.');
        } else {
          clearError(fieldId);
        }
        break;

      default:
        break;
    }
  }
});
