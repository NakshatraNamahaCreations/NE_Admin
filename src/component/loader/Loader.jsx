import React from "react";
// import { ColorRing, DNA, LineWave } from "react-loader-spinner";
import "../loader/loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        {/* <LineWave
          visible={true}
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="line-wave-loading"
          wrapperStyle={{}}
          wrapperClass=""
          firstLineColor=""
          middleLineColor=""
          lastLineColor=""
        /> */}
      </div>
    </div>
  );
};

export default Loader;
