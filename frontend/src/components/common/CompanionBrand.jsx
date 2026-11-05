import './CompanionBrand.css'

/** Marca Companion animada com quadros SVG recortados da folha original. */
function CompanionBrand({ className = '' }) {
  return <span aria-hidden="true" className={`companion-brand-mark ${className}`} />
}

export default CompanionBrand
