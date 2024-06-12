"use client";
import React, { useEffect, useRef } from "react";
import { Imessage, useMessage } from "./messages";
import { LIMIT_MESSAGES } from "../constant";

const InitMessages = ({ messages }: { messages: Imessage[] }) => {
  const initState = useRef(false);
  const hasMore = messages.length >= LIMIT_MESSAGES;

  useEffect(() => {
    if (!initState.current) {
      useMessage.setState((state) => ({ ...state, messages, hasMore }));
      initState.current = true;
    }
  }, [messages]);

  return null;
};

export default InitMessages;
