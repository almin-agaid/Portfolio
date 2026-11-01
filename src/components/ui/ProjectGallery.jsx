import { useState } from 'react'
import ProjectThumb from './ProjectThumb'

// Media area of the project modal: the selected screenshot, plus a row of
// switchers when the project has more than one.
export default function ProjectGallery({ project }) {
  const images = project.images ?? []
  const [index, setIndex] = useState(0)

  return (
    <div className="gallery">
      <ProjectThumb project={project} image={images[index]} priority />

      {images.length > 1 && (
        <ul className="gallery__thumbs" aria-label="Screenshots">
          {images.map((image, i) => (
            <li key={image.src}>
              <button type="button" className="gallery__thumb" aria-pressed={i === index} onClick={() => setIndex(i)}>
                <img src={image.src} alt="" loading="lazy" decoding="async" />
                <span>{image.caption || `Screenshot ${i + 1}`}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
