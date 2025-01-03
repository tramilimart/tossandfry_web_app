import React from "react";

const PrivacyPolicy = () => {
    return (
        <>
            <div className='status-bar'>
                <div className='back-btn'>
                    <i className="bi bi-arrow-left-short cur-p h0" onClick={() => navigate(-1)}></i>
                </div>
            </div>
            <div className="container px-3 py-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h1 className="text-center mb-4">Privacy Policy</h1>

                        <p>
                            Welcome to Toss and Fry Restaurant! This privacy policy explains how
                            we collect, use, and protect your information when you visit our
                            website or use our services.
                        </p>

                        <h5 className="mt-3">Information We Collect</h5>
                        <p>
                            <strong>- Personal Information:</strong> If you place an order or
                            contact us, we may collect your name, email address, phone number,
                            and delivery address.
                        </p>
                        <p>
                            <strong>- Usage Data:</strong> We collect information about your
                            interaction with our website, such as IP address, browser type,
                            and pages visited.
                        </p>

                        <h5 className="mt-3">How We Use Your Information</h5>
                        <p>- To process your orders and provide customer support.</p>
                        <p>- To improve our website and services.</p>
                        <p>
                            - To send you promotional updates about Toss and Fry Restaurant if
                            you have opted in.
                        </p>

                        <h5 className="mt-3">Sharing Your Information</h5>
                        <p>
                            We do not sell or share your personal information with third
                            parties, except as necessary to process your orders (e.g., with
                            delivery partners) or comply with legal obligations.
                        </p>

                        <h5 className="mt-3">Cookies</h5>
                        <p>
                            Our website uses cookies to enhance your browsing experience. By
                            using our site, you consent to the use of cookies. You can manage
                            your cookie preferences in your browser settings.
                        </p>

                        <h5 className="mt-3">Security</h5>
                        <p>
                            We take appropriate measures to protect your information from
                            unauthorized access or disclosure. However, no method of
                            transmission over the internet is completely secure.
                        </p>

                        <h5 className="mt-3">Your Rights</h5>
                        <p>- Access and update your personal information.</p>
                        <p>- Request deletion of your personal data.</p>
                        <p>
                            - Opt-out of receiving promotional emails by following the
                            unsubscribe instructions.
                        </p>

                        <h5 className="mt-3">Contact Us</h5>
                        <p>
                            If you have any questions about this privacy policy or our
                            practices, please contact us:
                        </p>
                        <p className="mt-2">Email: <strong>support@tossandfry.com</strong></p>
                        <p>Phone: <strong>+63 9123305767</strong></p>
                        <p>Address: <strong>23 ROTC Hunters St. Tatalon Quezon City</strong></p>

                        <p className="mt-5">
                            This privacy policy is effective as of February 7, 2025 and may be
                            updated periodically. Please review this page for updates.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
