/* eslint-disable jsx-a11y/control-has-associated-label */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {MdWork} from 'react-icons/md'
import {BsSearch} from 'react-icons/bs'
import Navbar from '../Navbar'
import Profile from '../Profile'
import CheckboxFilter from '../CheckboxFilter'
import RadioFilter from '../RadioFilter'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const JobItem = props => {
  const {detail} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = detail

  return (
    <Link to={`/jobs/${id}`} className="specific-job-link">
      <div className="specific-job-background">
        <div className="specific-job-container-1">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="job-company-logo"
          />
          <div>
            <h1 className="job-title-heading">{title}</h1>
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
              <p className="specific-job-container-2-para">{employmentType}</p>
            </div>
          </div>
          <p className="job-description">{packagePerAnnum}</p>
        </div>
        <hr />
        <h1>Description</h1>
        <p className="job-description">{jobDescription}</p>
      </div>
    </Link>
  )
}

class Jobs extends Component {
  state = {
    employment: [],
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    salaryRange: '',
    inputValue: '',
  }

  componentDidMount() {
    this.getJobsList()
  }

  getJobsList = async () => {
    const {employment, salaryRange, inputValue} = this.state
    console.log(inputValue)
    console.log(salaryRange)
    console.log(employment.join())
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employment.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${inputValue}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))

      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderListView = () => {
    const {jobsList} = this.state
    const isEmpty = jobsList.length === 0
    return isEmpty ? (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    ) : (
      <ul>
        {jobsList.map(each => (
          <JobItem detail={each} key={each.id} />
        ))}
      </ul>
    )
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
      <button type="button" className="retry-button" onClick={this.getJobsList}>
        Retry
      </button>
    </div>
  )

  onClickCheckbox = id => {
    const {employment} = this.state
    if (!employment.includes(id)) {
      this.setState(
        prevState => ({employment: [...prevState.employment, id]}),
        this.getJobsList,
      )
    } else {
      const index = employment.indexOf(id)
      employment.splice(index, 1)
      this.setState({employment}, this.getJobsList)
    }
  }

  onChangeRadioOption = id => {
    this.setState({salaryRange: id}, this.getJobsList)
  }

  renderJobFiltersAndProfile = () => (
    <div className="filter-profile-background">
      <Profile />
      <hr />
      <h1 className="job-filter-heading">Type of Employment</h1>
      <ul className="job-filter-unordered-list">
        {employmentTypesList.map(each => (
          <CheckboxFilter
            detail={each}
            key={each.employmentTypeId}
            onClickCheckbox={this.onClickCheckbox}
          />
        ))}
      </ul>
      <hr />
      <h1 className="job-filter-heading">Salary Range</h1>
      <ul className="job-filter-unordered-list">
        {salaryRangesList.map(each => (
          <RadioFilter
            detail={each}
            key={each.salaryRangeId}
            onChangeRadioOption={this.onChangeRadioOption}
          />
        ))}
      </ul>
    </div>
  )

  onChangeInput = event => {
    this.setState({inputValue: event.target.value})
  }

  searchJob = () => {
    this.getJobsList()
  }

  renderSearchBar = () => {
    const {inputValue} = this.state
    return (
      <div className="search-input-background">
        <input
          type="search"
          className="search-input"
          onChange={this.onChangeInput}
          value={inputValue}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-icon-button"
          onClick={this.searchJob}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderListView()
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
        <div className="jobs-background">
          {this.renderJobFiltersAndProfile()}
          <div className="jobs-container">
            {this.renderSearchBar()}
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
