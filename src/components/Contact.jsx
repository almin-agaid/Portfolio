import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, CircleAlert, CircleCheck, LoaderCircle, Mail, MapPin, Send } from 'lucide-react'
import { contact, socials } from '../data/portfolioData'
import { fadeUp, revealOnScroll, slideInLeft } from '../lib/motion'
import Button from './ui/Button'
import { socialIcons } from './ui/BrandIcons'
import SectionHeading from './ui/SectionHeading'
import './Contact.css'

const MAX_MESSAGE = 1500
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const EMPTY = { name: '', email: '', subject: '', message: '', website: '' } // `website` is a honeypot

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).'
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (values.subject.trim().length < 3) errors.subject = 'Please add a short subject (at least 3 characters).'
  if (values.message.trim().length < 10) errors.message = 'Your message should be at least 10 characters.'
  else if (values.message.length > MAX_MESSAGE) errors.message = `Please keep your message under ${MAX_MESSAGE} characters.`
  return errors
}

const prettyUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function Field({ id, label, error, hint, children }) {
  return (
    <div className={`field ${error ? 'field--invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      <div className="field__meta">
        {error ? (
          <p id={`${id}-error`} className="field__error">
            <CircleAlert size={14} aria-hidden="true" />
            {error}
          </p>
        ) : (
          hint
        )}
      </div>
    </div>
  )
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | sent | handoff | error
  const formRef = useRef(null)

  const sendsDirectly = Boolean(contact.formEndpoint)
  const errors = validate(values)
  const shown = (field) => (attempted || touched[field] ? errors[field] : undefined)

  const methods = [
    contact.email && { id: 'email', label: 'Email', value: contact.email, href: `mailto:${contact.email}`, Icon: Mail },
    ...socials
      .filter((social) => social.id !== 'email' && social.url)
      .map((social) => ({
        id: social.id,
        label: social.label,
        value: prettyUrl(social.url),
        href: social.url,
        Icon: socialIcons[social.id],
        external: true,
      })),
    contact.location && { id: 'location', label: 'Location', value: contact.location, Icon: MapPin },
  ].filter((method) => method && method.Icon)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    if (status !== 'idle' && status !== 'sending') setStatus('idle')
  }

  const handleBlur = (event) => setTouched((current) => ({ ...current, [event.target.name]: true }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setAttempted(true)

    const firstInvalid = ['name', 'email', 'subject', 'message'].find((field) => errors[field])
    if (firstInvalid) {
      formRef.current?.elements[firstInvalid]?.focus()
      return
    }

    // Bots tend to fill every field; humans never see this one.
    if (values.website) {
      setStatus('sent')
      return
    }

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    }

    if (sendsDirectly) {
      setStatus('sending')
      try {
        const response = await fetch(contact.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error(`Request failed with ${response.status}`)
        setStatus('sent')
        setValues(EMPTY)
        setTouched({})
        setAttempted(false)
      } catch {
        setStatus('error')
      }
      return
    }

    // No backend configured: hand the message to the visitor's own email app instead of
    // pretending it was delivered.
    const body = `${payload.message}\n\n-- \n${payload.name}\n${payload.email}`
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`
    setStatus('handoff')
  }

  const sending = status === 'sending'

  return (
    <section id="contact" className="section section--alt contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeading index="05" label="Contact" id="contact-title" title={contact.heading} description={contact.text} />

        <div className="contact__grid">
          <motion.ul className="contact__methods" {...revealOnScroll(0.1)}>
            {methods.map(({ id, label, value, href, Icon, external }) => {
              const inner = (
                <>
                  <span className="method__icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="method__text">
                    <span className="method__label mono">{label}</span>
                    <span className="method__value">{value}</span>
                  </span>
                  {href && <ArrowUpRight size={18} className="method__arrow" aria-hidden="true" />}
                </>
              )
              return (
                <motion.li key={id} variants={slideInLeft}>
                  {href ? (
                    <a
                      href={href}
                      className="method"
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="method">{inner}</div>
                  )}
                </motion.li>
              )
            })}
          </motion.ul>

          <motion.form
            ref={formRef}
            className="form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Contact form"
            {...revealOnScroll()}
          >
            <motion.div className="form__row" variants={fadeUp}>
              <Field id="contact-name" label="Name" error={shown('name')}>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(shown('name'))}
                  aria-describedby={shown('name') ? 'contact-name-error' : undefined}
                  disabled={sending}
                  required
                />
              </Field>
              <Field id="contact-email" label="Email" error={shown('email')}>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(shown('email'))}
                  aria-describedby={shown('email') ? 'contact-email-error' : undefined}
                  disabled={sending}
                  required
                />
              </Field>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Field id="contact-subject" label="Subject" error={shown('subject')}>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={values.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(shown('subject'))}
                  aria-describedby={shown('subject') ? 'contact-subject-error' : undefined}
                  disabled={sending}
                  required
                />
              </Field>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Field
                id="contact-message"
                label="Message"
                error={shown('message')}
                hint={
                  <span className={`field__count mono ${values.message.length > MAX_MESSAGE ? 'is-over' : ''}`}>
                    {values.message.length}/{MAX_MESSAGE}
                  </span>
                }
              >
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(shown('message'))}
                  aria-describedby={shown('message') ? 'contact-message-error' : undefined}
                  disabled={sending}
                  required
                />
              </Field>
            </motion.div>

            {/* Honeypot: hidden from people and assistive tech, tempting to bots */}
            <div className="form__trap" aria-hidden="true">
              <label htmlFor="contact-website">Leave this field empty</label>
              <input
                id="contact-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={handleChange}
              />
            </div>

            <motion.div className="form__footer" variants={fadeUp}>
              <Button
                type="submit"
                icon={sending ? LoaderCircle : Send}
                disabled={sending}
                aria-busy={sending}
                className={sending ? 'is-loading' : ''}
              >
                {sending ? 'Sending…' : sendsDirectly ? 'Send message' : 'Open in email app'}
              </Button>
              {!sendsDirectly && (
                <p className="form__note">This opens your email app with the message pre-filled. Nothing is sent from this page.</p>
              )}
            </motion.div>

            <div role="status" aria-live="polite" className="form__status-region">
              <AnimatePresence mode="wait">
                {status === 'sent' && (
                  <motion.p
                    key="sent"
                    className="form__status form__status--success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <CircleCheck size={18} aria-hidden="true" />
                    Thank you! Your message has been sent and I will reply as soon as I can.
                  </motion.p>
                )}
                {status === 'handoff' && (
                  <motion.p
                    key="handoff"
                    className="form__status form__status--success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <CircleCheck size={18} aria-hidden="true" />
                    <span>
                      Your email app should now be open with the message ready. It has not been sent yet: press Send there to
                      finish. Nothing opened? Email me at <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                    </span>
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p
                    key="error"
                    className="form__status form__status--error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <CircleAlert size={18} aria-hidden="true" />
                    <span>
                      Sorry, your message could not be sent. Please try again, or email me directly at{' '}
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
