import { useEffect, useState } from "react";
import "./App.css";
import { TextContainer } from "./components/textContainer/TextContainer";
import { PayButton } from "./components/PayButton/PayButton";
import SaleTime from "./components/SaleTime/SaleTime";
import { AgreeOffer } from "./components/AgreeOffer/AgreeOffer";
import { useGetInvoiceByIdQuery } from "./store/Api/paymentApi";
const getUrlParam = (): string | null => {
  const path = window.location.pathname;
  const segments = path.split("/");
  const lastSegment = segments.pop();
  return lastSegment ? lastSegment : null;
};
function App() {
  const [offer, setOffer] = useState<boolean>(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const id = getUrlParam();
  const { data } = useGetInvoiceByIdQuery(id as string);
  const handleOfferChange = () => {
    setOffer(!offer);
  };
  return (
    <div className="App">
      <img className="logo" src="/public/image/Group.svg" alt="" />
      <div className="main">
        <img src="/public/image/Header.png" alt="" className="checkImg" />
        {data?.data && (
          <SaleTime
            saleStatus="saleTime"
            saleDate={data?.data.created_at}
            complate={() => setIsTimeOut(true)}
            timeOut={isTimeOut}
          />
        )}

        <div className={`timer ${isTimeOut && "opacity"}`}>
          {isTimeOut && <div className="disabled" />}

          <TextContainer
            subTitle="Имя студента:"
            title={`${data?.data.name} ${data?.data.last_name}`}
          />
          <TextContainer
            subTitle="Курс и номер потока:"
            title={`${data?.data.course_name} / ${data?.data.thread} `}
          />
          <TextContainer
            subTitle="Общая стоимость обучения:"
            title={`${data?.data.final_price} СУМ `}
          />
          <TextContainer
            subTitle="Сумма к оплате:"
            title={`${data?.data.sum} СУМ `}
            textClass="yellow"
          />
          <TextContainer
            subTitle="Остаток:"
            title={`${data?.data.remainder} СУМ `}
          />
          <AgreeOffer isChecked={offer} link="#" onChange={handleOfferChange} />
          {offer && !isTimeOut && (
            <div className="paymentContainer">
              <PayButton img="/svg/Payment1.svg" />
              <PayButton img="/svg/Payment2.svg" />
              <PayButton img="/svg/Payment3.svg" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
