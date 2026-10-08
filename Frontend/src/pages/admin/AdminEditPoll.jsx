import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const categories = [
  "Technology",
  "Education",
  "Politics",
  "Food",
  "Sports",
  "Lifestyle",
];

export default function AdminEditPoll() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [options, setOptions] = useState([]);
  const [pollStatus, setPollStatus] = useState("");
  const [originalClosesAt, setOriginalClosesAt] = useState("");

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/polls/${id}`);

      const poll = response.data?.data?.poll || response.data?.data;

      if (!poll) {
        throw new Error("Poll data was not found.");
      }

      if (poll.status && poll.status !== "draft") {
        setError("Only draft polls can be edited. This poll is " + poll.status + ".");
      }

      setQuestion(poll.question || "");
      setCategory(poll.category || "");
      setPollStatus(poll.status || "");

      // Convert backend closing date into datetime-local format
      if (poll.closesAt) {
        const date = new Date(poll.closesAt);

      if (!Number.isNaN(date.getTime())) {
        const formatted = formatDateTimeLocal(date);
        setClosesAt(formatted);
        setOriginalClosesAt(formatted);
      }
      } else {
        setClosesAt("");
      }

      // Backend options are objects such as:
      // { _id: "...", text: "Ankara" }
      const pollOptions = Array.isArray(poll.options)
        ? poll.options
        : [];

      setOptions(
        pollOptions.map((option, index) => ({
          id: option._id || option.id || `option-${index}`,
          text: option.text || option.label || "",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch poll:", err);
      console.error("Backend response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load poll."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateTimeLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleOptionChange = (index, value) => {
    setOptions((currentOptions) =>
      currentOptions.map((option, optionIndex) =>
        optionIndex === index
          ? {
              ...option,
              text: value,
            }
          : option
      )
    );
  };

  const addOption = () => {
    setOptions((currentOptions) => [
      ...currentOptions,
      {
        id: `new-option-${Date.now()}`,
        text: "",
      },
    ]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      setError("A poll must have at least 2 options.");
      return;
    }

    setOptions((currentOptions) =>
      currentOptions.filter((_, optionIndex) => optionIndex !== index)
    );

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // VALIDATION

    if (!question.trim()) {
      setError("Please enter a poll question.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (options.length < 2) {
      setError("A poll must have at least 2 options.");
      return;
    }

    // Clean options and convert them
    // to the format expected by the backend.
    const cleanedOptions = options.map((option) => ({
      text: option.text.trim(),
    }));

    // Make sure no option is empty
    if (cleanedOptions.some((option) => !option.text)) {
      setError("Please fill in all poll options.");
      return;
    }

    // Prevent duplicate options
    const uniqueOptions = new Set(
      cleanedOptions.map((option) => option.text.toLowerCase())
    );

    if (uniqueOptions.size !== cleanedOptions.length) {
      setError("Poll options must be different from each other.");
      return;
    }

    // Validate closing date
    if (closesAt && closesAt !== originalClosesAt) {
      const closingDate = new Date(closesAt);

      if (Number.isNaN(closingDate.getTime())) {
        setError("Please enter a valid closing date.");
        return;
      }

      if (closingDate <= new Date()) {
        setError("The closing date must be in the future.");
        return;
      }
    }

    try {
      setSaving(true);

      // UPDATE PAYLOAD

      const payload = {
        question: question.trim(),
        category,
        options: cleanedOptions,
      };

      if (closesAt && closesAt !== originalClosesAt) {
        payload.closesAt = new Date(closesAt).toISOString();
      }

      console.log("Updating poll with payload:", payload);

      // Example payload:
      //
      // {
      //   question: "What's your style of dress for this year",
      //   category: "lifestyle",
      //   options: [
      //     { text: "Ankara" },
      //     { text: "Golden" }
      //   ],
      //   closesAt: "2027-01-08T11:00:00.000Z"
      // }

      const response = await api.patch(`/polls/${id}`, payload);

      console.log("Poll update response:", response.data);

      setSuccess("Poll updated successfully.");

      // Give the success message a moment to show
      setTimeout(() => {
        navigate(`/admin/polls/${id}`);
      }, 800);
    } catch (err) {
      console.error("Failed to update poll:", err);
      console.error("Backend response:", err.response?.data);
      console.error("Status:", err.response?.status);
      console.error("Request payload:", err.config?.data);

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.errors;

      if (Array.isArray(backendMessage)) {
        setError(backendMessage.join(", "));
      } else if (typeof backendMessage === "object") {
        setError(JSON.stringify(backendMessage));
      } else {
        setError(
          backendMessage ||
            "The poll could not be updated. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // LOADING STATE
  // -----------------------------

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading poll...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* HEADER */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate(`/admin/polls/${id}`)}
          className="mb-4 text-sm font-medium text-[#1554B8] hover:underline"
        >
          ← Back to Poll
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          Edit Poll
        </h1>

        <p className="mt-2 text-gray-500">
          Update the poll question, category, options, or closing date.
        </p>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* =========================
            POLL INFORMATION
        ========================== */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            Poll Information
          </h2>

          <div className="space-y-5">
            {/* QUESTION */}
            <div>
              <label
                htmlFor="question"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Poll Question
              </label>

              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                placeholder="Enter your poll question"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#1554B8] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1554B8] focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select category</option>

                {categories.map((item) => (
                  <option key={item} value={item.toLowerCase()}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* CLOSING DATE */}
            <div>
              <label
                htmlFor="closesAt"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Closing Date & Time
              </label>

              <input
                id="closesAt"
                type="datetime-local"
                value={closesAt}
                onChange={(e) => setClosesAt(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#1554B8] focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Leave empty if the poll should not have a closing date.
              </p>
            </div>
          </div>
        </div>

    
        //  POLL OPTIONS
      
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Poll Options
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add or edit the choices voters can select.
              </p>
            </div>

            <button
              type="button"
              onClick={addOption}
              className="rounded-lg bg-[#1554B8] px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              + Add Option
            </button>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div
                key={option.id}
                className="flex items-center gap-3"
              >
                // NUMBER 
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-600">
                  {index + 1}
                </span>

                //OPTION INPUT 
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(index, e.target.value)
                  }
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#1554B8] focus:ring-2 focus:ring-blue-100"
                />

                {/* REMOVE */}
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

            //ACTION BUTTONS

        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="button"
            onClick={() => navigate(`/admin/polls/${id}`)}
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || (pollStatus && pollStatus !== "draft")}
            className="rounded-lg bg-[#1554B8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Poll"}
          </button>
        </div>
      </form>
    </div>
  );
}