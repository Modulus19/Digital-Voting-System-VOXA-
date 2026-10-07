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
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState(0);

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
          throw new Error(
            "Poll was not returned."
          );
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
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-16 sm:py-24">
        <Loading size="large" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Error
          message={loadError}
          onRetry={() =>
            setRetryCount(
              (count) => count + 1
            )
          }
        />
      </div>
    );
  }

  if (!poll) return null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => {
          if (!isFormDirty) {
            navigate("/my-polls");
            return;
          }

          setLeaveRequest((request) => request + 1);
        }}
        className="
          mb-4 flex items-center gap-1.5
          text-sm font-medium text-blue-600
          transition-all duration-200
          hover:-translate-x-0.5
          hover:text-blue-700
          sm:mb-5
        "
      >
        <Icon
          icon="mdi:arrow-left"
          width={18}
        />

        Back to My Polls
      </button>

      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Edit Poll
        </h1>

        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-600 sm:text-sm">
          Update your poll before publishing it.
        </p>
      </header>

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
        onCancel={() =>
          navigate("/my-polls")
        }
        onSave={handleSave}
        onPublish={
          handleSaveAndPublish
        }
        serverError={serverError}
        submitAction={submitAction}
        onDirtyChange={setIsFormDirty}
        leaveRequest={leaveRequest}
      />
    </div>
  );
}

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset =
    date.getTimezoneOffset();

  const localDate = new Date(
    date.getTime() -
      offset * 60 * 1000
  );

  return localDate
    .toISOString()
    .slice(0, 16);
}