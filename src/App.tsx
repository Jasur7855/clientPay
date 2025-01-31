import { useState } from "react";
import "./App.css";
import { TextContainer } from "./components/textContainer/TextContainer";
import { PayButton } from "./components/PayButton/PayButton";
import SaleTime from "./components/SaleTime/SaleTime";
import { AgreeOffer } from "./components/AgreeOffer/AgreeOffer";
import {
  usePaymentUserLinkMutation,
  useGetInvoiceByIdQuery,
} from "./store/Api/paymentApi";

const getUrlParam = (): string | null => {
  const path = window.location.pathname;
  const segments = path.split("/");
  return segments.pop() || null;
};

function App() {
  const [offer, setOffer] = useState<boolean>(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const numberWithSpaces = function (x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  const id = getUrlParam();
  console.log(id);

  const { data,error,isError } = useGetInvoiceByIdQuery(id as string);
  const [getPaymentLink, { data: paymentData }] = usePaymentUserLinkMutation();

  if (!id) return <div className="errorText"> ошибка платежа !</div>;
  if(isError){
    if ("status" in error && error.status === 400) {
      return <div className="errorText">Платеж истек!</div>;
    }
    if ("status" in error && error.status === 404) {
      return <div className="errorText">Платеж не найден </div>;
    }
  }
  

  let deadline: string | null = null;
  if (data?.data?.deadline) {
    const timestamp = Number(data.data.deadline) * 1000;
    deadline = new Date(timestamp).toISOString();
  }

  const handleOfferChange = () => {
    setOffer(!offer);
  };
  const handleUserPayLink = async () => {
    if (!id) {
      console.error("Ошибка: ID платежа отсутствует");
      return;
    }
    try {
      const response = await getPaymentLink({ invoice_id: id }).unwrap();
      window.location.href = response.link;
    } catch (err) {
      console.error("Ошибка при получении ссылки:", err);
    }
  };
  
  return (
    <div className="App">
      <img className="logo" src="/image/Group.svg" alt="" />
      <div className="main">
        <img src="/image/Header.png" alt="" className="checkImg" />
        {data?.data && deadline && (
          <SaleTime
            saleFinish={deadline}
            saleStatus="saleTime"
            complate={() => setIsTimeOut(true)}
            timeOut={isTimeOut}
          />
        )}

        <div className={`timer ${isTimeOut ? "opacity" : ""}`}>
          {isTimeOut && <div className="disabled" />}

          <TextContainer
            subTitle="Имя студента:"
            title={`${data?.data.name} ${data?.data.last_name}`}
          />
          <TextContainer
            subTitle="Курс и номер потока:"
            title={`${data?.data.course_name} / ${data?.data.thread}`}
          />
          <TextContainer
            subTitle="Общая стоимость обучения:"
            title={`${numberWithSpaces(data?.data.final_price ?? 0)} СУМ`}
          />
          <TextContainer
            subTitle="Сумма к оплате:"
            title={`${numberWithSpaces(data?.data.sum ?? 0)} СУМ`}
            textClass="yellow"
          />
          <TextContainer
            subTitle="Остаток:"
            title={`${numberWithSpaces(data?.data.remainder ?? 0)} СУМ`}
          />

          <AgreeOffer
            isChecked={offer}
            link="https://thnkm.uz/oferta"
            onChange={handleOfferChange}
          />
          {offer && !isTimeOut && (
            <div className="paymentContainer">
              <PayButton onClick={handleUserPayLink} img="/svg/Payment1.svg" />
              {/* <PayButton img="/svg/Payment2.svg" />
              <PayButton img="/svg/Payment3.svg" /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
