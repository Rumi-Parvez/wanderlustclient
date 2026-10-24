"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuPencil, LuTrash2, LuTriangleAlert, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  EditPackageDialog,
  type DestinationData,
} from "@/components/edit-package-dialog";

type DetailsActionsProps = { destination: DestinationData };

export function DetailsActions({ destination }: DetailsActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeletePackage() {
    const apiUrl = process.env.NEXT_PUBLIC_SERVER;
    if (!apiUrl) {
      toast.error("Server URL is missing!");
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`${apiUrl}/place/${destination.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Delete failed (${res.status}): ${errorText}`);
      }

      toast.success("Travel package deleted successfully!");
      setOpen(false);
      router.push("/all-destinations");
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
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setEditOpen(true)}
        className="flex h-9 items-center gap-2 rounded-md bg-gray-900 px-4 text-xs font-medium text-white transition-colors hover:bg-gray-700"
      >
        <LuPencil className="size-3.5" />
        Edit
      </button>

      <EditPackageDialog
        open={editOpen}
        onOpenChange={(next) => setEditOpen(next)}
        destination={destination}
      />

      <AlertDialog open={open} onOpenChange={(next) => setOpen(next)}>
        <AlertDialogTrigger className="flex h-9 items-center gap-2 rounded-md border border-red-300 bg-white px-4 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">
          <LuTrash2 className="size-3.5" />
          Cancel
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-md rounded-lg p-6">
          <AlertDialogCancel className="absolute top-3 right-3 grid size-7 place-items-center rounded-md p-0 border-0 bg-transparent hover:bg-gray-100">
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
                &quot;{destination.destinationName}&quot;
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
              onClick={() => void handleDeletePackage()}
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
