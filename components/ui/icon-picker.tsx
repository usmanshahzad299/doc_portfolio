"use client";

import {
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Pill,
  Syringe,
  Baby,
  Brain,
  Bone,
  Eye,
  Thermometer,
  Activity,
  Microscope,
  UserRound,
  Users,
  Ambulance,
  Cross,
  ClipboardPlus,
  TestTube,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Pill,
  Syringe,
  Baby,
  Brain,
  Bone,
  Eye,
  Thermometer,
  Activity,
  Microscope,
  UserRound,
  Users,
  Ambulance,
  Cross,
  ClipboardPlus,
  TestTube,
};

type IconPickerProps = {
  value: string;
  onChange: (iconName: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2 rounded-md border border-gray-200 p-3">
      {Object.entries(SERVICE_ICONS).map(([name, Icon]) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          className={`flex items-center justify-center rounded-lg border p-3 transition-colors ${
            value === name
              ? "border-blue-600 bg-blue-50 text-blue-600"
              : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
          }`}
          title={name}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
}

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = SERVICE_ICONS[name] ?? Stethoscope;
  return <Icon className={className} />;
}
