// import TemplatePointers from "./components/TemplatePointers"
import logo from "../../assets/shade-logo-2.svg"


function LandingIntro() {

  return (
    <div className="hero min-h-full flex items-start justify-start px-20 py-10">
      <div className=" flex flex-col gap-10">
        <div className="flex justify-start">
          <img src={logo} className="" alt="shade_cms-logo" />
          <h1 className='text-4xl text-center font-extralight text-stone-50' style={{ alignSelf: 'center' }}>
            SHADE
          </h1>
          {/* <div className="text-center mt-12"><img src="./intro.png" alt="Dashwind Admin Template" className="w-48 inline-block"></img></div> */}
          {/* Importing pointers component */}
          {/* <TemplatePointers /> */}
        </div>
        <div className="text-stone-50 flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p>Manage your Clients and team in easy way</p>
        </div>
      </div>
    </div>
  )

}

export default LandingIntro