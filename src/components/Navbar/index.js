import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Navbar = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="navbar-background">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="navbar-logo"
        />
      </Link>
      <ul className="navbar-unordered-list">
        <Link to="/" className="navbar-link">
          <li className="navbar-list-item">Home</li>
        </Link>
        <Link to="/jobs" className="navbar-link">
          <li className="navbar-list-item">Jobs</li>
        </Link>
        <li>
          <button
            type="button"
            className="navbar-button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Navbar)
