"use client";

import type { ChatRequestOptions, UIMessage } from "ai";
import { motion } from "framer-motion";
import type React from "react";
import {
  useRef,
  useEffect,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { cn, sanitizeUIMessages } from "@/lib/utils";

import { ArrowUpIcon, StopIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import suggestedActionsData from "@/data/suggested-actions.json";

const suggestedActions = suggestedActionsData;

export function MultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<UIMessage>;
  setMessages: Dispatch<SetStateAction<Array<UIMessage>>>;
  append: (
    message: any,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    "",
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {});
    setLocalStorageInput("");

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, setLocalStorageInput, width]);

  return (
    <div className="relative w-full flex flex-col gap-3">
      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div className="flex flex-col gap-3">
          <div className="stamped border border-[#003A5F]/15 dark:border-[#F5F0E1]/12 p-3 bg-[#FAF6E9]/85 dark:bg-[#0F2741]/75 rounded-xl">
            <p className="font-serif italic text-sm text-[#7A6F5F] dark:text-[#B8A887] text-center">
              Ask me directly or click a suggestion
            </p>
          </div>

          <div className="max-h-[320px] sm:max-h-[280px] overflow-y-auto">
            <div className="grid sm:grid-cols-2 gap-2 w-full pr-1">
              {suggestedActions.map((suggestedAction, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.05 * index }}
                  key={`suggested-action-${suggestedAction.title}-${index}`}
                >
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      append({
                        role: "user",
                        content: suggestedAction.action,
                      });
                    }}
                    className="stamped group text-left border border-[#003A5F]/15 dark:border-[#F5F0E1]/12 bg-[#FAF6E9]/85 dark:bg-[#0F2741]/75 hover:bg-[#FAF6E9] dark:hover:bg-[#0F2741] hover:border-[#D03027] dark:hover:border-[#E8564E] px-4 py-3 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start transition-all cursor-pointer rounded-xl"
                  >
                    <span className="font-display text-sm text-[#003A5F] dark:text-[#F5F0E1]">
                      {suggestedAction.title}
                    </span>
                    <span className="font-serif italic text-xs text-[#D03027] dark:text-[#E8564E] group-hover:text-[#A8261F] dark:group-hover:text-[#D03027] leading-snug transition-colors">
                      {suggestedAction.label}
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Message Input Form */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder="Enter your question..."
          value={input}
          onChange={handleInput}
          className={cn(
            "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none !text-base",
            "bg-[#FAF6E9]/85 dark:bg-[#0F2741]/75 border border-[#003A5F]/20 dark:border-[#F5F0E1]/12 rounded-xl",
            "focus:border-[#D03027] dark:focus:border-[#E8564E] focus:ring-[#D03027]/30 dark:focus:ring-[#E8564E]/30 focus:ring-2",
            "text-[#1A1A1A] dark:text-[#F5F0E1] placeholder:text-[#7A6F5F]/70 dark:placeholder:text-[#B8A887]/70",
            "pr-12",
            className,
          )}
          rows={3}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();

              if (isLoading) {
                toast.error("Please wait for the response to complete!");
              } else {
                submitForm();
              }
            }
          }}
        />

        {isLoading ? (
          <Button
            className="stamped p-2 h-fit absolute bottom-2 right-2 bg-[#FAF6E9] dark:bg-[#0F2741] border border-[#003A5F]/20 dark:border-[#F5F0E1]/15 hover:bg-[#ECE4CF] dark:hover:bg-[#0A1F35] text-[#003A5F] dark:text-[#F5F0E1] cursor-pointer rounded-lg"
            onClick={(event) => {
              event.preventDefault();
              stop();
              setMessages((messages) => sanitizeUIMessages(messages));
            }}
          >
            <StopIcon size={16} />
          </Button>
        ) : (
          <Button
            className="stamped p-2 h-fit absolute bottom-2 right-2 bg-[#D03027] hover:bg-[#A8261F] dark:bg-[#E8564E] dark:hover:bg-[#D03027] text-[#F5F0E1] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer rounded-lg"
            onClick={(event) => {
              event.preventDefault();
              submitForm();
            }}
            disabled={input.length === 0}
          >
            <ArrowUpIcon size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
