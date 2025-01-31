import { useState, useMemo, useEffect } from "react";
import "./App.css";
import { TextContainer } from "./components/textContainer/TextContainer";
import { PayButton } from "./components/PayButton/PayButton";
import SaleTime from "./components/SaleTime/SaleTime";
import { AgreeOffer } from "./components/AgreeOffer/AgreeOffer";
import {
  usePaymentUserLinkMutation,
  useGetInvoiceByIdQuery,
} from "./store/Api/paymentApi";
import { Loader } from "./components/Loader/Loader";

function App() {
  const getUrlParam = (): string | null => {
    const param = window.location.pathname.split("/").pop();
    return param && param !== "" ? param : null;
  };

  const [offer, setOffer] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const id = getUrlParam();
  if (!id) {
    return (
     <Loader />
    );
  }
  const { data, error, isError, isLoading } = useGetInvoiceByIdQuery(id);
  const [getPaymentLink] = usePaymentUserLinkMutation();

  useEffect(() => {}, [error]);

  const numberWithSpaces = useMemo(
    () => (x: number) => x.toLocaleString("ru-RU"),
    []
  );

  const deadline = useMemo(() => {
    if (!data?.data?.deadline) return null;
    return new Date(Number(data.data.deadline) * 1000).toISOString();
  }, [data]);

  const handleOfferChange = () => setOffer((prev) => !prev);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    if ("status" in error && error.status === 400) {
      return (
        <div className="App">
          <img className="logo" src="/image/Group.svg" alt="Логотип" />
          <div className="errorText">Cрок действия платежа истек</div>
        </div>
      );
    }
    if ("status" in error && error.status === 404) {
      return (
        <div className="App">
          <img className="logo" src="/image/Group.svg" alt="Логотип" />
          <div className="errorText"> платеж не найден </div>
        </div>
      );
    } else {<div> Загрузка,,,</div>}
  }

  const handleUserPayLink = async () => {
    try {
      const response = await getPaymentLink({ invoice_id: id }).unwrap();
      if (response?.link) {
        window.location.href = response.link;
      } else {
        console.error("Ссылка для оплаты не получена");
      }
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
          <TextContainer
            subTitle="Имя студента:"
            title={`${data?.data?.name ?? "Неизвестно"} ${
              data?.data?.last_name ?? ""
            }`}
          />
          <TextContainer
            subTitle="Курс и номер потока:"
            title={`${data?.data?.course_name ?? ""} / ${
              data?.data?.thread ?? ""
            }`}
          />
          <TextContainer
            subTitle="Общая стоимость обучения:"
            title={`${numberWithSpaces(data?.data?.final_price ?? 0)} СУМ`}
          />
          <TextContainer
            subTitle="Сумма к оплате:"
            title={`${numberWithSpaces(data?.data?.sum ?? 0)} СУМ`}
            textClass="yellow"
          />
          <TextContainer
            subTitle="Остаток:"
            title={`${numberWithSpaces(data?.data?.remainder ?? 0)} СУМ`}
          />

          <AgreeOffer
            isChecked={offer}
            link="https://thnkm.uz/oferta"
            onChange={handleOfferChange}
          />
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
