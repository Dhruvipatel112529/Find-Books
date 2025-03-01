import Loader from "../images/Loader.gif"
import '../components-css/Load.css'

export default function Load() {
  return (
    <div className='Loading'>
       <img src={Loader} alt="loading" /> 
    </div>
  )
}
