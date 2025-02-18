import { useState, useMemo, useRef } from "react";
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
import { IGetInvoiceByIdResponse } from "./store/Api/paymentApi";
import { SSaleTime } from "./components/SaleTime/SaleTime.style";
function App() {
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [offer, setOffer] = useState(false);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const getUrlParam = (): string | null => {
    const param = window.location.pathname.split("/").pop();
    return param && param !== "" ? param : null;
  };

  const id = getUrlParam();
  if (!id) {
    return <Loader />;
  }

  const { data, error, isError, isLoading, isFetching } =
    useGetInvoiceByIdQuery(id);
  const [getPaymentLink, { isLoading: linkLoad }] =
    usePaymentUserLinkMutation();

  const paymentRef = useRef<HTMLDivElement | null>(null);

  const numberWithSpaces = useMemo(
    () => (x: number) => x.toLocaleString("ru-RU"),
    []
  );

  const deadline = useMemo(() => {
    if (!data?.data?.deadline) return null;
    const date = new Date(Number(data.data.deadline));
    return date;
  }, [data]);

  const handleOfferChange = () => {
    setOffer((prev) => !prev);
    setTimeout(() => {
      paymentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleUserPayLink = async () => {
    setIsLoadingPayment(true);
    setIsRedirecting(true);
    try {
      const response = await getPaymentLink({ invoice_id: id }).unwrap();
      if (response?.link) {
        window.location.href = response.link;
      } else {
        console.error("Ссылка для оплаты не получена");
        setIsRedirecting(false);
      }
    } catch (err) {
      console.error("Ошибка при получении ссылки:", err);
    } finally {
      setIsRedirecting(false);
      setIsLoadingPayment(false);
    }
  };

  if (
    linkLoad ||
    isLoadingPayment ||
    isRedirecting ||
    isLoading ||
    isFetching
  ) {
    return <Loader />;
  }

  if (isError && error && "status" in error) {
    if (error.status === 404) {
      return (
        <div className="App">
          <img className="logo" src="/image/Group.svg" alt="Логотип" />
          <div className="errorText">Платеж не найден</div>
        </div>
      );
    }

    if (error.status === 400) {
      const errorData = error.data as IGetInvoiceByIdResponse;
      console.log(errorData);

      return (
        <div className="App">
          <img className="logo" src="/image/Group.svg" alt="Логотип" />
          <div className="main">
            <img src="/image/Header.png" alt="Заголовок" className="checkImg" />

            <SSaleTime>
              <h3>
                Срок для оплаты
                <br /> по счёту истёк :(
              </h3>
            </SSaleTime>

            <div className={`timer ${isTimeOut ? "opacity" : ""}`}>
              <div className="disabled" />

              <TextContainer
                subTitle="Имя студента:"
                title={`${errorData?.data?.name ?? "Неизвестно"} ${
                  data?.data?.last_name ?? ""
                }`}
              />
              <TextContainer
                subTitle="Курс и номер потока:"
                title={`${errorData?.data?.course_name ?? ""} / ${
                  errorData?.data?.thread ?? ""
                }`}
              />
              <TextContainer
                subTitle="Общая стоимость обучения:"
                title={`${numberWithSpaces(
                  errorData?.data?.final_price ?? 0
                )} СУМ`}
              />
              <TextContainer
                subTitle="Сумма к оплате:"
                title={`${numberWithSpaces(errorData?.data?.sum ?? 0)} СУМ`}
                textClass="yellow"
              />
              <TextContainer
                subTitle="Остаток:"
                title={`${numberWithSpaces(
                  errorData?.data?.remainder ?? 0
                )} СУМ`}
              />

              <AgreeOffer
                isChecked={true}
                link="http://thnkm.uz/oferta"
                onChange={handleOfferChange}
              />
            </div>
          </div>
        </div>
      );
    }

    if (error.status === 403) {
      const errorData = error.data as IGetInvoiceByIdResponse;
      console.log(errorData);
      return (
        <div className="App">
          <img className="logo" src="/image/Group.svg" alt="Логотип" />
          <div className="main">
            <img src="/image/Header.png" alt="Заголовок" className="checkImg" />

            {errorData?.data && deadline && (
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
                title={`${errorData?.data?.name ?? "Неизвестно"} ${
                  data?.data?.last_name ?? ""
                }`}
              />
              <TextContainer
                subTitle="Курс и номер потока:"
                title={`${errorData?.data?.course_name ?? ""} / ${
                  errorData?.data?.thread ?? ""
                }`}
              />
              <TextContainer
                subTitle="Общая стоимость обучения:"
                title={`${numberWithSpaces(
                  errorData?.data?.final_price ?? 0
                )} СУМ`}
              />
              <TextContainer
                subTitle="Сумма к оплате:"
                title={`${numberWithSpaces(errorData?.data?.sum ?? 0)} СУМ`}
                textClass="yellow"
              />
              <TextContainer
                subTitle="Остаток:"
                title={`${numberWithSpaces(
                  errorData?.data?.remainder ?? 0
                )} СУМ`}
              />

              <AgreeOffer
                isChecked={true}
                link="http://thnkm.uz/oferta"
                onChange={handleOfferChange}
              />
              <img src="/image/paid.png" alt="Заголовок" className="checkImg" />
            </div>
          </div>
        </div>
      );
    }
  }

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
            link="http://thnkm.uz/oferta"
            onChange={handleOfferChange}
          />

          {offer && !isTimeOut && (
            <div ref={paymentRef} className="paymentContainer">
              <PayButton onClick={handleUserPayLink} img="/svg/payme_color.svg" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
