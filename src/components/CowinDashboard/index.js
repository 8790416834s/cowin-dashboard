import {Component} from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {apiStatus: apiStatusConstants.initial, vaccinationList: []}

  componentDidMount() {
    this.getCowinDetails()
  }

  vaccineData = data => ({
    vaccineData: data.vaccine_data,
    dose1: data.dose_1,
    dose2: data.dose_2,
  })

  getCowinDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.progress})
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(vaccinationDataApiUrl)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(data =>
          this.vaccineData(data),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age,
        vaccinationByGender: fetchedData.vaccination_by_gender,
      }
      this.setState({
        vaccinationList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={50} />
    </div>
  )

  renderSuccess = () => {
    const {vaccinationList} = this.state
    const dataFormatter = number => {
      if (number > 1000) {
        return `${(number / 1000).toString()}k`
      }
      return number.toString()
    }

    return (
      <div>
        <h1 className="main-heading">Vaccination Coverage</h1>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={vaccinationList.last7DaysVaccination}
            margin={{top: 5}}
          >
            <XAxis
              dataKey="vaccineDate"
              tick={{stroke: '#161625', strokeWidth: 1}}
            />
            <YAxis
              tickFormatter={dataFormatter}
              tick={{stroke: '#161625', strokeWidth: 0}}
            />
            <Legend wrapperStyle={{padding: 30}} />
            <Bar dataKey="dose1" name="Dose 1" fill="#5a8dee" barSize="20%" />
            <Bar dataKey="dose2" name="Dose 2" fill="#2d87bb" barSize="20%" />
          </BarChart>
        </ResponsiveContainer>
        <h1 className="main-heading">Vaccination by gender</h1>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              cx="70%"
              cy="40%"
              data={vaccinationList.vaccinationByGender}
              startAngle={0}
              endAngle={180}
              innerRadius="40%"
              outerRadius="70%"
              dataKey="count"
            >
              <Cell name="Male" fill="#2d87bb" />
              <Cell name="Female" fill="#5a8dee" />
              <Cell name="Others" fill="#a3df9f" />
            </Pie>
            <Legend
              iconType="circle"
              layout="horizontal"
              verticalAlign="middle"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
        <h1 className="main-heading">Vaccination by Age</h1>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              cx="70%"
              cy="40%"
              data={vaccinationList.vaccinationByAge}
              startAngle={0}
              endAngle={360}
              innerRadius="0%"
              outerRadius="70%"
              dataKey="count"
            >
              <Cell name="18-44" fill="#2d87bb" />
              <Cell name="44-60" fill="#5a8dee" />
              <Cell name="Above 60" fill="#a3df9f" />
            </Pie>
            <Legend
              iconType="circle"
              layout="horizontal"
              verticalAlign="middle"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-msg">Something Went Wrong</h1>
    </div>
  )

  renderSwitch = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.progress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="dashboard-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <p className="logo-name">Co-WIN</p>
        </div>
        <h1 className="main-heading">CoWIN Vaccination In India</h1>
        {this.renderSwitch()}
      </div>
    )
  }
}
export default CowinDashboard
