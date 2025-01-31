import { SPayButton } from "./PayButton.style";
interface IPayButton {
  img: string;
}
export const PayButton = ({ img }:IPayButton) => {
  return (
    <SPayButton>
      <h4>Оплатить через</h4>
      <img src={img} alt="" />
    </SPayButton>
  );
};
