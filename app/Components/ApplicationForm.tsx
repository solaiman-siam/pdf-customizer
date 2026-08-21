"use client";

import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { ServiceRequest, branches, applyingFromOptions } from "@/lib/data";

export type ApplicationFormData = {
  applicantName: string;
  email: string;
  phoneNumber: string;
  branch: string;
  applyingFrom: string;
  taxRegistrationNumber?: string;
  documents?: FileList;
};

type ApplicationFormProps = {
  request: ServiceRequest;
  onBack: () => void;
  onSubmit: (data: ApplicationFormData) => void;
  defaultValues?: Partial<ApplicationFormData>;
};

export default function ApplicationForm({
  request,
  onBack,
  onSubmit,
  defaultValues,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    defaultValues: defaultValues ?? {
      applicantName: "",
      email: "",
      phoneNumber: "",
      branch: "",
      applyingFrom: "",
      taxRegistrationNumber: "",
    },
  });

  const watchedFiles = watch("documents");
  const fileList = watchedFiles && watchedFiles.length > 0 ? Array.from(watchedFiles) : [];

  const handleFormSubmit = (data: ApplicationFormData) => {
    onSubmit(data);
  };

  const getInputClass = (hasError?: boolean) =>
    `mt-1 w-full border-b bg-transparent py-1.5 text-sm text-gray-800 focus:outline-none transition-colors ${
      hasError
        ? "border-red-500 focus:border-red-600"
        : "border-gray-300 focus:border-teal-500"
    }`;

  const getSelectClass = (hasError?: boolean) =>
    `mt-1 w-full border-b bg-transparent py-1.5 text-sm text-gray-800 focus:outline-none transition-colors ${
      hasError
        ? "border-red-500 focus:border-red-600"
        : "border-gray-300 focus:border-teal-500"
    }`;

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white shadow-sm">
      <h2 className="pt-6 text-center text-lg font-semibold text-gray-800">{request.name}</h2>

      <div className="mt-5 bg-teal-500 px-6 py-2">
        <h3 className="text-sm font-semibold text-white">Fill Application Details</h3>
      </div>

      <form className="px-6 py-6" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
          <Field label="Applicant Name" required error={errors.applicantName?.message}>
            <input
              type="text"
              placeholder="Enter applicant name"
              className={getInputClass(!!errors.applicantName)}
              {...register("applicantName", {
                required: "Applicant name is required",
                minLength: {
                  value: 2,
                  message: "Applicant name must be at least 2 characters",
                },
              })}
            />
          </Field>

          <Field label="Email Id" required error={errors.email?.message}>
            <input
              type="email"
              placeholder="name@example.com"
              className={getInputClass(!!errors.email)}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
            />
          </Field>

          <Field label="Phone Number" required error={errors.phoneNumber?.message}>
            <input
              type="tel"
              placeholder="+968 1234 5678"
              className={getInputClass(!!errors.phoneNumber)}
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[+0-9\s-]{7,15}$/,
                  message: "Please enter a valid phone number",
                },
              })}
            />
          </Field>

          <Field label="Select Branch" required error={errors.branch?.message}>
            <select
              className={getSelectClass(!!errors.branch)}
              defaultValue=""
              {...register("branch", {
                required: "Please select a branch",
              })}
            >
              <option value="" disabled>
                Select Branch
              </option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Applying From" required error={errors.applyingFrom?.message}>
            <select
              className={getSelectClass(!!errors.applyingFrom)}
              defaultValue=""
              {...register("applyingFrom", {
                required: "Please select where you are applying from",
              })}
            >
              <option value="" disabled>
                Applying From
              </option>
              {applyingFromOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tax Registration Number" error={errors.taxRegistrationNumber?.message}>
            <input
              type="text"
              placeholder="Optional TRN"
              className={getInputClass(!!errors.taxRegistrationNumber)}
              {...register("taxRegistrationNumber")}
            />
          </Field>
        </div>

        <div className="mt-8 -mx-6 bg-teal-500 px-6 py-2">
          <h3 className="text-sm font-semibold text-white">Supporting Document Details</h3>
        </div>

        <div className="mt-4 text-sm text-gray-700 space-y-1.5">
          <p className="font-medium text-gray-800">
            Upload Documents <span className="text-red-500">*</span>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Maximum upload size 3MB with PDF or JPG (business is flexible with all possible additional formats)</li>
            <li>Uploaded documents should be in Vertical position</li>
            <li>Front &amp; Back documents in one single file</li>
            <li>If you have selected more than two files it will consider as two transactions with the service selected</li>
            <li>Different documents should not be clubbed and uploaded as one document (Example Marriage certificate and Educational certificate uploaded as 1 PDF)</li>
            <li>Image should clear</li>
          </ul>

          <p className="pt-2">Choose files (Maximum upload size 3mb each with PDF or JPG):</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <label
                htmlFor="documents-upload"
                className="cursor-pointer rounded border border-gray-400 bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Choose Files
              </label>
              <input
                id="documents-upload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg"
                className="hidden"
                {...register("documents", {
                  required: "Please upload at least one document",
                  validate: {
                    maxSize: (files?: FileList) => {
                      if (!files || files.length === 0) return true;
                      for (let i = 0; i < files.length; i++) {
                        if (files[i].size > 3 * 1024 * 1024) {
                          return `File "${files[i].name}" exceeds 3MB limit`;
                        }
                      }
                      return true;
                    },
                  },
                })}
              />
              <span className="text-sm text-gray-500">
                {fileList.length > 0
                  ? `${fileList.length} file(s) selected: ${fileList.map((f) => f.name).join(", ")}`
                  : "No file chosen"}
              </span>
            </div>
            {errors.documents?.message && (
              <p className="text-xs text-red-500">{errors.documents.message}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded border border-gray-400 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-teal-500 px-5 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-50 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-600">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
}