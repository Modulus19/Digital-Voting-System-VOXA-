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
    <div className="w-full">
      <button
        type="button"
        onClick={() => navigate("/polls")}
        className="mb-5 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <Icon icon="mdi:arrow-left" />
        Back to Polls
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Create a Poll
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Create a question, add your options, and
          share it with your audience.
        </p>
      </div>

      <PollForm
        mode="create"
        onCancel={() => navigate("/polls")}
        onSave={handleSaveDraft}
        onPublish={handlePublish}
        serverError={serverError}
        submitAction={submitAction}
      />
    </div>
  );
}