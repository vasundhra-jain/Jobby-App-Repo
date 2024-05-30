import './index.css'

const CheckboxFilter = props => {
  const {detail, onClickCheckbox} = props
  const {label, employmentTypeId} = detail

  const manipulate = () => {
    onClickCheckbox(employmentTypeId)
  }

  return (
    <li>
      <input type="checkbox" value={label} onClick={manipulate} />
      <label htmlFor={employmentTypeId} className="checkbox-label">
        {label}
      </label>
    </li>
  )
}

export default CheckboxFilter
