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
  type LucideIcon,
} from "lucide-react";
import type { EventCategory } from "types";

export const CATEGORY_ICON_MAP: Record<EventCategory, LucideIcon> = {
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

interface CategoryIconProps {
  value: EventCategory;
  size?: number;
  [key: string]: unknown;
}

export function CategoryIcon({ value, size = 14, ...props }: CategoryIconProps) {
  const Icon = CATEGORY_ICON_MAP[value];
  if (!Icon) return null;
  return <Icon size={size} {...props} />;
}
