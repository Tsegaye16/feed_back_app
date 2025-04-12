
import TidioScript from './TidioScript'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <TidioScript />
      <div className="fixed top-4 right-4 z-50">
        
      </div>
      {children}
    </div>
  )
}
