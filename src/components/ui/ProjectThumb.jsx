import { getIcon } from './icons'

// Stable 0-2 variant per project so each generated preview looks a little different.
const variantFor = (id) => [...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 3

// Shows one screenshot (an entry of project.images; the cover, i.e. the first, by default),
// framed on a themed backdrop at its own aspect ratio so a desktop window, a wide web page
// and a phone screen all fit without cropping. With no screenshots, a generated
// wireframe-style preview is shown so cards look finished before real ones exist.
export default function ProjectThumb({ project, image = project.images?.[0], priority = false }) {
  if (image) {
    return (
      <div className="thumb thumb--shot">
        <img
          src={image.src}
          alt={image.alt || `Screenshot of ${project.title}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    )
  }

  const Icon = getIcon(project.icon)
  return (
    <div className="thumb thumb--generated" data-variant={variantFor(project.id)} role="img" aria-label={`${project.title} preview`}>
      <div className="thumb__window" aria-hidden="true">
        <div className="thumb__bar">
          <i />
          <i />
          <i />
          <span />
        </div>
        <div className="thumb__body">
          <div className="thumb__side">
            <b />
            <b />
            <b />
            <b />
          </div>
          <div className="thumb__main">
            <div className="thumb__title" />
            <div className="thumb__tiles">
              <i />
              <i />
              <i />
            </div>
            <div className="thumb__chart">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>
      <span className="thumb__badge" aria-hidden="true">
        <Icon size={22} />
      </span>
    </div>
  )
}
