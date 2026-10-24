"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LuSave, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";

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

const initialForm = {
  destinationName: "",
  country: "",
  category: "Beach",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
};

const inputClasses =
  "h-10 rounded-[4px] border-0 bg-gray-100 px-4 text-sm shadow-none";

export default function AddNewTravelsPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update(
    key: keyof typeof initialForm,
    value: string
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSubmitted(false);
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    const API_URL = process.env.NEXT_PUBLIC_SERVER;

    if (!API_URL) {
      toast.error("Server URL is missing!");
      console.error(
        "Please define NEXT_PUBLIC_SERVER in .env.local"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorText = await res.text();

        throw new Error(
          `Request failed (${res.status}): ${errorText}`
        );
      }

      await res.json();

      // Save locally only after the API request succeeds.
      const existing = JSON.parse(
        localStorage.getItem("travelPackages") ?? "[]"
      );

      localStorage.setItem(
        "travelPackages",
        JSON.stringify([...existing, form])
      );


      setSubmitted(true);
      setForm({ ...initialForm });
      toast.success("Travel package added successfully!");
    } catch (error) {
      console.error("Failed to add travel package:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add travel package!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white px-6 pt-10 pb-16 md:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-4xl text-gray-900">
          Add New Travel Package
        </h1>

        <form
          noValidate
          className="mx-auto mt-10 max-w-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
          onSubmit={handleSubmit}
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="destinationName"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Destination Name
              </label>

              <Input
                id="destinationName"
                required
                value={form.destinationName}
                onChange={(e) =>
                  update("destinationName", e.target.value)
                }
                placeholder="Bali Paradise"
                className={inputClasses}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="country"
                  className="mb-1.5 block text-sm font-medium text-gray-900"
                >
                  Country
                </label>

                <Input
                  id="country"
                  required
                  value={form.country}
                  onChange={(e) =>
                    update("country", e.target.value)
                  }
                  placeholder="Indonesia"
                  className={inputClasses}
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm font-medium text-gray-900"
                >
                  Category
                </label>

                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    value !== null && update("category", value)
                  }
                >
                  <SelectTrigger
                    id="category"
                    className="h-10! w-full rounded-[4px]! border-0! bg-gray-100! px-4! text-sm! shadow-none! hover:bg-gray-100!"
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-1.5 block text-sm font-medium text-gray-900"
                >
                  Price (USD)
                </label>

                <Input
                  id="price"
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    update("price", e.target.value)
                  }
                  placeholder="e.g., 1299"
                  className={inputClasses}
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="mb-1.5 block text-sm font-medium text-gray-900"
                >
                  Duration
                </label>

                <Input
                  id="duration"
                  required
                  value={form.duration}
                  onChange={(e) =>
                    update("duration", e.target.value)
                  }
                  placeholder="e.g., 7 Days/6 Nights"
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="departureDate"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Departure Date
              </label>

              <Input
                id="departureDate"
                required
                type="date"
                value={form.departureDate}
                onChange={(e) =>
                  update("departureDate", e.target.value)
                }
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Image URL
              </label>

              <Input
                id="imageUrl"
                required
                type="url"
                value={form.imageUrl}
                onChange={(e) =>
                  update("imageUrl", e.target.value)
                }
                placeholder="https://example.com/image.jpg"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Description
              </label>

              <Textarea
                id="description"
                required
                rows={5}
                value={form.description}
                onChange={(e) =>
                  update("description", e.target.value)
                }
                placeholder="Describe the travel experience..."
                className="min-h-28 field-sizing-fixed rounded-[4px] border-0 bg-gray-100 px-4 py-3 text-sm shadow-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              {submitted && (
                <p className="mr-auto text-sm text-emerald-600">
                  Travel package added successfully!
                </p>
              )}

              <Button
                type="button"
                size="lg"
                disabled={isSubmitting}
                onClick={() => {
                  setForm({ ...initialForm });
                  setSubmitted(false);
                }}
                className="h-10 gap-2 rounded-md border-red-300 px-5 text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                variant="outline"
              >
                <LuTrash2 className="size-4" />
                Cancel
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-10 gap-2 rounded-md bg-blue-500 px-5 text-white hover:bg-blue-700/80 cursor-pointer"
              >
                <LuSave className="size-4" />
                {isSubmitting
                  ? "Adding..."
                  : "Add Travel Package"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}