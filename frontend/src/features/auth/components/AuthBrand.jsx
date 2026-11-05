import CompanionBrand from '../../../components/common/CompanionBrand.jsx'
import './AuthBrand.css'

function AuthBrand({ compact = false }) {
  const brand = (
    <div
      className={
        compact
          ? 'inline-flex items-center gap-3'
          : 'site-brand'
      }
    >
      <CompanionBrand
        className={
          compact
            ? 'size-10 shrink-0 sm:size-11'
            : 'brand-mark'
        }
      />
      <span
        className={
          compact
            ? 'whitespace-nowrap text-sm font-extrabold tracking-[0.14em] text-[#d96700] sm:text-base'
            : 'brand-name'
        }
      >
        COMPANION
      </span>
    </div>
  )

  return compact ? brand : <header className="site-header">{brand}</header>
}

export default AuthBrand
