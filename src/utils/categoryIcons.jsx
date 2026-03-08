import {
  Wrench,
  ShoppingBag,
  BookOpen,
  Presentation,
  Coffee,
  Dumbbell,
  Palette,
  Home,
  HeartHandshake,
  Tag,
} from "lucide-react";

export const CATEGORY_ICON_MAP = {
  workshop: Wrench,
  fair: ShoppingBag,
  seminar: BookOpen,
  conference: Presentation,
  meetup: Coffee,
  sports: Dumbbell,
  cultural: Palette,
  community: Home,
  charity: HeartHandshake,
  other: Tag,
};

export function CategoryIcon({ value, size = 14, ...props }) {
  const Icon = CATEGORY_ICON_MAP[value];
  if (!Icon) return null;
  return <Icon size={size} {...props} />;
}
