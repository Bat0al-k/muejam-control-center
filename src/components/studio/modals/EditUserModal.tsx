"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ModalShell } from "./ModalShell";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiAlertCircle,
  FiArrowLeft,
  FiSave,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";
import type { StudioUser } from "@/features/studio/studio.service";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: StudioUser | null;
  onUserUpdated: (updatedUser: StudioUser) => void;
}

const AVAILABLE_ROLES = [
  { value: "admin", label: "Developer", description: "Full system & studio control" },
  { value: "sub_admin", label: "Admin", description: "Library review & management" },
  { value: "author", label: "Author", description: "Studio creator & author" },
  { value: "user", label: "Standard User", description: "Standard platform consumer" },
];

export function EditUserModal({
  isOpen,
  onClose,
  user,
  onUserUpdated,
}: EditUserModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("author");
  const [emailVerified, setEmailVerified] = useState(false);
  const [disabled, setDisabled] = useState(false);

  // Two-step confirmation flow: "form" -> "confirm"
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when selected user changes
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? "");
      setEmail(user.email ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
      setRole(user.role || user.defaultRole || "author");
      setEmailVerified(user.emailVerified ?? false);
      setDisabled(user.disabled ?? false);
      setStep("form");
      setError(null);
    }
  }, [user, isOpen]);

  // Compute detected changes for confirmation view
  const changes = useMemo(() => {
    if (!user) return [];
    const diffs: { field: string; from: string; to: string }[] = [];

    const normDisplayName = displayName.trim();
    if (normDisplayName !== user.displayName) {
      diffs.push({
        field: "Display Name",
        from: user.displayName || "—",
        to: normDisplayName || "Unnamed User",
      });
    }

    const normEmail = email.trim().toLowerCase();
    if (normEmail !== (user.email ?? "").toLowerCase()) {
      diffs.push({
        field: "Email Address",
        from: user.email || "—",
        to: normEmail || "—",
      });
    }

    const normPhone = phoneNumber.trim();
    if (normPhone !== (user.phoneNumber ?? "")) {
      diffs.push({
        field: "Phone Number",
        from: user.phoneNumber || "None",
        to: normPhone || "None",
      });
    }

    const currentRole = user.role || user.defaultRole || "author";
    if (role !== currentRole) {
      const fromLabel =
        AVAILABLE_ROLES.find((r) => r.value === currentRole)?.label || currentRole;
      const toLabel =
        AVAILABLE_ROLES.find((r) => r.value === role)?.label || role;
      diffs.push({
        field: "Role",
        from: fromLabel,
        to: toLabel,
      });
    }

    if (emailVerified !== user.emailVerified) {
      diffs.push({
        field: "Email Verification",
        from: user.emailVerified ? "Verified" : "Not Verified",
        to: emailVerified ? "Verified" : "Not Verified",
      });
    }

    if (disabled !== user.disabled) {
      diffs.push({
        field: "Account Status",
        from: user.disabled ? "Disabled" : "Active",
        to: disabled ? "Disabled" : "Active",
      });
    }

    return diffs;
  }, [user, displayName, email, phoneNumber, role, emailVerified, disabled]);

  if (!isOpen || !user) return null;

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError("Display name cannot be empty.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }

    if (changes.length === 0) {
      setError("No changes detected. Modify at least one field to save.");
      return;
    }

    setStep("confirm");
  };

  const handleSaveToDatabase = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/studio/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          displayName: displayName.trim(),
          email: email.trim().toLowerCase(),
          phoneNumber: phoneNumber.trim() || null,
          emailVerified,
          disabled,
          defaultRole: role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user in database.");
      }

      // Propagate updated user object to parent
      const updatedUser: StudioUser = {
        ...user,
        displayName: displayName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim() || null,
        emailVerified,
        disabled,
        role,
        defaultRole: role,
      };

      onUserUpdated(updatedUser);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={step === "form" ? "Edit Studio User" : "Confirm User Modification"}
      subtitle={
        step === "form"
          ? `Editing account settings for ${user.displayName}`
          : "Review and confirm changes before saving to database"
      }
      maxWidthClass="max-w-xl"
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

        {/* STEP 1: EDIT FORM */}
        {step === "form" && (
          <form onSubmit={handleProceedToConfirm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#374151] flex items-center gap-1.5">
                  <FiUser className="text-[#9CA3AF]" />
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Sarah Lin"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A] transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#374151] flex items-center gap-1.5">
                  <FiMail className="text-[#9CA3AF]" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#374151] flex items-center gap-1.5">
                  <FiPhone className="text-[#9CA3AF]" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A] transition-colors"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#374151] flex items-center gap-1.5">
                  <FiShield className="text-[#9CA3AF]" />
                  User Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D1D5DB] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E8785A] transition-colors"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label} ({r.value})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Toggles: Email Verified & Account Disabled */}
            <div className="p-3.5 bg-[#FAFAFB] border border-[#E5E7EB] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#111111]">
                    Email Verification
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
                    Grant verified status to this email
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailVerified(!emailVerified)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    emailVerified ? "bg-emerald-600" : "bg-[#D1D5DB]"
                  }`}
                  role="switch"
                  aria-checked={emailVerified}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      emailVerified ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="border-t border-[#F0F0F2] pt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#111111]">
                    Disable Account
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
                    Temporarily block user from logging into the platform
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDisabled(!disabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    disabled ? "bg-red-600" : "bg-[#D1D5DB]"
                  }`}
                  role="switch"
                  aria-checked={disabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      disabled ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F2]">
              <span className="text-[11px] text-[#6B7280]">
                {changes.length} change(s) pending review
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-xl text-xs font-semibold hover:bg-[#FAFAFB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E8785A] text-white rounded-xl text-xs font-semibold hover:bg-[#D46548] transition-colors shadow-xs"
                >
                  Review Changes
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: CONFIRMATION VIEW */}
        {step === "confirm" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <FiAlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">
                  Confirm Updates for {user.displayName}
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  You are about to modify this user account. The following
                  changes will be immediately written to the database:
                </p>
              </div>
            </div>

            {/* Summary diff card */}
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden divide-y divide-[#F0F0F2] text-xs">
              {changes.map((diff) => (
                <div
                  key={diff.field}
                  className="p-3 bg-white flex items-center justify-between gap-3"
                >
                  <span className="font-semibold text-[#111111]">
                    {diff.field}
                  </span>
                  <div className="flex items-center gap-2 text-right">
                    <span className="line-through text-[#9CA3AF]">
                      {diff.from}
                    </span>
                    <span className="text-[#6B7280]">→</span>
                    <span className="font-bold text-[#E8785A]">{diff.to}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#FAFAFB] rounded-xl border border-[#E5E7EB] flex items-center gap-2 text-[11px] text-[#6B7280]">
              <FiInfo className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              <span>User ID: <code className="font-mono text-[#111111]">{user.id}</code></span>
            </div>

            {/* Confirmation actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F0F0F2]">
              <button
                type="button"
                onClick={() => setStep("form")}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#D1D5DB] text-[#374151] rounded-xl text-xs font-semibold hover:bg-[#FAFAFB] disabled:opacity-50 transition-colors"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
                Back to Edit
              </button>

              <div className="flex items-center gap-2">
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
                  onClick={handleSaveToDatabase}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E8785A] text-white rounded-xl text-xs font-semibold hover:bg-[#D46548] disabled:opacity-50 transition-colors shadow-xs"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving to Database...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-3.5 h-3.5" />
                      Confirm &amp; Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}
