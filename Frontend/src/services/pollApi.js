import api from "./api";

export const createPoll = async (pollData) => {
  const response = await api.post("/polls", pollData);
  return response.data;
};

export const getPolls = async (params = {}) => {
  const response = await api.get("/polls", { params });
  return response.data;
};

export const getPollById = async (pollId) => {
  const response = await api.get(`/polls/${pollId}`);
  return response.data;
};

export const updatePoll = async (pollId, pollData) => {
  const response = await api.patch(`/polls/${pollId}`, pollData);
  return response.data;
};

export const deletePoll = async (pollId) => {
  const response = await api.delete(`/polls/${pollId}`);
  return response.data;
};

export const publishPoll = async (pollId) => {
  const response = await api.patch(`/polls/${pollId}/publish`);
  return response.data;
};

export const closePoll = async (pollId) => {
  const response = await api.patch(`/polls/${pollId}/close`);
  return response.data;
};