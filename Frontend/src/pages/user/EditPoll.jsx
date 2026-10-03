import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { Icon } from "@iconify/react";

import PollForm from "../../components/polls/PollForm";
import Loading from "../../components/common/Loading";
import Error from "../../components/common/Error";

import {
  getPollById,
  updatePoll,
  publishPoll,
} from "../../services/pollApi";

export default function EditPoll() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitAction, setSubmitAction] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadPoll = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await getPollById(id);

        if (cancelled) return;

        const loadedPoll =
          response?.data?.poll ||
          response?.data ||
          response?.poll ||
          response;

        if (!loadedPoll?.id) {
          throw new Error("Poll was not returned.");
        }

        if (loadedPoll.status !== "draft") {
          throw new Error(
            "Only draft polls can be edited."
          );
        }

        setPoll(loadedPoll);
      } catch (error) {
        if (cancelled) return;

        setLoadError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load this poll."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPoll();

    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  const handleSave = async (payload) => {
    try {
      setServerError("");
      setSubmitAction("save");

      await updatePoll(id, payload);

      navigate("/my-polls");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to update your poll. Please try again."
      );
    } finally {
      setSubmitAction(null);
    }
  };

  const handleSaveAndPublish = async (payload) => {
    try {
      setServerError("");
      setSubmitAction("publish");

      await updatePoll(id, payload);
      await publishPoll(id);

      navigate("/my-polls");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to update and publish your poll."
      );
    } finally {
      setSubmitAction(null);
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <Loading size="large" />
      </div>
    );
  }

  if (loadError) {
    return (
      <Error
        message={loadError}
        onRetry={() =>
          setRetryCount((count) => count + 1)
        }
      />
    );
  }

  if (!poll) return null;

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => navigate("/my-polls")}
        className="mb-5 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <Icon icon="mdi:arrow-left" />
        Back to My Polls
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Edit Poll
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Update your poll before publishing it.
        </p>
      </div>

      <PollForm
        mode="edit"
        initialValues={{
          question: poll.question,
          category: poll.category,
          options: poll.options,
          resultsVisibility:
            poll.resultsVisibility,
          closesAt: toDateTimeLocal(
            poll.closesAt
          ),
        }}
        onCancel={() => navigate("/my-polls")}
        onSave={handleSave}
        onPublish={handleSaveAndPublish}
        serverError={serverError}
        submitAction={submitAction}
      />
    </div>
  );
}

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() - offset * 60 * 1000
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}