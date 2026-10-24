"use client";

import { useState } from "react";
import { LuSave, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const categories = [
  "Beach",
  "Mountain",
  "City",
  "Adventure",
  "Cultural",
  "Wildlife",
  "Cruise",
  "Honeymoon",
];

export type DestinationData = {
  id: string;
  destinationName: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

const inputClasses =
  "h-10 rounded-[4px] border-0 bg-gray-100 px-4 text-sm shadow-none";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: DestinationData;
};

export function EditPackageDialog({ open, onOpenChange, destination }: Props) {

  const router = useRouter()
  const [saving, setSaving] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const apiUrl = process.env.NEXT_PUBLIC_SERVER;
    if (!apiUrl) {
      toast.error("Server URL is missing!");
      return;
    }

    const form = new FormData(event.currentTarget);
    const payload = {
      destinationName: String(form.get("destinationName") ?? ""),
      country: String(form.get("country") ?? ""),
      category: String(form.get("category") ?? ""),
      price: String(form.get("price") ?? ""),
      duration: String(form.get("duration") ?? ""),
      departureDate: String(form.get("departureDate") ?? ""),
      imageUrl: String(form.get("imageUrl") ?? ""),
      description: String(form.get("description") ?? ""),
    };

    setSaving(true);

    void (async () => {
      try {
        const res = await fetch(`${apiUrl}/place/${destination.id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});


        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Update failed (${res.status}): ${errorText}`);
        }

        toast.success("Travel package updated successfully!");
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to update travel package:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update the package."
        );
      } finally {
        setSaving(false);
      }
    })();


    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-5 rounded-lg p-6">
        <form key={String(open)} onSubmit={handleSubmit} className="grid gap-5">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-lg font-medium text-gray-900">
              Update Travel Package
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Make changes to the travel package details below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              name="destinationName"
              required
              defaultValue={destination.destinationName}
              placeholder="Bali Paradise"
              aria-label="Destination Name"
              className={inputClasses}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="editCountry"
                  className="mb-1.5 block text-sm font-medium text-gray-900"
                >
                  Country
                </label>
                <Input
                  id="editCountry"
                  name="country"
                  required
                  defaultValue={destination.country}
                  placeholder="Indonesia"
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="editCategory"
                  className="mb-1.5 block text-sm font-medium text-gray-900"
                >
                  Category
                </label>
                <Select name="category" defaultValue={destination.category}>
                  <SelectTrigger className="h-10! w-full rounded-[4px]! border-0! bg-gray-100! px-4! text-sm! shadow-none! hover:bg-gray-100!">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="editPrice"
                  className="mb-1.5 block text-sm font-medium text-gray-900"
                >
                  Price (USD)
                </label>
                <Input
                  id="editPrice"
                  name="price"
                  required
                  type="number"
                  min="0"
                  defaultValue={destination.price}
                  placeholder="e.g., 1299"
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor="editDuration"
                  className="mb-1.5 block text-sm font-medium text-gray-900"
                >
                  Duration
                </label>
                <Input
                  id="editDuration"
                  name="duration"
                  required
                  defaultValue={destination.duration}
                  placeholder="e.g., 7 Days/6 Nights"
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="editDepartureDate"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Departure Date
              </label>
              <Input
                id="editDepartureDate"
                name="departureDate"
                required
                type="date"
                defaultValue={destination.departureDate}
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="editImageUrl"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Image URL
              </label>
              <Input
                id="editImageUrl"
                name="imageUrl"
                required
                type="url"
                defaultValue={destination.imageUrl}
                placeholder="https://example.com/image.jpg"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="editDescription"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <Textarea
                id="editDescription"
                name="description"
                required
                rows={4}
                defaultValue={destination.description}
                placeholder="Describe the travel experience..."
                className="field-sizing-fixed min-h-24 rounded-[4px] border-0 bg-gray-100 px-4 py-3 text-sm shadow-none"
              />
            </div>
          </div>

          <DialogFooter className="border-0 bg-transparent pt-2">
            <DialogClose
              className="flex h-9 items-center gap-2 rounded-md border border-red-300 bg-white px-4 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
              render={<Button type="button" variant="outline" />}
            >
              <LuTrash2 className="size-3.5" />
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={saving}
              className="h-9 gap-2 rounded-md bg-brand px-5 text-xs font-medium text-white hover:bg-brand/90"
            >
              <LuSave className="size-3.5" />
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
