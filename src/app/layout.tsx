import type { Metadata } from 'next'
import '@/styles/main.scss'
import { AuthProvider } from '@/context/AuthContext'
import { LMSProvider } from '@/context/LMSContext'
import { ToastProvider } from '@/context/ToastContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ToastContainer from '@/components/ui/ToastContainer'

export const metadata: Metadata = {
  title: {
    default: 'LearnHub – Modern Learning Platform',
    template: '%s | LearnHub',
  },
  description:
    'Discover top courses in web development, design, data science, and more. Learn at your own pace with LearnHub.',
  keywords: ['LMS', 'online courses', 'learning', 'web development', 'education'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <AuthProvider>
            <LMSProvider>
              <Header />
              <main className="main-content">{children}</main>
              <Footer />
              <ToastContainer />
            </LMSProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
