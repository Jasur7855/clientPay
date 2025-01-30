import { SAgreeOffer } from "./AgreeOffer.style";

interface IAgreeOffer {
  isChecked: boolean;
  onChange: () => void;
  link: string;
}

export const AgreeOffer = ({ isChecked, onChange, link }: IAgreeOffer) => {
  return (
    <SAgreeOffer >
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      <h4>
        Я согласен(-на) с условиями <a target="_blank" href={link}>публичной оферты</a>
      </h4>
    </SAgreeOffer>
  );
};
