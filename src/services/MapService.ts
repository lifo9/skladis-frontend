import axios from 'axios'

export function reverseGeoCode(longitude, lattitude) {
  return axios.get(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lattitude}&lon=${longitude}&zoom=18&addressdetails=1`
  )
}
