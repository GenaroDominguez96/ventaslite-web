export function getDefaultReportRange() {
  const today = new Date()
  const firstMonth = new Date(today.getFullYear(), today.getMonth() - 11, 1)

  const toDateInput = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  return {
    date_from: toDateInput(firstMonth),
    date_to: toDateInput(today),
    branch_id: '',
  }
}

export function reportParams(filters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== ''),
  )
}
