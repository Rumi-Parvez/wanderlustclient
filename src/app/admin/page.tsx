"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LuCalendarFold,
  LuMapPin,
  LuPencil,
  LuPlus,
  LuTrash2,
  LuTriangleAlert,
  LuX,
} from "react-icons/lu";
import { toast } from "react-toastify";
import {
  EditPackageDialog,
  type DestinationData,
} from "@/components/edit-package-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Package = {
  _id?: string;
  destinationName?: string;
  country?: string;
  category?: string;
  price?: string;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
};

function toDestinationData(item: Package): DestinationData {
  return {
    id: item._id ?? "",
    destinationName: item.destinationName ?? "",
    country: item.country ?? "",
    category: item.category ?? "Beach",
    price: item.price ?? "",
    duration: item.duration ?? "",
    departureDate: item.departureDate ?? "",
    imageUrl: item.imageUrl ?? "",
    description: item.description ?? "",
  };
}

export default function AdminPage() {
  const [packages, setPackages] = useState<Package[] | null>(null);
  const [editTarget, setEditTarget] = useState<Package | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Package | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    void (async () => {
      const apiUrl = process.env.NEXT_PUBLIC_SERVER;
      if (!apiUrl) {
        toast.error("Server URL is missing!");
        setPackages([]);
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/place`, { cache: "no-store" });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `Failed to load packages (${res.status}): ${errorText}`
          );
        }
        const data = await res.json();
        setPackages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load travel packages:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load packages."
        );
        setPackages([]);
      }
    })();
  }, []);

  async function handleDelete() {
    const apiUrl = process.env.NEXT_PUBLIC_SERVER;
    if (!apiUrl || !deleteTarget?._id) return;

    setDeleting(true);

    try {
      const res = await fetch(`${apiUrl}/place/${deleteTarget._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Delete failed (${res.status}): ${errorText}`);
      }

      const deletedId = deleteTarget._id;
      setPackages((prev) => prev?.filter((p) => p._id !== deletedId) ?? []);
      toast.success("Travel package deleted successfully!");
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete travel package:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete package."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white px-6 pt-10 pb-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {packages
                ? `Manage all ${packages.length} travel packages — add, edit or remove`
                : "Manage all travel packages — add, edit or remove"}
            </p>
          </div>
          <Link
            href="/add-new-travels"
            className="flex h-10 items-center gap-2 rounded-md bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
          >
            <LuPlus className="size-4" />
            Add New Travel
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          {packages === null && (
            <div className="border border-gray-200 bg-gray-50 py-16 text-center text-sm text-gray-500">
              Loading travel packages…
            </div>
          )}

          {packages?.length === 0 && (
            <div className="border border-gray-200 bg-gray-50 py-16 text-center text-sm text-gray-500">
              No travel packages yet.{" "}
              <Link
                href="/add-new-travels"
                className="font-medium text-brand hover:underline"
              >
                Add the first one
              </Link>
            </div>
          )}

          {packages?.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-5 border border-gray-200 bg-white p-4 max-md:flex-col md:pl-4"
            >
              <div className="relative h-28 w-48 shrink-0 max-md:w-full">
                <Image
                  src={item.imageUrl || "/images/CTA.png"}
                  alt={item.destinationName || "Travel package"}
                  fill
                  sizes="192px"
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
                  {item.category || "—"}
                </span>
                <h3 className="mt-1.5 text-lg font-semibold text-gray-900">
                  {item.destinationName || "Untitled package"}
                </h3>
                <p className="mt-1.5 flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <LuMapPin className="size-3.5" />
                    {item.country || "—"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <LuCalendarFold className="size-3.5" />
                    {item.duration || "—"}
                  </span>
                </p>
                <p className="mt-2 text-xl font-bold text-gray-900">
                  ${item.price || "0"}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 max-md:w-full md:self-start">
                <button
                  type="button"
                  onClick={() => setEditTarget(item)}
                  className="flex h-8 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-xs font-medium text-gray-800 transition-colors hover:bg-gray-50"
                >
                  <LuPencil className="size-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  className="flex h-8 items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  <LuTrash2 className="size-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editTarget && (
        <EditPackageDialog
          open={!!editTarget}
          onOpenChange={(open) => {
            if (!open) setEditTarget(null);
          }}
          destination={toDestinationData(editTarget)}
          onUpdated={() => {
            void (async () => {
              const apiUrl = process.env.NEXT_PUBLIC_SERVER;
              if (!apiUrl) return;
              try {
                const res = await fetch(`${apiUrl}/place`, {
                  cache: "no-store",
                });
                if (!res.ok) return;
                const data = await res.json();
                setPackages(Array.isArray(data) ? data : []);
              } catch {
                // keep current list on refetch failure
              }
            })();
          }}
        />
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="max-w-md rounded-lg p-6">
          <AlertDialogCancel className="absolute top-3 right-3 grid size-7 place-items-center rounded-md border-0 bg-transparent p-0 hover:bg-gray-100">
            <LuX className="size-4 text-gray-400" />
          </AlertDialogCancel>

          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-50 text-red-500">
              <LuTriangleAlert />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete Travel Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                &quot;{deleteTarget?.destinationName ?? "this package"}&quot;
              </span>
              ? This action cannot be undone and will permanently remove this
              travel package from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="border-0 bg-transparent pt-2">
            <AlertDialogCancel className="h-9 rounded-md px-5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleDelete()}
              disabled={deleting}
              className="h-9 gap-2 rounded-md bg-red-500 text-white hover:bg-red-600"
            >
              <LuTrash2 className="size-4" />
              Delete Package
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
