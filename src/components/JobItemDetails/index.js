import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {MdWork} from 'react-icons/md'
import Navbar from '../Navbar'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const SkillItem = props => {
  const {detail} = props
  return (
    <li>
      <img src={detail.image_url} alt={detail.name} />
      <p>{detail.name}</p>
    </li>
  )
}

const SimilarJobs = props => {
  const {detail} = props
  return (
    <li>
      <div className="specific-job-container-1">
        <img
          src={detail.company_logo_url}
          alt="similar job company logo"
          className="job-company-logo"
        />
        <div>
          <h1 className="job-title-heading">{detail.title}</h1>
          <div className="specific-job-container-1-inside">
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
            <p className="rating">{detail.rating}</p>
          </div>
        </div>
      </div>
      <h1>Description</h1>
      <p>{detail.job_description}</p>
      <div className="specific-job-container-2-inside">
        <div>
          <p className="specific-job-container-2-para">{detail.location}</p>
        </div>
        <div className="specific-job-container-2-inside">
          <MdWork />
          <p className="specific-job-container-2-para">
            {detail.employment_type}
          </p>
        </div>
      </div>
    </li>
  )
}

class JobItemDetails extends Component {
  state = {jobItemDetails: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const job = fetchedData.job_details
      const similarJob = fetchedData.similar_jobs
      const updatedData = {
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        skills: job.skills,
        lifeAtCompany: job.life_at_company,
        similarJobs: similarJob,
      }
      // console.log(updatedData.similarJobs)

      this.setState({
        jobItemDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobView = () => {
    const {jobItemDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      skills,
      lifeAtCompany,
      similarJobs,
    } = jobItemDetails

    return (
      <div>
        <div className="specific-job-background">
          <div className="specific-job-container-1">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="job-company-logo"
            />
            <div>
              <h1 className="job-title-heading">{}</h1>
              <div className="specific-job-container-1-inside">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="specific-job-container-2">
            <div className="specific-job-container-2-inside">
              <div>
                <p className="specific-job-container-2-para">{location}</p>
              </div>
              <div className="specific-job-container-2-inside">
                <MdWork />
                <p className="specific-job-container-2-para">
                  {employmentType}
                </p>
              </div>
            </div>
            <p className="job-description">{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <h1>Description</h1>
            <a href={companyWebsiteUrl}>
              <button type="button">Visit</button>
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1>Skills</h1>
          <ul>
            {skills.map(each => (
              <SkillItem detail={each} key={each.name} />
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div>
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.image_url} alt="life at company" />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul>
          {similarJobs.map(each => (
            <SimilarJobs detail={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderJob = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Navbar />
        {this.renderJob()}
      </>
    )
  }
}

export default JobItemDetails
