  //@CF fill edit


import { ReactComponent as CFExampleImage } from "../../assets/CFlux.svg";

export default function Faq1() {
  return (
    <div>
      <h2 className="faq-header"> How does this app work? </h2>

      <div className="faq-content">
        <p>
          When you enter your destination, our algorithm calculates which route
          in the city of Munich is the most comfortable for you personally.
        </p>

        {/* just an example */}
        <div className="faq-images">
          <CFExampleImage />
        </div>
        <p>
          This calculation considers your provided biometric data, as well as
          temperature, humidity, wind conditions, and sun exposure.
        </p>
      </div>
    </div>
  );
}
