"use client";

import React, { useState } from "react";
import { ModalShell } from "./ModalShell";
import {
  FiAlertTriangle,
  FiTrash2,
  FiAlertCircle,
} from "react-icons/fi";
import type { StudioUser } from "@/features/studio/studio.service";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: StudioUser | null;
  onUserDeleted: (userId: string) => void;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  user,
  onUserDeleted,
}: DeleteUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/studio/users?id=${encodeURIComponent(user.id)}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete user from database.");
      }

      onUserDeleted(user.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error deleting user from database."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Studio User Account"
      subtitle="Immediate and permanent deletion from authentication database"
      maxWidthClass="max-w-md"
    >
      <div className="space-y-4">
        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 animate-fade-in"
          >
            <FiAlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
          <FiAlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">
              Are you sure you want to delete this user?
            </span>
            <p className="text-[11px] text-red-700 leading-relaxed">
              This action will permanently delete{" "}
              <strong>{user.displayName}</strong> from the database. All
              associated authentication records will be erased. This action
              cannot be undone.
            </p>
          </div>
        </div>

        {/* User preview card */}
        <div className="p-3.5 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1F2937] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-[#111111] block truncate">
                {user.displayName}
              </span>
              <span className="text-[11px] text-[#6B7280] block truncate">
                {user.email || "No email available"}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F0F0F2] flex items-center justify-between text-[11px]">
            <span className="text-[#6B7280]">Role:</span>
            <span className="font-semibold text-[#111111] capitalize">
              {user.role || user.defaultRole || "author"}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#6B7280]">User ID:</span>
            <code className="font-mono text-[#374151] text-[10px]">
              {user.id}
            </code>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0F0F2]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-xl text-xs font-semibold hover:bg-[#FAFAFB] disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting from Database...
              </>
            ) : (
              <>
                <FiTrash2 className="w-3.5 h-3.5" />
                Confirm &amp; Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
