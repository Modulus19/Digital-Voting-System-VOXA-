import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const AdminEditPoll = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [options, setOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH POLL
  // =========================

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/polls/${id}`);

        const poll =
          response.data.data?.poll ||
          response.data.data;

        setQuestion(poll.question || "");
        setCategory(poll.category || "");

        setOptions(
          poll.options?.map((option) => ({
            id: option.id,
            text: option.text || "",
          })) || []
        );

        if (poll.closesAt) {
          const date = new Date(poll.closesAt);

          const localDate = new Date(
            date.getTime() -
              date.getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16);

          setClosesAt(localDate);
        }
      } catch (error) {
        console.error(
          "Failed to load poll:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Unable to load poll."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  // =========================
  // OPTION HANDLERS
  // =========================

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
        id: `new-${Date.now()}`,
        text: "",
      },
    ]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      alert("A poll must have at least 2 options.");
      return;
    }

    setOptions((currentOptions) =>
      currentOptions.filter(
        (_, optionIndex) => optionIndex !== index
      )
    );
  };

  // =========================
  // SAVE CHANGES
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedQuestion = question.trim();

    const cleanedOptions = options
      .map((option) => option.text.trim())
      .filter(Boolean);

    if (!trimmedQuestion) {
      setError("Please enter a poll question.");
      return;
    }

    if (cleanedOptions.length < 2) {
      setError(
        "A poll must have at least 2 options."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        question: trimmedQuestion,
        category,
        options: cleanedOptions,
      };

      if (closesAt) {
        payload.closesAt = new Date(
          closesAt
        ).toISOString();
      }

      await api.patch(
        `/polls/${id}`,
        payload
      );

      setSuccess("Poll updated successfully.");

      setTimeout(() => {
        navigate(`/admin/polls/${id}`);
      }, 800);
    } catch (error) {
      console.error(
        "Failed to update poll:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update poll."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col items-center gap-3">
          <Icon
            icon="mdi:loading"
            width="32"
            className="animate-spin text-[#3B82F6]"
          />

          <p className="text-sm text-gray-500">
            Loading poll...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Back */}
      <Link
        to={`/admin/polls/${id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#3B82F6]"
      >
        <Icon
          icon="mdi:arrow-left"
          width="19"
        />

        Back to Poll
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Poll
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the poll question, options, category,
          or closing date.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <Icon
            icon="mdi:alert-circle-outline"
            width="21"
          />

          <p>{error}</p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-600">
          <Icon
            icon="mdi:check-circle-outline"
            width="21"
          />

          <p>{success}</p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Basic Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Poll Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the basic details of this poll.
            </p>
          </div>

          <div className="space-y-5">

            {/* Question */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Poll Question
              </label>

              <textarea
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                rows="3"
                placeholder="Enter your poll question..."
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
              >
                <option value="">
                  Select a category
                </option>

                <option value="technology">
                  Technology
                </option>

                <option value="education">
                  Education
                </option>

                <option value="politics">
                  Politics
                </option>

                <option value="food">
                  Food
                </option>

                <option value="sports">
                  Sports
                </option>

                <option value="lifestyle">
                  Lifestyle
                </option>
              </select>
            </div>

            {/* Closing Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Closing Date
              </label>

              <input
                type="datetime-local"
                value={closesAt}
                onChange={(e) =>
                  setClosesAt(e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Leave unchanged if you don't want to
                modify the closing date.
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Poll Options
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update the choices voters can select.
              </p>
            </div>

            <button
              type="button"
              onClick={addOption}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#3B82F6] px-4 py-2.5 text-sm font-medium text-[#3B82F6] transition hover:bg-blue-50"
            >
              <Icon
                icon="mdi:plus"
                width="19"
              />

              Add Option
            </button>
          </div>

          <div className="space-y-3">

            {options.map((option, index) => (
              <div
                key={option.id || index}
                className="flex items-center gap-3"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-500">
                  {index + 1}
                </div>

                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(
                      index,
                      e.target.value
                    )
                  }
                  placeholder={`Option ${
                    index + 1
                  }`}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeOption(index)
                  }
                  className="rounded-lg p-2.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  title="Remove option"
                >
                  <Icon
                    icon="mdi:delete-outline"
                    width="20"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <Link
            to={`/admin/polls/${id}`}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving && (
              <Icon
                icon="mdi:loading"
                width="19"
                className="animate-spin"
              />
            )}

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditPoll;