"use client";

import { toast } from "react-hot-toast";

export const useErrorHandler = () => {
  const handleError = (errors) => {
    // Jika errors adalah string, tampilkan langsung
    if (typeof errors === "string") {
      toast.error(errors);
    }

    // Jika errors adalah object, iterasi dan tampilkan pesan untuk setiap field
    if (typeof errors === "object" && errors !== null) {
      Object.values(errors).forEach((errorMessage) => {
        toast.error(errorMessage);
      });
    }
  };

  return { handleError };
};