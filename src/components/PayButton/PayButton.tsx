import { SPayButton } from "./PayButton.style";
interface IPayButton {
  img: string;
  onClick:()=>void
}
export const PayButton = ({ img,onClick }:IPayButton) => {
  return (
    <SPayButton onClick={onClick}>
      <h4>Оплатить через</h4>
      <img src={img} alt="" />
    </SPayButton>
  );
};
