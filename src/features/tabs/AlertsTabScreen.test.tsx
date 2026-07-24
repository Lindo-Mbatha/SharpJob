import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AlertNotification } from "../alerts/types";
import { Job } from "../listings/types";
import { AlertsTabScreen } from "./AlertsTabScreen";
import { AlertsFilter } from "../app/types/domain";

const jobs: Job[] = [];
const seedNotifications: AlertNotification[] = [
  {
    id: "n1",
    title: "Unread Match",
    desc: "You have a new match",
    time: "now",
    read: false,
    kind: "match"
  },
  {
    id: "n2",
    title: "Read Update",
    desc: "Already read",
    time: "1h",
    read: true,
    kind: "system"
  }
];

function Harness() {
  const [notifications, setNotifications] = useState<AlertNotification[]>(seedNotifications);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [alertsFilter, setAlertsFilter] = useState<AlertsFilter>("all");

  return (
    <AlertsTabScreen
      darkMode={false}
      activeAccentText="text-blue-600"
      activeAccentPrimary="bg-blue-600"
      notifications={notifications}
      selectedNotificationId={selectedNotificationId}
      alertsFilter={alertsFilter}
      jobs={jobs}
      setSelectedNotificationId={setSelectedNotificationId}
      setAlertsFilter={setAlertsFilter}
      setNotifications={setNotifications}
      setSelectedJob={vi.fn() as React.Dispatch<React.SetStateAction<Job | null>>}
      triggerNotification={vi.fn()}
    />
  );
}

describe("AlertsTabScreen", () => {
  it("filters unread notifications and opens detail view", () => {
    render(<Harness />);

    expect(screen.getByText("Unread Match")).toBeInTheDocument();
    expect(screen.getByText("Read Update")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^unread\s+1$/i }));

    expect(screen.getByText("Unread Match")).toBeInTheDocument();
    expect(screen.queryByText("Read Update")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Unread Match/i }));

    expect(screen.getByText("Message")).toBeInTheDocument();
    expect(screen.getByText("You have a new match")).toBeInTheDocument();
  });
});
