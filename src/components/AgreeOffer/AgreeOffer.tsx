import {
  HiddenCheckbox,
  SAgreeOffer,
  StyledCheckbox,
} from "./AgreeOffer.style";

interface IAgreeOffer {
  isChecked: boolean;
  onChange: () => void;
  link: string;
}

export const AgreeOffer = ({ isChecked, onChange, link }: IAgreeOffer) => {
  return (
    <SAgreeOffer>
      <label>
        <HiddenCheckbox
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
        />
        <StyledCheckbox checked={isChecked}>
          <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 1C11.3411 4.27599 8.35157 8.60815 5.43362 10.3327L1 5.11139"
              stroke="black"
              strokeWidth="2"
            />
          </svg>
        </StyledCheckbox>
      </label>
      <h4>
        Я согласен(-на) с условиями{" "}
        <a target="_blank" href={link} rel="noopener noreferrer">
          публичной оферты
        </a>
      </h4>
    </SAgreeOffer>
  );
};
