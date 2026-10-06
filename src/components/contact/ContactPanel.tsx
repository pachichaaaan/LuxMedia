"use client";

import { useState } from "react";
import { ContactForm } from "./ContactForm";

/** Remounting with a new key is how "Send another message" starts fresh. */
export function ContactPanel() {
  const [round, setRound] = useState(0);
  return <ContactForm key={round} onReset={() => setRound((value) => value + 1)} />;
}
