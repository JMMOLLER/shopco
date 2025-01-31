import { useCallback, useEffect, useMemo, useState } from "react";
import type { MessageInstance } from "antd/es/message/interface";
import { message } from "antd";

export interface ToastEventType {
  /**
   * @summary Instancia de mensaje de Ant Design
   */
  messageInstance?: MessageInstance;
  /**
   * @default false
   * @summary Muestra mensajes de depuración en la consola
   */
  verbose: boolean;
}

function ToastMessage() {
  const [messageApi, contextHolder] = message.useMessage({
    top: 10
  });
  const [verbose, setVerbose] = useState(false);

  const customEvent = useMemo(() => {
    return new CustomEvent("toastMessage-ready", {
      detail: { messageInstance: messageApi, verbose }
    });
  }, [messageApi]);

  const dispatchReady = useCallback(
    (ev: Event) => {
      if (!customEvent) return console.error("❌ Evento no está listo");

      const e = ev as CustomEvent<Omit<ToastEventType, "messageInstance">>;

      if (e.detail?.verbose) setVerbose(e.detail.verbose);

      e.detail.verbose &&
        console.info(
          "🔄 Recibido `toastMessage-dispatch`, reenviando `toastMessage-ready`..."
        );
      window.dispatchEvent(customEvent);
    },
    [customEvent]
  );

  useEffect(() => {
    if (!messageApi || !customEvent || !dispatchReady) return;

    verbose && console.info("✅ ToastMessage listo, enviando evento...");
    window.dispatchEvent(customEvent);

    return () => {
      verbose && console.warn("❌ Eliminando eventos de ToastMessage...");
      window.removeEventListener("toastMessage-dispatch", dispatchReady);
    };
  }, [messageApi, customEvent, dispatchReady]);

  useEffect(() => {
    if (!customEvent || !dispatchReady) return;

    window.addEventListener("toastMessage-dispatch", dispatchReady);

    return () => {
      window.removeEventListener("toastMessage-dispatch", dispatchReady);
    };
  }, [customEvent, dispatchReady]);

  return <>{contextHolder}</>;
}

export default ToastMessage;
