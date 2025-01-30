import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { SSaleTime } from "./SaleTime.style";

interface ISaleTime {
  saleStatus: "paid" | boolean | "saleTime";
  saleDate: string; // Дата в формате ISO (например, "2025-01-29T20:26:17.525883+00:00")
  timeOut:boolean;
  complate:()=>void
}

const SaleTime = React.memo(({ saleStatus, saleDate,timeOut ,complate}: ISaleTime) => {
  const [key, setKey] = useState(Date.now());
  const [isTimeOut, setIsTimeOut] = useState(false);
  const saleStartTime = new Date(saleDate).getTime();
  const saleEndTime = saleStartTime+(13*60*60*1000); 
  
  useEffect(() => {
    if (saleStatus === "saleTime") {
      setKey(Date.now());
    }
  }, [saleStatus]);

  if (saleStatus === "paid") return null;
  if (timeOut) {
    return (
      <SSaleTime>
        <h3>Срок для оплаты<br /> по счёту истёк :(</h3>
      </SSaleTime>
    );
  }

  return (
    <SSaleTime>
      <Countdown
        key={key} 
        date={saleEndTime}
        onComplete={complate}
        renderer={({ hours, minutes, seconds }) => (
          <div className="timeWrapper">
            <span>{hours}</span>:
            <span>{minutes < 10 ? `0${minutes}` : minutes}</span>:
            <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
          </div>
        )}
      />
    </SSaleTime>
  );
});

export default SaleTime;
