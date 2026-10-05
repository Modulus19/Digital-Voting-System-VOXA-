import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import PollForm from "../../components/polls/PollForm";
import {
  createPoll,
  publishPoll,
} from "../../services/pollApi";

export default function CreatePoll() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [submitAction, setSubmitAction] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState(0);

  const handleSaveDraft = async (payload) => {
    try {
      setServerError("");
      setSubmitAction("save");

      await createPoll(payload);

      navigate("/my-polls");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to save your poll. Please try again."
      );
    } finally {
      setSubmitAction(null);
    }
  };

  const handlePublish = async (payload) => {
    try {
      setServerError("");
      setSubmitAction("publish");

      const response = await createPoll(payload);

      const createdPoll =
        response?.data?.poll ||
        response?.data ||
        response?.poll ||
        response;

      if (!createdPoll?.id) {
        throw new Error(
          "Created poll ID was not returned."
        );
      }

      await publishPoll(createdPoll.id);

      navigate("/my-polls");
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          error.message ||
          "Unable to publish your poll. Please try again."
      );
    } finally {
      setSubmitAction(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => {
          if (!isFormDirty) {
            navigate("/polls");
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

        Back to Polls
      </button>

      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Create a Poll
        </h1>

        <p className="mt-1 max-w-xl text-xs leading-5 text-slate-600 sm:text-sm">
          Create a question, add your options,
          and share it with your audience.
        </p>
      </header>

      <PollForm
        mode="create"
        onCancel={() => navigate("/polls")}
        onSave={handleSaveDraft}
        onPublish={handlePublish}
        serverError={serverError}
        submitAction={submitAction}
        onDirtyChange={setIsFormDirty}
        leaveRequest={leaveRequest}
      />
    </div>
  );
}