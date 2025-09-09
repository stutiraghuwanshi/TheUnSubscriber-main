"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircle, ArrowRightLeft, Bell } from "lucide-react";
import type { Currency, Reminder } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface DashboardHeaderProps {
  onAddSubscription: () => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  reminders: Reminder[];
  exchangeRate: number;
}

export function DashboardHeader({
  onAddSubscription,
  currency,
  onCurrencyChange,
  reminders,
  exchangeRate,
}: DashboardHeaderProps) {
  const toggleCurrency = () => {
    onCurrencyChange(currency === "USD" ? "INR" : "USD");
  };

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-headline">
            The UnSubscriber
          </h1>
          <p className="text-muted-foreground">
            Your personal dashboard for tracking subscriptions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative"
              >
                <Bell className="h-5 w-5" />
                {reminders.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                    {reminders.length}
                  </span>
                )}
                <span className="sr-only">Show reminders</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Reminders</h4>
                  <p className="text-sm text-muted-foreground">
                    Upcoming subscription renewals.
                  </p>
                </div>
                <div className="grid gap-2">
                  {reminders.length > 0 ? (
                    reminders.map(({ subscription, message }) => (
                      <div
                        key={subscription.id}
                        className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                      >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                        <div className="grid gap-1">
                          <p className="font-semibold">{subscription.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {message}
                          </p>
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>{format(new Date(subscription.renewalDate), "MMM d, yyyy")}</span>
                            <span className="font-bold">{formatCurrency(subscription.cost, currency, exchangeRate)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No new reminders.
                    </p>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            onClick={toggleCurrency}
            variant="outline"
            className="hidden sm:flex"
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            {currency === "USD" ? "Show in INR" : "Show in USD"}
          </Button>
          <Button onClick={onAddSubscription} className="hidden sm:flex">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Subscription
          </Button>
        </div>
        <div className="flex items-center gap-2 sm:hidden">
            <Button onClick={toggleCurrency} size="icon" variant="outline">
                <ArrowRightLeft className="h-4 w-4" />
                <span className="sr-only">Toggle Currency</span>
            </Button>
            <Button onClick={onAddSubscription} size="icon">
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add Subscription</span>
            </Button>
        </div>
      </div>
    </header>
  );
}