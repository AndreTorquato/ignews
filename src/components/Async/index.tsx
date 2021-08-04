import { useEffect } from "react";
import { useState } from "react";

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [ isButtonInvisible, setIbButtonInvisible ] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true);
      setIbButtonInvisible(false);
    }, 3000);
  }, []);
  return (
    <>
      <h1>Hello World</h1>
      {isButtonVisible && <button type="button">Button</button>}
      { isButtonInvisible && <button type="button">Button 2</button>}
    </>
  );
}
