import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenerCapture = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }
      document.addEventListener("click", handleClick, listenerCapture);

      return () =>
        document.removeEventListener("click", handleClick, listenerCapture);
    },
    [handler, listenerCapture]
  );

  return ref;
}
