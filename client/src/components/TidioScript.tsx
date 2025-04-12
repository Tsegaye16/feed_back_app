
import { useEffect } from 'react'

const TidioScript = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//code.tidio.co/w35tibbye6modns8yxexxvf7vbryyc1l.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return null
}

export default TidioScript