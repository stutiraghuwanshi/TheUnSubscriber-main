"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { Subscription, Currency, Reminder } from "@/types";
import { DashboardHeader } from "./dashboard-header";
import { SpendingSummary } from "./spending-summary";
import { SubscriptionList } from "./subscription-list";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import { ReminderHandler } from "./reminder-handler";

const initialSubscriptions: Subscription[] = [
  { id: '1', name: 'Netflix Premium', cost: 19.99, renewalDate: new Date(new Date().setDate(new Date().getDate() + 2)), deliveryMethod: 'email' },
  { id: '2', name: 'Spotify Duo', cost: 12.99, renewalDate: new Date(new Date().setDate(new Date().getDate() + 10)), deliveryMethod: 'sms' },
  { id: '3', name: 'Gym Membership', cost: 45.00, renewalDate: new Date(new Date().setDate(new Date().getDate() + 25)), deliveryMethod: 'email' },
  { id: '4', name: 'Amazon Prime', cost: 14.99, renewalDate: new Date(new Date().setDate(new Date().getDate() - 5)), deliveryMethod: 'sms' },
];

const USD_TO_INR_RATE = 83.50;

export function SubscriptionDashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    try {
      const savedSubscriptions = localStorage.getItem("subscriptions");
      if (savedSubscriptions) {
        const parsed = JSON.parse(savedSubscriptions).map((s: any) => ({
            ...s,
            renewalDate: new Date(s.renewalDate)
        }));
        setSubscriptions(parsed);
      } else {
        setSubscriptions(initialSubscriptions);
      }
    } catch (error) {
        console.error("Failed to load subscriptions from localStorage", error);
        setSubscriptions(initialSubscriptions);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
        try {
            localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
        } catch (error) {
            console.error("Failed to save subscriptions to localStorage", error);
        }
    }
  }, [subscriptions, isLoading]);

  const handleAddSubscription = () => {
    setEditingSubscription(null);
    setIsDialogOpen(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsDialogOpen(true);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    setReminders(reminders.filter(rem => rem.subscription.id !== id));
  };

  const handleSaveSubscription = (
    data: Omit<Subscription, "id">,
    id?: string
  ) => {
    if (id) {
      // Update existing
      setSubscriptions(
        subscriptions.map((sub) => (sub.id === id ? { ...data, id } : sub))
      );
    } else {
      // Add new
      setSubscriptions([...subscriptions, { ...data, id: crypto.randomUUID() }]);
    }
  };

  const handleNewReminder = useCallback((newReminder: Reminder) => {
    setReminders(prevReminders => {
      if (prevReminders.some(r => r.subscription.id === newReminder.subscription.id)) {
        return prevReminders;
      }
      return [...prevReminders, newReminder];
    });
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <DashboardHeader 
        onAddSubscription={handleAddSubscription}
        currency={currency}
        onCurrencyChange={setCurrency}
        reminders={reminders}
        exchangeRate={USD_TO_INR_RATE}
      />
      <main className="space-y-8">
        <SpendingSummary subscriptions={subscriptions} currency={currency} exchangeRate={USD_TO_INR_RATE} />
        <SubscriptionList
          subscriptions={subscriptions}
          onEdit={handleEditSubscription}
          onDelete={handleDeleteSubscription}
          isLoading={isLoading}
          currency={currency}
          exchangeRate={USD_TO_INR_RATE}
        />
      </main>
      <AddSubscriptionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveSubscription}
        subscriptionToEdit={editingSubscription}
      />
      <ReminderHandler 
        subscriptions={subscriptions} 
        currency={currency} 
        exchangeRate={USD_TO_INR_RATE}
        onNewReminder={handleNewReminder}
      />
    </div>
  );
}
