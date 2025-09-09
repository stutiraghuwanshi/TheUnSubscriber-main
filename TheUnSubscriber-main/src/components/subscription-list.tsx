"use client";

import { format } from "date-fns";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import type { Subscription, Currency } from "@/types";
import { getSubscriptionIcon } from "./icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  currency: Currency;
  exchangeRate: number;
}

export function SubscriptionList({
  subscriptions,
  onEdit,
  onDelete,
  isLoading,
  currency,
  exchangeRate,
}: SubscriptionListProps) {

  const sortedSubscriptions = [...subscriptions].sort((a,b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());

  const renderSkeleton = () => (
    [...Array(3)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-6 w-6 rounded-full" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Monthly Cost</TableHead>
              <TableHead>Next Renewal</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              renderSkeleton()
            ) : sortedSubscriptions.length > 0 ? (
              sortedSubscriptions.map((subscription) => {
                const Icon = getSubscriptionIcon(subscription.name);
                return (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">
                      {subscription.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(subscription.cost, currency, exchangeRate)}
                    </TableCell>
                    <TableCell>{format(new Date(subscription.renewalDate), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(subscription)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(subscription.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No subscriptions found. Add one to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
