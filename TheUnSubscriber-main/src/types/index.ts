export type Subscription = {
    id: string;
    name: string;
    cost: number;
    renewalDate: Date;
    deliveryMethod: 'email' | 'sms';
};

export type Currency = 'USD' | 'INR';

export type Reminder = {
    subscription: Subscription;
    message: string;
};
