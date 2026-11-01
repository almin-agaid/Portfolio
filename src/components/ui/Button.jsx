import { motion } from 'framer-motion'

const press = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 420, damping: 26 },
}

// Polymorphic button: renders an <a> when `href` is given, otherwise a <button>.
// variant: 'primary' | 'ghost' | 'subtle'
export default function Button({
  href,
  variant = 'primary',
  external = false,
  icon: Icon,
  iconPosition = 'end',
  className = '',
  children,
  ...rest
}) {
  const classes = `btn btn--${variant} ${className}`.trim()
  const icon = Icon ? <Icon size={18} aria-hidden="true" className={`btn__icon btn__icon--${iconPosition}`} /> : null
  const content = (
    <>
      {iconPosition === 'start' && icon}
      <span>{children}</span>
      {iconPosition === 'end' && icon}
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...press}
        {...rest}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button type="button" className={classes} {...press} {...rest}>
      {content}
    </motion.button>
  )
}
