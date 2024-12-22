"use client"

import React, { useEffect, useState } from "react";
import Modal from "./modal";
import { Button } from "./ui/button";

export const AlertModal = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(()=> {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>Cancel</Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>Delete</Button>
      </div>
    </Modal>
  )
}