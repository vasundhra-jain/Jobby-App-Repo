import {Link} from 'react-router-dom'
import Navbar from '../Navbar'
import './index.css'

const Home = props => (
  <>
    <Navbar />
    <div className="home-background">
      <h1 className="home-heading">
        Find The Job That
        <br /> Fits Your Life
      </h1>
      <p className="home-para">
        Millions of people are searching for jobs,salary
        <br /> information,company reviews. Find the job that fits your
        <br /> abilities and potential.
      </p>
      <Link to="/jobs">
        <button type="button" className="home-button">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)

export default Home
