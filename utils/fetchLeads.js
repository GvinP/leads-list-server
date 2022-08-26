import fetch from "node-fetch";
import { getAccessToken } from "../utils/getToken.js";

export const fetchLeads = async (query) => {
  const accessToken = await getAccessToken();
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const responseLeads = await fetch(
    `${process.env.AMOCRM_URL}/api/v4/leads?query=${
      query?.length > 2 ? query : ""
    }`,
    options
  );
  let leads;
  if (responseLeads.status === 200) {
    leads = await responseLeads.json();
  } else {
    leads = {};
  }

  const responseContacts = await fetch(
    `${process.env.AMOCRM_URL}/api/v4/contacts`,
    options
  );
  const contacts = await responseContacts.json();

  const responseUsers = await fetch(
    `${process.env.AMOCRM_URL}/api/v4/users`,
    options
  );
  const users = await responseUsers.json();

  const responsePipelines = await fetch(
    `${process.env.AMOCRM_URL}/api/v4/leads/pipelines`,
    options
  );
  const pipelines = await responsePipelines.json();

  return {
    leads:
      leads["_embedded"]?.leads.map((lead) => {
        const leadContacts = contacts["_embedded"]?.contacts.filter(
          (contact) =>
            contact["_embedded"]?.companies[0]?.id ===
              lead["_embedded"]?.companies[0]?.id &&
            contact["_embedded"]?.companies[0]?.id !== undefined
        );
        if (leadContacts) {
          return { ...lead, contacts: leadContacts };
        } else {
          return lead;
        }
      }) || [],
    users: users["_embedded"]?.users?.map((el) => ({
      id: el.id,
      name: el.name,
    })),
    pipelines: pipelines["_embedded"]?.pipelines[0],
  };
};
