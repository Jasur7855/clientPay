import { STextContainer } from "./TextContainer.style";

interface ITextContainer{
    subTitle:string,
    title:string,
    textClass?:string
}

export const TextContainer = ({subTitle,title,textClass}:ITextContainer) => {
  return (
    <STextContainer className={textClass} >
        <p>{subTitle}</p>
        <h3>{title}</h3>
    </STextContainer>
  )
};