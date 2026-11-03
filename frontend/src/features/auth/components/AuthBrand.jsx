import companionLogo from '../../../assets/icon_companion.png'
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
      <img
        src={companionLogo}
        className={
          compact
            ? 'size-10 shrink-0 object-contain sm:size-11'
            : 'brand-mark'
        }
        alt=""
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
