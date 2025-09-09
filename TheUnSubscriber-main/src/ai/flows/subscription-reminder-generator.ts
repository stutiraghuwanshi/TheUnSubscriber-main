'use server';

/**
 * @fileOverview Subscription Reminder Generator flow.
 *
 * This file defines a Genkit flow that automatically generates personalized reminder messages
 * for upcoming subscription renewals. It takes subscription details as input and returns a
 * reminder message tailored to the user.
 *
 * @example
 * // Example usage:
 * const input = {
 *   subscriptionName: 'Netflix',
 *   renewalDate: '2024-01-01',
 *   cost: 15.99,
 *   deliveryMethod: 'email'
 * };
 * const reminderMessage = await generateSubscriptionReminder(input);
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SubscriptionReminderInputSchema = z.object({
  subscriptionName: z.string().describe('The name of the subscription.'),
  renewalDate: z.string().describe('The renewal date of the subscription (YYYY-MM-DD).'),
  cost: z.number().describe('The cost of the subscription.'),
  deliveryMethod: z
    .enum(['email', 'sms'])
    .describe('The preferred delivery method for the reminder.'),
});
export type SubscriptionReminderInput = z.infer<typeof SubscriptionReminderInputSchema>;

const SubscriptionReminderOutputSchema = z.object({
  reminderMessage: z.string().describe('The personalized reminder message.'),
});
export type SubscriptionReminderOutput = z.infer<typeof SubscriptionReminderOutputSchema>;

export async function generateSubscriptionReminder(input: SubscriptionReminderInput): Promise<SubscriptionReminderOutput> {
  return subscriptionReminderFlow(input);
}

const subscriptionReminderPrompt = ai.definePrompt({
  name: 'subscriptionReminderPrompt',
  input: {schema: SubscriptionReminderInputSchema},
  output: {schema: SubscriptionReminderOutputSchema},
  prompt: `You are a helpful assistant that generates personalized subscription renewal reminders.

  Subscription Name: {{{subscriptionName}}}
  Renewal Date: {{{renewalDate}}}
  Cost: {{{cost}}}

  Generate a friendly reminder message to be sent to the user, including the subscription name, renewal date, and cost. The message should be tailored for delivery via {{{deliveryMethod}}}.`,
});

const subscriptionReminderFlow = ai.defineFlow(
  {
    name: 'subscriptionReminderFlow',
    inputSchema: SubscriptionReminderInputSchema,
    outputSchema: SubscriptionReminderOutputSchema,
  },
  async input => {
    const {output} = await subscriptionReminderPrompt(input);
    return output!;
  }
);
