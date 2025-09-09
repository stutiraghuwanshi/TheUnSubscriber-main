"use client";

import React, { useEffect, useState } from "react";
import { differenceInDays, format } from "date-fns";
import { BellRing } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSubscriptionReminder } from "@/ai/flows/subscription-reminder-generator";
import type { Subscription, Currency, Reminder } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ReminderHandlerProps {
  subscriptions: Subscription[];
  currency: Currency;
  exchangeRate: number;
  onNewReminder: (reminder: Reminder) => void;
}

export function ReminderHandler({ subscriptions, currency, exchangeRate, onNewReminder }: ReminderHandlerProps) {
  const { toast } = useToast();
  const [remindersSent, setRemindersSent] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkReminders = async () => {
      const today = new Date();
      for (const sub of subscriptions) {
        const daysUntilRenewal = differenceInDays(new Date(sub.renewalDate), today);

        if (daysUntilRenewal >= 0 && daysUntilRenewal <= 3) {
          if (!remindersSent.has(sub.id)) {
            try {
              const reminderResult = await generateSubscriptionReminder({
                subscriptionName: sub.name,
                renewalDate: new Date(sub.renewalDate).toLocaleDateString(),
                cost: sub.cost,
                deliveryMethod: sub.deliveryMethod,
              });

              const newReminder: Reminder = {
                subscription: sub,
                message: reminderResult.reminderMessage,
              };

              onNewReminder(newReminder);

              toast({
                title: (
                  <div className="flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Reminder: {sub.name}</span>
                  </div>
                ),
                description: (
                  <div className="mt-2">
                    <p>{reminderResult.reminderMessage}</p>
                    <div className="mt-3 flex justify-between items-center text-sm text-muted-foreground bg-secondary/50 p-2 rounded-md">
                        <span>Renewal Date: {format(new Date(sub.renewalDate), "MMM d, yyyy")}</span>
                        <span className="font-bold">{formatCurrency(sub.cost, currency, exchangeRate)}</span>
                    </div>
                  </div>
                ),
                duration: 9000,
              });

              setRemindersSent((prev) => new Set(prev).add(sub.id));
            } catch (error) {
              console.error("Failed to generate reminder:", error);
              toast({
                variant: "destructive",
                title: "Error",
                description: "Could not generate subscription reminder.",
              });
            }
          }
        }
      }
    };

    if (subscriptions.length > 0) {
      checkReminders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptions, currency, exchangeRate]); // Removed toast and remindersSent to avoid re-triggering

  return null; // This component does not render anything
}
