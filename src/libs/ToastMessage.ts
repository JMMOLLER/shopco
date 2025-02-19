import type { ToastEventType } from "@components/react-components/ToastMessage";
import type { MessageInstance } from "antd/es/message/interface";
import { message } from "antd";

/**
 * @summary Clase para obtener la instancia de mensaje de Ant Design
 *
 * @example
 * ```js
 * const toast = await ToastMessage.getInstance();
 * ``` 
 */
export default class ToastMessage {
  private constructor() {}

  public static async getInstance(debug = false): Promise<MessageInstance> {
    return new Promise((resolve) => {
      // Timeout para fallback
      const timeout = setTimeout(() => {
        console.warn(
          "⚠️ ToastMessage no se inicializó en 3 segundos. Usando fallback."
        );
        resolve(message);
      }, 3000);

      // Listener para obtener la instancia de mensaje
      function listener(ev: Event) {
        const e = ev as CustomEvent<ToastEventType>;
        if (e.detail?.messageInstance) {
          clearTimeout(timeout);
          window.removeEventListener("toastMessage-ready", listener);
          const message = e.detail.messageInstance;
          resolve(message!);
        }
      }

      // Escuchar el evento `toastMessage-ready` para obtener la instancia de mensaje
      window.addEventListener("toastMessage-ready", listener);

      // Forzar la re-emisión del evento en caso de que se haya perdido
      window.dispatchEvent(
        new CustomEvent("toastMessage-dispatch", { detail: { verbose: debug } })
      );
    });
  }
}
