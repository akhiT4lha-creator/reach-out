// UK support services shown in the "Need help now?" panel.
// Keep these accurate. Check numbers before any public launch.

export type Helpline = {
  id: string;
  name: string;
  detail: string;
  action: string;
  href: string;
  urgent?: boolean;
};

export const helplines: Helpline[] = [
  {
    id: "999",
    name: "Emergency: 999",
    detail: "If you or someone else is in danger right now.",
    action: "Call 999",
    href: "tel:999",
    urgent: true,
  },
  {
    id: "111",
    name: "NHS 111",
    detail: "Choose the mental health option. Any time, day or night.",
    action: "Call 111",
    href: "tel:111",
  },
  {
    id: "childline",
    name: "Childline",
    detail: "Free and confidential, for anyone under 19.",
    action: "Call 0800 1111",
    href: "tel:08001111",
  },
  {
    id: "shout",
    name: "Shout",
    detail: "Text if you would rather not talk. Free, 24/7.",
    action: "Text SHOUT to 85258",
    href: "sms:85258?&body=SHOUT",
  },
  {
    id: "samaritans",
    name: "Samaritans",
    detail: "Someone to listen, whatever you are going through.",
    action: "Call 116 123",
    href: "tel:116123",
  },
];
