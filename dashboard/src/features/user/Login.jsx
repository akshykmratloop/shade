import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LandingIntro from './LandingIntro'
import ErrorText from '../../components/Typography/ErrorText'
import InputText from '../../components/Input/InputText';
import bg1 from "../../assets/shade-min.jpg"
import bg2 from "../../assets/shade2-min.jpg"


function Login() {
    const [imgRepeator, setImgRepeator] = useState(0);
    const bgImg = [bg1, bg2]

    const INITIAL_LOGIN_OBJ = {
        password: "",
        emailId: ""
    }

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ)

    const submitForm = (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (loginObj.emailId.trim() === "") return setErrorMessage("Email Id is required! (use any value)")
        if (loginObj.password.trim() === "") return setErrorMessage("Password is required! (use any value)")
        else {
            setLoading(true)
            // Call API to check user credentials and save token in localstorage
            localStorage.setItem("token", "DumyTokenHere")
            setLoading(false)
            window.location.href = '/app/welcome'
        }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setLoginObj({ ...loginObj, [updateType]: value })
    }


    useEffect(() => {

        const bgIntervals = setInterval(() => {
            setImgRepeator(prev => {
                return (prev + 1) % bgImg.length
            })
        }, 5 * 1000)

        return () => clearInterval(bgIntervals)
    }, [])
    return (
        <div className="min-h-screen bg-base-200 flex ">
            <div className='mx-auto w-full max-w-4xl l-bg' style={{ backgroundImage: `linear-gradient(#333333d1,rgba(0, 0, 0, 0.2)),url(${bgImg[imgRepeator]})` }}> {/* the bg is set in app.css */}
                <LandingIntro />
                <div className='carouselStatus'>
                    {
                        bgImg.map((e, i) => {
                            return (<div key={e} className='bg-stone-700 carouselDot' style={{ backgroundColor: i === imgRepeator ? 'black' : '' }}></div>) // look for app.css for the styling
                        })
                    }
                </div>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1  bg-base-100">

                <div className='py-24 px-10'>
                    <h2 className='text-2xl font-semibold mb-2 text-center'>Login</h2>
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4">

                            <InputText type="emailId" defaultValue={loginObj.emailId} updateType="emailId" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue} />

                            <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />

                        </div>

                        <div className='text-right text-primary'><Link to="/forgot-password"><span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span></Link>
                        </div>

                        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                        <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Login</button>

                        <div className='text-center mt-4'>Don't have an account yet? <Link to="/register"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</span></Link></div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login