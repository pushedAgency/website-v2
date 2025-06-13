import React from "react";
import MainPageSelector from "@/app/components/Main/MainPageSelector/MainPageSelector";

const page = () => {
  return (
    <main className="">
      <div className="styleNotResponsive">
        <MainPageSelector />
      </div>

      <div className="styleResponsive">
        <h1>Esta pagina esta diseñada para verse desde una Computadora</h1>
      </div>
    </main>
  );
};

export default page;
