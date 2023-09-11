import { axios } from "../config/axiosInstance";

const GET_CODE_END_POINT = "/code";

export async function getCode(projectId: string) {
  const { data } = await axios.post(GET_CODE_END_POINT, {
    params: {
      id: projectId,
    },
  });
  return data;
}
