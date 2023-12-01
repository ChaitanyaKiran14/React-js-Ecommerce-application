import {useState, useEffect, useCallback} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import ProductCard from '../ProductCard'

import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const PrimeDealsSection = () => {
  const [primeDeals, setPrimeDeals] = useState([])
  const [apiStatus, setApiStatus] = useState(apiStatusConstant.initial)

  const getPrimeDeals = useCallback(async () => {
    setApiStatus(apiStatusConstant.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/prime-deals'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()
      const data2 = data.prime_deals
      console.log(data2)

      const modifiedData = data2.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      setPrimeDeals(modifiedData)
      setApiStatus(apiStatusConstant.success)
    } catch (error) {
      console.log('error in fetchiing data', error)
      setApiStatus(apiStatusConstant.failure)
    }
  }, [])

  useEffect(() => {
    getPrimeDeals()
  }, [getPrimeDeals])

  const renderPrimedeals = () => (
    <div>
      <h1>Exclusively for PRIME MEMBERS</h1>
      <ul className="products-list">
        {primeDeals.map(each => (
          <ProductCard productData={each} key={each.id} />
        ))}
      </ul>
    </div>
  )

  const renderPrimeDealsFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
      alt="Register Prime"
      className="register-prime-image"
    />
  )

  const renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  switch (apiStatus) {
    case apiStatusConstant.success:
      return renderPrimedeals()

    case apiStatusConstant.failure:
      return renderPrimeDealsFailureView()

    case apiStatusConstant.inProgress:
      return renderLoadingView()

    default:
      return null
  }
}

export default PrimeDealsSection
