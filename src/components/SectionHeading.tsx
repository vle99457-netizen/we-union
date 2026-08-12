import type { ReactNode } from 'react'

type SectionHeadingProps = {
  id?: string
  eyebrow?: string
  title: string
  copy?: string
  action?: ReactNode
  light?: boolean
}

export function SectionHeading({ id, eyebrow, title, copy, action, light = false }: SectionHeadingProps) {
  return (
    <header className={`section-heading${light ? ' section-heading--light' : ''}`}>
      <div className="section-heading__title">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={id}>{title}</h2>
      </div>
      {copy || action ? (
        <div className="section-heading__aside">
          {copy ? <p>{copy}</p> : null}
          {action}
        </div>
      ) : null}
    </header>
  )
}
