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

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const subject = subjectField.value.trim();
    const message = messageField.value.trim();

    let errors = [];

    if (name === '') {
      errors.push('Name is required.');
      setError('name', 'Name is required.');
    } else {
      clearError('name');
    }

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

   
    if (errors.length > 0) {
      let errorHtml = '<ul>';
      errors.forEach(function (error) {
        errorHtml += `<li>${error}</li>`;
      });
      errorHtml += '</ul>';
      formMessages.innerHTML = errorHtml;
      formMessages.classList.add('error');
    } else {
  
      submitButton.disabled = true;
      loadingIndicator.style.display = 'block';

      const formData = {
        name: name,
        email: email,
        subject: subject,
        message: message
      };

      fetch('https://yourdomain.com/api/contact', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData) 
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(errData => {
              throw new Error(errData.message || 'Something went wrong!');
            });
          }
          return response.json(); 
        })
        .then(data => {
          formMessages.innerHTML = '<p>Your message has been sent successfully!</p>';
          formMessages.classList.add('success');

          form.reset();

          setTimeout(() => {
            formMessages.innerHTML = '';
            formMessages.classList.remove('success');
          }, 5000);
        })
        .catch(error => {
          formMessages.innerHTML = `<p>Error: ${error.message}</p>`;
          formMessages.classList.add('error');
          console.error('Error:', error);
        })
        .finally(() => {
          submitButton.disabled = false;
          loadingIndicator.style.display = 'none';
        });
    }
  });


  function setError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('input-error');

    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove('input-error');

    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

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
