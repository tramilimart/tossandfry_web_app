import React, { useState } from 'react';

const DataDeletionPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would handle the form submission
        setSubmitted(true);
        setEmail('');
        setMessage('');
    };

    return (
        <>
            <div className='status-bar'>
                <div className='back-btn'>
                    <i className="bi bi-arrow-left-short cur-p h0" onClick={() => navigate(-1)}></i>
                </div>
            </div>
            <div className="container px-3 py-4">
                {/* Header Section */}
                <div className="text-center mb-4">
                    <h1 className="text-center mb-4">Privacy Policy</h1>
                    <p>
                        We respect your privacy and your right to control your personal data.
                        Use this form to request deletion of your data from our systems.
                    </p>
                </div>

                {/* Info Cards */}
                <div className="row mb-5">
                    <div className="col-md-4 mb-4 mb-md-0">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
                                <h3 className="card-title h5">Privacy First</h3>
                                <p className="card-text">
                                    Your privacy matters to us. We handle all deletion requests with care.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4 mb-md-0">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <i className="bi bi-clock fs-1 text-primary mb-3"></i>
                                <h3 className="card-title h5">Quick Processing</h3>
                                <p className="card-text">
                                    We process all requests within 14 days of submission.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card h-100">
                            <div className="card-body text-center">
                                <i className="bi bi-envelope fs-1 text-primary mb-3"></i>
                                <h3 className="card-title h5">Stay Informed</h3>
                                <p className="card-text">
                                    We'll keep you updated on the status of your request.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Request Form */}
                <div className="card mb-5">
                    <div className="card-header">
                        <h2 className="h4 mb-0">Submit Your Request</h2>
                    </div>
                    <div className="card-body">
                        {submitted ? (
                            <div className="alert alert-success" role="alert">
                                Your data deletion request has been received. We'll process it within 14 days and send you a confirmation email.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Additional Information</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Please provide any additional details that might help us identify your data"
                                        rows={4}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    Submit Deletion Request
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Additional Information */}
                <div className="card">
                    <div className="card-body">
                        <h2 className="h4 mb-4">What happens next?</h2>
                        <p className="text-muted mb-4">
                            After submitting your request:
                        </p>
                        <ol className="text-muted">
                            <li className="mb-2">You'll receive an email confirmation of your request</li>
                            <li className="mb-2">Our team will process your request within 14 days</li>
                            <li className="mb-2">We'll send you a final confirmation once all your data has been deleted</li>
                            <li className="mb-2">You may receive follow-up questions if we need additional information</li>
                        </ol>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DataDeletionPage;