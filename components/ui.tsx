import * as React from 'react'
import Link from 'next/link'

/* ------------------------------------------------------
   Utility: cn (className combiner)
------------------------------------------------------- */
function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(' ')
}

/* ------------------------------------------------------
   Design Tokens (from globals.css via CSS vars)
   --bg, --fg, --muted, --card, --accent
------------------------------------------------------- */

/* ------------------------------------------------------
   TYPOGRAPHY PRIMITIVES
------------------------------------------------------- */
export const H1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h1
    className={cn(
      'font-[var(--font-martian)] text-4xl md:text-6xl font-semibold tracking-tight',
      className
    )}
    {...props}
  />
)

export const H2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h2
    className={cn(
      'font-[var(--font-martian)] text-2xl md:text-4xl font-semibold tracking-tight',
      className
    )}
    {...props}
  />
)

export const Subtle: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-sm md:text-base text-[var(--muted)]', className)} {...props} />
)

/* ------------------------------------------------------
   BUTTONS
------------------------------------------------------- */
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'solid', size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed'

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-5 text-base',
    }

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      solid:
        'bg-[var(--accent)] text-black hover:opacity-90 active:opacity-80 border border-[var(--accent)]',
      outline:
        'bg-transparent text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)]/10',
      ghost:
        'bg-transparent text-[var(--accent)] hover:bg-[var(--accent)]/10',
    }

    return (
      <button ref={ref} className={cn(base, sizes[size], variants[variant], className)} {...props} />
    )
  }
)
Button.displayName = 'Button'

export type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
}

export const LinkButton: React.FC<LinkButtonProps> = ({ href, className, variant = 'outline', size = 'md', ...props }) => {
  const sizeMap: Record<NonNullable<ButtonProps['size']>, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  }
  const variantMap: Record<NonNullable<ButtonProps['variant']>, string> = {
    solid: 'bg-[var(--accent)] text-black hover:opacity-90 active:opacity-80 border border-[var(--accent)]',
    outline: 'bg-transparent text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)]/10',
    ghost: 'bg-transparent text-[var(--accent)] hover:bg-[var(--accent)]/10',
  }
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
        sizeMap[size],
        variantMap[variant],
        className
      )}
      {...props}
    />
  )
}

/* ------------------------------------------------------
   TAG / BADGE
------------------------------------------------------- */
export const Tag: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border border-[var(--accent)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]',
      'bg-white/60 dark:bg-black/30 backdrop-blur',
      className
    )}
    {...props}
  />
)

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-md bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]',
      className
    )}
    {...props}
  />
)

/* ------------------------------------------------------
   CARD
------------------------------------------------------- */
export type CardProps = React.HTMLAttributes<HTMLDivElement>

export const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-2xl border border-black/10 dark:border-white/10 bg-[var(--card)] dark:bg-[#101010] shadow-sm',
      className
    )}
    {...props}
  />
)

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-5 md:p-6 border-b border-black/5 dark:border-white/5', className)} {...props} />
)

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-5 md:p-6', className)} {...props} />
)

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('p-5 md:p-6 border-t border-black/5 dark:border-white/5', className)} {...props} />
)

/* ------------------------------------------------------
   SECTION HEADING
------------------------------------------------------- */
export type SectionHeadingProps = React.HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-full',
        align === 'center' ? 'text-center max-w-3xl mx-auto' : 'text-left',
        className
      )}
      {...props}
    >
      {eyebrow && (
        <div className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          {eyebrow}
        </div>
      )}
      <H2 className="">{title}</H2>
      {subtitle && <Subtle className="mt-3">{subtitle}</Subtle>}
    </div>
  )
}

/* ------------------------------------------------------
   INPUTS (minimal, accessible)
------------------------------------------------------- */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string }

export const Input: React.FC<InputProps> = ({ label, className, id, ...props }) => {
  const inputId = id || React.useId()
  return (
    <label htmlFor={inputId} className="block">
      {label && (
        <span className="mb-1 block text-xs font-medium text-[var(--muted)]">{label}</span>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0b] px-3 py-2 text-sm',
          'placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]',
          className
        )}
        {...props}
      />
    </label>
  )
}

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }

export const TextArea: React.FC<TextAreaProps> = ({ label, className, id, rows = 4, ...props }) => {
  const areaId = id || React.useId()
  return (
    <label htmlFor={areaId} className="block">
      {label && (
        <span className="mb-1 block text-xs font-medium text-[var(--muted)]">{label}</span>
      )}
      <textarea
        id={areaId}
        rows={rows}
        className={cn(
          'w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0b0b] px-3 py-2 text-sm',
          'placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]',
          className
        )}
        {...props}
      />
    </label>
  )
}

/* ------------------------------------------------------
   PROGRESS (header underline / route progress)
------------------------------------------------------- */
export type ProgressProps = { value: number; className?: string }

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('h-[2px] w-full bg-black/10 dark:bg-white/10 overflow-hidden', className)} aria-hidden>
      <div
        className="h-full bg-[var(--accent)] transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

/* ------------------------------------------------------
   SIMPLE GRID WRAPPERS
------------------------------------------------------- */
export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('mx-auto max-w-6xl px-6', className)} {...props} />
)

export const Section: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <section className={cn('py-16 md:py-24', className)} {...props} />
)

/* ------------------------------------------------------
   EXAMPLE: PORTFOLIO CARD COMPOSED
------------------------------------------------------- */
export type WorkCardProps = {
  title: string
  subtitle?: string
  tags?: string[]
  href?: string
  image?: React.ReactNode // pass <Image /> or anything
  ctaLabel?: string
}

export const WorkCard: React.FC<WorkCardProps> = ({ title, subtitle, tags = [], href, image, ctaLabel = 'View' }) => {
  return (
    <Card className="overflow-hidden">
      {image && <div className="aspect-[16/9] w-full overflow-hidden">{image}</div>}
      <CardBody>
        <div className="flex items-start justify-between gap-4">
          <div>
            <H2 className="text-xl md:text-2xl">{title}</H2>
            {subtitle && <Subtle className="mt-1">{subtitle}</Subtle>}
          </div>
          {href && (
            <LinkButton href={href} variant="outline" size="sm" aria-label={`Open ${title}`}>
              {ctaLabel}
            </LinkButton>
          )}
        </div>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  )
}

/* ------------------------------------------------------
   USAGE EXAMPLE (paste into a page):

   import { Container, Section, SectionHeading, WorkCard } from '@/components/ui'

   <Section>
     <Container>
       <SectionHeading
         eyebrow="Selected Work"
         title="Building motion-driven web experiences"
         subtitle="Next.js · React · GSAP · Shopify · WordPress"
         align="center"
       />

       <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
         <WorkCard
           title="PetFinder"
           subtitle="Next.js app with filters and API integration"
           tags={["Next.js", "GSAP", "TypeScript"]}
           href="/works/petfinder"
         />
         <WorkCard
           title="Tropify"
           subtitle="Audio-driven parallax experience"
           tags={["Next.js", "Motion", "Audio"]}
           href="/works/tropify"
         />
       </div>
     </Container>
   </Section>

------------------------------------------------------- */

export default {
  H1,
  H2,
  Subtle,
  Button,
  LinkButton,
  Tag,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SectionHeading,
  Input,
  TextArea,
  Progress,
  Container,
  Section,
  WorkCard,
}
