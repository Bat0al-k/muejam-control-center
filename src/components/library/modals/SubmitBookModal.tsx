"use client";

import React, { useState, useRef } from "react";
import { useLibrary } from "@/features/library/context";
import { LibraryModalShell } from "./LibraryModalShell";
import {
  FiX,
  FiUploadCloud,
  FiUser,
  FiChevronDown,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiFileText,
  FiShield,
  FiTag,
  FiTrash2,
} from "react-icons/fi";

type WizardStep = 1 | 2 | 3 | 4;

export function SubmitBookModal() {
  const { activeModal, closeModal, createSubmission, showToast } = useLibrary();

  const [step, setStep] = useState<WizardStep>(1);

  // Step 1: Information
  const [title, setTitle] = useState("The Silent Garden");
  const [description, setDescription] = useState(
    "A gripping psychological thriller unravelling secrets buried beneath the estate's forgotten grounds."
  );
  const [category, setCategory] = useState("Fiction - Thriller");
  const [authorName, setAuthorName] = useState("Jane Doe (Auto-filled)");
  const [tags, setTags] = useState<string[]>(["Mystery", "Suspense"]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverFileName, setCoverFileName] = useState<string | null>(null);
  const [isDraggingCover, setIsDraggingCover] = useState(false);

  // Step 2: File Upload
  const [manuscriptFile, setManuscriptFile] = useState<string | null>(
    "The_Silent_Garden_v1.0.pdf"
  );
  const [manuscriptSize, setManuscriptSize] = useState("18.4 MB");
  const [isbn, setIsbn] = useState("978-0-19-852663");
  const [pages, setPages] = useState("384");
  const [enableDrm, setEnableDrm] = useState(true);

  // File input refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const manuscriptInputRef = useRef<HTMLInputElement>(null);

  const isOpen = activeModal?.type === "submitBook";

  if (!isOpen) return null;

  // Tag management
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^,+|,+$/g, "");
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Cover image handlers
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCover(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setCoverFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Manuscript handlers
  const handleManuscriptSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setManuscriptFile(file.name);
      setManuscriptSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      showToast("info", `Uploaded manuscript: ${file.name}`);
    }
  };

  // Form submission
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim()) {
      showToast("error", "Please provide a valid publication title and author.");
      setStep(1);
      return;
    }

    createSubmission({
      title,
      authorName,
      authorEmail: "jane.doe@publishing-house.com",
      isbn,
      pages,
      category,
      description,
      tags,
      coverImage: coverImage || undefined,
      manuscriptFile: manuscriptFile || "Manuscript_v1.pdf",
    });

    closeModal();
  };

  const stepsList = [
    { num: 1, label: "Information" },
    { num: 2, label: "File Upload" },
    { num: 3, label: "Preview" },
    { num: 4, label: "Submit" },
  ];

  return (
    <LibraryModalShell
      isOpen={isOpen}
      onClose={closeModal}
      hideDefaultHeader={true}
      maxWidthClass="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Top Header & Close button */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-[#111111] tracking-tight">
              Upload New Publication
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280]">
              Provide the essential metadata to begin the publishing process.
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="p-2 rounded-xl text-[#6B7280] hover:text-[#111111] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Wizard Stepper */}
        <div className="relative py-2">
          {/* Connecting line */}
          <div className="absolute top-5 left-10 right-10 h-0.5 bg-[#E5E7EB] -z-0" />

          <div className="flex items-center justify-between relative z-10">
            {stepsList.map((s) => {
              const isActive = step === s.num;
              const isPast = step > s.num;

              return (
                <div
                  key={s.num}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => setStep(s.num as WizardStep)}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${isActive
                        ? "bg-[#2520B8] text-white ring-4 ring-[#2520B8]/15"
                        : isPast
                          ? "bg-[#EAFBF1] text-[#065F46] border border-[#A7F3D0]"
                          : "bg-[#F3F4F6] text-[#64748B] border border-[#E2E8F0]"
                      }`}
                  >
                    {isPast ? <FiCheck className="w-4 h-4 text-[#0ea472]" /> : s.num}
                  </div>

                  <span
                    className={`text-[11px] sm:text-xs font-semibold mt-2 transition-colors ${isActive
                        ? "text-[#2520B8] font-bold"
                        : isPast
                          ? "text-[#111111]"
                          : "text-[#64748B]"
                      }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: INFORMATION */}
        {step === 1 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (Metadata Fields) */}
              <div className="lg:col-span-7 space-y-4">
                {/* Book Title */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#111111] mb-1.5">
                    Book Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="The Silent Garden"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D1D5DB] focus:border-[#2520B8] focus:ring-2 focus:ring-[#2520B8]/10 rounded-xl text-xs sm:text-sm text-[#111111] placeholder:text-[#9CA3AF] transition-all outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#111111] mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a compelling synopsis..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D1D5DB] focus:border-[#2520B8] focus:ring-2 focus:ring-[#2520B8]/10 rounded-xl text-xs sm:text-sm text-[#111111] placeholder:text-[#9CA3AF] transition-all outline-none resize-none"
                  />
                </div>

                {/* Two Column: Category & Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#111111] mb-1.5">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 bg-white border border-[#D1D5DB] focus:border-[#2520B8] focus:ring-2 focus:ring-[#2520B8]/10 rounded-xl text-xs sm:text-sm text-[#111111] pr-9 transition-all outline-none cursor-pointer"
                      >
                        <option value="Fiction - Thriller">Fiction - Thriller</option>
                        <option value="Fiction - Mystery">Fiction - Mystery</option>
                        <option value="Fiction - Sci-Fi">Fiction - Sci-Fi</option>
                        <option value="Technical / AI">Technical / AI</option>
                        <option value="Fintech">Fintech</option>
                        <option value="Design Systems">Design Systems</option>
                        <option value="Data Science">Data Science</option>
                      </select>
                      <FiChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#111111] mb-1.5">
                      Author
                    </label>
                    <div className="relative flex items-center">
                      <FiUser className="w-4 h-4 text-[#6B7280] absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Jane Doe (Auto-filled)"
                        disabled
                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF8F5]/80 border border-[#D1D5DB] focus:border-[#2520B8] focus:bg-white rounded-xl text-xs sm:text-sm text-[#111111] transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags Pill Container */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#111111] mb-1.5">
                    Tags
                  </label>
                  <div className="w-full min-h-[46px] px-3 py-2 bg-white border border-[#D1D5DB] focus-within:border-[#2520B8] focus-within:ring-2 focus-within:ring-[#2520B8]/10 rounded-xl flex flex-wrap items-center gap-1.5 transition-all">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[#1E293B] border border-[#E2E8F0] text-xs font-semibold"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600 transition-colors cursor-pointer"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder={tags.length === 0 ? "Add a tag (press Enter)..." : "Add a tag..."}
                      className="flex-1 min-w-[100px] text-xs sm:text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none bg-transparent"
                    />
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mt-1">
                    Press Enter or comma to add tags (e.g. Mystery, Thriller, AI).
                  </p>
                </div>
              </div>

              {/* Right Column (Cover Image Dropzone) */}
              <div className="lg:col-span-5 flex flex-col">
                <label className="block text-xs sm:text-sm font-semibold text-[#111111] mb-1.5">
                  Cover Image
                </label>

                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={handleCoverSelect}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingCover(true);
                  }}
                  onDragLeave={() => setIsDraggingCover(false)}
                  onDrop={handleCoverDrop}
                  onClick={() => coverInputRef.current?.click()}
                  className={`flex-1 min-h-[300px] rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden group ${isDraggingCover
                      ? "border-[#2520B8] bg-[#EEF2FF]"
                      : "border-[#CBD5E1] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] hover:border-[#94A3B8]"
                    }`}
                >
                  {coverImage ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
                      <img
                        src={coverImage}
                        alt="Cover Preview"
                        className="max-h-[220px] rounded-xl object-contain shadow-md mb-3"
                      />
                      <p className="text-xs font-semibold text-[#111111] truncate max-w-[200px]">
                        {coverFileName || "Custom Cover Image"}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoverImage(null);
                          setCoverFileName(null);
                        }}
                        className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        <span>Remove image</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#EDE9FE] text-[#4F46E5] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        <FiUploadCloud className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm text-[#374151]">
                          <span className="font-bold text-[#2520B8] hover:underline">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-[11px] text-[#9CA3AF]">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FILE UPLOAD */}
        {step === 2 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold font-syne text-[#111111]">
                Manuscript &amp; Document Files
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Upload your publication package (.pdf, .epub) and verify ISBN indexing.
              </p>
            </div>

            <input
              type="file"
              ref={manuscriptInputRef}
              onChange={handleManuscriptSelect}
              accept=".pdf,.epub,.docx"
              className="hidden"
            />

            <div
              onClick={() => manuscriptInputRef.current?.click()}
              className="border-2 border-dashed border-[#CBD5E1] hover:border-[#2520B8] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center mb-3">
                <FiFileText className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm text-[#374151]">
                <span className="font-bold text-[#2520B8] hover:underline">
                  Click to select manuscript file
                </span>{" "}
                or drag &amp; drop
              </p>
              <p className="text-[11px] text-[#9CA3AF] mt-1">
                Supported: PDF, EPUB, DOCX (Max 100MB)
              </p>

              {manuscriptFile && (
                <div className="mt-4 px-3.5 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-xs font-semibold text-[#111111] flex items-center gap-2 shadow-2xs">
                  <FiCheck className="w-4 h-4 text-[#0ea472]" />
                  <span>{manuscriptFile}</span>
                  <span className="text-[#6B7280]">({manuscriptSize})</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  ISBN Assignment
                </label>
                <input
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  placeholder="ISBN 978-0-19-852663"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D1D5DB] rounded-xl text-xs sm:text-sm text-[#111111] outline-none focus:border-[#2520B8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1.5">
                  Page Count
                </label>
                <input
                  type="number"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="384"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D1D5DB] rounded-xl text-xs sm:text-sm text-[#111111] outline-none focus:border-[#2520B8]"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                  <FiShield className="w-3.5 h-3.5 text-[#006A61]" />
                  Automated DRM &amp; Integrity Verification
                </span>
                <p className="text-[11px] text-[#6B7280]">
                  Apply cryptographic watermarking and index against piracy networks.
                </p>
              </div>

              <input
                type="checkbox"
                checked={enableDrm}
                onChange={(e) => setEnableDrm(e.target.checked)}
                className="w-4 h-4 rounded text-[#2520B8] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* STEP 3: PREVIEW */}
        {step === 3 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold font-syne text-[#111111]">
                Catalog Listing Preview
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Review how readers and reviewers will view this publication in the digital library.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex flex-col sm:flex-row gap-5 items-start">
              {/* Cover preview */}
              <div className="w-[120px] h-[168px] rounded-xl bg-gradient-to-br from-[#063940] via-[#0B5560] to-[#041F24] border border-[#006A61]/40 p-3 flex flex-col justify-between text-white shrink-0 shadow-md relative overflow-hidden">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Book Cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="bg-white/95 text-[#063940] rounded px-1.5 py-1 text-[8px] font-extrabold uppercase truncate">
                      {title}
                    </div>
                    <div className="text-[7px] text-white/80 font-mono">
                      {authorName}
                    </div>
                  </>
                )}
              </div>

              {/* Metadata Details */}
              <div className="flex-1 space-y-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200/90 text-[#374151]">
                    {category}
                  </span>
                  <span className="text-[11px] font-semibold text-[#E8785A]">
                    {isbn ? `ISBN ${isbn}` : "Pending ISBN"}
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    • {pages} pages
                  </span>
                </div>

                <h4 className="text-lg font-bold font-syne text-[#111111]">
                  {title}
                </h4>

                <p className="text-xs text-[#6B7280]">
                  By <strong className="text-[#111111]">{authorName}</strong>
                </p>

                <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-3">
                  {description}
                </p>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <FiTag className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-white border border-[#E5E7EB] text-[10px] font-semibold text-[#374151]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUBMIT */}
        {step === 4 && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold font-syne text-[#111111]">
                Editorial Ingestion Confirmation
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Confirm transmission to the Digital Library editorial review queue.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "Metadata & Synopsis Verification",
                  desc: "Title, author credentials, and book synopsis pass initial checks.",
                },
                {
                  title: "Automated Plagiarism & DRM Scan",
                  desc: "Index integrity ready for real-time background hashing.",
                },
                {
                  title: "Editorial Pipeline Placement",
                  desc: "Publication will be queued for editorial review and approval.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-[#EAFBF1] text-[#059669] flex items-center justify-center shrink-0 mt-0.5">
                    <FiCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-[#111111]">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-[#6B7280]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          {step === 1 ? (
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#FAFAFB] text-[#374151] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as WizardStep)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E5E7EB] hover:bg-[#FAFAFB] text-[#374151] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && (!title.trim() || !authorName.trim())) {
                  showToast("error", "Please provide a book title and author.");
                  return;
                }
                setStep((s) => (s + 1) as WizardStep);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2520B8] hover:bg-[#1D1996] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <span>
                {step === 1
                  ? "Next: Upload File"
                  : step === 2
                    ? "Next: Preview"
                    : "Proceed to Submit"}
              </span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E8785A] hover:bg-[#D96948] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <span>Confirm &amp; Submit Publication</span>
              <FiCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </LibraryModalShell>
  );
}
