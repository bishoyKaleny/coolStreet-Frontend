//@CF Add any copyright information

export default function Faq4() {
  return (
    <div>
      <h2 className="faq-header">Who made this app?</h2>

      <div className="faq-content">
        <p className="minimal"> 
          This app was created by ClimateFlux GmbH and the Chair of Cartography
          and Visual Analytics at the Technical University of Munich.
        </p>
        <p className="minimal">The TUM team included Jiaying Xue and Lydia Youngblood.</p>
        <p className="minimal">The ClimateFlux team included...</p>
        <p className="minimal">The mapping library is provided by <a href="https://leafletjs.com/" target="blank" className='leaflet-logo'>Leaflet</a> and
        utilizes{' '} 
        <a href="https://github.com/PaulLeCam/react-leaflet/" target="blank" >react-leaflet.</a> </p> 

      </div>
    </div>
  );
}
