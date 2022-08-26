import fetch from "node-fetch";
import { getAccessToken } from "../utils/getToken.js";

export const searchLeads = async (query) => {
  const accessToken = await getAccessToken();
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const responseLeads = await fetch(
    `${process.env.AMOCRM_URL}/api/v4/leads?query=${query}`,
    options
  );
  const leads = await responseLeads.json();

  const responseUsers = await fetch(
    `${process.env.AMOCRM_URL}/api/v4/contacts`,
    options
  );
  const users = await responseUsers.json();

  const responsePipelines = await fetch(
    `${process.env.AMOCRM_URL}/api/v4/leads/pipelines`,
    options
  );
  const pipelines = await responsePipelines.json();

  return {
    leads: leads["_embedded"]?.leads,
    users: users,
    pipelines: pipelines["_embedded"]?.pipelines[0],
  };
};
