import { useEffect } from 'react'

const TidioScript = () => {
    useEffect(() => {
        const script = document.createElement('script')
        script.src = "//code.tidio.co/i1csk3uxkscxno31ygfaqx3y3e4c6wds.js"
        script.async = true
        document.body.appendChild(script)
    }, [])

    return null
}

export default TidioScript