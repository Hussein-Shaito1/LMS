import PageTransition from '@/components/ui/PageTransition'

export const metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using LearnHub, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.',
    },
    {
      title: '2. Use of Service',
      content: 'LearnHub provides an educational platform for learning various technical and professional skills. You may use the service for personal, non-commercial educational purposes. You agree not to use the service for any unlawful purposes or to violate any applicable regulations.',
    },
    {
      title: '3. User Accounts',
      content: 'When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.',
    },
    {
      title: '4. Intellectual Property',
      content: 'The service and its original content, features, and functionality are owned by LearnHub and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.',
    },
    {
      title: '5. Privacy Policy',
      content: 'Your use of LearnHub is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy to understand our practices.',
    },
    {
      title: '6. Disclaimers',
      content: 'The information on this platform is provided on an "as is" basis without any warranties, express or implied. LearnHub does not warrant that the service will be uninterrupted, error-free, or completely secure.',
    },
    {
      title: '7. Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. We will notify users of any significant changes. Your continued use of the service after changes are posted constitutes your acceptance of the modified terms.',
    },
    {
      title: '8. Contact Information',
      content: 'If you have any questions about these Terms of Service, please contact us at legal@learnhub.com.',
    },
  ]

  return (
    <PageTransition>
      <div className="page">
        <div className="container container--narrow">
          <div className="page__header">
            <h1>Terms of Service</h1>
            <p>Last updated: January 1, 2025</p>
          </div>

          <div className="card">
            <p className="policy-intro">
              Please read these Terms of Service carefully before using the LearnHub platform operated by LearnHub Inc.
            </p>

            {sections.map(({ title, content }) => (
              <div key={title} className="policy-section">
                <h3>{title}</h3>
                <p>{content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
