import { useEffect, useRef, useState } from "react";
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
  onDirtyChange,
  leaveRequest = 0,
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
          typeof option === "string"
            ? option
            : option.text
        )
      : ["", ""]
  );

  const optionRefs = useRef([]);
  const questionRef = useRef(null);
  const categoryRef = useRef(null);
  const closesAtRef = useRef(null);
  const dateTimePickerRef = useRef(null);

  const [draggedOptionIndex, setDraggedOptionIndex] =
    useState(null);

  const [resultsVisibility, setResultsVisibility] =
    useState(
      initialValues.resultsVisibility ??
        "after_vote"
    );

  const [closesAt, setClosesAt] = useState(
    initialValues.closesAt ?? ""
  );

  const [showDateTimePicker, setShowDateTimePicker] =
    useState(false);

  const [dateTimeStep, setDateTimeStep] =
    useState("date");

  const [selectedDate, setSelectedDate] =
    useState(null);

  const [selectedTime, setSelectedTime] =
    useState("");

  const [selectedPeriod, setSelectedPeriod] =
    useState("PM");

  const [errors, setErrors] = useState({});

  const [showCancelModal, setShowCancelModal] = useState(false);

  const isSubmitting = submitAction !== null;

  const initialOptions =
    initialValues.options?.length >= 2
      ? initialValues.options.map((option) =>
          typeof option === "string"
            ? option
            : option.text
        )
      : ["", ""];

  const isDirty =
    question !== (initialValues.question ?? "") ||
    category !== (initialValues.category ?? "") ||
    JSON.stringify(options) !== JSON.stringify(initialOptions) ||
    resultsVisibility !==
      (initialValues.resultsVisibility ?? "after_vote") ||
    closesAt !== (initialValues.closesAt ?? "");

  useEffect(() => {
    onDirtyChange?.(Boolean(isDirty));
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty || isSubmitting) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [isDirty, isSubmitting]);

  const addOption = () => {
    const newIndex = options.length;

    setOptions((current) => [
      ...current,
      "",
    ]);

    requestAnimationFrame(() => {
      optionRefs.current[newIndex]?.focus();
    });
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;

    setOptions((current) =>
      current.filter(
        (_, optionIndex) =>
          optionIndex !== index
      )
    );
  };

  const moveOption = (fromIndex, toIndex) => {
    if (
      fromIndex === null ||
      fromIndex === toIndex
    ) {
      return;
    }

    setOptions((current) => {
      const reordered = [...current];

      const [movedOption] = reordered.splice(
        fromIndex,
        1
      );

      reordered.splice(
        toIndex,
        0,
        movedOption
      );

      return reordered;
    });

    setDraggedOptionIndex(toIndex);
  };
  
  const updateOption = (
    index,
    value
  ) => {
    setOptions((current) =>
      current.map(
        (option, optionIndex) =>
          optionIndex === index
            ? value
            : option
      )
    );
  };

  const focusFirstInvalidField = (nextErrors) => {
    let target = null;

    if (nextErrors.question) {
      target = questionRef.current;
    } else if (nextErrors.category) {
      target = categoryRef.current;
    } else if (nextErrors.options) {
      const firstEmptyOptionIndex =
        options.findIndex(
          (option) => !option.trim()
        );

      target =
        optionRefs.current[
          firstEmptyOptionIndex >= 0
            ? firstEmptyOptionIndex
            : 0
        ];
    } else if (nextErrors.closesAt) {
      target = closesAtRef.current;
    }

    if (!target) return;

    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      target.focus({
        preventScroll: true,
      });
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!question.trim()) {
      nextErrors.question =
        "Poll question is required.";
    }

    if (!category) {
      nextErrors.category =
        "Please select a category.";
    }

    const filledOptions = options.filter(
      (option) => option.trim()
    );

    if (filledOptions.length < 2) {
      nextErrors.options =
        "Enter at least two poll options.";
    }

    if (!closesAt) {
      nextErrors.closesAt =
        "Please select an end date.";
    } else if (
      new Date(closesAt) <= new Date()
    ) {
      nextErrors.closesAt =
        "End date must be in the future.";
    }

    setErrors(nextErrors);

    const isValid =
      Object.keys(nextErrors).length === 0;

    if (!isValid) {
      focusFirstInvalidField(nextErrors);
    }

    return isValid;
  };

  const buildPayload = () => ({
    question: question.trim(),

    options: options
      .filter((option) => option.trim())
      .map((option) => ({
        text: option.trim(),
      })),

    resultsVisibility,
    category,
    closesAt: new Date(
      closesAt
    ).toISOString(),
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

    return (
      value.charAt(0).toUpperCase() +
      value.slice(1)
    );
  };

  useEffect(() => {
    if (!showDateTimePicker) return;

    const handleClickOutside = (event) => {
      if (
        dateTimePickerRef.current &&
        !dateTimePickerRef.current.contains(event.target)
      ) {
        setShowDateTimePicker(false);
        setDateTimeStep("date");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showDateTimePicker]);

  const handleCancelRequest = () => {
    if (!isDirty) {
      onCancel();
      return;
    }

    setShowCancelModal(true);
  };

  useEffect(() => {
    if (!leaveRequest) return;

    handleCancelRequest();
  }, [leaveRequest]);

  const confirmCancel = () => {
    setShowCancelModal(false);
    onCancel();
  };

  const [calendarMonth, setCalendarMonth] =
    useState(() => new Date());

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const calendarDays = getCalendarDays(calendarMonth);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDateTimeStep("time");
  };

  const isSelectedTimeInPast = (time) => {
    if (!selectedDate || !time) return false;

    const now = new Date();

    // Only apply this check when the selected date is today
    if (selectedDate.toDateString() !== now.toDateString()) {
      return false;
    }

    const [hours, minutes] = time.split(":").map(Number);

    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    return selectedDateTime <= now;
};

  const handleTimeSelect = (time) => {
    if (!selectedDate) return;

    if (isSelectedTimeInPast(time)) {
      setErrors((current) => ({
        ...current,
        closesAt: "Please select a future time.",
      }));
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);

    const finalDate = new Date(selectedDate);
    finalDate.setHours(hours, minutes, 0, 0);

    setSelectedTime(time);
    setClosesAt(finalDate.toISOString());

    // Clear any previous date/time error
    setErrors((current) => ({
      ...current,
      closesAt: "",
    }));

    setShowDateTimePicker(false);
    setDateTimeStep("date");
  };

  const changeMonth = (amount) => {
    setCalendarMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + amount,
          1
        )
    );
  };

  return (
    <>
      {/* Server error */}
      {serverError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:mb-6">
          {serverError}
        </div>
      )}

      {/* Form + preview */}
      <div className="grid items-start gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        {/* LEFT */}
        <div className="min-w-0 space-y-5 sm:space-y-6 lg:space-y-7">
          {/* QUESTION */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow duration-200 hover:shadow-sm sm:p-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Poll Question{" "}
                <span className="text-blue-600">
                  *
                </span>
              </label>

              <input
                ref={questionRef}
                type="text"
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value
                  )
                }
                placeholder="What would you like to ask?"
                className="
                  w-full rounded-lg border
                  border-slate-200 bg-slate-50
                  px-3 py-3 text-sm
                  outline-none
                  transition-all duration-200
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-2
                  focus:ring-blue-100
                  sm:px-4
                "
              />

              {errors.question && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.question}
                </p>
              )}
            </div>

            <div className="mt-6 w-full sm:mt-7 sm:max-w-xs">
              <label className="mb-2 block text-sm font-medium text-slate-800">
                Category{" "}
                <span className="text-blue-600">
                  *
                </span>
              </label>

              <select
                ref={categoryRef}
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                className="
                  w-full rounded-md border
                  border-slate-200 bg-white
                  px-3 py-2.5 text-sm
                  outline-none
                  transition-all duration-200
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              >
                <option value="">
                  Select a category
                </option>

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {formatCategory(item)}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.category}
                </p>
              )}
            </div>
          </section>

          {/* OPTIONS */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow duration-200 hover:shadow-sm sm:p-6">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 sm:mb-5">
              Poll Options{" "}
              <span className="text-blue-600">
                *
              </span>
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {options.map(
                (option, index) => (
                  <div
                    key={index}
                    onDragEnter={() => {
                      if (
                        draggedOptionIndex !== null &&
                        draggedOptionIndex !== index
                      ) {
                        moveOption(
                          draggedOptionIndex,
                          index
                        );
                      }
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      setDraggedOptionIndex(null);
                    }}
                    className={`
                      flex min-w-0 items-center gap-2
                      rounded-lg
                      transition-all duration-200
                      sm:gap-4

                      ${
                        draggedOptionIndex === index
                          ? "scale-[0.98] opacity-50 shadow-sm"
                          : ""
                      }
                    `}
                  >

                    <button
                      type="button"
                      draggable
                      tabIndex={-1}
                      aria-label={`Drag option ${index + 1}`}
                      onDragStart={() => {
                        setDraggedOptionIndex(index);
                      }}
                      onDragEnd={() => {
                        setDraggedOptionIndex(null);
                      }}
                      className="
                        flex h-10 w-6 shrink-0
                        cursor-grab items-center justify-center
                        text-slate-400
                        transition-colors
                        hover:text-blue-600
                        active:cursor-grabbing
                      "
                    >
                      <Icon
                        icon="mdi:drag-vertical"
                        width={20}
                      />
                    </button>
                    
                    <input
                      ref={(element) => {
                        optionRefs.current[index] = element;
                      }}
                      type="text"
                      value={option}
                      onChange={(event) =>
                        updateOption(
                          index,
                          event.target.value
                        )
                      }
                      placeholder={`Option ${index + 1}`}
                      className="
                        min-w-0 flex-1
                        rounded-lg border
                        border-slate-200
                        bg-slate-50 px-3 py-3
                        text-sm outline-none
                        transition-all duration-200
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-blue-100
                        sm:px-4
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeOption(index)
                      }
                      disabled={
                        options.length <= 2
                      }
                      aria-label={`Remove option ${
                        index + 1
                      }`}
                      className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-lg text-slate-500
                        transition-all duration-200
                        hover:bg-red-50
                        hover:text-red-500
                        active:scale-95
                        disabled:cursor-not-allowed
                        disabled:opacity-30
                      "
                    >
                      <Icon
                        icon="mdi:trash-can-outline"
                        className="text-xl"
                      />
                    </button>
                  </div>
                )
              )}
            </div>

            {errors.options && (
              <p className="mt-2 text-xs text-red-500">
                {errors.options}
              </p>
            )}

            <button
              type="button"
              onClick={addOption}
              className="
                mt-4 flex min-h-10
                items-center gap-1.5
                rounded-md border
                border-blue-500 px-4 py-2
                text-sm font-medium
                text-blue-600
                transition-all duration-200
                hover:bg-blue-50
                active:scale-[0.98]
                sm:mt-5
              "
            >
              <Icon icon="mdi:plus" />

              Add an option
            </button>
          </section>

          {/* SETTINGS */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow duration-200 hover:shadow-sm sm:p-6">
            <h2 className="mb-5 text-sm font-semibold text-slate-900 sm:mb-6">
              Poll Settings{" "}
              <span className="text-blue-600">
                *
              </span>
            </h2>

            <div className="grid items-center gap-6 sm:grid-cols-2 sm:gap-7">
              {/* Visibility */}
              <div className="min-w-0">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Results Visibility
                </label>

                <p className="mb-3 text-xs leading-5 text-slate-500">
                  Choose when voters can see
                  the poll results.
                </p>

                <select
                  value={
                    resultsVisibility
                  }
                  onChange={(event) =>
                    setResultsVisibility(
                      event.target.value
                    )
                  }
                  className="
                    w-full rounded-md border
                    border-slate-200 bg-white
                    px-3 py-2.5 text-sm
                    outline-none
                    transition-all duration-200
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                >
                  {visibilityOptions.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* End date & time */}
              <div className="relative min-w-0">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  End Date & Time
                </label>

                <p className="mb-3 text-xs leading-5 text-slate-500">
                  Choose when your poll closes.
                </p>

                <div
                  ref={dateTimePickerRef}
                  className="relative"
                >

                  <button
                    type="button"
                    onClick={() => {
                      setShowDateTimePicker((current) => !current);
                      setDateTimeStep("date");
                    }}
                    className={`
                      flex w-full items-center justify-between
                      rounded-lg border bg-white
                      px-3 py-2.5 text-left text-sm
                      outline-none transition-all duration-200

                      ${
                        showDateTimePicker
                          ? "border-blue-500 ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-slate-300"
                      }
                    `}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Icon
                        icon="mdi:calendar-blank-outline"
                        width={18}
                        className="shrink-0 text-slate-400"
                      />

                      <span
                        className={
                          closesAt
                            ? "truncate text-slate-800"
                            : "text-slate-400"
                        }
                      >
                        {closesAt
                          ? new Date(closesAt).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )
                          : "Select date and time"}
                      </span>
                    </span>

                    <Icon
                      icon="mdi:chevron-down"
                      width={19}
                      className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                        showDateTimePicker
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {showDateTimePicker && (
                    <div
                      className="
                        absolute bottom-full left-0 z-50 mb-0
                        w-full max-w-[360px]
                        overflow-hidden rounded-xl
                        border border-slate-200 bg-white
                        shadow-[0_18px_45px_rgba(15,23,42,0.14)]
                      "
                    >
                      {dateTimeStep === "date" && (
                        <div className="p-4">
                          {/* Calendar header */}
                          <div className="mb-4 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => changeMonth(-1)}
                              className="
                                flex h-8 w-8 items-center justify-center
                                rounded-lg text-slate-500
                                transition hover:bg-slate-100 hover:text-slate-800
                              "
                            >
                              <Icon icon="mdi:chevron-left" width={20} />
                            </button>

                            <p className="text-sm font-semibold text-slate-800">
                              {calendarMonth.toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </p>

                            <button
                              type="button"
                              onClick={() => changeMonth(1)}
                              className="
                                flex h-8 w-8 items-center justify-center
                                rounded-lg text-slate-500
                                transition hover:bg-slate-100 hover:text-slate-800
                              "
                            >
                              <Icon icon="mdi:chevron-right" width={20} />
                            </button>
                          </div>

                          {/* Week days */}
                          <div className="mb-1 grid grid-cols-7">
                            {daysOfWeek.map((day) => (
                              <div
                                key={day}
                                className="
                                  flex h-8 items-center justify-center
                                  text-[11px] font-medium text-slate-400
                                "
                              >
                                {day}
                              </div>
                            ))}
                          </div>

                          {/* Calendar days */}
                          <div className="grid grid-cols-7 gap-y-1">
                            {calendarDays.map((date, index) => {
                              if (!date) {
                                return <div key={`empty-${index}`} />;
                              }

                              const today = new Date();

                              const isToday =
                                date.toDateString() === today.toDateString();

                              const isSelected =
                                selectedDate &&
                                date.toDateString() === selectedDate.toDateString();

                              const isPast =
                                date <
                                new Date(
                                  today.getFullYear(),
                                  today.getMonth(),
                                  today.getDate()
                                );

                              return (
                                <button
                                  key={date.toISOString()}
                                  type="button"
                                  disabled={isPast}
                                  onClick={() => handleDateSelect(date)}
                                  className={`
                                    mx-auto flex h-9 w-9
                                    items-center justify-center rounded-lg
                                    text-sm transition

                                    ${
                                      isSelected
                                        ? "bg-blue-600 font-semibold text-white"
                                        : isToday
                                        ? "bg-blue-50 font-semibold text-blue-600"
                                        : isPast
                                        ? "cursor-not-allowed text-slate-300"
                                        : "text-slate-700 hover:bg-slate-100"
                                    }
                                  `}
                                >
                                  {date.getDate()}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {dateTimeStep === "time" && (
                        <div className="p-4">
                          <div className="mb-5 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setDateTimeStep("date")}
                              className="
                                flex h-8 w-8 shrink-0 items-center justify-center
                                rounded-lg text-slate-500
                                transition hover:bg-slate-100 hover:text-slate-800
                              "
                            >
                              <Icon icon="mdi:arrow-left" width={18} />
                            </button>

                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                Select time
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {selectedDate?.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <div>
                            {/* Time controls */}
                            <div className="grid grid-cols-[72px_auto_72px_76px] items-end gap-2">
                              {/* Hour */}
                              <div>
                                <p className="mb-2 text-[11px] font-medium text-slate-400">
                                  Hour
                                </p>

                                <select
                                  value={selectedTime ? selectedTime.split(":")[0] : ""}
                                  onChange={(e) => {
                                    const hour = e.target.value;
                                    const minute = selectedTime
                                      ? selectedTime.split(":")[1]
                                      : "00";

                                    setSelectedTime(`${hour}:${minute}`);
                                  }}
                                  className="
                                    h-11 w-full rounded-lg border border-slate-200
                                    bg-white px-3 text-sm font-medium text-slate-700
                                    outline-none transition
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                                  "
                                >
                                  <option value="">--</option>

                                  {Array.from({ length: 12 }, (_, index) => {
                                    const hour = index + 1;

                                    return (
                                      <option key={hour} value={hour}>
                                        {hour}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>

                              <span className="mb-3 flex h-5 items-center justify-center text-lg font-semibold text-slate-400">
                                :
                              </span>

                              {/* Minute */}
                              <div>
                                <p className="mb-2 text-[11px] font-medium text-slate-400">
                                  Minute
                                </p>

                                <select
                                  value={
                                    selectedTime
                                      ? selectedTime.split(":")[1]
                                      : "00"
                                  }
                                  onChange={(e) => {
                                    const hour = selectedTime
                                      ? selectedTime.split(":")[0]
                                      : "";

                                    setSelectedTime(
                                      `${hour}:${e.target.value}`
                                    );
                                  }}
                                  className="
                                    h-11 w-full rounded-lg border border-slate-200
                                    bg-white pl-3 pr-2 text-sm font-medium text-slate-700
                                    outline-none transition
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                                  "
                                >
                                  {["00", "15", "30", "45"].map((minute) => (
                                    <option key={minute} value={minute}>
                                      {minute}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* AM / PM */}
                              <div>
                                <p className="mb-2 text-[11px] font-medium text-slate-400">
                                  Period
                                </p>

                                <select
                                  value={selectedPeriod}
                                  onChange={(e) =>
                                    setSelectedPeriod(e.target.value)
                                  }
                                  className="
                                    h-11 w-full rounded-lg border border-slate-200
                                    bg-white px-2 text-sm font-medium text-slate-700
                                    outline-none transition
                                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                                  "
                                >
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedTime("");
                                  setDateTimeStep("date");
                                }}
                                className="
                                  text-xs font-medium text-slate-500
                                  transition hover:text-slate-800
                                "
                              >
                                Change date
                              </button>

                              <button
                                type="button"
                                disabled={!selectedTime?.split(":")[0]}
                                onClick={() => {
                                  if (!selectedTime?.split(":")[0]) return;

                                  const [hourString, minute] =
                                    selectedTime.split(":");

                                  const period = selectedPeriod;

                                  let hour = Number(hourString);

                                  if (period === "PM" && hour !== 12) {
                                    hour += 12;
                                  }

                                  if (period === "AM" && hour === 12) {
                                    hour = 0;
                                  }

                                  const time24 = `${String(hour).padStart(
                                    2,
                                    "0"
                                  )}:${minute}`;

                                  handleTimeSelect(time24);
                                }}
                                className="
                                  flex items-center gap-1.5 rounded-lg
                                  bg-blue-600 px-4 py-2.5
                                  text-xs font-semibold text-white
                                  transition
                                  hover:bg-blue-700
                                  disabled:cursor-not-allowed
                                  disabled:bg-slate-200
                                  disabled:text-slate-400
                                "
                              >
                                Set end time

                                <Icon
                                  icon="mdi:check"
                                  width={16}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {errors.closesAt && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.closesAt}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* LIVE PREVIEW */}
        <aside className="min-w-0 rounded-xl border border-blue-500 bg-white p-4 transition-shadow duration-200 hover:shadow-sm sm:p-6 lg:sticky lg:top-6">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-800 sm:mb-7">
            <Icon
              icon="mdi:eye-outline"
              className="text-lg text-blue-500"
            />

            Live Preview
          </div>

          <div className="rounded-lg border border-slate-200 p-3 sm:p-4">
            <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words text-sm font-semibold leading-5 text-slate-900 lg:max-w-[180px]">
                  {question ||
                    "Your Poll Question"}
                </h3>

                <p className="mt-1 text-[11px] text-slate-500">
                  {formatCategory(
                    category
                  )}{" "}
                  · 0 votes
                </p>
              </div>

              <span className="shrink-0 whitespace-nowrap text-[10px] text-slate-400">
                Ends in
              </span>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {options.map(
                (option, index) => (
                  <div
                    key={index}
                    className="
                      break-words rounded-lg
                      bg-slate-100 px-3 py-2.5
                      text-xs font-medium
                      text-slate-700
                      transition-all duration-200
                      sm:px-4 sm:py-3
                    "
                  >
                    {option ||
                      `Option ${index + 1}`}
                  </div>
                )
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-4">
        <button
          type="button"
          onClick={handleCancelRequest}
          disabled={isSubmitting}
          className="
            min-h-11 w-full rounded-lg
            border border-slate-200
            bg-white px-5 py-3
            text-sm font-semibold
            text-slate-500
            transition-all duration-200
            hover:bg-slate-50
            active:scale-[0.98]
            disabled:opacity-50
            sm:w-auto sm:px-6
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSubmitting}
          className="
            min-h-11 w-full rounded-lg
            border border-blue-500
            bg-white px-5 py-3
            text-sm font-semibold
            text-blue-600
            transition-all duration-200
            hover:bg-blue-50
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:w-auto sm:px-6
          "
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
            className="
              min-h-11 w-full rounded-lg
              bg-blue-600 px-5 py-3
              text-sm font-semibold
              text-white
              transition-all duration-200
              hover:bg-blue-700
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto sm:px-6
            "
          >
            {submitAction === "publish"
              ? "Publishing..."
              : mode === "edit"
                ? "Save & Publish"
                : "Publish Poll"}
          </button>
        )}

        {showCancelModal && (
          <div
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              bg-black/40 px-4
            "
            onMouseDown={() => setShowCancelModal(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cancel-poll-title"
              onMouseDown={(event) => event.stopPropagation()}
              className="
                relative w-full max-w-md
                rounded-xl bg-white p-5
                shadow-xl
                sm:p-6
              "
            >
              <button
                type="button"
                aria-label="Close confirmation"
                onClick={() => setShowCancelModal(false)}
                className="
                  absolute right-4 top-4
                  flex h-8 w-8 items-center justify-center
                  rounded-full text-slate-400
                  transition-colors
                  hover:bg-slate-100 hover:text-slate-700
                "
              >
                <Icon icon="mdi:close" width={20} />
              </button>

              <div
                className="
                  mb-4 flex h-11 w-11
                  items-center justify-center
                  rounded-full bg-red-50
                  text-red-500
                "
              >
                <Icon
                  icon="mdi:alert-outline"
                  width={24}
                />
              </div>

              <h2
                id="cancel-poll-title"
                className="pr-8 text-lg font-bold text-slate-900"
              >
                Discard unsaved changes?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your unsaved changes will be lost if you leave this page.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="
                    min-h-10 rounded-lg
                    border border-slate-200
                    px-4 py-2 text-sm font-semibold
                    text-slate-700
                    transition-colors
                    hover:bg-slate-50
                  "
                >
                  Keep Editing
                </button>

                <button
                  type="button"
                  onClick={confirmCancel}
                  className="
                    min-h-10 rounded-lg
                    bg-red-600 px-4 py-2
                    text-sm font-semibold text-white
                    transition-colors
                    hover:bg-red-700
                  "
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}