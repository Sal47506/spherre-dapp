'use client'

import { useState, useEffect } from 'react'
import ThemeCard from './components/theme-card'
import ToggleSwitch from './components/toggle-switch'
import BrowserPreview from './components/browser-preview'
import { Monitor, Moon, Sun } from 'lucide-react'
import SignMessageModal from '../../../components/modals/SignMessageModal'
import { useGlobalModal } from '../../../components/modals/useGlobalModal'
import { useTheme } from '@/app/context/theme-context-provider'

type ToggleType = 'email' | 'browser' | null

export default function PreferencesPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const { theme, setTheme } = useTheme()
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [browserNotifications, setBrowserNotifications] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeToggle, setActiveToggle] = useState<ToggleType>(null)
  const [modalTitle, setModalTitle] = useState('')
  const [modalDescription, setModalDescription] = useState('')
  const { showSuccess, showProcessing, hideModal } = useGlobalModal()

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('spherre-email-notifications')
    const savedBrowser = localStorage.getItem('spherre-browser-notifications')

    if (savedEmail) setEmailNotifications(savedEmail === 'true')
    if (savedBrowser) setBrowserNotifications(savedBrowser === 'true')
  }, [])

  if (!mounted) return null

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme)
  }

  const handleToggleClick = (type: ToggleType) => {
    setActiveToggle(type)
    const isEnabling =
      type === 'email' ? !emailNotifications : !browserNotifications

    if (isEnabling) {
      if (type === 'email') {
        setModalTitle('Enable Email Notifications')
        setModalDescription(
          'Please provide your email address and sign the message to enable email notifications.',
        )
      } else {
        setModalTitle('Enable Browser Notifications')
        setModalDescription(
          'Please sign the message to enable browser notifications.',
        )
      }
      setIsModalOpen(true)
    } else {
      // If disabling, do it directly without a modal
      if (type === 'email') {
        setEmailNotifications(false)
        localStorage.setItem('spherre-email-notifications', 'false')
      } else {
        setBrowserNotifications(false)
        localStorage.setItem('spherre-browser-notifications', 'false')
      }
    }
  }

  const handleSignMessage = (email: string) => {
    console.log(`Signing message for ${activeToggle} with email:`, email)
    setIsModalOpen(false)
    showProcessing({
      title: 'Processing Transaction!',
      subtitle: 'Please exercise a little patience as we process your details',
    })

    setTimeout(() => {
      hideModal()
      if (activeToggle === 'email') {
        setEmailNotifications(true)
        localStorage.setItem('spherre-email-notifications', 'true')
        showSuccess({
          title: 'Successful Transaction!',
          message: 'Email notifications have been enabled successfully.',
          onClose: hideModal,
        })
      } else if (activeToggle === 'browser') {
        setBrowserNotifications(true)
        localStorage.setItem('spherre-browser-notifications', 'true')
        showSuccess({
          title: 'Successful Transaction!',
          message: 'Browser notifications have been enabled successfully.',
          onClose: hideModal,
        })
      }
    }, 3000)
  }

  return (
    <div className="space-y-10 font-sans w-full  px-4 md:px-8 py-8 bg-theme transition-colors duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-theme mb-3">Preferences</h1>
        <p className="text-theme-secondary text-sm">
          Manage your notification preferences to control how and when you
          receive updates, alerts, and reminders.
        </p>
      </div>

      <hr className="border-t border-theme" />

      {/* Interface Theme Section */}
      <div>
        <h2 className="text-xl font-bold text-theme mb-1">Interface Theme</h2>
        <p className="text-theme-secondary mb-6">
          Customize your Spherre`s account theme.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <ThemeCard
            title="Dark Mode"
            description="More visible and eye-friendly design for low-light environments."
            icon={<Moon className="text-theme" />}
            isSelected={theme === 'dark'}
            onClick={() => handleThemeChange('dark')}
            previewContent={<BrowserPreview theme="dark" />}
          />

          <ThemeCard
            title="Light Mode"
            description="Light visuals when your system is configured to light mode."
            icon={<Sun className="text-theme" />}
            isSelected={theme === 'light'}
            onClick={() => handleThemeChange('light')}
            previewContent={<BrowserPreview theme="light" />}
          />

          <ThemeCard
            title="System Mode"
            description="This will make use of the theme your system is currently using now."
            icon={<Monitor className="text-theme" />}
            isSelected={theme === 'system'}
            onClick={() => handleThemeChange('system')}
            previewContent={<BrowserPreview theme="system" />}
          />
        </div>
      </div>

      {/* Email Notification Section */}
      <div className="border-t border-theme pt-8 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-theme mb-2">
              Email Notification
            </h2>
            <p className="text-theme-secondary">
              Receive email updates about Spherre on your email and be the first
              to get notified before anyone else.
            </p>
          </div>
          <ToggleSwitch
            enabled={emailNotifications}
            onChange={() => handleToggleClick('email')}
          />
        </div>
      </div>

      {/* Browser Notification Section */}
      <div className="border-t border-theme pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-theme mb-2">
              Browser Notification
            </h2>
            <p className="text-theme-secondary">
              Receive Spherre updates directly on your web browser as you go
              about your day.
            </p>
          </div>
          <ToggleSwitch
            enabled={browserNotifications}
            onChange={() => handleToggleClick('browser')}
          />
        </div>
      </div>

      <SignMessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSign={handleSignMessage}
        title={modalTitle}
        description={modalDescription}
      />
    </div>
  )
}
