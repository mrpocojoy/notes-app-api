const title = (...params) => {
  console.clear()
  console.log('\n************************************')
  console.log(...params)
  console.log('************************************\n')
}

const requestDetails = (request) => {
  console.log('\n********************************')
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
}


const info = (...params) => {
  console.log(...params)
}
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  title, requestDetails, info, error
}
