"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  LuCamera,
  LuGlobe,
  LuMapPin,
  LuPencilLine,
  LuPlane,
  LuSquareArrowUpRight,
  LuCircleDollarSign,
} from "react-icons/lu";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Profile = {
  name: string;
  location: string;
  nationality: string;
  memberSince: string;
  photoUrl: string;
};

const defaultProfile: Profile = {
  name: "Sarah Mitchell",
  location: "San Francisco, CA",
  nationality: "United States",
  memberSince: "Mar 2024",
  photoUrl: "/images/person2.png",
};

const inputClasses =
  "h-10 rounded-[4px] border-0 bg-gray-100 px-4 text-sm shadow-none";

const stats = [
  { label: "Total Bookings", value: "12", icon: LuPlane, iconBg: "bg-sky-100", iconColor: "text-sky-500" },
  { label: "Countries Visited", value: "18", icon: LuGlobe, iconBg: "bg-emerald-100", iconColor: "text-emerald-500" },
  { label: "Upcoming Trips", value: "2", icon: LuSquareArrowUpRight, iconBg: "bg-orange-100", iconColor: "text-orange-500" },
  { label: "Total Spent", value: "$15,750", icon: LuCircleDollarSign, iconBg: "bg-pink-100", iconColor: "text-pink-500" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem("profile");
        if (raw) setProfile({ ...defaultProfile, ...JSON.parse(raw) });
      } catch {
        setProfile(defaultProfile);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Profile = {
      name: String(form.get("name") ?? ""),
      location: String(form.get("location") ?? ""),
      nationality: String(form.get("nationality") ?? ""),
      memberSince: String(form.get("memberSince") ?? ""),
      photoUrl: String(form.get("photoUrl") ?? ""),
    };

    if (!next.name || !next.photoUrl) {
      toast.error("Name and photo are required.");
      return;
    }

    try {
      localStorage.setItem("profile", JSON.stringify(next));
      setProfile(next);
      setEditOpen(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  }

  return (
    <div className="bg-white px-6 pt-10 pb-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl text-gray-900">My Profile</h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your account settings and travel preferences
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit border border-gray-200 bg-white p-6 text-center">
            <div className="relative mx-auto h-28 w-28">
              <Image
                src={profile.photoUrl || "/images/person2.png"}
                alt={profile.name}
                width={112}
                height={112}
                unoptimized
                className="size-28 rounded-full object-cover"
              />
              <span className="absolute right-0 bottom-0 grid size-7 place-items-center rounded-full border-2 border-white bg-brand text-white">
                <LuCamera className="size-3.5" />
              </span>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              {profile.name}
            </h2>
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-500">
              <LuMapPin className="size-3.5" />
              {profile.location}
            </p>

            <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-100">
              <div className="flex items-center justify-between py-3">
                <dt className="text-xs text-gray-500">Member since</dt>
                <dd className="text-sm font-semibold text-gray-900">
                  {profile.memberSince}
                </dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-xs text-gray-500">Nationality</dt>
                <dd className="text-sm font-semibold text-gray-900">
                  {profile.nationality}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand/90"
            >
              <LuPencilLine className="size-4" />
              Edit Profile
            </button>
          </aside>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              Travel Statistics
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between border border-gray-200 bg-white p-5"
                >
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <span
                    className={`grid size-10 place-items-center rounded-full ${stat.iconBg} ${stat.iconColor}`}
                  >
                    <stat.icon className="size-5" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md rounded-lg p-6">
          <form key={String(editOpen)} onSubmit={handleSave} className="grid gap-4">
            <DialogHeader className="gap-1">
              <DialogTitle className="text-lg font-medium text-gray-900">
                Edit Profile
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Update your account details below
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="profileName"
                  className="mb-1.5 block text-sm font-medium text-gray-900"
                >
                  Full Name
                </label>
                <Input
                  id="profileName"
                  name="name"
                  required
                  defaultValue={profile.name}
                  className={inputClasses}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profileLocation"
                    className="mb-1.5 block text-sm font-medium text-gray-900"
                  >
                    Location
                  </label>
                  <Input
                    id="profileLocation"
                    name="location"
                    defaultValue={profile.location}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label
                    htmlFor="profileNationality"
                    className="mb-1.5 block text-sm font-medium text-gray-900"
                  >
                    Nationality
                  </label>
                  <Input
                    id="profileNationality"
                    name="nationality"
                    defaultValue={profile.nationality}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profileMemberSince"
                    className="mb-1.5 block text-sm font-medium text-gray-900"
                  >
                    Member Since
                  </label>
                  <Input
                    id="profileMemberSince"
                    name="memberSince"
                    defaultValue={profile.memberSince}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label
                    htmlFor="profilePhoto"
                    className="mb-1.5 block text-sm font-medium text-gray-900"
                  >
                    Photo URL
                  </label>
                  <Input
                    id="profilePhoto"
                    name="photoUrl"
                    required
                    defaultValue={profile.photoUrl}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="border-0 bg-transparent pt-1">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="h-9 rounded-md border border-gray-200 px-5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <Button
                type="submit"
                className="h-9 gap-2 rounded-md bg-brand px-5 text-xs font-medium text-white hover:bg-brand/90"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
