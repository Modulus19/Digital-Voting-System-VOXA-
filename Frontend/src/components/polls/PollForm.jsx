import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const categories = [
  "education",
  "technology",
  "sports",
  "lifestyle",
  "food",
  "others",
];

const visibilityOptions = [
  { value: "after_vote", label: "After voting" },
  { value: "after_close", label: "After poll closes" },
  { value: "admin_only", label: "Admin only" },
];

const EMPTY_VALUES = {
  question: "",
  category: "",
  options: ["", ""],
  resultsVisibility: "after_vote",
  closesAt: "",
};

export default function PollForm({
  initialValues = EMPTY_VALUES,
  mode = "create",
  onCancel,
  onSave,
  onPublish,
  serverError = "",
  submitAction = null,
}) {
  const [question, setQuestion] = useState(
    initialValues.question ?? ""
  );
  const [category, setCategory] = useState(
    initialValues.category ?? ""
  );
  const [options, setOptions] = useState(
    initialValues.options?.length >= 2
      ? initialValues.options.map((option) =>
          typeof option === "string" ? option : option.text
        )
      : ["", ""]
  );
  const [resultsVisibility, setResultsVisibility] = useState(
    initialValues.resultsVisibility ?? "after_vote"
  );
  const [closesAt, setClosesAt] = useState(
    initialValues.closesAt ?? ""
  );

  const [errors, setErrors] = useState({});

  const isSubmitting = submitAction !== null;

  const isDirty =
    question.trim() ||
    category ||
    options.some((option) => option.trim()) ||
    closesAt;

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty || isSubmitting) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [isDirty, isSubmitting]);

  const addOption = () => {
    setOptions((current) => [...current, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;

    setOptions((current) =>
      current.filter((_, optionIndex) => optionIndex !== index)
    );
  };

  const updateOption = (index, value) => {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? value : option
      )
    );
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!question.trim()) {
      nextErrors.question = "Poll question is required.";
    }

    if (!category) {
      nextErrors.category = "Please select a category.";
    }

    if (
      options.length < 2 ||
      options.some((option) => !option.trim())
    ) {
      nextErrors.options =
        "Enter at least two poll options.";
    }

    if (!closesAt) {
      nextErrors.closesAt = "Please select an end date.";
    } else if (new Date(closesAt) <= new Date()) {
      nextErrors.closesAt =
        "End date must be in the future.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => ({
    question: question.trim(),

    options: options.map((option) => ({
      text: option.trim(),
    })),

    resultsVisibility,
    category,
    closesAt: new Date(closesAt).toISOString(),
  });

  const handleSave = () => {
    if (!validateForm()) return;

    onSave(buildPayload());
  };

  const handlePublish = () => {
    if (!validateForm()) return;

    onPublish(buildPayload());
  };

  const formatCategory = (value) => {
    if (!value) return "Category";

    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <>
      {serverError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* LEFT */}
        <div className="space-y-7">

          {/* QUESTION */}
          <section className="rounded-sm border border-slate-200 bg-white p-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Poll Question{" "}
                <span className="text-blue-600">*</span>
              </label>

              <input
                type="text"
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                placeholder="What would you like to ask?"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {errors.question && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.question}
                </p>
              )}
            </div>

            <div className="mt-7 max-w-xs">
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Category{" "}
                <span className="text-blue-600">*</span>
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="">
                  Select a category
                </option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {formatCategory(item)}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.category}
                </p>
              )}
            </div>
          </section>

          {/* OPTIONS */}
          <section className="rounded-sm border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-sm font-semibold text-slate-900">
              Poll Options{" "}
              <span className="text-blue-600">*</span>
            </h2>

            <div className="space-y-4">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4"
                >
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      updateOption(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="Enter an option"
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeOption(index)
                    }
                    disabled={options.length <= 2}
                    aria-label={`Remove option ${
                      index + 1
                    }`}
                    className="flex h-9 w-9 items-center justify-center text-slate-600 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Icon
                      icon="mdi:trash-can-outline"
                      className="text-xl"
                    />
                  </button>
                </div>
              ))}
            </div>

            {errors.options && (
              <p className="mt-2 text-xs text-red-500">
                {errors.options}
              </p>
            )}

            <button
              type="button"
              onClick={addOption}
              className="mt-5 flex items-center gap-1 rounded-md border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            >
              <Icon icon="mdi:plus" />
              Add an option
            </button>
          </section>

          {/* SETTINGS */}
          <section className="rounded-sm border border-slate-200 bg-white p-6">
            <h2 className="mb-6 text-sm font-semibold text-slate-900">
              Poll Settings{" "}
              <span className="text-blue-600">*</span>
            </h2>

            <div className="grid gap-7 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Results Visibility
                </label>

                <p className="mb-3 text-xs text-slate-500">
                  Choose when voters can see the
                  poll results.
                </p>

                <select
                  value={resultsVisibility}
                  onChange={(e) =>
                    setResultsVisibility(
                      e.target.value
                    )
                  }
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  {visibilityOptions.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  End Date
                </label>

                <p className="mb-3 text-xs text-slate-500">
                  Set when your poll will end.
                </p>

                <input
                  type="datetime-local"
                  value={closesAt}
                  onChange={(e) =>
                    setClosesAt(e.target.value)
                  }
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />

                {errors.closesAt && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.closesAt}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* LIVE PREVIEW */}
        <aside className="rounded-lg border border-blue-500 bg-white p-6 lg:sticky lg:top-6">
          <div className="mb-7 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Icon
              icon="mdi:eye-outline"
              className="text-lg text-blue-500"
            />
            Live Preview
          </div>

          <div className="rounded-md border border-slate-200 p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="max-w-[180px] break-words text-sm font-semibold text-slate-900">
                  {question ||
                    "Your Poll Question"}
                </h3>

                <p className="mt-1 text-[11px] text-slate-500">
                  {formatCategory(category)} · 0 votes
                </p>
              </div>

              <span className="whitespace-nowrap text-[10px] text-slate-400">
                Ends in
              </span>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-slate-100 px-4 py-3 text-xs font-medium text-slate-700"
                >
                  {option ||
                    `Option ${index + 1}`}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ACTIONS */}
      <div className="mt-8 flex flex-wrap justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="rounded-lg border border-blue-500 bg-white px-6 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitAction === "save"
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Save as Draft"}
        </button>

        {onPublish && (
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitAction === "publish"
              ? "Publishing..."
              : mode === "edit"
                ? "Save & Publish"
                : "Publish Poll"}
          </button>
        )}
      </div>
    </>
  );
}