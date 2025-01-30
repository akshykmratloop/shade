import logo from "../../assets/shade-logo-2.svg"


function LandingIntro() {

  return (
    <div className="hero min-h-full flex items-start justify-start md:px-20 md:py-10 sm:px-10 sm:py-10">
      <div className=" flex flex-col gap-10">
        <div className="flex justify-start">
          <img src={logo} className="" alt="shade_cms-logo" />
          <h1 className='text-4xl text-center font-extralight text-stone-50' style={{ alignSelf: 'center' }}>
            SHADE
          </h1>
        </div>
        <div className="text-stone-50 flex flex-col gap-4">
          <h1 className="font-bold sm:text-3xl text-5xl">Dashboard</h1>
          <p className="md:text-sm sm:text-xs">Manage your Clients and team in easy way</p>
        </div>
      </div>
    </div>
  )

}

export default LandingIntro