import resolveEndpoint from "@/services/resolveEndpoint";

//contains some relevant user data for config purposes, doesn't include pfpbackground color and stuff atm, can add if needed
export interface ExtendedUser
{
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  //role: string;
  position: string;
  pfp: string;
  isDarkMode: boolean;
}

const API_URL = resolveEndpoint("/api/");



//taking user authentication token, it returns an ExtendedUser with data from the backend
// this data can then be used for i.e. displaying profiles, retrieving names, roles, etc.
export async function loadExtendedProfile(token: string): Promise<ExtendedUser>
{
  try
  {
    const resMe = await fetch(`${API_URL}users/detailed-user-info/`,
    {
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",

      },
    });
    if(!resMe.ok) throw new Error(`HTTP error! status: ${resMe.status}`)
    const me = await resMe.json();
    return {
      id: me.id,
      username: me.username,
      first_name: me.first_name,
      last_name: me.last_name,
      email: me.email,
      //role: role,
      position: me.position,
      pfp: me.profilePicture,
      isDarkMode: me.isDarkMode,
    } as ExtendedUser;


  }
  catch (err)
  {
    console.error("Failed to fetch user: ", err)
    throw err;
  }
}

// takes a variable user payload and modifies the relevant user settings
// i.e. const payload = {isDarkMode: true} would only change it so that the darkMode is on
// i.e. const payload = {first_name: "Gordon", last_name: "Ramsay"} would allow user to change their name
// make sure the payload attributes match the actual fields in the models.py i.e. const payload = {firstname: "Jim"} wouldn't work becasue theres a typo
// refer to app/(tabs)/settings.tsx for a reference example
// updates User model fields (username, first_name, last_name, email) via /api/user/{id}/
export async function patchUser(id: number, token: string, payload: any) {
  const res = await fetch(`${API_URL}user/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function patchUserSettings(id: number, token: string, payload: any) {
  const res = await fetch(`${API_URL}settings/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}


export const defaultExtendedUser: ExtendedUser = {
  id: 0,
  username: 'alexrivera',
  first_name: 'Alex',
  last_name: 'Rivera',
  email: 'alexrivera@gmail.com',
  //role: 'Student',
  position: 'Midfielder',
  //modify the following path to use some placeholder image in the database
  pfp: 'somefile.png',
  isDarkMode: false,
};
