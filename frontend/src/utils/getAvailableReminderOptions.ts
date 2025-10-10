import dayjs from "dayjs";

export const getAvailableReminderOptions = (
  dueDate: string,
  dueTime: string,
  userTimezone: string
) => {
  if (!dueDate) return [];

  const now = dayjs().tz(userTimezone);
  const dueDateTimeString = `${dueDate}T${dueTime || "00:00"}`;
  const dueDateTime = dayjs.tz(dueDateTimeString, userTimezone);

  const allReminderOptions = [
    { value: "no_reminder", label: "No reminder", icon: "🚫" },
    { value: "1_minute", label: "1 minute before", icon: "⏰" },
    { value: "5_minutes", label: "5 minutes before", icon: "⏰" },
    { value: "15_minutes", label: "15 minutes before", icon: "⏰" },
    { value: "1_hour", label: "1 hour before", icon: "🕐" },
    { value: "1_day", label: "1 day before", icon: "📅" },
  ];

  const availableOptions = [allReminderOptions[0]];

  const timeBasedOptions = [
    { option: allReminderOptions[1], minutes: 1 },
    { option: allReminderOptions[2], minutes: 5 },
    { option: allReminderOptions[3], minutes: 15 },
    { option: allReminderOptions[4], minutes: 60 },
    { option: allReminderOptions[5], minutes: 1440 },
  ];

  timeBasedOptions.forEach(({ option, minutes }) => {
    const reminderTime = dueDateTime.subtract(minutes, "minute");
    if (reminderTime.isAfter(now)) {
      availableOptions.push(option);
    }
  });

  return availableOptions;
};


