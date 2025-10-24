import { AxiosError } from "axios";
import { toast } from "react-toastify";

/**
 * Handles an error by logging the error to the console and displaying a toast error message to the user.
 * If the error is an AxiosError, it logs the status, message and URL of the error.
 * If the error has a message property that is a string, it displays the message in a toast error message.
 * If the error has a message property that is an array of strings, it displays the first message in a toast error message.
 * If the error is not an AxiosError or does not have a message property, it logs the error to the console and displays a generic toast error message.
 * @param {unknown} err The error to handle.
 */
export const handleError = (err: unknown) => {
  if (err instanceof AxiosError) {
    console.error("Axios error", {
      status: err.response?.status,
      message: err.response?.data?.message,
      url: err.config?.baseURL,
    });
    const message = err.response?.data?.message;

    if (typeof message === "string") {
      toast.error(message);
    } else if (Array.isArray(message) && message.length > 0) {
      toast.error(message[0]);
    } else {
      toast.error("An unexpected error occurred");
    }
    return;
  }
  console.error("Unexpected error", err);
  toast.error("Something went wrong. Please try again.");
};
