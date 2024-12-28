document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm')
  if (!form) return
  const nameField = document.getElementById('name')
  const emailField = document.getElementById('email')
  const subjectField = document.getElementById('subject')
  const messageField = document.getElementById('message')
  const formFeedback = document.getElementById('formFeedback')

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    formFeedback.style.display = 'none'
    formFeedback.innerHTML = ''
    clearError(nameField, 'name-error')
    clearError(emailField, 'email-error')
    clearError(subjectField, 'subject-error')
    clearError(messageField, 'message-error')
    let isValid = true
    if (nameField.value.trim() === '') {
      showError(nameField, 'name-error', 'Name is required.')
      isValid = false
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailField.value.trim() === '') {
      showError(emailField, 'email-error', 'Email is required.')
      isValid = false
    } else if (!emailPattern.test(emailField.value.trim())) {
      showError(emailField, 'email-error', 'Please enter a valid email address.')
      isValid = false
    }
    if (subjectField.value.trim() === '') {
      showError(subjectField, 'subject-error', 'Subject is required.')
      isValid = false
    }
    if (messageField.value.trim() === '') {
      showError(messageField, 'message-error', 'Message is required.')
      isValid = false
    }
    if (isValid) {
      formFeedback.style.display = 'block'
      formFeedback.style.color = 'green'
      formFeedback.innerHTML = 'Your message has been sent successfully!'
      form.reset()
    }
  })

  function showError(inputElem, errorElemId, message) {
    const errorElem = document.getElementById(errorElemId)
    if (errorElem) {
      errorElem.textContent = message
      errorElem.style.display = 'block'
    }
    inputElem.classList.add('input-error')
  }

  function clearError(inputElem, errorElemId) {
    const errorElem = document.getElementById(errorElemId)
    if (errorElem) {
      errorElem.textContent = ''
      errorElem.style.display = 'none'
    }
    inputElem.classList.remove('input-error')
  }
})
