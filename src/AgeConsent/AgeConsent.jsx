import React, { useEffect } from 'react'
import './AgeConsent.css'

function AgeConsent({ onAccept }) {
  useEffect(() => {
    // Prevent body scroll when modal is visible
    document.body.classList.add('consent-modal-open')
    return () => {
      document.body.classList.remove('consent-modal-open')
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('ageConsent', 'accepted')
    document.body.classList.remove('consent-modal-open')
    if (onAccept) {
      onAccept()
    }
  }

  const handleDecline = () => {
    // If user declines, they cannot proceed - redirect away
    window.location.href = 'https://www.google.com'
  }

  return (
    <div className="age-consent-overlay">
      <div className="age-consent-modal">
        <div className="age-consent-content">
          <div className="age-consent-icon">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="60" 
              height="60" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2 className="age-consent-title">Age Verification Required</h2>
          <p className="age-consent-message">
            You must be 18 years or older to access this website.
          </p>
          <p className="age-consent-message">
            By clicking "I am 18 or older", you confirm that you are of legal age to view adult content.
          </p>
          <div className="age-consent-buttons">
            <button 
              className="age-consent-btn age-consent-btn-decline" 
              onClick={handleDecline}
            >
              I am under 18
            </button>
            <button 
              className="age-consent-btn age-consent-btn-accept" 
              onClick={handleAccept}
            >
              I am 18 or older
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgeConsent

