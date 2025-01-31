import { useState, useMemo } from "react";
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
  return window.location.pathname.split("/").pop() || null;
};

function App() {
  const [offer, setOffer] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const id = getUrlParam();
  
  const { data, error, isError } = useGetInvoiceByIdQuery(id as string);
  const [getPaymentLink] = usePaymentUserLinkMutation();

  // Функция для обработки ошибок API
  const renderError = () => {
    if (!id) return "Ошибка платежа!";
    if (isError) {
      if ("status" in error) {
        if (error.status === 400) return "Платеж истек!";
        if (error.status === 404) return "Платеж не найден";
      }
      return "Ошибка загрузки данных";
    }
    return null;
  };

  const errorMessage = renderError();
  if (errorMessage) return <div className="errorText">{errorMessage}</div>;

  // Оптимизированная функция форматирования чисел
  const numberWithSpaces = (x: number) => x.toLocaleString("ru-RU");

  // Оптимизированный расчет deadline (мемоизирован)
  const deadline = useMemo(() => {
    if (!data?.data?.deadline) return null;
    return new Date(Number(data.data.deadline) * 1000).toISOString();
  }, [data]);

  const handleOfferChange = () => setOffer((prev) => !prev);

  const handleUserPayLink = async () => {
    if (!id) return console.error("Ошибка: ID платежа отсутствует");

    try {
      const response = await getPaymentLink({ invoice_id: id }).unwrap();
      window.location.href = response.link;
    } catch (err) {
      console.error("Ошибка при получении ссылки:", err);
    }
  };

  return (
    <div className="App">
      <img className="logo" src="/image/Group.svg" alt="Логотип" />
      <div className="main">
        <img src="/image/Header.png" alt="Заголовок" className="checkImg" />
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
          <TextContainer subTitle="Имя студента:" title={`${data?.data.name} ${data?.data.last_name}`} />
          <TextContainer subTitle="Курс и номер потока:" title={`${data?.data.course_name} / ${data?.data.thread}`} />
          <TextContainer subTitle="Общая стоимость обучения:" title={`${numberWithSpaces(data?.data.final_price ?? 0)} СУМ`} />
          <TextContainer subTitle="Сумма к оплате:" title={`${numberWithSpaces(data?.data.sum ?? 0)} СУМ`} textClass="yellow" />
          <TextContainer subTitle="Остаток:" title={`${numberWithSpaces(data?.data.remainder ?? 0)} СУМ`} />

          <AgreeOffer isChecked={offer} link="https://thnkm.uz/oferta" onChange={handleOfferChange} />
          {offer && !isTimeOut && (
            <div className="paymentContainer">
              <PayButton onClick={handleUserPayLink} img="/svg/Payment1.svg" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
