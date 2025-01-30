import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { SSaleTime } from "./SaleTime.style";

interface ISaleTime {
  saleStatus: "paid" | boolean | "saleTime";
  timeOut: boolean;
  complate: () => void;
  saleFinish: string;
}

const SaleTime = React.memo(
  ({ saleStatus, timeOut, complate, saleFinish }: ISaleTime) => {
    const [key, setKey] = useState(Date.now());

    useEffect(() => {
      if (saleStatus === "saleTime") {
        setKey(Date.now());
      }
    }, [saleStatus]);

    if (saleStatus === "paid") return null;
    if (timeOut) {
      return (
        <SSaleTime>
          <h3>
            Срок для оплаты
            <br /> по счёту истёк :(
          </h3>
        </SSaleTime>
      );
    }

    const saleEndTime = new Date(saleFinish).getTime();

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
  }
);

export default SaleTime;
