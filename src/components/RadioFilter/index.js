import './index.css'

const RadioFilter = props => {
  const {detail, onChangeRadioOption} = props
  const {salaryRangeId, label} = detail

  const changeRadioOption = () => {
    onChangeRadioOption(salaryRangeId)
  }

  return (
    <li>
      <input
        type="radio"
        value={label}
        name="salary"
        onClick={changeRadioOption}
      />
      <label htmlFor={salaryRangeId} className="radio-label">
        {label}
      </label>
    </li>
  )
}

export default RadioFilter
