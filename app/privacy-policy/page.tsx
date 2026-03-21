import PageTransition from '@/components/ui/PageTransition'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, enroll in courses, or contact us. This includes your name, email address, and learning preferences. We store this data locally in your browser and do not transmit it to external servers.',
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, to personalize your experience, track your learning progress, and to communicate with you about updates and new courses.',
    },
    {
      title: '3. Data Storage',
      content: 'LearnHub is a frontend-only application. All your personal data (profile, enrolled courses, progress, favorites) is stored exclusively in your browser\'s localStorage. We do not have a server that stores your personal information.',
    },
    {
      title: '4. Information Sharing',
      content: 'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, so long as those parties agree to keep this information confidential.',
    },
    {
      title: '5. Cookies and Local Storage',
      content: 'We use localStorage to save your preferences, authentication state, and learning progress. This data is stored on your device and can be cleared at any time by clearing your browser data or logging out of the platform.',
    },
    {
      title: '6. Your Rights',
      content: 'You have the right to access, update, or delete your personal information at any time. You can manage your profile through the Settings page, and can clear all local data by logging out. These rights are automatically fulfilled since data is stored locally.',
    },
    {
      title: '7. Third-Party Services',
      content: 'Our platform may contain links to third-party websites and use third-party services for profile avatars (Pravatar) and video content. These services have their own privacy policies, and we encourage you to review them.',
    },
    {
      title: '8. Children\'s Privacy',
      content: 'LearnHub does not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.',
    },
    {
      title: '9. Changes to Privacy Policy',
      content: 'We may update our Privacy Policy from time to time. We will notify users of any significant changes by posting the new policy on this page with an updated date.',
    },
    {
      title: '10. Contact Us',
      content: 'If you have any questions about this Privacy Policy, please contact us at privacy@learnhub.com.',
    },
  ]

  return (
    <PageTransition>
      <div className="page">
        <div className="container container--narrow">
          <div className="page__header">
            <h1>Privacy Policy</h1>
            <p>Last updated: January 1, 2025</p>
          </div>

          <div className="card">
            <p className="policy-intro">
              At LearnHub, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we handle information collected when you use our platform.
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
