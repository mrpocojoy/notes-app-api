// 400 - BAD CLIENT REQUEST
module.exports = (error, request, response) => {
  console.error('Error message:')
  console.error(error.message || error)

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'Wrong ID Format.' })

  if (error.name === 'ValidationError')
    return response.status(400).json({ error: error.message })


  return response.status(500).send({ error })
}
