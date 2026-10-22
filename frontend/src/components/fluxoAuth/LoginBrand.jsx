import companionLogo from '../../assets/icon_companion.png'
import './LoginBrand.css'

function LoginBrand() {
  return (
    <header className="site-header">
      <div className="site-brand">
        <img
          src={companionLogo}
          className="brand-mark"
          alt=""
        />
        <span className="brand-name">COMPANION</span>
      </div>
    </header>
  )
}

export default LoginBrand
